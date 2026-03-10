/**
 * Store configuration bootstrap for serverless API
 *
 * Registers Shopify store config from environment variables so that
 * @framecraft/core storefront client can resolve storeId to credentials.
 * Call ensureStoreConfig(storeId) at the start of any route that needs Shopify.
 */

import { registerStoreConfig, setDefaultStoreConfig, storeConfigRegistry } from "@framecraft/core";

const API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01";

/**
 * Normalize storeId for env var keys (e.g. "store-a" -> "store_a")
 */
function envKeySuffix(storeId: string): string {
  return storeId.replace(/-/g, "_");
}

/**
 * Get store config from environment variables.
 * Supports:
 * - Per-store: SHOPIFY_STORE_DOMAIN_store_a, SHOPIFY_STOREFRONT_TOKEN_store_a
 * - Default: SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN (used when storeId not in env)
 */
function getConfigFromEnv(storeId: string): { domain: string; accessToken: string } | null {
  const suffix = envKeySuffix(storeId);
  const domain = process.env[`SHOPIFY_STORE_DOMAIN_${suffix}`] ?? process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken =
    process.env[`SHOPIFY_STOREFRONT_TOKEN_${suffix}`] ?? process.env.SHOPIFY_STOREFRONT_TOKEN;

  if (domain && accessToken) {
    return { domain: domain.trim(), accessToken: accessToken.trim() };
  }
  return null;
}

/**
 * Ensure the given storeId is registered in the core store config registry.
 * Call this at the start of cart/checkout handlers so createCart/getCart work.
 */
export function ensureStoreConfig(storeId: string): void {
  if (storeConfigRegistry.hasStoreConfig(storeId)) {
    return;
  }

  const fromEnv = getConfigFromEnv(storeId);
  if (!fromEnv) {
    throw new Error(
      `Shopify config not found for store "${storeId}". Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN (or SHOPIFY_STORE_DOMAIN_${envKeySuffix(storeId)} and SHOPIFY_STOREFRONT_TOKEN_${envKeySuffix(storeId)}) in Vercel environment.`
    );
  }

  registerStoreConfig({
    storeId,
    domain: fromEnv.domain,
    accessToken: fromEnv.accessToken,
    apiVersion: API_VERSION,
  });
}

/**
 * Register default store from env (optional).
 * Call once at app init if you have a single store; otherwise ensureStoreConfig(storeId) per request is enough.
 */
export function registerDefaultStoreFromEnv(defaultStoreId: string = "store-a"): void {
  const fromEnv = getConfigFromEnv(defaultStoreId);
  if (fromEnv) {
    setDefaultStoreConfig({
      storeId: defaultStoreId,
      domain: fromEnv.domain,
      accessToken: fromEnv.accessToken,
      apiVersion: API_VERSION,
    });
  }
}
