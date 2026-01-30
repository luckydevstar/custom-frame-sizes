/**
 * Comic Book Cover Image Management
 *
 * Provides comic cover selection for preview rendering.
 * Images are organized by era in public/comic/inserts/
 */

/**
 * Raw comic covers (shared across all non-slabbed formats)
 * 20 images for Golden Age, Silver Age, Bronze Age, and Modern Age
 */
const RAW_COMIC_COVERS: string[] = [
  "comic-01.png",
  "comic-02.png",
  "comic-03.png",
  "comic-04.png",
  "comic-05.png",
  "comic-06.png",
  "comic-07.png",
  "comic-08.png",
  "comic-09.png",
  "comic-10.png",
  "comic-11.png",
  "comic-12.png",
  "comic-13.png",
  "comic-14.png",
  "comic-15.png",
  "comic-16.png",
  "comic-17.png",
  "comic-18.png",
  "comic-19.png",
  "comic-20.png",
];

/**
 * Gold, Silver, and Bronze Age comic covers
 * Years: 1938-1985
 */
export const GOLD_SILVER_BRONZE_COVERS: string[] = RAW_COMIC_COVERS;

/**
 * Modern Age comic covers
 * Years: 1985-Present
 */
export const MODERN_COVERS: string[] = RAW_COMIC_COVERS;

/**
 * Slabbed/Graded comic covers
 * CGC, PGX, CBCS graded comics
 * 16 images showing comics in professional grading slabs
 */
export const SLABBED_COVERS: string[] = [
  "slabbed-01.jpg",
  "slabbed-02.jpg",
  "slabbed-03.jpg",
  "slabbed-04.jpg",
  "slabbed-05.jpg",
  "slabbed-06.jpg",
  "slabbed-07.jpg",
  "slabbed-08.jpg",
  "slabbed-09.jpg",
  "slabbed-10.jpg",
  "slabbed-11.jpg",
  "slabbed-12.jpg",
  "slabbed-13.jpg",
  "slabbed-14.jpg",
  "slabbed-15.jpg",
  "slabbed-16.jpg",
];

/**
 * Get comic cover pool based on format ID
 */
export function getComicCoverPool(formatId: string): string[] {
  switch (formatId) {
    case "golden-age":
    case "silver-age":
    case "bronze-age":
      return GOLD_SILVER_BRONZE_COVERS;

    case "modern-age":
      return MODERN_COVERS;

    case "slabbed-cgc":
      return SLABBED_COVERS;

    default:
      return MODERN_COVERS;
  }
}

/**
 * Get random comic cover from era-appropriate pool
 */
export function getRandomComicCover(formatId: string, seed?: number): string {
  const pool = getComicCoverPool(formatId);

  if (pool.length === 0) {
    return "/comic/placeholder-comic.jpg";
  }

  if (seed !== undefined) {
    const index = seed % pool.length;
    return pool[index];
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Get multiple random comic covers for a layout
 */
export function getRandomComicCovers(formatId: string, count: number, baseSeed?: number): string[] {
  const pool = getComicCoverPool(formatId);

  if (pool.length === 0) {
    return Array(count).fill("/comic/placeholder-comic.jpg");
  }

  const covers: string[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < count; i++) {
    let index: number;

    if (baseSeed !== undefined) {
      index = (baseSeed + i) % pool.length;
    } else {
      do {
        index = Math.floor(Math.random() * pool.length);
      } while (usedIndices.has(index) && usedIndices.size < pool.length);
    }

    usedIndices.add(index);
    covers.push(pool[index]);
  }

  return covers;
}

/**
 * Create deterministic seed from configuration string
 */
export function createCoverSeed(configString: string): number {
  let hash = 0;
  for (let i = 0; i < configString.length; i++) {
    const char = configString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Get covers for a specific configuration
 */
export function getCoversForConfig(formatId: string, layoutId: string, count: number): string[] {
  const pool = getComicCoverPool(formatId);

  if (pool.length === 0 || count === 0) {
    return Array(count).fill("/comic/placeholder-comic.jpg");
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // All non-slabbed formats use images from the 'modern' folder
  const folder = formatId === "slabbed-cgc" ? "slabbed" : "modern";

  return selected.map((cover) => `/comic/inserts/${folder}/${cover}`);
}
