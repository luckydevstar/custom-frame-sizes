/**
 * Theme Provider
 *
 * React context provider for theme management.
 * Provides theme configuration and utilities to child components.
 */

import { createContext, useContext, type ReactNode } from "react";
import { useTheme, type UseThemeReturn } from "@framecraft/core";

export interface ThemeProviderProps {
  /**
   * Store ID to get theme for
   */
  storeId?: string;

  /**
   * Theme override (optional)
   */
  themeOverride?: {
    colors?: Partial<Record<string, string>>;
    typography?: Partial<Record<string, unknown>>;
    spacing?: Partial<Record<string, string>>;
    layout?: Partial<Record<string, unknown>>;
  };

  /**
   * Children components
   */
  children: ReactNode;
}

const ThemeContext = createContext<UseThemeReturn | null>(null);

/**
 * ThemeProvider component
 *
 * Provides theme context to child components
 */
export function ThemeProvider({
  storeId,
  themeOverride,
  children,
}: ThemeProviderProps): JSX.Element {
  const theme = useTheme({
    storeId,
    override: themeOverride,
    applyToDocument: true,
  });

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/**
 * useThemeContext hook
 *
 * Access theme context from ThemeProvider
 *
 * @returns Theme utilities and configuration
 * @throws Error if used outside ThemeProvider
 */
export function useThemeContext(): UseThemeReturn {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
}
