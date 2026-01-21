/**
 * Comic Book Frame Layout Definitions
 *
 * Defines the 10 layout options for comic book frames, including
 * single comic, horizontal rows, vertical columns, and quad grids.
 */

import { getComicFormatById } from "./comic-formats";

export type ComicLayoutType =
  | "" // Empty string for initial unselected state (mobile stepper)
  | "single"
  | "2-horizontal"
  | "3-horizontal"
  | "4-horizontal"
  | "5-horizontal"
  | "6-horizontal"
  | "3-vertical"
  | "4-vertical"
  | "4-quad"
  | "6-quad"
  | "6-grid"
  | "8-grid";

export interface ComicOpening {
  x: number; // X position as percentage (0-100)
  y: number; // Y position as percentage (0-100)
  width: number; // Width as percentage (0-100)
  height: number; // Height as percentage (0-100)
}

export interface ComicLayout {
  id: ComicLayoutType;
  displayName: string;
  count: number; // Number of comic openings
  rows: number; // Grid rows
  columns: number; // Grid columns
  orientation: "portrait" | "landscape" | "square";
  spacingFactor: number; // Spacing between openings as factor of comic width (default 0.15 = 15%)
  description: string;
}

/**
 * All comic layout configurations
 */
export const COMIC_LAYOUTS: ComicLayout[] = [
  {
    id: "single",
    displayName: "Single Comic",
    count: 1,
    rows: 1,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0,
    description: "Display one comic book",
  },
  {
    id: "2-horizontal",
    displayName: "2 Comics",
    count: 2,
    rows: 1,
    columns: 2,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Two comics side by side",
  },
  {
    id: "3-horizontal",
    displayName: "3 Comics",
    count: 3,
    rows: 1,
    columns: 3,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Three comics in a horizontal row",
  },
  {
    id: "4-horizontal",
    displayName: "4 Comics",
    count: 4,
    rows: 1,
    columns: 4,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Four comics in a horizontal row",
  },
  {
    id: "5-horizontal",
    displayName: "5 Comics",
    count: 5,
    rows: 1,
    columns: 5,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Five comics in a horizontal row",
  },
  {
    id: "6-horizontal",
    displayName: "6 Comics",
    count: 6,
    rows: 1,
    columns: 6,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Six comics in a horizontal row",
  },
  {
    id: "3-vertical",
    displayName: "3 Comics",
    count: 3,
    rows: 3,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Three comics stacked vertically",
  },
  {
    id: "4-vertical",
    displayName: "4 Comics",
    count: 4,
    rows: 4,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Four comics stacked vertically",
  },
  {
    id: "4-quad",
    displayName: "4 Comics",
    count: 4,
    rows: 2,
    columns: 2,
    orientation: "square",
    spacingFactor: 0.15,
    description: "Four comics in a 2×2 grid",
  },
  {
    id: "6-quad",
    displayName: "6 Comics",
    count: 6,
    rows: 2,
    columns: 3,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Six comics in a 2×3 grid",
  },
  {
    id: "6-grid",
    displayName: "6 Comics",
    count: 6,
    rows: 3,
    columns: 2,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Six comics in a 3×2 grid",
  },
  {
    id: "8-grid",
    displayName: "8 Comics",
    count: 8,
    rows: 2,
    columns: 4,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Eight comics in a 2×4 grid",
  },
];

/**
 * Get layout by ID
 */
export function getComicLayout(layoutId: ComicLayoutType): ComicLayout {
  // Handle empty string gracefully
  if (!layoutId) {
    throw new Error("Layout ID is required. Please select a layout first.");
  }

  const layout = COMIC_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) {
    throw new Error(`Comic layout not found: ${layoutId}`);
  }
  return layout;
}

/**
 * Calculate opening positions for a given layout and comic format
 * Returns array of opening rectangles as percentages of total frame area
 */
export function calculateComicOpenings(
  layoutId: ComicLayoutType,
  formatId: string,
  matBorder: number = 2.0, // mat border in inches
  _matReveal: number = 0.25 // mat reveal in inches (not used, kept for API compatibility)
): ComicOpening[] {
  const layout = getComicLayout(layoutId);
  const format = getComicFormatById(formatId);

  if (!format) {
    throw new Error(`Comic format not found: ${formatId}`);
  }

  const openings: ComicOpening[] = [];
  const { rows, columns, spacingFactor } = layout;

  // Comic dimensions
  const comicWidth = format.comicWidth;
  const comicHeight = format.comicHeight;

  // Spacing between comics (as fraction of comic width)
  const spacing = comicWidth * spacingFactor;

  // Calculate total content area needed
  const totalContentWidth = comicWidth * columns + spacing * (columns - 1);
  const totalContentHeight = comicHeight * rows + spacing * (rows - 1);

  // Add mat borders to get total frame size
  const frameWidth = totalContentWidth + matBorder * 2;
  const frameHeight = totalContentHeight + matBorder * 2;

  // Calculate opening dimensions as percentage of frame
  const openingWidthPct = (comicWidth / frameWidth) * 100;
  const openingHeightPct = (comicHeight / frameHeight) * 100;
  const spacingWidthPct = (spacing / frameWidth) * 100;
  const spacingHeightPct = (spacing / frameHeight) * 100;
  const matBorderWidthPct = (matBorder / frameWidth) * 100;
  const matBorderHeightPct = (matBorder / frameHeight) * 100;

  // Generate opening positions
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = matBorderWidthPct + col * (openingWidthPct + spacingWidthPct);
      const y = matBorderHeightPct + row * (openingHeightPct + spacingHeightPct);

      openings.push({
        x,
        y,
        width: openingWidthPct,
        height: openingHeightPct,
      });
    }
  }

  return openings;
}

/**
 * Interior dimensions lookup table
 * These are the exact tested interior (rabbet) dimensions for each layout
 * NG = Non-graded (modern, golden, silver, bronze age comics)
 * GR = Graded (slabbed CGC comics)
 */
export const INTERIOR_DIMENSIONS: Record<
  ComicLayoutType,
  { ng: { width: number; height: number }; gr: { width: number; height: number } }
> = {
  "": { ng: { width: 10, height: 14 }, gr: { width: 12, height: 17 } }, // Fallback for empty
  single: { ng: { width: 10, height: 14 }, gr: { width: 12, height: 17 } },
  "2-horizontal": { ng: { width: 18, height: 14 }, gr: { width: 21, height: 17 } },
  "3-horizontal": { ng: { width: 28.75, height: 14 }, gr: { width: 30, height: 16.5 } },
  "4-horizontal": { ng: { width: 37.5, height: 14 }, gr: { width: 39, height: 16.5 } },
  "5-horizontal": { ng: { width: 44, height: 14 }, gr: { width: 44, height: 15 } },
  "6-horizontal": { ng: { width: 51, height: 14 }, gr: { width: 54, height: 16 } },
  "3-vertical": { ng: { width: 11.25, height: 36 }, gr: { width: 11.75, height: 43.5 } },
  "4-vertical": { ng: { width: 11.25, height: 47 }, gr: { width: 11.75, height: 57 } },
  "4-quad": { ng: { width: 20, height: 25 }, gr: { width: 20.75, height: 30.5 } },
  "6-quad": { ng: { width: 29, height: 26 }, gr: { width: 30, height: 30 } },
  "6-grid": { ng: { width: 20, height: 38.5 }, gr: { width: 20.75, height: 44.5 } },
  "8-grid": { ng: { width: 37.5, height: 26.5 }, gr: { width: 39, height: 30.5 } },
};

/**
 * Calculate preview frame dimensions using dynamic layout calculation
 * This ensures comics display properly with fixed 2-inch mat borders on all sides
 * Returns { width, height } in inches (for preview rendering only)
 */
export function calculateComicPreviewDimensions(
  layoutId: ComicLayoutType,
  formatId: string,
  _matBorder: number = 2.0, // not used - uses fixed 2.0" border
  brassPlaqueEnabled: boolean = false
): { width: number; height: number } {
  const layout = getComicLayout(layoutId);
  const format = getComicFormatById(formatId);

  if (!format) {
    throw new Error(`Comic format not found: ${formatId}`);
  }

  const { rows, columns, spacingFactor } = layout;

  // Comic dimensions
  const comicWidth = format.comicWidth;
  const comicHeight = format.comicHeight;

  // Spacing between comics (as fraction of comic width)
  const spacing = comicWidth * spacingFactor;

  // Calculate total content area needed
  const totalContentWidth = comicWidth * columns + spacing * (columns - 1);
  const totalContentHeight = comicHeight * rows + spacing * (rows - 1);

  // Fixed 2-inch mat border on all sides for on-screen rendering
  const FIXED_MAT_BORDER = 2.0;
  const width = totalContentWidth + FIXED_MAT_BORDER * 2;
  let height = totalContentHeight + FIXED_MAT_BORDER * 2;

  // Add brass plaque height if enabled (adds 1.5" to bottom)
  if (brassPlaqueEnabled) {
    height += 1.5;
  }

  return { width, height };
}

/**
 * Calculate manufacturing frame dimensions using exact interior dimension lookup table
 * This provides accurate dimensions for pricing and "Overall Size" display text
 * Returns { width, height } in inches (overall exterior dimensions for manufacturing/pricing)
 */
export function calculateComicFrameSize(
  layoutId: ComicLayoutType,
  formatId: string,
  _matBorder: number = 2.0, // not used - uses lookup table instead
  brassPlaqueEnabled: boolean = false
): { width: number; height: number } {
  // Determine if this is a graded/slabbed format
  const isGraded = formatId === "slabbed-cgc";

  // Get the correct interior dimensions from lookup table
  const interiorDims = INTERIOR_DIMENSIONS[layoutId];
  if (!interiorDims) {
    throw new Error(`No interior dimensions defined for layout: ${layoutId}`);
  }

  // Select NG (non-graded) or GR (graded) dimensions
  const rabbet = isGraded ? interiorDims.gr : interiorDims.ng;

  // Shadowbox frame adds ~2" to each dimension (1" frame width on each side)
  // This is the frame face width - the rabbet is already the interior opening
  const FRAME_WIDTH_PER_SIDE = 1.0; // inches per side

  // Calculate overall exterior dimensions
  const width = rabbet.width + FRAME_WIDTH_PER_SIDE * 2;
  let height = rabbet.height + FRAME_WIDTH_PER_SIDE * 2;

  // Add brass plaque height if enabled (adds 1.5" to bottom)
  if (brassPlaqueEnabled) {
    height += 1.5;
  }

  return { width, height };
}

/**
 * Get all comic layouts
 */
export function getAllComicLayouts(): ComicLayout[] {
  return COMIC_LAYOUTS;
}

/**
 * Validate if a layout can fit within manufacturing limits
 * Returns validation result with max dimensions check
 */
export function validateComicLayoutSize(
  layoutId: ComicLayoutType,
  formatId: string,
  matBorder: number = 2.0,
  brassPlaqueEnabled: boolean = false
): { valid: boolean; error?: string; width?: number; height?: number } {
  try {
    const frameSize = calculateComicFrameSize(layoutId, formatId, matBorder, brassPlaqueEnabled);

    const MAX_WIDTH = 48; // Maximum manufacturable width
    const MAX_HEIGHT = 48; // Maximum manufacturable height

    if (frameSize.width > MAX_WIDTH || frameSize.height > MAX_HEIGHT) {
      return {
        valid: false,
        error: `Frame size ${frameSize.width.toFixed(1)}" × ${frameSize.height.toFixed(1)}" exceeds maximum manufacturable size of ${MAX_WIDTH}" × ${MAX_HEIGHT}"`,
        width: frameSize.width,
        height: frameSize.height,
      };
    }

    return {
      valid: true,
      width: frameSize.width,
      height: frameSize.height,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown validation error",
    };
  }
}
