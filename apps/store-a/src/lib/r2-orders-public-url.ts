/**
 * Public storefront URL for an object key in the orders R2 bucket.
 */
export function publicOrdersUrlFromKey(key: string): string | null {
  const publicBase = process.env.NEXT_PUBLIC_R2_ORDERS_BUCKET_URL?.replace(/\/$/, "");
  if (!publicBase) return null;
  const safeKey = key.replace(/^\/+/, "");
  return `${publicBase}/${safeKey}`;
}
