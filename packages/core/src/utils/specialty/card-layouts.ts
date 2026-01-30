/**
 * Graded Card Frame Layout Definitions
 *
 * Defines 33 layout options for graded card frames, organized by category.
 * Frame sizes are optimized for PSA, SGC, CGC, and BGS slabs.
 */

import { getCardFormatById } from "./card-formats";

/**
 * PSA Pack Slab Frame Dimensions (for backend/order flow only)
 */
export const PSA_PACK_SLAB_FRAME_DIMENSIONS: Record<
  string,
  { width: number; height: number } | null
> = {
  "1x1": { width: 7, height: 10 },
  "1x2": { width: 13, height: 10 },
  "1x3": { width: 18, height: 10 },
  "1x4": { width: 23, height: 10 },
  "1x5": { width: 28, height: 10 },
  "1x6": { width: 33, height: 10 },
  "1x7": { width: 38, height: 10 },
  "1x8": { width: 42, height: 10 },
  "1x9": { width: 47, height: 10 },
  "2x1": { width: 7, height: 20 },
  "3x1": { width: 7, height: 28 },
  "4x1": { width: 7, height: 35 },
  "5x1": { width: 7, height: 43 },
  "6x1": { width: 7, height: 51 },
  "7x1": null,
  "8x1": null,
  "9x1": null,
  "2x2": { width: 13, height: 20 },
  "2x3": { width: 18, height: 20 },
  "2x4": { width: 23, height: 20 },
  "2x5": { width: 28, height: 20 },
  "2x6": { width: 33, height: 20 },
  "2x7": { width: 38, height: 20 },
  "2x8": null,
  "2x9": null,
  "3x2": { width: 13, height: 28 },
  "3x3": { width: 18, height: 28 },
  "3x4": { width: 23, height: 28 },
  "3x5": { width: 28, height: 28 },
  "4x2": { width: 13, height: 35 },
  "4x3": { width: 18, height: 35 },
  "4x4": { width: 23, height: 35 },
  "4x5": { width: 28, height: 35 },
};

export const PACK_SLAB_EXCLUDED_LAYOUTS: CardLayoutType[] = ["7x1", "8x1", "9x1", "2x8", "2x9"];

export type CardLayoutType =
  | ""
  | "1x1"
  | "1x2"
  | "1x3"
  | "1x4"
  | "1x5"
  | "1x6"
  | "1x7"
  | "1x8"
  | "1x9"
  | "2x1"
  | "3x1"
  | "4x1"
  | "5x1"
  | "6x1"
  | "7x1"
  | "8x1"
  | "9x1"
  | "2x2"
  | "2x3"
  | "3x2"
  | "2x4"
  | "4x2"
  | "3x3"
  | "2x5"
  | "3x4"
  | "4x3"
  | "2x6"
  | "2x7"
  | "2x8"
  | "2x9"
  | "3x5"
  | "4x4"
  | "4x5";

export interface CardOpening {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CardLayout {
  id: CardLayoutType;
  displayName: string;
  count: number;
  rows: number;
  columns: number;
  orientation: "portrait" | "landscape" | "square";
  spacingFactor: number;
  description: string;
  frameWidth: number;
  frameHeight: number;
  category: "single" | "row" | "stack" | "grid";
}

export const CARD_LAYOUTS: CardLayout[] = [
  {
    id: "1x1",
    displayName: "1 Card",
    count: 1,
    rows: 1,
    columns: 1,
    orientation: "square",
    spacingFactor: 0,
    description: "Display one graded card",
    frameWidth: 6,
    frameHeight: 6,
    category: "single",
  },
  {
    id: "1x2",
    displayName: "2 Cards",
    count: 2,
    rows: 1,
    columns: 2,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Two cards side by side",
    frameWidth: 10,
    frameHeight: 6,
    category: "row",
  },
  {
    id: "1x3",
    displayName: "3 Cards",
    count: 3,
    rows: 1,
    columns: 3,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Three cards in a horizontal row",
    frameWidth: 14,
    frameHeight: 6,
    category: "row",
  },
  {
    id: "1x4",
    displayName: "4 Cards",
    count: 4,
    rows: 1,
    columns: 4,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Four cards in a horizontal row",
    frameWidth: 18,
    frameHeight: 6,
    category: "row",
  },
  {
    id: "1x5",
    displayName: "5 Cards",
    count: 5,
    rows: 1,
    columns: 5,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Five cards in a horizontal row",
    frameWidth: 22,
    frameHeight: 6,
    category: "row",
  },
  {
    id: "1x6",
    displayName: "6 Cards",
    count: 6,
    rows: 1,
    columns: 6,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Six cards in a horizontal row",
    frameWidth: 26,
    frameHeight: 6,
    category: "row",
  },
  {
    id: "1x7",
    displayName: "7 Cards",
    count: 7,
    rows: 1,
    columns: 7,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Seven cards in a horizontal row",
    frameWidth: 30,
    frameHeight: 6,
    category: "row",
  },
  {
    id: "1x8",
    displayName: "8 Cards",
    count: 8,
    rows: 1,
    columns: 8,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Eight cards in a horizontal row",
    frameWidth: 34,
    frameHeight: 6,
    category: "row",
  },
  {
    id: "1x9",
    displayName: "9 Cards",
    count: 9,
    rows: 1,
    columns: 9,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Nine cards in a horizontal row",
    frameWidth: 38,
    frameHeight: 6,
    category: "row",
  },
  {
    id: "2x1",
    displayName: "2 Cards",
    count: 2,
    rows: 2,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Two cards stacked vertically",
    frameWidth: 6,
    frameHeight: 14,
    category: "stack",
  },
  {
    id: "3x1",
    displayName: "3 Cards",
    count: 3,
    rows: 3,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Three cards stacked vertically",
    frameWidth: 6,
    frameHeight: 20,
    category: "stack",
  },
  {
    id: "4x1",
    displayName: "4 Cards",
    count: 4,
    rows: 4,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Four cards stacked vertically",
    frameWidth: 6,
    frameHeight: 26,
    category: "stack",
  },
  {
    id: "5x1",
    displayName: "5 Cards",
    count: 5,
    rows: 5,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Five cards stacked vertically",
    frameWidth: 6,
    frameHeight: 32,
    category: "stack",
  },
  {
    id: "6x1",
    displayName: "6 Cards",
    count: 6,
    rows: 6,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Six cards stacked vertically",
    frameWidth: 6,
    frameHeight: 38,
    category: "stack",
  },
  {
    id: "7x1",
    displayName: "7 Cards",
    count: 7,
    rows: 7,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Seven cards stacked vertically",
    frameWidth: 6,
    frameHeight: 44,
    category: "stack",
  },
  {
    id: "8x1",
    displayName: "8 Cards",
    count: 8,
    rows: 8,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Eight cards stacked vertically",
    frameWidth: 6,
    frameHeight: 50,
    category: "stack",
  },
  {
    id: "9x1",
    displayName: "9 Cards",
    count: 9,
    rows: 9,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Nine cards stacked vertically",
    frameWidth: 6,
    frameHeight: 56,
    category: "stack",
  },
  {
    id: "2x2",
    displayName: "4 Cards",
    count: 4,
    rows: 2,
    columns: 2,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Four cards in a 2×2 grid",
    frameWidth: 10,
    frameHeight: 14,
    category: "grid",
  },
  {
    id: "2x3",
    displayName: "6 Cards",
    count: 6,
    rows: 2,
    columns: 3,
    orientation: "square",
    spacingFactor: 0.15,
    description: "Six cards in a 2×3 grid",
    frameWidth: 14,
    frameHeight: 14,
    category: "grid",
  },
  {
    id: "3x2",
    displayName: "6 Cards",
    count: 6,
    rows: 3,
    columns: 2,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Six cards in a 3×2 grid",
    frameWidth: 10,
    frameHeight: 20,
    category: "grid",
  },
  {
    id: "2x4",
    displayName: "8 Cards",
    count: 8,
    rows: 2,
    columns: 4,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Eight cards in a 2×4 grid",
    frameWidth: 18,
    frameHeight: 14,
    category: "grid",
  },
  {
    id: "4x2",
    displayName: "8 Cards",
    count: 8,
    rows: 4,
    columns: 2,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Eight cards in a 4×2 grid",
    frameWidth: 10,
    frameHeight: 26,
    category: "grid",
  },
  {
    id: "3x3",
    displayName: "9 Cards",
    count: 9,
    rows: 3,
    columns: 3,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Nine cards in a 3×3 grid",
    frameWidth: 14,
    frameHeight: 20,
    category: "grid",
  },
  {
    id: "2x5",
    displayName: "10 Cards",
    count: 10,
    rows: 2,
    columns: 5,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Ten cards in a 2×5 grid",
    frameWidth: 22,
    frameHeight: 14,
    category: "grid",
  },
  {
    id: "3x4",
    displayName: "12 Cards",
    count: 12,
    rows: 3,
    columns: 4,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Twelve cards in a 3×4 grid",
    frameWidth: 18,
    frameHeight: 20,
    category: "grid",
  },
  {
    id: "4x3",
    displayName: "12 Cards",
    count: 12,
    rows: 4,
    columns: 3,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Twelve cards in a 4×3 grid",
    frameWidth: 14,
    frameHeight: 26,
    category: "grid",
  },
  {
    id: "2x6",
    displayName: "12 Cards",
    count: 12,
    rows: 2,
    columns: 6,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Twelve cards in a 2×6 grid",
    frameWidth: 26,
    frameHeight: 14,
    category: "grid",
  },
  {
    id: "2x7",
    displayName: "14 Cards",
    count: 14,
    rows: 2,
    columns: 7,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Fourteen cards in a 2×7 grid",
    frameWidth: 30,
    frameHeight: 14,
    category: "grid",
  },
  {
    id: "2x8",
    displayName: "16 Cards",
    count: 16,
    rows: 2,
    columns: 8,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Sixteen cards in a 2×8 grid",
    frameWidth: 34,
    frameHeight: 14,
    category: "grid",
  },
  {
    id: "2x9",
    displayName: "18 Cards",
    count: 18,
    rows: 2,
    columns: 9,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Eighteen cards in a 2×9 grid",
    frameWidth: 38,
    frameHeight: 14,
    category: "grid",
  },
  {
    id: "3x5",
    displayName: "15 Cards",
    count: 15,
    rows: 3,
    columns: 5,
    orientation: "square",
    spacingFactor: 0.15,
    description: "Fifteen cards in a 3×5 grid",
    frameWidth: 22,
    frameHeight: 20,
    category: "grid",
  },
  {
    id: "4x4",
    displayName: "16 Cards",
    count: 16,
    rows: 4,
    columns: 4,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Sixteen cards in a 4×4 grid",
    frameWidth: 18,
    frameHeight: 26,
    category: "grid",
  },
  {
    id: "4x5",
    displayName: "20 Cards",
    count: 20,
    rows: 4,
    columns: 5,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Twenty cards in a 4×5 grid",
    frameWidth: 22,
    frameHeight: 26,
    category: "grid",
  },
];

export function getCardLayout(layoutId: CardLayoutType): CardLayout {
  if (!layoutId) {
    throw new Error("Layout ID is required. Please select a layout first.");
  }
  const layout = CARD_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) {
    throw new Error(`Card layout not found: ${layoutId}`);
  }
  return layout;
}

export function getLayoutsByCategory(category: "single" | "row" | "stack" | "grid"): CardLayout[] {
  return CARD_LAYOUTS.filter((l) => l.category === category);
}

export function getLayoutsGroupedByCategory(): Record<string, CardLayout[]> {
  return {
    single: getLayoutsByCategory("single"),
    row: getLayoutsByCategory("row"),
    stack: getLayoutsByCategory("stack"),
    grid: getLayoutsByCategory("grid"),
  };
}

export function calculateCardOpenings(
  layoutId: CardLayoutType,
  formatId: string,
  matBorder: number = 2.0,
  _matReveal: number = 0.125
): CardOpening[] {
  const layout = getCardLayout(layoutId);
  const format = getCardFormatById(formatId);
  if (!format) {
    throw new Error(`Card format not found: ${formatId}`);
  }
  const openings: CardOpening[] = [];
  const { rows, columns, spacingFactor } = layout;
  const cardWidth = format.cardWidth;
  const cardHeight = format.cardHeight;
  const spacing = cardWidth * spacingFactor;
  const totalContentWidth = cardWidth * columns + spacing * (columns - 1);
  const totalContentHeight = cardHeight * rows + spacing * (rows - 1);
  const frameWidth = totalContentWidth + matBorder * 2;
  const frameHeight = totalContentHeight + matBorder * 2;
  const openingWidthPct = (cardWidth / frameWidth) * 100;
  const openingHeightPct = (cardHeight / frameHeight) * 100;
  const spacingWidthPct = (spacing / frameWidth) * 100;
  const spacingHeightPct = (spacing / frameHeight) * 100;
  const matBorderWidthPct = (matBorder / frameWidth) * 100;
  const matBorderHeightPct = (matBorder / frameHeight) * 100;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = matBorderWidthPct + col * (openingWidthPct + spacingWidthPct);
      const y = matBorderHeightPct + row * (openingHeightPct + spacingHeightPct);
      openings.push({ x, y, width: openingWidthPct, height: openingHeightPct });
    }
  }
  return openings;
}

export function calculateCardPreviewDimensions(
  layoutId: CardLayoutType,
  formatId: string,
  _matBorder: number = 2.0,
  brassPlaqueEnabled: boolean = false
): { width: number; height: number } {
  const layout = getCardLayout(layoutId);
  const format = getCardFormatById(formatId);
  if (!format) {
    throw new Error(`Card format not found: ${formatId}`);
  }
  const { rows, columns, spacingFactor } = layout;
  const cardWidth = format.cardWidth;
  const cardHeight = format.cardHeight;
  const spacing = cardWidth * spacingFactor;
  const totalContentWidth = cardWidth * columns + spacing * (columns - 1);
  const totalContentHeight = cardHeight * rows + spacing * (rows - 1);
  const FIXED_MAT_BORDER = 2.0;
  const width = totalContentWidth + FIXED_MAT_BORDER * 2;
  let height = totalContentHeight + FIXED_MAT_BORDER * 2;
  if (brassPlaqueEnabled) {
    height += 1.5;
  }
  return { width, height };
}

export function calculateCardFrameSize(
  layoutId: CardLayoutType,
  _formatId: string,
  _matBorder: number = 2.0,
  brassPlaqueEnabled: boolean = false
): { width: number; height: number } {
  const layout = getCardLayout(layoutId);
  const width = layout.frameWidth;
  let height = layout.frameHeight;
  if (brassPlaqueEnabled) {
    height += 1.5;
  }
  return { width, height };
}

export function getAllCardLayouts(): CardLayout[] {
  return CARD_LAYOUTS;
}

export function getPackSlabFrameDimensions(
  layoutId: CardLayoutType
): { width: number; height: number } | null {
  return PSA_PACK_SLAB_FRAME_DIMENSIONS[layoutId] ?? null;
}

export function validateCardLayoutSize(
  layoutId: CardLayoutType,
  formatId: string,
  matBorder: number = 2.0,
  brassPlaqueEnabled: boolean = false
): { valid: boolean; error?: string; width?: number; height?: number } {
  try {
    if (formatId === "psa-pack-slabs" && PACK_SLAB_EXCLUDED_LAYOUTS.includes(layoutId)) {
      return {
        valid: false,
        error: `Layout ${layoutId} is not available for PSA Pack Slabs due to manufacturing constraints`,
      };
    }
    const frameSize = calculateCardFrameSize(layoutId, formatId, matBorder, brassPlaqueEnabled);
    const MAX_WIDTH = 56;
    const MAX_HEIGHT = 56;
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

export function getAvailableLayoutsForFormat(
  formatId: string,
  matBorder: number = 2.0,
  brassPlaqueEnabled: boolean = false
): CardLayout[] {
  return CARD_LAYOUTS.filter((layout) => {
    const validation = validateCardLayoutSize(layout.id, formatId, matBorder, brassPlaqueEnabled);
    return validation.valid;
  });
}

export function getAvailableLayoutsForFormatGrouped(
  formatId: string,
  matBorder: number = 2.0,
  brassPlaqueEnabled: boolean = false
): Record<string, CardLayout[]> {
  const availableLayouts = getAvailableLayoutsForFormat(formatId, matBorder, brassPlaqueEnabled);
  return {
    single: availableLayouts.filter((l) => l.category === "single"),
    row: availableLayouts.filter((l) => l.category === "row"),
    stack: availableLayouts.filter((l) => l.category === "stack"),
    grid: availableLayouts.filter((l) => l.category === "grid"),
  };
}
