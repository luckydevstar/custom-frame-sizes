/**
 * @framecraft/config
 *
 * Configuration and constants for FrameCraft.
 *
 * This package contains:
 * - Palette configuration: Mat board palette and display order
 * - Navigation configuration: Site navigation structure and menu items
 * - Animation configuration: Animation settings for scroll animations, parallax, etc.
 * - Theme configuration: Base theme and theme utilities
 * - Feature flags configuration: Feature toggles
 * - Brand configuration: Store-specific brand configuration
 * - Other configuration constants used across the monorepo
 *
 * @packageDocumentation
 */

// Animation configuration
export * from "./animations";

// Palette configuration
export * from "./palette";

// Navigation configuration
export * from "./navigation";

// Theme configuration
export * from "./theme";
// Note: base-theme, theme-merge, and theme-utils are re-exported via ./theme
// to avoid duplicate exports

// Feature flags configuration
export * from "./features";

// Brand configuration
export * from "./brand-config";
// Note: BrandConfigRegistry type is exported from types/brand-config
// The instance is exported from brand-config
export type {
  BrandConfig,
  BrandConfigRegistry,
  StoreId,
  ThemeOverride,
  NavigationOverride,
  ComponentOverrides,
  SEOConfig,
  ShopifyConfig,
} from "./types/brand-config";
export * from "./validation/schema";
