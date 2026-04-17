/**
 * Locks key figures from pricing-engine-documentation.md / shared/schema.ts
 * so migrations (e.g. framecraft-frontends) stay aligned with the legacy engine.
 */
import { describe, expect, it } from "vitest";
import {
  ALL_FRAME_MOULDING_PRICES,
  calculateCompleteFramePrice,
  calculateCompleteFramePriceBySku,
  calculateFrameLinearFeet,
  calculateFramePriceWithBreakdown,
  calculateMatCost,
  getHandlingFee,
  getMultiplier,
  getOversizeSurcharge,
  NEW_PRICING_CONFIG,
  PICTURE_FRAME_MOULDING_PRICES,
} from "../pricing-engine";

describe("v2 frame + glazing (documentation example)", () => {
  it("16×20 interior, SKU 10569 ($1.18/ft), standard acrylic → $76.99 final", () => {
    const price = 1.18;
    expect(PICTURE_FRAME_MOULDING_PRICES["10569"]).toBe(price);

    const bd = calculateFramePriceWithBreakdown(16, 20, price, "STANDARD_ACRYLIC");
    expect(bd.finalPrice).toBe(76.99);
    expect(calculateCompleteFramePrice(16, 20, price, "STANDARD_ACRYLIC")).toBe(76.99);
    expect(calculateCompleteFramePriceBySku(16, 20, "10569", "STANDARD_ACRYLIC")).toBe(76.99);
  });

  it("matches doc worked example line items (16×20, $1.18/ft, std acrylic)", () => {
    const bd = calculateFramePriceWithBreakdown(16, 20, 1.18, "STANDARD_ACRYLIC");
    // Step 1: linear feet
    expect(calculateFrameLinearFeet(16, 20)).toBe(7);
    expect(bd.frameMaterialCost).toBeCloseTo(7 * 1.18, 4);
    // Step 2–4: glazing material on interior, total material
    expect(bd.acrylicMaterialCost).toBeCloseTo(320 * 0.00324, 4);
    expect(bd.totalMaterialCost).toBeCloseTo(bd.frameMaterialCost + bd.acrylicMaterialCost, 4);
    // Step 5–8
    expect(bd.perimeter).toBe(72);
    expect(bd.multiplier).toBe(6);
    expect(bd.handlingFee).toBe(11);
    expect(bd.oversizeSurcharge).toBe(0);
    // Step 9–10 (doc rounds material to $9.30 → $76.34; code uses full precision → $76.32)
    expect(bd.preMarketing).toBeCloseTo(66.78, 2);
    expect(bd.withMarketing).toBeCloseTo(bd.preMarketing / 0.875, 6);
    expect(bd.finalPrice).toBe(76.99);
  });

  it("applies $15.99 floor for small complete-frame totals", () => {
    const low = calculateCompleteFramePrice(4, 4, 0.45, "STANDARD_ACRYLIC");
    expect(low).toBe(NEW_PRICING_CONFIG.FLOOR_PRICE);
  });
});

describe("documentation constants (v2 engine)", () => {
  it("marketing load 12.5% → divide by 0.875", () => {
    expect(NEW_PRICING_CONFIG.MARKETING_LOAD).toBe(0.125);
    expect(1 - NEW_PRICING_CONFIG.MARKETING_LOAD).toBe(0.875);
  });

  it("frame price floor $15.99", () => {
    expect(NEW_PRICING_CONFIG.FLOOR_PRICE).toBe(15.99);
  });

  it("handling fee anchors (doc: $11 at 72″ perimeter)", () => {
    expect(getHandlingFee(72)).toBe(11);
    expect(getHandlingFee(16)).toBe(6);
  });

  it("extrapolates handling beyond last anchor (legacy schema)", () => {
    expect(getHandlingFee(200)).toBeGreaterThan(32);
  });

  it("oversize surcharges: $15 @ 120″, $25 @ 140″ perimeter", () => {
    expect(getOversizeSurcharge(119)).toBe(0);
    expect(getOversizeSurcharge(120)).toBe(15);
    expect(getOversizeSurcharge(139)).toBe(15);
    expect(getOversizeSurcharge(140)).toBe(25);
  });

  it("multiplier schedule: 6× for material cost ≤ $10", () => {
    expect(getMultiplier(0)).toBe(6);
    expect(getMultiplier(10)).toBe(6);
  });
});

describe("SKU coverage (picture + shadowbox + canvas)", () => {
  it("includes expected moulding tables from legacy schema", () => {
    expect(Object.keys(PICTURE_FRAME_MOULDING_PRICES).length).toBe(40);
    expect(Object.keys(ALL_FRAME_MOULDING_PRICES).length).toBe(40 + 24 + 18);
  });
});

describe("mat sheet material cost (doc: 8×10 white quarter sheet)", () => {
  it("matCost = sheetPrice × fraction before designer markup", () => {
    const cost = calculateMatCost(8, 10, "White");
    expect(cost).toBeCloseTo(3.46 * 0.25, 4);
  });
});
