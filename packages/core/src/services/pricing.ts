/**
 * Pricing calculation service
 * Centralizes all pricing logic for frame configurations
 * Uses NEW pricing engine v2 from schema.ts
 *
 * @packageDocumentation
 */

// Import types from @framecraft/types
import type { FrameConfiguration, PricingBreakdown } from "@framecraft/types";

// Import products service from same package
import { getPricingConfig, getFrameStyleById, getMatColorById, getGlassTypeById } from "./products";

// Import pricing engine functions from temporary pricing-engine module
// TODO: Extract full pricing engine from @shared/schema - this is a minimal version
// The pricing-engine.ts file contains essential functions extracted temporarily
// Full extraction of all pricing engine functions should be done in a future ticket
import {
  calculateFramePriceBySku,
  ALL_FRAME_MOULDING_PRICES,
  COMPONENT_PRICING,
  calculateMatPriceForDesigner,
  calculateCompleteFramePriceBySku,
} from "./pricing-engine";

/**
 * Calculate complete pricing breakdown for a frame configuration
 * @param config - Frame configuration object
 * @returns Detailed pricing breakdown with all costs
 * @throws Error if product IDs are invalid or data is malformed
 */
export function calculatePricing(config: FrameConfiguration): PricingBreakdown {
  const pricingConfig = getPricingConfig();

  // Get product details with validation
  const frameStyle = getFrameStyleById(config.frameStyleId);
  const matColor = getMatColorById(config.matColorId);
  // matInnerColor is available but not used in current pricing calculation
  // const matInnerColor = config.matInnerColorId ? getMatColorById(config.matInnerColorId) : undefined;
  const glassType = getGlassTypeById(config.glassTypeId);

  // Validate required products exist
  if (!frameStyle) {
    console.error("Invalid frame style ID:", config.frameStyleId);
    throw new Error(`Frame style not found: ${config.frameStyleId}`);
  }

  if (!matColor && config.matType !== "none") {
    console.error("Invalid mat color ID:", config.matColorId);
    throw new Error(`Mat color not found: ${config.matColorId}`);
  }

  if (!glassType) {
    console.error("Invalid glass type ID:", config.glassTypeId);
    throw new Error(`Glass type not found: ${config.glassTypeId}`);
  }

  // Calculate dimensions
  const artWidth = config.artworkWidth;
  const artHeight = config.artworkHeight;
  const matBorder = config.matType !== "none" ? config.matBorderWidth : 0;
  const bottomWeightedExtra = config.bottomWeighted ? 0.5 : 0;

  // Frame dimensions include mat border (plus extra for bottom-weighted)
  const frameWidth = artWidth + matBorder * 2;
  const frameHeight = artHeight + matBorder * 2 + bottomWeightedExtra;

  // Perimeter for frame and mat pricing (in inches)
  const perimeter = (frameWidth + frameHeight) * 2;

  // Area calculations
  const area = artWidth * artHeight; // square inches
  // areaSqFt is calculated but not used (glass pricing uses frameArea instead)
  // const areaSqFt = area / 144; // square feet for glass pricing

  // Calculate individual prices using NEW pricing engine v2

  // Determine glazing type for new pricing engine
  const isNonGlare =
    glassType.id.includes("non-glare") || glassType.name.toLowerCase().includes("non-glare");
  const glazingType = isNonGlare ? "NON_GLARE_ACRYLIC" : "STANDARD_ACRYLIC";

  // Frame + Glazing: Use NEW pricing engine v2 when SKU is available
  // This applies multiplier schedule, handling fees, oversize surcharges, marketing load, and floor
  let framePrice = 0;
  let glassPrice = 0; // Glass is included in frame price with new engine

  if (frameStyle.sku && ALL_FRAME_MOULDING_PRICES[frameStyle.sku]) {
    // Use NEW pricing engine v2 - returns complete frame+glazing price
    const completePrice = calculateCompleteFramePriceBySku(
      frameWidth,
      frameHeight,
      frameStyle.sku,
      glazingType
    );

    if (completePrice !== null) {
      // Frame price includes glazing with new engine
      framePrice = completePrice;
      glassPrice = 0; // Already included in frame price
    } else {
      // Fallback to legacy pricing
      framePrice = calculateFramePriceBySku(frameWidth, frameHeight, frameStyle.sku) ?? 0;
      const frameArea = frameWidth * frameHeight;
      const glassConfig = isNonGlare
        ? COMPONENT_PRICING.NON_GLARE_ACRYLIC
        : COMPONENT_PRICING.STANDARD_ACRYLIC;
      glassPrice = frameArea * glassConfig.costPerSqIn * glassConfig.designerMarkup;
    }
  } else {
    // Fallback for frames without SKU mapping - use legacy perimeter calculation
    framePrice = perimeter * frameStyle.pricePerInch;
    const frameArea = frameWidth * frameHeight;
    const glassConfig = isNonGlare
      ? COMPONENT_PRICING.NON_GLARE_ACRYLIC
      : COMPONENT_PRICING.STANDARD_ACRYLIC;
    glassPrice = frameArea * glassConfig.costPerSqIn * glassConfig.designerMarkup;
  }

  // Mat pricing with TRUE sheet-based pricing (2.5x markup in frame designers)
  let matPrice = 0;
  if (config.matType !== "none" && matColor) {
    const singleMatPrice = calculateMatPriceForDesigner(frameWidth, frameHeight, matColor.name);
    if (singleMatPrice !== null) {
      // Apply double mat multiplier if needed (1.0 for single, 1.5 for double)
      const matMultiplier =
        (pricingConfig.matMultipliers as Record<string, number>)[config.matType] ?? 1.0;
      matPrice = singleMatPrice * matMultiplier;
    } else {
      // Fallback to legacy perimeter pricing if mat not found in TRUE pricing
      const pricePerInch = matColor.pricePerInch ?? 0.1;
      const matMultiplier =
        (pricingConfig.matMultipliers as Record<string, number>)[config.matType] ?? 1.0;
      matPrice = perimeter * pricePerInch * matMultiplier;
    }
  }

  // Print pricing (only for print-and-frame with image)
  const printPrice =
    config.serviceType === "print-and-frame" && config.imageUrl
      ? area * pricingConfig.printAndFrame.pricePerSquareInch
      : 0;

  // Calculate total dimensions for oversize fee
  const totalDimensions = frameWidth + frameHeight;
  let oversizeFee = 0;
  let isTooLarge = false;

  if (totalDimensions >= pricingConfig.oversizeFees.threshold100Plus.minDimension) {
    isTooLarge = true;
  } else if (
    totalDimensions >= pricingConfig.oversizeFees.threshold75to99.minDimension &&
    totalDimensions <= pricingConfig.oversizeFees.threshold75to99.maxDimension
  ) {
    oversizeFee = pricingConfig.oversizeFees.threshold75to99.fee;
  }

  // Calculate totals
  const subtotal = framePrice + matPrice + glassPrice + printPrice;
  const total = subtotal + oversizeFee;

  return {
    framePrice,
    matPrice,
    glassPrice,
    printPrice,
    oversizeFee,
    subtotal,
    total,
    isTooLarge,
    totalDimensions,
  };
}

/**
 * Format price for display
 * @param price - Numeric price
 * @returns Formatted price string (e.g., "$99.99")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

/**
 * Calculate price per square inch for comparison
 * @param total - Total price
 * @param width - Width in inches
 * @param height - Height in inches
 * @returns Price per square inch
 */
export function calculatePricePerSquareInch(total: number, width: number, height: number): number {
  const area = width * height;
  return area > 0 ? total / area : 0;
}
