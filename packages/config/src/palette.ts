/**
 * Production Mat Board Palette Configuration
 * 46 real mat SKUs with actual vendor pricing and sheet sizes
 * Replaces all previous mat data with production-ready catalog
 *
 * NOTE: This configuration has been extracted to @framecraft/config.
 *
 * TODO: Data file import - mats.json needs to be in @framecraft/data package
 * For now, using relative import from root data/ folder
 */

// Import data from @framecraft/data package
import { matsData } from "@framecraft/data";

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
  hexColor?: string; // Optional hex color for backwards compatibility
  sizes: {
    "32x40": MatSize | null;
    "40x60": MatSize | null;
  };
  coreColor: "white" | "black";
  isRegular: boolean;
  isPremium: boolean;
  isAvailableOversize?: boolean; // Whether mat is available for oversize designs
}

export interface MatDisplayOrder {
  regular: number[];
  premium: number[];
}

/**
 * All 46 production mats
 */
export const ALL_MATS: Mat[] = (matsData as any).mats as Mat[];

/**
 * Display order for desktop (27 regular + 18 premium, omits Terracotta)
 */
export const DESKTOP_DISPLAY_ORDER: MatDisplayOrder = (matsData as any).displayOrder
  .desktop as MatDisplayOrder;

/**
 * Display order for mobile (28 regular + 18 premium, includes Terracotta in red section)
 */
export const MOBILE_DISPLAY_ORDER: MatDisplayOrder = (matsData as any).displayOrder
  .mobile as MatDisplayOrder;

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
 * Get swatch image path for a mat
 */
export function getMatSwatchPath(mat: Mat): string {
  return `/mats/${mat.swatchFile}`;
}

/**
 * Get all regular mats (28 total)
 */
export function getRegularMats(): Mat[] {
  return ALL_MATS.filter((mat) => mat.isRegular);
}

/**
 * Get all premium mats (18 total)
 */
export function getPremiumMats(): Mat[] {
  return ALL_MATS.filter((mat) => mat.isPremium);
}

/**
 * Get mats with black core (4 total: Football Texture, Basketball Texture,
 * White with Black Core, Black with Black Core)
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
 *
 * @param mat The mat to check
 * @param frameWidth Frame width in inches
 * @param frameHeight Frame height in inches
 * @returns true if mat is available for this frame size
 */
export function isMatAvailableForSize(mat: Mat, frameWidth: number, frameHeight: number): boolean {
  const shortSide = Math.min(frameWidth, frameHeight);
  const longSide = Math.max(frameWidth, frameHeight);

  // Check if frame size exceeds mat sheet availability
  if (shortSide > 32 || longSide > 40) {
    // Frame requires 40x60 sheet
    return mat.sizes["40x60"] !== null;
  }

  // Frame fits within 32x40 sheet - all mats with 32x40 size available
  return mat.sizes["32x40"] !== null;
}

/**
 * Get available mats for given frame dimensions
 * Filters mats based on size availability
 */
export function getAvailableMatsForSize(
  frameWidth: number,
  frameHeight: number,
  includeRegular: boolean = true,
  includePremium: boolean = true
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
 *
 * @param viewport 'desktop' or 'mobile'
 * @param includeRegular Include regular mats (default true)
 * @param includePremium Include premium mats (default true)
 * @returns Array of mats in correct display order
 */
export function getMatsInDisplayOrder(
  viewport: "desktop" | "mobile",
  includeRegular: boolean = true,
  includePremium: boolean = true
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
  frameHeight: number
): "32x40" | "40x60" | null {
  const shortSide = Math.min(frameWidth, frameHeight);
  const longSide = Math.max(frameWidth, frameHeight);

  // Check if frame is too large for any mat sheet
  if (shortSide > 40 || longSide > 60) {
    return null; // Un-manufacturable
  }

  // Requires 40x60 sheet
  if (shortSide > 32 || longSide > 40) {
    return "40x60";
  }

  // Fits within 32x40 sheet
  return "32x40";
}

/**
 * Check if a mat color needs a border for visibility (light colors)
 * Used for mat selector swatches
 */
export function matNeedsBorder(mat: Mat): boolean {
  // White and off-white variants that need borders
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
export const MAT_METADATA = {
  total: (matsData as any).metadata.totalMats,
  regular: (matsData as any).metadata.regularCount,
  premium: (matsData as any).metadata.premiumCount,
  blackCore: (matsData as any).metadata.blackCoreCount,
} as const;

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
  heightIn: number
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
    // Legacy: mat was a color hex code
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
