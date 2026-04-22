import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { publicOrdersUrlFromKey } from "@/lib/r2-orders-public-url";

export const runtime = "nodejs";

const MAX_BYTES = 104857600; // 100 MB
const FETCH_TIMEOUT_MS = 120_000;

function extFromContentType(ct: string): string {
  const base = ct.split(";")[0]?.trim().toLowerCase() || "";
  if (base === "image/jpeg" || base === "image/jpg") return ".jpg";
  if (base === "image/png") return ".png";
  if (base === "image/webp") return ".webp";
  if (base === "image/gif") return ".gif";
  return ".bin";
}

/** Limit SSRF: only ingest from known AI output hosts (e.g. Replicate). */
function isAllowedSourceHostname(hostname: string): boolean {
  return hostname === "replicate.delivery" || hostname.endsWith(".replicate.delivery");
}

function getR2OrdersConfig():
  | { ok: true; client: S3Client; bucket: string }
  | { ok: false; response: NextResponse } {
  const endpoint = process.env.R2_ORDERS_ENDPOINT;
  const accessKeyId = process.env.R2_ORDERS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_ORDERS_SECRET_ACCESS_KEY;
  const bucket =
    process.env.R2_ORDERS_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET_NAME;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "R2 orders upload is not configured. Set R2_ORDERS_ENDPOINT, R2_ORDERS_ACCESS_KEY_ID, R2_ORDERS_SECRET_ACCESS_KEY, and R2_ORDERS_BUCKET_NAME (or CLOUDFLARE_R2_BUCKET_NAME).",
        },
        { status: 503 },
      ),
    };
  }

  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  return { ok: true, client, bucket };
}

/**
 * POST JSON { sourceUrl: string }
 * Fetches an image (e.g. Replicate output), stores in orders R2, returns { objectPath }.
 */
export async function POST(req: Request) {
  let body: { sourceUrl?: string };
  try {
    body = (await req.json()) as { sourceUrl?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sourceUrl = body.sourceUrl;
  if (!sourceUrl || typeof sourceUrl !== "string") {
    return NextResponse.json({ error: "sourceUrl is required" }, { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(sourceUrl);
  } catch {
    return NextResponse.json({ error: "Invalid sourceUrl" }, { status: 400 });
  }

  if (url.protocol !== "https:") {
    return NextResponse.json({ error: "Only https URLs are allowed" }, { status: 400 });
  }

  const publicBase = process.env.NEXT_PUBLIC_R2_ORDERS_BUCKET_URL?.replace(/\/$/, "") ?? "";
  if (publicBase && sourceUrl.startsWith(publicBase)) {
    return NextResponse.json({ objectPath: sourceUrl.split("?")[0] });
  }

  if (!isAllowedSourceHostname(url.hostname)) {
    return NextResponse.json(
      { error: "Source hostname is not allowed for server-side ingest." },
      { status: 403 },
    );
  }

  const r2 = getR2OrdersConfig();
  if (!r2.ok) return r2.response;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(sourceUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { Accept: "image/*,*/*;q=0.8" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Fetch failed";
    console.error("[upload-from-url] fetch error:", e);
    return NextResponse.json({ error: `Could not download image: ${msg}` }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Image URL returned ${upstream.status}` },
      { status: 502 },
    );
  }

  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json(
      { error: "URL did not return an image (Content-Type must be image/*)." },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await upstream.arrayBuffer());
  if (buf.length === 0) {
    return NextResponse.json({ error: "Empty image body" }, { status: 400 });
  }
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: "Downloaded image exceeds size limit." }, { status: 413 });
  }

  const ext = extFromContentType(contentType);
  const key = `orders/${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;

  try {
    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
        Key: key,
        Body: buf,
        ContentType: contentType.split(";")[0]?.trim() || "image/png",
      }),
    );
  } catch (e) {
    console.error("[upload-from-url] PutObject failed:", e);
    return NextResponse.json({ error: "Storage upload failed." }, { status: 502 });
  }

  const objectPath = publicOrdersUrlFromKey(key);
  if (!objectPath) {
    return NextResponse.json(
      {
        error:
          "NEXT_PUBLIC_R2_ORDERS_BUCKET_URL is not set; cannot build a public URL for the uploaded image.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ objectPath });
}
