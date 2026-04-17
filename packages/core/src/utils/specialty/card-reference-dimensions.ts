/**
 * Manufacturing frame interior sizes (inches) from Amazon / production reference sheets.
 * Each card format (slab type) has its own table for the same layout ids (1x1, 2x4, …).
 *
 * Top Loader and Binder Page: add when those formats exist in card-formats.ts + designer.
 */

export type FrameSizeInches = { width: number; height: number };

/**
 * PSA graded slab (3" × 5.25" item) — CARD-001 … CARD-012
 */
export const PSA_GRADED_FRAME_DIMENSIONS: Record<string, FrameSizeInches> = {
  "1x1": { width: 7, height: 9.25 },
  "1x2": { width: 10.5, height: 9.25 },
  "2x1": { width: 7, height: 15 },
  "1x3": { width: 14, height: 9.25 },
  "3x1": { width: 7, height: 20.5 },
  "2x2": { width: 10.5, height: 15 },
  "2x3": { width: 14, height: 15 },
  "2x4": { width: 17.5, height: 15 },
  "3x3": { width: 14, height: 20.5 },
  "3x4": { width: 17.5, height: 20.5 },
  "4x4": { width: 17.5, height: 26.5 },
  "4x5": { width: 20.75, height: 26.5 },
};

/**
 * SGC / CGC / BGS slab — CARD-013 … CARD-024
 */
export const SGC_GRADED_FRAME_DIMENSIONS: Record<string, FrameSizeInches> = {
  "1x1": { width: 7.25, height: 9.5 },
  "1x2": { width: 11, height: 9.5 },
  "2x1": { width: 7.25, height: 15.25 },
  "1x3": { width: 14.75, height: 9.5 },
  "3x1": { width: 7.25, height: 21 },
  "2x2": { width: 11, height: 15.25 },
  "2x3": { width: 14.75, height: 15.25 },
  "2x4": { width: 18.5, height: 15.25 },
  "3x3": { width: 14.75, height: 21 },
  "3x4": { width: 18.5, height: 21 },
  "4x4": { width: 18.5, height: 27 },
  "4x5": { width: 22.25, height: 27 },
};

/**
 * PSA Pack Slab (4.4" × 7.4" item) — CARD-025 … CARD-036
 * All frame sizes from production reference (half-inch grid).
 */
export const PSA_PACK_SLAB_FRAME_DIMENSIONS: Record<string, FrameSizeInches> = {
  "1x1": { width: 8.5, height: 11.5 },
  "1x2": { width: 13.5, height: 11.5 },
  "2x1": { width: 8.5, height: 19.5 },
  "1x3": { width: 18.5, height: 11.5 },
  "3x1": { width: 8.5, height: 27.5 },
  "2x2": { width: 13.5, height: 19.5 },
  "2x3": { width: 18.5, height: 19.5 },
  "2x4": { width: 23.5, height: 19.5 },
  "3x3": { width: 18.5, height: 27.5 },
  "3x4": { width: 23.5, height: 27.5 },
  "4x4": { width: 23.5, height: 35.5 },
  "4x5": { width: 28.5, height: 35.5 },
};

/**
 * Layouts that have authoritative pack-slab dimensions (CARD-025–036 family).
 * Other layouts (e.g. 1x4, 1x5 strips) use generic preview sizing until a reference row exists.
 */
export const PACK_SLAB_REFERENCE_LAYOUT_IDS: ReadonlySet<string> = new Set(
  Object.keys(PSA_PACK_SLAB_FRAME_DIMENSIONS)
);

export function getReferenceFrameDimensions(
  formatId: string,
  layoutId: string
): FrameSizeInches | null {
  if (!layoutId) return null;
  switch (formatId) {
    case "psa":
      return PSA_GRADED_FRAME_DIMENSIONS[layoutId] ?? null;
    case "sgc-cgc-bgs":
      return SGC_GRADED_FRAME_DIMENSIONS[layoutId] ?? null;
    case "psa-pack-slabs":
      return PSA_PACK_SLAB_FRAME_DIMENSIONS[layoutId] ?? null;
    default:
      return null;
  }
}
