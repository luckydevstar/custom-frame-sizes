"use client";

/**
 * Store Context Provider
 *
 * React context for accessing current store configuration.
 * Provides store ID, configuration, and utilities to child components.
 *
 * SIMPLIFIED: Accepts config directly instead of using global registry.
 * This makes each store independent and easier to reason about.
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { BrandConfig } from "@framecraft/config";
import { useTheme } from "../hooks/use-theme";
import { useFeatureFlag } from "../hooks/use-feature-flag";

export interface StoreContextValue {
  /**
   * Current store ID
   */
  storeId: string;

  /**
   * Store configuration
   */
  config: BrandConfig;

  /**
   * Check if store is active
   */
  isActive: boolean;

  /**
   * Theme utilities (from useTheme)
   */
  theme: ReturnType<typeof useTheme>;

  /**
   * Feature flag utilities (from useFeatureFlag)
   */
  features: ReturnType<typeof useFeatureFlag>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export interface StoreProviderProps {
  /**
   * Store configuration (passed directly, no registry lookup needed)
   */
  config: BrandConfig;

  /**
   * Children components
   */
  children: ReactNode;
}

/**
 * StoreProvider component
 *
 * Provides store context to child components.
 * Accepts config directly for simplicity and independence.
 */
export function StoreProvider({ config, children }: StoreProviderProps): JSX.Element {
  // Check if store is active
  const isActive = useMemo(() => {
    return config.metadata?.isActive !== false; // Default to true if not specified
  }, [config.metadata?.isActive]);

  // Get theme utilities
  const theme = useTheme({ storeId: config.storeId, applyToDocument: true });

  // Get feature flag utilities
  const features = useFeatureFlag({ storeId: config.storeId });

  const value: StoreContextValue = useMemo(
    () => ({
      storeId: config.storeId,
      config,
      isActive,
      theme,
      features,
    }),
    [config, isActive, theme, features]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/**
 * useStoreContext hook
 *
 * Access store context from StoreProvider
 *
 * @returns Store context value
 * @throws Error if used outside StoreProvider
 */
export function useStoreContext(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within StoreProvider");
  }
  return context;
}

/**
 * useStoreId hook
 *
 * Get current store ID from context
 *
 * @returns Store ID
 * @throws Error if used outside StoreProvider
 */
export function useStoreId(): string {
  const context = useStoreContext();
  return context.storeId;
}

/**
 * useStoreConfig hook
 *
 * Get current store configuration from context
 *
 * @returns Store configuration
 * @throws Error if used outside StoreProvider
 */
export function useStoreConfig(): BrandConfig {
  const context = useStoreContext();
  return context.config;
}
