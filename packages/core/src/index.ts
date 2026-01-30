/**
 * @framecraft/core
 *
 * Core business logic, services, utilities, and hooks for FrameCraft.
 *
 * This package contains:
 * - Services: products, pricing, shopify, validation, logging, mat-catalog
 * - Utilities: dimension parsing, export functions, etc.
 * - Hooks: shared React hooks for common functionality
 * - Shopify: Storefront API client and cart management
 * - Monitoring: Error monitoring with Sentry
 *
 * @packageDocumentation
 */

// Services
export * from "./services";

// Utilities
export * from "./utils";

// Explicit re-exports for magazine designer (avoids barrel optimization issues)
export {
  MAGAZINE_SIZES,
  getMagazineSizeById,
  getMagazineSizesByCategory,
  type MagazineSize,
} from "./utils/specialty/magazine-sizes";

// Lib utilities
export * from "./lib";

// Hooks
export * from "./hooks";

// Stores
export * from "./stores";

// Store context
export * from "./stores/store-context";

// Component overrides
export * from "./components/component-override";

// Monitoring
export * from "./monitoring";

// Shopify (Storefront API client and cart management)
export * from "./shopify";
