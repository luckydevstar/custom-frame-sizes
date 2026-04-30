/**
 * Production Mat Board Palette Configuration
 * 46 real mat SKUs with actual vendor pricing and sheet sizes
 *
 * Data is statically injected at build time via the `@framecraft/store-data`
 * webpack alias declared in each app's `next.config.js`. Each app provides
 * its own isolated `apps/{store}/src/data/mats.json`. No runtime
 * initialization is required — all exports are populated at module load.
 */

import matsDataRaw from "@framecraft/store-data/mats.json";

export interface MatSize {
  sku: string;
  price: number;
  vendor: string;
}

export interface Mat {
  id: string;
  lineNumber: number;
  type: "Regular" | "Premium";
  name: string;
  swatchFile: string;
  hexColor?: string;
  sizes: {
    "32x40": MatSize | null;
    "40x60": MatSize | null;
  };
  coreColor: "white" | "black";
  isRegular: boolean;
  isPremium: boolean;
  isAvailableOversize?: boolean;
}

export interface MatDisplayOrder {
  regular: number[];
  premium: number[];
}

interface RawMatsContainer {
  mats?: Mat[];
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

/**
 * All production mats for this store, populated from the per-app mats.json
 */
export const ALL_MATS: Mat[] = matsContainer.mats ?? [];

/**
 * Display order for desktop
 */
export const DESKTOP_DISPLAY_ORDER: MatDisplayOrder = {
  regular: matsContainer.displayOrder?.desktop?.regular ?? [],
  premium: matsContainer.displayOrder?.desktop?.premium ?? [],
};

/**
 * Display order for mobile
 */
export const MOBILE_DISPLAY_ORDER: MatDisplayOrder = {
  regular: matsContainer.displayOrder?.mobile?.regular ?? [],
  premium: matsContainer.displayOrder?.mobile?.premium ?? [],
};

/**
 * Get mat by line number
 */
export function getMatByLineNumber(lineNumber: number): Mat | undefined {
  return ALL_MATS.find((mat) => mat.lineNumber === lineNumber);
}

/**
 * Get mat by ID
 */
export function getMatById(id: string): Mat | undefined {
  return ALL_MATS.find((mat) => mat.id === id);
}

/**
 * Get mat by name
 */
export function getMatByName(name: string): Mat | undefined {
  return ALL_MATS.find((mat) => mat.name === name);
}

/**
 * Get swatch image path for a mat (shared bucket: mats/swatches/)
 */
export function getMatSwatchPath(mat: Mat): string {
  return `/mats/swatches/${mat.swatchFile}`;
}

/**
 * Get all regular mats
 */
export function getRegularMats(): Mat[] {
  return ALL_MATS.filter((mat) => mat.isRegular);
}

/**
 * Get all premium mats
 */
export function getPremiumMats(): Mat[] {
  return ALL_MATS.filter((mat) => mat.isPremium);
}

/**
 * Get mats with black core
 */
export function getBlackCoreMats(): Mat[] {
  return ALL_MATS.filter((mat) => mat.coreColor === "black");
}

/**
 * Check if mat is available for given frame dimensions
 *
 * Size availability rules:
 * - Hide mats when smallest side > 32" OR largest side > 40"
 * - Only show mats that have appropriate sheet size available
 */
export function isMatAvailableForSize(mat: Mat, frameWidth: number, frameHeight: number): boolean {
  const shortSide = Math.min(frameWidth, frameHeight);
  const longSide = Math.max(frameWidth, frameHeight);

  if (shortSide > 32 || longSide > 40) {
    return mat.sizes["40x60"] !== null;
  }

  return mat.sizes["32x40"] !== null;
}

/**
 * Get available mats for given frame dimensions
 */
export function getAvailableMatsForSize(
  frameWidth: number,
  frameHeight: number,
  includeRegular: boolean = true,
  includePremium: boolean = true,
): Mat[] {
  let mats = ALL_MATS;

  if (!includeRegular) {
    mats = mats.filter((mat) => !mat.isRegular);
  }

  if (!includePremium) {
    mats = mats.filter((mat) => !mat.isPremium);
  }

  return mats.filter((mat) => isMatAvailableForSize(mat, frameWidth, frameHeight));
}

/**
 * Get mats in display order for given viewport
 */
export function getMatsInDisplayOrder(
  viewport: "desktop" | "mobile",
  includeRegular: boolean = true,
  includePremium: boolean = true,
): Mat[] {
  const order = viewport === "desktop" ? DESKTOP_DISPLAY_ORDER : MOBILE_DISPLAY_ORDER;
  const result: Mat[] = [];

  if (includeRegular) {
    order.regular.forEach((lineNumber) => {
      const mat = getMatByLineNumber(lineNumber);
      if (mat) result.push(mat);
    });
  }

  if (includePremium) {
    order.premium.forEach((lineNumber) => {
      const mat = getMatByLineNumber(lineNumber);
      if (mat) result.push(mat);
    });
  }

  return result;
}

/**
 * Get mat price for specific sheet size
 */
export function getMatPrice(mat: Mat, sheetSize: "32x40" | "40x60"): number | null {
  const size = mat.sizes[sheetSize];
  return size ? size.price : null;
}

/**
 * Get appropriate mat sheet size for frame dimensions
 */
export function getRequiredSheetSize(
  frameWidth: number,
  frameHeight: number,
): "32x40" | "40x60" | null {
  const shortSide = Math.min(frameWidth, frameHeight);
  const longSide = Math.max(frameWidth, frameHeight);

  if (shortSide > 40 || longSide > 60) {
    return null;
  }

  if (shortSide > 32 || longSide > 40) {
    return "40x60";
  }

  return "32x40";
}

/**
 * Check if a mat color needs a border for visibility (light colors)
 */
export function matNeedsBorder(mat: Mat): boolean {
  const whiteVariants = [
    "White",
    "Off White",
    "Oyster Shell",
    "White Suede",
    "White with Black Core",
    "White Canvas",
  ];
  return whiteVariants.includes(mat.name);
}

/**
 * Get mat metadata
 */
export function getMatMetadata() {
  const m = matsContainer.metadata;
  return {
    total: m?.totalMats ?? ALL_MATS.length,
    regular: m?.regularCount ?? ALL_MATS.filter((mat) => mat.isRegular).length,
    premium: m?.premiumCount ?? ALL_MATS.filter((mat) => mat.isPremium).length,
    blackCore: m?.blackCoreCount ?? ALL_MATS.filter((mat) => mat.coreColor === "black").length,
  } as const;
}

/**
 * @deprecated Prefer `getMatMetadata()` which reflects the per-app data.
 * Retained for backwards compatibility with existing imports.
 */
export const MAT_METADATA = getMatMetadata();

// ========================================
// BACKWARDS COMPATIBILITY LAYER
// Legacy function names for existing components
// ========================================

/**
 * @deprecated Use getMatById instead
 */
export function getMatColorById(id: string): Mat | undefined {
  return getMatById(id);
}

/**
 * @deprecated Use getMatByName instead
 */
export function getMatColorByName(name: string): Mat | undefined {
  return getMatByName(name);
}

/**
 * @deprecated Use getRegularMats instead
 */
export function getStandardMats(): Mat[] {
  return getRegularMats();
}

/**
 * Legacy type alias for backwards compatibility
 * @deprecated Use Mat instead
 */
export type MatPaletteColor = Mat;

/**
 * Legacy constant for backwards compatibility
 * @deprecated Use ALL_MATS instead
 */
export const MAT_PALETTE = ALL_MATS;

/**
 * @deprecated Use isMatAvailableForSize and getAvailableMatsForSize instead
 */
export function getAvailableColorsForSize(
  widthIn: number,
  heightIn: number,
): {
  available: Mat[];
  unavailable: Mat[];
  isOversize: boolean;
} {
  const shortSide = Math.min(widthIn, heightIn);
  const longSide = Math.max(widthIn, heightIn);
  const isOversize = shortSide > 32 || longSide > 40;

  const available = getAvailableMatsForSize(widthIn, heightIn);
  const unavailable = ALL_MATS.filter((mat) => !isMatAvailableForSize(mat, widthIn, heightIn));

  return { available, unavailable, isOversize };
}

/**
 * @deprecated Use getAvailableMatsForSize instead
 */
export function getStandardMatsForSize(widthIn: number, heightIn: number): Mat[] {
  return getAvailableMatsForSize(widthIn, heightIn, true, false);
}

/**
 * @deprecated Use getAvailableMatsForSize instead
 */
export function getPremiumMatsForSize(widthIn: number, heightIn: number): Mat[] {
  return getAvailableMatsForSize(widthIn, heightIn, false, true);
}

/**
 * @deprecated Use matNeedsBorder instead
 */
export function needsBorder(mat: Mat | string): boolean {
  if (typeof mat === "string") {
    const lightColors = ["#FFFFFF", "#FFFDD0", "#FFFFF0", "#F5F5DC"];
    return lightColors.includes(mat);
  }
  return matNeedsBorder(mat);
}

/**
 * @deprecated Mat texture classes are no longer used - swatches use actual images
 */
export function getMatTextureClass(_mat: Mat | undefined): string {
  return "mat-texture-standard";
}
