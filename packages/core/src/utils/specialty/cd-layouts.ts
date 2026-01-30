/**
 * CD Frame Layout Configurations
 * Coordinates measured from FRAME INTERIOR top-left (same convention as records).
 */

export const DEFAULT_FRAME_MOLDING_WIDTH = 1.0 as const;

export type CDLayoutType = "cover-only" | "disc-with-cover" | "double-disc";

export interface CDLayout {
  id: CDLayoutType;
  name: string;
  description: string;
  frameWidth: number;
  frameHeight: number;
  artworkWidth: number;
  artworkHeight: number;
  matBorderWidth: number;
  openings: Array<
    | {
        type: "rectangle";
        x: number;
        y: number;
        width: number;
        height: number;
        purpose: "cover";
        zIndex?: number;
      }
    | {
        type: "circle";
        x: number;
        y: number;
        diameter: number;
        purpose: "disc";
        zIndex?: number;
      }
  >;
  recommendedFor: string[];
}

export const CD_SPECS = {
  DISC_DIAMETER: 4.724,
  COVER_SIZE: 4.75,
  PLAQUE_W: 2.0,
  PLAQUE_H: 0.5,
} as const;

function matOrigin(border: number) {
  return { mx: border, my: border };
}

function roundToQuarter(value: number): number {
  return Math.round(value * 4) / 4;
}

function buildFrameDims(
  artworkW: number,
  artworkH: number,
  border: number,
  moulding: number = DEFAULT_FRAME_MOLDING_WIDTH
) {
  const interiorW = artworkW + 2 * border;
  const interiorH = artworkH + 2 * border;
  return {
    frameWidth: roundToQuarter(interiorW + 2 * moulding),
    frameHeight: roundToQuarter(interiorH + 2 * moulding),
    matBorderWidth: border,
    interiorW,
    interiorH,
    border,
  };
}

function coverOnly(moulding: number = DEFAULT_FRAME_MOLDING_WIDTH): CDLayout {
  const A = CD_SPECS.COVER_SIZE;
  const border = 1.625;
  const { frameWidth, frameHeight, matBorderWidth } = buildFrameDims(A, A, border, moulding);
  const { mx, my } = matOrigin(border);

  return {
    id: "cover-only",
    name: "CD Insert Only",
    description: "Display the CD insert artwork without the CD",
    frameWidth,
    frameHeight,
    artworkWidth: A,
    artworkHeight: A,
    matBorderWidth,
    openings: [
      {
        type: "rectangle",
        x: mx,
        y: my,
        width: A,
        height: A,
        purpose: "cover",
      },
    ],
    recommendedFor: ["Iconic CD artwork", "Autographed booklets", "Limited editions"],
  };
}

function discWithCover(moulding: number = DEFAULT_FRAME_MOLDING_WIDTH): CDLayout {
  const SCALE_FACTOR = 1;
  const D = CD_SPECS.DISC_DIAMETER * SCALE_FACTOR;
  const C = CD_SPECS.COVER_SIZE * SCALE_FACTOR;

  const artworkW = 9.0;
  const artworkH = 5.3;
  const border = 0.75;

  const GAP_TO_LABEL = 1.3;
  const contentWidth = C + GAP_TO_LABEL + D / 2;
  const horizontalBorder = (artworkW - contentWidth) / 2;
  const verticalBorder = (artworkH - C) / 2;
  const { frameWidth, frameHeight, matBorderWidth } = buildFrameDims(
    artworkW,
    artworkH,
    border,
    moulding
  );
  const { mx, my } = matOrigin(border);

  const coverLeft = mx + horizontalBorder;
  const coverTop = my + verticalBorder;
  const coverRight = coverLeft + C;
  const discCx = coverRight + GAP_TO_LABEL;
  const discCy = my + artworkH / 2;

  return {
    id: "disc-with-cover",
    name: "Single CD with Insert",
    description: "Display one disc alongside its insert",
    frameWidth,
    frameHeight,
    artworkWidth: artworkW,
    artworkHeight: artworkH,
    matBorderWidth,
    openings: [
      {
        type: "circle",
        x: discCx,
        y: discCy,
        diameter: D,
        purpose: "disc",
        zIndex: 0,
      },
      {
        type: "rectangle",
        x: coverLeft,
        y: coverTop,
        width: C,
        height: C,
        purpose: "cover",
        zIndex: 1,
      },
    ],
    recommendedFor: ["Classic CDs", "Signed inserts", "Colored/printed discs"],
  };
}

function doubleDisc(mouldingWidth: number = DEFAULT_FRAME_MOLDING_WIDTH): CDLayout {
  const SCALE_FACTOR = 1.75;
  const CD_COVER = CD_SPECS.COVER_SIZE * SCALE_FACTOR;
  const CD_DIAMETER = CD_SPECS.DISC_DIAMETER * SCALE_FACTOR;

  const artworkWidth = 21.0;
  const artworkHeight = 9.5;
  const border = 0.75;

  const interiorWidth = artworkWidth + 2 * border;
  const interiorHeight = artworkHeight + 2 * border;
  const frameWidth = roundToQuarter(interiorWidth + 2 * mouldingWidth);
  const frameHeight = roundToQuarter(interiorHeight + 2 * mouldingWidth);

  const { mx, my } = matOrigin(border);

  const coverLocalY = (artworkHeight - CD_COVER) / 2;
  const coverX = mx + 0.0;
  const coverY = my + coverLocalY;
  const coverRight = coverX + CD_COVER;

  const GAP_TO_LABEL = 1.5;
  const SPACING = 6.5;
  const DISC_D = CD_DIAMETER - 0.05;
  const COVER_BLEED = 0.06;

  const leftDiscCenterX = coverRight + GAP_TO_LABEL;
  const rightDiscCenterX = leftDiscCenterX + SPACING;
  const discCenterY = my + artworkHeight / 2;

  const GROUP_OFFSET_X = 0.5;
  const coverX_off = coverX + GROUP_OFFSET_X;
  const leftDiscCenterX_off = leftDiscCenterX + GROUP_OFFSET_X;
  const rightDiscCenterX_off = rightDiscCenterX + GROUP_OFFSET_X;

  const coverWidth = CD_COVER + 2 * COVER_BLEED;
  const coverHeight = CD_COVER + 2 * COVER_BLEED;

  return {
    id: "double-disc",
    name: "Double CD with Insert",
    description: "Display gatefold CDs or double disc sets with insert and both discs",
    frameWidth,
    frameHeight,
    artworkWidth,
    artworkHeight,
    matBorderWidth: border,
    openings: [
      {
        type: "circle",
        x: rightDiscCenterX_off,
        y: discCenterY,
        diameter: DISC_D,
        purpose: "disc",
        zIndex: 0,
      },
      {
        type: "circle",
        x: leftDiscCenterX_off,
        y: discCenterY,
        diameter: DISC_D,
        purpose: "disc",
        zIndex: 1,
      },
      {
        type: "rectangle",
        x: coverX_off - COVER_BLEED,
        y: coverY - COVER_BLEED,
        width: coverWidth,
        height: coverHeight,
        purpose: "cover",
        zIndex: 2,
      },
    ],
    recommendedFor: ["Gatefold CDs", "Double disc sets", "Deluxe editions", "Box set highlights"],
  };
}

export const CD_LAYOUTS: CDLayout[] = [coverOnly(), discWithCover(), doubleDisc()];

export function getCDLayout(id: CDLayoutType, mouldingWidth?: number): CDLayout | undefined {
  const baseLayout = CD_LAYOUTS.find((l) => l.id === id);
  if (!baseLayout || mouldingWidth === undefined) return baseLayout;

  const generators: Record<CDLayoutType, (m: number) => CDLayout> = {
    "cover-only": coverOnly,
    "disc-with-cover": discWithCover,
    "double-disc": doubleDisc,
  };
  return generators[id](mouldingWidth);
}

export function getAllCDLayouts(): CDLayout[] {
  return CD_LAYOUTS;
}

export function cdLayoutRequiresCover(id: CDLayoutType): boolean {
  const l = getCDLayout(id);
  return l?.openings.some((o) => o.type === "rectangle" && o.purpose === "cover") ?? false;
}

export function getCDOrderDimensions(
  id: CDLayoutType,
  matType: "none" | "single" | "double" = "single",
  _mouldingWidth: number = DEFAULT_FRAME_MOLDING_WIDTH
) {
  let width: number;
  let height: number;

  switch (id) {
    case "cover-only":
      width = matType === "none" ? 4.75 : 8;
      height = matType === "none" ? 4.75 : 8;
      break;
    case "disc-with-cover":
      width = 11.5;
      height = 8;
      break;
    case "double-disc":
      width = 15;
      height = 8;
      break;
    default: {
      const l = getCDLayout(id, _mouldingWidth);
      if (!l) throw new Error(`CD layout not found: ${id}`);
      width = l.frameWidth;
      height = l.frameHeight;
      break;
    }
  }

  return {
    frameWidth: width,
    frameHeight: height,
    perimeter: (width + height) * 2,
    area: width * height,
  };
}

export function getCDPricingDimensions(
  id: CDLayoutType,
  mouldingWidth: number = DEFAULT_FRAME_MOLDING_WIDTH
) {
  const l = getCDLayout(id, mouldingWidth);
  if (!l) throw new Error(`CD layout not found: ${id}`);
  return {
    frameWidth: l.frameWidth,
    frameHeight: l.frameHeight,
    artworkWidth: l.artworkWidth,
    artworkHeight: l.artworkHeight,
    matBorderWidth: l.matBorderWidth,
    perimeter: (l.frameWidth + l.frameHeight) * 2,
    area: l.frameWidth * l.frameHeight,
  };
}

export interface CDPriceTier {
  basePrice: number;
  glassUpcharge: number;
  hardwareUpcharge: number;
  nameplatePrice: number;
}

export function getCDPriceTier(
  layoutId: CDLayoutType,
  options: {
    glassType?: "standard" | "non-glare";
    hardware?: "standard" | "security";
    hasPlaque?: boolean;
  } = {}
): { tier: CDPriceTier; total: number } {
  const BASE_PRICES: Record<CDLayoutType, number> = {
    "cover-only": 129,
    "disc-with-cover": 189,
    "double-disc": 229,
  };

  const tier: CDPriceTier = {
    basePrice: BASE_PRICES[layoutId] ?? 129,
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
