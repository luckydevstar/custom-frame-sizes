/**
 * Preset display layouts (currency, stamp, etc.) embed a default mat border in
 * frameWidth/frameHeight. When the user changes the mat border slider, recompute
 * those outer dimensions from the fixed mat opening (display area).
 */
export type DisplayLayoutWithMatOpening = {
  matOpeningWidth: number;
  matOpeningHeight: number;
  frameWidth: number;
  frameHeight: number;
  matBorderWidth: number;
};

export function applyUserMatBorderToDisplayLayout<T extends DisplayLayoutWithMatOpening>(
  layout: T,
  matBorderInches: number,
  matType: "none" | "single" | "double"
): T {
  const border = matType === "none" ? 0 : matBorderInches;
  return {
    ...layout,
    matBorderWidth: border,
    frameWidth: layout.matOpeningWidth + 2 * border,
    frameHeight: layout.matOpeningHeight + 2 * border,
  };
}
