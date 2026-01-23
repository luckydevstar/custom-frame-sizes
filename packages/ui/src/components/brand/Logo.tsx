"use client";

import { useTheme } from "@framecraft/core";
import Image from "next/image";

interface LogoProps {
  /**
   * CSS class name for the logo
   * @default "h-14"
   */
  className?: string;

  /**
   * Logo for light mode (optional, will use default if not provided)
   */
  logoSrcLight?: string;

  /**
   * Logo for dark mode (optional, will use default if not provided)
   */
  logoSrcDark?: string;

  /**
   * Alt text for the logo
   * @default "Custom Frame Sizes.com"
   */
  alt?: string;
}

/**
 * Logo Component
 *
 * Displays the site logo with theme-aware switching between light and dark variants.
 * Uses Next.js Image component for optimization.
 * Matches the original CustomFrameSizes.com implementation.
 */
export function Logo({
  className = "h-14",
  logoSrcLight,
  logoSrcDark,
  alt = "Custom Frame Sizes.com",
}: LogoProps) {
  const { isDark } = useTheme({ applyToDocument: false });

  // Default logo paths (matching original implementation)
  const defaultLight = "/assets/brand/logo-blue.png";
  const defaultDark = "/assets/brand/logo-dark.png";

  const logoSrc = isDark ? logoSrcDark || defaultDark : logoSrcLight || defaultLight;

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={150}
      height={56}
      className={className}
      style={{ width: "auto", height: "auto" }}
      priority
    />
  );
}
