/**
 * Theme Configuration
 *
 * Complete theme system including colors, typography, spacing, and layout.
 * This configuration supports both light and dark modes and can be customized per store.
 *
 * @packageDocumentation
 */

/**
 * Color values in HSL format (hue, saturation, lightness)
 * Used for CSS custom properties
 */
export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

/**
 * Color palette for light and dark modes
 */
export interface ColorPalette {
  /**
   * Background colors
   */
  background: string; // HSL format: "h s% l%"
  foreground: string;

  /**
   * Card/surface colors
   */
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;

  /**
   * Primary brand colors
   */
  primary: string;
  primaryForeground: string;

  /**
   * Secondary colors
   */
  secondary: string;
  secondaryForeground: string;

  /**
   * Muted/subtle colors
   */
  muted: string;
  mutedForeground: string;

  /**
   * Accent colors
   */
  accent: string;
  accentForeground: string;

  /**
   * Destructive/error colors
   */
  destructive: string;
  destructiveForeground: string;

  /**
   * Border and input colors
   */
  border: string;
  input: string;
  ring: string;
}

/**
 * Typography configuration
 */
export interface TypographyConfig {
  /**
   * Font families
   */
  fonts: {
    /**
     * Font for headings (e.g., "Playfair Display")
     */
    heading: string;

    /**
     * Font for body text (e.g., "Inter")
     */
    body: string;

    /**
     * Font for accents, CTAs, and labels (e.g., "Montserrat")
     */
    accent: string;
  };

  /**
   * Type scale configuration
   */
  scale: {
    hero: string; // e.g., "text-5xl md:text-6xl"
    sectionHeader: string; // e.g., "text-3xl md:text-4xl"
    subsection: string; // e.g., "text-xl md:text-2xl"
    body: string; // e.g., "text-base"
    caption: string; // e.g., "text-sm"
  };
}

/**
 * Spacing and layout configuration
 */
export interface LayoutConfig {
  /**
   * Border radius values
   */
  radius: {
    sm: string; // e.g., "0.1875rem" (3px)
    md: string; // e.g., "0.375rem" (6px)
    lg: string; // e.g., "0.5625rem" (9px)
    default: string; // e.g., "0.5rem"
  };

  /**
   * Spacing primitives (Tailwind units)
   */
  spacing: number[]; // e.g., [2, 4, 6, 8, 12, 16, 20]

  /**
   * Container widths
   */
  containers: {
    fullWidth: string; // e.g., "max-w-7xl"
    content: string; // e.g., "max-w-6xl"
    designer: string; // e.g., "max-w-screen-2xl"
  };

  /**
   * Section padding
   */
  sectionPadding: {
    main: string; // e.g., "py-16 md:py-24"
    compact: string; // e.g., "py-12"
  };

  /**
   * Header height
   */
  headerHeight: {
    mobile: string; // e.g., "56px"
    desktop: string; // e.g., "64px"
  };

  /**
   * Section gap
   */
  sectionGap: {
    mobile: string; // e.g., "3rem"
    desktop: string; // e.g., "4rem"
  };
}

/**
 * Brand-specific colors (hex format)
 */
export interface BrandColors {
  /**
   * Primary brand color (hex)
   */
  primary: string; // e.g., "#1D7BC7"

  /**
   * Accent color (hex)
   */
  accent: string; // e.g., "#FF7A00"

  /**
   * Hero overlay color
   */
  overlayColor: string; // e.g., "#000000"
}

/**
 * Hero section configuration
 */
export interface HeroConfig {
  overlayColor: string;
  overlayOpacity: number;
  heightDesktop: string;
  heightMobile: string;
  maxHeightPx: number;
  objectPosition: string;
}

/**
 * Logo configuration
 */
export interface LogoConfig {
  wordmarkPath: string;
  wordmarkDarkPath: string;
  markSvgPath: string;
  useSvgLogo: boolean;
}

/**
 * Complete theme configuration
 */
export interface ThemeConfig {
  /**
   * Color palette for light mode
   */
  colors: {
    light: ColorPalette;
    dark: ColorPalette;
  };

  /**
   * Typography configuration
   */
  typography: TypographyConfig;

  /**
   * Layout and spacing configuration
   */
  layout: LayoutConfig;

  /**
   * Brand-specific colors
   */
  brand: BrandColors;

  /**
   * Hero section configuration
   */
  hero: HeroConfig;

  /**
   * Logo configuration
   */
  logo: LogoConfig;
}

/**
 * Default theme configuration
 * This is the base theme that can be overridden per store
 */
export const defaultTheme: ThemeConfig = {
  colors: {
    light: {
      background: "0 0% 100%",
      foreground: "215 25% 15%",
      card: "0 0% 100%",
      cardForeground: "215 25% 15%",
      popover: "0 0% 100%",
      popoverForeground: "215 25% 15%",
      primary: "210 85% 45%",
      primaryForeground: "0 0% 100%",
      secondary: "210 15% 95%",
      secondaryForeground: "215 25% 15%",
      muted: "210 15% 95%",
      mutedForeground: "215 15% 40%",
      accent: "210 85% 45%",
      accentForeground: "0 0% 100%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 100%",
      border: "215 20% 88%",
      input: "215 20% 88%",
      ring: "210 85% 45%",
    },
    dark: {
      background: "215 28% 12%",
      foreground: "210 15% 95%",
      card: "215 25% 16%",
      cardForeground: "210 15% 95%",
      popover: "215 25% 16%",
      popoverForeground: "210 15% 95%",
      primary: "210 75% 55%",
      primaryForeground: "0 0% 100%",
      secondary: "215 20% 22%",
      secondaryForeground: "210 15% 95%",
      muted: "215 20% 22%",
      mutedForeground: "215 15% 65%",
      accent: "210 75% 55%",
      accentForeground: "0 0% 100%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "0 0% 100%",
      border: "215 20% 25%",
      input: "215 20% 25%",
      ring: "210 75% 55%",
    },
  },
  typography: {
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
      accent: "Montserrat",
    },
    scale: {
      hero: "text-5xl md:text-6xl",
      sectionHeader: "text-3xl md:text-4xl",
      subsection: "text-xl md:text-2xl",
      body: "text-base",
      caption: "text-sm",
    },
  },
  layout: {
    radius: {
      sm: "0.1875rem", // 3px
      md: "0.375rem", // 6px
      lg: "0.5625rem", // 9px
      default: "0.5rem", // 8px
    },
    spacing: [2, 4, 6, 8, 12, 16, 20],
    containers: {
      fullWidth: "max-w-7xl",
      content: "max-w-6xl",
      designer: "max-w-screen-2xl",
    },
    sectionPadding: {
      main: "py-16 md:py-24",
      compact: "py-12",
    },
    headerHeight: {
      mobile: "56px",
      desktop: "64px",
    },
    sectionGap: {
      mobile: "3rem",
      desktop: "4rem",
    },
  },
  brand: {
    primary: "#1D7BC7",
    accent: "#FF7A00",
    overlayColor: "#000000",
  },
  hero: {
    overlayColor: "#000000",
    overlayOpacity: 0.45,
    heightDesktop: "40vh",
    heightMobile: "35vh",
    maxHeightPx: 500,
    objectPosition: "center center",
  },
  logo: {
    wordmarkPath: "/assets/brand/logo-blue.png",
    wordmarkDarkPath: "/assets/brand/logo-dark.png",
    markSvgPath: "/assets/brand/cfs-mark.svg",
    useSvgLogo: false,
  },
};

/**
 * Generate CSS custom properties from theme configuration
 * Returns a string that can be injected into :root or .dark selector
 */
export function generateThemeCSS(theme: ThemeConfig, mode: "light" | "dark"): string {
  const palette = theme.colors[mode];
  const layout = theme.layout;

  return `
    --background: ${palette.background};
    --foreground: ${palette.foreground};
    --card: ${palette.card};
    --card-foreground: ${palette.cardForeground};
    --popover: ${palette.popover};
    --popover-foreground: ${palette.popoverForeground};
    --primary: ${palette.primary};
    --primary-foreground: ${palette.primaryForeground};
    --secondary: ${palette.secondary};
    --secondary-foreground: ${palette.secondaryForeground};
    --muted: ${palette.muted};
    --muted-foreground: ${palette.mutedForeground};
    --accent: ${palette.accent};
    --accent-foreground: ${palette.accentForeground};
    --destructive: ${palette.destructive};
    --destructive-foreground: ${palette.destructiveForeground};
    --border: ${palette.border};
    --input: ${palette.input};
    --ring: ${palette.ring};
    --radius: ${layout.radius.default};
    --section-gap: ${mode === "light" ? layout.sectionGap.mobile : layout.sectionGap.desktop};
    --header-h: ${mode === "light" ? layout.headerHeight.mobile : layout.headerHeight.desktop};
  `.trim();
}

/**
 * Get color value from theme palette
 */
export function getThemeColor(
  theme: ThemeConfig,
  mode: "light" | "dark",
  colorKey: keyof ColorPalette
): string {
  return theme.colors[mode][colorKey];
}

/**
 * Get typography font family
 */
export function getTypographyFont(
  theme: ThemeConfig,
  fontKey: keyof TypographyConfig["fonts"]
): string {
  return theme.typography.fonts[fontKey];
}

/**
 * Get layout value
 */
export function getLayoutValue(theme: ThemeConfig, path: string): string | number | undefined {
  const keys = path.split(".");
  let value: any = theme.layout;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key as keyof typeof value];
    } else {
      return undefined;
    }
  }

  return value;
}
