import { apiRequest } from "./query-client";

/**
 * True if the URL is already on the storefront orders CDN (no re-upload needed).
 */
export function isOrdersPublicImageUrl(url: string): boolean {
  if (!url) return false;
  const base =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_R2_ORDERS_BUCKET_URL : undefined;
  if (!base) return false;
  const normalized = base.replace(/\/$/, "");
  const u = url.split("?")[0] ?? url;
  return u.startsWith(normalized);
}

/**
 * After AI upscaling, Replicate returns a short-lived delivery URL.
 * Copy that image into the orders R2 bucket via same-origin API and return the stable public URL.
 */
export async function ingestRemoteOrdersImageIfNeeded(sourceUrl: string): Promise<string> {
  const clean = sourceUrl.split("?")[0] ?? sourceUrl;
  if (isOrdersPublicImageUrl(clean)) {
    return clean;
  }

  const res = await apiRequest("POST", "/api/objects/upload-from-url", { sourceUrl: clean });
  const data = (await res.json()) as { objectPath?: string; error?: string };
  if (!data.objectPath) {
    throw new Error(data.error || "No objectPath from upload-from-url");
  }
  return data.objectPath;
}
