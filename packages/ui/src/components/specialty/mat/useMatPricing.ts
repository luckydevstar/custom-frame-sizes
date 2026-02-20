/**
 * Mat designer pricing – frame, glass, hardware, bundle discount.
 * Uses @framecraft/core pricing helpers.
 */

import { useMatStore } from "./store";
import {
  getFrameStyleById,
  getGlassTypeById,
  formatPrice,
  calculateFramePriceBySku,
  calculateMatPriceForDesigner,
} from "@framecraft/core";

// Glass pricing (aligned with core COMPONENT_PRICING)
const STANDARD_GLASS_COST_PER_SQIN = 0.00324;
const GLASS_MARKUP = 8;
const SECURITY_HARDWARE_PRICE = 7.95;

export function useMatPricing() {
  const config = useMatStore((s) => s.config);

  const w = config.overallWIn;
  const h = config.overallHIn;
  const perimeter = (w + h) * 2;
  const area = w * h;
  const _qty = config.quantity || 1;

  // Mat total (single or double approximation)
  let matTotal = 0;
  const singleMat = calculateMatPriceForDesigner(w, h, config.topMat.color);
  if (singleMat !== null) {
    matTotal = config.singleOrDouble === "double" && config.bottomMat ? singleMat * 1.5 : singleMat;
  } else {
    // Fallback: simple perimeter-based
    matTotal = perimeter * 0.08;
  }
  const vGroovePrice = config.vGroove?.enabled ? 2.5 : 0;
  const backingKitPrice = config.backingKit?.enabled ? 3.5 : 0;
  // Per-unit mat total (mat + vGroove + backing)
  const total = matTotal + vGroovePrice + backingKitPrice;

  let framePrice = 0;
  let glassPrice = 0;
  let hardwarePrice = 0;
  if (config.selectedFrameId) {
    const frame = getFrameStyleById(config.selectedFrameId);
    if (frame) {
      if (frame.sku) {
        framePrice = calculateFramePriceBySku(w, h, frame.sku) ?? perimeter * frame.pricePerInch;
      } else {
        framePrice = perimeter * frame.pricePerInch;
      }
    }
    const glassId = config.selectedGlassId || "standard";
    if (glassId !== "standard" && glassId !== "none") {
      const glass = getGlassTypeById(glassId);
      if (glass) {
        glassPrice = area * STANDARD_GLASS_COST_PER_SQIN * GLASS_MARKUP;
      }
    }
    if (config.hardware === "security") {
      hardwarePrice = SECURITY_HARDWARE_PRICE;
    }
  }

  const subtotalWithFrame =
    total + framePrice + (config.selectedGlassId === "standard" ? 0 : glassPrice) + hardwarePrice;
  const bundleDiscount = config.selectedFrameId ? subtotalWithFrame * 0.1 : 0;
  const grandTotal = subtotalWithFrame - bundleDiscount;

  return {
    total,
    framePrice,
    glassPrice: config.selectedGlassId === "standard" ? 0 : glassPrice,
    vGroovePrice,
    backingKitPrice,
    bundleDiscount,
    grandTotal,
    formatPrice,
  };
}
