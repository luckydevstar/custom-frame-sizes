/**
 * Utilities
 *
 * Reusable utility functions for FrameCraft.
 *
 * Utilities exported:
 * - dimensions.ts: Dimension parsing, validation, and formatting
 * - geometry.ts: Geometry calculations for mat designer (collision detection, placement validation)
 * - shadowbox-utils.ts: Shadowbox-specific utilities (serialization, pricing, layout)
 * - markdown.ts: Markdown parsing and content utilities
 * - schemas.ts: SEO JSON-LD schema generation utilities
 * - query-client.ts: TanStack Query client setup and API request utilities
 * - specialty/: Specialty designer utilities (puzzle, comic, jersey, playbill, etc.)
 *
 * TODO: Extract additional utilities:
 * - exportPreview.ts: Frame preview export (depends on app-specific matTiling - may stay in app)
 * - arModelGenerator.ts: AR model generation utilities
 */

export * from "./dimensions";
export * from "./geometry";
export * from "./shadowbox-utils";
export * from "./asset-urls";
export * from "./markdown";
export * from "./schemas";
export * from "./query-client";
export * from "./mat-rules";
export * from "./specialty";
export * from "./export-preview";
export * from "./ar-model-generator";
export * from "./generate-ticket-svg";
// Re-export mat-tiling utilities for convenience (used by many designers)
export * from "./specialty/mat-tiling";
