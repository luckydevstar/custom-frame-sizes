/**
 * Comic Frame Pricing Calculator Hook
 *
 * Comprehensive pricing for comic book shadowbox frames including:
 * - Shadowbox frame base pricing via new pricing engine v2
 * - Per-opening mat surcharges for multi-comic layouts
 * - Slab depth modifier for graded comics
 * - Glass upgrade pricing (included in frame price from engine)
 * - Security hardware upgrade
 * - Brass plaque addon
 */

import { useMemo } from "react";
import {
  getComicLayout,
  INTERIOR_DIMENSIONS,
  type ComicLayoutType,
} from "../utils/specialty/comic-layouts";
import { getComicFormatById, isSlabbedFormat } from "../utils/specialty/comic-formats";
import { calculatePricing } from "../services/pricing";
import type { FrameConfiguration } from "@framecraft/types";

// TODO: Extract BRASS_NAMEPLATE_SPECS to @framecraft/types
// For now, using a constant placeholder
const BRASS_NAMEPLATE_PRICE = 29;

// Pricing Constants
const MAT_SURCHARGE_PER_OPENING = 15; // Additional cost per comic opening (first is free)
const SLAB_DEPTH_MODIFIER = 25; // Extra cost for slabbed comics (deeper frame)
const SECURITY_HARDWARE_UPCHARGE = 8.95; // Upgrade to security hardware

export interface ComicPricingBreakdown {
  framePrice: number; // Frame + glazing cost from pricing engine
  matPrice: number; // Mat surcharge for multiple openings
  glassPrice: number; // Glass upgrade cost (included in framePrice with new engine)
  hardwarePrice: number; // Hardware upgrade cost (if any)
  nameplatePrice: number; // Brass nameplate addon (if enabled)
  slabModifier: number; // Additional cost for slabbed format
  subtotal: number; // Sum before quantity
  total: number; // Final price (same as subtotal for single item)
}

export interface ComicPricingConfig {
  frame?: { id: string; sku?: string; pricePerInch?: number } | null;
  layoutId: ComicLayoutType;
  formatId: string;
  matType: "none" | "single" | "double";
  matBorder: number;
  glass?: { id: string } | null;
  hardware: "standard" | "security";
  brassPlaqueEnabled: boolean;
}

/**
 * Calculate comprehensive pricing for comic frame configuration
 * Uses new pricing engine v2 for frame+glazing cost
 */
export function useComicPricing(config: ComicPricingConfig): ComicPricingBreakdown {
  return useMemo(() => {
    const { frame, layoutId, formatId, matType, glass, hardware, brassPlaqueEnabled } = config;

    // Return zero pricing if no layout selected yet
    if (!layoutId) {
      return {
        framePrice: 0,
        matPrice: 0,
        glassPrice: 0,
        hardwarePrice: 0,
        nameplatePrice: 0,
        slabModifier: 0,
        subtotal: 0,
        total: 0,
      };
    }

    // Get layout details for comic count
    const layout = getComicLayout(layoutId);
    const format = getComicFormatById(formatId);

    if (!format) {
      console.warn(`Comic format not found: ${formatId}`);
      return {
        framePrice: 0,
        matPrice: 0,
        glassPrice: 0,
        hardwarePrice: 0,
        nameplatePrice: 0,
        slabModifier: 0,
        subtotal: 0,
        total: 0,
      };
    }

    // 1. Frame + Glazing Price from new pricing engine v2
    let framePrice = 0;

    if (frame?.id && frame?.sku) {
      // Get interior dimensions from lookup table
      const isGraded = isSlabbedFormat(formatId);
      const interiorDims = INTERIOR_DIMENSIONS[layoutId];

      if (interiorDims) {
        const rabbet = isGraded ? interiorDims.gr : interiorDims.ng;

        // Create FrameConfiguration for pricing engine
        // Use interior dimensions as artwork size, matType 'none' since mat is handled separately
        const frameConfig: FrameConfiguration = {
          serviceType: "frame-only",
          artworkWidth: rabbet.width,
          artworkHeight: rabbet.height,
          frameStyleId: frame.id,
          matType: "none", // Mat handled separately for comic frames
          matBorderWidth: 0,
          matRevealWidth: 0,
          matColorId: "", // Not needed when matType is 'none'
          glassTypeId: glass?.id || "standard",
        };

        try {
          const pricingResult = calculatePricing(frameConfig);
          // Frame price includes glazing with new pricing engine v2
          framePrice = pricingResult.framePrice;
        } catch (error) {
          console.warn("Pricing calculation failed, using fallback:", error);
          // Fallback to a reasonable estimate if pricing fails
          framePrice = 120; // Base fallback price
        }
      }
    }

    // 2. Mat Surcharge
    // First comic opening is included in base price
    // Additional openings cost $15 each
    let matPrice = 0;
    if (matType !== "none" && layout.count > 1) {
      const additionalOpenings = layout.count - 1;
      matPrice = additionalOpenings * MAT_SURCHARGE_PER_OPENING;
    }

    // 3. Slab Depth Modifier
    // Slabbed comics require deeper frames (+$25)
    let slabModifier = 0;
    if (isSlabbedFormat(formatId)) {
      slabModifier = SLAB_DEPTH_MODIFIER;
    }

    // 4. Glass Pricing
    // With new pricing engine, glass is included in framePrice
    // No additional glass upgrade cost
    const glassPrice = 0;

    // 5. Hardware Pricing
    // Standard hardware is included ($0)
    // Security hardware is +$8.95
    let hardwarePrice = 0;
    if (hardware === "security") {
      hardwarePrice = SECURITY_HARDWARE_UPCHARGE;
    }

    // 6. Brass Nameplate Addon
    // Flat $39 fee when enabled
    let nameplatePrice = 0;
    if (brassPlaqueEnabled) {
      nameplatePrice = BRASS_NAMEPLATE_PRICE;
    }

    // Calculate totals
    const subtotal =
      framePrice + matPrice + slabModifier + glassPrice + hardwarePrice + nameplatePrice;

    return {
      framePrice,
      matPrice,
      glassPrice,
      hardwarePrice,
      nameplatePrice,
      slabModifier,
      subtotal,
      total: subtotal,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config,
    config.formatId,
    config.matType,
    config.glass,
    config.hardware,
    config.brassPlaqueEnabled,
  ]);
}

/**
 * Format price for display
 */
export function formatComicPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
