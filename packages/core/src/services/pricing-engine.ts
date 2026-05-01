/**
 * Pricing engine (v2 frame + glazing, mat sheet costs, component rates).
 *
 * Moulding $/ft tables, `MAT_PRICING`, and `COMPONENT_PRICING` are kept aligned with
 * `a-custom-frame-sizes-original/shared/schema.ts` (see `pricing-engine.doc-spec.test.ts`).
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

/** Kept in sync with a-custom-frame-sizes-original/shared/schema.ts MAT_PRICING */
export const MAT_PRICING: MatPricing[] = [
  { name: "White", type: "regular", sku32x40: "VB222", price32x40: 3.46, sku40x60: "VB8222", price40x60: 11.85 },
  { name: "Black", type: "regular", sku32x40: "VB221", price32x40: 3.46, sku40x60: "VB8221", price40x60: 11.85 },
  { name: "Dark Gray", type: "regular", sku32x40: "VB161", price32x40: 5.0, sku40x60: "CB8-569", price40x60: 13.77 },
  { name: "Light Gray", type: "regular", sku32x40: "VB535", price32x40: 5.77, sku40x60: "CBW8-535", price40x60: 16.77 },
  { name: "Oyster Shell", type: "regular", sku32x40: "VB163", price32x40: 5.77, sku40x60: "VB8163", price40x60: 13.42 },
  { name: "Off White", type: "regular", sku32x40: "VB502", price32x40: 5.0, sku40x60: "CB8-502", price40x60: 11.0 },
  { name: "Beige", type: "regular", sku32x40: "VB511", price32x40: 5.0, sku40x60: "CB8-514", price40x60: 13.77 },
  { name: "Brown", type: "regular", sku32x40: "VB710", price32x40: 5.0, sku40x60: null, price40x60: null },
  { name: "Dark Red", type: "regular", sku32x40: "VB038", price32x40: 5.0, sku40x60: "CB8-038", price40x60: 11.0 },
  { name: "Red", type: "regular", sku32x40: "VB459", price32x40: 5.0, sku40x60: "VB8459", price40x60: 12.16 },
  { name: "Orange", type: "regular", sku32x40: "VB152", price32x40: 5.77, sku40x60: "C89876", price40x60: 29.67 },
  { name: "Mustard", type: "regular", sku32x40: "VB520", price32x40: 5.77, sku40x60: "C89894", price40x60: 29.67 },
  { name: "Yellow", type: "regular", sku32x40: "VB110", price32x40: 5.77, sku40x60: "C89518", price40x60: 29.67 },
  { name: "Spring Green", type: "regular", sku32x40: "VB361", price32x40: 5.77, sku40x60: null, price40x60: null },
  { name: "Green", type: "regular", sku32x40: "VB527", price32x40: 6.07, sku40x60: null, price40x60: null },
  { name: "Olive", type: "regular", sku32x40: "VB358", price32x40: 5.77, sku40x60: "C89822", price40x60: 29.67 },
  { name: "Forest Green", type: "regular", sku32x40: "VB524", price32x40: 5.0, sku40x60: "CB8-524", price40x60: 11.0 },
  { name: "Navy Blue", type: "regular", sku32x40: "VB131", price32x40: 5.77, sku40x60: "CB8-131", price40x60: 11.77 },
  { name: "Blue", type: "regular", sku32x40: "VB334", price32x40: 3.46, sku40x60: "CB8-334", price40x60: 11.0 },
  { name: "Ocean Blue", type: "regular", sku32x40: "VB532", price32x40: 5.77, sku40x60: null, price40x60: null },
  { name: "Teal Blue", type: "regular", sku32x40: "CB531", price32x40: 4.5, sku40x60: null, price40x60: null },
  { name: "Steel Blue", type: "regular", sku32x40: "VB143", price32x40: 5.0, sku40x60: null, price40x60: null },
  { name: "French Blue", type: "regular", sku32x40: "VB538", price32x40: 5.77, sku40x60: null, price40x60: null },
  { name: "Sky Blue", type: "regular", sku32x40: "VB534", price32x40: 5.0, sku40x60: null, price40x60: null },
  { name: "Purple", type: "regular", sku32x40: "VB120", price32x40: 5.77, sku40x60: null, price40x60: null },
  { name: "Pansy", type: "regular", sku32x40: "VB548", price32x40: 5.0, sku40x60: null, price40x60: null },
  { name: "Pink", type: "regular", sku32x40: "VB102", price32x40: 5.77, sku40x60: null, price40x60: null },
  { name: "Terracotta", type: "regular", sku32x40: "VB153", price32x40: 5.59, sku40x60: "C89834", price40x60: 29.67 },
  { name: "White Suede", type: "premium", sku32x40: "VB9125", price32x40: 19.19, sku40x60: "C87180", price40x60: 85.87 },
  { name: "Black Suede", type: "premium", sku32x40: "VB9142", price32x40: 19.19, sku40x60: "CB89-142", price40x60: 58.36 },
  { name: "Dark Gray Suede", type: "premium", sku32x40: "VB9141", price32x40: 19.19, sku40x60: "CB89-141", price40x60: 58.36 },
  { name: "Light Gray Suede", type: "premium", sku32x40: "VB9140", price32x40: 19.19, sku40x60: "C87158", price40x60: 85.87 },
  { name: "Beige Suede", type: "premium", sku32x40: "VB9137", price32x40: 19.19, sku40x60: "CB89-137", price40x60: 58.36 },
  { name: "Dark Red Suede", type: "premium", sku32x40: "VB9134", price32x40: 19.19, sku40x60: "C87112", price40x60: 85.87 },
  { name: "Red Suede", type: "premium", sku32x40: "VB9135", price32x40: 19.19, sku40x60: "CB89-135", price40x60: 58.36 },
  { name: "Green Suede", type: "premium", sku32x40: "VB9129", price32x40: 19.19, sku40x60: "CB89-129", price40x60: 58.36 },
  { name: "Navy Blue Suede", type: "premium", sku32x40: "VB9133", price32x40: 19.19, sku40x60: "CB89-133", price40x60: 58.36 },
  { name: "Blue Suede", type: "premium", sku32x40: "VB9124", price32x40: 19.19, sku40x60: "B85501", price40x60: 72.11 },
  { name: "Purple Suede", type: "premium", sku32x40: "CB9-148", price32x40: 23.12, sku40x60: "B85636", price40x60: 72.11 },
  { name: "Metallic Gold", type: "premium", sku32x40: "VB577", price32x40: 6.5, sku40x60: "CB8-577", price40x60: 16.46 },
  { name: "Metallic Silver", type: "premium", sku32x40: "VB5074", price32x40: 7.76, sku40x60: "C89850", price40x60: 34.17 },
  { name: "Football Texture", type: "premium", sku32x40: "VB62101", price32x40: 20.93, sku40x60: null, price40x60: null },
  { name: "Basketball Texture", type: "premium", sku32x40: "VB62100", price32x40: 20.93, sku40x60: null, price40x60: null },
  { name: "White with Black Core", type: "premium", sku32x40: "VB697", price32x40: 5.99, sku40x60: "C863297", price40x60: 25.95 },
  { name: "Black with Black Core", type: "premium", sku32x40: "VB6277", price32x40: 5.99, sku40x60: "VB86277", price40x60: 15.99 },
  { name: "White Canvas", type: "premium", sku32x40: "AC4881", price32x40: 10.0, sku40x60: null, price40x60: null },
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
  // Plywood (shadowbox backing only, no dedicated page)
  PLYWOOD: {
    costPerSqIn: 0.00998,
    dedicatedMarkup: PRICING_MARKUPS.DEDICATED_PAGE,
    designerMarkup: PRICING_MARKUPS.DESIGNER_PLYWOOD,
    minimumPrice: null,
    availableInDesigners: true,
    hasDedicatedPage: false,
  },
  // Foam board (dedicated page)
  STANDARD_WHITE_FOAM: {
    costPerSqIn: 0.00125,
    dedicatedMarkup: PRICING_MARKUPS.DEDICATED_PAGE,
    designerMarkup: PRICING_MARKUPS.DESIGNER_STANDARD,
    minimumPrice: 6.95,
    availableInDesigners: true,
    hasDedicatedPage: true,
  },
  STANDARD_BLACK_FOAM: {
    costPerSqIn: 0.00458,
    dedicatedMarkup: PRICING_MARKUPS.DEDICATED_PAGE,
    designerMarkup: null,
    minimumPrice: 7.95,
    availableInDesigners: false,
    hasDedicatedPage: true,
  },
  SELF_ADHESIVE_WHITE_FOAM: {
    costPerSqIn: 0.00828,
    dedicatedMarkup: PRICING_MARKUPS.DEDICATED_PAGE,
    designerMarkup: null,
    minimumPrice: 9.95,
    availableInDesigners: false,
    hasDedicatedPage: true,
  },
} as const;

export type ComponentType = keyof typeof COMPONENT_PRICING;

/**
 * Calculate component price for dedicated standalone pages (e.g. foam board, acrylic).
 * Uses dedicatedMarkup with minimum floor when defined.
 */
export function calculateDedicatedPagePrice(
  widthIn: number,
  heightIn: number,
  componentType: ComponentType
): number {
  const config = COMPONENT_PRICING[componentType as keyof typeof COMPONENT_PRICING];
  if (!config) return 0;
  const sqIn = widthIn * heightIn;
  const rawPrice = sqIn * config.costPerSqIn * config.dedicatedMarkup;
  if (config.minimumPrice != null) {
    return Math.max(rawPrice, config.minimumPrice);
  }
  return rawPrice;
}

/** Kept in sync with a-custom-frame-sizes-original/shared/schema.ts */
export const PICTURE_FRAME_MOULDING_PRICES: Record<string, number> = {
  "206": 0.75,
  "6301": 1.14,
  "6711": 1.24,
  "8446": 1.22,
  "8989": 0.45,
  "9935": 1.0,
  "8694": 0.45,
  "8575": 1.03,
  "8576": 1.03,
  "8744": 1.033,
  "8745": 1.033,
  "8750": 1.033,
  "8752": 1.82,
  "8837": 3.44,
  "8838": 3.44,
  "8981": 2.0,
  "9135": 1.64,
  "9160": 1.17,
  "9163": 1.17,
  "9667": 1.57,
  "9885": 2.06,
  "9932": 1.0,
  "10485": 0.98,
  "10569": 1.18,
  "10570": 1.44,
  "10587": 1.44,
  "10588": 1.44,
  "10618": 1.35,
  "10712": 0.99,
  "10713": 0.99,
  "10714": 0.99,
  "10783": 2.14,
  "10827": 1.1,
  "10828": 1.1,
  "10829": 1.1,
  "10832": 1.1,
  "10833": 1.1,
  "10928": 3.08,
  "11153": 2.04,
  "11239": 1.29,
};

export const SHADOWBOX_FRAME_MOULDING_PRICES: Record<string, number> = {
  "8693": 0.72,
  "8990": 0.72,
  "9448": 1.81,
  "9785": 5.21,
  "9959": 1.49,
  "10474": 1.22,
  "10475": 1.22,
  "10478": 1.22,
  "10479": 1.22,
  "10727": 2.34,
  "10728": 2.34,
  "10729": 2.34,
  "10772": 2.46,
  "10774": 1.18,
  "10775": 1.18,
  "10776": 1.18,
  "10779": 2.46,
  "10781": 3.08,
  "10897": 2.65,
  "10960": 1.52,
  "84154": 1.86,
  "84159": 1.86,
  "84161": 1.86,
  "84162": 1.86,
};

export const CANVAS_FRAME_MOULDING_PRICES: Record<string, number> = {
  "10117": 0.8,
  "10104": 1.14,
  "10105": 1.14,
  "10426": 1.14,
  "10427": 1.14,
  "10428": 1.14,
  "10494": 0.8,
  "10495": 0.8,
  "10564": 1.73,
  "10565": 1.73,
  "10627": 1.49,
  "10694": 1.06,
  "10764": 1.16,
  "10765": 1.16,
  "10766": 1.16,
  "10767": 1.16,
  "11345": 0.98,
  "11351": 0.98,
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

/** Linear interpolation (matches a-custom-frame-sizes-original/shared/schema.ts) */
function lerpValue(x: number, x0: number, x1: number, y0: number, y1: number): number {
  if (x1 === x0) return y0;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

/**
 * Round UP to nearest .99 ending (matches legacy schema.ts)
 */
function roundUpTo99(price: number): number {
  const rounded = Math.ceil(price) - 0.01;
  return rounded < price ? rounded + 1 : rounded;
}

/**
 * Handling fee by perimeter — interpolate between anchors; below min clamp;
 * above max extrapolate using last segment (same as legacy schema.ts).
 */
export function getHandlingFee(perimeter: number): number {
  const anchors = NEW_PRICING_CONFIG.HANDLING_ANCHORS;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (!a || !b) continue;
    if (perimeter >= a.perimeter && perimeter <= b.perimeter) {
      return lerpValue(perimeter, a.perimeter, b.perimeter, a.fee, b.fee);
    }
  }
  if (perimeter < anchors[0]!.perimeter) return anchors[0]!.fee;
  const last = anchors[anchors.length - 1]!;
  const prev = anchors[anchors.length - 2]!;
  return lerpValue(perimeter, prev.perimeter, last.perimeter, prev.fee, last.fee);
}

/**
 * Multiplier by material cost — interpolate between anchors; clamp outside range.
 */
export function getMultiplier(materialCost: number): number {
  const anchors = NEW_PRICING_CONFIG.MULTIPLIER_ANCHORS;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (!a || !b) continue;
    if (materialCost >= a.cost && materialCost <= b.cost) {
      return lerpValue(materialCost, a.cost, b.cost, a.mult, b.mult);
    }
  }
  if (materialCost < anchors[0]!.cost) return anchors[0]!.mult;
  return anchors[anchors.length - 1]!.mult;
}

/**
 * Oversize surcharge: +$15 at 120"+, +$25 at 140"+ (first matching threshold wins)
 */
export function getOversizeSurcharge(perimeter: number): number {
  for (const threshold of NEW_PRICING_CONFIG.OVERSIZE_THRESHOLDS) {
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

// ============================================================================
// MAT PRICING ENGINE (v2) — Standalone Mat Designer
// ============================================================================

/** V-groove tiered retail pricing (kept in sync with a-custom-frame-sizes-original/shared/schema.ts) */
export const VGROOVE_PRICING = {
  SMALL_THRESHOLD: 44, // W + H <= 44" uses small price
  SMALL_PRICE: 9.95,
  LARGE_PRICE: 14.95,
} as const;

/** Backing kit cost constants (VB222 backing board + clear bag) */
export const BACKING_KIT_PRICING = {
  VB222_FULL_SHEET_COST: 3.46, // Same cost as White mat 32×40 sheet
  BAG_COST_PER_UNIT: 0.30,     // Clear self-seal bag per mat
} as const;

/** $7.99 floor for standalone mat prices */
export const MAT_PRICING_CONFIG = {
  FLOOR_PRICE: 7.99,
} as const;

/**
 * V-groove retail price: tiered by mat size.
 * $9.95 for W+H ≤ 44", $14.95 for larger mats.
 */
export function calculateVGroovePrice(widthIn: number, heightIn: number): number {
  return widthIn + heightIn <= VGROOVE_PRICING.SMALL_THRESHOLD
    ? VGROOVE_PRICING.SMALL_PRICE
    : VGROOVE_PRICING.LARGE_PRICE;
}

/**
 * Raw backing-kit cost (NOT yet marked up): VB222 sheet fraction + bag.
 * Should be summed with mat raw cost before applying the v2 formula.
 */
export function calculateBackingKitRawCost(widthIn: number, heightIn: number): number {
  const fraction = getMatSheetFraction(widthIn, heightIn) ?? 1.0;
  return BACKING_KIT_PRICING.VB222_FULL_SHEET_COST * fraction + BACKING_KIT_PRICING.BAG_COST_PER_UNIT;
}

/**
 * Apply the v2 pricing engine to a raw mat material cost.
 * Uses the same multiplier schedule, handling fees, oversize surcharges,
 * and marketing load as frames — but with a $7.99 floor.
 *
 * When backing & bags are selected, add their raw cost to `materialCost`
 * BEFORE calling this function (per business rule).
 */
export function calculateMatPriceV2(
  widthIn: number,
  heightIn: number,
  materialCost: number
): number {
  const perimeter = 2 * (widthIn + heightIn);
  const multiplier = getMultiplier(materialCost);
  const handlingFee = getHandlingFee(perimeter);
  const oversizeSurcharge = getOversizeSurcharge(perimeter);

  const preMarketing = materialCost * multiplier + handlingFee + oversizeSurcharge;
  const withMarketing = preMarketing / (1 - NEW_PRICING_CONFIG.MARKETING_LOAD);
  const rounded = roundUpTo99(withMarketing);

  return rounded < MAT_PRICING_CONFIG.FLOOR_PRICE ? MAT_PRICING_CONFIG.FLOOR_PRICE : rounded;
}

/**
 * Calculate complete standalone mat price.
 * Sums mat + backing raw costs, applies v2 formula, then adds v-groove retail.
 */
export function calculateStandaloneMatPrice(
  widthIn: number,
  heightIn: number,
  matName: string,
  options: {
    singleOrDouble?: "single" | "double";
    bottomMatName?: string;
    backingKit?: boolean;
    vGroove?: boolean;
  } = {}
): number {
  const { singleOrDouble = "single", bottomMatName, backingKit = false, vGroove = false } = options;

  // Raw mat material cost
  let matRawCost = calculateMatCost(widthIn, heightIn, matName) ?? 0;
  if (singleOrDouble === "double" && bottomMatName) {
    matRawCost += calculateMatCost(widthIn, heightIn, bottomMatName) ?? matRawCost;
  }

  // Sum backing raw cost before formula (per business rule)
  const rawCost = matRawCost + (backingKit ? calculateBackingKitRawCost(widthIn, heightIn) : 0);

  // Apply v2 formula
  const matRetail = calculateMatPriceV2(widthIn, heightIn, rawCost);

  // V-groove is a flat retail add-on (not run through the multiplier formula)
  return matRetail + (vGroove ? calculateVGroovePrice(widthIn, heightIn) : 0);
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
