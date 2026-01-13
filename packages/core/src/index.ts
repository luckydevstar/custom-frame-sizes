/**
 * @framecraft/core
 *
 * Core business logic, services, utilities, and hooks for FrameCraft.
 *
 * This package contains:
 * - Services: products, pricing, shopify, validation, etc.
 * - Utilities: dimension parsing, export functions, etc.
 * - Hooks: shared React hooks for common functionality
 *
 * @packageDocumentation
 */

// Services
export * from "./services";

// Shopify integration
export * from "./shopify";

// Utilities
export * from "./utils";

// Hooks
export * from "./hooks";

// Stores
export * from "./stores";

// Store context
export * from "./stores/store-context";

// Hooks
export * from "./hooks/use-theme";
export * from "./hooks/use-feature-flag";

// Component overrides
export * from "./components/component-override";
