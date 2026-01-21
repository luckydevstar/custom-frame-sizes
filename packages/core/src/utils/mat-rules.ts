/**
 * Mat Board Material Rules and Validation
 * Defines business rules, constraints, and validation logic for custom mat boards
 */

/**
 * Standard mat board sheet dimensions
 * Most cost-effective and readily available size
 */
export const STANDARD_SHEET_WIDTH = 32;
export const STANDARD_SHEET_HEIGHT = 40;

/**
 * Determine if mat dimensions require oversize sheet
 *
 * A mat is considered oversize if:
 * - The shorter dimension exceeds 32" (standard short side), OR
 * - The longer dimension exceeds 40" (standard long side)
 *
 * @param dimensions - Mat width and height in inches
 * @returns True if oversize sheet required, false if standard sheet sufficient
 *
 * @example
 * isOversizeMat({ widthIn: 16, heightIn: 20 }) // false - fits standard 32×40
 * isOversizeMat({ widthIn: 32, heightIn: 40 }) // false - exactly standard size
 * isOversizeMat({ widthIn: 33, heightIn: 40 }) // true - short side exceeds 32"
 * isOversizeMat({ widthIn: 32, heightIn: 41 }) // true - long side exceeds 40"
 * isOversizeMat({ widthIn: 24, heightIn: 48 }) // true - long side exceeds 40"
 */
export function isOversizeMat({
  widthIn,
  heightIn,
}: {
  widthIn: number;
  heightIn: number;
}): boolean {
  // Determine short and long sides regardless of orientation
  const [shortSide, longSide] = widthIn <= heightIn ? [widthIn, heightIn] : [heightIn, widthIn];

  // Oversize if either dimension exceeds standard sheet limits
  return shortSide > STANDARD_SHEET_WIDTH || longSide > STANDARD_SHEET_HEIGHT;
}
