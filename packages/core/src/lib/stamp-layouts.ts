/**
 * Stamp Frame Layouts
 * Defines the available shadowbox layouts for stamp collection framing.
 *
 * Features:
 * - Same three size options as Military/Currency Display Frame + custom sizing
 * - Double mat system (White on Black default)
 * - 2" mat border standard
 * - Limited backing color options (Black, White, Light Gray, Off White)
 *
 * Layout Types:
 * - compact: 18×16" interior frame with 14×12" display size
 * - standard: 21×17" interior frame with 17×13" display size
 * - large: 32×20" interior frame with 28×16" display size
 * - custom: User-defined dimensions with perimeter-based pricing
 */

export type StampLayoutType = "compact" | "standard" | "large" | "custom";

export interface StampLayout {
  id: StampLayoutType;
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

export type StampPresetLayoutType = "compact" | "standard" | "large";

const STAMP_LAYOUTS: Record<StampPresetLayoutType, StampLayout> = {
  compact: {
    id: "compact",
    name: '14×12" Compact',
    displayName: "Compact Size",
    description: "Perfect for small stamp collections or featured stamps",
    frameWidth: 18,
    frameHeight: 16,
    matOpeningWidth: 14,
    matOpeningHeight: 12,
    matBorderWidth: 2,
    basePrice: 139,
  },
  standard: {
    id: "standard",
    name: '17×13" Standard',
    displayName: "Standard Size",
    description: "Ideal for medium stamp collections and commemorative sets",
    frameWidth: 21,
    frameHeight: 17,
    matOpeningWidth: 17,
    matOpeningHeight: 13,
    matBorderWidth: 2,
    basePrice: 169,
  },
  large: {
    id: "large",
    name: '28×16" Large',
    displayName: "Large Size",
    description: "Spacious layout for extensive stamp collections",
    frameWidth: 32,
    frameHeight: 20,
    matOpeningWidth: 28,
    matOpeningHeight: 16,
    matBorderWidth: 2,
    basePrice: 229,
  },
};

export function getStampLayout(layoutId: StampLayoutType): StampLayout | null {
  if (layoutId === "custom") return null;
  return STAMP_LAYOUTS[layoutId] ?? null;
}

export function getAllStampLayouts(): StampLayout[] {
  return Object.values(STAMP_LAYOUTS);
}

export const STAMP_CUSTOM_SIZE_LIMITS = {
  MIN_WIDTH: 6,
  MAX_WIDTH: 48,
  MIN_HEIGHT: 6,
  MAX_HEIGHT: 48,
  DEFAULT_MAT_BORDER: 2,
} as const;

export function createCustomStampLayout(displayWidth: number, displayHeight: number): StampLayout {
  const matBorderWidth = STAMP_CUSTOM_SIZE_LIMITS.DEFAULT_MAT_BORDER;
  return {
    id: "custom",
    name: `${displayWidth}×${displayHeight}" Custom`,
    displayName: "Custom Size",
    description: "Custom dimensions for unique stamp displays",
    frameWidth: displayWidth + matBorderWidth * 2,
    frameHeight: displayHeight + matBorderWidth * 2,
    matOpeningWidth: displayWidth,
    matOpeningHeight: displayHeight,
    matBorderWidth,
    basePrice: 0,
  };
}

export function validateStampCustomDimensions(
  width: number,
  height: number
): { valid: boolean; message?: string } {
  if (isNaN(width) || isNaN(height)) {
    return { valid: false, message: "Please enter valid dimensions" };
  }
  if (width < STAMP_CUSTOM_SIZE_LIMITS.MIN_WIDTH || height < STAMP_CUSTOM_SIZE_LIMITS.MIN_HEIGHT) {
    return {
      valid: false,
      message: `Minimum display size is ${STAMP_CUSTOM_SIZE_LIMITS.MIN_WIDTH}×${STAMP_CUSTOM_SIZE_LIMITS.MIN_HEIGHT} inches`,
    };
  }
  if (width > STAMP_CUSTOM_SIZE_LIMITS.MAX_WIDTH || height > STAMP_CUSTOM_SIZE_LIMITS.MAX_HEIGHT) {
    return {
      valid: false,
      message: `Maximum display size is ${STAMP_CUSTOM_SIZE_LIMITS.MAX_WIDTH}×${STAMP_CUSTOM_SIZE_LIMITS.MAX_HEIGHT} inches`,
    };
  }
  return { valid: true };
}

export interface StampBackingOption {
  id: string;
  sku: string;
  name: string;
  hex: string;
}

export const STAMP_BACKING_OPTIONS: StampBackingOption[] = [
  { id: "black", sku: "VB221", name: "Black", hex: "#333D37" },
  { id: "white", sku: "VB222", name: "White", hex: "#FFFFFF" },
  { id: "light-gray", sku: "VB535", name: "Light Gray", hex: "#C9D0CE" },
  { id: "off-white", sku: "VB502", name: "Off White", hex: "#FFFEEB" },
];

export function getStampBackingById(id: string): StampBackingOption | undefined {
  return STAMP_BACKING_OPTIONS.find((b) => b.id === id);
}

export function getDefaultStampBacking(): StampBackingOption {
  return STAMP_BACKING_OPTIONS[0]!;
}

export const STAMP_BRASS_PLAQUE_DIMENSIONS = {
  WIDTH: 4.5,
  HEIGHT: 1.5,
  BOTTOM_SPACE_INCREASE: 1.5,
} as const;

export function getStampLayoutWithBrassNameplate(params: {
  layout: StampLayout;
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
    frameHeight: layout.frameHeight + STAMP_BRASS_PLAQUE_DIMENSIONS.BOTTOM_SPACE_INCREASE,
    matOpeningWidth: layout.matOpeningWidth,
    matOpeningHeight: layout.matOpeningHeight,
    matBorderTop: layout.matBorderWidth,
    matBorderRight: layout.matBorderWidth,
    matBorderBottom: layout.matBorderWidth + STAMP_BRASS_PLAQUE_DIMENSIONS.BOTTOM_SPACE_INCREASE,
    matBorderLeft: layout.matBorderWidth,
    brassPlaqueSpace: STAMP_BRASS_PLAQUE_DIMENSIONS.BOTTOM_SPACE_INCREASE,
  };
}
