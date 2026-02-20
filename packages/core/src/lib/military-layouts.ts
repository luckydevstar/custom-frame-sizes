/**
 * Military Frame Layouts
 * Defines the available shadowbox layouts for military memorabilia framing.
 *
 * Layout Types:
 * - compact-11x14: 17×15" interior frame with 14×12" display size
 * - standard-16x20: 20×16" interior frame with 17×13" display size
 * - large-20x32: 32×20" interior frame with 28×16" display size
 * - custom: User-defined dimensions
 *
 * Display size = mat opening (usable area for memorabilia)
 * Interior frame size = display size + (mat border × 2)
 */

export type MilitaryLayoutType = "compact-11x14" | "standard-16x20" | "large-20x32" | "custom";

export interface MilitaryLayout {
  id: MilitaryLayoutType;
  name: string;
  displayName: string;
  description: string;
  frameWidth: number;
  frameHeight: number;
  matOpeningWidth: number;
  matOpeningHeight: number;
  matBorderWidth: number;
  basePrice: number;
}

export type MilitaryPresetLayoutType = "compact-11x14" | "standard-16x20" | "large-20x32";

const MILITARY_LAYOUTS: Record<MilitaryPresetLayoutType, MilitaryLayout> = {
  "compact-11x14": {
    id: "compact-11x14",
    name: '14×12" Compact',
    displayName: "Compact Size",
    description: "Perfect for small displays, rank insignia, or individual medals",
    frameWidth: 17,
    frameHeight: 15,
    matOpeningWidth: 14,
    matOpeningHeight: 12,
    matBorderWidth: 1.5,
    basePrice: 129,
  },
  "standard-16x20": {
    id: "standard-16x20",
    name: '20×16" Standard',
    displayName: "Standard Size",
    description: "Ideal for ribbon racks, multiple medals, and photos",
    frameWidth: 20,
    frameHeight: 16,
    matOpeningWidth: 17,
    matOpeningHeight: 13,
    matBorderWidth: 1.5,
    basePrice: 189,
  },
  "large-20x32": {
    id: "large-20x32",
    name: '32×20" Large',
    displayName: "Large Size",
    description: "Spacious layout for full military career displays",
    frameWidth: 32,
    frameHeight: 20,
    matOpeningWidth: 28,
    matOpeningHeight: 16,
    matBorderWidth: 2,
    basePrice: 299,
  },
};

export function getMilitaryLayout(layoutId: MilitaryLayoutType): MilitaryLayout | null {
  if (layoutId === "custom") return null;
  return MILITARY_LAYOUTS[layoutId] ?? null;
}

export function getAllMilitaryLayouts(): MilitaryLayout[] {
  return Object.values(MILITARY_LAYOUTS);
}

export const MILITARY_CUSTOM_SIZE_LIMITS = {
  MIN_WIDTH: 6,
  MAX_WIDTH: 48,
  MIN_HEIGHT: 6,
  MAX_HEIGHT: 48,
  DEFAULT_MAT_BORDER: 1.5,
} as const;

export function createCustomMilitaryLayout(
  displayWidth: number,
  displayHeight: number
): MilitaryLayout {
  const matBorderWidth = MILITARY_CUSTOM_SIZE_LIMITS.DEFAULT_MAT_BORDER;
  return {
    id: "custom",
    name: `${displayWidth}×${displayHeight}" Custom`,
    displayName: "Custom Size",
    description: "Custom dimensions for unique display requirements",
    frameWidth: displayWidth + matBorderWidth * 2,
    frameHeight: displayHeight + matBorderWidth * 2,
    matOpeningWidth: displayWidth,
    matOpeningHeight: displayHeight,
    matBorderWidth,
    basePrice: 0,
  };
}

export function validateMilitaryCustomDimensions(
  width: number,
  height: number
): { valid: boolean; message?: string } {
  if (isNaN(width) || isNaN(height)) {
    return { valid: false, message: "Please enter valid dimensions" };
  }
  if (
    width < MILITARY_CUSTOM_SIZE_LIMITS.MIN_WIDTH ||
    height < MILITARY_CUSTOM_SIZE_LIMITS.MIN_HEIGHT
  ) {
    return {
      valid: false,
      message: `Minimum display size is ${MILITARY_CUSTOM_SIZE_LIMITS.MIN_WIDTH}×${MILITARY_CUSTOM_SIZE_LIMITS.MIN_HEIGHT} inches`,
    };
  }
  if (
    width > MILITARY_CUSTOM_SIZE_LIMITS.MAX_WIDTH ||
    height > MILITARY_CUSTOM_SIZE_LIMITS.MAX_HEIGHT
  ) {
    return {
      valid: false,
      message: `Maximum display size is ${MILITARY_CUSTOM_SIZE_LIMITS.MAX_WIDTH}×${MILITARY_CUSTOM_SIZE_LIMITS.MAX_HEIGHT} inches`,
    };
  }
  return { valid: true };
}

export const BRASS_PLAQUE_DIMENSIONS = {
  WIDTH: 4.5,
  HEIGHT: 1.5,
  BOTTOM_SPACE_INCREASE: 1.5,
} as const;

export function getMilitaryLayoutWithBrassNameplate(params: {
  layout: MilitaryLayout;
  brassPlaqueEnabled: boolean;
}): {
  frameWidth: number;
  frameHeight: number;
  matOpeningWidth: number;
  matOpeningHeight: number;
  matBorderTop: number;
  matBorderRight: number;
  matBorderBottom: number;
  matBorderLeft: number;
  brassPlaqueSpace: number;
} {
  const { layout, brassPlaqueEnabled } = params;
  if (!brassPlaqueEnabled) {
    return {
      frameWidth: layout.frameWidth,
      frameHeight: layout.frameHeight,
      matOpeningWidth: layout.matOpeningWidth,
      matOpeningHeight: layout.matOpeningHeight,
      matBorderTop: layout.matBorderWidth,
      matBorderRight: layout.matBorderWidth,
      matBorderBottom: layout.matBorderWidth,
      matBorderLeft: layout.matBorderWidth,
      brassPlaqueSpace: 0,
    };
  }
  return {
    frameWidth: layout.frameWidth,
    frameHeight: layout.frameHeight + BRASS_PLAQUE_DIMENSIONS.BOTTOM_SPACE_INCREASE,
    matOpeningWidth: layout.matOpeningWidth,
    matOpeningHeight: layout.matOpeningHeight,
    matBorderTop: layout.matBorderWidth,
    matBorderRight: layout.matBorderWidth,
    matBorderBottom: layout.matBorderWidth + BRASS_PLAQUE_DIMENSIONS.BOTTOM_SPACE_INCREASE,
    matBorderLeft: layout.matBorderWidth,
    brassPlaqueSpace: BRASS_PLAQUE_DIMENSIONS.BOTTOM_SPACE_INCREASE,
  };
}
