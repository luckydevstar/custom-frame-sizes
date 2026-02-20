/**
 * Military lifestyle photos for the military frames page carousel and "How it works" section.
 * Paths: military/lifestyle/lifestyle_01.jpg ... lifestyle_50.jpg (shared bucket).
 * Use getSharedAssetUrl so CDN/local works (same as jersey, puck, currency lifestyle).
 *
 * Original: CustomFrameSizes-CODE client/src/constants/military-lifestyle-photos.ts
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export interface MilitaryLifestylePhoto {
  url: string;
  alt: string;
}

const LIFESTYLE_COUNT = 50;
const BASE_PATH = "military/lifestyle";

/**
 * Returns all military lifestyle images with resolved URLs (shared CDN or local).
 * Used by MilitaryLifestyleCarousel and by the military page "How it works" section.
 */
export function getMilitaryLifestyleImages(): MilitaryLifestylePhoto[] {
  const out: MilitaryLifestylePhoto[] = [];
  for (let i = 1; i <= LIFESTYLE_COUNT; i++) {
    const num = String(i).padStart(2, "0");
    out.push({
      url: getSharedAssetUrl(`${BASE_PATH}/lifestyle_${num}.jpg`),
      alt: `Military shadowbox lifestyle photo ${num} - military memorabilia display inspiration`,
    });
  }
  return out;
}

/**
 * Get a single image by 1-based index (e.g. 12 for lifestyle_12.jpg).
 * Used by "How it works" section for specific inline images.
 */
export function getMilitaryLifestyleImageByNumber(num: number): MilitaryLifestylePhoto {
  const n = String(num).padStart(2, "0");
  return {
    url: getSharedAssetUrl(`${BASE_PATH}/lifestyle_${n}.jpg`),
    alt: `Military shadowbox lifestyle photo ${num} - military memorabilia display inspiration`,
  };
}

/**
 * Get a single random military lifestyle photo (for designer preview thumbnail).
 */
export function getRandomMilitaryPhoto(): MilitaryLifestylePhoto {
  const images = getMilitaryLifestyleImages();
  const index = Math.floor(Math.random() * images.length);
  return images[index] ?? images[0]!;
}
