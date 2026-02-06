/**
 * Newspaper frame layout configurations.
 * Single and double newspaper layouts with preset sizes.
 */

export type NewspaperLayoutType = "single-newspaper" | "double-newspaper";

export interface NewspaperOpening {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  purpose: "newspaper";
  zIndex?: number;
}

export interface NewspaperLayout {
  id: NewspaperLayoutType;
  name: string;
  description: string;
  frameWidth: number;
  frameHeight: number;
  artworkWidth: number;
  artworkHeight: number;
  matBorderWidth: number;
  openings: NewspaperOpening[];
  newspaperCount: number;
}

const DEFAULT_FRAME_MOLDING_WIDTH = 1.0;
const SPACING = 0.5;

function matOrigin(border: number) {
  return { mx: border, my: border };
}

function buildSingleNewspaper(
  newspaperWidth: number,
  newspaperHeight: number,
  matBorder: number,
  mouldingWidth: number
): NewspaperLayout {
  const artworkWidth = newspaperWidth;
  const artworkHeight = newspaperHeight;
  const interiorWidth = matBorder * 2 + artworkWidth;
  const interiorHeight = matBorder * 2 + artworkHeight;
  const frameWidth = interiorWidth + 2 * mouldingWidth;
  const frameHeight = interiorHeight + 2 * mouldingWidth;
  const { mx, my } = matOrigin(matBorder);

  return {
    id: "single-newspaper",
    name: "Single Newspaper",
    description: "One newspaper",
    frameWidth,
    frameHeight,
    artworkWidth,
    artworkHeight,
    matBorderWidth: matBorder,
    openings: [
      {
        type: "rectangle",
        x: mx,
        y: my,
        width: newspaperWidth,
        height: newspaperHeight,
        purpose: "newspaper",
        zIndex: 1,
      },
    ],
    newspaperCount: 1,
  };
}

function buildDoubleNewspaper(
  newspaperWidth: number,
  newspaperHeight: number,
  matBorder: number,
  mouldingWidth: number
): NewspaperLayout {
  const artworkWidth = newspaperWidth * 2 + SPACING;
  const artworkHeight = newspaperHeight;
  const interiorWidth = matBorder * 2 + artworkWidth;
  const interiorHeight = matBorder * 2 + artworkHeight;
  const frameWidth = interiorWidth + 2 * mouldingWidth;
  const frameHeight = interiorHeight + 2 * mouldingWidth;
  const { mx, my } = matOrigin(matBorder);

  return {
    id: "double-newspaper",
    name: "Double Newspaper",
    description: "Two newspapers side-by-side",
    frameWidth,
    frameHeight,
    artworkWidth,
    artworkHeight,
    matBorderWidth: matBorder,
    openings: [
      {
        type: "rectangle",
        x: mx,
        y: my,
        width: newspaperWidth,
        height: newspaperHeight,
        purpose: "newspaper",
        zIndex: 1,
      },
      {
        type: "rectangle",
        x: mx + newspaperWidth + SPACING,
        y: my,
        width: newspaperWidth,
        height: newspaperHeight,
        purpose: "newspaper",
        zIndex: 1,
      },
    ],
    newspaperCount: 2,
  };
}

export const NEWSPAPER_PRESETS = [
  { width: 11, height: 22, name: "11×22" },
  { width: 12, height: 22.75, name: "12×22.75" },
  { width: 14, height: 11, name: "14×11" },
  { width: 11, height: 17, name: "11×17" },
  { width: 15, height: 22.75, name: "15×22.75" },
  { width: 12, height: 22, name: "12×22" },
] as const;

export function getNewspaperLayoutsForSize(
  newspaperWidth: number,
  newspaperHeight: number,
  matBorder: number = 2.5,
  mouldingWidth: number = DEFAULT_FRAME_MOLDING_WIDTH
): NewspaperLayout[] {
  return [
    buildSingleNewspaper(newspaperWidth, newspaperHeight, matBorder, mouldingWidth),
    buildDoubleNewspaper(newspaperWidth, newspaperHeight, matBorder, mouldingWidth),
  ];
}
