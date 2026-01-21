/**
 * Services
 *
 * Business logic services for FrameCraft.
 *
 * Services will be exported here as they are extracted:
 * - products.ts: Product catalog and frame/glass/mat data access
 * - pricing.ts: Pricing calculation logic
 * - shopify.ts: Shopify Storefront API integration
 * - validation.ts: Input validation utilities
 * - logging.ts: Centralized logging service with Sentry integration
 * - mat-catalog.ts: Mat board catalog service with filtering and conversion utilities
 * - printCompositor.ts: Print file generation (Phase 2)
 */

// Services
export * from "./products";
export * from "./pricing";
export * from "./validation";
export * from "./logging";
export * from "./mat-catalog";
export * from "./print-compositor";
export * from "./shopify";
