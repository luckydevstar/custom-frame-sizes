/**
 * Hockey puck frame lifestyle images for the designer carousel.
 * Paths relative to shared_assets: puck/lifestyle/ (same pattern as puzzle/lifestyle, currency/lifestyle).
 * Use getSharedAssetUrl(path) for img src.
 *
 * Files: puck/lifestyle/puck-lifestyle-1.jpg ... puck-lifestyle-26.jpg
 * Upload to the shared R2 bucket (NEXT_PUBLIC_CDN_SHARED_URL) using useful-scripts.
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export interface PuckLifestyleImage {
  url: string;
  alt: string;
}

const LIFESTYLE_COUNT = 26;
const BASE_PATH = "puck/lifestyle";

const ALTS: string[] = [
  "Hockey puck display frame in sports room",
  "Framed hockey puck collection on wall",
  "Game puck frame in home office",
  "NHL puck display in den",
  "Hockey memorabilia frame setup",
  "Autographed puck in custom frame",
  "Multi-puck display frame",
  "Hockey collector frame arrangement",
  "Puck frame in man cave setting",
  "Championship puck display",
  "Hockey puck frame gift idea",
  "Mounted puck display case",
  "Sports memorabilia frame wall",
  "Puck collection showcase",
  "Game-used puck in frame",
  "Hockey fan room decor",
  "Puck display with nameplate",
  "Framed hockey pucks in office",
  "Commemorative puck frame",
  "Hockey memorabilia gallery",
  "Puck frame interior design",
  "Multiple puck display setup",
  "Sports collector frame idea",
  "Autographed puck showcase",
  "Hockey room wall decor",
  "Puck collection display frame",
];

/**
 * Returns all 26 puck lifestyle images (for designer carousel).
 * URLs via getSharedAssetUrl: puck/lifestyle/puck-lifestyle-1.jpg ... 26.jpg
 */
export function getPuckLifestyleImages(): PuckLifestyleImage[] {
  const out: PuckLifestyleImage[] = [];
  for (let i = 1; i <= LIFESTYLE_COUNT; i++) {
    out.push({
      url: getSharedAssetUrl(`${BASE_PATH}/puck-lifestyle-${i}.jpg`),
      alt: ALTS[i - 1] ?? "Hockey puck display frame",
    });
  }
  return out;
}

/**
 * Returns a single random puck lifestyle image URL (for preview thumbnail).
 */
export function getRandomPuckLifestyleImage(): string {
  const images = getPuckLifestyleImages();
  const index = Math.floor(Math.random() * images.length);
  return images[index]?.url ?? images[0]!.url;
}
