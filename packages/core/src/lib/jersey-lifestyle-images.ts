/**
 * Jersey frame lifestyle images for the designer carousel and pages.
 * Paths relative to shared_assets: jersey/lifestyle/ (same pattern as puzzle/lifestyle, currency/lifestyle).
 * Use getSharedAssetUrl(path) for img src.
 *
 * Files: jersey/lifestyle/jersey-lifestyle-1.jpg ... jersey-lifestyle-16.jpg
 * Upload to the shared R2 bucket (NEXT_PUBLIC_CDN_SHARED_URL) using useful-scripts.
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export interface JerseyLifestyleImage {
  url: string;
  alt: string;
}

const LIFESTYLE_COUNT = 16;
const BASE_PATH = "jersey/lifestyle";

const ALTS: string[] = [
  "Jersey display frame in sports room",
  "Framed hockey jersey on wall in man cave",
  "NHL jersey shadowbox in home office",
  "Sports jersey frame in den",
  "Jersey memorabilia frame setup",
  "Autographed jersey in custom frame",
  "Multi-jersey display frame",
  "Jersey collector frame arrangement",
  "Jersey frame in man cave setting",
  "Championship jersey display",
  "Jersey frame gift idea",
  "Mounted jersey display case",
  "Sports memorabilia frame wall",
  "Jersey collection showcase",
  "Game-worn jersey in frame",
  "Sports fan room decor",
];

/**
 * Returns all 16 jersey lifestyle images (for designer carousel and pages).
 * URLs via getSharedAssetUrl: jersey/lifestyle/jersey-lifestyle-1.jpg ... 16.jpg
 */
export function getJerseyLifestyleImages(): JerseyLifestyleImage[] {
  const out: JerseyLifestyleImage[] = [];
  for (let i = 1; i <= LIFESTYLE_COUNT; i++) {
    out.push({
      url: getSharedAssetUrl(`${BASE_PATH}/jersey-lifestyle-${i}.jpg`),
      alt: ALTS[i - 1] ?? "Jersey frame lifestyle",
    });
  }
  return out;
}

/**
 * Returns a single random jersey lifestyle image URL (for preview thumbnail).
 */
export function getRandomJerseyLifestyleImage(): string {
  const images = getJerseyLifestyleImages();
  const index = Math.floor(Math.random() * images.length);
  return images[index]?.url ?? images[0]!.url;
}
