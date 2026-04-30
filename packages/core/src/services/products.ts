/**
 * Product data service (Static, per-app data injection)
 *
 * Each app provides its isolated catalog under `apps/{store}/src/data/` and
 * aliases `@framecraft/store-data` to that folder via `next.config.js`. This
 * module imports the JSON at top level, so the data is statically embedded in
 * the bundle for every Next.js build. No runtime initialization, no global
 * mutable state, no side effects: pages can be fully prerendered for SEO.
 *
 * Type-checking note: `tsconfig.base.json` maps `@framecraft/store-data/*` to
 * `packages/data/src/*` purely so the package type-checks standalone. At
 * Next.js build time the per-app webpack alias overrides this and the bundled
 * data is the per-app data.
 */

import { validateFrameStyles, validateMatColors, validateGlassTypes } from "./validation";

import framesDataRaw from "@framecraft/store-data/frames.json";
import matsDataRaw from "@framecraft/store-data/mats.json";
import glassDataRaw from "@framecraft/store-data/glass.json";
import pricingConfigRaw from "@framecraft/store-data/pricing-config.json";

import type { FrameStyle, MatColor, GlassType, PricingConfig } from "@framecraft/types";

interface RawMatsContainer {
  mats?: unknown[];
  displayOrder?: {
    desktop?: { regular?: number[]; premium?: number[] };
    mobile?: { regular?: number[]; premium?: number[] };
  };
  metadata?: {
    totalMats?: number;
    regularCount?: number;
    premiumCount?: number;
    blackCoreCount?: number;
  };
}

const matsContainer = matsDataRaw as RawMatsContainer;
const matsArray = matsContainer.mats ?? [];

// mats.json already has the correct structure with hexColor; ensure backward
// compatibility by exposing a `color` alias used by older consumers.
const matsForValidation = matsArray.map((m) => {
  const mat = m as Record<string, unknown>;
  return {
    ...mat,
    color: (mat.hexColor as string) || (mat.color as string) || "#FFFFFF",
  };
});

const validatedFrames: FrameStyle[] = validateFrameStyles(framesDataRaw);
const validatedMats: MatColor[] = validateMatColors(matsForValidation);
const validatedGlass: GlassType[] = validateGlassTypes(glassDataRaw);
const pricingConfig: PricingConfig = pricingConfigRaw as PricingConfig;

/**
 * @deprecated No-op. Data is now injected at build time via the
 * `@framecraft/store-data` webpack alias. This export is retained only for
 * backward compatibility with any external callers still invoking it.
 */
export function initializeProductCatalog(
  _framesData?: unknown,
  _matsDataRaw?: unknown,
  _glassData?: unknown,
  _pricingConfigData?: unknown,
): void {
  // intentionally empty
}

/**
 * Get all available frame styles
 */
export function getFrameStyles(): FrameStyle[] {
  return validatedFrames;
}

/**
 * Get a specific frame style by ID
 */
export function getFrameStyleById(id: string): FrameStyle | undefined {
  return validatedFrames.find((frame) => frame.id === id);
}

/**
 * Get all available mat colors
 */
export function getMatColors(): MatColor[] {
  return validatedMats;
}

/**
 * Get a specific mat color by ID
 */
export function getMatColorById(id: string): MatColor | undefined {
  return validatedMats.find((mat) => mat.id === id);
}

/**
 * Get all available glass types
 */
export function getGlassTypes(): GlassType[] {
  return validatedGlass;
}

/**
 * Get a specific glass type by ID
 */
export function getGlassTypeById(id: string): GlassType | undefined {
  return validatedGlass.find((glass) => glass.id === id);
}

/**
 * Get pricing configuration
 */
export function getPricingConfig(): PricingConfig {
  return pricingConfig;
}

/**
 * Filter frames by material
 */
export function getFramesByMaterial(material: string): FrameStyle[] {
  return validatedFrames.filter((frame) => frame.material === material);
}

/**
 * Filter frames by category
 */
export function getFramesByCategory(category: "picture" | "shadowbox" | "canvas"): FrameStyle[] {
  return validatedFrames.filter((frame) => frame.category === category);
}

/**
 * Get default selections for frame designer
 */
export function getDefaultSelections() {
  return {
    frame: validatedFrames[0],
    mat: validatedMats[0],
    matInner: validatedMats[1],
    glass: validatedGlass[0],
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
  const slugMap: Record<string, string> = {
    "museum-bronze": "museum-bronze",
    "black-wood": "black-wood",
    "white-wood": "white-wood",
    "silver-wood": "silver-wood",
    "pink-wood": "pink-wood",
    "6301": "museum-bronze",
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

  const mapped = slugMap[frameId];
  if (mapped) {
    baseSlug = mapped;
  } else {
    const frame = getFrameStyleById(frameId);
    if (frame) {
      baseSlug = frame.name.toLowerCase().replace(/\s+/g, "-");
    } else {
      baseSlug = frameId.replace(/_/g, "-");
    }
  }

  return `${baseSlug}-frame`;
}

/**
 * Get mat colors with full metadata (for palette.ts)
 * Returns mats array along with display order and metadata
 * @internal Used by @framecraft/config palette.ts
 */
export function getMatColorsWithMetadata() {
  return {
    mats: validatedMats,
    displayOrder: matsContainer.displayOrder ?? {
      desktop: { regular: [], premium: [] },
      mobile: { regular: [], premium: [] },
    },
    metadata: matsContainer.metadata ?? {
      totalMats: 0,
      regularCount: 0,
      premiumCount: 0,
      blackCoreCount: 0,
    },
  };
}
