/**
 * Graded Card Format Definitions
 *
 * Defines grading company slab dimensions and characteristics.
 * Used to inform frame sizing and production requirements.
 */

export interface CardFormat {
  id: string;
  displayName: string;
  company: string;
  cardWidth: number; // in inches
  cardHeight: number; // in inches
  slabDepth?: number; // slab depth (in inches)
  notes: string;
  category: "psa" | "other-grading" | "psa-pack-slabs";
}

/**
 * Standard graded card formats by grading company
 */
export const CARD_FORMATS: CardFormat[] = [
  {
    id: "psa",
    displayName: "PSA",
    company: "PSA",
    cardWidth: 3.0,
    cardHeight: 5.25,
    slabDepth: 0.3,
    category: "psa",
    notes: "Standard PSA graded card slab. Most common grading service for sports cards and TCG.",
  },
  {
    id: "sgc-cgc-bgs",
    displayName: "SGC | CGC | BGS",
    company: "SGC / CGC / BGS",
    cardWidth: 3.25,
    cardHeight: 5.375,
    slabDepth: 0.3,
    category: "other-grading",
    notes: "SGC, CGC, and BGS graded card slabs. Slightly taller than PSA standard.",
  },
  {
    id: "psa-pack-slabs",
    displayName: "PSA Pack Slab Frames",
    company: "PSA",
    cardWidth: 4.4,
    cardHeight: 7.4,
    slabDepth: 0.5,
    category: "psa-pack-slabs",
    notes:
      "PSA graded wax pack slabs. Larger format for vintage trading card packs (Garbage Pail Kids, baseball, etc.)",
  },
];

/**
 * Get card format by ID
 */
export function getCardFormatById(id: string): CardFormat | undefined {
  return CARD_FORMATS.find((format) => format.id === id);
}

/**
 * Get PSA format
 */
export function getPSAFormat(): CardFormat {
  const format = CARD_FORMATS[0];
  if (!format) throw new Error("CARD_FORMATS is empty");
  return format;
}

/**
 * Get other grading formats
 */
export function getOtherGradingFormats(): CardFormat[] {
  return CARD_FORMATS.filter((f) => f.category === "other-grading");
}

/**
 * Get recommended mat border for cards (default 2 inches)
 */
export const CARD_DEFAULT_MAT_BORDER = 2.0;

/**
 * Get minimum mat reveal for cards (default 0.125 inches)
 */
export const CARD_DEFAULT_MAT_REVEAL = 0.125;

/**
 * Check if format is a slabbed graded card
 */
export function isSlabbedFormat(_formatId: string): boolean {
  return true;
}
