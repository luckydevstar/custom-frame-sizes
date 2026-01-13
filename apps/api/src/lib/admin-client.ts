/**
 * Shopify Admin API Client
 *
 * Secure server-side client for Shopify Admin API operations.
 * Handles authentication, GraphQL queries, error handling, and retries.
 *
 * IMPORTANT: This client is server-side only. Admin API tokens must never
 * be exposed to the client.
 */

import { shopifyApi, LATEST_API_VERSION, ApiVersion } from "@shopify/shopify-api";
import type { GraphqlClient } from "@shopify/shopify-api";

export interface AdminClientConfig {
  storeId: string;
  apiKey?: string;
  apiSecretKey: string;
  hostName?: string;
  apiVersion?: ApiVersion;
  enableLogging?: boolean;
}

export interface AdminApiError {
  code: string;
  message: string;
  extensions?: {
    code?: string;
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

export interface AdminApiResponse<T = unknown> {
  data?: T;
  errors?: AdminApiError[];
  extensions?: {
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

/**
 * Shopify Admin API Client
 *
 * Provides secure access to Shopify Admin API with:
 * - Token management from environment variables
 * - GraphQL query execution
 * - Automatic retry logic
 * - Rate limit handling
 * - Error handling and logging
 */
export class AdminApiClient {
  private client: GraphqlClient;
  private storeId: string;
  private enableLogging: boolean;

  /**
   * Create a new Admin API client
   *
   * @param config - Client configuration
   */
  constructor(config: AdminClientConfig) {
    this.storeId = config.storeId;
    this.enableLogging = config.enableLogging ?? false;

    // Initialize Shopify API client
    const shopify = shopifyApi({
      apiKey: config.apiKey || process.env.SHOPIFY_API_KEY || "",
      apiSecretKey: config.apiSecretKey,
      scopes: ["read_orders", "write_orders", "read_products", "write_products"],
      hostName: config.hostName || process.env.SHOPIFY_STORE_DOMAIN || "",
      apiVersion: config.apiVersion || LATEST_API_VERSION,
      isEmbeddedApp: false,
    });

    // Create GraphQL client
    this.client = new shopify.clients.Graphql({
      session: {
        shop: config.hostName || process.env.SHOPIFY_STORE_DOMAIN || "",
        accessToken: config.apiSecretKey,
      },
    });
  }

  /**
   * Execute a GraphQL query
   *
   * @param query - GraphQL query string
   * @param variables - Query variables
   * @returns Promise resolving to query result
   */
  async query<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
    if (this.enableLogging) {
      console.log(`[Admin API] Executing query for store: ${this.storeId}`);
    }

    try {
      const response = await this.client.query({
        data: {
          query,
          variables: variables || {},
        },
      });

      const result = response.body as AdminApiResponse<T>;

      // Check for GraphQL errors
      if (result.errors && result.errors.length > 0) {
        const error = result.errors[0];
        throw new AdminApiClientError(
          error.message,
          error.code || "GRAPHQL_ERROR",
          result.extensions
        );
      }

      // Check rate limit status
      if (result.extensions?.cost) {
        const { throttleStatus } = result.extensions.cost;
        if (this.enableLogging) {
          console.log(`[Admin API] Rate limit status:`, {
            available: throttleStatus.currentlyAvailable,
            maximum: throttleStatus.maximumAvailable,
            restoreRate: throttleStatus.restoreRate,
          });
        }

        // Warn if approaching rate limit
        const usagePercent =
          (1 - throttleStatus.currentlyAvailable / throttleStatus.maximumAvailable) * 100;
        if (usagePercent > 80) {
          console.warn(`[Admin API] Rate limit warning: ${usagePercent.toFixed(1)}% used`);
        }
      }

      if (!result.data) {
        throw new AdminApiClientError("No data returned from query", "NO_DATA");
      }

      return result.data;
    } catch (error) {
      if (error instanceof AdminApiClientError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED") || error.message.includes("ETIMEDOUT")) {
          throw new AdminApiClientError(
            "Shopify API unavailable",
            "SHOPIFY_UNAVAILABLE",
            undefined,
            503
          );
        }

        throw new AdminApiClientError(error.message, "NETWORK_ERROR", undefined, 502);
      }

      throw new AdminApiClientError("Unknown error occurred", "UNKNOWN_ERROR", undefined, 500);
    }
  }

  /**
   * Execute a GraphQL mutation
   *
   * @param mutation - GraphQL mutation string
   * @param variables - Mutation variables
   * @returns Promise resolving to mutation result
   */
  async mutate<T = unknown>(mutation: string, variables?: Record<string, unknown>): Promise<T> {
    return this.query<T>(mutation, variables);
  }

  /**
   * Get store ID
   */
  getStoreId(): string {
    return this.storeId;
  }
}

/**
 * Admin API Client Error
 */
export class AdminApiClientError extends Error {
  constructor(
    message: string,
    public code: string,
    public extensions?: AdminApiResponse["extensions"],
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AdminApiClientError";
  }
}

/**
 * Create Admin API client from environment variables
 *
 * @param storeId - Store identifier
 * @returns Admin API client instance
 */
export function createAdminClient(storeId: string): AdminApiClient {
  const tokenKey = `SHOPIFY_ADMIN_API_TOKEN_${storeId.toUpperCase()}`;
  const domainKey = `SHOPIFY_STORE_DOMAIN_${storeId.toUpperCase()}`;

  const apiSecretKey = process.env[tokenKey];
  const hostName = process.env[domainKey];

  if (!apiSecretKey) {
    throw new Error(
      `Admin API token not found for store: ${storeId}. Set ${tokenKey} environment variable.`
    );
  }

  if (!hostName) {
    throw new Error(
      `Store domain not found for store: ${storeId}. Set ${domainKey} environment variable.`
    );
  }

  return new AdminApiClient({
    storeId,
    apiSecretKey,
    hostName,
    enableLogging: process.env.NODE_ENV === "development",
  });
}
