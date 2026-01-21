/**
 * SVG Path Generator for Jersey Frame Multi-Opening Mats
 * Generates compound SVG paths for rectangular mat openings
 * (jerseys, photos, plaques)
 */

// Standard scaling constant for SVG dimensions
export const INCHES_TO_PX = 72;

export interface JerseyRectOpening {
  x: number; // Position from mat interior top-left (inches)
  y: number;
  width: number; // Opening dimensions (inches)
  height: number;
}

/**
 * Generate SVG path for a single rectangular opening
 * Coordinates are in pixels
 */
function generateRectanglePath(x: number, y: number, width: number, height: number): string {
  return `M ${x},${y} 
          L ${x + width},${y} 
          L ${x + width},${y + height} 
          L ${x},${y + height} 
          Z`;
}

/**
 * Generate individual SVG paths for each opening (for bevel rendering)
 * Returns an array of path strings, one for each opening
 *
 * @param openingsPx - Array of opening rectangles in pixels
 * @returns Array of SVG path strings
 */
export function generateOpeningPaths(
  openingsPx: Array<{ x: number; y: number; width: number; height: number }>
): string[] {
  return openingsPx.map((opening) =>
    generateRectanglePath(opening.x, opening.y, opening.width, opening.height)
  );
}

/**
 * Generate compound SVG path for mat board with multiple rectangular openings
 * Uses even-odd fill rule to create holes in the mat
 *
 * @param matWidth - Total mat width in pixels
 * @param matHeight - Total mat height in pixels
 * @param openings - Array of opening rectangles in pixels
 * @param openingInset - Optional inset for openings only (for reveal), in pixels
 * @returns SVG path string with mat board and cutouts
 */
export function generateJerseyMatPath(
  matWidth: number,
  matHeight: number,
  openings: Array<{ x: number; y: number; width: number; height: number }>,
  openingInset: number = 0
): string {
  // Outer mat rectangle (clockwise) - always full size, no inset
  const outer = `M 0,0 
                 L ${matWidth},0 
                 L ${matWidth},${matHeight} 
                 L 0,${matHeight} 
                 Z`;

  // Generate paths for all openings (counter-clockwise for even-odd fill rule)
  // Only the openings are inset, not the outer boundary
  const openingPaths = openings
    .map((opening) => {
      const x = opening.x + openingInset;
      const y = opening.y + openingInset;
      const w = opening.width - 2 * openingInset;
      const h = opening.height - 2 * openingInset;

      return generateRectanglePath(x, y, w, h);
    })
    .join(" ");

  // Combine outer mat with all opening cutouts
  return `${outer} ${openingPaths}`;
}

/**
 * Convert jersey layout openings from inches to pixels
 *
 * @param openings - Array of openings in inches
 * @param scale - Pixels per inch scaling factor
 * @returns Array of openings in pixels
 */
export function convertOpeningsToPixels(
  openings: JerseyRectOpening[],
  scale: number
): Array<{ x: number; y: number; width: number; height: number }> {
  return openings.map((opening) => ({
    x: opening.x * scale,
    y: opening.y * scale,
    width: opening.width * scale,
    height: opening.height * scale,
  }));
}

/**
 * Generate paths for double-mat jersey frame
 * Returns both bottom mat (full openings) and top mat (with reveal inset)
 *
 * @param matWidthInches - Total mat width in inches
 * @param matHeightInches - Total mat height in inches
 * @param openings - Array of openings in inches
 * @param revealInches - Mat reveal width in inches (typically 0.5")
 * @param pixelsPerInch - Scaling factor (typically 72)
 * @returns Object with bottom and top mat SVG paths
 */
export function generateDoubleMatPaths(
  matWidthInches: number,
  matHeightInches: number,
  openings: JerseyRectOpening[],
  revealInches: number,
  pixelsPerInch: number
): { bottomMatPath: string; topMatPath: string; openingsPx: any[] } {
  const matWidthPx = matWidthInches * pixelsPerInch;
  const matHeightPx = matHeightInches * pixelsPerInch;
  const revealPx = revealInches * pixelsPerInch;

  // Convert openings to pixels
  const openingsPx = convertOpeningsToPixels(openings, pixelsPerInch);

  // Bottom mat: smaller openings (inset by reveal) so team color shows around edges
  const bottomMatPath = generateJerseyMatPath(
    matWidthPx,
    matHeightPx,
    openingsPx,
    revealPx // Inset by reveal width - creates smaller openings
  );

  // Top mat: larger openings (no inset) covers most of bottom mat
  const topMatPath = generateJerseyMatPath(
    matWidthPx,
    matHeightPx,
    openingsPx,
    0 // No inset - creates larger openings
  );

  return {
    bottomMatPath,
    topMatPath,
    openingsPx,
  };
}
