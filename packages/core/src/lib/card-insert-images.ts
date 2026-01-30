/**
 * Graded Card Insert Image Management
 *
 * Placeholder insert images for the graded card frame designer.
 * Paths are relative to /images/card-inserts/ (or CDN base).
 */

export type CardCategory = "monsters" | "heroes" | "baseball" | "football";
export type CardFormatId = "psa" | "sgc-cgc-bgs" | "psa-pack-slabs";

export const MONSTER_CARD_IMAGES: string[] = [
  "monsters/monster-01.jpg",
  "monsters/monster-02.jpg",
  "monsters/monster-03.jpg",
  "monsters/monster-04.jpg",
  "monsters/monster-05.jpg",
  "monsters/monster-06.jpg",
  "monsters/monster-07.jpg",
  "monsters/monster-08.jpg",
  "monsters/monster-09.jpg",
  "monsters/monster-10.jpg",
  "monsters/monster-11.jpg",
  "monsters/monster-12.jpg",
  "monsters/monster-13.jpg",
  "monsters/monster-14.jpg",
  "monsters/monster-15.jpg",
  "monsters/monster-16.jpg",
  "monsters/monster-17.jpg",
  "monsters/monster-18.jpg",
  "monsters/monster-19.jpg",
  "monsters/monster-20.jpg",
];

export const HERO_CARD_IMAGES: string[] = [
  "heroes/hero-01.jpg",
  "heroes/hero-02.png",
  "heroes/hero-03.png",
  "heroes/hero-04.png",
  "heroes/hero-05.png",
  "heroes/hero-06.png",
  "heroes/hero-07.png",
  "heroes/hero-08.jpg",
  "heroes/hero-09.jpg",
  "heroes/hero-10.jpg",
  "heroes/hero-11.jpg",
  "heroes/hero-12.jpg",
  "heroes/hero-13.jpg",
  "heroes/hero-14.jpg",
  "heroes/hero-15.jpg",
  "heroes/hero-16.jpg",
  "heroes/hero-17.jpg",
  "heroes/hero-18.jpg",
  "heroes/hero-19.jpg",
  "heroes/hero-20.jpg",
];

export const BASEBALL_CARD_IMAGES: string[] = [
  "baseball/baseball-01.jpg",
  "baseball/baseball-02.jpg",
  "baseball/baseball-03.jpg",
  "baseball/baseball-04.jpg",
  "baseball/baseball-05.jpg",
  "baseball/baseball-06.jpg",
  "baseball/baseball-07.jpg",
  "baseball/baseball-08.jpg",
  "baseball/baseball-09.jpg",
  "baseball/baseball-10.jpg",
  "baseball/baseball-11.jpg",
  "baseball/baseball-12.jpg",
  "baseball/baseball-13.jpg",
  "baseball/baseball-14.jpg",
  "baseball/baseball-15.jpg",
  "baseball/baseball-16.jpg",
  "baseball/baseball-17.jpg",
  "baseball/baseball-18.jpg",
  "baseball/baseball-19.jpg",
  "baseball/baseball-20.jpg",
];

export const FOOTBALL_CARD_IMAGES: string[] = [
  "football/football-01.jpg",
  "football/football-02.jpg",
  "football/football-03.jpg",
  "football/football-04.jpg",
  "football/football-05.jpg",
  "football/football-06.jpg",
  "football/football-07.jpg",
  "football/football-08.jpg",
  "football/football-09.jpg",
  "football/football-10.jpg",
  "football/football-11.jpg",
  "football/football-12.jpg",
  "football/football-13.jpg",
  "football/football-14.jpg",
  "football/football-15.jpg",
  "football/football-16.jpg",
  "football/football-17.jpg",
  "football/football-18.jpg",
  "football/football-19.jpg",
  "football/football-20.jpg",
];

export const CARD_SETS: Record<CardCategory, string[]> = {
  monsters: MONSTER_CARD_IMAGES,
  heroes: HERO_CARD_IMAGES,
  baseball: BASEBALL_CARD_IMAGES,
  football: FOOTBALL_CARD_IMAGES,
};

export const GENERIC_PACK_SLAB_IMAGES: string[] = [
  "packs/pack-01.jpg",
  "packs/pack-02.png",
  "packs/pack-03.png",
  "packs/pack-04.jpg",
  "packs/pack-05.jpg",
  "packs/pack-06.jpg",
  "packs/pack-07.jpg",
  "packs/pack-08.jpg",
  "packs/pack-09.jpg",
  "packs/pack-10.jpg",
  "packs/pack-11.jpg",
  "packs/pack-12.jpg",
  "packs/pack-13.jpg",
  "packs/pack-14.jpg",
  "packs/pack-15.jpg",
  "packs/pack-16.jpg",
  "packs/pack-17.jpg",
  "packs/pack-18.jpg",
  "packs/pack-19.jpg",
  "packs/pack-20.jpg",
];

export function getAllCategories(): CardCategory[] {
  return ["monsters", "heroes", "baseball", "football"];
}

export function getRandomCategory(): CardCategory {
  const categories = getAllCategories();
  if (categories.length === 0) return "monsters";
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex] ?? "monsters";
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = shuffled[i]!;
    const b = shuffled[j]!;
    shuffled[i] = b;
    shuffled[j] = a;
  }
  return shuffled;
}

/**
 * Get shuffled card image paths for a format.
 * @param baseUrl - Optional base URL for images (e.g. "" for /images/card-inserts/ or CDN)
 */
export function getShuffledCardsForFormat(
  format: CardFormatId,
  category: CardCategory | null,
  count: number,
  baseUrl: string = "/images/card-inserts"
): string[] {
  if (count === 0) return [];
  let pool: string[];
  if (format === "psa-pack-slabs") {
    pool = GENERIC_PACK_SLAB_IMAGES;
  } else {
    const selectedCategory = category ?? getRandomCategory();
    pool = CARD_SETS[selectedCategory] ?? [];
  }
  if (pool.length === 0) return [];
  const shuffled = shuffleArray(pool);
  const cards: string[] = [];
  for (let i = 0; i < count; i++) {
    const rel = shuffled[i % shuffled.length];
    cards.push(baseUrl ? `${baseUrl}/${rel}` : `/${rel}`);
  }
  return cards;
}

export function getRandomizedCards(
  count: number,
  baseUrl: string = "/images/card-inserts"
): { category: CardCategory; cards: string[] } {
  const category = getRandomCategory();
  const cards = getShuffledCardsForFormat("psa", category, count, baseUrl);
  return { category, cards };
}
