/**
 * Magazine Frame Layout Definitions
 *
 * Defines layout options for magazine frames, including
 * single magazine, horizontal rows, vertical columns, and grids.
 */

import { getMagazineSizeById } from "./magazine-sizes";

export type MagazineLayoutType =
  | ""
  | "single"
  | "2-horizontal"
  | "3-horizontal"
  | "4-horizontal"
  | "5-horizontal"
  | "6-horizontal"
  | "7-horizontal"
  | "2-vertical"
  | "3-vertical"
  | "4-vertical"
  | "5-vertical"
  | "6-vertical"
  | "7-vertical"
  | "4-quad"
  | "6-quad"
  | "6-grid"
  | "8-grid-2x4"
  | "8-grid-4x2"
  | "9-grid"
  | "10-grid-2x5"
  | "10-grid-5x2"
  | "12-grid-2x6"
  | "12-grid-6x2"
  | "12-grid-3x4"
  | "12-grid-4x3"
  | "14-grid-2x7"
  | "14-grid-7x2"
  | "15-grid-3x5"
  | "15-grid-5x3"
  | "16-grid"
  | "18-grid-3x6"
  | "18-grid-6x3"
  | "20-grid-4x5"
  | "20-grid-5x4"
  | "21-grid-3x7"
  | "21-grid-7x3"
  | "24-grid-3x8"
  | "24-grid-4x6"
  | "24-grid-6x4"
  | "24-grid-8x3"
  | "25-grid"
  | "28-grid-4x7"
  | "28-grid-7x4"
  | "30-grid-5x6"
  | "30-grid-6x5";

export interface MagazineOpening {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MagazineLayout {
  id: MagazineLayoutType;
  displayName: string;
  count: number;
  rows: number;
  columns: number;
  orientation: "portrait" | "landscape" | "square";
  spacingFactor: number;
  description: string;
}

export const MAGAZINE_LAYOUTS: MagazineLayout[] = [
  {
    id: "single",
    displayName: "Single Magazine",
    count: 1,
    rows: 1,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0,
    description: "Display one magazine",
  },
  {
    id: "2-horizontal",
    displayName: "2 Magazines",
    count: 2,
    rows: 1,
    columns: 2,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Two magazines side by side",
  },
  {
    id: "3-horizontal",
    displayName: "3 Magazines",
    count: 3,
    rows: 1,
    columns: 3,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Three magazines in a horizontal row",
  },
  {
    id: "4-horizontal",
    displayName: "4 Magazines",
    count: 4,
    rows: 1,
    columns: 4,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Four magazines in a horizontal row",
  },
  {
    id: "5-horizontal",
    displayName: "5 Magazines",
    count: 5,
    rows: 1,
    columns: 5,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Five magazines in a horizontal row",
  },
  {
    id: "6-horizontal",
    displayName: "6 Magazines",
    count: 6,
    rows: 1,
    columns: 6,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Six magazines in a horizontal row",
  },
  {
    id: "7-horizontal",
    displayName: "7 Magazines",
    count: 7,
    rows: 1,
    columns: 7,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Seven magazines in a horizontal row",
  },
  {
    id: "2-vertical",
    displayName: "2 Magazines",
    count: 2,
    rows: 2,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Two magazines stacked vertically",
  },
  {
    id: "3-vertical",
    displayName: "3 Magazines",
    count: 3,
    rows: 3,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Three magazines stacked vertically",
  },
  {
    id: "4-vertical",
    displayName: "4 Magazines",
    count: 4,
    rows: 4,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Four magazines stacked vertically",
  },
  {
    id: "5-vertical",
    displayName: "5 Magazines",
    count: 5,
    rows: 5,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Five magazines stacked vertically",
  },
  {
    id: "6-vertical",
    displayName: "6 Magazines",
    count: 6,
    rows: 6,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Six magazines stacked vertically",
  },
  {
    id: "7-vertical",
    displayName: "7 Magazines",
    count: 7,
    rows: 7,
    columns: 1,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Seven magazines stacked vertically",
  },
  {
    id: "4-quad",
    displayName: "4 Magazines",
    count: 4,
    rows: 2,
    columns: 2,
    orientation: "square",
    spacingFactor: 0.15,
    description: "Four magazines in a 2×2 grid",
  },
  {
    id: "6-quad",
    displayName: "6 Magazines",
    count: 6,
    rows: 2,
    columns: 3,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Six magazines in a 2×3 grid",
  },
  {
    id: "6-grid",
    displayName: "6 Magazines",
    count: 6,
    rows: 3,
    columns: 2,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Six magazines in a 3×2 grid",
  },
  {
    id: "9-grid",
    displayName: "9 Magazines",
    count: 9,
    rows: 3,
    columns: 3,
    orientation: "square",
    spacingFactor: 0.15,
    description: "Nine magazines in a 3×3 grid",
  },
  {
    id: "8-grid-2x4",
    displayName: "8 Magazines",
    count: 8,
    rows: 2,
    columns: 4,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Eight magazines in a 2×4 grid",
  },
  {
    id: "8-grid-4x2",
    displayName: "8 Magazines",
    count: 8,
    rows: 4,
    columns: 2,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Eight magazines in a 4×2 grid",
  },
  {
    id: "10-grid-2x5",
    displayName: "10 Magazines",
    count: 10,
    rows: 2,
    columns: 5,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Ten magazines in a 2×5 grid",
  },
  {
    id: "10-grid-5x2",
    displayName: "10 Magazines",
    count: 10,
    rows: 5,
    columns: 2,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Ten magazines in a 5×2 grid",
  },
  {
    id: "12-grid-3x4",
    displayName: "12 Magazines",
    count: 12,
    rows: 3,
    columns: 4,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Twelve magazines in a 3×4 grid",
  },
  {
    id: "12-grid-4x3",
    displayName: "12 Magazines",
    count: 12,
    rows: 4,
    columns: 3,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Twelve magazines in a 4×3 grid",
  },
  {
    id: "15-grid-3x5",
    displayName: "15 Magazines",
    count: 15,
    rows: 3,
    columns: 5,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Fifteen magazines in a 3×5 grid",
  },
  {
    id: "15-grid-5x3",
    displayName: "15 Magazines",
    count: 15,
    rows: 5,
    columns: 3,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Fifteen magazines in a 5×3 grid",
  },
  {
    id: "16-grid",
    displayName: "16 Magazines",
    count: 16,
    rows: 4,
    columns: 4,
    orientation: "square",
    spacingFactor: 0.15,
    description: "Sixteen magazines in a 4×4 grid",
  },
  {
    id: "18-grid-3x6",
    displayName: "18 Magazines",
    count: 18,
    rows: 3,
    columns: 6,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Eighteen magazines in a 3×6 grid",
  },
  {
    id: "18-grid-6x3",
    displayName: "18 Magazines",
    count: 18,
    rows: 6,
    columns: 3,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Eighteen magazines in a 6×3 grid",
  },
  {
    id: "20-grid-4x5",
    displayName: "20 Magazines",
    count: 20,
    rows: 4,
    columns: 5,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Twenty magazines in a 4×5 grid",
  },
  {
    id: "20-grid-5x4",
    displayName: "20 Magazines",
    count: 20,
    rows: 5,
    columns: 4,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Twenty magazines in a 5×4 grid",
  },
  {
    id: "12-grid-2x6",
    displayName: "12 Magazines",
    count: 12,
    rows: 2,
    columns: 6,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Twelve magazines in a 2×6 grid",
  },
  {
    id: "12-grid-6x2",
    displayName: "12 Magazines",
    count: 12,
    rows: 6,
    columns: 2,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Twelve magazines in a 6×2 grid",
  },
  {
    id: "14-grid-2x7",
    displayName: "14 Magazines",
    count: 14,
    rows: 2,
    columns: 7,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Fourteen magazines in a 2×7 grid",
  },
  {
    id: "14-grid-7x2",
    displayName: "14 Magazines",
    count: 14,
    rows: 7,
    columns: 2,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Fourteen magazines in a 7×2 grid",
  },
  {
    id: "21-grid-3x7",
    displayName: "21 Magazines",
    count: 21,
    rows: 3,
    columns: 7,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Twenty-one magazines in a 3×7 grid",
  },
  {
    id: "21-grid-7x3",
    displayName: "21 Magazines",
    count: 21,
    rows: 7,
    columns: 3,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Twenty-one magazines in a 7×3 grid",
  },
  {
    id: "24-grid-3x8",
    displayName: "24 Magazines",
    count: 24,
    rows: 3,
    columns: 8,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Twenty-four magazines in a 3×8 grid",
  },
  {
    id: "24-grid-4x6",
    displayName: "24 Magazines",
    count: 24,
    rows: 4,
    columns: 6,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Twenty-four magazines in a 4×6 grid",
  },
  {
    id: "24-grid-6x4",
    displayName: "24 Magazines",
    count: 24,
    rows: 6,
    columns: 4,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Twenty-four magazines in a 6×4 grid",
  },
  {
    id: "24-grid-8x3",
    displayName: "24 Magazines",
    count: 24,
    rows: 8,
    columns: 3,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Twenty-four magazines in an 8×3 grid",
  },
  {
    id: "25-grid",
    displayName: "25 Magazines",
    count: 25,
    rows: 5,
    columns: 5,
    orientation: "square",
    spacingFactor: 0.15,
    description: "Twenty-five magazines in a 5×5 grid",
  },
  {
    id: "28-grid-4x7",
    displayName: "28 Magazines",
    count: 28,
    rows: 4,
    columns: 7,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Twenty-eight magazines in a 4×7 grid",
  },
  {
    id: "28-grid-7x4",
    displayName: "28 Magazines",
    count: 28,
    rows: 7,
    columns: 4,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Twenty-eight magazines in a 7×4 grid",
  },
  {
    id: "30-grid-5x6",
    displayName: "30 Magazines",
    count: 30,
    rows: 5,
    columns: 6,
    orientation: "landscape",
    spacingFactor: 0.15,
    description: "Thirty magazines in a 5×6 grid",
  },
  {
    id: "30-grid-6x5",
    displayName: "30 Magazines",
    count: 30,
    rows: 6,
    columns: 5,
    orientation: "portrait",
    spacingFactor: 0.15,
    description: "Thirty magazines in a 6×5 grid",
  },
];

export function getMagazineLayout(layoutId: MagazineLayoutType): MagazineLayout {
  if (!layoutId) {
    throw new Error("Layout ID is required. Please select a layout first.");
  }
  const layout = MAGAZINE_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) {
    throw new Error(`Magazine layout not found: ${layoutId}`);
  }
  return layout;
}

export function calculateMagazineOpenings(
  layoutId: MagazineLayoutType,
  sizeId: string,
  matBorder: number = 2.0,
  _matReveal: number = 0.25
): MagazineOpening[] {
  const layout = getMagazineLayout(layoutId);
  const magazineSize = getMagazineSizeById(sizeId);
  if (!magazineSize) {
    throw new Error(`Magazine size not found: ${sizeId}`);
  }
  const openings: MagazineOpening[] = [];
  const { rows, columns, spacingFactor } = layout;
  const magazineWidth = magazineSize.width;
  const magazineHeight = magazineSize.height;
  const horizontalSpacing = magazineWidth * spacingFactor;
  const verticalSpacing = magazineHeight * spacingFactor;
  const totalContentWidth = magazineWidth * columns + horizontalSpacing * (columns - 1);
  const totalContentHeight = magazineHeight * rows + verticalSpacing * (rows - 1);
  const frameWidth = totalContentWidth + matBorder * 2;
  const frameHeight = totalContentHeight + matBorder * 2;
  const openingWidthPct = (magazineWidth / frameWidth) * 100;
  const openingHeightPct = (magazineHeight / frameHeight) * 100;
  const spacingWidthPct = (horizontalSpacing / frameWidth) * 100;
  const spacingHeightPct = (verticalSpacing / frameHeight) * 100;
  const matBorderWidthPct = (matBorder / frameWidth) * 100;
  const matBorderHeightPct = (matBorder / frameHeight) * 100;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      openings.push({
        x: matBorderWidthPct + col * (openingWidthPct + spacingWidthPct),
        y: matBorderHeightPct + row * (openingHeightPct + spacingHeightPct),
        width: openingWidthPct,
        height: openingHeightPct,
      });
    }
  }
  return openings;
}

export function calculateMagazinePreviewDimensions(
  layoutId: MagazineLayoutType,
  sizeId: string,
  _matBorder: number = 2.0,
  brassPlaqueEnabled: boolean = false,
  matType: "none" | "single" | "double" = "single"
): { width: number; height: number } {
  const layout = getMagazineLayout(layoutId);
  const magazineSize = getMagazineSizeById(sizeId);
  if (!magazineSize) {
    throw new Error(`Magazine size not found: ${sizeId}`);
  }
  const { rows, columns, spacingFactor } = layout;
  const magazineWidth = magazineSize.width;
  const magazineHeight = magazineSize.height;
  const horizontalSpacing = magazineWidth * spacingFactor;
  const verticalSpacing = magazineHeight * spacingFactor;
  const totalContentWidth = magazineWidth * columns + horizontalSpacing * (columns - 1);
  const totalContentHeight = magazineHeight * rows + verticalSpacing * (rows - 1);
  const effectiveMatBorder = matType === "none" ? 0.25 : 2.0;
  const width = totalContentWidth + effectiveMatBorder * 2;
  let height = totalContentHeight + effectiveMatBorder * 2;
  if (brassPlaqueEnabled) {
    height += 1.5;
  }
  return { width, height };
}

export function calculateMagazineFrameSize(
  layoutId: MagazineLayoutType,
  sizeId: string,
  matBorder: number = 2.0,
  brassPlaqueEnabled: boolean = false,
  bottomWeightedExtra: number = 0
): { width: number; height: number } {
  const layout = getMagazineLayout(layoutId);
  const magazineSize = getMagazineSizeById(sizeId);
  if (!magazineSize) {
    throw new Error(`Magazine size not found: ${sizeId}`);
  }
  const { rows, columns, spacingFactor } = layout;
  const magazineWidth = magazineSize.width;
  const magazineHeight = magazineSize.height;
  const horizontalSpacing = magazineWidth * spacingFactor;
  const verticalSpacing = magazineHeight * spacingFactor;
  const matBorderBottom = matBorder + bottomWeightedExtra;
  const interiorWidth = magazineWidth * columns + horizontalSpacing * (columns - 1) + matBorder * 2;
  const interiorHeight =
    magazineHeight * rows + verticalSpacing * (rows - 1) + matBorder + matBorderBottom;
  const FRAME_WIDTH = 1.5;
  const width = interiorWidth + FRAME_WIDTH * 2;
  let height = interiorHeight + FRAME_WIDTH * 2;
  if (brassPlaqueEnabled) {
    height += 1.5;
  }
  return { width, height };
}

export function getAvailableLayoutsForSize(
  sizeId: string,
  matBorder: number = 2.0
): MagazineLayout[] {
  const magazineSize = getMagazineSizeById(sizeId);
  if (!magazineSize) {
    return MAGAZINE_LAYOUTS;
  }
  const MAX_MAT_WIDTH = 32;
  const MAX_MAT_HEIGHT = 40;
  const BRASS_PLAQUE_HEIGHT = 1.5;
  return MAGAZINE_LAYOUTS.filter((layout) => {
    const { rows, columns, spacingFactor } = layout;
    const { width: magazineWidth, height: magazineHeight } = magazineSize;
    const horizontalSpacing = magazineWidth * spacingFactor;
    const verticalSpacing = magazineHeight * spacingFactor;
    const totalContentWidth = magazineWidth * columns + horizontalSpacing * (columns - 1);
    const totalContentHeight = magazineHeight * rows + verticalSpacing * (rows - 1);
    const matWidth = totalContentWidth + matBorder * 2;
    const matHeight = totalContentHeight + matBorder * 2 + BRASS_PLAQUE_HEIGHT;
    const fitsPortrait = matWidth <= MAX_MAT_WIDTH && matHeight <= MAX_MAT_HEIGHT;
    const fitsLandscape = matWidth <= MAX_MAT_HEIGHT && matHeight <= MAX_MAT_WIDTH;
    return fitsPortrait || fitsLandscape;
  });
}

export interface MagazineManifest {
  openings: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    xPercent: number;
    yPercent: number;
    widthPercent: number;
    heightPercent: number;
  }>;
  frameWidth: number;
  frameHeight: number;
  matBorder: number;
  matBorderBottom: number;
  matReveal: number;
}

export function buildMagazineManifest(
  layoutId: MagazineLayoutType,
  sizeId: string,
  _matBorder: number,
  matReveal: number,
  pixelsPerInch: number,
  brassPlaqueEnabled: boolean = false,
  bottomWeightedExtra: number = 0,
  matType: "none" | "single" | "double" = "single"
): MagazineManifest {
  const effectiveMatBorder = matType === "none" ? 0.25 : 2.0;
  const defaultManifest: MagazineManifest = {
    openings: [],
    frameWidth: 16,
    frameHeight: 20,
    matBorder: effectiveMatBorder,
    matBorderBottom: effectiveMatBorder,
    matReveal: 0.25,
  };
  if (!layoutId) return defaultManifest;
  const layout = getMagazineLayout(layoutId);
  const magazineSize = getMagazineSizeById(sizeId);
  if (!magazineSize) return defaultManifest;
  const { rows, columns, spacingFactor } = layout;
  const { width: magazineWidth, height: magazineHeight } = magazineSize;
  const horizontalSpacing = magazineWidth * spacingFactor;
  const verticalSpacing = magazineHeight * spacingFactor;
  const totalContentWidth = magazineWidth * columns + horizontalSpacing * (columns - 1);
  const totalContentHeight = magazineHeight * rows + verticalSpacing * (rows - 1);
  const matBorderBottom = effectiveMatBorder + bottomWeightedExtra;
  const frameWidth = totalContentWidth + effectiveMatBorder * 2;
  let frameHeight = totalContentHeight + effectiveMatBorder + matBorderBottom;
  if (brassPlaqueEnabled) {
    frameHeight += 1.5;
  }
  const openings: MagazineManifest["openings"] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = (effectiveMatBorder + col * (magazineWidth + horizontalSpacing)) * pixelsPerInch;
      const y = (effectiveMatBorder + row * (magazineHeight + verticalSpacing)) * pixelsPerInch;
      const width = magazineWidth * pixelsPerInch;
      const height = magazineHeight * pixelsPerInch;
      const frameWidthPx = frameWidth * pixelsPerInch;
      const frameHeightPx = frameHeight * pixelsPerInch;
      openings.push({
        x,
        y,
        width,
        height,
        xPercent: (x / frameWidthPx) * 100,
        yPercent: (y / frameHeightPx) * 100,
        widthPercent: (width / frameWidthPx) * 100,
        heightPercent: (height / frameHeightPx) * 100,
      });
    }
  }
  return {
    openings,
    frameWidth,
    frameHeight,
    matBorder: effectiveMatBorder,
    matBorderBottom,
    matReveal,
  };
}
