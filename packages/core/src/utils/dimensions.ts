/**
 * Dimension parsing and formatting utilities
 * Helper functions for working with fractional measurements
 *
 * NOTE: This utility has been extracted to @framecraft/core.
 */

/**
 * Parse fractional input to decimal number
 * Supports formats: "12.5", "12 1/2", "1/2"
 *
 * @param input - Input string (e.g., "12 1/2" or "12.5")
 * @returns Decimal number
 *
 * @example
 * parseFraction("12 1/2") // returns 12.5
 * parseFraction("12.5") // returns 12.5
 * parseFraction("1/2") // returns 0.5
 */
export function parseFraction(input: string): number {
  if (!input) return 0;
  const cleaned = input.trim();

  // Handle decimal input
  if (cleaned.includes(".")) {
    return parseFloat(cleaned) || 0;
  }

  // Handle fraction input (e.g., "12 1/2" or "1/2")
  const parts = cleaned.split(" ");
  let whole = 0;
  let fraction = 0;

  if (parts.length === 2) {
    const wholePart = parts[0];
    const fracPart = parts[1];
    if (wholePart) {
      whole = parseInt(wholePart) || 0;
    }
    if (fracPart) {
      const fracParts = fracPart.split("/");
      if (fracParts.length === 2 && fracParts[0] && fracParts[1]) {
        fraction = (parseInt(fracParts[0]) || 0) / (parseInt(fracParts[1]) || 1);
      }
    }
  } else if (parts.length === 1 && parts[0] && parts[0].includes("/")) {
    const fracParts = parts[0].split("/");
    if (fracParts.length === 2 && fracParts[0] && fracParts[1]) {
      fraction = (parseInt(fracParts[0]) || 0) / (parseInt(fracParts[1]) || 1);
    }
  } else if (parts.length === 1 && parts[0]) {
    whole = parseInt(parts[0]) || 0;
  }

  return whole + fraction;
}

/**
 * Format decimal number as fraction string
 *
 * @param value - Decimal number
 * @returns Formatted string (e.g., "12 1/2" or "12.5")
 */
export function formatDimension(value: number): string {
  const whole = Math.floor(value);
  const decimal = value - whole;

  // If it's a whole number, return it
  if (decimal === 0) {
    return whole.toString();
  }

  // Common fractions
  const fractions: Record<string, string> = {
    "0.125": "1/8",
    "0.25": "1/4",
    "0.375": "3/8",
    "0.5": "1/2",
    "0.625": "5/8",
    "0.75": "3/4",
    "0.875": "7/8",
  };

  const decimalStr = decimal.toFixed(3);
  if (fractions[decimalStr]) {
    return `${whole} ${fractions[decimalStr]}`;
  }

  // Return decimal if not a common fraction
  return value.toFixed(2);
}

/**
 * Validate dimension input
 *
 * @param value - Dimension value to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns True if valid, false otherwise
 */
export function isValidDimension(value: number, min: number = 0, max: number = Infinity): boolean {
  return !isNaN(value) && value >= min && value <= max;
}

/**
 * Minimum dimension constants for frame interior and artwork
 */
export const MIN_INTERIOR = 4; // Minimum interior dimension (4×4 inches)
export const MIN_ART = 4; // Minimum artwork dimension (4×4 inches)

/**
 * Calculate required mat border to meet minimum interior size
 * Rounds to nearest 1/8 inch for practical framing
 *
 * @param artWidth - Artwork width in inches
 * @param artHeight - Artwork height in inches
 * @returns Required mat border width in inches (rounded to 1/8")
 *
 * @example
 * requiredMatBorder(1, 1) // returns 1.5 (1" art needs 1.5" mat for 4" interior)
 * requiredMatBorder(3, 4) // returns 0.5 (3×4 art needs 0.5" mat for 4×5 interior)
 * requiredMatBorder(4, 4) // returns 0 (4×4 art already meets minimum)
 * requiredMatBorder(8, 10) // returns 0 (larger art doesn't need mat for minimum)
 */
export function requiredMatBorder(artWidth: number, artHeight: number): number {
  if (!isValidDimension(artWidth, MIN_ART) || !isValidDimension(artHeight, MIN_ART)) {
    return 0;
  }

  // Calculate deficit for each dimension
  const widthDeficit = Math.max(0, MIN_INTERIOR - artWidth);
  const heightDeficit = Math.max(0, MIN_INTERIOR - artHeight);

  // Take the larger deficit and divide by 2 (mat on both sides)
  const requiredBorder = Math.max(widthDeficit, heightDeficit) / 2;

  // Round to nearest 1/8 inch
  const roundedBorder = Math.ceil(requiredBorder * 8) / 8;

  return roundedBorder;
}

/**
 * Validate artwork dimensions meet minimum size requirement
 *
 * @param artWidth - Artwork width in inches
 * @param artHeight - Artwork height in inches
 * @returns Object with validation result and message
 *
 * @example
 * validateArtworkSize(4, 4) // { valid: true }
 * validateArtworkSize(3, 3) // { valid: false, message: "Artwork must be at least 4×4 inches" }
 * validateArtworkSize(2, 5) // { valid: false, message: "Width must be at least 4 inches" }
 */
export function validateArtworkSize(
  artWidth: number,
  artHeight: number
): {
  valid: boolean;
  message?: string;
} {
  const widthValid = artWidth >= MIN_ART;
  const heightValid = artHeight >= MIN_ART;

  if (!widthValid && !heightValid) {
    return {
      valid: false,
      message: `Artwork must be at least ${MIN_ART}×${MIN_ART} inches. Current: ${formatDimension(artWidth)}×${formatDimension(artHeight)}"`,
    };
  }

  if (!widthValid) {
    return {
      valid: false,
      message: `Width must be at least ${MIN_ART} inches. Current: ${formatDimension(artWidth)}"`,
    };
  }

  if (!heightValid) {
    return {
      valid: false,
      message: `Height must be at least ${MIN_ART} inches. Current: ${formatDimension(artHeight)}"`,
    };
  }

  return { valid: true };
}

/**
 * Validate if artwork meets minimum interior dimension requirement
 *
 * @param artWidth - Artwork width in inches
 * @param artHeight - Artwork height in inches
 * @param matBorder - Mat border width in inches
 * @returns Object with validation result and details
 *
 * @example
 * validateMinimumInterior(2, 2, 1) // { valid: true, interiorWidth: 4, interiorHeight: 4 }
 * validateMinimumInterior(3, 3, 0) // { valid: false, interiorWidth: 3, interiorHeight: 3, required: 0.5 }
 * validateMinimumInterior(5, 7, 0) // { valid: true, interiorWidth: 5, interiorHeight: 7 }
 */
export function validateMinimumInterior(
  artWidth: number,
  artHeight: number,
  matBorder: number
): {
  valid: boolean;
  interiorWidth: number;
  interiorHeight: number;
  requiredMatBorder?: number;
  message?: string;
} {
  const interiorWidth = artWidth + matBorder * 2;
  const interiorHeight = artHeight + matBorder * 2;

  const valid = interiorWidth >= MIN_INTERIOR && interiorHeight >= MIN_INTERIOR;

  if (!valid) {
    const required = requiredMatBorder(artWidth, artHeight);
    return {
      valid: false,
      interiorWidth,
      interiorHeight,
      requiredMatBorder: required,
      message: `Interior must be at least ${MIN_INTERIOR}×${MIN_INTERIOR}". Add ${formatDimension(required)}" mat border.`,
    };
  }

  return {
    valid: true,
    interiorWidth,
    interiorHeight,
    message: `Interior size: ${formatDimension(interiorWidth)}×${formatDimension(interiorHeight)}"`,
  };
}

/**
 * Compute preview layout with single scale factor for containment
 * Ensures the entire frame (frame + mat + opening + photo) fits within container with padding
 *
 * @param config - Layout configuration
 * @returns Layout dimensions in pixels with single scale factor
 *
 * @example
 * computePreviewLayout({
 *   artW: 16, artH: 20,
 *   matBorder: 2.5,
 *   matReveal: 0.25,
 *   frameFace: 0.75,
 *   containerWpx: 600, containerHpx: 500,
 *   paddingPx: 12
 * })
 *
 * @example with asymmetric borders (bottom-weighted mat)
 * computePreviewLayout({
 *   artW: 16, artH: 20,
 *   matBorderTop: 2.5,
 *   matBorderRight: 2.5,
 *   matBorderBottom: 3.0,
 *   matBorderLeft: 2.5,
 *   frameFace: 0.75,
 *   containerWpx: 600, containerHpx: 500,
 * })
 */
export function computePreviewLayout({
  artW,
  artH,
  matBorder,
  matBorderTop,
  matBorderRight,
  matBorderBottom,
  matBorderLeft,
  matReveal = 0,
  frameFace = 0.75,
  containerWpx,
  containerHpx,
  paddingPx = 12,
}: {
  artW: number;
  artH: number;
  matBorder?: number;
  matBorderTop?: number;
  matBorderRight?: number;
  matBorderBottom?: number;
  matBorderLeft?: number;
  matReveal?: number;
  frameFace?: number;
  containerWpx: number;
  containerHpx: number;
  paddingPx?: number;
}) {
  // Ensure minimum dimensions
  const interiorW = Math.max(artW, 1);
  const interiorH = Math.max(artH, 1);

  // Support both uniform and individual mat borders
  // If individual borders are provided, use those; otherwise use uniform matBorder
  const matTop = matBorderTop !== undefined ? matBorderTop : matBorder || 0;
  const matRight = matBorderRight !== undefined ? matBorderRight : matBorder || 0;
  const matBottom = matBorderBottom !== undefined ? matBorderBottom : matBorder || 0;
  const matLeft = matBorderLeft !== undefined ? matBorderLeft : matBorder || 0;

  // Calculate glass dimensions (interior + mat borders on each side)
  const glassW = interiorW + matLeft + matRight;
  const glassH = interiorH + matTop + matBottom;

  // Calculate outer frame dimensions (glass + frame face + mat reveal for double mats)
  const outerW = glassW + 2 * frameFace + 2 * matReveal;
  const outerH = glassH + 2 * frameFace + 2 * matReveal;

  // Calculate available space (subtract padding)
  const availW = Math.max(containerWpx - 2 * paddingPx, 1);
  const availH = Math.max(containerHpx - 2 * paddingPx, 1);

  // Calculate scale to contain within available space (never exceed)
  const scale = Math.min(availW / outerW, availH / outerH);

  return {
    scale,
    paddingPx,
    outerPx: { w: outerW * scale, h: outerH * scale },
    glassPx: { w: glassW * scale, h: glassH * scale },
    openingPx: { w: interiorW * scale, h: interiorH * scale },
    frameFacePx: frameFace * scale,
    matPx: matBorder ? matBorder * scale : matTop * scale,
    matTopPx: matTop * scale,
    matRightPx: matRight * scale,
    matBottomPx: matBottom * scale,
    matLeftPx: matLeft * scale,
    matRevealPx: matReveal * scale,
  };
}
