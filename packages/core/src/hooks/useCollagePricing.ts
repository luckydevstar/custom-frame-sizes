/**
 * Photo Collage Frame Pricing Calculator Hook
 * Uses core pricing engine for frame + glazing; adds collage-specific surcharges.
 */

import { useMemo } from "react";
import type { FrameStyle, GlassType, FrameConfiguration } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import {
  type CollageLayoutType,
  COLLAGE_LAYOUTS,
  DEFAULT_FRAME_MOLDING_WIDTH,
} from "../lib/collage-layouts";
import { calculatePricing } from "../services/pricing";

const MAT_SURCHARGE_PER_OPENING = 12;
const DOUBLE_MAT_SURCHARGE = 15;
const SECURITY_HARDWARE_UPCHARGE = 8.95;
const PRINT_PRICE_PER_PHOTO = 8;

export interface CollagePricingBreakdown {
  framePrice: number;
  matPrice: number;
  glassPrice: number;
  hardwarePrice: number;
  nameplatePrice: number;
  printPrice: number;
  subtotal: number;
  total: number;
}

export interface CollagePricingConfig {
  frame?: FrameStyle | null;
  layoutId: CollageLayoutType;
  matType: "single" | "double";
  glass?: GlassType | null;
  hardware: "standard" | "security";
  brassPlaqueEnabled: boolean;
  printCount?: number;
}

export function useCollagePricing(config: CollagePricingConfig): CollagePricingBreakdown {
  return useMemo(() => {
    const { frame, layoutId, matType, glass, hardware, brassPlaqueEnabled } = config;

    const layout = COLLAGE_LAYOUTS.find((l) => l.id === layoutId);

    if (!layout || !frame) {
      return {
        framePrice: 0,
        matPrice: 0,
        glassPrice: 0,
        hardwarePrice: 0,
        nameplatePrice: 0,
        printPrice: 0,
        subtotal: 0,
        total: 0,
      };
    }

    const interiorWidth = layout.frameWidth - 2 * DEFAULT_FRAME_MOLDING_WIDTH;
    const interiorHeight = layout.frameHeight - 2 * DEFAULT_FRAME_MOLDING_WIDTH;

    let framePrice = 0;
    let glassPrice = 0;

    try {
      const frameConfig: FrameConfiguration = {
        serviceType: "frame-only",
        artworkWidth: interiorWidth,
        artworkHeight: interiorHeight,
        frameStyleId: frame.id,
        matType: "none",
        matBorderWidth: 0,
        matRevealWidth: 0,
        matColorId: "mat-1",
        glassTypeId: glass?.id ?? "standard",
      };
      const result = calculatePricing(frameConfig);
      framePrice = result.framePrice;
      glassPrice = result.glassPrice ?? 0;
    } catch {
      const perimeter = (interiorWidth + interiorHeight) * 2;
      framePrice = perimeter * ((frame as { pricePerInch?: number }).pricePerInch ?? 1.5);
    }

    let matPrice = 0;
    const totalOpenings = layout.openingCount;
    if (totalOpenings > 1) {
      matPrice = (totalOpenings - 1) * MAT_SURCHARGE_PER_OPENING;
    }
    if (matType === "double") {
      matPrice += DOUBLE_MAT_SURCHARGE;
    }

    const hardwarePrice = hardware === "security" ? SECURITY_HARDWARE_UPCHARGE : 0;
    const nameplatePrice = brassPlaqueEnabled ? (BRASS_NAMEPLATE_SPECS.PRICE ?? 29) : 0;
    const printPrice = (config.printCount ?? 0) * PRINT_PRICE_PER_PHOTO;

    const subtotal = Math.max(
      0,
      framePrice + matPrice + glassPrice + hardwarePrice + nameplatePrice + printPrice
    );

    return {
      framePrice: framePrice ?? 0,
      matPrice: matPrice ?? 0,
      glassPrice: glassPrice ?? 0,
      hardwarePrice: hardwarePrice ?? 0,
      nameplatePrice: nameplatePrice ?? 0,
      printPrice: printPrice ?? 0,
      subtotal: Number.isNaN(subtotal) ? 0 : subtotal,
      total: Number.isNaN(subtotal) ? 0 : subtotal,
    };
  }, [config]);
}

export function formatCollagePrice(price: number): string {
  if (Number.isNaN(price) || !Number.isFinite(price)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
