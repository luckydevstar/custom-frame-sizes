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

// Explicit re-exports for newspaper/needlework (avoids barrel optimization issues)
export {
  getNewspaperLifestyleImages,
  getRandomNewspaperLifestyleImage,
} from "./lib/newspaper-lifestyle-images";
export type { NewspaperLifestyleImage } from "./lib/newspaper-lifestyle-images";
export {
  getNewspaperInsertPaths,
  getRandomNewspaperInsertPath,
  getUniqueRandomNewspaperInsertPaths,
} from "./lib/newspaper-insert-images";
export { NEWSPAPER_PRESETS, getNewspaperLayoutsForSize } from "./lib/newspaper-layouts";
export type {
  NewspaperLayoutType,
  NewspaperLayout,
  NewspaperOpening,
} from "./lib/newspaper-layouts";
export {
  getNeedleworkLifestyleImages,
  getRandomNeedleworkLifestyleImage,
} from "./lib/needlework-lifestyle-images";
export type { NeedleworkLifestyleImage } from "./lib/needlework-lifestyle-images";
export {
  getNeedleworkInsertPaths,
  getRandomNeedleworkInsertPath,
} from "./lib/needlework-insert-images";

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
