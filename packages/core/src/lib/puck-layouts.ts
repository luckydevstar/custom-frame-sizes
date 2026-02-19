/**
 * Hockey Puck Frame Layout Configurations
 *
 * Standard NHL puck dimensions: 3" diameter, 1" thick
 * Mat opening for pucks: 3" diameter circles
 *
 * Layouts include:
 * - Single puck
 * - Row layouts (2, 3, 4 pucks in a row)
 * - Photo + puck combinations (8x10 photo with 1-2 pucks)
 * - Grid layouts (3x2, 3x3, 4x3, 4x4, 5x4, 8x4)
 */

export type PuckLayoutType =
  | "single"
  | "row-2"
  | "row-3"
  | "row-4"
  | "photo-1-puck"
  | "photo-2-pucks"
  | "grid-3x2"
  | "grid-3x3"
  | "grid-4x3"
  | "grid-4x4"
  | "grid-5x4"
  | "grid-8x4";

export interface PuckOpening {
  type: "circle" | "rectangle";
  x: number;
  y: number;
  diameter?: number;
  width?: number;
  height?: number;
  purpose: "puck" | "photo" | "plaque";
  label?: string;
}

export interface PuckLayout {
  id: PuckLayoutType;
  name: string;
  displayName: string;
  description: string;
  category: "single" | "row" | "photo-combo" | "grid";
  frameInteriorWidth: number;
  frameInteriorHeight: number;
  matBorder: number;
  puckCount: number;
  hasPhotoOpening: boolean;
  openings: PuckOpening[];
  basePrice: number;
  allowsPlaque: boolean;
}

export const PUCK_DIAMETER = 3;
export const PUCK_SPACING = 0.75;
export const DEFAULT_PUCK_MAT_BORDER = 2;
export const PUCK_PHOTO_WIDTH = 8;
export const PUCK_PHOTO_HEIGHT = 10;
export const PLAQUE_HEIGHT = 0.75;

function calculateGridLayout(
  rows: number,
  cols: number,
  puckDiameter: number,
  spacing: number,
  matBorder: number
): { width: number; height: number; openings: PuckOpening[] } {
  const contentWidth = cols * puckDiameter + (cols - 1) * spacing;
  const contentHeight = rows * puckDiameter + (rows - 1) * spacing;
  const width = contentWidth + matBorder * 2;
  const height = contentHeight + matBorder * 2;

  const openings: PuckOpening[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      openings.push({
        type: "circle",
        x: matBorder + col * (puckDiameter + spacing) + puckDiameter / 2,
        y: matBorder + row * (puckDiameter + spacing) + puckDiameter / 2,
        diameter: puckDiameter,
        purpose: "puck",
      });
    }
  }

  return { width, height, openings };
}

export const PUCK_LAYOUTS: PuckLayout[] = [
  {
    id: "single",
    name: "Single Puck",
    displayName: "Single Puck",
    description: "Display one special puck",
    category: "single",
    frameInteriorWidth: 7,
    frameInteriorHeight: 7,
    matBorder: 2,
    puckCount: 1,
    hasPhotoOpening: false,
    basePrice: 49,
    allowsPlaque: true,
    openings: [{ type: "circle", x: 3.5, y: 3.5, diameter: 3, purpose: "puck" }],
  },
  {
    id: "row-2",
    name: "2 Puck Row",
    displayName: "Two Pucks",
    description: "Side-by-side puck display",
    category: "row",
    frameInteriorWidth: 10.75,
    frameInteriorHeight: 7,
    matBorder: 2,
    puckCount: 2,
    hasPhotoOpening: false,
    basePrice: 69,
    allowsPlaque: true,
    openings: [
      { type: "circle", x: 3.5, y: 3.5, diameter: 3, purpose: "puck" },
      { type: "circle", x: 7.25, y: 3.5, diameter: 3, purpose: "puck" },
    ],
  },
  {
    id: "row-3",
    name: "3 Puck Row",
    displayName: "Three Pucks",
    description: "Three pucks in a row",
    category: "row",
    frameInteriorWidth: 14.5,
    frameInteriorHeight: 7,
    matBorder: 2,
    puckCount: 3,
    hasPhotoOpening: false,
    basePrice: 89,
    allowsPlaque: true,
    openings: [
      { type: "circle", x: 3.5, y: 3.5, diameter: 3, purpose: "puck" },
      { type: "circle", x: 7.25, y: 3.5, diameter: 3, purpose: "puck" },
      { type: "circle", x: 11, y: 3.5, diameter: 3, purpose: "puck" },
    ],
  },
  {
    id: "row-4",
    name: "4 Puck Row",
    displayName: "Four Pucks",
    description: "Four pucks in a row",
    category: "row",
    frameInteriorWidth: 18.25,
    frameInteriorHeight: 7,
    matBorder: 2,
    puckCount: 4,
    hasPhotoOpening: false,
    basePrice: 109,
    allowsPlaque: true,
    openings: [
      { type: "circle", x: 3.5, y: 3.5, diameter: 3, purpose: "puck" },
      { type: "circle", x: 7.25, y: 3.5, diameter: 3, purpose: "puck" },
      { type: "circle", x: 11, y: 3.5, diameter: 3, purpose: "puck" },
      { type: "circle", x: 14.75, y: 3.5, diameter: 3, purpose: "puck" },
    ],
  },
  {
    id: "photo-1-puck",
    name: "8×10 Photo + 1 Puck",
    displayName: "8×10 Photo + Puck",
    description: "8×10 photo with puck below",
    category: "photo-combo",
    frameInteriorWidth: 12,
    frameInteriorHeight: 17.75,
    matBorder: 2,
    puckCount: 1,
    hasPhotoOpening: true,
    basePrice: 99,
    allowsPlaque: true,
    openings: [
      { type: "rectangle", x: 2, y: 2, width: 8, height: 10, purpose: "photo" },
      { type: "circle", x: 6, y: 14.25, diameter: 3, purpose: "puck" },
    ],
  },
  {
    id: "photo-2-pucks",
    name: "8×10 Photo + 2 Pucks",
    displayName: "8×10 Photo + 2 Pucks",
    description: "8×10 photo with two pucks below",
    category: "photo-combo",
    frameInteriorWidth: 12,
    frameInteriorHeight: 17.75,
    matBorder: 2,
    puckCount: 2,
    hasPhotoOpening: true,
    basePrice: 119,
    allowsPlaque: true,
    openings: [
      { type: "rectangle", x: 2, y: 2, width: 8, height: 10, purpose: "photo" },
      { type: "circle", x: 4.125, y: 14.25, diameter: 3, purpose: "puck" },
      { type: "circle", x: 7.875, y: 14.25, diameter: 3, purpose: "puck" },
    ],
  },
  {
    id: "grid-3x2",
    name: "3×2 Grid",
    displayName: "6 Pucks (3×2)",
    description: "6 pucks in a 3×2 grid",
    category: "grid",
    frameInteriorWidth: 14.5,
    frameInteriorHeight: 10.75,
    matBorder: 2,
    puckCount: 6,
    hasPhotoOpening: false,
    basePrice: 119,
    allowsPlaque: true,
    openings: (() => {
      const result = calculateGridLayout(2, 3, 3, 0.75, 2);
      return result.openings;
    })(),
  },
  {
    id: "grid-3x3",
    name: "3×3 Grid",
    displayName: "9 Pucks (3×3)",
    description: "9 pucks in a 3×3 grid",
    category: "grid",
    frameInteriorWidth: 14.5,
    frameInteriorHeight: 14.5,
    matBorder: 2,
    puckCount: 9,
    hasPhotoOpening: false,
    basePrice: 149,
    allowsPlaque: true,
    openings: (() => {
      const result = calculateGridLayout(3, 3, 3, 0.75, 2);
      return result.openings;
    })(),
  },
  {
    id: "grid-4x3",
    name: "4×3 Grid",
    displayName: "12 Pucks (4×3)",
    description: "12 pucks in a 4×3 grid",
    category: "grid",
    frameInteriorWidth: 18.25,
    frameInteriorHeight: 14.5,
    matBorder: 2,
    puckCount: 12,
    hasPhotoOpening: false,
    basePrice: 169,
    allowsPlaque: true,
    openings: (() => {
      const result = calculateGridLayout(3, 4, 3, 0.75, 2);
      return result.openings;
    })(),
  },
  {
    id: "grid-4x4",
    name: "4×4 Grid",
    displayName: "16 Pucks (4×4)",
    description: "16 pucks in a 4×4 grid",
    category: "grid",
    frameInteriorWidth: 18.25,
    frameInteriorHeight: 18.25,
    matBorder: 2,
    puckCount: 16,
    hasPhotoOpening: false,
    basePrice: 199,
    allowsPlaque: true,
    openings: (() => {
      const result = calculateGridLayout(4, 4, 3, 0.75, 2);
      return result.openings;
    })(),
  },
  {
    id: "grid-5x4",
    name: "5×4 Grid",
    displayName: "20 Pucks (5×4)",
    description: "20 pucks in a 5×4 grid",
    category: "grid",
    frameInteriorWidth: 22.75,
    frameInteriorHeight: 18.25,
    matBorder: 2.25,
    puckCount: 20,
    hasPhotoOpening: false,
    basePrice: 229,
    allowsPlaque: true,
    openings: (() => {
      const result = calculateGridLayout(4, 5, 3, 0.75, 2.25);
      return result.openings;
    })(),
  },
  {
    id: "grid-8x4",
    name: "8×4 Grid",
    displayName: "32 Pucks (8×4)",
    description: "32 pucks in a large 8×4 grid",
    category: "grid",
    frameInteriorWidth: 33,
    frameInteriorHeight: 18,
    matBorder: 2,
    puckCount: 32,
    hasPhotoOpening: false,
    basePrice: 349,
    allowsPlaque: true,
    openings: (() => {
      const result = calculateGridLayout(4, 8, 3, 0.75, 2);
      return result.openings;
    })(),
  },
];

export function getPuckLayoutById(id: PuckLayoutType): PuckLayout | undefined {
  return PUCK_LAYOUTS.find((l) => l.id === id);
}

export function getPuckLayoutsByCategory(category: PuckLayout["category"]): PuckLayout[] {
  return PUCK_LAYOUTS.filter((l) => l.category === category);
}

export function getAllPuckLayouts(): PuckLayout[] {
  return PUCK_LAYOUTS;
}
