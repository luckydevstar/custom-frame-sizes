/**
 * Needlework lifestyle image paths and alt text.
 * Files live in shared_assets/needlework/lifestyle/ (lifestyle_1.jpeg … lifestyle_31.jpeg).
 * Use with getSharedAssetUrl to build full URLs.
 */

export interface NeedleworkLifestyleImage {
  path: string;
  alt: string;
}

const LIFESTYLE_COUNT = 31;
const BASE_PATH = "needlework/lifestyle";

/** Alt text from original CODE (needlework-lifestyle-images.ts). */
const ALTS: string[] = [
  "Senior woman admiring framed floral cross-stitch sampler in cozy living room",
  "Woman holding framed wildflower embroidery in natural wood frame",
  "Woman in sweater with framed botanical cross-stitch featuring spring flowers",
  "Senior woman holding framed floral sampler in traditional oak frame",
  "Woman standing with framed botanical embroidery near bookshelf",
  "Woman in cozy sweater admiring framed wildflower garden cross-stitch",
  "Senior woman smiling with framed floral rose cross-stitch in sunlit room",
  "Woman holding framed botanical fern embroidery with plants in background",
  "Woman in linen blouse with framed floral cross-stitch in minimalist setting",
  "Woman holding framed Home Is Where The Heart Is cross-stitch with plants",
  "Woman with curly hair holding framed herb garden embroidery",
  "Senior woman smiling with framed floral sampler in bright living room",
  "Senior woman holding framed Home Sweet Home cross-stitch with floral border",
  "Senior woman on sofa with framed floral embroidery in natural light",
  "Senior woman holding framed floral cross-stitch with traditional border design",
  "Senior woman admiring framed Home Is Where The Heart Is sampler by window",
  "Senior woman in cardigan holding framed wildflower meadow embroidery",
  "Senior woman holding framed vintage sampler dated 1985 in cozy setting",
  "Senior woman displaying framed cottage garden cross-stitch scene",
  "Grandmother and child with framed Nana & Me embroidery in rustic frame",
  "Grandmother and child laughing with framed Family Is Love sampler",
  "Grandmother and granddaughter with framed Our Family Garden cross-stitch",
  "Mother and child on couch with framed Home Is Where The Heart Is cross-stitch",
  "Grandmother and child with framed family tree embroidery featuring names",
  "Grandmother and child holding framed family tree needlework with Lucy, Nana, Mom",
  "Mother and daughter with large framed garden cottage embroidery",
  "Mother and child with framed Home Is Where The Heart Is 2024 sampler",
  "Man holding framed vintage sampler with tree of life and animals",
  "Hands holding antique framed Home Sweet Home sampler by window",
  "Elderly hands with framed cottage cross-stitch on lace tablecloth",
  "Hands holding framed Home Is Where The Heart Is sampler on wooden workbench",
];

/** Path + alt for each lifestyle image (path relative for getSharedAssetUrl). */
export function getNeedleworkLifestyleImages(): NeedleworkLifestyleImage[] {
  const out: NeedleworkLifestyleImage[] = [];
  for (let i = 1; i <= LIFESTYLE_COUNT; i++) {
    out.push({
      path: `${BASE_PATH}/lifestyle_${i}.jpeg`,
      alt: ALTS[i - 1] ?? `Needlework frame lifestyle photo ${i}`,
    });
  }
  return out;
}

/** Single random lifestyle (path + alt). */
export function getRandomNeedleworkLifestyleImage(): NeedleworkLifestyleImage | null {
  const images = getNeedleworkLifestyleImages();
  if (images.length === 0) return null;
  const index = Math.floor(Math.random() * images.length);
  return images[index] ?? null;
}
