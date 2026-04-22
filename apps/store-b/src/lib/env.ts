/**
 * Environment variable validation and access
 * Ensures all required environment variables are present
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] ?? defaultValue;
}

// Public (client-side) environment variables
export const env = {
  // Site Configuration
  siteId: getEnvVar("NEXT_PUBLIC_SITE_ID", "store-b"),

  // Shopify Storefront API (optional - will use mock mode if not configured)
  shopify: {
    storeDomain: getOptionalEnvVar("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN"),
    storefrontAccessToken: getOptionalEnvVar("NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN"),
    apiVersion: getOptionalEnvVar("NEXT_PUBLIC_SHOPIFY_API_VERSION", "2024-01"),
  },

  // API Endpoints (FrameCraft API origin only; client code appends /api/...)
  apiUrl: getEnvVar("NEXT_PUBLIC_API_URL", "https://dev-api.shadowboxframes.com"),

  /**
   * Public browser origin for this deployment (no trailing slash), e.g. https://dev.shadowboxframes.com
   * Used in brand.config checkout URLs so logo/home links are absolute HTTPS on Shopify checkout.
   */
  siteOrigin: getOptionalEnvVar("NEXT_PUBLIC_SITE_ORIGIN"),

  // Sentry (optional)
  sentry: {
    dsn: getOptionalEnvVar("NEXT_PUBLIC_SENTRY_DSN"),
    environment: getOptionalEnvVar("NEXT_PUBLIC_SENTRY_ENVIRONMENT", "development"),
    release: getOptionalEnvVar("NEXT_PUBLIC_SENTRY_RELEASE"),
  },

  // Node Environment
  nodeEnv: getEnvVar("NODE_ENV", "development"),
} as const;

// Server-side only environment variables
export const serverEnv = {
  siteId: getEnvVar("SITE_ID", "store-b"),

  // Shopify Admin API
  shopify: {
    apiKey: getOptionalEnvVar("SHOPIFY_API_KEY"),
    apiSecretKey: getOptionalEnvVar("SHOPIFY_API_SECRET_KEY"),
    adminApiAccessToken: getOptionalEnvVar("SHOPIFY_ADMIN_API_ACCESS_TOKEN"),
  },

  // Sentry Server
  sentry: {
    dsn: getOptionalEnvVar("SENTRY_DSN"),
    environment: getOptionalEnvVar("SENTRY_ENVIRONMENT", "development"),
    release: getOptionalEnvVar("SENTRY_RELEASE"),
  },
} as const;
