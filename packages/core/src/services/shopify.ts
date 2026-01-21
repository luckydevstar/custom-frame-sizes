/**
 * Shopify Storefront API Integration Service
 *
 * This service provides a complete scaffold for Shopify integration.
 * When SHOPIFY_STOREFRONT_TOKEN is not configured, it returns mock data.
 *
 * Environment Variables Required:
 * - VITE_SHOPIFY_DOMAIN: Your Shopify store domain (e.g., "your-store.myshopify.com")
 * - VITE_SHOPIFY_STOREFRONT_TOKEN: Storefront API access token
 *
 * Setup Instructions:
 * 1. Create a Storefront API access token in your Shopify admin
 * 2. Add the domain and token to environment variables
 * 3. Restart the application
 */

import type { FrameConfiguration } from "@framecraft/types";
import type { MatConfig } from "@framecraft/types";
import { logApiError, logWarning } from "./logging";
import { getFrameStyleById } from "./products";
import { apiRequest } from "../utils/query-client";

// Environment configuration
const SHOPIFY_DOMAIN = (import.meta as any).env?.VITE_SHOPIFY_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = (import.meta as any).env?.VITE_SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_API_VERSION = "2024-01"; // Update as needed

// Check if Shopify is configured
const isShopifyConfigured = Boolean(SHOPIFY_DOMAIN && SHOPIFY_STOREFRONT_TOKEN);

/**
 * Shopify GraphQL client for Storefront API
 */
class ShopifyClient {
  private token: string;
  private endpoint: string;

  constructor(domain: string, token: string) {
    this.token = token;
    this.endpoint = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;
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

      const data = await response.json();

      if (data.errors) {
        const error = new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        logApiError(error, {
          url: this.endpoint,
          method: "POST",
          status: 200,
        });
        throw error;
      }

      return data.data as T;
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
 */
function getShopifyClient(): ShopifyClient | null {
  if (!isShopifyConfigured) {
    logWarning("Shopify not configured. Using mock data.");
    return null;
  }
  return new ShopifyClient(SHOPIFY_DOMAIN!, SHOPIFY_STOREFRONT_TOKEN!);
}

/**
 * Fetch products from Shopify (or return mock data)
 */
export async function fetchProducts() {
  const client = getShopifyClient();

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
export async function createCheckout(config: FrameConfiguration, lineItems: any[]) {
  const client = getShopifyClient();

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
export async function addToCart(config: FrameConfiguration, _price: number, quantity: number = 1) {
  // Get variant ID from environment or frame-specific mapping
  const defaultVariantId = (import.meta as any).env?.VITE_SHOPIFY_FRAME_VARIANT_ID;

  // Try to get frame-specific variant ID from product data (if configured)
  const frameStyle = getFrameStyleById(config.frameStyleId);
  const variantId = (frameStyle as any)?.shopifyVariantId || defaultVariantId;

  // Validate variant ID is configured in production
  if (isShopifyConfigured && !variantId) {
    throw new Error(
      "Shopify variant ID not configured. Please set VITE_SHOPIFY_FRAME_VARIANT_ID " +
        "environment variable or configure shopifyVariantId in frames.json"
    );
  }

  // Use mock variant ID for development/testing
  const finalVariantId = variantId || "gid://shopify/ProductVariant/mock";

  const lineItems = [
    {
      variantId: finalVariantId,
      quantity: quantity,
    },
  ];

  const checkout = await createCheckout(config, lineItems);

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

    const data = await response.json();
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
 */
export function isShopifyEnabled(): boolean {
  return isShopifyConfigured;
}

/**
 * Get configuration status for debugging
 */
export function getShopifyStatus() {
  const frameVariantId = (import.meta as any).env?.VITE_SHOPIFY_FRAME_VARIANT_ID;

  return {
    configured: isShopifyConfigured,
    domain: SHOPIFY_DOMAIN || "Not configured",
    hasToken: Boolean(SHOPIFY_STOREFRONT_TOKEN),
    hasFrameVariantId: Boolean(frameVariantId),
    apiVersion: SHOPIFY_API_VERSION,
    warnings: [
      ...(!isShopifyConfigured ? ["Shopify credentials not configured - using mock mode"] : []),
      ...(isShopifyConfigured && !frameVariantId
        ? ["Frame variant ID not configured - checkout will fail"]
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
export async function addMatToCart(config: MatConfig, _price: number, quantity: number = 1) {
  // Get variant ID from environment
  const defaultVariantId = (import.meta as any).env?.VITE_SHOPIFY_MAT_VARIANT_ID;

  // Validate variant ID is configured in production
  if (isShopifyConfigured && !defaultVariantId) {
    throw new Error(
      "Shopify variant ID not configured. Please set VITE_SHOPIFY_MAT_VARIANT_ID environment variable"
    );
  }

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

  const client = getShopifyClient();

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
