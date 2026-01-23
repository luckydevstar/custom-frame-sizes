/**
 * Store A Configuration Loader
 *
 * Loads and registers the brand configuration for Store A.
 * This ensures the configuration is available throughout the application.
 */

import { registerBrandConfigs, getBrandConfig } from "@framecraft/config";
import { brandConfig } from "../brand.config";

// Track if config has been initialized
let configInitialized = false;

/**
 * Initialize Store A configuration
 * Registers the brand config with the global registry
 */
export function initializeStoreConfig(): void {
  if (configInitialized) {
    return;
  }
  // Register the brand configuration
  registerBrandConfigs([brandConfig]);
  configInitialized = true;
}

/**
 * Get Store A configuration
 * Returns the registered brand config for Store A
 */
export function getStoreConfig() {
  // Ensure config is initialized
  if (!configInitialized) {
    initializeStoreConfig();
  }
  try {
    return getBrandConfig("store-a");
  } catch {
    // If not registered yet, return null
    return null;
  }
}

// Auto-initialize on module load (for server-side)
if (typeof window === "undefined") {
  initializeStoreConfig();
}
