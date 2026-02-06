/**
 * Puzzle lifestyle images for designer sidebar.
 * Files: shared_assets/puzzle/lifestyle/PuzzleFrame_Lifestyle (1).png ... (75).png
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export interface PuzzleLifestylePhoto {
  url: string;
  alt: string;
}

const LIFESTYLE_COUNT = 75;
const BASE = "puzzle/lifestyle";

function getPath(n: number): string {
  return `${BASE}/PuzzleFrame_Lifestyle (${n}).png`;
}

const INSERT_COUNT = 90;
const INSERT_BASE = "puzzle/insert-images";

function getInsertPath(n: number): string {
  return `${INSERT_BASE}/PuzzleInsertImage (${n}).png`;
}

/** All puzzle lifestyle photos for carousels (url + alt). */
export function getPuzzleLifestyleImages(): PuzzleLifestylePhoto[] {
  const out: PuzzleLifestylePhoto[] = [];
  for (let n = 1; n <= LIFESTYLE_COUNT; n++) {
    out.push({
      url: getSharedAssetUrl(getPath(n)),
      alt: `Jigsaw puzzle frame lifestyle photo ${n}`,
    });
  }
  return out;
}

/** Returns a random puzzle lifestyle photo (full URL + alt). */
export function getRandomPuzzlePhoto(): PuzzleLifestylePhoto {
  const n = Math.floor(Math.random() * LIFESTYLE_COUNT) + 1;
  return {
    url: getSharedAssetUrl(getPath(n)),
    alt: `Jigsaw puzzle frame lifestyle photo ${n}`,
  };
}

/** Returns a random puzzle insert image URL for preview (seed for determinism). */
export function getRandomPuzzleImage(seed?: string | number): string {
  const n =
    seed !== undefined
      ? (typeof seed === "number" ? Math.abs(seed) : hash(seed)) % INSERT_COUNT
      : Math.floor(Math.random() * INSERT_COUNT);
  const index = (n % INSERT_COUNT) + 1;
  return getSharedAssetUrl(getInsertPath(index));
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
