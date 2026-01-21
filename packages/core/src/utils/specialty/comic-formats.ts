/**
 * Comic Book Format Definitions
 *
 * Defines comic book eras, their dimensions, and characteristics.
 * Used to inform frame sizing and production requirements.
 */

export interface ComicFormat {
  id: string;
  displayName: string;
  era: string;
  years: string;
  comicWidth: number; // in inches
  comicHeight: number; // in inches
  isSlabbed: boolean;
  slabDepth?: number; // for slabbed comics (in inches)
  notes: string;
  category: "raw" | "slabbed";
}

/**
 * Standard comic book formats by era and type
 */
export const COMIC_FORMATS: ComicFormat[] = [
  {
    id: "golden-age",
    displayName: "Golden Age (1938–1956)",
    era: "Golden Age",
    years: "1938–1956",
    comicWidth: 7.0,
    comicHeight: 10.25,
    isSlabbed: false,
    category: "raw",
    notes: "Early Superman, Batman, Captain America; wartime & pre-code books.",
  },
  {
    id: "silver-age",
    displayName: "Silver Age (1957–1970)",
    era: "Silver Age",
    years: "1957–1970",
    comicWidth: 6.75,
    comicHeight: 10.25,
    isSlabbed: false,
    category: "raw",
    notes: "First appearances of many Marvel characters; clean, uniform sizing.",
  },
  {
    id: "bronze-age",
    displayName: "Bronze Age (1971–1984)",
    era: "Bronze Age",
    years: "1971–1984",
    comicWidth: 6.75,
    comicHeight: 10.25,
    isSlabbed: false,
    category: "raw",
    notes: "Very similar to Silver Age sizing; more modern paper but still narrow.",
  },
  {
    id: "modern-age",
    displayName: "Modern Age (1985–Present)",
    era: "Modern Age",
    years: "1985–Present",
    comicWidth: 6.625,
    comicHeight: 10.25,
    isSlabbed: false,
    category: "raw",
    notes:
      "Current standard for most publishers. Varies slightly with cardstock covers, annuals, or limited editions.",
  },
  {
    id: "slabbed-cgc",
    displayName: "Slabbed Comic (CGC/PGX/CBCS)",
    era: "Any Era (Graded)",
    years: "All Years",
    comicWidth: 8.25,
    comicHeight: 13.0,
    isSlabbed: true,
    slabDepth: 0.75,
    category: "slabbed",
    notes: 'Professional graded slab. Includes outer case; depth varies between 0.5–0.75".',
  },
];

/**
 * Get comic format by ID
 */
export function getComicFormatById(id: string): ComicFormat | undefined {
  return COMIC_FORMATS.find((format) => format.id === id);
}

/**
 * Get raw (non-slabbed) comic formats
 */
export function getRawComicFormats(): ComicFormat[] {
  return COMIC_FORMATS.filter((f) => f.category === "raw");
}

/**
 * Get slabbed comic formats
 */
export function getSlabbedComicFormats(): ComicFormat[] {
  return COMIC_FORMATS.filter((f) => f.category === "slabbed");
}

/**
 * Check if a format is slabbed (affects depth and pricing)
 */
export function isSlabbedFormat(formatId: string): boolean {
  const format = getComicFormatById(formatId);
  return format?.isSlabbed || false;
}

/**
 * Get recommended mat border for comics (default 2 inches)
 */
export const COMIC_DEFAULT_MAT_BORDER = 2.0;

/**
 * Get minimum mat reveal for comics (default 0.25 inches)
 */
export const COMIC_DEFAULT_MAT_REVEAL = 0.25;
