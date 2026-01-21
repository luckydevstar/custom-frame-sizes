/**
 * Brass Nameplate Positioning Utilities
 *
 * Implements the four behavior types for nameplate integration:
 * - Type A: Stretched Border (most specialty designers)
 * - Type B: Stretched Border with User Override (generic designers)
 * - Type C: Integrated Fixed Position (Jersey)
 * - Type D: Integrated Fixed Distance from Opening (Signature)
 */

import { BRASS_NAMEPLATE_SPECS, type NameplateBehaviorType } from "@framecraft/types";

export interface NameplatePositionResult {
  bottomMatBorder: number;
  nameplateY: number;
  nameplateX: number;
  frameHeightIncrease: number;
}

export interface TypeAOptions {
  nameplateEnabled: boolean;
  baseBottomBorder: number;
  frameWidth: number;
  matOpeningHeight: number;
  topMatBorder: number;
}

export interface TypeBOptions {
  nameplateEnabled: boolean;
  userBottomBorder: number;
  frameWidth: number;
  matOpeningHeight: number;
  topMatBorder: number;
}

export interface TypeDOptions {
  nameplateEnabled: boolean;
  frameWidth: number;
  matOpeningHeight: number;
  topMatBorder: number;
}

/**
 * Type A: Stretched Border
 * Bottom mat border becomes fixed 3.75" when nameplate is enabled
 * Nameplate positioned 1" below mat opening
 */
export function calculateTypeAPosition(options: TypeAOptions): NameplatePositionResult {
  const { nameplateEnabled, baseBottomBorder, frameWidth, matOpeningHeight, topMatBorder } =
    options;

  if (!nameplateEnabled) {
    return {
      bottomMatBorder: baseBottomBorder,
      nameplateY: 0,
      nameplateX: 0,
      frameHeightIncrease: 0,
    };
  }

  const bottomMatBorder = BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER;
  const frameHeightIncrease = bottomMatBorder - baseBottomBorder;

  const nameplateY = topMatBorder + matOpeningHeight + BRASS_NAMEPLATE_SPECS.OFFSET_FROM_OPENING;
  const nameplateX = (frameWidth - BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH) / 2;

  return {
    bottomMatBorder,
    nameplateY,
    nameplateX,
    frameHeightIncrease,
  };
}

/**
 * Type B: Stretched Border with User Override
 * Same as Type A, but if user border >= 3.75", no change needed
 */
export function calculateTypeBPosition(options: TypeBOptions): NameplatePositionResult {
  const { nameplateEnabled, userBottomBorder, frameWidth, matOpeningHeight, topMatBorder } =
    options;

  if (!nameplateEnabled) {
    return {
      bottomMatBorder: userBottomBorder,
      nameplateY: 0,
      nameplateX: 0,
      frameHeightIncrease: 0,
    };
  }

  const needsExpansion = userBottomBorder < BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER;
  const bottomMatBorder = needsExpansion
    ? BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER
    : userBottomBorder;
  const frameHeightIncrease = needsExpansion
    ? BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER - userBottomBorder
    : 0;

  const nameplateY = topMatBorder + matOpeningHeight + BRASS_NAMEPLATE_SPECS.OFFSET_FROM_OPENING;
  const nameplateX = (frameWidth - BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH) / 2;

  return {
    bottomMatBorder,
    nameplateY,
    nameplateX,
    frameHeightIncrease,
  };
}

/**
 * Type C: Integrated Fixed Position (Jersey)
 * Nameplate is a pre-cut mat opening at fixed coordinates
 * No mat extension - part of the designed layout
 */
export function calculateTypeCPosition(
  layoutPlaqueOpening: { x: number; y: number; width: number; height: number } | null
): { x: number; y: number } | null {
  if (!layoutPlaqueOpening) return null;
  return {
    x: layoutPlaqueOpening.x,
    y: layoutPlaqueOpening.y,
  };
}

/**
 * Type D: Integrated Fixed Distance from Opening (Signature)
 * Fixed 1" below mat opening, no mat extension
 * Bottom border is pre-calculated to accommodate nameplate
 */
export function calculateTypeDPosition(options: TypeDOptions): NameplatePositionResult {
  const { nameplateEnabled, frameWidth, matOpeningHeight, topMatBorder } = options;

  if (!nameplateEnabled) {
    return {
      bottomMatBorder: 0,
      nameplateY: 0,
      nameplateX: 0,
      frameHeightIncrease: 0,
    };
  }

  const bottomMatBorder =
    BRASS_NAMEPLATE_SPECS.OFFSET_FROM_OPENING +
    BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT +
    BRASS_NAMEPLATE_SPECS.BOTTOM_CLEARANCE;

  const nameplateY = topMatBorder + matOpeningHeight + BRASS_NAMEPLATE_SPECS.OFFSET_FROM_OPENING;
  const nameplateX = (frameWidth - BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH) / 2;

  return {
    bottomMatBorder,
    nameplateY,
    nameplateX,
    frameHeightIncrease: 0,
  };
}

/**
 * Universal nameplate positioning calculator
 * Delegates to the appropriate type-specific function
 */
export function calculateNameplatePosition(
  behaviorType: NameplateBehaviorType,
  options: {
    nameplateEnabled: boolean;
    frameWidth: number;
    matOpeningHeight: number;
    topMatBorder: number;
    baseBottomBorder?: number;
    userBottomBorder?: number;
    layoutPlaqueOpening?: { x: number; y: number; width: number; height: number } | null;
  }
): NameplatePositionResult | { x: number; y: number } | null {
  const {
    nameplateEnabled,
    frameWidth,
    matOpeningHeight,
    topMatBorder,
    baseBottomBorder = 0,
    userBottomBorder = 0,
    layoutPlaqueOpening,
  } = options;

  switch (behaviorType) {
    case "A":
      return calculateTypeAPosition({
        nameplateEnabled,
        baseBottomBorder,
        frameWidth,
        matOpeningHeight,
        topMatBorder,
      });

    case "B":
      return calculateTypeBPosition({
        nameplateEnabled,
        userBottomBorder,
        frameWidth,
        matOpeningHeight,
        topMatBorder,
      });

    case "C":
      return calculateTypeCPosition(layoutPlaqueOpening || null);

    case "D":
      return calculateTypeDPosition({
        nameplateEnabled,
        frameWidth,
        matOpeningHeight,
        topMatBorder,
      });

    default:
      return null;
  }
}

/**
 * Convert position from inches to pixels
 */
export function toPixels(inches: number, scale: number): number {
  return inches * scale;
}

/**
 * Get nameplate dimensions in pixels
 */
export function getNameplateDimensionsPx(scale: number): { width: number; height: number } {
  return {
    width: BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH * scale,
    height: BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT * scale,
  };
}
