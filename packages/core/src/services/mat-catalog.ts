/**
 * Mat Board Catalog Service
 *
 * Fetches and manages mat board data from the catalog API.
 * Provides functions for filtering mats by size, category, and brand.
 * Includes conversion utilities for backward compatibility with legacy mat formats.
 *
 * @packageDocumentation
 */

import type { MatBoard, MatFilterCriteria, MatCatalog, MatSheetSize } from "@framecraft/types";

/**
 * Legacy mat palette color interface (for backward compatibility)
 * This format is used by existing components during migration
 */
export interface MatPaletteColor {
  id: string;
  lineNumber: number;
  type: "Regular" | "Premium";
  name: string;
  swatchFile: string;
  hexColor: string;
  sizes: {
    "32x40"?: {
      sku: string;
      price: number;
      vendor: string;
    } | null;
    "40x60"?: {
      sku: string;
      price: number;
      vendor: string;
    } | null;
  };
  coreColor: "white" | "black";
  isRegular: boolean;
  isPremium: boolean;
  isAvailableOversize: boolean;
}

/**
 * Fetch mat catalog from API with optional filtering
 *
 * @param criteria - Filter criteria (size, category, brand, site exclusion)
 * @param baseUrl - Optional base URL for API (defaults to relative /api/mats)
 * @returns Promise resolving to mat catalog
 *
 * @example
 * ```typescript
 * import { fetchMatCatalog } from '@framecraft/core/services';
 *
 * // Fetch all mats
 * const catalog = await fetchMatCatalog();
 *
 * // Fetch only 32x40 mats
 * const standardMats = await fetchMatCatalog({ requiredSize: '32x40' });
 *
 * // Fetch premium mats only
 * const premiumMats = await fetchMatCatalog({ category: 'premium' });
 * ```
 */
export async function fetchMatCatalog(
  criteria?: MatFilterCriteria,
  baseUrl: string = "/api/mats"
): Promise<MatCatalog> {
  const params = new URLSearchParams();

  if (criteria?.requiredSize) {
    params.append("requiredSize", criteria.requiredSize);
  }
  if (criteria?.category) {
    params.append("category", criteria.category);
  }
  if (criteria?.brand) {
    params.append("brand", criteria.brand);
  }
  if (criteria?.excludeSite) {
    params.append("excludeSite", criteria.excludeSite);
  }

  const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch mat catalog: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as MatCatalog;
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error) {
      throw new Error(`Mat catalog fetch failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Convert new MatBoard format to legacy MatPaletteColor format
 *
 * This allows gradual migration of components while maintaining compatibility
 * with existing code that expects the legacy format.
 *
 * @param mat - Mat board in new format
 * @returns Mat board in legacy palette color format
 *
 * @example
 * ```typescript
 * import { matBoardToPaletteColor } from '@framecraft/core/services';
 *
 * const catalog = await fetchMatCatalog();
 * const legacyFormat = catalog.mats.map(matBoardToPaletteColor);
 * ```
 */
export function matBoardToPaletteColor(mat: MatBoard): MatPaletteColor {
  // Determine if mat is premium based on category
  const isPremium = mat.category === "premium";

  // Map to Mat type format: 'Regular' or 'Premium'
  const type: "Regular" | "Premium" = isPremium ? "Premium" : "Regular";

  // Build sizes object
  const sizes32x40 =
    mat.skus["32x40"] && mat.pricing.costPer32x40
      ? {
          sku: mat.skus["32x40"],
          price: mat.pricing.costPer32x40 * mat.pricing.markup,
          vendor: mat.brand,
        }
      : null;

  const sizes40x60 =
    mat.skus["40x60"] && mat.pricing.costPer40x60
      ? {
          sku: mat.skus["40x60"],
          price: mat.pricing.costPer40x60 * mat.pricing.markup,
          vendor: mat.brand,
        }
      : null;

  // Check if available for oversize (has 40x60 option)
  const isAvailableOversize = mat.availableSizes.includes("40x60");

  return {
    id: mat.id,
    lineNumber: 0, // Not applicable for new catalog system
    type,
    name: mat.colorName,
    swatchFile: getSharedAssetUrl(`mats/${mat.id}/swatch.jpg`),
    hexColor: mat.colorHex,
    sizes: {
      "32x40": sizes32x40,
      "40x60": sizes40x60,
    },
    coreColor: "white", // Default, could be enhanced later
    isRegular: !isPremium,
    isPremium,
    isAvailableOversize,
  };
}

/**
 * Get mat boards filtered by size requirements
 *
 * Compatible with existing component patterns. Returns mats separated
 * into standard and premium categories.
 *
 * @param widthIn - Width in inches
 * @param heightIn - Height in inches
 * @param baseUrl - Optional base URL for API (defaults to relative /api/mats)
 * @returns Promise resolving to filtered mats grouped by category
 *
 * @example
 * ```typescript
 * import { getMatsBySize } from '@framecraft/core/services';
 *
 * // Get mats for a 24x36 design (requires 32x40 sheet)
 * const { standard, premium, all } = await getMatsBySize(24, 36);
 *
 * // Get mats for a 36x48 design (requires 40x60 sheet)
 * const oversizeMats = await getMatsBySize(36, 48);
 * ```
 */
export async function getMatsBySize(
  widthIn: number,
  heightIn: number,
  baseUrl: string = "/api/mats"
): Promise<{
  standard: MatPaletteColor[];
  premium: MatPaletteColor[];
  all: MatPaletteColor[];
}> {
  // Determine required size
  const requiredSize: MatSheetSize = widthIn > 32 || heightIn > 40 ? "40x60" : "32x40";

  // Fetch catalog with size filter
  const catalog = await fetchMatCatalog({ requiredSize }, baseUrl);

  // Convert to palette colors
  const allColors = catalog.mats.map(matBoardToPaletteColor);

  // Separate standard and premium
  const standard = allColors.filter((c) => c.type === "Regular");
  const premium = allColors.filter((c) => c.type === "Premium");

  return { standard, premium, all: allColors };
}

/**
 * Get a specific mat by ID
 *
 * @param matId - Mat board ID
 * @param baseUrl - Optional base URL for API (defaults to relative /api/mats)
 * @returns Promise resolving to mat board or null if not found
 *
 * @example
 * ```typescript
 * import { getMatById } from '@framecraft/core/services';
 *
 * const mat = await getMatById('mat-white-001');
 * if (mat) {
 *   console.log(`Found mat: ${mat.colorName}`);
 * }
 * ```
 */
export async function getMatById(
  matId: string,
  baseUrl: string = "/api/mats"
): Promise<MatBoard | null> {
  const catalog = await fetchMatCatalog(undefined, baseUrl);
  return catalog.mats.find((m) => m.id === matId) || null;
}

/**
 * Get mat color by name (for backward compatibility with existing store)
 *
 * @param colorName - Mat color name
 * @param baseUrl - Optional base URL for API (defaults to relative /api/mats)
 * @returns Promise resolving to mat board or null if not found
 *
 * @example
 * ```typescript
 * import { getMatByColorName } from '@framecraft/core/services';
 *
 * const mat = await getMatByColorName('White');
 * if (mat) {
 *   console.log(`Found mat: ${mat.id}`);
 * }
 * ```
 */
export async function getMatByColorName(
  colorName: string,
  baseUrl: string = "/api/mats"
): Promise<MatBoard | null> {
  const catalog = await fetchMatCatalog(undefined, baseUrl);
  return catalog.mats.find((m) => m.colorName === colorName) || null;
}

/**
 * Check if a mat is available for a specific sheet size
 *
 * @param mat - Mat board to check
 * @param requiredSize - Required sheet size
 * @returns True if mat is available for the required size
 *
 * @example
 * ```typescript
 * import { isMatAvailableForSize } from '@framecraft/core/services';
 *
 * const mat = await getMatById('mat-white-001');
 * if (mat && isMatAvailableForSize(mat, '40x60')) {
 *   console.log('Mat available for oversize designs');
 * }
 * ```
 */
export function isMatAvailableForSize(mat: MatBoard, requiredSize: MatSheetSize): boolean {
  return mat.availableSizes.includes(requiredSize);
}

/**
 * Get SKU for a specific mat and sheet size
 *
 * @param mat - Mat board
 * @param requiredSize - Required sheet size
 * @returns SKU string or null if not available
 *
 * @example
 * ```typescript
 * import { getMatSkuForSize } from '@framecraft/core/services';
 *
 * const mat = await getMatById('mat-white-001');
 * if (mat) {
 *   const sku = getMatSkuForSize(mat, '32x40');
 *   if (sku) {
 *     console.log(`SKU: ${sku}`);
 *   }
 * }
 * ```
 */
export function getMatSkuForSize(mat: MatBoard, requiredSize: MatSheetSize): string | null {
  return mat.skus[requiredSize] || null;
}
