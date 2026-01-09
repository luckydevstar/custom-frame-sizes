/**
 * Shopify Line Item Attribute Serialization
 *
 * Functions for serializing frame configurations to Shopify line item attributes.
 * Follows the specification in docs/FRAME_CONFIG_SERIALIZATION.md
 *
 * @packageDocumentation
 */

import type { FrameConfiguration } from "@framecraft/types";

/**
 * Shadowbox-specific configuration
 */
export interface ShadowboxSpecialtyConfig {
  backingType?: string;
  backingColor?: string;
  hangingHardware?: "standard" | "security";
  depth?: number; // in inches
  jerseyMount?: boolean;
  accessories?: string[];
}

/**
 * Jersey frame-specific configuration
 */
export interface JerseySpecialtyConfig {
  jerseySize?: string;
  mountType?: string;
  displayStyle?: string;
}

/**
 * Canvas float-specific configuration
 */
export interface CanvasFloatSpecialtyConfig {
  floatDepth?: number; // in inches
  canvasStretcher?: boolean;
}

/**
 * Puzzle-specific configuration
 */
export interface PuzzleSpecialtyConfig {
  puzzleSize?: string;
  puzzlePieceCount?: number;
}

/**
 * Comic book-specific configuration
 */
export interface ComicBookSpecialtyConfig {
  comicFormat?: string;
  comicLayout?: string;
  numberOfComics?: number;
}

/**
 * Playbill-specific configuration
 */
export interface PlaybillSpecialtyConfig {
  playbillSize?: string;
  layoutType?: string;
}

/**
 * Shopify custom attribute structure
 */
export interface ShopifyAttribute {
  key: string;
  value: string;
}

/**
 * Serialize frame configuration to Shopify line item attributes
 *
 * Converts a FrameConfiguration object to an array of Shopify custom attributes.
 * Attributes are ordered for readability in Shopify admin and include both
 * human-readable fields and a complete JSON representation.
 *
 * @param config - Frame configuration to serialize
 * @returns Array of Shopify custom attributes
 * @throws {Error} If required fields are missing or invalid
 *
 * @example
 * ```typescript
 * import { serializeFrameConfiguration } from '@framecraft/core/shopify';
 *
 * const config: FrameConfiguration = {
 *   serviceType: "frame-only",
 *   artworkWidth: 12.5,
 *   artworkHeight: 16.25,
 *   frameStyleId: "black-classic",
 *   matType: "double",
 *   matBorderWidth: 2.5,
 *   matRevealWidth: 0.25,
 *   matColorId: "white",
 *   matInnerColorId: "cream",
 *   glassTypeId: "standard",
 * };
 *
 * const attributes = serializeFrameConfiguration(config);
 * // Returns array of { key: string, value: string } objects
 * ```
 */
export function serializeFrameConfiguration(config: FrameConfiguration): ShopifyAttribute[] {
  // Validate required fields
  validateFrameConfiguration(config);

  const attributes: ShopifyAttribute[] = [];

  // 1. Service Information
  attributes.push({
    key: "Service Type",
    value: config.serviceType,
  });

  if (config.orderSource) {
    attributes.push({
      key: "Order Source",
      value: config.orderSource,
    });
  }

  // 2. Dimensions
  attributes.push({
    key: "Artwork Width",
    value: formatDimension(config.artworkWidth),
  });

  attributes.push({
    key: "Artwork Height",
    value: formatDimension(config.artworkHeight),
  });

  // 3. Frame
  attributes.push({
    key: "Frame Style",
    value: config.frameStyleId,
  });

  // 4. Mat
  attributes.push({
    key: "Mat Type",
    value: config.matType,
  });

  if (config.matType !== "none") {
    attributes.push({
      key: "Mat Border Width",
      value: formatDimension(config.matBorderWidth),
    });

    attributes.push({
      key: "Mat Color",
      value: config.matColorId,
    });

    if (config.matType === "double") {
      if (config.matRevealWidth !== undefined) {
        attributes.push({
          key: "Mat Reveal",
          value: formatDimension(config.matRevealWidth),
        });
      }

      if (config.matInnerColorId) {
        attributes.push({
          key: "Mat Inner Color",
          value: config.matInnerColorId,
        });
      }
    }
  }

  // 5. Glass
  attributes.push({
    key: "Glass Type",
    value: config.glassTypeId,
  });

  // 6. Image (for print-and-frame service)
  if (config.imageUrl) {
    attributes.push({
      key: "Customer Image",
      value: config.imageUrl,
    });
  }

  if (config.imageFit) {
    attributes.push({
      key: "Image Fit",
      value: config.imageFit,
    });
  }

  if (config.copyrightAgreed) {
    attributes.push({
      key: "Copyright Agreed",
      value: "Yes",
    });
  }

  // 7. Bottom Weighted
  if (config.bottomWeighted) {
    attributes.push({
      key: "Bottom Weighted",
      value: "Yes",
    });
  }

  // 8. Configuration JSON (always last)
  attributes.push({
    key: "Configuration JSON",
    value: JSON.stringify(config),
  });

  return attributes;
}

/**
 * Format dimension value with unit
 *
 * @param inches - Dimension in inches
 * @returns Formatted string with unit (e.g., "12.5\"")
 */
function formatDimension(inches: number): string {
  if (typeof inches !== "number" || isNaN(inches) || inches < 0) {
    throw new Error(`Invalid dimension: ${inches}`);
  }
  return `${inches}"`;
}

/**
 * Validate frame configuration before serialization
 *
 * @param config - Frame configuration to validate
 * @throws {Error} If required fields are missing or invalid
 */
function validateFrameConfiguration(config: FrameConfiguration): void {
  if (!config.serviceType) {
    throw new Error("serviceType is required");
  }

  if (!["frame-only", "print-and-frame"].includes(config.serviceType)) {
    throw new Error(
      `Invalid serviceType: ${config.serviceType}. Must be "frame-only" or "print-and-frame"`
    );
  }

  if (typeof config.artworkWidth !== "number" || config.artworkWidth <= 0) {
    throw new Error("artworkWidth must be a positive number");
  }

  if (typeof config.artworkHeight !== "number" || config.artworkHeight <= 0) {
    throw new Error("artworkHeight must be a positive number");
  }

  if (!config.frameStyleId) {
    throw new Error("frameStyleId is required");
  }

  if (!["none", "single", "double"].includes(config.matType)) {
    throw new Error(`Invalid matType: ${config.matType}. Must be "none", "single", or "double"`);
  }

  if (config.matType !== "none") {
    if (typeof config.matBorderWidth !== "number" || config.matBorderWidth <= 0) {
      throw new Error("matBorderWidth must be a positive number when matType is not 'none'");
    }

    if (!config.matColorId) {
      throw new Error("matColorId is required when matType is not 'none'");
    }

    if (config.matType === "double") {
      if (
        config.matRevealWidth !== undefined &&
        (typeof config.matRevealWidth !== "number" || config.matRevealWidth <= 0)
      ) {
        throw new Error("matRevealWidth must be a positive number if provided");
      }
    }
  }

  if (!config.glassTypeId) {
    throw new Error("glassTypeId is required");
  }

  if (config.serviceType === "print-and-frame" && !config.imageUrl) {
    throw new Error("imageUrl is required for print-and-frame service");
  }

  if (config.imageFit && !["cover", "contain"].includes(config.imageFit)) {
    throw new Error(`Invalid imageFit: ${config.imageFit}. Must be "cover" or "contain"`);
  }
}

/**
 * Deserialize frame configuration from Shopify attributes
 *
 * Attempts to parse the "Configuration JSON" attribute first (preferred method).
 * Falls back to reconstructing from individual attributes if JSON is missing.
 *
 * @param attributes - Array of Shopify custom attributes
 * @returns Frame configuration object
 * @throws {Error} If configuration cannot be deserialized
 *
 * @example
 * ```typescript
 * import { deserializeFrameConfiguration } from '@framecraft/core/shopify';
 *
 * const attributes = [
 *   { key: "Service Type", value: "frame-only" },
 *   { key: "Artwork Width", value: "12.5\"" },
 *   { key: "Configuration JSON", value: '{"serviceType":"frame-only",...}' }
 * ];
 *
 * const config = deserializeFrameConfiguration(attributes);
 * ```
 */
export function deserializeFrameConfiguration(attributes: ShopifyAttribute[]): FrameConfiguration {
  if (!Array.isArray(attributes) || attributes.length === 0) {
    throw new Error("Attributes array is required and cannot be empty");
  }

  // Try to find and parse Configuration JSON first (preferred method)
  const jsonAttribute = attributes.find((attr) => attr.key === "Configuration JSON");

  if (jsonAttribute && jsonAttribute.value) {
    try {
      const config = JSON.parse(jsonAttribute.value) as FrameConfiguration;
      // Validate the parsed configuration
      validateFrameConfiguration(config);
      return config;
    } catch (error) {
      // If JSON parsing fails, fall back to attribute parsing
      console.warn("Failed to parse Configuration JSON, falling back to attribute parsing:", error);
    }
  }

  // Fallback: Reconstruct from individual attributes
  return deserializeFromAttributes(attributes);
}

/**
 * Reconstruct frame configuration from individual attributes
 *
 * This is a fallback method when Configuration JSON is not available.
 * Parses individual attributes and reconstructs the configuration object.
 *
 * @param attributes - Array of Shopify custom attributes
 * @returns Frame configuration object
 */
function deserializeFromAttributes(attributes: ShopifyAttribute[]): FrameConfiguration {
  const attrMap = new Map(attributes.map((attr) => [attr.key, attr.value]));

  const config: Partial<FrameConfiguration> = {};

  // Service Type
  const serviceType = attrMap.get("Service Type");
  if (serviceType && ["frame-only", "print-and-frame"].includes(serviceType)) {
    config.serviceType = serviceType as "frame-only" | "print-and-frame";
  } else {
    throw new Error("Service Type attribute is required and must be valid");
  }

  // Dimensions
  const artworkWidth = parseDimension(attrMap.get("Artwork Width"));
  const artworkHeight = parseDimension(attrMap.get("Artwork Height"));

  if (artworkWidth === null || artworkHeight === null) {
    throw new Error("Artwork Width and Artwork Height are required");
  }

  config.artworkWidth = artworkWidth;
  config.artworkHeight = artworkHeight;

  // Frame Style
  const frameStyleId = attrMap.get("Frame Style");
  if (!frameStyleId) {
    throw new Error("Frame Style attribute is required");
  }
  config.frameStyleId = frameStyleId;

  // Mat Type
  const matType = attrMap.get("Mat Type");
  if (matType && ["none", "single", "double"].includes(matType)) {
    config.matType = matType as "none" | "single" | "double";
  } else {
    throw new Error("Mat Type attribute is required and must be valid");
  }

  // Mat configuration (if mat is present)
  if (config.matType !== "none") {
    const matBorderWidth = parseDimension(attrMap.get("Mat Border Width"));
    if (matBorderWidth === null) {
      throw new Error("Mat Border Width is required when Mat Type is not 'none'");
    }
    config.matBorderWidth = matBorderWidth;

    const matColorId = attrMap.get("Mat Color");
    if (!matColorId) {
      throw new Error("Mat Color is required when Mat Type is not 'none'");
    }
    config.matColorId = matColorId;

    if (config.matType === "double") {
      const matRevealWidth = parseDimension(attrMap.get("Mat Reveal"));
      if (matRevealWidth !== null) {
        config.matRevealWidth = matRevealWidth;
      }

      const matInnerColorId = attrMap.get("Mat Inner Color");
      if (matInnerColorId) {
        config.matInnerColorId = matInnerColorId;
      }
    }
  }

  // Glass Type
  const glassTypeId = attrMap.get("Glass Type");
  if (!glassTypeId) {
    throw new Error("Glass Type attribute is required");
  }
  config.glassTypeId = glassTypeId;

  // Optional fields
  const imageUrl = attrMap.get("Customer Image");
  if (imageUrl) {
    config.imageUrl = imageUrl;
  }

  const imageFit = attrMap.get("Image Fit");
  if (imageFit && ["cover", "contain"].includes(imageFit)) {
    config.imageFit = imageFit as "cover" | "contain";
  }

  const copyrightAgreed = attrMap.get("Copyright Agreed");
  if (copyrightAgreed === "Yes") {
    config.copyrightAgreed = true;
  }

  const orderSource = attrMap.get("Order Source");
  if (orderSource) {
    config.orderSource = orderSource;
  }

  const bottomWeighted = attrMap.get("Bottom Weighted");
  if (bottomWeighted === "Yes") {
    config.bottomWeighted = true;
  }

  // Validate the reconstructed configuration
  validateFrameConfiguration(config as FrameConfiguration);

  return config as FrameConfiguration;
}

/**
 * Parse dimension string to number
 *
 * Parses strings like "12.5\"" to 12.5
 *
 * @param dimensionStr - Dimension string with unit
 * @returns Parsed number in inches, or null if invalid
 */
function parseDimension(dimensionStr: string | undefined): number | null {
  if (!dimensionStr) {
    return null;
  }

  // Remove quotes and unit, then parse
  const cleaned = dimensionStr.replace(/["\s]/g, "");
  const parsed = parseFloat(cleaned);

  if (isNaN(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

/**
 * Serialize shadowbox configuration to Shopify attributes
 *
 * Extends the base frame configuration with shadowbox-specific attributes.
 *
 * @param config - Base frame configuration
 * @param specialtyConfig - Shadowbox-specific configuration
 * @returns Array of Shopify custom attributes including shadowbox fields
 *
 * @example
 * ```typescript
 * import { serializeShadowboxConfiguration } from '@framecraft/core/shopify';
 *
 * const attributes = serializeShadowboxConfiguration(
 *   baseConfig,
 *   {
 *     backingType: "fabric",
 *     backingColor: "black",
 *     hangingHardware: "security",
 *     depth: 2.5,
 *     jerseyMount: true,
 *     accessories: ["corner-brackets", "display-stand"]
 *   }
 * );
 * ```
 */
export function serializeShadowboxConfiguration(
  config: FrameConfiguration,
  specialtyConfig: ShadowboxSpecialtyConfig
): ShopifyAttribute[] {
  // Start with base configuration attributes
  const attributes = serializeFrameConfiguration(config);

  // Add shadowbox-specific attributes
  if (specialtyConfig.backingType) {
    attributes.push({
      key: "Backing Type",
      value: specialtyConfig.backingType,
    });
  }

  if (specialtyConfig.backingColor) {
    attributes.push({
      key: "Backing Color",
      value: specialtyConfig.backingColor,
    });
  }

  if (specialtyConfig.hangingHardware) {
    attributes.push({
      key: "Hanging Hardware",
      value: specialtyConfig.hangingHardware,
    });
  }

  if (specialtyConfig.depth !== undefined) {
    attributes.push({
      key: "Depth",
      value: formatDimension(specialtyConfig.depth),
    });
  }

  if (specialtyConfig.jerseyMount) {
    attributes.push({
      key: "Jersey Mount",
      value: "Yes",
    });
  }

  if (specialtyConfig.accessories && specialtyConfig.accessories.length > 0) {
    attributes.push({
      key: "Accessories",
      value: specialtyConfig.accessories.join(", "),
    });
  }

  // Update Configuration JSON to include specialty config
  const fullConfig = {
    ...config,
    specialtyType: "shadowbox",
    specialtyConfig,
  };
  const jsonIndex = attributes.findIndex((attr) => attr.key === "Configuration JSON");
  if (jsonIndex !== -1) {
    attributes[jsonIndex] = {
      key: "Configuration JSON",
      value: JSON.stringify(fullConfig),
    };
  }

  return attributes;
}

/**
 * Serialize jersey frame configuration to Shopify attributes
 *
 * Extends the base frame configuration with jersey-specific attributes.
 *
 * @param config - Base frame configuration
 * @param specialtyConfig - Jersey-specific configuration
 * @returns Array of Shopify custom attributes including jersey fields
 */
export function serializeJerseyConfiguration(
  config: FrameConfiguration,
  specialtyConfig: JerseySpecialtyConfig
): ShopifyAttribute[] {
  const attributes = serializeFrameConfiguration(config);

  if (specialtyConfig.jerseySize) {
    attributes.push({
      key: "Jersey Size",
      value: specialtyConfig.jerseySize,
    });
  }

  if (specialtyConfig.mountType) {
    attributes.push({
      key: "Mount Type",
      value: specialtyConfig.mountType,
    });
  }

  if (specialtyConfig.displayStyle) {
    attributes.push({
      key: "Display Style",
      value: specialtyConfig.displayStyle,
    });
  }

  // Update Configuration JSON
  const fullConfig = {
    ...config,
    specialtyType: "jersey",
    specialtyConfig,
  };
  const jsonIndex = attributes.findIndex((attr) => attr.key === "Configuration JSON");
  if (jsonIndex !== -1) {
    attributes[jsonIndex] = {
      key: "Configuration JSON",
      value: JSON.stringify(fullConfig),
    };
  }

  return attributes;
}

/**
 * Serialize canvas float configuration to Shopify attributes
 *
 * Extends the base frame configuration with canvas float-specific attributes.
 *
 * @param config - Base frame configuration
 * @param specialtyConfig - Canvas float-specific configuration
 * @returns Array of Shopify custom attributes including canvas float fields
 */
export function serializeCanvasFloatConfiguration(
  config: FrameConfiguration,
  specialtyConfig: CanvasFloatSpecialtyConfig
): ShopifyAttribute[] {
  const attributes = serializeFrameConfiguration(config);

  if (specialtyConfig.floatDepth !== undefined) {
    attributes.push({
      key: "Float Depth",
      value: formatDimension(specialtyConfig.floatDepth),
    });
  }

  if (specialtyConfig.canvasStretcher) {
    attributes.push({
      key: "Canvas Stretcher",
      value: "Yes",
    });
  }

  // Update Configuration JSON
  const fullConfig = {
    ...config,
    specialtyType: "canvas-float",
    specialtyConfig,
  };
  const jsonIndex = attributes.findIndex((attr) => attr.key === "Configuration JSON");
  if (jsonIndex !== -1) {
    attributes[jsonIndex] = {
      key: "Configuration JSON",
      value: JSON.stringify(fullConfig),
    };
  }

  return attributes;
}

/**
 * Serialize puzzle configuration to Shopify attributes
 *
 * Extends the base frame configuration with puzzle-specific attributes.
 *
 * @param config - Base frame configuration
 * @param specialtyConfig - Puzzle-specific configuration
 * @returns Array of Shopify custom attributes including puzzle fields
 */
export function serializePuzzleConfiguration(
  config: FrameConfiguration,
  specialtyConfig: PuzzleSpecialtyConfig
): ShopifyAttribute[] {
  const attributes = serializeFrameConfiguration(config);

  if (specialtyConfig.puzzleSize) {
    attributes.push({
      key: "Puzzle Size",
      value: specialtyConfig.puzzleSize,
    });
  }

  if (specialtyConfig.puzzlePieceCount !== undefined) {
    attributes.push({
      key: "Puzzle Piece Count",
      value: String(specialtyConfig.puzzlePieceCount),
    });
  }

  // Update Configuration JSON
  const fullConfig = {
    ...config,
    specialtyType: "puzzle",
    specialtyConfig,
  };
  const jsonIndex = attributes.findIndex((attr) => attr.key === "Configuration JSON");
  if (jsonIndex !== -1) {
    attributes[jsonIndex] = {
      key: "Configuration JSON",
      value: JSON.stringify(fullConfig),
    };
  }

  return attributes;
}

/**
 * Serialize comic book configuration to Shopify attributes
 *
 * Extends the base frame configuration with comic book-specific attributes.
 *
 * @param config - Base frame configuration
 * @param specialtyConfig - Comic book-specific configuration
 * @returns Array of Shopify custom attributes including comic book fields
 */
export function serializeComicBookConfiguration(
  config: FrameConfiguration,
  specialtyConfig: ComicBookSpecialtyConfig
): ShopifyAttribute[] {
  const attributes = serializeFrameConfiguration(config);

  if (specialtyConfig.comicFormat) {
    attributes.push({
      key: "Comic Format",
      value: specialtyConfig.comicFormat,
    });
  }

  if (specialtyConfig.comicLayout) {
    attributes.push({
      key: "Comic Layout",
      value: specialtyConfig.comicLayout,
    });
  }

  if (specialtyConfig.numberOfComics !== undefined) {
    attributes.push({
      key: "Number of Comics",
      value: String(specialtyConfig.numberOfComics),
    });
  }

  // Update Configuration JSON
  const fullConfig = {
    ...config,
    specialtyType: "comic-book",
    specialtyConfig,
  };
  const jsonIndex = attributes.findIndex((attr) => attr.key === "Configuration JSON");
  if (jsonIndex !== -1) {
    attributes[jsonIndex] = {
      key: "Configuration JSON",
      value: JSON.stringify(fullConfig),
    };
  }

  return attributes;
}

/**
 * Serialize playbill configuration to Shopify attributes
 *
 * Extends the base frame configuration with playbill-specific attributes.
 *
 * @param config - Base frame configuration
 * @param specialtyConfig - Playbill-specific configuration
 * @returns Array of Shopify custom attributes including playbill fields
 */
export function serializePlaybillConfiguration(
  config: FrameConfiguration,
  specialtyConfig: PlaybillSpecialtyConfig
): ShopifyAttribute[] {
  const attributes = serializeFrameConfiguration(config);

  if (specialtyConfig.playbillSize) {
    attributes.push({
      key: "Playbill Size",
      value: specialtyConfig.playbillSize,
    });
  }

  if (specialtyConfig.layoutType) {
    attributes.push({
      key: "Layout Type",
      value: specialtyConfig.layoutType,
    });
  }

  // Update Configuration JSON
  const fullConfig = {
    ...config,
    specialtyType: "playbill",
    specialtyConfig,
  };
  const jsonIndex = attributes.findIndex((attr) => attr.key === "Configuration JSON");
  if (jsonIndex !== -1) {
    attributes[jsonIndex] = {
      key: "Configuration JSON",
      value: JSON.stringify(fullConfig),
    };
  }

  return attributes;
}

/**
 * Deserialized configuration with specialty data
 */
export interface DeserializedConfiguration {
  config: FrameConfiguration;
  specialtyType?: "shadowbox" | "jersey" | "canvas-float" | "puzzle" | "comic-book" | "playbill";
  specialtyConfig?:
    | ShadowboxSpecialtyConfig
    | JerseySpecialtyConfig
    | CanvasFloatSpecialtyConfig
    | PuzzleSpecialtyConfig
    | ComicBookSpecialtyConfig
    | PlaybillSpecialtyConfig;
}

/**
 * Deserialize frame configuration with specialty data from Shopify attributes
 *
 * Attempts to parse the "Configuration JSON" attribute first (preferred method).
 * Falls back to reconstructing from individual attributes if JSON is missing.
 * Also extracts specialty configuration if present.
 *
 * @param attributes - Array of Shopify custom attributes
 * @returns Deserialized configuration with base config and optional specialty data
 * @throws {Error} If configuration cannot be deserialized
 *
 * @example
 * ```typescript
 * import { deserializeConfiguration } from '@framecraft/core/shopify';
 *
 * const attributes = [
 *   { key: "Service Type", value: "frame-only" },
 *   { key: "Backing Type", value: "fabric" },
 *   { key: "Configuration JSON", value: '{"serviceType":"frame-only",...}' }
 * ];
 *
 * const result = deserializeConfiguration(attributes);
 * // result.config: FrameConfiguration
 * // result.specialtyType: "shadowbox" | undefined
 * // result.specialtyConfig: ShadowboxSpecialtyConfig | undefined
 * ```
 */
export function deserializeConfiguration(
  attributes: ShopifyAttribute[]
): DeserializedConfiguration {
  if (!Array.isArray(attributes) || attributes.length === 0) {
    throw new Error("Attributes array is required and cannot be empty");
  }

  // Try to find and parse Configuration JSON first (preferred method)
  const jsonAttribute = attributes.find((attr) => attr.key === "Configuration JSON");

  if (jsonAttribute && jsonAttribute.value) {
    try {
      const parsed = JSON.parse(jsonAttribute.value) as {
        specialtyType?: string;
        specialtyConfig?: unknown;
      } & FrameConfiguration;

      // Extract specialty data if present
      const specialtyType = parsed.specialtyType as
        | "shadowbox"
        | "jersey"
        | "canvas-float"
        | "puzzle"
        | "comic-book"
        | "playbill"
        | undefined;

      const specialtyConfig = parsed.specialtyConfig;

      // Remove specialty fields from config
      const { specialtyType: _, specialtyConfig: __, ...config } = parsed;

      // Validate the parsed configuration
      validateFrameConfiguration(config);

      return {
        config,
        specialtyType,
        specialtyConfig: specialtyConfig as
          | ShadowboxSpecialtyConfig
          | JerseySpecialtyConfig
          | CanvasFloatSpecialtyConfig
          | PuzzleSpecialtyConfig
          | ComicBookSpecialtyConfig
          | PlaybillSpecialtyConfig
          | undefined,
      };
    } catch (error) {
      // If JSON parsing fails, fall back to attribute parsing
      console.warn("Failed to parse Configuration JSON, falling back to attribute parsing:", error);
    }
  }

  // Fallback: Reconstruct from individual attributes
  const config = deserializeFromAttributes(attributes);

  // Try to detect specialty type from attributes
  const attrMap = new Map(attributes.map((attr) => [attr.key, attr.value]));

  let specialtyType:
    | "shadowbox"
    | "jersey"
    | "canvas-float"
    | "puzzle"
    | "comic-book"
    | "playbill"
    | undefined;
  let specialtyConfig:
    | ShadowboxSpecialtyConfig
    | JerseySpecialtyConfig
    | CanvasFloatSpecialtyConfig
    | PuzzleSpecialtyConfig
    | ComicBookSpecialtyConfig
    | PlaybillSpecialtyConfig
    | undefined;

  // Detect specialty type based on presence of specialty-specific attributes
  if (attrMap.has("Backing Type") || attrMap.has("Depth") || attrMap.has("Hanging Hardware")) {
    specialtyType = "shadowbox";
    specialtyConfig = deserializeShadowboxFromAttributes(attrMap);
  } else if (
    attrMap.has("Jersey Size") ||
    attrMap.has("Mount Type") ||
    attrMap.has("Display Style")
  ) {
    specialtyType = "jersey";
    specialtyConfig = deserializeJerseyFromAttributes(attrMap);
  } else if (attrMap.has("Float Depth") || attrMap.has("Canvas Stretcher")) {
    specialtyType = "canvas-float";
    specialtyConfig = deserializeCanvasFloatFromAttributes(attrMap);
  } else if (attrMap.has("Puzzle Size") || attrMap.has("Puzzle Piece Count")) {
    specialtyType = "puzzle";
    specialtyConfig = deserializePuzzleFromAttributes(attrMap);
  } else if (
    attrMap.has("Comic Format") ||
    attrMap.has("Comic Layout") ||
    attrMap.has("Number of Comics")
  ) {
    specialtyType = "comic-book";
    specialtyConfig = deserializeComicBookFromAttributes(attrMap);
  } else if (attrMap.has("Playbill Size") || attrMap.has("Layout Type")) {
    specialtyType = "playbill";
    specialtyConfig = deserializePlaybillFromAttributes(attrMap);
  }

  return {
    config,
    specialtyType,
    specialtyConfig,
  };
}

/**
 * Deserialize shadowbox configuration from attributes
 */
function deserializeShadowboxFromAttributes(
  attrMap: Map<string, string>
): ShadowboxSpecialtyConfig {
  const config: ShadowboxSpecialtyConfig = {};

  const backingType = attrMap.get("Backing Type");
  if (backingType) {
    config.backingType = backingType;
  }

  const backingColor = attrMap.get("Backing Color");
  if (backingColor) {
    config.backingColor = backingColor;
  }

  const hangingHardware = attrMap.get("Hanging Hardware");
  if (hangingHardware && ["standard", "security"].includes(hangingHardware)) {
    config.hangingHardware = hangingHardware as "standard" | "security";
  }

  const depth = parseDimension(attrMap.get("Depth"));
  if (depth !== null) {
    config.depth = depth;
  }

  const jerseyMount = attrMap.get("Jersey Mount");
  if (jerseyMount === "Yes") {
    config.jerseyMount = true;
  }

  const accessories = attrMap.get("Accessories");
  if (accessories) {
    config.accessories = accessories.split(", ").filter(Boolean);
  }

  return config;
}

/**
 * Deserialize jersey configuration from attributes
 */
function deserializeJerseyFromAttributes(attrMap: Map<string, string>): JerseySpecialtyConfig {
  const config: JerseySpecialtyConfig = {};

  const jerseySize = attrMap.get("Jersey Size");
  if (jerseySize) {
    config.jerseySize = jerseySize;
  }

  const mountType = attrMap.get("Mount Type");
  if (mountType) {
    config.mountType = mountType;
  }

  const displayStyle = attrMap.get("Display Style");
  if (displayStyle) {
    config.displayStyle = displayStyle;
  }

  return config;
}

/**
 * Deserialize canvas float configuration from attributes
 */
function deserializeCanvasFloatFromAttributes(
  attrMap: Map<string, string>
): CanvasFloatSpecialtyConfig {
  const config: CanvasFloatSpecialtyConfig = {};

  const floatDepth = parseDimension(attrMap.get("Float Depth"));
  if (floatDepth !== null) {
    config.floatDepth = floatDepth;
  }

  const canvasStretcher = attrMap.get("Canvas Stretcher");
  if (canvasStretcher === "Yes") {
    config.canvasStretcher = true;
  }

  return config;
}

/**
 * Deserialize puzzle configuration from attributes
 */
function deserializePuzzleFromAttributes(attrMap: Map<string, string>): PuzzleSpecialtyConfig {
  const config: PuzzleSpecialtyConfig = {};

  const puzzleSize = attrMap.get("Puzzle Size");
  if (puzzleSize) {
    config.puzzleSize = puzzleSize;
  }

  const puzzlePieceCount = attrMap.get("Puzzle Piece Count");
  if (puzzlePieceCount) {
    const count = parseInt(puzzlePieceCount, 10);
    if (!isNaN(count) && count > 0) {
      config.puzzlePieceCount = count;
    }
  }

  return config;
}

/**
 * Deserialize comic book configuration from attributes
 */
function deserializeComicBookFromAttributes(
  attrMap: Map<string, string>
): ComicBookSpecialtyConfig {
  const config: ComicBookSpecialtyConfig = {};

  const comicFormat = attrMap.get("Comic Format");
  if (comicFormat) {
    config.comicFormat = comicFormat;
  }

  const comicLayout = attrMap.get("Comic Layout");
  if (comicLayout) {
    config.comicLayout = comicLayout;
  }

  const numberOfComics = attrMap.get("Number of Comics");
  if (numberOfComics) {
    const count = parseInt(numberOfComics, 10);
    if (!isNaN(count) && count > 0) {
      config.numberOfComics = count;
    }
  }

  return config;
}

/**
 * Deserialize playbill configuration from attributes
 */
function deserializePlaybillFromAttributes(attrMap: Map<string, string>): PlaybillSpecialtyConfig {
  const config: PlaybillSpecialtyConfig = {};

  const playbillSize = attrMap.get("Playbill Size");
  if (playbillSize) {
    config.playbillSize = playbillSize;
  }

  const layoutType = attrMap.get("Layout Type");
  if (layoutType) {
    config.layoutType = layoutType;
  }

  return config;
}
