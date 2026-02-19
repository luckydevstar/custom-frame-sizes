/**
 * Currency frame lifestyle images for the designer "Currency Frames in Your Home" carousel.
 * Paths relative to shared_assets: currency/lifestyle/ (same pattern as puzzle/lifestyle, ticket-frames/lifestyle).
 * Use getSharedAssetUrl(path) for img src.
 *
 * Files: currency/lifestyle/currency-lifestyle-1.jpg ... currency-lifestyle-17.jpg
 * Upload to the shared R2 bucket (NEXT_PUBLIC_CDN_SHARED_URL) using useful-scripts.
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export interface CurrencyLifestyleImage {
  url: string;
  alt: string;
}

const CURRENCY_LIFESTYLE_ALTS = [
  "Currency display frame in home setting with paper money collection",
  "Custom currency shadowbox frame in living room",
  "Framed paper money collection in study",
  "Currency frame display in home office",
  "Shadowbox currency frame on wall",
  "Framed bill collection in den",
  "Currency frame in gallery wall setting",
  "Custom currency frame in modern interior",
  "Paper money display frame in home",
  "Currency shadowbox in living space",
  "Framed currency collection display",
  "Currency frame in room setting",
  "Custom framed bills in home",
  "Currency display frame lifestyle",
  "Shadowbox currency frame in setting",
  "Framed money collection in home",
  "Currency frame in your home",
];

const CURRENCY_LIFESTYLE_COUNT = 17;
const BASE_PATH = "currency/lifestyle";

/**
 * Returns all 17 currency lifestyle images (for designer carousel).
 * URLs via getSharedAssetUrl: currency/lifestyle/currency-lifestyle-1.jpg ... 17.jpg
 */
export function getCurrencyLifestyleImages(): CurrencyLifestyleImage[] {
  const out: CurrencyLifestyleImage[] = [];
  for (let i = 1; i <= CURRENCY_LIFESTYLE_COUNT; i++) {
    out.push({
      url: getSharedAssetUrl(`${BASE_PATH}/currency-lifestyle-${i}.jpg`),
      alt: CURRENCY_LIFESTYLE_ALTS[i - 1] ?? "Currency frame in home setting",
    });
  }
  return out;
}

/**
 * Returns a single random currency lifestyle image URL (for preview thumbnail).
 */
export function getRandomCurrencyLifestyleImage(): string {
  const images = getCurrencyLifestyleImages();
  const index = Math.floor(Math.random() * images.length);
  return images[index]?.url ?? images[0]!.url;
}
