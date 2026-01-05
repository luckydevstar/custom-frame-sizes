/**
 * Pricing Engine (Temporary)
 *
 * NOTE: This is a TEMPORARY extraction of essential pricing engine functions
 * from CustomFrameSizes-CODE/shared/schema.ts. The full pricing engine should
 * be extracted in a future ticket.
 *
 * This file contains only the functions needed by the pricing service.
 * The complete pricing engine includes many more functions and should be
 * extracted comprehensively.
 *
 * TODO: Extract full pricing engine from @shared/schema to @framecraft/core
 */

// Pricing markup constants
export const PRICING_MARKUPS = {
  FRAME_MOULDING: 8.0, // Frame moulding markup
  DEDICATED_PAGE: 13.0, // Component pages (acrylic, foam board)
  DESIGNER_STANDARD: 8.0, // Acrylic & foam in designers
  DESIGNER_PLYWOOD: 2.5, // Plywood backing (shadowbox only)
  MAT_IN_FRAME_DESIGNER: 2.5, // Mats in frame designers (including backing)
  MAT_STANDARD: 8.0, // Standard mats in mat designer
  MAT_PREMIUM: 4.0, // Premium mats in mat designer
  PRINT: 3.5, // Print markup (paper & canvas)
} as const;

// Mat pricing data structure
export type MatType = "regular" | "premium";

export interface MatPricing {
  name: string;
  type: MatType;
  sku32x40: string;
  price32x40: number;
  sku40x60: string | null;
  price40x60: number | null;
}

// TODO: Extract full MAT_PRICING array from schema.ts
// For now, creating a minimal version - full extraction needed
export const MAT_PRICING: MatPricing[] = [
  // Regular (Standard) Mats - minimal set for now
  {
    name: "White",
    type: "regular",
    sku32x40: "VB222",
    price32x40: 3.46,
    sku40x60: "VB8222",
    price40x60: 11.85,
  },
  {
    name: "Black",
    type: "regular",
    sku32x40: "VB221",
    price32x40: 3.46,
    sku40x60: "VB8221",
    price40x60: 11.85,
  },
  // TODO: Add all other mats from schema.ts MAT_PRICING array
];

// Quick lookup by mat name
export const MAT_PRICING_BY_NAME: Record<string, MatPricing> = {};
MAT_PRICING.forEach((mat) => {
  MAT_PRICING_BY_NAME[mat.name] = mat;
});

/**
 * Determine sheet fraction based on mat size
 * Quarter (0.25): ≤16×20, Half (0.5): ≤20×32, Full (1.0): ≤32×40
 * Returns null if oversize (requires 40×60 sheet)
 */
export function getMatSheetFraction(widthIn: number, heightIn: number): number | null {
  // Normalize to ensure width ≤ height for comparison
  const [w, h] = widthIn <= heightIn ? [widthIn, heightIn] : [heightIn, widthIn];

  // Check if fits in 32×40 sheet
  if (w <= 32 && h <= 40) {
    // Quarter sheet: ≤16×20
    if (w <= 16 && h <= 20) return 0.25;
    // Half sheet: ≤20×32
    if (w <= 20 && h <= 32) return 0.5;
    // Full sheet
    return 1.0;
  }
  // Oversize - needs 40×60 sheet
  return null;
}

/**
 * Calculate mat cost before markup
 * Returns the raw material cost based on sheet sizing
 */
export function calculateMatCost(
  widthIn: number,
  heightIn: number,
  matName: string
): number | null {
  const mat = MAT_PRICING_BY_NAME[matName];
  if (!mat) return null;

  const fraction = getMatSheetFraction(widthIn, heightIn);

  if (fraction !== null) {
    // Fits in 32×40 sheet
    return mat.price32x40 * fraction;
  } else {
    // Needs 40×60 sheet (full price, no fractions)
    if (mat.price40x60 === null) return null; // Not available in oversize
    return mat.price40x60;
  }
}

/**
 * Calculate mat price for frame designers (including backing)
 * Uses 2.5x markup
 */
export function calculateMatPriceForDesigner(
  widthIn: number,
  heightIn: number,
  matName: string
): number | null {
  const cost = calculateMatCost(widthIn, heightIn, matName);
  if (cost === null) return null;
  return cost * PRICING_MARKUPS.MAT_IN_FRAME_DESIGNER;
}

// Component pricing constants
export const COMPONENT_PRICING = {
  // Acrylic (available in all designers + dedicated page)
  STANDARD_ACRYLIC: {
    costPerSqIn: 0.00324, // Includes 15% waste
    dedicatedMarkup: PRICING_MARKUPS.DEDICATED_PAGE,
    designerMarkup: PRICING_MARKUPS.DESIGNER_STANDARD,
    minimumPrice: 9.95, // Minimum on dedicated page
    availableInDesigners: true,
    hasDedicatedPage: true,
  },
  NON_GLARE_ACRYLIC: {
    costPerSqIn: 0.00449,
    dedicatedMarkup: PRICING_MARKUPS.DEDICATED_PAGE,
    designerMarkup: PRICING_MARKUPS.DESIGNER_STANDARD,
    minimumPrice: 12.95,
    availableInDesigners: true,
    hasDedicatedPage: true,
  },
  // Glass - uses same pricing as acrylic
  STANDARD_GLASS: {
    costPerSqIn: 0.00324, // Same as standard acrylic
    dedicatedMarkup: PRICING_MARKUPS.DEDICATED_PAGE,
    designerMarkup: PRICING_MARKUPS.DESIGNER_STANDARD,
    minimumPrice: 9.95,
    availableInDesigners: true,
    hasDedicatedPage: false, // No dedicated glass page
  },
  NON_GLARE_GLASS: {
    costPerSqIn: 0.00449, // Same as non-glare acrylic
    dedicatedMarkup: PRICING_MARKUPS.DEDICATED_PAGE,
    designerMarkup: PRICING_MARKUPS.DESIGNER_STANDARD,
    minimumPrice: 12.95,
    availableInDesigners: true,
    hasDedicatedPage: false,
  },
} as const;

// Frame moulding prices - TODO: Extract full list from schema.ts
export const PICTURE_FRAME_MOULDING_PRICES: Record<string, number> = {
  "206": 0.75,
  "6301": 1.14,
  "6711": 1.24,
  "8446": 1.22,
  "8989": 0.45,
  "9935": 1.0,
  // TODO: Add all other frame SKUs from schema.ts
};

export const SHADOWBOX_FRAME_MOULDING_PRICES: Record<string, number> = {
  "8693": 0.72,
  "8990": 0.72,
  "9448": 1.81,
  // TODO: Add all other shadowbox SKUs from schema.ts
};

export const CANVAS_FRAME_MOULDING_PRICES: Record<string, number> = {
  "10117": 0.8,
  "10104": 1.14,
  "10105": 1.14,
  // TODO: Add all other canvas SKUs from schema.ts
};

// Combined lookup for all frame classes
export const ALL_FRAME_MOULDING_PRICES: Record<string, number> = {
  ...PICTURE_FRAME_MOULDING_PRICES,
  ...SHADOWBOX_FRAME_MOULDING_PRICES,
  ...CANVAS_FRAME_MOULDING_PRICES,
};

/**
 * Calculate linear feet needed for a frame moulding
 * Based on interior frame dimensions
 * Adds 8 inches for waste/corners, rounds UP to nearest foot
 */
export function calculateFrameLinearFeet(
  interiorWidthIn: number,
  interiorHeightIn: number
): number {
  const totalInches = (interiorWidthIn + interiorHeightIn) * 2 + 8;
  const linearFeet = totalInches / 12;
  return Math.ceil(linearFeet);
}

/**
 * Calculate frame moulding retail price
 * Uses 8x markup (configurable via PRICING_MARKUPS.FRAME_MOULDING)
 */
export function calculateFrameMouldingPrice(
  interiorWidthIn: number,
  interiorHeightIn: number,
  pricePerFoot: number
): number {
  const linearFeet = calculateFrameLinearFeet(interiorWidthIn, interiorHeightIn);
  return linearFeet * pricePerFoot * PRICING_MARKUPS.FRAME_MOULDING;
}

/**
 * Calculate frame moulding price by SKU
 * Searches both picture frame and shadowbox frame classes
 * Returns null if SKU not found
 */
export function calculateFramePriceBySku(
  interiorWidthIn: number,
  interiorHeightIn: number,
  sku: string
): number | null {
  const pricePerFoot = ALL_FRAME_MOULDING_PRICES[sku];
  if (pricePerFoot === undefined) return null;
  return calculateFrameMouldingPrice(interiorWidthIn, interiorHeightIn, pricePerFoot);
}

// New pricing engine v2 configuration
export const NEW_PRICING_CONFIG = {
  // Marketing load: 12.5% (divide by 0.875)
  MARKETING_LOAD: 0.125,

  // Price floor: $15.99 minimum retail price
  FLOOR_PRICE: 15.99,

  // Handling fee anchor points (perimeter in inches → fee in dollars)
  // Linearly interpolated between anchor points
  HANDLING_ANCHORS: [
    { perimeter: 16, fee: 6 }, // 4×4 = 16" perimeter
    { perimeter: 36, fee: 8 }, // 8×10 = 36" perimeter
    { perimeter: 72, fee: 11 }, // 16×20 = 72" perimeter
    { perimeter: 88, fee: 15 }, // 20×24 = 88" perimeter
    { perimeter: 120, fee: 23 }, // 24×36 = 120" perimeter
    { perimeter: 140, fee: 32 }, // 30×40 = 140" perimeter
  ],

  // Multiplier anchor points (materialCost → multiplier)
  // 6× base declining as material cost increases (margin compression)
  // Linearly interpolated between anchor points
  MULTIPLIER_ANCHORS: [
    { cost: 0, mult: 6.0 },
    { cost: 10, mult: 6.0 },
    { cost: 25, mult: 5.2 },
    { cost: 60, mult: 4.4 },
    { cost: 120, mult: 3.6 },
    { cost: 200, mult: 3.0 },
    { cost: 400, mult: 2.6 },
  ],

  // Oversize surcharge thresholds (perimeter in inches)
  // Protects against fulfillment/shipping risk on large frames
  OVERSIZE_THRESHOLDS: [
    { perimeter: 140, surcharge: 25 }, // 30×40 and up
    { perimeter: 120, surcharge: 15 }, // 24×36 and up
  ],
} as const;

/**
 * Round up to nearest .99 ending
 * Example: 15.50 → 15.99, 16.00 → 16.99
 */
function roundUpTo99(value: number): number {
  const rounded = Math.ceil(value);
  return rounded - 0.01;
}

/**
 * Get handling fee based on perimeter
 * Linearly interpolates between anchor points
 */
function getHandlingFee(perimeter: number): number {
  const anchors = NEW_PRICING_CONFIG.HANDLING_ANCHORS;
  if (perimeter <= anchors[0]!.perimeter) return anchors[0]!.fee;
  if (perimeter >= anchors[anchors.length - 1]!.perimeter) return anchors[anchors.length - 1]!.fee;

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (!a || !b) continue;

    if (perimeter >= a.perimeter && perimeter <= b.perimeter) {
      const ratio = (perimeter - a.perimeter) / (b.perimeter - a.perimeter);
      return a.fee + ratio * (b.fee - a.fee);
    }
  }

  return anchors[anchors.length - 1]!.fee;
}

/**
 * Get multiplier based on material cost
 * Linearly interpolates between anchor points
 */
function getMultiplier(materialCost: number): number {
  const anchors = NEW_PRICING_CONFIG.MULTIPLIER_ANCHORS;
  if (materialCost <= anchors[0]!.cost) return anchors[0]!.mult;
  if (materialCost >= anchors[anchors.length - 1]!.cost) return anchors[anchors.length - 1]!.mult;

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (!a || !b) continue;

    if (materialCost >= a.cost && materialCost <= b.cost) {
      const ratio = (materialCost - a.cost) / (b.cost - a.cost);
      return a.mult + ratio * (b.mult - a.mult);
    }
  }

  return anchors[anchors.length - 1]!.mult;
}

/**
 * Get oversize surcharge based on perimeter
 */
function getOversizeSurcharge(perimeter: number): number {
  const thresholds = NEW_PRICING_CONFIG.OVERSIZE_THRESHOLDS;
  for (const threshold of thresholds) {
    if (perimeter >= threshold.perimeter) {
      return threshold.surcharge;
    }
  }
  return 0;
}

/**
 * Calculate complete frame price with full breakdown
 * Uses new pricing engine v2
 */
export interface FramePricingBreakdown {
  // Input dimensions
  interiorWidth: number;
  interiorHeight: number;
  perimeter: number;

  // Material costs
  frameMaterialCost: number;
  acrylicMaterialCost: number;
  totalMaterialCost: number;

  // Pricing components
  multiplier: number;
  handlingFee: number;
  oversizeSurcharge: number;

  // Calculations
  preMarketing: number;
  withMarketing: number;

  // Final price
  hitFloor: boolean;
  finalPrice: number;
}

export function calculateFramePriceWithBreakdown(
  interiorWidthIn: number,
  interiorHeightIn: number,
  framePricePerFoot: number,
  glazingType:
    | "STANDARD_ACRYLIC"
    | "NON_GLARE_ACRYLIC"
    | "STANDARD_GLASS"
    | "NON_GLARE_GLASS" = "STANDARD_ACRYLIC"
): FramePricingBreakdown {
  // Calculate material costs
  const linearFeet = calculateFrameLinearFeet(interiorWidthIn, interiorHeightIn);
  const frameMaterialCost = linearFeet * framePricePerFoot;

  const sqIn = interiorWidthIn * interiorHeightIn;
  const glazingConfig = COMPONENT_PRICING[glazingType];
  const acrylicMaterialCost = sqIn * glazingConfig.costPerSqIn;

  const totalMaterialCost = frameMaterialCost + acrylicMaterialCost;

  // Calculate perimeter for handling fee and oversize
  const perimeter = 2 * (interiorWidthIn + interiorHeightIn);

  // Get pricing components
  const multiplier = getMultiplier(totalMaterialCost);
  const handlingFee = getHandlingFee(perimeter);
  const oversizeSurcharge = getOversizeSurcharge(perimeter);

  // Calculate pre-marketing price
  const preMarketing = totalMaterialCost * multiplier + handlingFee + oversizeSurcharge;

  // Apply marketing gross-up
  const withMarketing = preMarketing / (1 - NEW_PRICING_CONFIG.MARKETING_LOAD);

  // Round UP to .99 ending
  const rounded = roundUpTo99(withMarketing);

  // Apply floor
  const hitFloor = rounded < NEW_PRICING_CONFIG.FLOOR_PRICE;
  const finalPrice = hitFloor ? NEW_PRICING_CONFIG.FLOOR_PRICE : rounded;

  return {
    interiorWidth: interiorWidthIn,
    interiorHeight: interiorHeightIn,
    perimeter,
    frameMaterialCost,
    acrylicMaterialCost,
    totalMaterialCost,
    multiplier,
    handlingFee,
    oversizeSurcharge,
    preMarketing,
    withMarketing,
    hitFloor,
    finalPrice,
  };
}

/**
 * Calculate complete frame price (simple version, returns final price only)
 * Uses new pricing engine v2
 */
export function calculateCompleteFramePrice(
  interiorWidthIn: number,
  interiorHeightIn: number,
  framePricePerFoot: number,
  glazingType:
    | "STANDARD_ACRYLIC"
    | "NON_GLARE_ACRYLIC"
    | "STANDARD_GLASS"
    | "NON_GLARE_GLASS" = "STANDARD_ACRYLIC"
): number {
  return calculateFramePriceWithBreakdown(
    interiorWidthIn,
    interiorHeightIn,
    framePricePerFoot,
    glazingType
  ).finalPrice;
}

/**
 * Calculate complete frame price by SKU
 * Returns null if SKU not found
 */
export function calculateCompleteFramePriceBySku(
  interiorWidthIn: number,
  interiorHeightIn: number,
  sku: string,
  glazingType:
    | "STANDARD_ACRYLIC"
    | "NON_GLARE_ACRYLIC"
    | "STANDARD_GLASS"
    | "NON_GLARE_GLASS" = "STANDARD_ACRYLIC"
): number | null {
  const pricePerFoot = ALL_FRAME_MOULDING_PRICES[sku];
  if (pricePerFoot === undefined) return null;
  return calculateCompleteFramePrice(interiorWidthIn, interiorHeightIn, pricePerFoot, glazingType);
}
