/**
 * Stamp lifestyle photos for the stamp display frames designer.
 * Paths: stamp/lifestyle/stamp-lifestyle-1.jpg ... stamp-lifestyle-34.jpg
 *
 * Original: CustomFrameSizes-CODE used @assets/Stamp_Frame_Lifestyle_(1) through (34)
 * Upload script would place in shared bucket at stamp/lifestyle/
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export interface StampLifestylePhoto {
  url: string;
  alt: string;
}

const LIFESTYLE_COUNT = 34;
const BASE_PATH = "stamp/lifestyle";

/**
 * Returns all stamp lifestyle images with resolved URLs (shared CDN or local).
 */
export function getStampLifestyleImages(): StampLifestylePhoto[] {
  const out: StampLifestylePhoto[] = [];
  for (let i = 1; i <= LIFESTYLE_COUNT; i++) {
    out.push({
      url: getSharedAssetUrl(`${BASE_PATH}/stamp-lifestyle-${i}.jpg`),
      alt: `Stamp frame lifestyle photo ${i} - philatelic display inspiration`,
    });
  }
  return out;
}

/**
 * Get a single image by 1-based index.
 */
export function getStampLifestyleImageByNumber(num: number): StampLifestylePhoto {
  return {
    url: getSharedAssetUrl(`${BASE_PATH}/stamp-lifestyle-${num}.jpg`),
    alt: `Stamp frame lifestyle photo ${num} - philatelic display inspiration`,
  };
}

/**
 * Get a single random stamp lifestyle photo (for designer preview thumbnail).
 */
export function getRandomStampLifestyleImage(): StampLifestylePhoto {
  const images = getStampLifestyleImages();
  const index = Math.floor(Math.random() * images.length);
  return images[index] ?? images[0]!;
}
