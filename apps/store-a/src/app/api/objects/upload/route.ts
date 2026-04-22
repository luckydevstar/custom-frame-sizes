import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { publicOrdersUrlFromKey } from "@/lib/r2-orders-public-url";

export const runtime = "nodejs";

/** Browser → Next.js multipart upload (avoids R2 CORS on presigned PUT). */
const MAX_UPLOAD_BYTES = 104857600; // 100 MB

function sanitizeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  return base || "upload";
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
 * Same-origin upload: multipart/form-data with field `file`.
 * Server performs PutObject — no browser CORS to r2.cloudflarestorage.com.
 */
async function handleMultipartUpload(req: Request): Promise<NextResponse> {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
  }

  const entry = formData.get("file");
  if (!entry || !(entry instanceof File)) {
    return NextResponse.json(
      { error: "Expected multipart field \"file\" (image)." },
      { status: 400 },
    );
  }

  if (!entry.type.startsWith("image/")) {
    return NextResponse.json({ error: "file must be an image" }, { status: 400 });
  }

  if (entry.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File too large (max 100 MB)." }, { status: 413 });
  }

  const r2 = getR2OrdersConfig();
  if (!r2.ok) return r2.response;

  const fileName = sanitizeFileName(entry.name || "upload.jpg");
  const ext = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "";
  const safeExt = ext.length <= 8 ? ext : "";
  const key = `orders/${Date.now()}-${randomBytes(8).toString("hex")}${safeExt || ".jpg"}`;

  const buffer = Buffer.from(await entry.arrayBuffer());

  try {
    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
        Key: key,
        Body: buffer,
        ContentType: entry.type || "image/jpeg",
      }),
    );
  } catch (e) {
    console.error("[api/objects/upload] PutObject failed:", e);
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

  return NextResponse.json({ objectPath, key });
}

/**
 * JSON body: return a presigned PUT URL (for server-side or tools that already have R2 CORS).
 */
async function handlePresignRequest(req: Request): Promise<NextResponse> {
  let fileName = "upload.jpg";
  let contentType = "image/jpeg";

  try {
    const body = (await req.json()) as { fileName?: string; contentType?: string };
    if (typeof body.fileName === "string" && body.fileName.length > 0) {
      fileName = sanitizeFileName(body.fileName);
    }
    if (typeof body.contentType === "string" && body.contentType.startsWith("image/")) {
      contentType = body.contentType;
    }
  } catch {
    /* empty body is ok */
  }

  const r2 = getR2OrdersConfig();
  if (!r2.ok) return r2.response;

  const ext = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "";
  const safeExt = ext.length <= 8 ? ext : "";
  const key = `orders/${Date.now()}-${randomBytes(8).toString("hex")}${safeExt || ".jpg"}`;

  const command = new PutObjectCommand({
    Bucket: r2.bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadURL = await getSignedUrl(r2.client, command, { expiresIn: 3600 });

  return NextResponse.json({ uploadURL });
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    return handleMultipartUpload(req);
  }
  return handlePresignRequest(req);
}
