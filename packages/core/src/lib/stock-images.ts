/**
 * Stock Image Library
 * Provides access to curated family-safe local stock images
 * Supports seasonal collections that activate during specific date ranges
 *
 * NOTE: This is a factory function that accepts image data as parameters.
 * The original implementation used Vite glob imports which don't work in packages.
 *
 * Usage in app:
 * ```ts
 * import { createStockImageLibrary } from '@framecraft/core/lib/stock-images';
 *
 * const photoInserts = import.meta.glob('@assets/stock_images/photo_inserts/*.{jpg,png}', { eager: true, import: 'default' });
 * const canvasPaintings = import.meta.glob('@assets/stock_images/canvas_paintings/*.{jpg,png}', { eager: true, import: 'default' });
 * // ... other imports
 *
 * const stockImages = createStockImageLibrary({
 *   photoInserts,
 *   canvasPaintings,
 *   puzzleInserts,
 *   sonogramInserts,
 *   seasonalImages: { spring, summer, autumn, winter, valentines, easter, fathersDay, independenceDay, halloween, thanksgiving, christmas },
 *   needleworkInserts: getAllNeedleworkInsertPaths()
 * });
 * ```
 */

import { getActiveSeasonalCollections } from "./seasonal-collections";

export interface StockImageLibraryConfig {
  photoInserts: Record<string, string>;
  canvasPaintings: Record<string, string>;
  puzzleInserts: Record<string, string>;
  sonogramInserts: Record<string, string>;
  seasonalImages: {
    spring?: Record<string, string>;
    summer?: Record<string, string>;
    autumn?: Record<string, string>;
    winter?: Record<string, string>;
    valentines?: Record<string, string>;
    easter?: Record<string, string>;
    fathersDay?: Record<string, string>;
    independenceDay?: Record<string, string>;
    halloween?: Record<string, string>;
    thanksgiving?: Record<string, string>;
    christmas?: {
      photo_inserts?: Record<string, string>;
      canvas_paintings?: Record<string, string>;
      puzzle_inserts?: Record<string, string>;
    };
  };
  needleworkInserts?: string[];
}

export interface StockImageLibrary {
  getRandomStockImage: (
    seed?: string | number,
    subfolder?: "photo_inserts" | "canvas_paintings"
  ) => string;
  getRandomStockImages: (count: number, unique?: boolean) => string[];
  getAllStockImages: () => string[];
  getStockImageCount: () => number;
  getRandomPuzzleImage: (seed?: string | number) => string;
  getAllPuzzleImages: () => string[];
  getRandomDiplomaImage: (seed?: string | number) => string;
  getAllDiplomaImages: () => string[];
  getRandomNeedleworkImage: (seed?: string | number) => string;
  getAllNeedleworkImages: () => string[];
  getNeedleworkImageCount: () => number;
  getRandomSonogramImage: (seed?: string | number) => string;
  getAllSonogramImages: () => string[];
  getSonogramImageCount: () => number;
}

/**
 * Create a stock image library instance with provided image data
 */
export function createStockImageLibrary(config: StockImageLibraryConfig): StockImageLibrary {
  const {
    photoInserts,
    canvasPaintings,
    puzzleInserts,
    sonogramInserts,
    seasonalImages,
    needleworkInserts = [],
  } = config;

  // Map seasonal folder names to their imported images
  const seasonalImageMap: Record<
    string,
    {
      photo_inserts: Record<string, string>;
      canvas_paintings: Record<string, string>;
      puzzle_inserts: Record<string, string>;
    }
  > = {
    spring: {
      photo_inserts: seasonalImages.spring || {},
      canvas_paintings: {},
      puzzle_inserts: {},
    },
    summer: {
      photo_inserts: seasonalImages.summer || {},
      canvas_paintings: {},
      puzzle_inserts: {},
    },
    autumn: {
      photo_inserts: seasonalImages.autumn || {},
      canvas_paintings: {},
      puzzle_inserts: {},
    },
    winter: {
      photo_inserts: seasonalImages.winter || {},
      canvas_paintings: {},
      puzzle_inserts: {},
    },
    valentines: {
      photo_inserts: seasonalImages.valentines || {},
      canvas_paintings: {},
      puzzle_inserts: {},
    },
    easter: {
      photo_inserts: seasonalImages.easter || {},
      canvas_paintings: {},
      puzzle_inserts: {},
    },
    fathers_day: {
      photo_inserts: seasonalImages.fathersDay || {},
      canvas_paintings: {},
      puzzle_inserts: {},
    },
    independence_day: {
      photo_inserts: seasonalImages.independenceDay || {},
      canvas_paintings: {},
      puzzle_inserts: {},
    },
    halloween: {
      photo_inserts: seasonalImages.halloween || {},
      canvas_paintings: {},
      puzzle_inserts: {},
    },
    thanksgiving: {
      photo_inserts: seasonalImages.thanksgiving || {},
      canvas_paintings: {},
      puzzle_inserts: {},
    },
    christmas: {
      photo_inserts: seasonalImages.christmas?.photo_inserts || {},
      canvas_paintings: seasonalImages.christmas?.canvas_paintings || {},
      puzzle_inserts: seasonalImages.christmas?.puzzle_inserts || {},
    },
  };

  /**
   * Get the combined image pool including active seasonal images
   */
  function getCombinedImagePool(
    category: "photo_inserts" | "canvas_paintings" | "puzzle_inserts"
  ): string[] {
    // Start with base images
    const baseImages =
      category === "canvas_paintings"
        ? Object.values(canvasPaintings)
        : category === "puzzle_inserts"
          ? Object.values(puzzleInserts)
          : Object.values(photoInserts);

    // Get active seasonal collections
    const activeSeasons = getActiveSeasonalCollections();

    // Add seasonal images if any seasons are active
    if (activeSeasons.length === 0) {
      return baseImages;
    }

    // Merge seasonal images with base images
    const seasonalImages: string[] = [];
    for (const season of activeSeasons) {
      // Only include if this season supports this category
      if (season.categories.includes(category)) {
        const seasonImages = seasonalImageMap[season.folder]?.[category];
        if (seasonImages) {
          seasonalImages.push(...Object.values(seasonImages));
        }
      }
    }

    return [...baseImages, ...seasonalImages];
  }

  // Cache the combined pools (recalculated on each page load)
  const photoInsertImages = getCombinedImagePool("photo_inserts");
  const canvasImages = getCombinedImagePool("canvas_paintings");
  const puzzleInsertImages = getCombinedImagePool("puzzle_inserts");
  const sonogramInsertImages = Object.values(sonogramInserts);

  /**
   * Get a random stock image from the library
   * Automatically includes active seasonal images
   */
  function getRandomStockImage(
    seed?: string | number,
    subfolder?: "photo_inserts" | "canvas_paintings"
  ): string {
    const imagePool = subfolder === "canvas_paintings" ? canvasImages : photoInsertImages;

    if (seed !== undefined) {
      // Deterministic selection based on seed
      const seedNum =
        typeof seed === "string"
          ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
          : seed;
      const index = seedNum % imagePool.length;
      return imagePool[index];
    }

    // Random selection
    const randomIndex = Math.floor(Math.random() * imagePool.length);
    return imagePool[randomIndex];
  }

  /**
   * Get multiple random stock images
   */
  function getRandomStockImages(count: number, unique: boolean = true): string[] {
    if (!unique) {
      return Array.from({ length: count }, () => getRandomStockImage());
    }

    // Shuffle array and take first N items
    const shuffled = [...photoInsertImages].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, photoInsertImages.length));
  }

  /**
   * Get all available stock images (photo inserts)
   */
  function getAllStockImages(): string[] {
    return [...photoInsertImages];
  }

  /**
   * Get the total count of available stock images (photo inserts)
   */
  function getStockImageCount(): number {
    return photoInsertImages.length;
  }

  /**
   * Get random puzzle insert image
   */
  function getRandomPuzzleImage(seed?: string | number): string {
    if (puzzleInsertImages.length === 0) {
      return getRandomStockImage(seed);
    }

    if (seed !== undefined) {
      const seedNum =
        typeof seed === "string"
          ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
          : seed;
      const index = seedNum % puzzleInsertImages.length;
      return puzzleInsertImages[index];
    }

    const randomIndex = Math.floor(Math.random() * puzzleInsertImages.length);
    return puzzleInsertImages[randomIndex];
  }

  /**
   * Get all puzzle insert images
   */
  function getAllPuzzleImages(): string[] {
    return [...puzzleInsertImages];
  }

  /**
   * Get random diploma/certificate insert image
   */
  function getRandomDiplomaImage(seed?: string | number): string {
    const diplomaImages = photoInsertImages.filter((img) => img.includes("diploma_"));

    if (diplomaImages.length === 0) {
      return getRandomStockImage(seed);
    }

    if (seed !== undefined) {
      const seedNum =
        typeof seed === "string"
          ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
          : seed;
      const index = seedNum % diplomaImages.length;
      return diplomaImages[index];
    }

    const randomIndex = Math.floor(Math.random() * diplomaImages.length);
    return diplomaImages[randomIndex];
  }

  /**
   * Get all diploma insert images
   */
  function getAllDiplomaImages(): string[] {
    return photoInsertImages.filter((img) => img.includes("diploma_"));
  }

  /**
   * Get random needlework insert image
   */
  function getRandomNeedleworkImage(seed?: string | number): string {
    if (needleworkInserts.length === 0) {
      return getRandomStockImage(seed);
    }

    if (seed !== undefined) {
      const seedNum =
        typeof seed === "string"
          ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
          : seed;
      const index = seedNum % needleworkInserts.length;
      return needleworkInserts[index];
    }

    const randomIndex = Math.floor(Math.random() * needleworkInserts.length);
    return needleworkInserts[randomIndex];
  }

  /**
   * Get all needlework insert images
   */
  function getAllNeedleworkImages(): string[] {
    return [...needleworkInserts];
  }

  /**
   * Get needlework image count
   */
  function getNeedleworkImageCount(): number {
    return needleworkInserts.length;
  }

  /**
   * Get random sonogram insert image
   */
  function getRandomSonogramImage(seed?: string | number): string {
    if (sonogramInsertImages.length === 0) {
      return getRandomStockImage(seed);
    }

    if (seed !== undefined) {
      const seedNum =
        typeof seed === "string"
          ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
          : seed;
      const index = seedNum % sonogramInsertImages.length;
      return sonogramInsertImages[index];
    }

    const randomIndex = Math.floor(Math.random() * sonogramInsertImages.length);
    return sonogramInsertImages[randomIndex];
  }

  /**
   * Get all sonogram insert images
   */
  function getAllSonogramImages(): string[] {
    return [...sonogramInsertImages];
  }

  /**
   * Get sonogram image count
   */
  function getSonogramImageCount(): number {
    return sonogramInsertImages.length;
  }

  return {
    getRandomStockImage,
    getRandomStockImages,
    getAllStockImages,
    getStockImageCount,
    getRandomPuzzleImage,
    getAllPuzzleImages,
    getRandomDiplomaImage,
    getAllDiplomaImages,
    getRandomNeedleworkImage,
    getAllNeedleworkImages,
    getNeedleworkImageCount,
    getRandomSonogramImage,
    getAllSonogramImages,
    getSonogramImageCount,
  };
}
