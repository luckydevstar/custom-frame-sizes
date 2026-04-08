/**
 * Theme Utilities
 *
 * Helper functions for working with themes and CSS custom properties.
 */

import { generateThemeCSS, hslToCSS } from "./base-theme";

import type { ThemeConfig } from "../theme";

/**
 * Apply theme to document
 * Injects CSS custom properties into the document
 *
 * @param theme Theme configuration
 * @param targetElement Target element to apply theme (default: document.documentElement)
 */
export function applyThemeToDocument(
  theme: ThemeConfig,
  _targetElement: HTMLElement = document.documentElement
): void {
  const css = generateThemeCSS(theme);

  // Create or update style element
  let styleElement = document.getElementById("framecraft-theme") as HTMLStyleElement;
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = "framecraft-theme";
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = css;
  // Note: targetElement parameter reserved for future use (applying to specific element)
}

/**
 * Get CSS custom property value
 *
 * @param propertyName Property name (e.g., "primary", "background")
 * @param element Element to read from (default: document.documentElement)
 * @returns CSS custom property value or null
 */
export function getThemeProperty(
  propertyName: string,
  element: HTMLElement = document.documentElement
): string | null {
  return getComputedStyle(element).getPropertyValue(`--color-${propertyName}`).trim() || null;
}

/**
 * Get theme color as HSL
 *
 * @param colorName Color name (e.g., "primary", "background")
 * @param element Element to read from (default: document.documentElement)
 * @returns HSL value or null
 */
export function getThemeColor(colorName: string, element?: HTMLElement): string | null {
  const value = getThemeProperty(colorName, element);
  if (!value) {
    return null;
  }
  return hslToCSS(value);
}

/**
 * Check if dark mode is active
 *
 * @param element Element to check (default: document.documentElement)
 * @returns true if dark mode is active
 */
export function isDarkMode(element: HTMLElement = document.documentElement): boolean {
  return element.classList.contains("dark");
}

/**
 * Toggle dark mode
 *
 * @param element Element to toggle (default: document.documentElement)
 * @param force Force dark mode on/off (optional)
 */
export function toggleDarkMode(
  element: HTMLElement = document.documentElement,
  force?: boolean
): void {
  if (force !== undefined) {
    if (force) {
      element.classList.add("dark");
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("framecraft-theme", "dark");
      }
    } else {
      element.classList.remove("dark");
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("framecraft-theme", "light");
      }
    }
  } else {
    element.classList.toggle("dark");
    // Persist the new state
    if (typeof window !== "undefined") {
      const isDark = element.classList.contains("dark");
      localStorage.setItem("framecraft-theme", isDark ? "dark" : "light");
    }
  }
}

/**
 * Restore theme from localStorage or system preference
 *
 * @param element Element to apply theme (default: document.documentElement)
 */
export function restoreTheme(element: HTMLElement = document.documentElement): void {
  if (typeof window === "undefined") return;

  // Check localStorage first
  const savedTheme = localStorage.getItem("framecraft-theme");
  if (savedTheme === "dark") {
    element.classList.add("dark");
    return;
  } else if (savedTheme === "light") {
    element.classList.remove("dark");
    return;
  }

  // Fall back to system preference
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    element.classList.add("dark");
  } else {
    element.classList.remove("dark");
  }
}
