/**
 * Utility functions for Shadowbox Designer
 * Pure functions for serialization, pricing, and layout calculations
 */

import type { ShadowboxConfig, ShadowboxLayout, ShadowboxMatLayer } from "@framecraft/types";
import { calculatePricing } from "../services/pricing";

/**
 * Serialize a Shadowbox configuration to a base64-encoded JSON string
 * Useful for URL parameters and postMessage communication
 */
export function serializeDesign(config: ShadowboxConfig): string {
  const json = JSON.stringify(config);
  return btoa(json);
}

/**
 * Deserialize a base64-encoded design string back to ShadowboxConfig
 */
export function deserializeDesign(encoded: string): ShadowboxConfig | null {
  try {
    const json = atob(encoded);
    return JSON.parse(json) as ShadowboxConfig;
  } catch (error) {
    console.error("Failed to deserialize design:", error);
    return null;
  }
}

/**
 * Calculate pricing for a shadowbox configuration
 * Uses the existing pricing service with shadowbox-specific parameters
 */
export function priceShadowbox(config: ShadowboxConfig): number {
  const { widthIn, heightIn, matLayers, glazing, mouldingId } = config;

  // Determine mat configuration
  const matType = matLayers.length === 0 ? "none" : matLayers.length === 1 ? "single" : "double";

  // Get first mat layer properties
  const firstMat = matLayers[0];
  const matBorderWidth = firstMat?.thicknessIn || 2.5;

  // Map glazing to glass type ID
  const glassTypeId =
    glazing === "acrylic-AR"
      ? "acrylic-ar"
      : glazing === "glass-AR"
        ? "uv-glass"
        : glazing === "acrylic"
          ? "acrylic"
          : glazing === "glass"
            ? "standard"
            : "acrylic-ar"; // default

  const pricing = calculatePricing({
    serviceType: "frame-only",
    artworkWidth: widthIn,
    artworkHeight: heightIn,
    frameStyleId: mouldingId || "oak-classic",
    matType,
    matBorderWidth,
    matRevealWidth: matType === "double" ? 0.25 : 0,
    matColorId: "white",
    glassTypeId,
  });

  // Add shadowbox depth surcharge ($15 for deep frames)
  const depthSurcharge = config.depthIn >= 1.5 ? 15 : 0;

  return pricing.total + depthSurcharge;
}

/**
 * Calculate layout dimensions for a shadowbox configuration
 * Returns outer frame dimensions and window (interior) size
 */
export function layoutShadowbox(config: ShadowboxConfig): ShadowboxLayout {
  const { widthIn, heightIn, matLayers } = config;

  // Get frame molding width (default 0.75" for most frames)
  const mouldingWidth = 0.75; // Could be looked up from frame data

  // Calculate mat border width
  const totalMatBorder = matLayers.reduce(
    (sum: number, layer: ShadowboxMatLayer) => sum + layer.thicknessIn,
    0
  );

  // Window size is the interior opening
  const windowW = widthIn;
  const windowH = heightIn;

  // Outer dimensions include mat borders and frame molding
  const outerWIn = widthIn + totalMatBorder * 2 + mouldingWidth * 2;
  const outerHIn = heightIn + totalMatBorder * 2 + mouldingWidth * 2;

  return {
    outerWIn,
    outerHIn,
    window: { w: windowW, h: windowH },
  };
}

/**
 * Generate a data URL for a shadowbox preview image
 * This is a placeholder - actual implementation would render to canvas
 */
export function toDataURL(config: ShadowboxConfig): string {
  // For now, return a placeholder
  // In production, this would render the shadowbox to a canvas and export as data URL
  const layout = layoutShadowbox(config);
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${layout.outerWIn * 96}" height="${layout.outerHIn * 96}"><rect width="100%" height="100%" fill="%23F5F5F0"/></svg>`;
}

/**
 * Convert ShadowboxConfig back to internal designer state format
 * Used to hydrate the designer from a saved configuration
 */
// Known ShadowboxConfig fields that we handle explicitly
const KNOWN_CONFIG_FIELDS = new Set([
  "widthIn",
  "heightIn",
  "depthIn",
  "mouldingId",
  "matLayers",
  "background",
  "glazing",
  "hangingHardware",
  "jerseyMount",
  "accessories",
]);

export function fromShadowboxConfig(config: ShadowboxConfig): {
  artworkWidth: string;
  artworkHeight: string;
  matType: "none" | "single" | "double";
  matBorderWidth: string;
  matRevealWidth: string;
  frameId: string;
  glassId: string;
  backing: string;
  backingColor?: string; // Preserve original color for round-trip
  matColorId?: string;
  matInnerColorId?: string;
  rawMatColor?: string; // Preserve raw color even if not in palette
  rawMatInnerColor?: string; // Preserve raw inner color even if not in palette
  depth: number;
  hangingHardware?: "standard" | "security";
  // Passthrough fields for unsupported features
  jerseyMount?: ShadowboxConfig["jerseyMount"];
  accessories?: ShadowboxConfig["accessories"];
  unknownFields?: Record<string, any>; // Forward compatibility
} {
  // Determine mat type from layers
  const matType =
    config.matLayers.length === 0 ? "none" : config.matLayers.length === 1 ? "single" : "double";

  const matBorderWidth = config.matLayers[0]?.thicknessIn?.toString() || "2.5";
  const matRevealWidth = config.matLayers[1]?.thicknessIn?.toString() || "0.25";

  // Extract mat colors from layers
  // Store both the raw color (for round-trip) and attempt to map to palette ID
  const rawMatColor = config.matLayers[0]?.color;
  const rawMatInnerColor = config.matLayers[1]?.color;

  // For UI purposes, pass the raw color as ID - component will attempt palette lookup
  const matColorId = rawMatColor;
  const matInnerColorId = rawMatInnerColor;

  // Map glazing back to glass ID
  const glassId =
    config.glazing === "acrylic-AR"
      ? "acrylic-ar"
      : config.glazing === "glass-AR"
        ? "uv-glass"
        : config.glazing === "acrylic"
          ? "acrylic"
          : config.glazing === "glass"
            ? "standard"
            : config.glazing === "none"
              ? "none"
              : "acrylic-ar"; // default fallback

  // Map background back to backing - preserve material type and original color
  const backing =
    config.background.material === "plywood"
      ? "plywood"
      : config.background.material === "suede"
        ? "suede"
        : config.background.material === "linen"
          ? "linen"
          : config.background.material === "mat-color"
            ? config.background.color // Store the hex color; UI will map to ID
            : "none";

  // Preserve the original background color for round-trip integrity
  const backingColor = config.background.color;

  // Extract unknown fields for forward compatibility
  const unknownFields: Record<string, any> = {};
  for (const key in config) {
    if (!KNOWN_CONFIG_FIELDS.has(key)) {
      unknownFields[key] = (config as any)[key];
    }
  }

  return {
    artworkWidth: config.widthIn.toString(),
    artworkHeight: config.heightIn.toString(),
    matType,
    matBorderWidth,
    matRevealWidth,
    frameId: config.mouldingId || "oak-classic",
    glassId,
    backing,
    backingColor, // Preserve original color
    matColorId,
    matInnerColorId,
    rawMatColor, // Preserve raw color for lossless round-trip
    rawMatInnerColor, // Preserve raw inner color
    depth: config.depthIn,
    hangingHardware: config.hangingHardware,
    jerseyMount: config.jerseyMount,
    accessories: config.accessories,
    unknownFields: Object.keys(unknownFields).length > 0 ? unknownFields : undefined,
  };
}

/**
 * Convert internal designer state to ShadowboxConfig
 * Maps from the UI state format to the standardized config format
 */
export function toShadowboxConfig(state: {
  artworkWidth: string;
  artworkHeight: string;
  selectedFrame: { id: string };
  matType: "none" | "single" | "double";
  selectedMat: { id: string; color: string };
  selectedMatInner: { id: string; color: string };
  matBorderWidth: string;
  matRevealWidth: string;
  selectedGlass: { id: string };
  selectedBacking: string; // Can be 'plywood', 'suede', 'linen', 'none', or a mat color ID
  selectedBackingColor?: string; // Preserve original color from loaded config
  hangingHardware?: "standard" | "security";
  depth?: number;
  matPalette?: Array<{ id: string; color: string }>; // For resolving mat-color backings
  // Passthrough fields for unsupported features (preserves lossless round-trip)
  jerseyMount?: ShadowboxConfig["jerseyMount"];
  accessories?: ShadowboxConfig["accessories"];
  rawMatColor?: string; // Preserve raw color for lossless round-trip
  rawMatInnerColor?: string; // Preserve raw inner color
  unknownFields?: Record<string, any>; // Forward compatibility
}): ShadowboxConfig {
  const matLayers: ShadowboxConfig["matLayers"] = [];

  if (state.matType === "single") {
    matLayers.push({
      // Use raw color if available (from loaded config), otherwise use palette color
      color: state.rawMatColor || state.selectedMat.color,
      thicknessIn: parseFloat(state.matBorderWidth) || 2.5,
    });
  } else if (state.matType === "double") {
    matLayers.push({
      color: state.rawMatColor || state.selectedMat.color,
      thicknessIn: parseFloat(state.matBorderWidth) || 2.5,
    });
    matLayers.push({
      color: state.rawMatInnerColor || state.selectedMatInner.color,
      thicknessIn: parseFloat(state.matRevealWidth) || 0.25, // Use actual reveal width
    });
  }

  // Map backing to background - preserve material type
  const backingMaterial: ShadowboxConfig["background"]["material"] =
    state.selectedBacking === "plywood"
      ? "plywood"
      : state.selectedBacking === "suede"
        ? "suede"
        : state.selectedBacking === "linen"
          ? "linen"
          : state.selectedBacking === "none"
            ? "paper"
            : "mat-color"; // Mat colors used as backing

  // Get backing color - preserve original if available, otherwise use defaults
  let backingColor: string;

  if (state.selectedBackingColor) {
    // Use the preserved color from loaded config (for round-trip integrity)
    backingColor = state.selectedBackingColor;
  } else if (state.selectedBacking === "plywood") {
    backingColor = "#D4A574";
  } else if (state.selectedBacking === "suede") {
    backingColor = "#8B7355";
  } else if (state.selectedBacking === "linen") {
    backingColor = "#E8E4D9";
  } else if (state.selectedBacking === "none") {
    backingColor = "#F5F5F0";
  } else if (state.matPalette) {
    // selectedBacking is a mat color ID - find it in the palette
    const backingMatColor = state.matPalette.find((m) => m.id === state.selectedBacking);
    backingColor = backingMatColor?.color || "#F5F5F0";
  } else {
    backingColor = "#F5F5F0";
  }

  // Map glass type
  const glazing: ShadowboxConfig["glazing"] =
    state.selectedGlass.id === "acrylic-ar"
      ? "acrylic-AR"
      : state.selectedGlass.id === "uv-glass"
        ? "glass-AR"
        : state.selectedGlass.id === "acrylic"
          ? "acrylic"
          : state.selectedGlass.id === "standard"
            ? "glass"
            : state.selectedGlass.id === "none"
              ? "none"
              : "acrylic-AR"; // default fallback

  const config: ShadowboxConfig = {
    widthIn: parseFloat(state.artworkWidth) || 16,
    heightIn: parseFloat(state.artworkHeight) || 20,
    depthIn: state.depth || 1.25,
    mouldingId: state.selectedFrame.id,
    matLayers,
    background: {
      material: backingMaterial,
      color: backingColor,
    },
    glazing,
  };

  // Add optional fields if present
  if (state.hangingHardware) {
    config.hangingHardware = state.hangingHardware;
  }
  if (state.jerseyMount) {
    config.jerseyMount = state.jerseyMount;
  }
  if (state.accessories) {
    config.accessories = state.accessories;
  }

  // Restore unknown fields for forward compatibility
  if (state.unknownFields) {
    for (const key in state.unknownFields) {
      config[key] = state.unknownFields[key];
    }
  }

  return config;
}
