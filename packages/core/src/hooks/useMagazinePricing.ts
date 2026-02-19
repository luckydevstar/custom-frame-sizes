/**
 * Magazine Frame Pricing Calculator Hook
 *
 * Comprehensive pricing for magazine shadowbox frames.
 */

"use client";

import { useMemo } from "react";
import { getMagazineLayout, type MagazineLayoutType } from "../utils/specialty/magazine-layouts";
import { getMagazineSizeById } from "../utils/specialty/magazine-sizes";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { calculatePricing } from "../services/pricing";
import type { FrameStyle, GlassType, FrameConfiguration } from "@framecraft/types";

const MAT_SURCHARGE_PER_OPENING = 15;
const SECURITY_HARDWARE_UPCHARGE = 8.95;

export interface MagazinePricingBreakdown {
  framePrice: number;
  matPrice: number;
  glassPrice: number;
  hardwarePrice: number;
  nameplatePrice: number;
  subtotal: number;
  total: number;
}

export interface MagazinePricingConfig {
  frame?: FrameStyle | null;
  layoutId: MagazineLayoutType;
  sizeId: string;
  matType: "none" | "single" | "double";
  matBorder: number;
  glass?: GlassType | null;
  hardware: "standard" | "security";
  brassPlaqueEnabled: boolean;
  bottomWeighted?: boolean;
}

function calculateInteriorContentDimensions(
  layoutId: MagazineLayoutType,
  sizeId: string
): { width: number; height: number } | null {
  if (!layoutId) return null;
  const layout = getMagazineLayout(layoutId);
  const magazineSize = getMagazineSizeById(sizeId);
  if (!magazineSize) return null;
  const { rows, columns, spacingFactor } = layout;
  const magazineWidth = magazineSize.width;
  const magazineHeight = magazineSize.height;
  const horizontalSpacing = magazineWidth * spacingFactor;
  const verticalSpacing = magazineHeight * spacingFactor;
  const totalContentWidth = magazineWidth * columns + horizontalSpacing * (columns - 1);
  const totalContentHeight = magazineHeight * rows + verticalSpacing * (rows - 1);
  return { width: totalContentWidth, height: totalContentHeight };
}

export function useMagazinePricing(config: MagazinePricingConfig): MagazinePricingBreakdown {
  return useMemo(() => {
    const {
      frame,
      layoutId,
      sizeId,
      matType,
      matBorder,
      glass,
      hardware,
      brassPlaqueEnabled,
      bottomWeighted = false,
    } = config;

    if (!layoutId) {
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

    const layout = getMagazineLayout(layoutId);
    const magazineSize = getMagazineSizeById(sizeId);
    if (!magazineSize || !frame) {
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

    const interiorDimensions = calculateInteriorContentDimensions(layoutId, sizeId);
    if (!interiorDimensions) {
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

    let framePrice = 0;
    const effectiveMatBorder = matType === "none" ? 0.25 : matBorder;
    const glassTypeId = glass?.id ?? "standard";

    const frameConfig: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: interiorDimensions.width,
      artworkHeight: interiorDimensions.height,
      frameStyleId: frame.id,
      matType: matType,
      matBorderWidth: effectiveMatBorder,
      matRevealWidth: 0.25,
      matColorId: "mat-1",
      glassTypeId: glassTypeId,
      bottomWeighted: bottomWeighted,
    };

    try {
      const pricingResult = calculatePricing(frameConfig);
      framePrice = pricingResult.framePrice + pricingResult.matPrice + pricingResult.glassPrice;
    } catch {
      framePrice = 120;
    }

    let matPrice = 0;
    if (matType !== "none" && layout.count > 1) {
      matPrice = (layout.count - 1) * MAT_SURCHARGE_PER_OPENING;
    }

    let hardwarePrice = 0;
    if (hardware === "security") {
      hardwarePrice = SECURITY_HARDWARE_UPCHARGE;
    }

    let nameplatePrice = 0;
    if (brassPlaqueEnabled && matType !== "none") {
      nameplatePrice = BRASS_NAMEPLATE_SPECS.PRICE;
    }

    const subtotal = framePrice + matPrice + hardwarePrice + nameplatePrice;

    return {
      framePrice,
      matPrice,
      glassPrice: 0,
      hardwarePrice,
      nameplatePrice,
      subtotal,
      total: subtotal,
    };
  }, [config]);
}

export function formatMagazinePrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
