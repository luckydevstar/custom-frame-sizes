/**
 * Jersey Frame Layout Configurations
 * Defines standard dimensions and specifications for jersey display framing.
 *
 * All measurements in inches.
 * Layout logic follows Mat Designer patterns for reveal calculations.
 */

export type JerseyLayoutType =
  | "classic-small"
  | "classic-regular"
  | "classic-large"
  | "premium-small"
  | "premium-regular"
  | "premium-large";

export interface JerseyOpening {
  type: "rectangle";
  // Position from mat interior top-left (after accounting for frame molding)
  x: number;
  y: number;
  width: number;
  height: number;
  purpose: "jersey-display" | "photo" | "plaque";
  zIndex?: number;
}

export interface JerseyLayout {
  id: JerseyLayoutType;
  name: string;
  description: string;
  frameInteriorWidth: number; // Interior dimensions (inside frame molding)
  frameInteriorHeight: number;
  matReveal: number; // Bottom mat reveal (inches)
  openings: JerseyOpening[];
  basePrice: number; // Base price for this layout
  allowsPlaque: boolean; // Whether brass plaque is available
}

/* -------------------------------------------------------------------------- */
/*                             Layout Helpers (TS)                             */
/* -------------------------------------------------------------------------- */

/**
 * Build Premium layout with centered jersey opening and a
 * centered row below it (photo – plaque – photo).
 *
 * @param size - Size variant: 'small' for youth/women's jerseys, 'regular' for standard adult, 'large' for oversized
 */
function buildPremiumLayout(size: "small" | "regular" | "large"): JerseyLayout {
  // Frame interior dimensions based on size
  let W: number,
    H: number,
    jerseyWidth: number,
    jerseyHeight: number,
    basePrice: number,
    plaqueWidth: number;
  let id: JerseyLayoutType, name: string, description: string;

  if (size === "small") {
    W = 22;
    H = 30;
    jerseyWidth = 18;
    jerseyHeight = 20;
    plaqueWidth = 4.0;
    basePrice = 199;
    id = "premium-small";
    name = "Premium Showcase - Small";
    description = '22×30" frame with 18×20" jersey opening plus centered photo and plaque openings';
  } else if (size === "large") {
    W = 28;
    H = 34;
    jerseyWidth = 24;
    jerseyHeight = 24;
    plaqueWidth = 5.0;
    basePrice = 279;
    id = "premium-large";
    name = "Premium Showcase - Large";
    description = '28×34" frame with 24×24" jersey opening plus centered photo and plaque openings';
  } else {
    // regular
    W = 24;
    H = 32;
    jerseyWidth = 20;
    jerseyHeight = 22;
    plaqueWidth = 5.0;
    basePrice = 229;
    id = "premium-regular";
    name = "Premium Showcase - Regular";
    description = '24×32" frame with 20×22" jersey opening plus centered photo and plaque openings';
  }

  const jerseyX = (W - jerseyWidth) / 2; // centered with 2" borders
  const jerseyY = 2; // 2" down from top

  // Row below jersey (left photo – plaque – right photo)
  const GAP_BELOW = 2; // vertical gap between jersey bottom and the row

  // For Premium Small, use smaller photos and spacing to maintain 2" mat borders
  const SPACING = size === "small" ? 1.0 : 1.5; // horizontal spacing between openings
  const photoWidth = size === "small" ? 5 : 6;
  const photoHeight = size === "small" ? 3.5 : 4;

  const leftPhoto = { width: photoWidth, height: photoHeight };
  const plaque = { width: plaqueWidth, height: 2.0 };
  const rightPhoto = { width: photoWidth, height: photoHeight };

  // Group width for horizontal centering under the jersey
  const groupWidth = leftPhoto.width + SPACING + plaque.width + SPACING + rightPhoto.width;

  const groupLeft = jerseyX + (jerseyWidth - groupWidth) / 2;
  const rowY = jerseyY + jerseyHeight + GAP_BELOW;

  const leftPhotoX = groupLeft;
  const plaqueX = groupLeft + leftPhoto.width + SPACING;
  const rightPhotoX = plaqueX + plaque.width + SPACING;

  return {
    id,
    name,
    description,
    frameInteriorWidth: W,
    frameInteriorHeight: H,
    matReveal: 0.5,
    basePrice,
    allowsPlaque: true,
    openings: [
      // Main jersey opening
      {
        type: "rectangle",
        x: jerseyX,
        y: jerseyY,
        width: jerseyWidth,
        height: jerseyHeight,
        purpose: "jersey-display",
        zIndex: 1,
      },

      // Left photo (bottom row)
      {
        type: "rectangle",
        x: leftPhotoX,
        y: rowY,
        width: leftPhoto.width,
        height: leftPhoto.height,
        purpose: "photo",
        zIndex: 2,
      },

      // Plaque (center of bottom row)
      {
        type: "rectangle",
        x: plaqueX,
        y: rowY + (leftPhoto.height - plaque.height) / 2,
        width: plaque.width,
        height: plaque.height,
        purpose: "plaque",
        zIndex: 2,
      },

      // Right photo (bottom row)
      {
        type: "rectangle",
        x: rightPhotoX,
        y: rowY,
        width: rightPhoto.width,
        height: rightPhoto.height,
        purpose: "photo",
        zIndex: 2,
      },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*                               Exported Layouts                              */
/* -------------------------------------------------------------------------- */

export const JERSEY_LAYOUTS: Record<JerseyLayoutType, JerseyLayout> = {
  "classic-small": {
    id: "classic-small",
    name: "Classic Display - Small",
    description: '22×24" frame with centered 18×20" opening for youth and women\'s jerseys',
    frameInteriorWidth: 22,
    frameInteriorHeight: 24,
    matReveal: 0.25,
    basePrice: 129,
    allowsPlaque: false,
    openings: [
      {
        type: "rectangle",
        x: 2, // (22 - 18) / 2
        y: 2,
        width: 18,
        height: 20,
        purpose: "jersey-display",
        zIndex: 1,
      },
    ],
  },

  "classic-regular": {
    id: "classic-regular",
    name: "Classic Display - Regular",
    description: '24×26" frame with centered 20×22" opening for jersey display',
    frameInteriorWidth: 24,
    frameInteriorHeight: 26,
    matReveal: 0.25,
    basePrice: 149,
    allowsPlaque: false,
    openings: [
      {
        type: "rectangle",
        x: 2, // (24 - 20) / 2
        y: 2,
        width: 20,
        height: 22,
        purpose: "jersey-display",
        zIndex: 1,
      },
    ],
  },

  "classic-large": {
    id: "classic-large",
    name: "Classic Display - Large",
    description: '26×28" frame with centered 22×24" opening for jersey display',
    frameInteriorWidth: 26,
    frameInteriorHeight: 28,
    matReveal: 0.25,
    basePrice: 179,
    allowsPlaque: false,
    openings: [
      {
        type: "rectangle",
        x: 2, // (26 - 22) / 2
        y: 2,
        width: 22,
        height: 24,
        purpose: "jersey-display",
        zIndex: 1,
      },
    ],
  },

  "premium-small": buildPremiumLayout("small"),
  "premium-regular": buildPremiumLayout("regular"),
  "premium-large": buildPremiumLayout("large"),
};

/* -------------------------------------------------------------------------- */
/*                                   API                                      */
/* -------------------------------------------------------------------------- */

/** Get layout by ID */
export function getJerseyLayout(layoutId: JerseyLayoutType): JerseyLayout {
  return JERSEY_LAYOUTS[layoutId];
}

/** Get all jersey layouts */
export function getAllJerseyLayouts(): JerseyLayout[] {
  return Object.values(JERSEY_LAYOUTS);
}
