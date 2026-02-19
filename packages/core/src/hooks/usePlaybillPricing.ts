/**
 * Playbill Frame Pricing Calculator Hook
 *
 * Uses the new pricing engine v2 via calculatePricing for frame+glazing costs.
 * Add-ons (nameplate, security hardware) are applied on top.
 */

"use client";

import { useMemo } from "react";
import {
  type PlaybillLayoutType,
  PLAYBILL_LAYOUTS,
  DEFAULT_FRAME_MOLDING_WIDTH,
  PLAYBILL_MAT_BORDER,
} from "../utils/specialty/playbill-layouts";
import { calculatePricing } from "../services/pricing";
import type { FrameConfiguration } from "@framecraft/types";

// TODO: Extract BRASS_NAMEPLATE_SPECS to @framecraft/types
// For now, using a constant placeholder
const BRASS_NAMEPLATE_PRICE = 29;

const SECURITY_HARDWARE_UPCHARGE = 8.95;

export interface PlaybillPricingBreakdown {
  framePrice: number;
  matPrice: number;
  glassPrice: number;
  hardwarePrice: number;
  nameplatePrice: number;
  subtotal: number;
  total: number;
}

export interface PlaybillPricingConfig {
  frame?: { id: string; sku?: string; mouldingWidth?: number; pricePerInch?: number } | null;
  layoutId: PlaybillLayoutType;
  matType: "none" | "single" | "double";
  glass?: { id: string } | null;
  hardware: "standard" | "security";
  brassPlaqueEnabled: boolean;
}

/**
 * Calculate comprehensive pricing for playbill frame configuration
 * Uses new pricing engine v2 for frame+glazing costs
 */
export function usePlaybillPricing(config: PlaybillPricingConfig): PlaybillPricingBreakdown {
  return useMemo(() => {
    const { frame, layoutId, matType, glass, hardware, brassPlaqueEnabled } = config;

    const layout = PLAYBILL_LAYOUTS.find((l) => l.id === layoutId);

    if (!layout || !frame) {
      return {
        framePrice: 0,
        matPrice: 0,
        glassPrice: 0,
        hardwarePrice: 0,
        nameplatePrice: 0,
        subtotal: 0,
        total: 0,
      };
    }

    const mouldingWidth = frame.mouldingWidth || DEFAULT_FRAME_MOLDING_WIDTH;
    const interiorWidth = layout.frameWidth - 2 * mouldingWidth;
    const interiorHeight = layout.frameHeight - 2 * mouldingWidth;

    let framePrice = 0;
    let matPrice = 0;
    let glassPrice = 0;

    try {
      const frameConfig: FrameConfiguration = {
        serviceType: "frame-only",
        artworkWidth: interiorWidth,
        artworkHeight: interiorHeight,
        frameStyleId: frame.id,
        matType: matType,
        matBorderWidth: matType !== "none" ? PLAYBILL_MAT_BORDER : 0,
        matRevealWidth: matType === "double" ? 0.25 : 0,
        matColorId: "mat-1",
        matInnerColorId: matType === "double" ? "mat-2" : undefined,
        glassTypeId: glass?.id || "standard",
        bottomWeighted: false,
      };

      const pricingResult = calculatePricing(frameConfig);

      framePrice = pricingResult.framePrice;
      matPrice = pricingResult.matPrice;
      glassPrice = pricingResult.glassPrice;
    } catch (error) {
      console.warn("Playbill pricing calculation failed, using fallback:", error);
      const perimeter = 2 * (layout.frameWidth + layout.frameHeight);
      framePrice = perimeter * (frame.pricePerInch || 2.0);
    }

    let hardwarePrice = 0;
    if (hardware === "security") {
      hardwarePrice = SECURITY_HARDWARE_UPCHARGE;
    }

    let nameplatePrice = 0;
    if (brassPlaqueEnabled && matType !== "none") {
      nameplatePrice = BRASS_NAMEPLATE_PRICE;
    }

    const subtotal = framePrice + matPrice + glassPrice + hardwarePrice + nameplatePrice;

    return {
      framePrice,
      matPrice,
      glassPrice,
      hardwarePrice,
      nameplatePrice,
      subtotal,
      total: subtotal,
    };
  }, [config]);
}

/**
 * Format price for display
 */
export function formatPlaybillPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
