/**
 * Shopify Admin API access token resolution (server-only).
 *
 * 1) If SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET + SHOPIFY_STORE_DOMAIN are set:
 *    POST /admin/oauth/access_token with grant_type=client_credentials.
 *    Token is cached in memory until shortly before expires_in (default ~24h).
 * 2) Else if SHOPIFY_ADMIN_ACCESS_TOKEN is set: use that static token (no rotation).
 *
 * Never expose client secret or tokens to the client.
 */

const EXPIRY_BUFFER_MS = 5 * 60 * 1000;

type TokenCache = { token: string; expiresAt: number };

let cache: TokenCache | null = null;
let inflight: Promise<string> | null = null;

/** True when the store can resolve an Admin token (OAuth or static). */
export function isShopifyAdminConfigured(): boolean {
  if (!process.env.SHOPIFY_STORE_DOMAIN?.trim()) return false;
  const hasOAuth =
    Boolean(process.env.SHOPIFY_CLIENT_ID?.trim()) &&
    Boolean(process.env.SHOPIFY_CLIENT_SECRET?.trim());
  if (hasOAuth) return true;
  return Boolean(process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim());
}

/**
 * Returns Admin API access token, or null if the store is not configured.
 * Throws if OAuth is configured but the token request fails.
 */
export async function getShopifyAdminAccessToken(): Promise<string | null> {
  const shop = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  if (!shop) return null;

  const clientId = process.env.SHOPIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET?.trim();
  const staticToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();

  if (clientId && clientSecret) {
    return getTokenViaClientCredentials(shop, clientId, clientSecret);
  }

  return staticToken ?? null;
}

async function getTokenViaClientCredentials(
  shop: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const now = Date.now();
  if (cache && now < cache.expiresAt) {
    return cache.token;
  }
  if (inflight) {
    return inflight;
  }

  inflight = fetchClientCredentialsToken(shop, clientId, clientSecret).finally(() => {
    inflight = null;
  });

  return inflight;
}

async function fetchClientCredentialsToken(
  shop: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const url = `https://${shop}/admin/oauth/access_token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify OAuth token: ${res.status} ${text.slice(0, 300)}`);
  }

  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!json.access_token || typeof json.access_token !== "string") {
    throw new Error("Shopify OAuth token: missing access_token in response");
  }

  const expiresInSec = typeof json.expires_in === "number" ? json.expires_in : 86_400;
  const expiresAt = Date.now() + Math.max(expiresInSec * 1000 - EXPIRY_BUFFER_MS, 60_000);

  cache = { token: json.access_token, expiresAt };
  return json.access_token;
}

/** For tests or forced refresh after credential rotation. */
export function clearShopifyAdminTokenCache(): void {
  cache = null;
}

/** Shop + token + API version for REST/GraphQL Admin calls. Null if not configured. */
export async function resolveShopifyAdminRequestConfig(): Promise<{
  shop: string;
  token: string;
  version: string;
} | null> {
  const shop = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  if (!shop) return null;
  const token = await getShopifyAdminAccessToken();
  if (!token) return null;
  return {
    shop,
    token,
    version: process.env.SHOPIFY_API_VERSION ?? "2024-01",
  };
}
