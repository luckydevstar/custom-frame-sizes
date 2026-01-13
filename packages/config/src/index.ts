/**
 * @framecraft/config
 *
 * Configuration and constants for FrameCraft.
 *
 * This package contains:
 * - Palette configuration: Mat board palette and display order
 * - Navigation configuration: Site navigation structure and menu items
 * - Other configuration constants used across the monorepo
 *
 * @packageDocumentation
 */

// Palette configuration
export * from "./palette";

// Navigation configuration
export * from "./navigation";

// Theme configuration
export * from "./theme";
export * from "./theme/base-theme";
export * from "./theme/theme-merge";
export * from "./theme/theme-utils";

// Feature flags configuration
export * from "./features";

// Brand configuration
export * from "./brand-config";
export * from "./types/brand-config";
export * from "./validation/schema";
