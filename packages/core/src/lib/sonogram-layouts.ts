/**
 * Sonogram Frame Layout Configurations
 * Defines standard dimensions and specifications for sonogram/ultrasound framing.
 *
 * Coordinate system: openings x/y from frame interior top-left; frameWidth/frameHeight are outer.
 */

export const DEFAULT_FRAME_MOLDING_WIDTH = 1.0;

export type SonogramLayoutType = "single-sonogram" | "double-sonogram" | "triple-sonogram";

export interface SonogramOpening {
  type: "rectangle" | "heart";
  x: number;
  y: number;
  width: number;
  height: number;
  purpose: "sonogram";
  zIndex?: number;
}

export interface SonogramLayout {
  id: SonogramLayoutType;
  name: string;
  description: string;
  frameWidth: number;
  frameHeight: number;
  artworkWidth: number;
  artworkHeight: number;
  matBorderWidth: number;
  openings: SonogramOpening[];
  sonogramCount: number;
  recommendedFor: string[];
}

/**
 * Generate SVG path for a heart shape within given bounds.
 */
export function getHeartPath(
  x: number,
  y: number,
  width: number,
  height: number,
  indentDepth: number = 0.3
): string {
  const cx = x + width / 2;
  const cy = y;
  const size = Math.min(width, height);
  const indentY = cy + size * indentDepth;
  const topControlY = cy + size * (indentDepth * 0.5);
  return `
    M ${cx},${indentY}
    C ${cx},${topControlY} ${cx - size * 0.15},${cy} ${cx - size * 0.25},${cy}
    C ${cx - size * 0.4},${cy} ${cx - size * 0.5},${cy + size * 0.15} ${cx - size * 0.5},${cy + size * 0.3}
    C ${cx - size * 0.5},${cy + size * 0.45} ${cx - size * 0.4},${cy + size * 0.55} ${cx},${cy + size}
    C ${cx + size * 0.4},${cy + size * 0.55} ${cx + size * 0.5},${cy + size * 0.45} ${cx + size * 0.5},${cy + size * 0.3}
    C ${cx + size * 0.5},${cy + size * 0.15} ${cx + size * 0.4},${cy} ${cx + size * 0.25},${cy}
    C ${cx + size * 0.15},${cy} ${cx},${topControlY} ${cx},${indentY}
    Z
  `;
}

export const SONOGRAM_DIMENSIONS = { SPACING: 0.5 } as const;

export const SONOGRAM_PRESETS = [
  {
    width: 6,
    height: 4,
    name: "6×4",
    description: "Standard ultrasound print",
    shape: "rectangle" as const,
  },
  {
    width: 5,
    height: 3.5,
    name: "5×3.5",
    description: "Compact ultrasound",
    shape: "rectangle" as const,
  },
  {
    width: 3.5,
    height: 2.5,
    name: "3.5×2.5",
    description: "Wallet-size ultrasound",
    shape: "rectangle" as const,
  },
  {
    width: 6,
    height: 4.5,
    name: "6×4.5",
    description: "Extended ultrasound",
    shape: "rectangle" as const,
  },
  {
    width: 4,
    height: 3,
    name: "4×3",
    description: "Small ultrasound",
    shape: "rectangle" as const,
  },
  {
    width: 4,
    height: 4,
    name: "4×4 Heart",
    description: "Heart-shaped opening",
    shape: "heart" as const,
  },
] as const;

function matOrigin(border: number) {
  return { mx: border, my: border };
}

function buildSingleSonogram(
  sonogramWidth: number,
  sonogramHeight: number,
  matBorder = 2.5,
  mouldingWidth = DEFAULT_FRAME_MOLDING_WIDTH,
  shape: "rectangle" | "heart" = "rectangle"
): SonogramLayout {
  const artworkWidth = sonogramWidth;
  const artworkHeight = sonogramHeight;
  const interiorWidth = matBorder * 2 + artworkWidth;
  const interiorHeight = matBorder * 2 + artworkHeight;
  const frameWidth = interiorWidth + 2 * mouldingWidth;
  const frameHeight = interiorHeight + 2 * mouldingWidth;
  const { mx, my } = matOrigin(matBorder);
  return {
    id: "single-sonogram",
    name: "Single Sonogram",
    description: "One ultrasound image",
    frameWidth,
    frameHeight,
    artworkWidth,
    artworkHeight,
    matBorderWidth: matBorder,
    openings: [
      {
        type: shape,
        x: mx,
        y: my,
        width: sonogramWidth,
        height: sonogramHeight,
        purpose: "sonogram",
        zIndex: 1,
      },
    ],
    sonogramCount: 1,
    recommendedFor: [
      "First ultrasound keepsake",
      "Gender reveal memento",
      "Baby announcement gift",
    ],
  };
}

function buildDoubleSonogram(
  sonogramWidth: number,
  sonogramHeight: number,
  matBorder = 2.5,
  mouldingWidth = DEFAULT_FRAME_MOLDING_WIDTH,
  shape: "rectangle" | "heart" = "rectangle"
): SonogramLayout {
  const spacing = SONOGRAM_DIMENSIONS.SPACING;
  const artworkWidth = sonogramWidth * 2 + spacing;
  const artworkHeight = sonogramHeight;
  const interiorWidth = matBorder * 2 + artworkWidth;
  const interiorHeight = matBorder * 2 + artworkHeight;
  const frameWidth = interiorWidth + 2 * mouldingWidth;
  const frameHeight = interiorHeight + 2 * mouldingWidth;
  const { mx, my } = matOrigin(matBorder);
  return {
    id: "double-sonogram",
    name: "Double Sonogram",
    description: "Two ultrasound images side-by-side",
    frameWidth,
    frameHeight,
    artworkWidth,
    artworkHeight,
    matBorderWidth: matBorder,
    openings: [
      {
        type: shape,
        x: mx,
        y: my,
        width: sonogramWidth,
        height: sonogramHeight,
        purpose: "sonogram",
        zIndex: 1,
      },
      {
        type: shape,
        x: mx + sonogramWidth + spacing,
        y: my,
        width: sonogramWidth,
        height: sonogramHeight,
        purpose: "sonogram",
        zIndex: 1,
      },
    ],
    sonogramCount: 2,
    recommendedFor: [
      "Before and after comparison",
      "Twin ultrasounds",
      "First and second trimester",
    ],
  };
}

function buildTripleSonogram(
  sonogramWidth: number,
  sonogramHeight: number,
  matBorder = 2.5,
  mouldingWidth = DEFAULT_FRAME_MOLDING_WIDTH,
  shape: "rectangle" | "heart" = "rectangle"
): SonogramLayout {
  const spacing = SONOGRAM_DIMENSIONS.SPACING;
  const artworkWidth = sonogramWidth * 3 + spacing * 2;
  const artworkHeight = sonogramHeight;
  const interiorWidth = matBorder * 2 + artworkWidth;
  const interiorHeight = matBorder * 2 + artworkHeight;
  const frameWidth = interiorWidth + 2 * mouldingWidth;
  const frameHeight = interiorHeight + 2 * mouldingWidth;
  const { mx, my } = matOrigin(matBorder);
  return {
    id: "triple-sonogram",
    name: "Triple Sonogram",
    description: "Three ultrasound images side-by-side",
    frameWidth,
    frameHeight,
    artworkWidth,
    artworkHeight,
    matBorderWidth: matBorder,
    openings: [
      {
        type: shape,
        x: mx,
        y: my,
        width: sonogramWidth,
        height: sonogramHeight,
        purpose: "sonogram",
        zIndex: 1,
      },
      {
        type: shape,
        x: mx + sonogramWidth + spacing,
        y: my,
        width: sonogramWidth,
        height: sonogramHeight,
        purpose: "sonogram",
        zIndex: 1,
      },
      {
        type: shape,
        x: mx + sonogramWidth * 2 + spacing * 2,
        y: my,
        width: sonogramWidth,
        height: sonogramHeight,
        purpose: "sonogram",
        zIndex: 1,
      },
    ],
    sonogramCount: 3,
    recommendedFor: ["Trimester journey", "Triplet ultrasounds", "Pregnancy milestone timeline"],
  };
}

export function getSonogramLayoutsForSize(
  sonogramWidth: number,
  sonogramHeight: number,
  matBorder = 2.5,
  shape: "rectangle" | "heart" = "rectangle"
): SonogramLayout[] {
  return [
    buildSingleSonogram(
      sonogramWidth,
      sonogramHeight,
      matBorder,
      DEFAULT_FRAME_MOLDING_WIDTH,
      shape
    ),
    buildDoubleSonogram(
      sonogramWidth,
      sonogramHeight,
      matBorder,
      DEFAULT_FRAME_MOLDING_WIDTH,
      shape
    ),
    buildTripleSonogram(
      sonogramWidth,
      sonogramHeight,
      matBorder,
      DEFAULT_FRAME_MOLDING_WIDTH,
      shape
    ),
  ];
}

export function getAllSonogramLayouts(): SonogramLayout[] {
  const defaultPreset = SONOGRAM_PRESETS[0]!;
  return getSonogramLayoutsForSize(defaultPreset.width, defaultPreset.height);
}

export function getSonogramLayout(id: SonogramLayoutType): SonogramLayout | undefined {
  return getAllSonogramLayouts().find((l) => l.id === id);
}

export function getSonogramLayoutForSize(
  id: SonogramLayoutType,
  sonogramWidth: number,
  sonogramHeight: number,
  matBorder = 2.5
): SonogramLayout | undefined {
  return getSonogramLayoutsForSize(sonogramWidth, sonogramHeight, matBorder).find(
    (l) => l.id === id
  );
}

/** Pen Tool personalization config */
export interface PenToolConfig {
  enabled: boolean;
  text: string;
  subtext: string;
  font: "dancing-script" | "great-vibes" | "georgia" | "courier-new" | "satisfy" | "montserrat";
  presetType?:
    | "first-photo"
    | "love-first-sight"
    | "little-miracle"
    | "you-are-loved"
    | "hello-little-one"
    | "see-you-soon"
    | "worth-the-wait"
    | "dreaming-of-you"
    | "tiny-human"
    | "before-we-met"
    | "you-were-our-wish"
    | "its-a-boy"
    | "its-a-girl"
    | "custom";
  textSize?: number;
}

export const PEN_TOOL_PRESETS = [
  { id: "first-photo", label: "Baby's First Photo", text: "Baby's First Photo" },
  { id: "love-first-sight", label: "Love at First Sight", text: "Love at First Sight" },
  { id: "little-miracle", label: "Our Little Miracle", text: "Our Little Miracle" },
  { id: "you-are-loved", label: "You Are Loved Already", text: "You Are Loved Already" },
  { id: "hello-little-one", label: "Hello, Little One", text: "Hello, Little One" },
  { id: "see-you-soon", label: "See You Soon", text: "See You Soon" },
  { id: "worth-the-wait", label: "Worth the Wait", text: "Worth the Wait" },
  { id: "dreaming-of-you", label: "Dreaming of You", text: "Dreaming of You" },
  { id: "tiny-human", label: "Tiny Human Loading", text: "Tiny Human Loading" },
  {
    id: "before-we-met",
    label: "Before We Met You, We Loved You",
    text: "Before We Met You, We Loved You",
  },
  { id: "you-were-our-wish", label: "You Were Our Wish", text: "You Were Our Wish" },
  { id: "its-a-boy", label: "It's a Boy!", text: "It's a Boy!" },
  { id: "its-a-girl", label: "It's a Girl!", text: "It's a Girl!" },
  { id: "custom", label: "Custom Message", text: "" },
] as const;

export const PEN_TOOL_FONTS = [
  { id: "dancing-script", name: "Dancing Script", family: "'Dancing Script', cursive" },
  { id: "great-vibes", name: "Great Vibes", family: "'Great Vibes', cursive" },
  { id: "georgia", name: "Georgia", family: "Georgia, 'Times New Roman', serif" },
  { id: "courier-new", name: "Courier New", family: "'Courier New', Courier, monospace" },
  { id: "satisfy", name: "Satisfy", family: "'Satisfy', cursive" },
  { id: "montserrat", name: "Montserrat", family: "'Montserrat', sans-serif" },
] as const;

export const LIGHT_MAT_IDS = [
  "mat-1",
  "mat-4",
  "mat-5",
  "mat-6",
  "mat-7",
  "mat-13",
  "mat-14",
  "mat-24",
  "mat-27",
];

export function isLightMat(matId: string): boolean {
  return LIGHT_MAT_IDS.includes(matId);
}
