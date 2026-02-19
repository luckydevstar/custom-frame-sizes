"use client";

/**
 * useFeatureFlag Hook
 *
 * React hook for accessing feature flags from store configuration.
 */

import { useMemo } from "react";
import {
  defaultFeatureFlags,
  mergeFeatureFlags,
  isFeatureEnabled,
  areFeaturesEnabled,
  isAnyFeatureEnabled,
  type FeatureFlags,
} from "@framecraft/config";
import { getBrandConfig } from "@framecraft/config";

export interface UseFeatureFlagOptions {
  /**
   * Store ID to get feature flags for
   */
  storeId?: string;
}

export interface UseFeatureFlagReturn {
  /**
   * Merged feature flags configuration
   */
  flags: FeatureFlags;

  /**
   * Check if a feature is enabled
   */
  isEnabled: (flagName: keyof FeatureFlags) => boolean;

  /**
   * Check if multiple features are enabled
   */
  areEnabled: (flagNames: Array<keyof FeatureFlags>) => boolean;

  /**
   * Check if any of the specified features are enabled
   */
  isAnyEnabled: (flagNames: Array<keyof FeatureFlags>) => boolean;
}

/**
 * useFeatureFlag hook
 *
 * @param options Hook options
 * @returns Feature flag utilities
 */
export function useFeatureFlag(options: UseFeatureFlagOptions = {}): UseFeatureFlagReturn {
  const { storeId } = options;

  // Get feature flags from store config if storeId provided
  const flags = useMemo(() => {
    let storeFeatureOverrides: Partial<FeatureFlags> | undefined;

    if (storeId) {
      try {
        const config = getBrandConfig(storeId);
        storeFeatureOverrides = config.features;
      } catch {
        // Store not found, use defaults
      }
    }

    if (storeFeatureOverrides) {
      return mergeFeatureFlags(defaultFeatureFlags, storeFeatureOverrides);
    }

    return defaultFeatureFlags;
  }, [storeId]);

  // Helper functions
  const isEnabled = (flagName: keyof FeatureFlags): boolean => {
    return isFeatureEnabled(flags, flagName);
  };

  const areEnabled = (flagNames: Array<keyof FeatureFlags>): boolean => {
    return areFeaturesEnabled(flags, flagNames);
  };

  const isAnyEnabled = (flagNames: Array<keyof FeatureFlags>): boolean => {
    return isAnyFeatureEnabled(flags, flagNames);
  };

  return {
    flags,
    isEnabled,
    areEnabled,
    isAnyEnabled,
  };
}
