/**
 * Mat Catalog Service Tests
 *
 * Tests for the mat catalog service, including fetching, filtering,
 * and conversion utilities.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchMatCatalog,
  matBoardToPaletteColor,
  getMatsBySize,
  getMatById,
  getMatByColorName,
  isMatAvailableForSize,
  getMatSkuForSize,
} from "../mat-catalog";
import type { MatCatalog } from "@framecraft/types";

// Mock fetch globally
global.fetch = vi.fn();

describe("Mat Catalog Service", () => {
  const mockCatalog: MatCatalog = {
    version: "1.0.0",
    lastUpdated: "2024-01-01T00:00:00Z",
    mats: [
      {
        id: "mat-white-001",
        colorName: "White",
        colorHex: "#FFFFFF",
        brand: "Peterboro",
        texture: "smooth",
        category: "regular",
        skus: {
          "32x40": "MAT-WHITE-32X40",
          "40x60": "MAT-WHITE-40X60",
        },
        availableSizes: ["32x40", "40x60"],
        pricing: {
          costPer32x40: 10.0,
          costPer40x60: 20.0,
          markup: 4.0,
        },
      },
      {
        id: "mat-premium-001",
        colorName: "Premium Black",
        colorHex: "#000000",
        brand: "Crescent",
        texture: "linen",
        category: "premium",
        skus: {
          "32x40": "MAT-PREM-32X40",
        },
        availableSizes: ["32x40"],
        pricing: {
          costPer32x40: 25.0,
          markup: 4.5,
        },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchMatCatalog", () => {
    it("should fetch catalog without filters", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      const catalog = await fetchMatCatalog();

      expect(global.fetch).toHaveBeenCalledWith("/api/mats");
      expect(catalog).toEqual(mockCatalog);
    });

    it("should fetch catalog with size filter", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      await fetchMatCatalog({ requiredSize: "32x40" });

      expect(global.fetch).toHaveBeenCalledWith("/api/mats?requiredSize=32x40");
    });

    it("should fetch catalog with multiple filters", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      await fetchMatCatalog({
        requiredSize: "32x40",
        category: "premium",
        brand: "Crescent",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/mats?requiredSize=32x40&category=premium&brand=Crescent"
      );
    });

    it("should throw error on failed fetch", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(fetchMatCatalog()).rejects.toThrow("Failed to fetch mat catalog");
    });

    it("should use custom base URL", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      await fetchMatCatalog(undefined, "https://api.example.com/mats");

      expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/mats");
    });
  });

  describe("matBoardToPaletteColor", () => {
    it("should convert regular mat to palette color", () => {
      const mat = mockCatalog.mats[0];
      const paletteColor = matBoardToPaletteColor(mat);

      expect(paletteColor).toEqual({
        id: "mat-white-001",
        lineNumber: 0,
        type: "Regular",
        name: "White",
        swatchFile: "/mats/mat-white-001/swatch.jpg",
        hexColor: "#FFFFFF",
        sizes: {
          "32x40": {
            sku: "MAT-WHITE-32X40",
            price: 40.0,
            vendor: "Peterboro",
          },
          "40x60": {
            sku: "MAT-WHITE-40X60",
            price: 80.0,
            vendor: "Peterboro",
          },
        },
        coreColor: "white",
        isRegular: true,
        isPremium: false,
        isAvailableOversize: true,
      });
    });

    it("should convert premium mat to palette color", () => {
      const mat = mockCatalog.mats[1];
      const paletteColor = matBoardToPaletteColor(mat);

      expect(paletteColor.type).toBe("Premium");
      expect(paletteColor.isRegular).toBe(false);
      expect(paletteColor.isPremium).toBe(true);
    });

    it("should handle mat without 40x60 size", () => {
      const mat = mockCatalog.mats[1];
      const paletteColor = matBoardToPaletteColor(mat);

      expect(paletteColor.sizes["40x60"]).toBeNull();
      expect(paletteColor.isAvailableOversize).toBe(false);
    });
  });

  describe("getMatsBySize", () => {
    it("should return 32x40 mats for standard size", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      const result = await getMatsBySize(24, 36);

      expect(global.fetch).toHaveBeenCalledWith("/api/mats?requiredSize=32x40");
      expect(result.all.length).toBeGreaterThan(0);
      expect(result.standard.length).toBeGreaterThan(0);
    });

    it("should return 40x60 mats for oversize", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      const result = await getMatsBySize(36, 48);

      expect(global.fetch).toHaveBeenCalledWith("/api/mats?requiredSize=40x60");
      expect(result.all.length).toBeGreaterThan(0);
    });

    it("should separate standard and premium mats", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      const result = await getMatsBySize(24, 36);

      expect(result.standard.every((m) => m.type === "Regular")).toBe(true);
      expect(result.premium.every((m) => m.type === "Premium")).toBe(true);
    });
  });

  describe("getMatById", () => {
    it("should return mat by ID", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      const mat = await getMatById("mat-white-001");

      expect(mat).toEqual(mockCatalog.mats[0]);
    });

    it("should return null for non-existent mat", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      const mat = await getMatById("non-existent");

      expect(mat).toBeNull();
    });
  });

  describe("getMatByColorName", () => {
    it("should return mat by color name", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      const mat = await getMatByColorName("White");

      expect(mat).toEqual(mockCatalog.mats[0]);
    });

    it("should return null for non-existent color name", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalog,
      });

      const mat = await getMatByColorName("NonExistent");

      expect(mat).toBeNull();
    });
  });

  describe("isMatAvailableForSize", () => {
    it("should return true if mat is available for size", () => {
      const mat = mockCatalog.mats[0];
      expect(isMatAvailableForSize(mat, "32x40")).toBe(true);
      expect(isMatAvailableForSize(mat, "40x60")).toBe(true);
    });

    it("should return false if mat is not available for size", () => {
      const mat = mockCatalog.mats[1];
      expect(isMatAvailableForSize(mat, "32x40")).toBe(true);
      expect(isMatAvailableForSize(mat, "40x60")).toBe(false);
    });
  });

  describe("getMatSkuForSize", () => {
    it("should return SKU for available size", () => {
      const mat = mockCatalog.mats[0];
      expect(getMatSkuForSize(mat, "32x40")).toBe("MAT-WHITE-32X40");
      expect(getMatSkuForSize(mat, "40x60")).toBe("MAT-WHITE-40X60");
    });

    it("should return null for unavailable size", () => {
      const mat = mockCatalog.mats[1];
      expect(getMatSkuForSize(mat, "32x40")).toBe("MAT-PREM-32X40");
      expect(getMatSkuForSize(mat, "40x60")).toBeNull();
    });
  });
});
