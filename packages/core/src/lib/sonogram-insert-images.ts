/**
 * Sonogram insert/placeholder images for preview.
 * Paths relative to shared_assets/sonogram/insert-images/.
 * Filenames: sonogram_ultrasound_1.jpg, sonogram_ultrasound_2.jpg, ... (matches original attached_assets/stock_images/sonogram_inserts/).
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

const BASE = "sonogram/insert-images";
/** Number of insert images (sonogram_ultrasound_1.jpg … sonogram_ultrasound_N.jpg). Increase when more files are added. */
const INSERT_COUNT = 3;

function getPath(i: number): string {
  return `${BASE}/sonogram_ultrasound_${i}.jpg`;
}

/**
 * Returns all sonogram insert image URLs (for preview placeholders).
 */
export function getAllSonogramInsertImages(): string[] {
  const out: string[] = [];
  for (let i = 1; i <= INSERT_COUNT; i++) {
    out.push(getSharedAssetUrl(getPath(i)));
  }
  return out;
}

/**
 * Returns one random sonogram insert URL.
 */
export function getRandomSonogramInsertImage(seed?: string | number): string {
  const images = getAllSonogramInsertImages();
  if (images.length === 0) return "";
  if (seed !== undefined) {
    const n =
      typeof seed === "string" ? seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) : seed;
    return images[Math.abs(n) % images.length]!;
  }
  return images[Math.floor(Math.random() * images.length)]!;
}
