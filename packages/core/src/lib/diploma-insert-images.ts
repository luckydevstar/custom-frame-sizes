/**
 * Diploma Insert Images - Placeholder images for diploma/certificate frame designer
 *
 * These images serve as placeholder diploma examples in the frame designer.
 * They help users visualize how their diploma will look in the custom frame.
 *
 * Images are stored in app public: /diploma/inserts/
 * Naming convention: diploma_insert_1.jpg, diploma_insert_2.jpg, ... diploma_insert_24.jpg
 */

export interface DiplomaInsertImage {
  url: string;
  alt: string;
}

/**
 * Array of 24 diploma insert image paths
 */
export const DIPLOMA_INSERT_IMAGES: DiplomaInsertImage[] = Array.from(
  { length: 24 },
  (_, index) => {
    const num = index + 1;
    return {
      url: `/diploma/inserts/diploma_insert_${num}.jpg`,
      alt: `Diploma insert placeholder ${num}`,
    };
  }
);

/**
 * Get a random diploma insert image
 * Used as placeholder in the frame designer
 *
 * @param seed Optional seed for deterministic randomization (uses frame ID or other identifier)
 */
export function getRandomDiplomaInsert(seed?: string | number): string {
  let index: number;

  if (seed !== undefined) {
    const numericSeed =
      typeof seed === "string"
        ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        : seed;
    index = numericSeed % DIPLOMA_INSERT_IMAGES.length;
  } else {
    index = Math.floor(Math.random() * DIPLOMA_INSERT_IMAGES.length);
  }

  const entry = DIPLOMA_INSERT_IMAGES[index];
  return entry?.url ?? DIPLOMA_INSERT_IMAGES[0]!.url;
}
