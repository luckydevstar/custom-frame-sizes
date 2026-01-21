/**
 * Geometry and Constraint Library for Mat Designer
 * Handles collision detection, placement validation, and shape path generation
 */

// CONSTANTS
export const NO_CUT_INSET_IN = 0.75; // Minimum distance from mat edge (0.75")
export const MIN_SPACING_IN = 0.75; // Minimum distance between openings (0.75")
export const QUANTIZE_STEP_IN = 0.125; // 1/8" quantization for stability
export const SNAP_TOLERANCE_IN = 0.25; // Snap threshold for center/align (1/4 inch for better UX)

/**
 * Quantize a value to nearest step (default 1/8")
 */
export function quantizeIn(valueIn: number, step: number = QUANTIZE_STEP_IN): number {
  return Math.round(valueIn / step) * step;
}

/**
 * Pure function - calculate centered position for an opening within a mat
 * @param opening - Opening with width and height
 * @param matWidth - Overall mat width in inches
 * @param matHeight - Overall mat height in inches
 * @returns Centered position (xIn, yIn) as top-left corner
 */
export function centerOpeningWithinMat(
  opening: Pick<GeometryOpening, "wIn" | "hIn">,
  matWidth: number,
  matHeight: number
): { xIn: number; yIn: number } {
  return {
    xIn: (matWidth - (opening.wIn || 0)) / 2,
    yIn: (matHeight - (opening.hIn || 0)) / 2,
  };
}

/**
 * Wrapper that applies centering + quantization
 * Used when mat size changes or opening dimensions change
 * @param opening - Opening to recenter
 * @param matW - Overall mat width in inches
 * @param matH - Overall mat height in inches
 * @returns Opening with centered and quantized position
 */
export function recenterAfterSizeChange(
  opening: GeometryOpening,
  matW: number,
  matH: number
): GeometryOpening {
  const centered = centerOpeningWithinMat(opening, matW, matH);
  return {
    ...opening,
    xIn: quantizeIn(centered.xIn),
    yIn: quantizeIn(centered.yIn),
  };
}

/**
 * Axis-Aligned Bounding Box
 */
export interface AABB {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Opening interface for geometry calculations
 */
export interface GeometryOpening {
  id: string;
  shape: string;
  xIn: number;
  yIn: number;
  wIn?: number;
  hIn?: number;
  rxIn?: number; // For circles/ovals
  ryIn?: number; // For ovals
}

/**
 * Get AABB (Axis-Aligned Bounding Box) for an opening
 *
 * UNIFORM BOUNDING BOX SYSTEM:
 * All shapes now use xIn, yIn as top-left corner and wIn, hIn as dimensions.
 * This provides consistent behavior for positioning, spacing, and resizing.
 *
 * For backward compatibility, supports legacy rxIn/ryIn for circles/ovals.
 */
export function aabb(opening: GeometryOpening): AABB {
  const { shape, xIn, yIn, wIn = 0, hIn = 0, rxIn = 0, ryIn = 0 } = opening;

  // UNIFORM SYSTEM: All shapes use top-left + dimensions
  // xIn, yIn = top-left corner of bounding rectangle
  // wIn, hIn = width and height of bounding rectangle

  // Handle legacy circle/oval openings that use rxIn/ryIn (backward compatibility)
  if ((shape === "circle" || shape === "oval") && rxIn > 0 && wIn === 0) {
    // Legacy format: center-based with radii
    const rx = rxIn || 3;
    const ry = shape === "oval" ? ryIn || rx : rx;
    return {
      x1: xIn - rx, // Convert from center to top-left
      y1: yIn - ry,
      x2: xIn + rx,
      y2: yIn + ry,
    };
  }

  // STANDARD BOUNDING BOX (all shapes including rect, circle, oval, decorative)
  return {
    x1: xIn,
    y1: yIn,
    x2: xIn + wIn,
    y2: yIn + hIn,
  };
}

/**
 * Check if two AABBs intersect
 */
export function intersects(a: AABB, b: AABB): boolean {
  return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
}

/**
 * Check if opening violates the no-cut zone (0.75" from edges)
 */
export function violatesNoCutZone(
  opening: GeometryOpening,
  overallWIn: number,
  overallHIn: number
): boolean {
  const box = aabb(opening);

  // Check all four edges
  if (box.x1 < NO_CUT_INSET_IN) return true; // Left edge
  if (box.y1 < NO_CUT_INSET_IN) return true; // Top edge
  if (box.x2 > overallWIn - NO_CUT_INSET_IN) return true; // Right edge
  if (box.y2 > overallHIn - NO_CUT_INSET_IN) return true; // Bottom edge

  return false;
}

/**
 * Check if opening violates minimum spacing from other openings
 * @param opening - The opening to check
 * @param others - Other openings to check against
 * @param minSpacing - Minimum spacing in inches (default: 0.75" for double mat compatibility, can be 0.25" for single mats)
 */
export function violatesSpacing(
  opening: GeometryOpening,
  others: GeometryOpening[],
  minSpacing: number = MIN_SPACING_IN
): boolean {
  const box = aabb(opening);

  for (const other of others) {
    if (other.id === opening.id) continue; // Skip self

    const otherBox = aabb(other);

    // Expand boxes by minSpacing to check spacing
    const expandedBox = {
      x1: box.x1 - minSpacing,
      y1: box.y1 - minSpacing,
      x2: box.x2 + minSpacing,
      y2: box.y2 + minSpacing,
    };

    if (intersects(expandedBox, otherBox)) {
      return true;
    }
  }

  return false;
}

/**
 * Find first free placement for a new opening
 * Uses coarse grid search with 0.25" steps
 * @param minSpacing - Minimum spacing in inches (default: 0.75" for double mat compatibility, can be 0.25" for single mats)
 */
export function firstFreePlacement(
  overallWIn: number,
  overallHIn: number,
  size: { wIn: number; hIn: number },
  existing: GeometryOpening[],
  minSpacing: number = MIN_SPACING_IN
): { xIn: number; yIn: number } | null {
  const gridStep = 0.25; // Coarse grid search
  const testOpening: GeometryOpening = {
    id: "test",
    shape: "rect",
    xIn: 0,
    yIn: 0,
    wIn: size.wIn,
    hIn: size.hIn,
  };

  // Try positions from top-left, moving right then down
  for (let y = NO_CUT_INSET_IN; y <= overallHIn - NO_CUT_INSET_IN - size.hIn; y += gridStep) {
    for (let x = NO_CUT_INSET_IN; x <= overallWIn - NO_CUT_INSET_IN - size.wIn; x += gridStep) {
      testOpening.xIn = x;
      testOpening.yIn = y;

      // Check if this position is valid
      if (
        !violatesNoCutZone(testOpening, overallWIn, overallHIn) &&
        !violatesSpacing(testOpening, existing, minSpacing)
      ) {
        return { xIn: quantizeIn(x), yIn: quantizeIn(y) };
      }
    }
  }

  return null; // No free space found
}

/**
 * Calculate snap position for center alignment
 */
export function snapToCenter(
  position: number,
  size: number,
  containerSize: number
): { snapped: number; isSnapped: boolean } {
  const center = position + size / 2;
  const containerCenter = containerSize / 2;

  if (Math.abs(center - containerCenter) < SNAP_TOLERANCE_IN) {
    const snappedPos = containerCenter - size / 2;
    return { snapped: snappedPos, isSnapped: true };
  }

  return { snapped: position, isSnapped: false };
}

/**
 * Calculate snap position for edge alignment with other openings
 */
export function snapToAlign(
  position: number,
  size: number,
  others: GeometryOpening[],
  axis: "x" | "y"
): { snapped: number; isSnapped: boolean } {
  const edges = [position, position + size]; // Start and end of current opening

  for (const other of others) {
    const otherBox = aabb(other);
    const otherEdges = axis === "x" ? [otherBox.x1, otherBox.x2] : [otherBox.y1, otherBox.y2];

    // Check alignment with other opening's edges
    for (const otherEdge of otherEdges) {
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (edge !== undefined && Math.abs(edge - otherEdge) < SNAP_TOLERANCE_IN) {
          const snappedPos = i === 0 ? otherEdge : otherEdge - size;
          return { snapped: snappedPos, isSnapped: true };
        }
      }
    }
  }

  return { snapped: position, isSnapped: false };
}

// ============================================================================
// SHAPE PATH BUILDERS
// ============================================================================

/**
 * Generate SVG path for diamond shape
 */
export function getDiamondPath(xIn: number, yIn: number, sizeIn: number): string {
  const half = sizeIn / 2;
  return `M ${xIn},${yIn - half} L ${xIn + half},${yIn} L ${xIn},${yIn + half} L ${xIn - half},${yIn} Z`;
}

/**
 * Generate SVG path for club shape (card suit)
 */
export function getClubPath(xIn: number, yIn: number, sizeIn: number): string {
  const r = sizeIn * 0.15; // Circle radius
  const stemWidth = sizeIn * 0.2;
  const stemHeight = sizeIn * 0.3;

  // Three circles forming clover + stem
  return `
    M ${xIn},${yIn - r * 2} 
    a ${r},${r} 0 1,1 0,${r * 2}
    a ${r},${r} 0 1,1 ${r * 1.5},${-r * 0.5}
    a ${r},${r} 0 1,1 ${r * 1.5},${r * 0.5}
    a ${r},${r} 0 1,1 0,${-r * 2}
    M ${xIn - stemWidth / 2},${yIn + r}
    L ${xIn - stemWidth},${yIn + r + stemHeight}
    L ${xIn + stemWidth},${yIn + r + stemHeight}
    L ${xIn + stemWidth / 2},${yIn + r}
    Z
  `
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Generate SVG path for spade shape (card suit)
 */
export function getSpadePath(xIn: number, yIn: number, sizeIn: number): string {
  const half = sizeIn / 2;
  const r = sizeIn * 0.25;
  const stemWidth = sizeIn * 0.2;
  const stemHeight = sizeIn * 0.25;

  // Inverted heart shape + stem
  const path = `
    M ${xIn},${yIn - half}
    Q ${xIn - half},${yIn - r} ${xIn - r},${yIn}
    a ${r},${r} 0 1,0 ${r * 2},0
    Q ${xIn + half},${yIn - r} ${xIn},${yIn - half}
    M ${xIn - stemWidth / 2},${yIn}
    L ${xIn - stemWidth},${yIn + stemHeight}
    L ${xIn + stemWidth},${yIn + stemHeight}
    L ${xIn + stemWidth / 2},${yIn}
    Z
  `
    .trim()
    .replace(/\s+/g, " ");
  return path;
}
