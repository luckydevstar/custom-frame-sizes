/**
 * Mat Board Catalog Types
 * Centralized type definitions for mat board products across all designers
 *
 * @packageDocumentation
 */

/**
 * Available mat board sheet sizes
 */
export type MatSheetSize = "32x40" | "40x60";

/**
 * Mat board texture options
 */
export type MatTexture = "smooth" | "linen" | "suede" | "light-canvas" | "light-texture";

/**
 * Mat board category/tier
 */
export type MatCategory = "regular" | "premium";

/**
 * Mat board brand names
 */
export type MatBrand = "Peterboro" | "Crescent" | "Decor";

/**
 * Pricing information for a mat board
 */
export interface MatPricing {
  /** Cost per 32x40 sheet (if available) */
  costPer32x40?: number;
  /** Cost per 40x60 sheet (if available) */
  costPer40x60?: number;
  /** Markup multiplier (e.g., 4.0 = 4x cost) */
  markup: number;
}

/**
 * SKU mapping for different sheet sizes
 */
export interface MatSkus {
  /** SKU for 32x40 sheet (if available) */
  "32x40"?: string;
  /** SKU for 40x60 sheet (if available) */
  "40x60"?: string;
}

/**
 * Complete mat board product definition
 */
export interface MatBoard {
  /** Unique identifier for this mat (slug format) */
  id: string;

  /** Display name of the color */
  colorName: string;

  /** Hex color code (with # prefix) */
  colorHex: string;

  /** Brand/manufacturer */
  brand: MatBrand;

  /** Surface texture */
  texture: MatTexture;

  /** Quality tier */
  category: MatCategory;

  /** SKU codes for each available size */
  skus: MatSkus;

  /** Available sheet sizes */
  availableSizes: MatSheetSize[];

  /** Pricing information */
  pricing: MatPricing;

  /** Optional URL to texture photo (for realistic rendering) */
  textureImageUrl?: string;

  /** Optional Shopify product/variant IDs for sync */
  shopify?: {
    productId?: string;
    variantId32x40?: string;
    variantId40x60?: string;
  };

  /** Optional site exclusions for multi-site support */
  excludedSites?: string[];
}

/**
 * Mat catalog data structure
 */
export interface MatCatalog {
  /** Version for tracking catalog updates */
  version: string;

  /** Last update timestamp */
  lastUpdated: string;

  /** All mat boards in display order */
  mats: MatBoard[];
}

/**
 * Helper type for mat selection in designers
 */
export interface MatSelection {
  matId: string;
  /** Actual SKU to use based on required size */
  sku: string;
  /** Sheet size required */
  sheetSize: MatSheetSize;
  colorName: string;
  colorHex: string;
  category: MatCategory;
}

/**
 * Filter criteria for mat catalog queries
 */
export interface MatFilterCriteria {
  /** Only show mats available for this sheet size */
  requiredSize?: MatSheetSize;

  /** Filter by category */
  category?: MatCategory;

  /** Filter by brand */
  brand?: MatBrand;

  /** Exclude specific site (for multi-site) */
  excludeSite?: string;
}
