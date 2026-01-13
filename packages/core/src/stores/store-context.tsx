/**
 * Store Context Provider
 *
 * React context for accessing current store configuration.
 * Provides store ID, configuration, and utilities to child components.
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { BrandConfig } from "@framecraft/config";
import { getBrandConfig, isStoreActive } from "@framecraft/config";
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
   * Store ID
   */
  storeId: string;

  /**
   * Children components
   */
  children: ReactNode;
}

/**
 * StoreProvider component
 *
 * Provides store context to child components
 */
export function StoreProvider({ storeId, children }: StoreProviderProps): JSX.Element {
  // Get store configuration
  const config = useMemo(() => {
    try {
      return getBrandConfig(storeId);
    } catch (error) {
      throw new Error(`Store configuration not found for store: ${storeId}`, { cause: error });
    }
  }, [storeId]);

  // Check if store is active
  const isActive = useMemo(() => isStoreActive(storeId), [storeId]);

  // Get theme utilities
  const theme = useTheme({ storeId, applyToDocument: true });

  // Get feature flag utilities
  const features = useFeatureFlag({ storeId });

  const value: StoreContextValue = useMemo(
    () => ({
      storeId,
      config,
      isActive,
      theme,
      features,
    }),
    [storeId, config, isActive, theme, features]
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
