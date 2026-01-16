/**
 * Brand Configuration Registry
 *
 * Centralized registry for managing store/brand configurations.
 * Provides type-safe access to store configurations with validation.
 */

import type { BrandConfig, StoreId, BrandConfigRegistry } from "./types/brand-config";
import { validateBrandConfig } from "./validation/schema";

/**
 * In-memory brand configuration registry
 */
class BrandConfigRegistryImpl implements BrandConfigRegistry {
  private configs = new Map<StoreId, BrandConfig>();

  /**
   * Get configuration for a store
   */
  get(storeId: StoreId): BrandConfig | null {
    return this.configs.get(storeId) || null;
  }

  /**
   * Register a store configuration
   * Validates the configuration before registering
   */
  register(config: BrandConfig): void {
    const validation = validateBrandConfig(config);
    if (!validation.success) {
      throw new Error(
        `Invalid brand configuration for store ${config.storeId}: ${validation.errors?.message}`
      );
    }

    this.configs.set(config.storeId, config);
  }

  /**
   * Unregister a store configuration
   */
  unregister(storeId: StoreId): void {
    this.configs.delete(storeId);
  }

  /**
   * Get all registered store IDs
   */
  getAllStoreIds(): StoreId[] {
    return Array.from(this.configs.keys());
  }

  /**
   * Check if a store is registered
   */
  has(storeId: StoreId): boolean {
    return this.configs.has(storeId);
  }

  /**
   * Clear all configurations
   */
  clear(): void {
    this.configs.clear();
  }
}

/**
 * Global brand configuration registry instance
 */
const BrandConfigRegistry = new BrandConfigRegistryImpl();

/**
 * Export the registry instance
 */
export { BrandConfigRegistry };

/**
 * Register multiple store configurations
 *
 * @param configs Array of brand configurations
 */
export function registerBrandConfigs(configs: BrandConfig[]): void {
  for (const config of configs) {
    BrandConfigRegistry.register(config);
  }
}

/**
 * Get brand configuration for a store
 * Throws if store is not registered
 *
 * @param storeId Store identifier
 * @returns Brand configuration
 * @throws Error if store is not registered
 */
export function getBrandConfig(storeId: StoreId): BrandConfig {
  const config = BrandConfigRegistry.get(storeId);
  if (!config) {
    throw new Error(`Brand configuration not found for store: ${storeId}`);
  }
  return config;
}

/**
 * Check if a store is active
 *
 * @param storeId Store identifier
 * @returns true if store is active, false otherwise
 */
export function isStoreActive(storeId: StoreId): boolean {
  const config = BrandConfigRegistry.get(storeId);
  if (!config) {
    return false;
  }
  return config.metadata?.isActive !== false; // Default to true if not specified
}
