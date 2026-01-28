/**
 * Mat Texture Rendering Utility
 *
 * Generates background styles for mat boards in preview components.
 * Mat images are large high-resolution photos that cover the mat area (no tiling).
 * Images are scaled to cover using background-size: cover, which maintains aspect ratio
 * and crops overflow - perfect for different frame aspect ratios.
 */

import type React from "react";
import { getMatByName, ALL_MATS } from "@framecraft/config";
import { getSharedAssetUrl } from "../asset-urls";

// Build hex-to-mat-name lookup table once at module scope
const HEX_TO_MAT_NAME: Record<string, string> = {};
ALL_MATS.forEach((mat: { hexColor?: string; name: string }) => {
  if (mat.hexColor) {
    HEX_TO_MAT_NAME[mat.hexColor.toUpperCase()] = mat.name;
  }
});

// Bevel edge colors - most mats use #eeeeee, but black core mats use black
const BEVEL_COLOR_LIGHT = "#eeeeee";
const BEVEL_COLOR_BLACK = "#000000";
const BLACK_CORE_MAT_NUMBERS = [42, 43, 44, 45]; // Football, Basketball, White with Black Core, Black with Black Core

export interface MatTilingStyle {
  backgroundImage: string;
  backgroundSize: "cover";
  backgroundRepeat: "no-repeat";
  backgroundPosition: "center";
}

/**
 * Generates background style for a mat board using large cover images
 * @param matColorName - The name of the mat color (e.g., "White", "Black") or hex color (legacy)
 * @param previewScale - The scale factor for the preview (not used in cover mode, kept for API compatibility)
 * @param fallbackColor - Optional fallback color if mat not found
 * @returns CSS style object for mat background with cover sizing (crops to fit, maintains aspect ratio)
 */
export function getMatTilingStyle(
  matColorName: string,
  _previewScale: number,
  fallbackColor?: string
): React.CSSProperties {
  // Guard against undefined/null values
  if (!matColorName) {
    return {
      backgroundColor: fallbackColor || "#FFFFFF",
    };
  }

  // Try to resolve hex colors to mat names for backwards compatibility
  let resolvedName = matColorName;
  if (matColorName.startsWith("#")) {
    const convertedName = hexColorToMatName(matColorName);
    if (convertedName) {
      resolvedName = convertedName;
    }
  }

  const mat = getMatByName(resolvedName);

  if (!mat) {
    console.warn(
      `Mat texture not found for "${matColorName}" (resolved as "${resolvedName}") - using solid color fallback`
    );
    return {
      backgroundColor: fallbackColor || matColorName,
    };
  }

  // Use background-size: cover to scale image to fill mat area
  // This maintains aspect ratio and crops overflow (no skewing)
  // Perfect for different frame sizes - e.g., 24x30 shows full image, 24x8 crops top/bottom

  // Cache-busting for updated mat images (v=4 to force fresh reload of all mats)
  const cacheBustParam = "?v=4";

  // Use CDN URL if configured, otherwise use local path
  const matImageUrl = getSharedAssetUrl(`mats/${mat.lineNumber}.jpg`);

  return {
    backgroundImage: `url('${matImageUrl}${cacheBustParam}')`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: mat.hexColor || fallbackColor || "#FFFFFF",
  };
}

/**
 * Converts a hex color (legacy) to mat name if possible
 * This helps with backwards compatibility for components that used hex colors
 * @param hexColor - Hex color string
 * @returns Mat color name or undefined
 */
export function hexColorToMatName(hexColor: string): string | undefined {
  // Look up in the prebuilt hex-to-name table
  return HEX_TO_MAT_NAME[hexColor.toUpperCase()];
}

/**
 * Calculate relative luminance of a color (0-1)
 * Used to determine if a color is light or dark
 */
function getRelativeLuminance(hex: string): number {
  const rgb = parseInt(hex.slice(1), 16);
  const r = ((rgb >> 16) & 0xff) / 255;
  const g = ((rgb >> 8) & 0xff) / 255;
  const b = (rgb & 0xff) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Darken a hex color by a percentage
 * @internal - Currently unused, kept for potential future use
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error - Unused function kept for potential future use
function _darkenColor(hex: string, percent: number): string {
  const rgb = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.floor(((rgb >> 16) & 0xff) * (1 - percent)));
  const g = Math.max(0, Math.floor(((rgb >> 8) & 0xff) * (1 - percent)));
  const b = Math.max(0, Math.floor((rgb & 0xff) * (1 - percent)));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Lighten a hex color by a percentage
 * @internal - Currently unused, kept for potential future use
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error - Unused function kept for potential future use
function _lightenColor(hex: string, percent: number): string {
  const rgb = parseInt(hex.slice(1), 16);
  const r = Math.min(
    255,
    Math.floor(((rgb >> 16) & 0xff) + (255 - ((rgb >> 16) & 0xff)) * percent)
  );
  const g = Math.min(255, Math.floor(((rgb >> 8) & 0xff) + (255 - ((rgb >> 8) & 0xff)) * percent));
  const b = Math.min(255, Math.floor((rgb & 0xff) + (255 - (rgb & 0xff)) * percent));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Gets the beveled edge color for a mat
 * Returns adaptive color: darker shade for light mats (visible), lighter for dark mats
 * @param matColorName - The name of the mat color (e.g., "White", "Black") or hex color (legacy)
 * @returns Hex color string for the beveled edge
 */
export function getMatBevelColor(matColorName: string): string {
  // Guard against undefined/null values
  if (!matColorName) {
    return BEVEL_COLOR_LIGHT;
  }

  // Try to resolve hex colors to mat names for backwards compatibility
  let resolvedName = matColorName;
  if (matColorName.startsWith("#")) {
    const convertedName = hexColorToMatName(matColorName);
    if (convertedName) {
      resolvedName = convertedName;
    }
  }

  const mat = getMatByName(resolvedName);

  if (!mat) {
    // Default to light gray if mat not found
    return BEVEL_COLOR_LIGHT;
  }

  // Black core mats (Football, Basketball, White with Black Core, Black with Black Core) use black bevel
  if (BLACK_CORE_MAT_NUMBERS.includes(mat.lineNumber)) {
    return BEVEL_COLOR_BLACK;
  }

  // Calculate luminance to determine if mat is light or dark
  if (mat.hexColor) {
    const luminance = getRelativeLuminance(mat.hexColor);

    // For light mats (luminance > 0.7), use a visible gray-tan bevel
    // This ensures the bevel is visible against white/off-white mats
    if (luminance > 0.7) {
      return "#d4c9b8"; // Warm gray-tan visible against white
    }
  }

  // Dark mats use light #eeeeee bevel (visible against dark backgrounds)
  return BEVEL_COLOR_LIGHT;
}

/**
 * Gets the V-groove color for a mat - slightly lighter than bevel for subtle contrast
 * Returns an adaptive color that ensures the V-groove is visible on any mat
 * @param matColorName - The name of the mat color (e.g., "White", "Black") or hex color (legacy)
 * @returns Hex color string for the V-groove
 */
export function getMatVGrooveColor(matColorName: string): string {
  // Guard against undefined/null values
  if (!matColorName) {
    return "#fef2e1";
  }

  // Try to resolve hex colors to mat names for backwards compatibility
  let resolvedName = matColorName;
  if (matColorName.startsWith("#")) {
    const convertedName = hexColorToMatName(matColorName);
    if (convertedName) {
      resolvedName = convertedName;
    }
  }

  const mat = getMatByName(resolvedName);

  if (!mat || !mat.hexColor) {
    // Default to warm off-white if mat not found
    return "#fef2e1";
  }

  // Calculate relative luminance to determine if mat is light or dark
  const luminance = getRelativeLuminance(mat.hexColor);

  // For dark mats, use lighter V-groove
  // For light mats, use warm off-white tone
  if (luminance < 0.5) {
    // Dark mat - use medium gray for visibility
    return "#eeeeee";
  } else {
    // Light mat - use warm off-white tone
    return "#fef2e1";
  }
}

// Mat enhancement constants - aligned with Mat Designer's perfect rendering
export const MAT_BEVEL_WIDTH = 0.08; // Updated to 0.08 inch for fused beveled edges
export const MAT_VGROOVE_WIDTH = 0.125; // 1/8 inch stroke width
export const MAT_VGROOVE_DEFAULT_OFFSET = 0.5; // Default 0.5" from opening edge
export const MAT_VGROOVE_MIN_OFFSET = 0.25; // Minimum 0.25" offset
export const MAT_VGROOVE_MAX_OFFSET = 1.0; // Maximum 1.0" offset

/**
 * Gets mat image data for use in SVG fills (using cover sizing, not patterns)
 * @param matColorName - The name of the mat color (e.g., "White", "Black") or hex color (legacy)
 * @param previewScale - The scale factor for the preview (not used in cover mode, kept for API compatibility)
 * @param fallbackColor - Optional fallback color if mat not found
 * @returns Image data including image path
 */
export function getMatSVGPatternData(
  matColorName: string,
  _previewScale: number,
  fallbackColor?: string
): { imagePath: string } | { fallbackColor: string } {
  // Guard against undefined/null values
  if (!matColorName) {
    return {
      fallbackColor: fallbackColor || "#FFFFFF",
    };
  }

  // Try to resolve hex colors to mat names for backwards compatibility
  let resolvedName = matColorName;
  if (matColorName.startsWith("#")) {
    const convertedName = hexColorToMatName(matColorName);
    if (convertedName) {
      resolvedName = convertedName;
    }
  }

  const mat = getMatByName(resolvedName);

  if (!mat) {
    console.warn(
      `Mat not found for SVG pattern: ${matColorName} (resolved as ${resolvedName}), using fallback color`
    );
    return {
      fallbackColor: fallbackColor || matColorName, // Preserve original color if it's a hex
    };
  }

  // Return image path for use in SVG (SVG will handle cover sizing via preserveAspectRatio)
  // Cache-busting for updated mat images (v=4 to force fresh reload of all mats)
  const cacheBustParam = "?v=4";

  // Use CDN URL if configured, otherwise use local path
  const matImageUrl = getSharedAssetUrl(`mats/${mat.lineNumber}.jpg`);

  return {
    imagePath: `${matImageUrl}${cacheBustParam}`,
  };
}
