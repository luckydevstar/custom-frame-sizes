/**
 * Theme Merging Function
 *
 * Deep merges store-specific theme overrides with base theme.
 * Preserves base theme values for any missing overrides.
 */

import type { ThemeConfig } from "../theme";
import type { ThemeOverride } from "../types/brand-config";
import { defaultTheme } from "../theme";
import { hexToHSL } from "./base-theme";

/**
 * Merge theme override with base theme
 *
 * @param baseTheme Base theme configuration
 * @param override Theme override configuration
 * @returns Merged theme configuration
 */
export function mergeTheme(baseTheme: ThemeConfig, override: ThemeOverride): ThemeConfig {
  const merged: ThemeConfig = { ...baseTheme };

  // Merge colors
  if (override.colors) {
    if (override.colors.light) {
      merged.colors.light = { ...baseTheme.colors.light, ...override.colors.light };
    }
    if (override.colors.dark) {
      merged.colors.dark = { ...baseTheme.colors.dark, ...override.colors.dark };
    }
  }

  // Apply brand colors to primary if specified
  if (override.brandColors?.primary) {
    const primaryHSL = hexToHSL(override.brandColors.primary);
    merged.colors.light.primary = primaryHSL;
    merged.colors.dark.primary = primaryHSL; // Or calculate darker variant
  }
  if (override.brandColors?.secondary) {
    const secondaryHSL = hexToHSL(override.brandColors.secondary);
    merged.colors.light.secondary = secondaryHSL;
    merged.colors.dark.secondary = secondaryHSL;
  }
  if (override.brandColors?.accent) {
    const accentHSL = hexToHSL(override.brandColors.accent);
    merged.colors.light.accent = accentHSL;
    merged.colors.dark.accent = accentHSL;
  }

  // Merge typography
  if (override.typography) {
    merged.typography = { ...baseTheme.typography, ...override.typography };
    if (override.typography.fonts) {
      merged.typography.fonts = { ...baseTheme.typography.fonts, ...override.typography.fonts };
    }
  }

  // Merge spacing (if provided as object, convert to array or merge)
  if (override.layout?.spacing) {
    // Spacing override is a record, but layout.spacing is an array
    // For now, keep base spacing array (can be enhanced later)
    // merged.layout.spacing = override.layout.spacing;
  }

  // Merge layout
  if (override.layout) {
    merged.layout = { ...baseTheme.layout, ...override.layout };
    if (override.layout.radius) {
      merged.layout.radius = { ...baseTheme.layout.radius, ...override.layout.radius };
    }
  }

  // Override logo if specified
  if (override.logo) {
    merged.logo = {
      ...baseTheme.logo,
      wordmarkPath: override.logo.src,
      wordmarkDarkPath: override.logo.src, // Can be customized later
      useSvgLogo: override.logo.src.endsWith(".svg"),
    };
  }

  return merged;
}

/**
 * Get merged theme for a store
 * Merges store-specific overrides with base theme
 *
 * @param override Theme override (optional)
 * @returns Merged theme configuration
 */
export function getMergedTheme(override?: ThemeOverride): ThemeConfig {
  if (!override) {
    return defaultTheme;
  }
  return mergeTheme(defaultTheme, override);
}
