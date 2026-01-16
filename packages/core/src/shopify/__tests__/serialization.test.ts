/**
 * Serialization Tests
 *
 * Tests for frame configuration serialization to/from Shopify line item attributes.
 * Verifies round-trip serialization preserves data integrity.
 */

import { describe, it, expect } from "vitest";
import {
  serializeFrameConfiguration,
  deserializeFrameConfiguration,
  deserializeConfiguration,
  serializeShadowboxConfiguration,
  serializeJerseyConfiguration,
  serializeCanvasFloatConfiguration,
  serializePuzzleConfiguration,
  serializeComicBookConfiguration,
  serializePlaybillConfiguration,
  type ShopifyAttribute,
  type ShadowboxSpecialtyConfig,
  type JerseySpecialtyConfig,
  type CanvasFloatSpecialtyConfig,
  type PuzzleSpecialtyConfig,
  type ComicBookSpecialtyConfig,
  type PlaybillSpecialtyConfig,
} from "../serialization";
import type { FrameConfiguration } from "@framecraft/types";

describe("serializeFrameConfiguration", () => {
  it("should serialize a basic frame-only configuration", () => {
    const config: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: 12.5,
      artworkHeight: 16.25,
      frameStyleId: "black-classic",
      matType: "single",
      matBorderWidth: 2.5,
      matRevealWidth: 0,
      matColorId: "white",
      glassTypeId: "standard",
    };

    const attributes = serializeFrameConfiguration(config);

    expect(attributes).toContainEqual({ key: "Service Type", value: "frame-only" });
    expect(attributes).toContainEqual({ key: "Artwork Width", value: '12.5"' });
    expect(attributes).toContainEqual({ key: "Artwork Height", value: '16.25"' });
    expect(attributes).toContainEqual({ key: "Frame Style", value: "black-classic" });
    expect(attributes).toContainEqual({ key: "Mat Type", value: "single" });
    expect(attributes).toContainEqual({ key: "Mat Border Width", value: '2.5"' });
    expect(attributes).toContainEqual({ key: "Mat Color", value: "white" });
    expect(attributes).toContainEqual({ key: "Glass Type", value: "standard" });

    // Should have Configuration JSON as last attribute
    const jsonAttr = attributes.find((a) => a.key === "Configuration JSON");
    expect(jsonAttr).toBeDefined();
    expect(JSON.parse(jsonAttr!.value)).toEqual(config);
  });

  it("should serialize a double mat configuration", () => {
    const config: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: 20,
      artworkHeight: 24,
      frameStyleId: "gold-ornate",
      matType: "double",
      matBorderWidth: 3,
      matRevealWidth: 0.25,
      matColorId: "white",
      matInnerColorId: "cream",
      glassTypeId: "non-glare",
    };

    const attributes = serializeFrameConfiguration(config);

    expect(attributes).toContainEqual({ key: "Mat Type", value: "double" });
    expect(attributes).toContainEqual({ key: "Mat Reveal", value: '0.25"' });
    expect(attributes).toContainEqual({ key: "Mat Inner Color", value: "cream" });
  });

  it("should serialize print-and-frame configuration with image", () => {
    const config: FrameConfiguration = {
      serviceType: "print-and-frame",
      artworkWidth: 16,
      artworkHeight: 20,
      frameStyleId: "modern-black",
      matType: "single",
      matBorderWidth: 2,
      matRevealWidth: 0,
      matColorId: "black",
      glassTypeId: "standard",
      imageUrl: "https://example.com/image.jpg",
      imageFit: "cover",
      copyrightAgreed: true,
    };

    const attributes = serializeFrameConfiguration(config);

    expect(attributes).toContainEqual({ key: "Service Type", value: "print-and-frame" });
    expect(attributes).toContainEqual({
      key: "Customer Image",
      value: "https://example.com/image.jpg",
    });
    expect(attributes).toContainEqual({ key: "Image Fit", value: "cover" });
    expect(attributes).toContainEqual({ key: "Copyright Agreed", value: "Yes" });
  });

  it("should serialize bottom-weighted configuration", () => {
    const config: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: 11,
      artworkHeight: 14,
      frameStyleId: "walnut",
      matType: "single",
      matBorderWidth: 2.5,
      matRevealWidth: 0,
      matColorId: "white",
      glassTypeId: "standard",
      bottomWeighted: true,
    };

    const attributes = serializeFrameConfiguration(config);

    expect(attributes).toContainEqual({ key: "Bottom Weighted", value: "Yes" });
  });

  it("should serialize no-mat configuration", () => {
    const config: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: 24,
      artworkHeight: 36,
      frameStyleId: "canvas-floater",
      matType: "none",
      matBorderWidth: 0,
      matRevealWidth: 0,
      matColorId: "",
      glassTypeId: "no-glass",
    };

    const attributes = serializeFrameConfiguration(config);

    expect(attributes).toContainEqual({ key: "Mat Type", value: "none" });
    // Should not have mat-related attributes
    expect(attributes.find((a) => a.key === "Mat Border Width")).toBeUndefined();
    expect(attributes.find((a) => a.key === "Mat Color")).toBeUndefined();
  });

  it("should throw error for missing required fields", () => {
    const invalidConfig = {
      serviceType: "frame-only",
      artworkWidth: 12,
      // Missing artworkHeight, frameStyleId, etc.
    } as FrameConfiguration;

    expect(() => serializeFrameConfiguration(invalidConfig)).toThrow();
  });

  it("should throw error for invalid service type", () => {
    const invalidConfig = {
      serviceType: "invalid" as "frame-only",
      artworkWidth: 12,
      artworkHeight: 16,
      frameStyleId: "test",
      matType: "none",
      matBorderWidth: 0,
      matRevealWidth: 0,
      matColorId: "",
      glassTypeId: "standard",
    };

    expect(() => serializeFrameConfiguration(invalidConfig)).toThrow();
  });
});

describe("deserializeFrameConfiguration", () => {
  it("should deserialize from Configuration JSON attribute", () => {
    const originalConfig: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: 12.5,
      artworkHeight: 16.25,
      frameStyleId: "black-classic",
      matType: "single",
      matBorderWidth: 2.5,
      matRevealWidth: 0,
      matColorId: "white",
      glassTypeId: "standard",
    };

    const attributes: ShopifyAttribute[] = [
      { key: "Service Type", value: "frame-only" },
      { key: "Artwork Width", value: '12.5"' },
      { key: "Configuration JSON", value: JSON.stringify(originalConfig) },
    ];

    const result = deserializeFrameConfiguration(attributes);

    expect(result).toEqual(originalConfig);
  });

  it("should fallback to attribute parsing when JSON is missing", () => {
    const attributes: ShopifyAttribute[] = [
      { key: "Service Type", value: "frame-only" },
      { key: "Artwork Width", value: '12.5"' },
      { key: "Artwork Height", value: '16.25"' },
      { key: "Frame Style", value: "black-classic" },
      { key: "Mat Type", value: "single" },
      { key: "Mat Border Width", value: '2.5"' },
      { key: "Mat Color", value: "white" },
      { key: "Glass Type", value: "standard" },
    ];

    const result = deserializeFrameConfiguration(attributes);

    expect(result.serviceType).toBe("frame-only");
    expect(result.artworkWidth).toBe(12.5);
    expect(result.artworkHeight).toBe(16.25);
    expect(result.frameStyleId).toBe("black-classic");
    expect(result.matType).toBe("single");
    expect(result.matBorderWidth).toBe(2.5);
    expect(result.matColorId).toBe("white");
    expect(result.glassTypeId).toBe("standard");
  });

  it("should throw error for empty attributes array", () => {
    expect(() => deserializeFrameConfiguration([])).toThrow();
  });
});

describe("round-trip serialization", () => {
  it("should preserve data through serialize/deserialize cycle", () => {
    const originalConfig: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: 18.75,
      artworkHeight: 24.5,
      frameStyleId: "mahogany-traditional",
      matType: "double",
      matBorderWidth: 3,
      matRevealWidth: 0.25,
      matColorId: "antique-white",
      matInnerColorId: "sage-green",
      glassTypeId: "museum-glass",
      orderSource: "custom-designer",
      bottomWeighted: true,
    };

    const serialized = serializeFrameConfiguration(originalConfig);
    const deserialized = deserializeFrameConfiguration(serialized);

    expect(deserialized).toEqual(originalConfig);
  });

  it("should preserve print-and-frame data through round-trip", () => {
    const originalConfig: FrameConfiguration = {
      serviceType: "print-and-frame",
      artworkWidth: 16,
      artworkHeight: 20,
      frameStyleId: "modern-black",
      matType: "single",
      matBorderWidth: 2,
      matRevealWidth: 0,
      matColorId: "black",
      glassTypeId: "standard",
      imageUrl: "https://example.com/my-photo.jpg",
      imageFit: "contain",
      copyrightAgreed: true,
    };

    const serialized = serializeFrameConfiguration(originalConfig);
    const deserialized = deserializeFrameConfiguration(serialized);

    expect(deserialized).toEqual(originalConfig);
  });

  it("should preserve no-mat configuration through round-trip", () => {
    const originalConfig: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: 30,
      artworkHeight: 40,
      frameStyleId: "floater-natural",
      matType: "none",
      matBorderWidth: 0,
      matRevealWidth: 0,
      matColorId: "",
      glassTypeId: "no-glass",
    };

    const serialized = serializeFrameConfiguration(originalConfig);
    const deserialized = deserializeFrameConfiguration(serialized);

    expect(deserialized).toEqual(originalConfig);
  });
});

describe("specialty configuration serialization", () => {
  const baseConfig: FrameConfiguration = {
    serviceType: "frame-only",
    artworkWidth: 24,
    artworkHeight: 32,
    frameStyleId: "shadowbox-black",
    matType: "none",
    matBorderWidth: 0,
    matRevealWidth: 0,
    matColorId: "",
    glassTypeId: "standard",
  };

  describe("shadowbox", () => {
    it("should serialize shadowbox configuration", () => {
      const specialtyConfig: ShadowboxSpecialtyConfig = {
        backingType: "fabric",
        backingColor: "black",
        hangingHardware: "security",
        depth: 2.5,
        jerseyMount: true,
        accessories: ["corner-brackets", "display-stand"],
      };

      const attributes = serializeShadowboxConfiguration(baseConfig, specialtyConfig);

      expect(attributes).toContainEqual({ key: "Backing Type", value: "fabric" });
      expect(attributes).toContainEqual({ key: "Backing Color", value: "black" });
      expect(attributes).toContainEqual({ key: "Hanging Hardware", value: "security" });
      expect(attributes).toContainEqual({ key: "Depth", value: '2.5"' });
      expect(attributes).toContainEqual({ key: "Jersey Mount", value: "Yes" });
      expect(attributes).toContainEqual({
        key: "Accessories",
        value: "corner-brackets, display-stand",
      });
    });

    it("should deserialize shadowbox configuration", () => {
      const specialtyConfig: ShadowboxSpecialtyConfig = {
        backingType: "fabric",
        backingColor: "black",
        hangingHardware: "security",
        depth: 2.5,
      };

      const attributes = serializeShadowboxConfiguration(baseConfig, specialtyConfig);
      const result = deserializeConfiguration(attributes);

      expect(result.specialtyType).toBe("shadowbox");
      expect(result.specialtyConfig).toEqual(specialtyConfig);
    });
  });

  describe("jersey", () => {
    it("should serialize jersey configuration", () => {
      const specialtyConfig: JerseySpecialtyConfig = {
        jerseySize: "XL",
        mountType: "standard",
        displayStyle: "folded",
      };

      const attributes = serializeJerseyConfiguration(baseConfig, specialtyConfig);

      expect(attributes).toContainEqual({ key: "Jersey Size", value: "XL" });
      expect(attributes).toContainEqual({ key: "Mount Type", value: "standard" });
      expect(attributes).toContainEqual({ key: "Display Style", value: "folded" });
    });

    it("should deserialize jersey configuration", () => {
      const specialtyConfig: JerseySpecialtyConfig = {
        jerseySize: "L",
        mountType: "premium",
        displayStyle: "stretched",
      };

      const attributes = serializeJerseyConfiguration(baseConfig, specialtyConfig);
      const result = deserializeConfiguration(attributes);

      expect(result.specialtyType).toBe("jersey");
      expect(result.specialtyConfig).toEqual(specialtyConfig);
    });
  });

  describe("canvas float", () => {
    it("should serialize canvas float configuration", () => {
      const specialtyConfig: CanvasFloatSpecialtyConfig = {
        floatDepth: 1.5,
        canvasStretcher: true,
      };

      const attributes = serializeCanvasFloatConfiguration(baseConfig, specialtyConfig);

      expect(attributes).toContainEqual({ key: "Float Depth", value: '1.5"' });
      expect(attributes).toContainEqual({ key: "Canvas Stretcher", value: "Yes" });
    });

    it("should deserialize canvas float configuration", () => {
      const specialtyConfig: CanvasFloatSpecialtyConfig = {
        floatDepth: 2,
        canvasStretcher: true,
      };

      const attributes = serializeCanvasFloatConfiguration(baseConfig, specialtyConfig);
      const result = deserializeConfiguration(attributes);

      expect(result.specialtyType).toBe("canvas-float");
      expect(result.specialtyConfig).toEqual(specialtyConfig);
    });
  });

  describe("puzzle", () => {
    it("should serialize puzzle configuration", () => {
      const specialtyConfig: PuzzleSpecialtyConfig = {
        puzzleSize: "20x27",
        puzzlePieceCount: 1000,
      };

      const attributes = serializePuzzleConfiguration(baseConfig, specialtyConfig);

      expect(attributes).toContainEqual({ key: "Puzzle Size", value: "20x27" });
      expect(attributes).toContainEqual({ key: "Puzzle Piece Count", value: "1000" });
    });

    it("should deserialize puzzle configuration", () => {
      const specialtyConfig: PuzzleSpecialtyConfig = {
        puzzleSize: "24x30",
        puzzlePieceCount: 500,
      };

      const attributes = serializePuzzleConfiguration(baseConfig, specialtyConfig);
      const result = deserializeConfiguration(attributes);

      expect(result.specialtyType).toBe("puzzle");
      expect(result.specialtyConfig).toEqual(specialtyConfig);
    });
  });

  describe("comic book", () => {
    it("should serialize comic book configuration", () => {
      const specialtyConfig: ComicBookSpecialtyConfig = {
        comicFormat: "modern",
        comicLayout: "single",
        numberOfComics: 3,
      };

      const attributes = serializeComicBookConfiguration(baseConfig, specialtyConfig);

      expect(attributes).toContainEqual({ key: "Comic Format", value: "modern" });
      expect(attributes).toContainEqual({ key: "Comic Layout", value: "single" });
      expect(attributes).toContainEqual({ key: "Number of Comics", value: "3" });
    });

    it("should deserialize comic book configuration", () => {
      const specialtyConfig: ComicBookSpecialtyConfig = {
        comicFormat: "golden-age",
        comicLayout: "grid",
        numberOfComics: 4,
      };

      const attributes = serializeComicBookConfiguration(baseConfig, specialtyConfig);
      const result = deserializeConfiguration(attributes);

      expect(result.specialtyType).toBe("comic-book");
      expect(result.specialtyConfig).toEqual(specialtyConfig);
    });
  });

  describe("playbill", () => {
    it("should serialize playbill configuration", () => {
      const specialtyConfig: PlaybillSpecialtyConfig = {
        playbillSize: "standard",
        layoutType: "centered",
      };

      const attributes = serializePlaybillConfiguration(baseConfig, specialtyConfig);

      expect(attributes).toContainEqual({ key: "Playbill Size", value: "standard" });
      expect(attributes).toContainEqual({ key: "Layout Type", value: "centered" });
    });

    it("should deserialize playbill configuration", () => {
      const specialtyConfig: PlaybillSpecialtyConfig = {
        playbillSize: "large",
        layoutType: "offset",
      };

      const attributes = serializePlaybillConfiguration(baseConfig, specialtyConfig);
      const result = deserializeConfiguration(attributes);

      expect(result.specialtyType).toBe("playbill");
      expect(result.specialtyConfig).toEqual(specialtyConfig);
    });
  });
});
