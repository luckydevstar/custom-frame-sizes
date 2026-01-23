/**
 * Shopify Storefront API Integration Service
 *
 * This service provides a complete scaffold for Shopify integration.
 * When SHOPIFY_STOREFRONT_TOKEN is not configured, it returns mock data.
 *
 * Configuration Sources (in order of priority):
 * 1. ShopifyConfig passed as parameter (from store context)
 * 2. Environment variables (NEXT_PUBLIC_SHOPIFY_* for Next.js, VITE_SHOPIFY_* for Vite)
 * 3. Mock mode (if nothing configured)
 *
 * Setup Instructions:
 * 1. Create a Storefront API access token in your Shopify admin
 * 2. Add the domain and token to environment variables or store config
 * 3. Restart the application
 */

import type { FrameConfiguration } from "@framecraft/types";
import type { MatConfig } from "@framecraft/types";
import type { ShopifyConfig } from "@framecraft/config";
import { logApiError, logWarning } from "./logging";
import { getFrameStyleById } from "./products";
import { apiRequest } from "../utils/query-client";

// Default API version
const DEFAULT_API_VERSION = "2024-01";

/**
 * Get Shopify configuration from multiple sources
 * Priority: 1. Config parameter, 2. Environment variables, 3. null (mock mode)
 */
function getShopifyConfig(config?: ShopifyConfig): {
  domain: string | null;
  token: string | null;
  apiVersion: string;
} {
  // Priority 1: Use config parameter if provided
  if (config?.domain && config?.storefrontAccessToken) {
    return {
      domain: config.domain,
      token: config.storefrontAccessToken,
      apiVersion: config.apiVersion || DEFAULT_API_VERSION,
    };
  }

  // Priority 2: Try environment variables
  // Support both Next.js (process.env) and Vite (import.meta.env)
  let domain: string | undefined;
  let token: string | undefined;
  let apiVersion: string = DEFAULT_API_VERSION;

  if (typeof window !== "undefined") {
    // Browser environment - use window or process.env
    domain =
      (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) ||
      (import.meta as any)?.env?.VITE_SHOPIFY_DOMAIN;

    token =
      (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
      (typeof process !== "undefined" &&
        process.env?.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) ||
      (import.meta as any)?.env?.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    apiVersion =
      (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SHOPIFY_API_VERSION ||
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SHOPIFY_API_VERSION) ||
      (import.meta as any)?.env?.VITE_SHOPIFY_API_VERSION ||
      DEFAULT_API_VERSION;
  } else {
    // Server environment - use process.env
    domain =
      process.env?.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
      (import.meta as any)?.env?.VITE_SHOPIFY_DOMAIN;
    token =
      process.env?.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
      (import.meta as any)?.env?.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    apiVersion =
      process.env?.NEXT_PUBLIC_SHOPIFY_API_VERSION ||
      (import.meta as any)?.env?.VITE_SHOPIFY_API_VERSION ||
      DEFAULT_API_VERSION;
  }

  return {
    domain: domain || null,
    token: token || null,
    apiVersion,
  };
}

/**
 * Check if Shopify is configured
 */
function isShopifyConfigured(config?: ShopifyConfig): boolean {
  const shopifyConfig = getShopifyConfig(config);
  return Boolean(shopifyConfig.domain && shopifyConfig.token);
}

/**
 * Shopify GraphQL client for Storefront API
 */
class ShopifyClient {
  private token: string;
  private endpoint: string;

  constructor(domain: string, token: string, apiVersion: string = DEFAULT_API_VERSION) {
    this.token = token;
    // apiVersion is used in endpoint construction
    this.endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;
  }

  /**
   * Execute a GraphQL query against Shopify Storefront API
   */
  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": this.token,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        const error = new Error(`Shopify API error: ${response.status} ${response.statusText}`);
        logApiError(error, {
          url: this.endpoint,
          method: "POST",
          status: response.status,
        });
        throw error;
      }

      const data = (await response.json()) as { errors?: unknown[]; data?: T };

      if (data.errors) {
        const error = new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        logApiError(error, {
          url: this.endpoint,
          method: "POST",
          status: 200,
        });
        throw error;
      }

      if (!data.data) {
        throw new Error("No data returned from GraphQL query");
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        logApiError(error, {
          url: this.endpoint,
          method: "POST",
        });
      }
      throw error;
    }
  }
}

/**
 * Get Shopify client instance (or null if not configured)
 * @param config - Optional ShopifyConfig from store context
 */
function getShopifyClient(config?: ShopifyConfig): ShopifyClient | null {
  if (!isShopifyConfigured(config)) {
    logWarning("Shopify not configured. Using mock data.");
    return null;
  }

  const shopifyConfig = getShopifyConfig(config);
  return new ShopifyClient(shopifyConfig.domain!, shopifyConfig.token!, shopifyConfig.apiVersion);
}

/**
 * Fetch products from Shopify (or return mock data)
 * @param config - Optional ShopifyConfig from store context
 */
export async function fetchProducts(config?: ShopifyConfig) {
  const client = getShopifyClient(config);

  if (!client) {
    // Return mock product data when Shopify is not configured
    return {
      products: [],
      message: "Shopify not configured - using local product data",
    };
  }

  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await client.query<any>(query, { first: 50 });
  return data.products;
}

/**
 * Create a checkout session with custom frame configuration
 * Serializes frame configuration as line item attributes
 */
export async function createCheckout(
  config: FrameConfiguration,
  lineItems: any[],
  shopifyConfig?: ShopifyConfig
) {
  const client = getShopifyClient(shopifyConfig);

  // Serialize frame configuration to line item attributes
  const frameAttributes = serializeFrameConfiguration(config);

  if (!client) {
    // Mock checkout creation - return mock checkout URL
    const mockCheckout = {
      checkoutUrl: "#mock-checkout",
      id: "mock-checkout-id",
      lineItems,
      attributes: frameAttributes,
    };

    return mockCheckout;
  }

  const mutation = `
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const input = {
    lineItems: lineItems.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
      customAttributes: frameAttributes,
    })),
  };

  const data = await client.query<any>(mutation, { input });

  if (data.checkoutCreate.checkoutUserErrors.length > 0) {
    throw new Error(
      `Checkout creation failed: ${JSON.stringify(data.checkoutCreate.checkoutUserErrors)}`
    );
  }

  return {
    checkoutUrl: data.checkoutCreate.checkout.webUrl,
    id: data.checkoutCreate.checkout.id,
  };
}

/**
 * Serialize frame configuration to Shopify custom attributes
 * These attributes will be attached to line items in the checkout
 */
function serializeFrameConfiguration(
  config: FrameConfiguration
): Array<{ key: string; value: string }> {
  return [
    { key: "Service Type", value: config.serviceType },
    { key: "Artwork Width", value: `${config.artworkWidth}"` },
    { key: "Artwork Height", value: `${config.artworkHeight}"` },
    { key: "Frame Style", value: config.frameStyleId },
    { key: "Mat Type", value: config.matType },
    { key: "Mat Border Width", value: `${config.matBorderWidth}"` },
    ...(config.matType === "double"
      ? [{ key: "Mat Reveal", value: `${config.matRevealWidth}"` }]
      : []),
    { key: "Mat Color", value: config.matColorId },
    ...(config.matInnerColorId ? [{ key: "Mat Inner Color", value: config.matInnerColorId }] : []),
    { key: "Glass Type", value: config.glassTypeId },
    ...(config.imageUrl ? [{ key: "Customer Image", value: config.imageUrl }] : []),
    ...(config.orderSource ? [{ key: "Order Source", value: config.orderSource }] : []),
    { key: "Configuration JSON", value: JSON.stringify(config) }, // Full config as JSON for reference
  ];
}

/**
 * Add custom product to cart with frame configuration
 *
 * IMPORTANT: You must configure a Shopify product variant ID for frames.
 * There are two ways to do this:
 *
 * 1. Set a single variant ID for all frames (simple approach):
 *    - Create a "Custom Picture Frame" product in Shopify
 *    - Set VITE_SHOPIFY_FRAME_VARIANT_ID environment variable
 *
 * 2. Map individual frame styles to variants (advanced approach):
 *    - Create separate products for each frame style
 *    - Update shopifyVariantId in data/frames.json
 *
 * @throws Error if variant ID is not configured in production mode
 */
export async function addToCart(
  config: FrameConfiguration,
  _price: number,
  quantity: number = 1,
  shopifyConfig?: ShopifyConfig
) {
  // Get variant ID from environment or frame-specific mapping
  // Support both Next.js and Vite environment variables
  const defaultVariantId =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID) ||
    (import.meta as any)?.env?.VITE_SHOPIFY_FRAME_VARIANT_ID ||
    null;

  // Try to get frame-specific variant ID from product data (if configured)
  const frameStyle = getFrameStyleById(config.frameStyleId);
  const variantId = (frameStyle as any)?.shopifyVariantId || defaultVariantId;

  // Validate variant ID is configured in production
  // Note: We check if Shopify is configured, but don't require variant ID in mock mode
  // The variant ID will be mocked if not provided

  // Use mock variant ID for development/testing
  const finalVariantId = variantId || "gid://shopify/ProductVariant/mock";

  const lineItems = [
    {
      variantId: finalVariantId,
      quantity: quantity,
    },
  ];

  const checkout = await createCheckout(config, lineItems, shopifyConfig);

  // Redirect to checkout (only for real Shopify checkout)
  if (checkout.checkoutUrl !== "#mock-checkout") {
    window.location.href = checkout.checkoutUrl;
  }

  return checkout;
}

/**
 * Store production files for an order
 *
 * @param shopifyOrderId - The Shopify order ID (can be checkout ID initially)
 * @param files - Array of file data to store
 */
export async function storeOrderFiles(
  shopifyOrderId: string,
  files: Array<{
    fileType: string;
    fileUrl: string;
    fileName: string;
    metadata?: any;
  }>
) {
  try {
    // Store each file in the database using the shared API helper
    const promises = files.map((file) =>
      apiRequest("POST", "/api/order-files", {
        shopifyOrderId,
        fileType: file.fileType,
        fileUrl: file.fileUrl,
        fileName: file.fileName,
        metadata: file.metadata,
      })
    );

    const results = await Promise.all(promises);

    return {
      success: true,
      stored: results.length,
    };
  } catch (error) {
    console.error("Error storing order files:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Retrieve production files for an order
 *
 * @param shopifyOrderId - The Shopify order ID to retrieve files for
 */
export async function getOrderFiles(shopifyOrderId: string) {
  try {
    const response = await fetch(`/api/order-files/${encodeURIComponent(shopifyOrderId)}`);

    if (!response.ok) {
      throw new Error("Failed to retrieve order files");
    }

    const data = (await response.json()) as { orderFiles?: unknown[] };
    return {
      success: true,
      files: data.orderFiles || [],
    };
  } catch (error) {
    console.error("Error retrieving order files:", error);
    return {
      success: false,
      files: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if Shopify is properly configured
 * @param config - Optional ShopifyConfig from store context
 */
export function isShopifyEnabled(config?: ShopifyConfig): boolean {
  return isShopifyConfigured(config);
}

/**
 * Get configuration status for debugging
 * @param config - Optional ShopifyConfig from store context
 */
export function getShopifyStatus(config?: ShopifyConfig) {
  const shopifyConfig = getShopifyConfig(config);
  // Try to get variant ID from environment (support both Next.js and Vite)
  const frameVariantId =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID) ||
    (import.meta as any)?.env?.VITE_SHOPIFY_FRAME_VARIANT_ID ||
    null;

  const configured = isShopifyConfigured(config);

  return {
    configured,
    domain: shopifyConfig.domain || "Not configured",
    hasToken: Boolean(shopifyConfig.token),
    hasFrameVariantId: Boolean(frameVariantId),
    apiVersion: shopifyConfig.apiVersion,
    warnings: [
      ...(!configured ? ["Shopify credentials not configured - using mock mode"] : []),
      ...(configured && !frameVariantId
        ? ["Frame variant ID not configured - checkout will use mock variant"]
        : []),
    ],
  };
}

/**
 * Serialize mat configuration to Shopify custom attributes
 * These attributes will be attached to line items in the checkout
 */
function serializeMatConfiguration(config: MatConfig): Array<{ key: string; value: string }> {
  return [
    { key: "Product Type", value: "Custom Mat Board" },
    { key: "Overall Width", value: `${config.overallWIn}"` },
    { key: "Overall Height", value: `${config.overallHIn}"` },
    { key: "Mat Type", value: config.singleOrDouble },
    { key: "Top Mat Color", value: config.topMat.color },
    ...(config.bottomMat ? [{ key: "Bottom Mat Color", value: config.bottomMat.color }] : []),
    { key: "Number of Openings", value: String(config.topMat.openings.length) },
    { key: "Standard Overlap", value: config.standardOverlap ? "Yes" : "No" },
    ...(config.isOversize ? [{ key: "Oversize", value: "Yes" }] : []),
    { key: "Configuration JSON", value: JSON.stringify(config) }, // Full config as JSON for reference
  ];
}

/**
 * Add custom mat board to cart with configuration
 *
 * IMPORTANT: You must configure a Shopify product variant ID for mat boards.
 * Set VITE_SHOPIFY_MAT_VARIANT_ID environment variable.
 *
 * @throws Error if variant ID is not configured in production mode
 */
export async function addMatToCart(
  config: MatConfig,
  _price: number,
  quantity: number = 1,
  shopifyConfig?: ShopifyConfig
) {
  // Get variant ID from environment
  // Support both Next.js and Vite environment variables
  const defaultVariantId =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SHOPIFY_MAT_VARIANT_ID) ||
    (import.meta as any)?.env?.VITE_SHOPIFY_MAT_VARIANT_ID ||
    null;

  // Validate variant ID is configured in production
  // Note: We check if Shopify is configured, but don't require variant ID in mock mode
  // The variant ID will be mocked if not provided

  // Use mock variant ID for development/testing
  const finalVariantId = defaultVariantId || "gid://shopify/ProductVariant/mock-mat";

  const lineItems = [
    {
      variantId: finalVariantId,
      quantity: quantity,
    },
  ];

  // Create a minimal "configuration" that matches the structure expected by createCheckout
  // We'll override the attributes with mat-specific ones
  const matAttributes = serializeMatConfiguration(config);

  const client = getShopifyClient(shopifyConfig);

  if (!client) {
    // Mock checkout creation - return mock checkout URL
    const mockCheckout = {
      checkoutUrl: "#mock-checkout",
      id: "mock-checkout-id",
      lineItems,
      attributes: matAttributes,
    };

    return mockCheckout;
  }

  const mutation = `
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const input = {
    lineItems: lineItems.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
      customAttributes: matAttributes,
    })),
  };

  const data = await client.query<any>(mutation, { input });

  if (data.checkoutCreate.checkoutUserErrors.length > 0) {
    throw new Error(
      `Checkout creation failed: ${JSON.stringify(data.checkoutCreate.checkoutUserErrors)}`
    );
  }

  const checkout = {
    checkoutUrl: data.checkoutCreate.checkout.webUrl,
    id: data.checkoutCreate.checkout.id,
  };

  // Redirect to checkout (only for real Shopify checkout)
  if (checkout.checkoutUrl !== "#mock-checkout") {
    window.location.href = checkout.checkoutUrl;
  }

  return checkout;
}
