/**
 * CD Lifestyle Images - Used for breakup photos and carousels on CD frames page.
 * Images live under shared_assets: cd/lifestyle/
 * Naming: cd-frame-lifestyle-1.jpg ... cd-frame-lifestyle-55.jpg
 * Consumers should use getSharedAssetUrl(url) when using as img src.
 */

const CD_LIFESTYLE_COUNT = 55;
const BASE_PATH = "cd/lifestyle/cd-frame-lifestyle";

/**
 * Get CD lifestyle image path by index (1-based). Use getSharedAssetUrl(result) for img src.
 */
export function getCDLifestyleImageUrl(index: number): string {
  if (index < 1 || index > CD_LIFESTYLE_COUNT) {
    return `${BASE_PATH}-1.jpg`;
  }
  return `${BASE_PATH}-${index}.jpg`;
}

/**
 * Get N random CD lifestyle image URLs (for breakup photos or carousel).
 * Uses Fisher-Yates shuffle over indices 1..55.
 */
export function getRandomizedCDLifestyleImages(
  count: number = 4
): Array<{ url: string; index: number }> {
  const indices = Array.from({ length: CD_LIFESTYLE_COUNT }, (_, i) => i + 1);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = indices[i]!;
    const b = indices[j]!;
    indices[i] = b;
    indices[j] = a;
  }
  return indices.slice(0, count).map((index) => ({
    url: getCDLifestyleImageUrl(index),
    index,
  }));
}
