/**
 * Bouquet lifestyle photos for the preserved bouquet frames designer.
 * Paths: bouquet/lifestyle/bouquet-lifestyle-1.jpg ... bouquet-lifestyle-33.jpg (shared bucket).
 * Use getSharedAssetUrl so CDN/local works (same as jersey, military, currency lifestyle).
 * Naming matches jersey-lifestyle-N.jpg convention.
 *
 * Original: CustomFrameSizes-CODE client used @assets/bouquet_Frame_Lifestyle_(N)_*.jpg
 * Upload script: useful-scripts/cloudflare-r2-upload-bouquet-lifestyle.mjs
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export interface BouquetLifestylePhoto {
  url: string;
  alt: string;
}

const LIFESTYLE_COUNT = 33;
const BASE_PATH = "bouquet/lifestyle";

/**
 * Returns all bouquet lifestyle images with resolved URLs (shared CDN or local).
 */
export function getBouquetLifestyleImages(): BouquetLifestylePhoto[] {
  const out: BouquetLifestylePhoto[] = [];
  for (let i = 1; i <= LIFESTYLE_COUNT; i++) {
    out.push({
      url: getSharedAssetUrl(`${BASE_PATH}/bouquet-lifestyle-${i}.jpg`),
      alt: `Preserved bouquet frame lifestyle photo ${i} - wedding flower display inspiration`,
    });
  }
  return out;
}

/**
 * Get a single image by 1-based index.
 */
export function getBouquetLifestyleImageByNumber(num: number): BouquetLifestylePhoto {
  return {
    url: getSharedAssetUrl(`${BASE_PATH}/bouquet-lifestyle-${num}.jpg`),
    alt: `Preserved bouquet frame lifestyle photo ${num} - wedding flower display inspiration`,
  };
}

/**
 * Get a single random bouquet lifestyle photo (for designer preview thumbnail).
 */
export function getRandomBouquetLifestyleImage(): BouquetLifestylePhoto {
  const images = getBouquetLifestyleImages();
  const index = Math.floor(Math.random() * images.length);
  return images[index] ?? images[0]!;
}
