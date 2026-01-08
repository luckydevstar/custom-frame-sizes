/**
 * Feature Flag System
 *
 * Centralized feature flag configuration for enabling/disabling features across stores.
 * Feature flags can be set per store and evaluated at runtime.
 *
 * @packageDocumentation
 */

/**
 * Designer-specific feature flags
 */
export interface DesignerFeatureFlags {
  /**
   * Enable frame moulding selection UI in designers
   */
  FEATURE_MOULDING_PICKER?: boolean;

  /**
   * Enable mat set selection (coordinated mat color combinations)
   */
  FEATURE_MAT_SET?: boolean;

  /**
   * Enable jersey mounting option for sports memorabilia
   */
  FEATURE_JERSEY_MOUNT?: boolean;
}

/**
 * Application-wide feature flags
 */
export interface AppFeatureFlags {
  /**
   * Show rotating testimonials on homepage
   */
  showHomeTestimonial?: boolean;

  /**
   * Enable achievement system
   */
  enableAchievements?: boolean;

  /**
   * Enable gallery view
   */
  enableGallery?: boolean;

  /**
   * Enable AI-powered frame recommendations
   */
  enableAIRecommendations?: boolean;

  /**
   * Enable image upscaling
   */
  enableImageUpscaling?: boolean;
}

/**
 * Complete feature flags configuration
 */
export interface FeatureFlags extends DesignerFeatureFlags, AppFeatureFlags {
  /**
   * Store-specific feature overrides
   * Can be used to enable/disable features per store
   */
  [key: string]: boolean | undefined;
}

/**
 * Default feature flags configuration
 * All features are enabled by default
 */
export const defaultFeatureFlags: FeatureFlags = {
  // Designer features
  FEATURE_MOULDING_PICKER: true,
  FEATURE_MAT_SET: true,
  FEATURE_JERSEY_MOUNT: false, // Not yet implemented

  // App features
  showHomeTestimonial: true,
  enableAchievements: true,
  enableGallery: true,
  enableAIRecommendations: true,
  enableImageUpscaling: true,
};

/**
 * Evaluate a feature flag
 * Returns true if the feature is enabled, false otherwise
 *
 * @param flags Feature flags configuration
 * @param flagName Name of the feature flag to check
 * @returns true if feature is enabled, false otherwise
 */
export function isFeatureEnabled(flags: FeatureFlags, flagName: keyof FeatureFlags): boolean {
  return flags[flagName] === true;
}

/**
 * Check if multiple features are enabled
 * Returns true only if all specified features are enabled
 *
 * @param flags Feature flags configuration
 * @param flagNames Array of feature flag names to check
 * @returns true if all features are enabled, false otherwise
 */
export function areFeaturesEnabled(
  flags: FeatureFlags,
  flagNames: Array<keyof FeatureFlags>
): boolean {
  return flagNames.every((flagName) => isFeatureEnabled(flags, flagName));
}

/**
 * Check if any of the specified features are enabled
 * Returns true if at least one feature is enabled
 *
 * @param flags Feature flags configuration
 * @param flagNames Array of feature flag names to check
 * @returns true if any feature is enabled, false otherwise
 */
export function isAnyFeatureEnabled(
  flags: FeatureFlags,
  flagNames: Array<keyof FeatureFlags>
): boolean {
  return flagNames.some((flagName) => isFeatureEnabled(flags, flagName));
}

/**
 * Merge feature flags with overrides
 * Overrides take precedence over base flags
 *
 * @param base Base feature flags configuration
 * @param overrides Feature flag overrides
 * @returns Merged feature flags configuration
 */
export function mergeFeatureFlags(
  base: FeatureFlags,
  overrides: Partial<FeatureFlags>
): FeatureFlags {
  return {
    ...base,
    ...overrides,
  };
}

/**
 * Get designer-specific feature flags
 * Extracts only designer-related flags from the full feature flags object
 *
 * @param flags Complete feature flags configuration
 * @returns Designer feature flags
 */
export function getDesignerFeatureFlags(flags: FeatureFlags): DesignerFeatureFlags {
  return {
    FEATURE_MOULDING_PICKER: flags.FEATURE_MOULDING_PICKER,
    FEATURE_MAT_SET: flags.FEATURE_MAT_SET,
    FEATURE_JERSEY_MOUNT: flags.FEATURE_JERSEY_MOUNT,
  };
}

/**
 * Get app-specific feature flags
 * Extracts only app-related flags from the full feature flags object
 *
 * @param flags Complete feature flags configuration
 * @returns App feature flags
 */
export function getAppFeatureFlags(flags: FeatureFlags): AppFeatureFlags {
  return {
    showHomeTestimonial: flags.showHomeTestimonial,
    enableAchievements: flags.enableAchievements,
    enableGallery: flags.enableGallery,
    enableAIRecommendations: flags.enableAIRecommendations,
    enableImageUpscaling: flags.enableImageUpscaling,
  };
}

/**
 * Create feature flags from partial configuration
 * Merges with defaults for any missing flags
 *
 * @param partial Partial feature flags configuration
 * @returns Complete feature flags configuration
 */
export function createFeatureFlags(partial: Partial<FeatureFlags>): FeatureFlags {
  return mergeFeatureFlags(defaultFeatureFlags, partial);
}

/**
 * Validate feature flags configuration
 * Ensures all required flags are present and have valid values
 *
 * @param flags Feature flags to validate
 * @returns true if valid, false otherwise
 */
export function validateFeatureFlags(flags: FeatureFlags): boolean {
  // All flags should be boolean or undefined
  for (const value of Object.values(flags)) {
    if (value !== undefined && typeof value !== "boolean") {
      return false;
    }
  }
  return true;
}
