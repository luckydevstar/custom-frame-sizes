/**
 * Product data service
 * Loads and provides access to frame, mat, and glass product data
 *
 * NOTE: This service has been extracted to @framecraft/core.
 * Dependencies:
 * - Types: @framecraft/types (extracted in P1-023)
 * - Validation: @framecraft/core/services/validation (extracted in P1-019)
 * - Palette config: @framecraft/config (extracted in P1-026)
 *
 * Data files are imported from @framecraft/data package.
 */

// Import data from @framecraft/data package
import {
  framesData,
  matsData as matsDataRaw,
  glassData,
  pricingConfigData,
} from "@framecraft/data";

import type { FrameStyle, MatColor, GlassType, PricingConfig } from "@framecraft/types";
import { validateFrameStyles, validateMatColors, validateGlassTypes } from "./validation";

// Extract mats array from new catalog structure - mats.json already has correct structure
const matsDataNew = (matsDataRaw as any).mats || [];
const matsData = matsDataNew.map((mat: any) => {
  // mats.json already has the correct structure with hexColor field
  // Just ensure backward compatibility by adding color alias
  return {
    ...mat,
    color: mat.hexColor || mat.color || "#FFFFFF", // Backward compatibility alias
  };
}) as MatColor[];

// Validate data on load
const validatedFrames = validateFrameStyles(framesData);
const validatedMats = validateMatColors(matsData);
const validatedGlass = validateGlassTypes(glassData);

/**
 * Get all available frame styles
 * @returns Array of frame style configurations
 */
export function getFrameStyles(): FrameStyle[] {
  return validatedFrames;
}

/**
 * Get a specific frame style by ID
 * @param id - Frame style ID
 * @returns Frame style or undefined if not found
 */
export function getFrameStyleById(id: string): FrameStyle | undefined {
  return validatedFrames.find((frame) => frame.id === id);
}

/**
 * Get all available mat colors
 * @returns Array of mat color options
 */
export function getMatColors(): MatColor[] {
  return validatedMats;
}

/**
 * Get a specific mat color by ID
 * @param id - Mat color ID
 * @returns Mat color or undefined if not found
 * Falls back to palette.config.ts for mats not yet in production catalog
 *
 * TODO: Update to use @framecraft/config once palette config is extracted in P1-026
 */
export function getMatColorById(id: string): MatColor | undefined {
  // First try production catalog
  const productionMat = validatedMats.find((mat) => mat.id === id);
  if (productionMat) return productionMat;

  // TODO: Fall back to palette config from @framecraft/config once extracted
  // For now, return undefined if not in production catalog
  // const paletteMat = getPaletteMatById(id);
  // if (paletteMat) { ... }

  return undefined;
}

/**
 * Get all available glass types
 * @returns Array of glass type options
 */
export function getGlassTypes(): GlassType[] {
  return validatedGlass;
}

/**
 * Get a specific glass type by ID
 * @param id - Glass type ID
 * @returns Glass type or undefined if not found
 */
export function getGlassTypeById(id: string): GlassType | undefined {
  return validatedGlass.find((glass) => glass.id === id);
}

/**
 * Get pricing configuration
 * @returns Pricing configuration object
 */
export function getPricingConfig(): PricingConfig {
  return pricingConfigData as PricingConfig;
}

/**
 * Filter frames by material
 * @param material - Material type to filter by
 * @returns Array of matching frame styles
 */
export function getFramesByMaterial(material: string): FrameStyle[] {
  return validatedFrames.filter((frame) => frame.material === material);
}

/**
 * Filter frames by category
 * @param category - Frame category to filter by ("picture", "shadowbox", or "canvas")
 * @returns Array of matching frame styles
 */
export function getFramesByCategory(category: "picture" | "shadowbox" | "canvas"): FrameStyle[] {
  return validatedFrames.filter((frame) => frame.category === category);
}

/**
 * Get default selections for frame designer
 * @returns Object with default frame, mat, and glass selections
 */
export function getDefaultSelections() {
  const frames = getFrameStyles();
  const mats = getMatColors();
  const glass = getGlassTypes();

  return {
    frame: frames[0],
    mat: mats[0],
    matInner: mats[1],
    glass: glass[0],
  };
}

/**
 * Convert frame ID to URL-friendly slug for routing
 *
 * IMPORTANT: Frame pages use descriptive slugs with "-frame" suffix (e.g., "museum-bronze-frame")
 * rather than SKUs (e.g., "6301") for better SEO and user experience.
 *
 * When adding new frame pages:
 * 1. Add the frame ID to slug mapping in slugMap below (without -frame suffix)
 * 2. Create the corresponding route in App.tsx (e.g., /frames/museum-bronze-frame)
 * 3. Add a legacy redirect route if needed (e.g., /frames/6301 → /frames/museum-bronze-frame)
 *
 * @param frameId - Frame ID (e.g., "6301")
 * @returns URL slug with -frame suffix (e.g., "museum-bronze-frame")
 */
export function getFrameSlug(frameId: string): string {
  // Map specific frame IDs to their URL slugs (without -frame suffix)
  // Add new frames here to ensure consistent URL structure
  const slugMap: Record<string, string> = {
    "museum-bronze": "museum-bronze",
    "black-wood": "black-wood",
    "white-wood": "white-wood",
    "silver-wood": "silver-wood",
    "pink-wood": "pink-wood",
    "6301": "museum-bronze", // Legacy SKU support
    // Add more frame-specific slugs here as new frame pages are created
  };

  let baseSlug: string;

  // Get base slug from map or generate it
  if (slugMap[frameId]) {
    baseSlug = slugMap[frameId];
  } else {
    // Fallback: get frame by ID and convert name to slug
    const frame = getFrameStyleById(frameId);
    if (frame) {
      baseSlug = frame.name.toLowerCase().replace(/\s+/g, "-");
    } else {
      // Last resort: use the ID itself
      baseSlug = frameId.replace(/_/g, "-");
    }
  }

  // Always append -frame suffix for SEO
  return `${baseSlug}-frame`;
}
