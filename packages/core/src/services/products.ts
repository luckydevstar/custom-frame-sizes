/**
 * Product data service (Store-Agnostic)
 * Provides access to frame, mat, and glass product data
 *
 * ARCHITECTURE: This service is now data-agnostic and store-specific.
 * Each store (store-a, store-b) provides its own data files.
 * Dependencies:
 * - Types: @framecraft/types (extracted in P1-023)
 * - Validation: @framecraft/core/services/validation (extracted in P1-019)
 * - Palette config: @framecraft/config (extracted in P1-026)
 *
 * Data isolation: Each app now maintains its own data in apps/{store}/src/data/
 * This prevents cross-contamination between stores while sharing business logic.
 */

import { validateFrameStyles, validateMatColors, validateGlassTypes } from "./validation";

import type { FrameStyle, MatColor, GlassType, PricingConfig } from "@framecraft/types";

/**
 * Product catalog instance - holds validated data for a specific store
 * Initialized by each app with its own data files
 */
interface ProductCatalog {
  validatedFrames: FrameStyle[];
  validatedMats: MatColor[];
  validatedGlass: GlassType[];
  pricingConfig: PricingConfig;
  rawMatsData?: any; // Store raw mats data for palette.ts (includes displayOrder, metadata)
}

// Global instance - initialized by each app in its layout/root component
let catalog: ProductCatalog | null = null;

/**
 * Initialize the product catalog with store-specific data
 * MUST be called once at app startup (e.g., in _app.tsx or layout.tsx)
 *
 * @param framesData - Array of frame definitions
 * @param matsDataRaw - Mat data (may have nested mats array, displayOrder, metadata)
 * @param glassData - Array of glass/acrylic options
 * @param pricingConfigData - Pricing configuration
 */
export function initializeProductCatalog(
  framesData: any,
  matsDataRaw: any,
  glassData: any,
  pricingConfigData: any
): void {
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

  catalog = {
    validatedFrames,
    validatedMats,
    validatedGlass,
    pricingConfig: pricingConfigData as PricingConfig,
    rawMatsData: matsDataRaw, // Keep raw data for palette.ts (includes displayOrder, metadata)
  };
}

/**
 * Get current catalog instance
 * Throws error if catalog not initialized
 */
function getCatalog(): ProductCatalog {
  if (!catalog) {
    throw new Error(
      "Product catalog not initialized. Call initializeProductCatalog() at app startup."
    );
  }
  return catalog;
}

/**
 * Get all available frame styles
 * @returns Array of frame style configurations
 */
export function getFrameStyles(): FrameStyle[] {
  return getCatalog().validatedFrames;
}

/**
 * Get a specific frame style by ID
 * @param id - Frame style ID
 * @returns Frame style or undefined if not found
 */
export function getFrameStyleById(id: string): FrameStyle | undefined {
  return getCatalog().validatedFrames.find((frame) => frame.id === id);
}

/**
 * Get all available mat colors
 * @returns Array of mat color options
 */
export function getMatColors(): MatColor[] {
  return getCatalog().validatedMats;
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
  const productionMat = getCatalog().validatedMats.find((mat) => mat.id === id);
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
  return getCatalog().validatedGlass;
}

/**
 * Get a specific glass type by ID
 * @param id - Glass type ID
 * @returns Glass type or undefined if not found
 */
export function getGlassTypeById(id: string): GlassType | undefined {
  return getCatalog().validatedGlass.find((glass) => glass.id === id);
}

/**
 * Get pricing configuration
 * @returns Pricing configuration object
 */
export function getPricingConfig(): PricingConfig {
  return getCatalog().pricingConfig;
}

/**
 * Filter frames by material
 * @param material - Material type to filter by
 * @returns Array of matching frame styles
 */
export function getFramesByMaterial(material: string): FrameStyle[] {
  return getCatalog().validatedFrames.filter((frame) => frame.material === material);
}

/**
 * Filter frames by category
 * @param category - Frame category to filter by ("picture", "shadowbox", or "canvas")
 * @returns Array of matching frame styles
 */
export function getFramesByCategory(category: "picture" | "shadowbox" | "canvas"): FrameStyle[] {
  return getCatalog().validatedFrames.filter((frame) => frame.category === category);
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
    // ShadowboxFrames.com / b-shadow-box-frames-original shadowbox slugs (SEO paths under /shadowbox/)
    "standard-depth-matte-black": "classic-matte-black-shadow-box",
    "standard-depth-bright-white": "crisp-white-shadow-box",
    "deep-wide-profile-black": "grand-black-deep-shadow-box",
    "ultra-deep-two-tone-walnut": "dual-tone-walnut-shadow-box",
    "deep-slim-matte-black": "narrow-black-deep-shadow-box",
    "standard-depth-honey-oak": "warm-oak-shadow-box",
    "deep-rustic-walnut": "reclaimed-walnut-deep-shadow-box",
    "standard-depth-coastal-whitewash": "driftwood-white-shadow-box",
    "deep-architectural-matte-black": "modern-matte-black-shadow-box",
    "extra-deep-matte-black": "deep-black-shadow-box",
    "extra-deep-bright-white": "deep-white-shadow-box",
    "extra-deep-rich-walnut": "deep-walnut-shadow-box",
    "medium-depth-gloss-white": "high-gloss-white-shadow-box",
    "deep-charcoal-satin": "charcoal-deep-shadow-box",
    "deep-natural-maple": "maple-deep-shadow-box",
    "standard-depth-barn-black": "barnwood-black-shadow-box",
    "medium-depth-glossy-black": "high-gloss-black-shadow-box",
    "medium-depth-stainless-silver": "brushed-silver-shadow-box",
    "medium-depth-gold": "warm-gold-shadow-box",
    "standard-depth-barn-blue": "barnwood-blue-shadow-box",
    "standard-depth-natural-wood": "natural-wood-shadow-box",
    "standard-depth-modern-white": "pure-white-shadow-box",
    "standard-depth-modern-black": "modern-black-shadow-box",
    "standard-depth-modern-brown": "modern-brown-shadow-box",
    "ultra-deep-matte-black": "ultra-deep-black-shadow-box",
    "ultra-deep-bright-white": "ultra-deep-white-shadow-box",
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

/**
 * Get mat colors with full metadata (for palette.ts)
 * Returns mats array along with display order and metadata
 * @internal Used by @framecraft/config palette.ts
 */
export function getMatColorsWithMetadata() {
  if (!catalog || !catalog.rawMatsData) {
    throw new Error(
      "Product catalog not initialized or mat metadata not available. Call initializeProductCatalog() at app startup."
    );
  }

  return {
    mats: catalog.validatedMats,
    displayOrder: catalog.rawMatsData.displayOrder || { desktop: { regular: [], premium: [] }, mobile: { regular: [], premium: [] } },
    metadata: catalog.rawMatsData.metadata || { totalMats: 0, regularCount: 0, premiumCount: 0, blackCoreCount: 0 },
  };
}
