/**
 * @framecraft/types
 *
 * Shared TypeScript type definitions for FrameCraft.
 *
 * This package contains:
 * - Product types: FrameStyle, MatColor, GlassType, FrameConfiguration, etc.
 * - Schema types: Database schema types (User, MatDesign, UploadedImage, etc.) - TODO
 * - Specialty types: Shadowbox, mat, and other specialty frame types - TODO
 *
 * @packageDocumentation
 */

// Product types
export * from "./products";

// Mat types
export * from "./mat";

// Schema types
// TODO: Extract database schema types from CustomFrameSizes-CODE/shared/schema.ts
export * from "./schema";

// Specialty types
// TODO: Extract specialty frame types
export * from "./specialty";
