/**
 * Collage Insert Images - paths for collage frame preview inserts.
 * Uses getSharedAssetUrl; paths match shared_assets/collage/insert-images/collage-inserts/.
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export type CollagePhotoSet = "vintage" | "semi-vintage" | "modern";

const BASE = "collage/insert-images/collage-inserts";

/** Paths for set-1-vintage (30 images) */
const VINTAGE_PATHS: string[] = [];
for (let i = 1; i <= 30; i++) {
  VINTAGE_PATHS.push(`${BASE}/set-1-vintage/collage-vintage-${String(i).padStart(2, "0")}.jpg`);
}

/** Paths for set-2-semi-vintage (26 images) */
const SEMI_VINTAGE_PATHS: string[] = [];
for (let i = 1; i <= 26; i++) {
  SEMI_VINTAGE_PATHS.push(
    `${BASE}/set-2-semi-vintage/collage-semi-vintage-${String(i).padStart(2, "0")}.jpg`
  );
}

/** Paths for set-3-modern (34 images) */
const MODERN_PATHS: string[] = [];
for (let i = 1; i <= 34; i++) {
  MODERN_PATHS.push(`${BASE}/set-3-modern/collage-modern-${String(i).padStart(2, "0")}.jpg`);
}

function getPathsForSet(set: CollagePhotoSet): string[] {
  switch (set) {
    case "vintage":
      return VINTAGE_PATHS;
    case "semi-vintage":
      return SEMI_VINTAGE_PATHS;
    case "modern":
      return MODERN_PATHS;
    default:
      return VINTAGE_PATHS;
  }
}

/**
 * Get available sets (all three have assets)
 */
export function getAvailableSets(): CollagePhotoSet[] {
  return ["vintage", "semi-vintage", "modern"];
}

/**
 * Get image URLs for a collage layout. Returns one URL per opening.
 * Uses seed for deterministic selection; all images from the same set.
 */
export function getCollageImagePathsForLayout(
  openingCount: number,
  seed?: string | number,
  preferredSet?: CollagePhotoSet,
  _date?: Date
): string[] {
  const sets = getAvailableSets();
  const seedNum =
    seed !== undefined
      ? typeof seed === "string"
        ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        : seed
      : Math.floor(Math.random() * 1000);

  const selectedSet = preferredSet && sets.includes(preferredSet) ? preferredSet : sets[0]!;
  const paths = getPathsForSet(selectedSet);
  const n = paths.length;
  if (n === 0) return [];

  const urls: string[] = [];
  for (let i = 0; i < openingCount; i++) {
    const idx = (seedNum + i * 7) % n;
    urls.push(getSharedAssetUrl(paths[idx]!));
  }
  return urls;
}
