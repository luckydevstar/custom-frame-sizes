/**
 * Mat designer pricing — standalone mat sheet pricing.
 *
 * Key rules (per business spec):
 * - Mat raw cost + backing/bag raw cost are SUMMED first, then the v2 formula is applied.
 * - V-groove is a flat retail add-on (not run through the multiplier formula).
 * - Frame pricing uses the full frame pricing engine when a frame is selected.
 */

import {
  getFrameStyleById,
  getGlassTypeById,
  formatPrice,
  calculateFramePriceBySku,
  calculateMatCost,
  calculateMatPriceV2,
  calculateBackingKitRawCost,
  calculateVGroovePrice,
  COMPONENT_PRICING,
} from "@framecraft/core";

import { useMatStore } from "./store";

const SECURITY_HARDWARE_PRICE = 7.95;

export function useMatPricing() {
  const config = useMatStore((s) => s.config);

  const w = config.overallWIn;
  const h = config.overallHIn;
  const area = w * h;

  // ── Raw material cost ─────────────────────────────────────────────────────
  let matRawCost = calculateMatCost(w, h, config.topMat.color) ?? 0;
  if (config.singleOrDouble === "double" && config.bottomMat) {
    matRawCost += calculateMatCost(w, h, config.bottomMat.color) ?? matRawCost;
  }

  // Backing kit raw cost is added to mat raw cost BEFORE the formula (per spec)
  const backingRawCost = config.backingKit?.enabled
    ? calculateBackingKitRawCost(w, h)
    : 0;

  const totalRawCost = matRawCost + backingRawCost;

  // ── Apply v2 pricing formula to combined raw cost ─────────────────────────
  const matRetail = calculateMatPriceV2(w, h, totalRawCost);

  // ── V-groove: flat retail add-on (not run through multiplier formula) ─────
  const vGroovePrice = config.vGroove?.enabled ? calculateVGroovePrice(w, h) : 0;

  // ── Backing kit line item (retail = what the formula produced for it) ─────
  // We report it as a separate line item for the price breakdown, but the
  // formula was already applied above in matRetail.
  const backingKitPrice = config.backingKit?.enabled
    ? calculateMatPriceV2(w, h, totalRawCost) - calculateMatPriceV2(w, h, matRawCost)
    : 0;

  // Per-unit mat total (mat + vGroove; backing already baked into matRetail)
  const total = matRetail + vGroovePrice;

  // ── Frame, glass, hardware (only when a frame is selected) ────────────────
  let framePrice = 0;
  let glassPrice = 0;
  let hardwarePrice = 0;

  if (config.selectedFrameId) {
    const frame = getFrameStyleById(config.selectedFrameId);
    if (frame) {
      const perimeter = (w + h) * 2;
      framePrice = frame.sku
        ? (calculateFramePriceBySku(w, h, frame.sku) ?? perimeter * frame.pricePerInch)
        : perimeter * frame.pricePerInch;
    }

    const glassId = config.selectedGlassId || "standard";
    if (glassId !== "standard" && glassId !== "none") {
      const glass = getGlassTypeById(glassId);
      if (glass) {
        const isNonGlare =
          glass.id.includes("non-glare") || glass.name.toLowerCase().includes("non-glare");
        const glassConfig = isNonGlare
          ? COMPONENT_PRICING.NON_GLARE_ACRYLIC
          : COMPONENT_PRICING.STANDARD_ACRYLIC;
        glassPrice = area * glassConfig.costPerSqIn * glassConfig.designerMarkup;
      }
    }

    if (config.hardware === "security") {
      hardwarePrice = SECURITY_HARDWARE_PRICE;
    }
  }

  const subtotalWithFrame =
    total +
    framePrice +
    (config.selectedGlassId === "standard" ? 0 : glassPrice) +
    hardwarePrice;
  const bundleDiscount = config.selectedFrameId ? subtotalWithFrame * 0.1 : 0;
  const grandTotal = subtotalWithFrame - bundleDiscount;

  return {
    total,
    matPrice: matRetail,
    framePrice,
    glassPrice: config.selectedGlassId === "standard" ? 0 : glassPrice,
    vGroovePrice,
    backingKitPrice,
    bundleDiscount,
    grandTotal,
    formatPrice,
  };
}
