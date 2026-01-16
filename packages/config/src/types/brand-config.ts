/**
 * Brand/Store Configuration Schema
 *
 * Complete TypeScript interface for store configuration including all override options.
 * This schema allows each store to customize theme, features, navigation, and components
 * while sharing the same codebase.
 *
 * @packageDocumentation
 */

import type { ThemeConfig } from "../theme";
import type { FeatureFlags } from "../features";
import type { NavigationConfig } from "../navigation";

/**
 * Store identifier (e.g., "store-a", "custompictureframes")
 */
export type StoreId = string;

/**
 * Component override configuration
 * Maps component paths to custom implementations
 */
export interface ComponentOverrides {
  /**
   * Override paths in format: "package/component"
   * Example: "ui/Button" → custom Button component
   */
  [componentPath: string]: string; // Path to custom component file
}

/**
 * Theme override configuration
 * Partial theme that merges with base theme
 */
export interface ThemeOverride {
  /**
   * Color palette overrides (partial)
   */
  colors?: Partial<ThemeConfig["colors"]>;

  /**
   * Typography overrides (partial)
   */
  typography?: Partial<ThemeConfig["typography"]>;

  /**
   * Layout overrides (partial)
   * Note: spacing is part of layout, not a top-level property
   */
  layout?: Partial<ThemeConfig["layout"]>;

  /**
   * Brand colors (store-specific)
   */
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };

  /**
   * Logo configuration
   */
  logo?: {
    /**
     * Logo image URL or path
     */
    src: string;

    /**
     * Alt text for logo
     */
    alt: string;

    /**
     * Logo width (CSS value)
     */
    width?: string;

    /**
     * Logo height (CSS value)
     */
    height?: string;
  };
}

/**
 * Navigation customization
 * Allows stores to override navigation structure
 */
export interface NavigationOverride {
  /**
   * Override products section
   */
  products?: Partial<NavigationConfig["products"]>;

  /**
   * Override design tools section
   */
  designTools?: Partial<NavigationConfig["designTools"]>;

  /**
   * Override resources section
   */
  resources?: Partial<NavigationConfig["resources"]>;

  /**
   * Override company section
   */
  company?: Partial<NavigationConfig["company"]>;
}

/**
 * SEO and metadata configuration
 */
export interface SEOConfig {
  /**
   * Site title
   */
  title: string;

  /**
   * Site description
   */
  description: string;

  /**
   * Site keywords
   */
  keywords?: string[];

  /**
   * Open Graph image URL
   */
  ogImage?: string;

  /**
   * Twitter card image URL
   */
  twitterImage?: string;

  /**
   * Canonical URL
   */
  canonicalUrl?: string;
}

/**
 * Shopify store configuration
 */
export interface ShopifyConfig {
  /**
   * Shopify store domain (e.g., "store-a.myshopify.com")
   */
  domain: string;

  /**
   * Storefront API access token (public, safe for client-side)
   */
  storefrontAccessToken: string;

  /**
   * Admin API token (server-side only, from environment)
   * Note: Not stored in config, retrieved from env vars
   */
  adminApiToken?: never; // Explicitly not part of config

  /**
   * Shopify API version (default: "2024-01")
   */
  apiVersion?: string;
}

/**
 * Complete Brand/Store Configuration
 *
 * This is the main configuration interface that defines all aspects
 * of a store's customization.
 */
export interface BrandConfig {
  /**
   * Unique store identifier
   * Used for routing, database filtering, and configuration lookup
   */
  storeId: StoreId;

  /**
   * Store display name
   */
  name: string;

  /**
   * Store domain (e.g., "store-a.example.com")
   */
  domain: string;

  /**
   * Shopify store configuration
   */
  shopify: ShopifyConfig;

  /**
   * Theme overrides
   * Merged with base theme to create final theme
   */
  theme?: ThemeOverride;

  /**
   * Feature flags overrides
   * Merged with default feature flags
   */
  features?: Partial<FeatureFlags>;

  /**
   * Navigation customizations
   */
  navigation?: NavigationOverride;

  /**
   * Component overrides
   * Maps component paths to custom implementations
   */
  componentOverrides?: ComponentOverrides;

  /**
   * SEO and metadata
   */
  seo: SEOConfig;

  /**
   * Brand positioning and messaging
   */
  branding?: {
    /**
     * Brand tagline
     */
    tagline?: string;

    /**
     * Primary value proposition
     */
    valueProposition?: string;

    /**
     * Target audience description
     */
    targetAudience?: string;
  };

  /**
   * Additional metadata
   */
  metadata?: {
    /**
     * Store is active (can be disabled without removing config)
     */
    isActive?: boolean;

    /**
     * Store creation date
     */
    createdAt?: string;

    /**
     * Last update date
     */
    updatedAt?: string;

    /**
     * Custom metadata (key-value pairs)
     */
    [key: string]: unknown;
  };
}

/**
 * Brand configuration registry
 * Maps store IDs to their configurations
 */
export interface BrandConfigRegistry {
  /**
   * Get configuration for a store
   */
  get(storeId: StoreId): BrandConfig | null;

  /**
   * Register a store configuration
   */
  register(config: BrandConfig): void;

  /**
   * Unregister a store configuration
   */
  unregister(storeId: StoreId): void;

  /**
   * Get all registered store IDs
   */
  getAllStoreIds(): StoreId[];

  /**
   * Check if a store is registered
   */
  has(storeId: StoreId): boolean;
}
