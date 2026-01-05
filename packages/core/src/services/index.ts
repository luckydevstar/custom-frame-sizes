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
 * - printCompositor.ts: Print file generation
 */

// Services
export * from "./products";
export * from "./pricing";
export * from "./validation";
// export * from "./shopify";
// export * from "./printCompositor";
