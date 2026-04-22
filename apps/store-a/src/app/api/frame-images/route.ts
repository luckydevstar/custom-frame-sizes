import { NextResponse } from "next/server";

import { publicOrdersUrlFromKey } from "@/lib/r2-orders-public-url";

export const runtime = "nodejs";

/**
 * Map a presigned R2 URL (or raw R2 URL) to the public CDN URL used in <img> and checkout.
 */
function toPublicObjectPath(imageURL: string): string {
  const noQuery = imageURL.split("?")[0] ?? imageURL;
  const publicBase = process.env.NEXT_PUBLIC_R2_ORDERS_BUCKET_URL?.replace(/\/$/, "");
  const bucket =
    process.env.R2_ORDERS_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET_NAME || "";

  try {
    const url = new URL(imageURL);
    const isR2 = url.hostname.endsWith(".r2.cloudflarestorage.com");
    if (isR2 && bucket) {
      const segments = url.pathname.split("/").filter(Boolean);
      const key =
        segments[0] === bucket ? segments.slice(1).join("/") : segments.join("/");
      if (key) {
        const fromHelper = publicOrdersUrlFromKey(key);
        if (fromHelper) return fromHelper;
        if (publicBase) return `${publicBase}/${key}`;
      }
    }
  } catch {
    return imageURL;
  }

  return noQuery;
}

export async function PUT(req: Request) {
  let body: { imageURL?: string };
  try {
    body = (await req.json()) as { imageURL?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const imageURL = body.imageURL;
  if (!imageURL || typeof imageURL !== "string") {
    return NextResponse.json({ error: "imageURL is required" }, { status: 400 });
  }

  const objectPath = toPublicObjectPath(imageURL);
  return NextResponse.json({ objectPath });
}
