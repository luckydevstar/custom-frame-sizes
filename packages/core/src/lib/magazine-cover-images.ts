/**
 * Magazine Cover Image Management
 *
 * Provides deterministic magazine cover selection for preview rendering.
 * Returns relative paths (e.g. magazine/inserts/foo.png) for use with getSharedAssetUrl.
 */

export interface MagazineInsertSet {
  id: string;
  name: string;
  sizeId: string;
  covers: string[];
}

export const MAGAZINE_INSERT_SETS: MagazineInsertSet[] = [];

export const GENERIC_MAGAZINE_COVERS: string[] = [
  "science_today_1.png",
  "modern_times_1.png",
  "living_style_1.png",
  "lifestyle_now_1.png",
  "world_affairs_1.png",
  "ai_news_1.png",
  "health_now_1.png",
  "traveler_1.png",
  "sports_weekly_1.png",
  "sports_today_1.png",
  "hockey_today_1.png",
  "football_now_1.png",
  "basketball_today_1.png",
  "baseball_today_1.png",
  "nature_photography_1.png",
  "nature_photography_2.png",
  "space_news_1.png",
  "space_news_2.png",
];

export function getInsertSetsForSize(sizeId: string): MagazineInsertSet[] {
  return MAGAZINE_INSERT_SETS.filter((set) => set.sizeId === sizeId);
}

export function getMagazineCoverPool(): string[] {
  return GENERIC_MAGAZINE_COVERS;
}

/** Returns relative path (magazine/inserts/filename) for use with getSharedAssetUrl. */
export function getRandomMagazineCover(seed?: number): string {
  const pool = getMagazineCoverPool();
  if (pool.length === 0) return "magazine/placeholder-magazine.jpg";
  const index = seed !== undefined ? seed % pool.length : Math.floor(Math.random() * pool.length);
  return `magazine/inserts/${pool[index]}`;
}

/** Returns relative paths for use with getSharedAssetUrl. */
export function getRandomMagazineCovers(count: number, baseSeed?: number): string[] {
  const pool = getMagazineCoverPool();
  if (pool.length === 0) return Array(count).fill("magazine/placeholder-magazine.jpg");
  const covers: string[] = [];
  const usedIndices = new Set<number>();
  for (let i = 0; i < count; i++) {
    let index: number;
    if (baseSeed !== undefined) {
      index = (baseSeed + i) % pool.length;
    } else {
      if (usedIndices.size < pool.length) {
        do {
          index = Math.floor(Math.random() * pool.length);
        } while (usedIndices.has(index));
      } else {
        index = Math.floor(Math.random() * pool.length);
      }
    }
    usedIndices.add(index);
    covers.push(`magazine/inserts/${pool[index]}`);
  }
  return covers;
}

/** Returns relative paths (magazine/inserts/...) for use with getSharedAssetUrl. */
export function getCoversForConfig(sizeId: string, _layoutId: string, count: number): string[] {
  if (count === 0) return [];
  const setsForSize = getInsertSetsForSize(sizeId);
  if (setsForSize.length > 0) {
    const suitableSets = setsForSize.filter((set) => set.covers.length >= count);
    if (suitableSets.length > 0) {
      const selectedSet = suitableSets[Math.floor(Math.random() * suitableSets.length)];
      if (!selectedSet)
        return Array(count)
          .fill("magazine/placeholder-magazine.jpg")
          .map((c) => `magazine/inserts/${c}`);
      const shuffled = [...selectedSet.covers].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count).map((c) => `magazine/inserts/${c}`);
    }
    const allCoversForSize: string[] = [];
    setsForSize.forEach((set) => allCoversForSize.push(...set.covers));
    if (allCoversForSize.length >= count) {
      const shuffled = [...allCoversForSize].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count).map((c) => `magazine/inserts/${c}`);
    }
  }
  const genericPool = [...GENERIC_MAGAZINE_COVERS];
  if (genericPool.length === 0) return Array(count).fill("magazine/placeholder-magazine.jpg");
  const shuffled = genericPool.sort(() => Math.random() - 0.5);
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    selected.push(`magazine/inserts/${shuffled[i % shuffled.length]}`);
  }
  return selected;
}
