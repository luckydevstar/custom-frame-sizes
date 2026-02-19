/**
 * Currency Frame Layouts
 * Defines the available shadowbox layouts for currency collection framing.
 * Same three size options as Stamp Frame + custom sizing.
 */

export type CurrencyLayoutType = "compact" | "standard" | "large" | "custom";

export interface CurrencyLayout {
  id: CurrencyLayoutType;
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

export type CurrencyPresetLayoutType = "compact" | "standard" | "large";

const CURRENCY_LAYOUTS: Record<CurrencyPresetLayoutType, CurrencyLayout> = {
  compact: {
    id: "compact",
    name: '14×12" Compact',
    displayName: "Compact Size",
    description: "Perfect for small currency collections or featured bills",
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
    description: "Ideal for medium currency collections and commemorative bills",
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
    description: "Spacious layout for extensive currency collections",
    frameWidth: 32,
    frameHeight: 20,
    matOpeningWidth: 28,
    matOpeningHeight: 16,
    matBorderWidth: 2,
    basePrice: 229,
  },
};

export function getCurrencyLayout(layoutId: CurrencyLayoutType): CurrencyLayout | null {
  if (layoutId === "custom") return null;
  return CURRENCY_LAYOUTS[layoutId] ?? null;
}

export function getAllCurrencyLayouts(): CurrencyLayout[] {
  return Object.values(CURRENCY_LAYOUTS);
}

export const CURRENCY_CUSTOM_SIZE_LIMITS = {
  MIN_WIDTH: 6,
  MAX_WIDTH: 30,
  MIN_HEIGHT: 6,
  MAX_HEIGHT: 40,
  DEFAULT_MAT_BORDER: 2,
} as const;

export function createCustomCurrencyLayout(
  displayWidth: number,
  displayHeight: number
): CurrencyLayout {
  const matBorderWidth = CURRENCY_CUSTOM_SIZE_LIMITS.DEFAULT_MAT_BORDER;
  return {
    id: "custom",
    name: `${displayWidth}×${displayHeight}" Custom`,
    displayName: "Custom Size",
    description: "Custom dimensions for unique currency displays",
    frameWidth: displayWidth + matBorderWidth * 2,
    frameHeight: displayHeight + matBorderWidth * 2,
    matOpeningWidth: displayWidth,
    matOpeningHeight: displayHeight,
    matBorderWidth,
    basePrice: 0,
  };
}

export function validateCurrencyCustomDimensions(
  width: number,
  height: number
): { valid: boolean; message?: string } {
  if (isNaN(width) || isNaN(height)) {
    return { valid: false, message: "Please enter valid dimensions" };
  }
  if (
    width < CURRENCY_CUSTOM_SIZE_LIMITS.MIN_WIDTH ||
    height < CURRENCY_CUSTOM_SIZE_LIMITS.MIN_HEIGHT
  ) {
    return {
      valid: false,
      message: `Minimum display size is ${CURRENCY_CUSTOM_SIZE_LIMITS.MIN_WIDTH}×${CURRENCY_CUSTOM_SIZE_LIMITS.MIN_HEIGHT} inches`,
    };
  }
  if (
    width > CURRENCY_CUSTOM_SIZE_LIMITS.MAX_WIDTH ||
    height > CURRENCY_CUSTOM_SIZE_LIMITS.MAX_HEIGHT
  ) {
    return {
      valid: false,
      message: `Maximum display size is ${CURRENCY_CUSTOM_SIZE_LIMITS.MAX_WIDTH}×${CURRENCY_CUSTOM_SIZE_LIMITS.MAX_HEIGHT} inches`,
    };
  }
  return { valid: true };
}

export interface CurrencyBackingOption {
  id: string;
  sku: string;
  name: string;
  hex: string;
}

export const CURRENCY_BACKING_OPTIONS: CurrencyBackingOption[] = [
  { id: "black", sku: "VB221", name: "Black", hex: "#333D37" },
  { id: "white", sku: "VB222", name: "White", hex: "#FFFFFF" },
  { id: "light-gray", sku: "VB535", name: "Light Gray", hex: "#C9D0CE" },
  { id: "off-white", sku: "VB502", name: "Off White", hex: "#FFFEEB" },
];

export function getCurrencyBackingById(id: string): CurrencyBackingOption | undefined {
  return CURRENCY_BACKING_OPTIONS.find((b) => b.id === id);
}

export function getDefaultCurrencyBacking(): CurrencyBackingOption {
  return CURRENCY_BACKING_OPTIONS[0]!;
}

export const CURRENCY_BRASS_PLAQUE_DIMENSIONS = {
  WIDTH: 4.5,
  HEIGHT: 1.5,
  BOTTOM_SPACE_INCREASE: 1.5,
} as const;

export function getCurrencyLayoutWithBrassNameplate(params: {
  layout: CurrencyLayout;
  brassPlaqueEnabled: boolean;
}) {
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
    frameHeight: layout.frameHeight + CURRENCY_BRASS_PLAQUE_DIMENSIONS.BOTTOM_SPACE_INCREASE,
    matOpeningWidth: layout.matOpeningWidth,
    matOpeningHeight: layout.matOpeningHeight,
    matBorderTop: layout.matBorderWidth,
    matBorderRight: layout.matBorderWidth,
    matBorderBottom: layout.matBorderWidth + CURRENCY_BRASS_PLAQUE_DIMENSIONS.BOTTOM_SPACE_INCREASE,
    matBorderLeft: layout.matBorderWidth,
    brassPlaqueSpace: CURRENCY_BRASS_PLAQUE_DIMENSIONS.BOTTOM_SPACE_INCREASE,
  };
}
