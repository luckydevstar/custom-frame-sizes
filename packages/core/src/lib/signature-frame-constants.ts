/**
 * Signature frame designer constants.
 * Wedding/guest signature frames: single centered opening (5×5 or 8×8), wide mat for signatures.
 */

export const SIGNATURE_OPENING_SIZES = ["5x5", "8x8"] as const;
export type SignatureOpeningSize = (typeof SIGNATURE_OPENING_SIZES)[number];

export const SIGNATURE_OPENING_SHAPES = ["square", "circle", "heart"] as const;
export type SignatureOpeningShape = (typeof SIGNATURE_OPENING_SHAPES)[number];

/** Mat border range (inches) – signature space around the photo opening */
export const SIGNATURE_MAT_BORDER_MIN = 4;
export const SIGNATURE_MAT_BORDER_MAX = 12;
export const SIGNATURE_MAT_BORDER_DEFAULT = 6;

/** Fixed mat reveal for double mat (inches) */
export const SIGNATURE_MAT_REVEAL = 0.25;

export function getSignatureOpeningSizeInches(size: SignatureOpeningSize): number {
  return size === "5x5" ? 5 : 8;
}
