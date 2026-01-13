/**
 * Base Theme System
 *
 * Base theme configuration with CSS custom properties generation.
 * This is the default theme that all stores inherit from.
 */

import { defaultTheme, type ThemeConfig } from "../theme";

/**
 * Generate CSS custom properties from theme configuration
 *
 * @param theme Theme configuration
 * @returns CSS custom properties string
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  const cssVars: string[] = [];

  // Light mode colors
  for (const [key, value] of Object.entries(theme.colors.light)) {
    cssVars.push(`  --color-${key}: ${value};`);
  }

  // Dark mode colors (with .dark prefix)
  cssVars.push("\n  /* Dark mode colors */");
  for (const [key, value] of Object.entries(theme.colors.dark)) {
    cssVars.push(`  --color-${key}: ${value};`);
  }

  // Typography
  cssVars.push("\n  /* Typography */");
  cssVars.push(`  --font-heading: ${theme.typography.fonts.heading};`);
  cssVars.push(`  --font-body: ${theme.typography.fonts.body};`);
  cssVars.push(`  --font-accent: ${theme.typography.fonts.accent};`);

  // Spacing
  cssVars.push("\n  /* Spacing */");
  theme.layout.spacing.forEach((spacing, index) => {
    cssVars.push(`  --spacing-${index}: ${spacing}px;`);
  });

  // Border radius
  cssVars.push("\n  /* Border radius */");
  for (const [key, value] of Object.entries(theme.layout.radius)) {
    cssVars.push(`  --radius-${key}: ${value};`);
  }

  // Brand colors
  cssVars.push("\n  /* Brand colors */");
  for (const [key, value] of Object.entries(theme.brand)) {
    cssVars.push(`  --brand-${key}: ${value};`);
  }

  return `:root {\n${cssVars.join("\n")}\n}\n\n.dark {\n${cssVars
    .filter((line) => line.includes("--color-"))
    .map((line) => {
      const key = line.match(/--color-(\w+)/)?.[1];
      if (key) {
        const darkValue = theme.colors.dark[key as keyof typeof theme.colors.dark];
        return `  --color-${key}: ${darkValue};`;
      }
      return line;
    })
    .join("\n")}\n}`;
}

/**
 * Get base theme
 * Returns the default theme configuration
 */
export function getBaseTheme(): ThemeConfig {
  return defaultTheme;
}

/**
 * Convert HSL string to CSS HSL value
 *
 * @param hsl HSL string in format "h s% l%"
 * @returns CSS hsl() value
 */
export function hslToCSS(hsl: string): string {
  return `hsl(${hsl})`;
}

/**
 * Convert hex color to HSL
 *
 * @param hex Hex color (e.g., "#2563eb")
 * @returns HSL string in format "h s% l%"
 */
export function hexToHSL(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Parse RGB
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lightness = Math.round(l * 100);

  return `${h} ${s}% ${lightness}%`;
}
