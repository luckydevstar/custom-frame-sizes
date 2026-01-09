/**
 * Shopify Storefront API Client
 *
 * Base client class for interacting with Shopify Storefront API.
 * Supports multi-store operations with store-specific configurations.
 *
 * @packageDocumentation
 */

import type { StoreConfig } from "./store-config";
import { getStoreConfig, resolveStoreId } from "./store-config";

/**
 * GraphQL request structure
 */
interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

/**
 * GraphQL response structure
 */
interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: Record<string, unknown>;
}

/**
 * GraphQL error structure
 */
interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
}

/**
 * Custom error for Shopify API errors
 */
export class ShopifyAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: GraphQLError[],
    public extensions?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ShopifyAPIError";
  }
}

/**
 * Network error for connection issues
 */
export class ShopifyNetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "ShopifyNetworkError";
  }
}

/**
 * Rate limit error
 */
export class ShopifyRateLimitError extends ShopifyAPIError {
  constructor(
    message: string,
    public retryAfter?: number,
    errors?: GraphQLError[]
  ) {
    super(message, 429, errors);
    this.name = "ShopifyRateLimitError";
  }
}

/**
 * Retry configuration
 */
interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

/**
 * Check if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof ShopifyNetworkError) {
    return true;
  }
  if (error instanceof ShopifyRateLimitError) {
    return true;
  }
  if (error instanceof ShopifyAPIError) {
    // Retry on 5xx errors, but not 4xx (except rate limits)
    return error.statusCode !== undefined && error.statusCode >= 500;
  }
  return false;
}

/**
 * Calculate delay for retry (exponential backoff)
 */
function calculateRetryDelay(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt);
  return Math.min(delay, config.maxDelay);
}

/**
 * Shopify Storefront API Client
 *
 * Handles all GraphQL queries and mutations to Shopify Storefront API.
 * Supports multi-store operations and automatic retry logic.
 */
export class StorefrontClient {
  private domain: string;
  private accessToken: string;
  private apiVersion: string;
  private endpoint: string;
  private enableLogging: boolean;
  private retryConfig: RetryConfig;

  /**
   * Create a new Storefront API client
   *
   * @param config - Store configuration (domain, access token, etc.)
   * @param retryConfig - Optional retry configuration
   */
  constructor(config: StoreConfig, retryConfig?: Partial<RetryConfig>) {
    this.domain = config.domain;
    this.accessToken = config.accessToken;
    this.apiVersion = config.apiVersion || "2024-01";
    this.endpoint = `https://${this.domain}/api/${this.apiVersion}/graphql.json`;
    this.enableLogging = config.features?.enableLogging ?? false;
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  /**
   * Execute a GraphQL query
   *
   * @param query - GraphQL query string
   * @param variables - Query variables
   * @returns Promise resolving to query result
   */
  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    return this.executeRequest<T>({ query, variables });
  }

  /**
   * Execute a GraphQL mutation
   *
   * @param mutation - GraphQL mutation string
   * @param variables - Mutation variables
   * @returns Promise resolving to mutation result
   */
  async mutation<T>(mutation: string, variables?: Record<string, unknown>): Promise<T> {
    return this.executeRequest<T>({ query: mutation, variables });
  }

  /**
   * Execute a GraphQL request with retry logic
   */
  private async executeRequest<T>(request: GraphQLRequest): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await this.retryRequest(() => this.sendRequest<T>(request));
      const duration = Date.now() - startTime;

      if (this.enableLogging) {
        this.logRequest("success", request, duration, result);
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      if (this.enableLogging) {
        this.logRequest("error", request, duration, undefined, error);
      }

      throw error;
    }
  }

  /**
   * Send a single GraphQL request
   */
  private async sendRequest<T>(request: GraphQLRequest): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": this.accessToken,
        },
        body: JSON.stringify(request),
      });

      // Handle HTTP errors
      if (!response.ok) {
        await this.handleHttpError(response);
      }

      const data: GraphQLResponse<T> = await response.json();

      // Handle GraphQL errors
      if (data.errors && data.errors.length > 0) {
        this.handleGraphQLErrors(data.errors, data.extensions);
      }

      // Handle rate limiting (check before GraphQL errors, as 429 might have GraphQL errors too)
      if (response.status === 429) {
        const retryAfter = this.extractRetryAfter(response);
        throw new ShopifyRateLimitError("Shopify API rate limit exceeded", retryAfter, data.errors);
      }

      if (!data.data) {
        throw new ShopifyAPIError("No data returned from Shopify API");
      }

      return data.data;
    } catch (error) {
      // Re-throw known errors
      if (
        error instanceof ShopifyAPIError ||
        error instanceof ShopifyNetworkError ||
        error instanceof ShopifyRateLimitError
      ) {
        throw error;
      }

      // Wrap unknown errors as network errors
      if (error instanceof Error) {
        throw new ShopifyNetworkError(`Network error: ${error.message}`, error);
      }

      throw new ShopifyNetworkError("Unknown network error");
    }
  }

  /**
   * Retry a request with exponential backoff
   */
  private async retryRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    let lastError: Error | unknown;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        // Don't retry if error is not retryable
        if (!isRetryableError(error)) {
          throw error;
        }

        // Don't retry if we've exceeded max retries
        if (attempt >= this.retryConfig.maxRetries) {
          break;
        }

        // Calculate delay and wait
        const delay = calculateRetryDelay(attempt, this.retryConfig);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // If we get here, all retries failed
    throw lastError;
  }

  /**
   * Handle HTTP errors
   */
  private async handleHttpError(response: Response): Promise<never> {
    const errorMessage = `Shopify API error: ${response.status} ${response.statusText}`;
    let errorData: unknown;

    try {
      const text = await response.text();
      errorData = text ? JSON.parse(text) : undefined;
    } catch {
      // Ignore JSON parse errors
    }

    if (response.status === 429) {
      const retryAfter = this.extractRetryAfter(response);
      throw new ShopifyRateLimitError("Shopify API rate limit exceeded", retryAfter);
    }

    const extensions =
      errorData && typeof errorData === "object"
        ? (errorData as Record<string, unknown>)
        : undefined;
    throw new ShopifyAPIError(errorMessage, response.status, undefined, extensions);
  }

  /**
   * Handle GraphQL errors
   */
  private handleGraphQLErrors(errors: GraphQLError[], extensions?: Record<string, unknown>): never {
    const errorMessages = errors.map((e) => e.message).join("; ");
    throw new ShopifyAPIError(`GraphQL errors: ${errorMessages}`, undefined, errors, extensions);
  }

  /**
   * Extract retry-after header from response
   */
  private extractRetryAfter(response: Response): number | undefined {
    const retryAfter = response.headers.get("Retry-After");
    if (retryAfter) {
      const seconds = parseInt(retryAfter, 10);
      if (!isNaN(seconds)) {
        return seconds * 1000; // Convert to milliseconds
      }
    }
    return undefined;
  }

  /**
   * Log request/response (for debugging)
   */
  private logRequest(
    status: "success" | "error",
    request: GraphQLRequest,
    duration: number,
    _result?: unknown,
    error?: unknown
  ): void {
    const logEntry: Record<string, unknown> = {
      status,
      storeId: this.domain,
      operation: request.query.includes("mutation") ? "mutation" : "query",
      queryName: this.extractQueryName(request.query),
      duration,
      timestamp: new Date().toISOString(),
    };

    if (error) {
      logEntry.error = error instanceof Error ? error.message : String(error);
    }

    if (status === "success") {
      console.log("[Shopify Client]", logEntry);
    } else {
      console.error("[Shopify Client]", logEntry);
    }
  }

  /**
   * Extract query/mutation name from GraphQL string
   */
  private extractQueryName(query: string): string {
    const match = query.match(/(?:query|mutation)\s+(\w+)/);
    return match?.[1] ?? "unknown";
  }

  /**
   * Get the API endpoint URL
   */
  getEndpoint(): string {
    return this.endpoint;
  }

  /**
   * Get the store domain
   */
  getDomain(): string {
    return this.domain;
  }
}

/**
 * Create a StorefrontClient instance for a specific store
 *
 * @param storeId - Store identifier (optional, will be resolved if not provided)
 * @returns StorefrontClient instance
 */
export function createStorefrontClient(storeId?: string): StorefrontClient {
  const resolvedStoreId = storeId || resolveStoreId() || "default";
  const config = getStoreConfig(resolvedStoreId);
  return new StorefrontClient(config);
}

/**
 * Create a StorefrontClient instance from a store configuration
 *
 * @param config - Store configuration
 * @returns StorefrontClient instance
 */
export function createStorefrontClientFromConfig(config: StoreConfig): StorefrontClient {
  return new StorefrontClient(config);
}
