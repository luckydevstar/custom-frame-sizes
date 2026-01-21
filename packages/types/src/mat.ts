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

/**
 * Corner style for mat openings
 */
export type CornerStyle = "square" | "rounded" | "beveled";

/**
 * Opening cut into a mat layer
 */
export interface MatOpening {
  /** Opening width in inches */
  width: number;

  /** Opening height in inches */
  height: number;

  /** X position from mat left edge (inches) */
  x: number;

  /** Y position from mat top edge (inches) */
  y: number;

  /** Per-opening overlap control (0.25" per side when enabled) */
  hasOverlap?: boolean;

  /** Corner style - only applicable for rectangular openings */
  cornerStyle?: CornerStyle;
}

/**
 * Single mat layer (top mat or bottom mat in double-mat configuration)
 * Each layer has a color and one or more openings
 */
export interface MatLayer {
  /** Mat board color name */
  color: string;

  /** Array of openings cut into this layer */
  openings: MatOpening[];
}

/**
 * Complete mat board configuration
 * Represents the entire custom mat design including all layers and options
 */
export interface MatConfig {
  /** Overall mat width in inches */
  overallWIn: number;

  /** Overall mat height in inches */
  overallHIn: number;

  /** Single or double mat configuration */
  singleOrDouble: "single" | "double";

  /** Top mat layer (visible layer) */
  topMat: MatLayer;

  /** Bottom mat layer - only present when singleOrDouble is "double" */
  bottomMat?: MatLayer;

  /**
   * Standard overlap mode
   * When true, openings are automatically reduced by 0.25" per side
   * to create proper overlap for framing
   */
  standardOverlap: boolean;

  /**
   * Mat reveal width (double mat only)
   * The width of the bottom mat border visible around the artwork
   * Measured in inches, typically 0.25"
   */
  matRevealWidth: number;

  /**
   * Selected frame style ID for mat+frame bundle
   * When set, applies 10% discount on combined order
   * References frame ID from frame designer module (data/frames.json)
   */
  selectedFrameId: string | null;

  /**
   * Selected glass/glazing type ID
   * Only applicable when frame is selected
   * References glass ID from products service (data/glass.json)
   */
  selectedGlassId: string | null;

  /**
   * Oversize flag
   * True if mat dimensions exceed standard sheet size (32"×40")
   */
  isOversize: boolean;

  /**
   * Color palette mode
   * Determines which colors are available for selection
   * - standard: Full color palette for standard-size mats
   * - oversize: Limited color palette for oversize mats
   */
  paletteMode: "standard" | "oversize";

  /**
   * Snap to center guide enabled
   * Shows visual guides and snaps openings to mat center
   */
  snapToCenter: boolean;

  /**
   * Snap to alignment guide enabled
   * Shows alignment guides between openings
   */
  snapToAlign: boolean;

  /**
   * Show border measurements
   * Displays blueprint-style dimension lines showing mat borders
   */
  showBorders: boolean;

  /**
   * Order quantity
   * Number of identical mat boards to order
   */
  quantity: number;

  /**
   * Hanging hardware option
   * Only applicable when frame is selected
   * - standard: Free standard wall hanging hardware
   * - security: Premium security hardware (+$8.95)
   */
  hardware?: "standard" | "security";

  /**
   * Allow tight spacing mode (single mat only)
   * When enabled, permits 0.25" spacing between openings (vs. standard 0.75")
   * NOTE: Tight spacing layouts cannot be converted to double mats without expanding mat size
   * Default: false (use safe 0.75" spacing for double mat compatibility)
   */
  allowTightSpacing?: boolean;

  /**
   * V-Groove configuration
   * Decorative V-shaped groove cut around opening revealing mat core color
   * Premium feature with upcharge
   */
  vGroove?: {
    /** V-groove enabled */
    enabled: boolean;
    /** Distance from opening edge (inches), typically 0.5" */
    offsetIn: number;
  };

  /**
   * Bottom-weighted matting option
   * Professional framing technique that adds 0.5" to the bottom mat border
   * Creates visual balance by making bottom border slightly larger than top
   * Free feature, no upcharge
   */
  bottomWeighted?: boolean;

  /**
   * Backing Kit configuration
   * Includes rigid backing board and protective self-seal clear bag
   * Premium feature with flat-rate upcharge per unit
   */
  backingKit?: {
    /** Backing kit enabled */
    enabled: boolean;
  };

  /**
   * Brass Nameplate configuration
   * Engraved metal plaque positioned below mat opening
   * Uses Type B behavior (bottom border extends to 3.75" minimum when enabled)
   */
  brassNameplate?: {
    enabled: boolean;
    line1: string;
    line2: string;
    line3: string;
    font: "georgia" | "arial" | "trajan-pro" | "dancing-script" | "courier-new";
    color: "brass-black" | "silver-black" | "black-gold" | "black-silver";
    includeFlag: boolean;
  };
}
