"use client";

/**
 * useTheme Hook
 *
 * React hook for accessing and applying theme configuration.
 * Provides theme values and utilities for theme management.
 */

import { useEffect, useMemo } from "react";
import type { ThemeConfig, ThemeOverride } from "@framecraft/config";
import {
  getMergedTheme,
  applyThemeToDocument,
  getThemeColor,
  isDarkMode,
  toggleDarkMode,
  getBrandConfig,
} from "@framecraft/config";

export interface UseThemeOptions {
  /**
   * Store ID to get theme for
   */
  storeId?: string;

  /**
   * Theme override (optional, merges with store theme)
   */
  override?: ThemeOverride;

  /**
   * Apply theme to document automatically
   */
  applyToDocument?: boolean;
}

export interface UseThemeReturn {
  /**
   * Merged theme configuration
   */
  theme: ThemeConfig;

  /**
   * Get theme color value
   */
  getColor: (colorName: string) => string | null;

  /**
   * Check if dark mode is active
   */
  isDark: boolean;

  /**
   * Toggle dark mode
   */
  toggleDark: (force?: boolean) => void;
}

/**
 * useTheme hook
 *
 * @param options Hook options
 * @returns Theme utilities and configuration
 */
export function useTheme(options: UseThemeOptions = {}): UseThemeReturn {
  const { storeId, override, applyToDocument = true } = options;

  // Get theme override from store config if storeId provided
  const storeThemeOverride = useMemo(() => {
    if (!storeId) {
      return undefined;
    }

    try {
      const config = getBrandConfig(storeId);
      return config.theme;
    } catch {
      return undefined;
    }
  }, [storeId]);

  // Merge all theme overrides
  const finalOverride = useMemo(() => {
    if (!storeThemeOverride && !override) {
      return undefined;
    }

    // Merge store theme with additional override
    if (storeThemeOverride && override) {
      return {
        ...storeThemeOverride,
        ...override,
        colors: override.colors || storeThemeOverride.colors,
        typography: override.typography || storeThemeOverride.typography,
      };
    }

    return storeThemeOverride || override;
  }, [storeThemeOverride, override]);

  // Get merged theme
  const theme = useMemo(() => getMergedTheme(finalOverride), [finalOverride]);

  // Apply theme to document
  useEffect(() => {
    if (applyToDocument && typeof document !== "undefined") {
      applyThemeToDocument(theme);
    }
  }, [theme, applyToDocument]);

  // Get color helper
  const getColor = (colorName: string): string | null => {
    if (typeof document === "undefined") {
      return null;
    }
    return getThemeColor(colorName, document.documentElement);
  };

  // Dark mode helpers
  const isDark = typeof document !== "undefined" ? isDarkMode() : false;
  const toggleDark = (force?: boolean) => {
    if (typeof document !== "undefined") {
      toggleDarkMode(undefined, force);
    }
  };

  return {
    theme,
    getColor,
    isDark,
    toggleDark,
  };
}
