/**
 * Sonogram lifestyle photos for designer and pages.
 * Paths relative to shared_assets/sonogram/lifestyle/.
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export interface SonogramLifestyleImage {
  url: string;
  alt: string;
}

const BASE = "sonogram/lifestyle";
const ALTS: string[] = [
  "Happy couple holding custom framed sonogram with Love at First Sight text, white frame, pregnancy announcement",
  "Smiling couple on sofa with framed sonogram, white wood frame, pregnancy keepsake",
  "Expectant parents with sonogram frame by fireplace, white frame with accent mat",
  "Couple holding silver frame with Before We Met You We Loved You text, double mat sonogram",
  "Parents-to-be on cream sofa with white sonogram frame, bookshelf background",
  "Pregnant couple beside wall-mounted oak dual sonogram frame, nursery setting",
  "Expectant mother and father with white framed sonogram, bright living room",
  "Couple in nursery with gold wood dual sonogram frame, dresser with teddy bear",
  "Happy couple in baby nursery beside pink wood framed double sonogram, crib visible",
  "Parents-to-be holding honey oak dual sonogram frame, modern living room",
  "Pregnant couple admiring wall-hung oak dual sonogram frame, brick fireplace",
  "Expectant parents in formal living room with white wood framed sonogram",
  "Happy couple in rustic cabin with honey oak dual sonogram frame, stone fireplace",
  "Smiling couple in bright living room with white custom sonogram frame",
  "Expectant parents in cozy living room with honey oak dual sonogram frame",
  "Happy couple in log cabin with oak wood dual sonogram frame, fireplace",
  "Parents-to-be with natural wood sonogram frame with It's a Boy text, blue accent mat",
  "Pregnant couple in sunny living room with white framed sonogram",
  "Smiling expectant parents holding brown wood framed sonogram, stone mantle",
  "Happy couple by Christmas tree with silver dual sonogram frame",
  "Parents-to-be with natural wood frame with It's a Boy text, teal blue mat",
  "Couple holding natural wood sonogram frame with It's a Boy text, houseplants",
  "Couple holding black framed sonogram with It's a Girl text, pink accent mat",
  "Pregnant mother with black framed sonogram with It's a Girl text, pink mat",
  "Expecting couple holding black framed sonogram with It's a Girl text",
  "Smiling couple with black wood framed sonogram featuring It's a Girl text",
  "Pregnant woman in sunroom with black framed sonogram, It's a Girl text",
  "Happy couple by stone fireplace with natural oak framed sonogram",
  "Elegant couple with white framed sonogram with It's a Girl text, city skyline",
  "Joyful couple on white sofa with custom white framed sonogram, Love at First Sight text",
];

export function getSonogramLifestyleImages(): SonogramLifestyleImage[] {
  const out: SonogramLifestyleImage[] = [];
  for (let i = 1; i <= 30; i++) {
    const num = i.toString().padStart(2, "0");
    out.push({
      url: getSharedAssetUrl(`${BASE}/lifestyle_${num}.jpg`),
      alt: ALTS[i - 1] ?? "Sonogram frame lifestyle display",
    });
  }
  return out;
}

export function getRandomSonogramLifestyleImage(): SonogramLifestyleImage {
  const images = getSonogramLifestyleImages();
  return images[Math.floor(Math.random() * images.length)] ?? images[0]!;
}
