/**
 * Diploma Lifestyle Images - Configuration-agnostic lifestyle photos
 *
 * These images showcase diploma frames in real-world settings.
 * They're randomized for display across all diploma frame styles.
 *
 * Images live under shared_assets: diploma/lifestyle/
 * Naming: Diploma_Frame_Lifestyle (1).png ... (57).png
 * Consumers should use getSharedAssetUrl(url) when using as img src.
 */

export interface DiplomaLifestyleImage {
  url: string;
  alt: string;
}

/**
 * Array of 57 diploma lifestyle image paths (relative to shared assets).
 */
export const DIPLOMA_LIFESTYLE_IMAGES: DiplomaLifestyleImage[] = Array.from(
  { length: 57 },
  (_, index) => {
    const num = index + 1;
    return {
      url: `diploma/lifestyle/Diploma_Frame_Lifestyle (${num}).png`,
      alt: `Diploma frame lifestyle example ${num}`,
    };
  }
);

/**
 * Get a random diploma lifestyle image
 * Used in frame designer and product pages
 *
 * @param seed Optional seed for deterministic randomization (uses frame ID or other identifier)
 */
export function getRandomDiplomaLifestyle(seed?: string | number): string {
  let index: number;

  if (seed !== undefined) {
    const numericSeed =
      typeof seed === "string"
        ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        : seed;
    index = numericSeed % DIPLOMA_LIFESTYLE_IMAGES.length;
  } else {
    index = Math.floor(Math.random() * DIPLOMA_LIFESTYLE_IMAGES.length);
  }

  const entry = DIPLOMA_LIFESTYLE_IMAGES[index];
  return entry?.url ?? DIPLOMA_LIFESTYLE_IMAGES[0]!.url;
}
