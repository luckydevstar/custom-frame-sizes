/**
 * Shared Collage Math Utilities
 *
 * Provides opening geometry calculations, preview scaling, and manifest builders
 * for multi-opening frame designs (comics, jerseys, military displays, etc.)
 */

export interface CollageOpening {
  x: number; // X position in pixels
  y: number; // Y position in pixels
  width: number; // Width in pixels
  height: number; // Height in pixels
  xPercent: number; // X position as percentage (0-100)
  yPercent: number; // Y position as percentage (0-100)
  widthPercent: number; // Width as percentage (0-100)
  heightPercent: number; // Height as percentage (0-100)
}

export interface MatManifest {
  openings: CollageOpening[];
  frameWidth: number; // Total frame width in inches
  frameHeight: number; // Total frame height in inches
  matBorder: number; // Mat border width in inches
  matReveal: number; // Mat reveal width in inches (for double mats)
}

/**
 * Compute comic openings in pixel coordinates for preview rendering
 *
 * @param frameWidthInches - Total frame width in inches
 * @param frameHeightInches - Total frame height in inches
 * @param matBorderInches - Mat border width in inches
 * @param rows - Number of rows in grid
 * @param columns - Number of columns in grid
 * @param comicWidthInches - Width of each comic in inches
 * @param comicHeightInches - Height of each comic in inches
 * @param spacingFactor - Spacing between comics as fraction of comic width (e.g., 0.15 = 15%)
 * @param pixelsPerInch - Actual pixels-per-inch scale (from getPreviewScale)
 * @returns Array of opening positions in both pixels and percentages
 */
export function computeComicOpeningsPx(
  frameWidthInches: number,
  frameHeightInches: number,
  matBorderInches: number,
  rows: number,
  columns: number,
  comicWidthInches: number,
  comicHeightInches: number,
  spacingFactor: number,
  pixelsPerInch: number
): CollageOpening[] {
  const openings: CollageOpening[] = [];

  // Use the passed-in pixels-per-inch scale (derived from min of width/height constraints)
  const scale = pixelsPerInch;

  // Spacing between comics in inches
  const spacingInches = comicWidthInches * spacingFactor;

  // Fixed 2-inch mat border on all sides for on-screen rendering
  const FIXED_MAT_BORDER = 2.0;
  const matBorderPx = FIXED_MAT_BORDER * scale;

  // Comic dimensions in pixels
  const comicWidthPx = comicWidthInches * scale;
  const comicHeightPx = comicHeightInches * scale;
  const spacingPx = spacingInches * scale;

  // Generate opening positions starting from fixed mat border
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = matBorderPx + col * (comicWidthPx + spacingPx);
      const y = matBorderPx + row * (comicHeightPx + spacingPx);

      // Calculate as percentages too
      const xPercent = (x / (frameWidthInches * scale)) * 100;
      const yPercent = (y / (frameHeightInches * scale)) * 100;
      const widthPercent = (comicWidthPx / (frameWidthInches * scale)) * 100;
      const heightPercent = (comicHeightPx / (frameHeightInches * scale)) * 100;

      openings.push({
        x,
        y,
        width: comicWidthPx,
        height: comicHeightPx,
        xPercent,
        yPercent,
        widthPercent,
        heightPercent,
      });
    }
  }

  return openings;
}

/**
 * Build a complete mat manifest for preview rendering
 *
 * @param frameWidthInches - Total frame width in inches
 * @param frameHeightInches - Total frame height in inches
 * @param matBorderInches - Mat border width in inches
 * @param matRevealInches - Mat reveal width in inches (for double mats)
 * @param rows - Number of rows in grid
 * @param columns - Number of columns in grid
 * @param comicWidthInches - Width of each comic in inches
 * @param comicHeightInches - Height of each comic in inches
 * @param spacingFactor - Spacing between comics as fraction of comic width
 * @param pixelsPerInch - Actual pixels-per-inch scale (from getPreviewScale)
 * @returns Complete mat manifest with all opening positions
 */
export function buildMatManifest(
  frameWidthInches: number,
  frameHeightInches: number,
  matBorderInches: number,
  matRevealInches: number,
  rows: number,
  columns: number,
  comicWidthInches: number,
  comicHeightInches: number,
  spacingFactor: number,
  pixelsPerInch: number
): MatManifest {
  const openings = computeComicOpeningsPx(
    frameWidthInches,
    frameHeightInches,
    matBorderInches,
    rows,
    columns,
    comicWidthInches,
    comicHeightInches,
    spacingFactor,
    pixelsPerInch
  );

  return {
    openings,
    frameWidth: frameWidthInches,
    frameHeight: frameHeightInches,
    matBorder: matBorderInches,
    matReveal: matRevealInches,
  };
}

/**
 * Calculate optimal preview scale to fit container
 *
 * @param frameWidthInches - Frame width in inches
 * @param frameHeightInches - Frame height in inches
 * @param containerWidthPx - Available container width in pixels
 * @param containerHeightPx - Available container height in pixels
 * @param maxScale - Maximum scale factor (default 1.0 = actual size)
 * @returns Optimal scale factor and resulting dimensions
 */
export function getPreviewScale(
  frameWidthInches: number,
  frameHeightInches: number,
  containerWidthPx: number,
  containerHeightPx: number,
  maxScale: number = 1.0
): {
  scale: number;
  previewWidth: number;
  previewHeight: number;
  pixelsPerInch: number;
} {
  // Calculate scale to fit width
  const scaleWidth = containerWidthPx / frameWidthInches;

  // Calculate scale to fit height
  const scaleHeight = containerHeightPx / frameHeightInches;

  // Use the smaller scale to ensure it fits in both dimensions
  let scale = Math.min(scaleWidth, scaleHeight);

  // Apply max scale limit
  scale = Math.min(scale, maxScale);

  const previewWidth = frameWidthInches * scale;
  const previewHeight = frameHeightInches * scale;
  const pixelsPerInch = scale;

  return {
    scale,
    previewWidth,
    previewHeight,
    pixelsPerInch,
  };
}

/**
 * Create deterministic seed from configuration string
 * Used to ensure same random selections appear for same URL parameters
 *
 * @param configString - Configuration identifier (e.g., "modern-age-4-quad-mat-1-mat-2")
 * @returns Deterministic hash number
 */
export function createDeterministicSeed(configString: string): number {
  let hash = 0;
  for (let i = 0; i < configString.length; i++) {
    const char = configString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate configuration string for deterministic seeding
 *
 * @param formatId - Comic format ID
 * @param layoutId - Layout ID
 * @param matId - Outer mat ID
 * @param matInnerId - Inner mat ID (if double mat)
 * @param plaqueText - Brass plaque text (optional)
 * @returns Configuration string for seeding
 */
export function createConfigString(
  formatId: string,
  layoutId: string,
  matId: string,
  matInnerId?: string,
  plaqueText?: string
): string {
  const parts = [formatId, layoutId, matId];
  if (matInnerId) parts.push(matInnerId);
  if (plaqueText) parts.push(plaqueText.replace(/\s+/g, "-").toLowerCase());
  return parts.join("-");
}

/**
 * Adjust frame height for brass plaque
 * Brass plaques add 1.5" to the bottom of the frame
 *
 * @param baseHeight - Base frame height in inches
 * @param plaqueEnabled - Whether brass plaque is enabled
 * @returns Adjusted frame height
 */
export function adjustHeightForPlaque(baseHeight: number, plaqueEnabled: boolean): number {
  return plaqueEnabled ? baseHeight + 1.5 : baseHeight;
}

/**
 * Validate mat border and reveal combination
 * Reveal must be less than border
 *
 * @param borderInches - Mat border width in inches
 * @param revealInches - Mat reveal width in inches
 * @returns Validation result
 */
export function validateMatBorderReveal(
  borderInches: number,
  revealInches: number
): { valid: boolean; error?: string } {
  if (revealInches >= borderInches) {
    return {
      valid: false,
      error: "Mat reveal must be less than mat border",
    };
  }

  if (borderInches < 0.5) {
    return {
      valid: false,
      error: "Mat border must be at least 0.5 inches",
    };
  }

  if (revealInches < 0) {
    return {
      valid: false,
      error: "Mat reveal cannot be negative",
    };
  }

  return { valid: true };
}
