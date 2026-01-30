/**
 * Record Album Frame Layout Configurations
 * Defines standard dimensions and specifications for vinyl record framing.
 * Coordinate system: openings measured from FRAME INTERIOR top-left.
 */

export const DEFAULT_FRAME_MOLDING_WIDTH = 1.0;

export type RecordAlbumLayoutType = "cover-only" | "single-with-cover" | "double-with-covers";

export interface RecordAlbumOpening {
  type: "rectangle" | "circle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  diameter?: number;
  purpose: "album-cover" | "record-display";
  zIndex?: number;
}

export interface RecordAlbumLayout {
  id: RecordAlbumLayoutType;
  name: string;
  description: string;
  frameWidth: number;
  frameHeight: number;
  artworkWidth: number;
  artworkHeight: number;
  matBorderWidth: number;
  openings: RecordAlbumOpening[];
  recommendedFor: string[];
}

export const VINYL_DIMENSIONS = {
  ALBUM_COVER: 12.25,
  RECORD_DIAMETER: 11.75,
  PLAQUE_WIDTH: 2,
  PLAQUE_HEIGHT: 0.5,
} as const;

const DEFAULTS = {
  GAP_TO_LABEL: 3.0,
  RECORD_CENTER_SPACING: 10.0,
} as const;

const SINGLE_INTERIOR_WIDTH = 24;
const DOUBLE_GROUP_OFFSET_X = 1.0;

function matOrigin(border: number) {
  return { mx: border, my: border };
}

function buildCoverOnly(mouldingWidth = DEFAULT_FRAME_MOLDING_WIDTH): RecordAlbumLayout {
  const matBorder = 2.0;
  const artworkWidth = VINYL_DIMENSIONS.ALBUM_COVER;
  const artworkHeight = VINYL_DIMENSIONS.ALBUM_COVER;
  const interiorWidth = matBorder * 2 + artworkWidth;
  const interiorHeight = matBorder * 2 + artworkHeight;
  const frameWidth = interiorWidth + 2 * mouldingWidth;
  const frameHeight = interiorHeight + 2 * mouldingWidth;
  const { mx, my } = matOrigin(matBorder);

  return {
    id: "cover-only",
    name: "Album Cover Only",
    description: "Display the album cover artwork without the record",
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
        width: VINYL_DIMENSIONS.ALBUM_COVER,
        height: VINYL_DIMENSIONS.ALBUM_COVER,
        purpose: "album-cover",
        zIndex: 2,
      },
    ],
    recommendedFor: [
      "Iconic album artwork",
      "Picture discs",
      "Limited edition covers",
      "Autographed sleeves",
    ],
  };
}

function buildSingleWithCover(
  gapToLabel = DEFAULTS.GAP_TO_LABEL,
  mouldingWidth = DEFAULT_FRAME_MOLDING_WIDTH
): RecordAlbumLayout {
  const artworkWidth = 22;
  const artworkHeight = 14;
  const interiorWidth = SINGLE_INTERIOR_WIDTH;
  const interiorHeight = artworkHeight + 2 * 1.0;
  const borderWidth = (interiorWidth - artworkWidth) / 2;
  const borderHeight = (interiorHeight - artworkHeight) / 2;
  const frameWidth = interiorWidth + 2 * mouldingWidth;
  const frameHeight = interiorHeight + 2 * mouldingWidth;
  const mx = borderWidth;
  const my = borderHeight;
  const coverLocalX = 0.65;
  const coverLocalY = (artworkHeight - VINYL_DIMENSIONS.ALBUM_COVER) / 2;
  const coverX = mx + coverLocalX;
  const coverY = my + coverLocalY;
  const coverRight = coverX + VINYL_DIMENSIONS.ALBUM_COVER;
  const recordCenterX = coverRight + gapToLabel;
  const recordCenterY = my + artworkHeight / 2;

  return {
    id: "single-with-cover",
    name: "Single Record with Cover",
    description: "Display one record alongside its album cover",
    frameWidth,
    frameHeight,
    artworkWidth,
    artworkHeight,
    matBorderWidth: borderWidth,
    openings: [
      {
        type: "circle",
        x: recordCenterX,
        y: recordCenterY,
        diameter: VINYL_DIMENSIONS.RECORD_DIAMETER,
        purpose: "record-display",
        zIndex: 0,
      },
      {
        type: "rectangle",
        x: coverX,
        y: coverY,
        width: VINYL_DIMENSIONS.ALBUM_COVER,
        height: VINYL_DIMENSIONS.ALBUM_COVER,
        purpose: "album-cover",
        zIndex: 2,
      },
    ],
    recommendedFor: ["Classic albums", "Vinyl collections", "Music memorabilia", "Colored vinyl"],
  };
}

function buildDoubleWithCovers(mouldingWidth = DEFAULT_FRAME_MOLDING_WIDTH): RecordAlbumLayout {
  const artworkWidth = 32.5;
  const artworkHeight = 14.5;
  const border = 1.0;
  const interiorWidth = artworkWidth + 2 * border;
  const interiorHeight = artworkHeight + 2 * border;
  const frameWidth = interiorWidth + 2 * mouldingWidth;
  const frameHeight = interiorHeight + 2 * mouldingWidth;
  const { mx, my } = matOrigin(border);
  const coverLocalY = (artworkHeight - VINYL_DIMENSIONS.ALBUM_COVER) / 2;
  const coverX = mx + 0.0;
  const coverY = my + coverLocalY;
  const coverRight = coverX + VINYL_DIMENSIONS.ALBUM_COVER;
  const GAP_TO_LABEL = DEFAULTS.GAP_TO_LABEL;
  const SPACING = DEFAULTS.RECORD_CENTER_SPACING;
  const RECORD_D = VINYL_DIMENSIONS.RECORD_DIAMETER - 0.05;
  const COVER_BLEED = 0.06;
  const leftRecordCenterX = coverRight + GAP_TO_LABEL;
  const rightRecordCenterX = leftRecordCenterX + SPACING;
  const recordCenterY = my + artworkHeight / 2;
  const coverX_off = coverX + DOUBLE_GROUP_OFFSET_X;
  const leftRecordCenterX_off = leftRecordCenterX + DOUBLE_GROUP_OFFSET_X;
  const rightRecordCenterX_off = rightRecordCenterX + DOUBLE_GROUP_OFFSET_X;

  return {
    id: "double-with-covers",
    name: "Double Record with Covers",
    description: "Display gatefold albums or double LP sets with both records and cover",
    frameWidth,
    frameHeight,
    artworkWidth,
    artworkHeight,
    matBorderWidth: border,
    openings: [
      {
        type: "circle",
        x: rightRecordCenterX_off,
        y: recordCenterY,
        diameter: RECORD_D,
        purpose: "record-display",
        zIndex: 0,
      },
      {
        type: "circle",
        x: leftRecordCenterX_off,
        y: recordCenterY,
        diameter: RECORD_D,
        purpose: "record-display",
        zIndex: 1,
      },
      {
        type: "rectangle",
        x: coverX_off - COVER_BLEED,
        y: coverY - COVER_BLEED,
        width: VINYL_DIMENSIONS.ALBUM_COVER + 2 * COVER_BLEED,
        height: VINYL_DIMENSIONS.ALBUM_COVER + 2 * COVER_BLEED,
        purpose: "album-cover",
        zIndex: 2,
      },
    ],
    recommendedFor: ["Gatefold albums", "Double LP sets", "Deluxe editions", "Box set highlights"],
  };
}

export const RECORD_ALBUM_LAYOUTS: RecordAlbumLayout[] = [
  buildCoverOnly(),
  buildSingleWithCover(DEFAULTS.GAP_TO_LABEL),
  buildDoubleWithCovers(),
];

export function getRecordAlbumLayout(
  layoutId: RecordAlbumLayoutType
): RecordAlbumLayout | undefined {
  return RECORD_ALBUM_LAYOUTS.find((layout) => layout.id === layoutId);
}

export function getRecordAlbumLayoutWithMolding(
  layoutId: RecordAlbumLayoutType,
  mouldingWidth: number
): RecordAlbumLayout | undefined {
  switch (layoutId) {
    case "cover-only":
      return buildCoverOnly(mouldingWidth);
    case "single-with-cover":
      return buildSingleWithCover(DEFAULTS.GAP_TO_LABEL, mouldingWidth);
    case "double-with-covers":
      return buildDoubleWithCovers(mouldingWidth);
    default:
      return undefined;
  }
}

export function getAllRecordAlbumLayouts(): RecordAlbumLayout[] {
  return RECORD_ALBUM_LAYOUTS;
}

export function layoutRequiresCover(layoutId: RecordAlbumLayoutType): boolean {
  const layout = getRecordAlbumLayout(layoutId);
  return layout?.openings.some((o) => o.purpose === "album-cover") ?? false;
}

export function getLayoutPricingDimensions(
  layoutId: RecordAlbumLayoutType,
  mouldingWidth?: number
) {
  const layout = mouldingWidth
    ? getRecordAlbumLayoutWithMolding(layoutId, mouldingWidth)
    : getRecordAlbumLayout(layoutId);
  if (!layout) throw new Error(`Layout not found: ${layoutId}`);
  return {
    frameWidth: layout.frameWidth,
    frameHeight: layout.frameHeight,
    artworkWidth: layout.artworkWidth,
    artworkHeight: layout.artworkHeight,
    matBorderWidth: layout.matBorderWidth,
    perimeter: (layout.frameWidth + layout.frameHeight) * 2,
    area: layout.frameWidth * layout.frameHeight,
  };
}

export interface RecordAlbumPriceTier {
  basePrice: number;
  glassUpcharge: number;
  hardwareUpcharge: number;
  nameplatePrice: number;
}

export function getRecordAlbumPriceTier(
  layoutId: RecordAlbumLayoutType,
  options: {
    glassType?: "standard" | "non-glare";
    hardware?: "standard" | "security";
    hasPlaque?: boolean;
  } = {}
): { tier: RecordAlbumPriceTier; total: number } {
  const BASE_PRICES: Record<RecordAlbumLayoutType, number> = {
    "cover-only": 189,
    "single-with-cover": 249,
    "double-with-covers": 329,
  };

  const tier: RecordAlbumPriceTier = {
    basePrice: BASE_PRICES[layoutId] ?? 189,
    glassUpcharge: 8,
    hardwareUpcharge: 8,
    nameplatePrice: 15,
  };

  let total = tier.basePrice;
  if (options.glassType === "non-glare") total += tier.glassUpcharge;
  if (options.hardware === "security") total += tier.hardwareUpcharge;
  if (options.hasPlaque) total += tier.nameplatePrice;

  return { tier, total };
}
