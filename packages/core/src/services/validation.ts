/**
 * Data validation service
 * Validates product data loaded from JSON files to ensure integrity
 */

import type { FrameStyle, MatColor, GlassType, PricingConfig } from "@framecraft/types";

/**
 * Validate frame style data
 */
export function validateFrameStyle(frame: unknown): frame is FrameStyle {
  const validCategories = ["picture", "shadowbox", "canvas"];
  return (
    typeof frame === "object" &&
    frame !== null &&
    typeof (frame as any).id === "string" &&
    typeof (frame as any).name === "string" &&
    typeof (frame as any).material === "string" &&
    typeof (frame as any).color === "string" &&
    typeof (frame as any).pricePerInch === "number" &&
    typeof (frame as any).borderColor === "string" &&
    typeof (frame as any).mouldingWidth === "number" &&
    typeof (frame as any).category === "string" &&
    validCategories.includes((frame as any).category)
  );
}

/**
 * Validate mat color data
 * Supports both old format (color) and new format (hexColor)
 */
export function validateMatColor(mat: unknown): mat is MatColor {
  return (
    typeof mat === "object" &&
    mat !== null &&
    typeof (mat as any).id === "string" &&
    typeof (mat as any).name === "string" &&
    (typeof (mat as any).hexColor === "string" || typeof (mat as any).color === "string") // Support both field names
    // pricePerInch is optional in new format
  );
}

/**
 * Validate glass type data
 */
export function validateGlassType(glass: unknown): glass is GlassType {
  return (
    typeof glass === "object" &&
    glass !== null &&
    typeof (glass as any).id === "string" &&
    typeof (glass as any).name === "string" &&
    typeof (glass as any).pricePerSqFt === "number"
  );
}

/**
 * Validate array of frame styles
 */
export function validateFrameStyles(frames: unknown[]): FrameStyle[] {
  const validated = frames.filter(validateFrameStyle);

  if (validated.length !== frames.length) {
    console.error("Invalid frame data detected:", {
      total: frames.length,
      valid: validated.length,
      invalid: frames.length - validated.length,
    });
  }

  if (validated.length === 0) {
    throw new Error("No valid frame styles found in data");
  }

  return validated;
}

/**
 * Validate array of mat colors
 */
export function validateMatColors(mats: unknown[]): MatColor[] {
  const validated = mats.filter(validateMatColor);

  if (validated.length !== mats.length) {
    console.error("Invalid mat data detected:", {
      total: mats.length,
      valid: validated.length,
      invalid: mats.length - validated.length,
    });
  }

  if (validated.length === 0) {
    throw new Error("No valid mat colors found in data");
  }

  return validated;
}

/**
 * Validate array of glass types
 */
export function validateGlassTypes(glass: unknown[]): GlassType[] {
  const validated = glass.filter(validateGlassType);

  if (validated.length !== glass.length) {
    console.error("Invalid glass data detected:", {
      total: glass.length,
      valid: validated.length,
      invalid: glass.length - validated.length,
    });
  }

  if (validated.length === 0) {
    throw new Error("No valid glass types found in data");
  }

  return validated;
}

/**
 * Validate pricing configuration
 * TODO: Add full validation when PricingConfig type is fully defined
 */
export function validatePricingConfig(config: unknown): config is PricingConfig {
  // Basic validation - can be expanded when PricingConfig type is fully defined
  return typeof config === "object" && config !== null;
}
