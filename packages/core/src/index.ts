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
