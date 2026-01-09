/**
 * Store Configuration for Shopify Storefront API
 *
 * Defines the interface and registry for mapping store identifiers
 * to Shopify store configurations.
 *
 * @packageDocumentation
 */

/**
 * Configuration for a Shopify store
 */
export interface StoreConfig {
  /**
   * Unique identifier for the store (e.g., "store-a", "store-b")
   */
  storeId: string;

  /**
   * Shopify store domain (e.g., "store-a.myshopify.com")
   */
  domain: string;

  /**
   * Storefront API access token (public token, safe for client-side)
   */
  accessToken: string;

  /**
   * Shopify API version (default: "2024-01")
   */
  apiVersion?: string;

  /**
   * Optional feature flags for this store
   */
  features?: {
    /**
     * Enable query result caching
     */
    enableCaching?: boolean;

    /**
     * Enable request/response logging
     */
    enableLogging?: boolean;
  };
}

/**
 * Store configuration registry
 * Maps store IDs to their Shopify configurations
 */
class StoreConfigRegistry {
  private configs: Map<string, StoreConfig> = new Map();
  private defaultConfig: StoreConfig | null = null;

  /**
   * Register a store configuration
   */
  register(config: StoreConfig): void {
    if (!this.validateConfig(config)) {
      throw new Error(`Invalid store configuration for store: ${config.storeId}`);
    }
    this.configs.set(config.storeId, config);
  }

  /**
   * Get store configuration by store ID
   */
  getStoreConfig(storeId: string): StoreConfig {
    const config = this.configs.get(storeId);
    if (!config) {
      if (this.defaultConfig) {
        return this.defaultConfig;
      }
      throw new Error(`Store configuration not found for store: ${storeId}`);
    }
    return config;
  }

  /**
   * Set default store configuration (used as fallback)
   */
  setDefaultConfig(config: StoreConfig): void {
    if (!this.validateConfig(config)) {
      throw new Error("Invalid default store configuration");
    }
    this.defaultConfig = config;
  }

  /**
   * Get default store configuration
   */
  getDefaultConfig(): StoreConfig | null {
    return this.defaultConfig;
  }

  /**
   * Validate store configuration
   */
  validateConfig(config: StoreConfig): boolean {
    if (!config.storeId || typeof config.storeId !== "string") {
      return false;
    }
    if (!config.domain || typeof config.domain !== "string") {
      return false;
    }
    if (!config.accessToken || typeof config.accessToken !== "string") {
      return false;
    }
    // Validate domain format (basic check)
    if (!config.domain.includes(".")) {
      return false;
    }
    return true;
  }

  /**
   * Check if a store configuration exists
   */
  hasStoreConfig(storeId: string): boolean {
    return this.configs.has(storeId) || this.defaultConfig?.storeId === storeId;
  }

  /**
   * Get all registered store IDs
   */
  getRegisteredStoreIds(): string[] {
    return Array.from(this.configs.keys());
  }

  /**
   * Clear all configurations (useful for testing)
   */
  clear(): void {
    this.configs.clear();
    this.defaultConfig = null;
  }
}

/**
 * Global store configuration registry instance
 */
export const storeConfigRegistry = new StoreConfigRegistry();

/**
 * Get store configuration by store ID
 * Convenience function that uses the global registry
 */
export function getStoreConfig(storeId: string): StoreConfig {
  return storeConfigRegistry.getStoreConfig(storeId);
}

/**
 * Register a store configuration
 * Convenience function that uses the global registry
 */
export function registerStoreConfig(config: StoreConfig): void {
  storeConfigRegistry.register(config);
}

/**
 * Set default store configuration
 * Convenience function that uses the global registry
 */
export function setDefaultStoreConfig(config: StoreConfig): void {
  storeConfigRegistry.setDefaultConfig(config);
}

/**
 * Resolve store ID from various sources
 * Priority: domain → environment variable → runtime context → default
 */
export function resolveStoreId(): string | null {
  // 1. Try to extract from domain (if in browser)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // Extract store ID from subdomain (e.g., "store-a.example.com" → "store-a")
    const subdomainMatch = hostname.match(/^([^.]+)\./);
    if (subdomainMatch && subdomainMatch[1] !== "www") {
      return subdomainMatch[1] ?? null;
    }
  }

  // 2. Try environment variable (if available - Node.js only)
  // Note: In browser, use window.__ENV__ or similar if needed
  // For now, environment variables are handled at build time
  // Runtime store ID resolution will be handled by Section 1.5 store context

  // 3. Runtime context (will be available when Section 1.5 is complete)
  // For now, return null and let caller handle default

  return null;
}
