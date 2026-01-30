/**
 * Magazine Size Definitions
 *
 * Defines popular magazine sizes and their dimensions.
 * Used to inform frame sizing and production requirements.
 */

export interface MagazineSize {
  id: string;
  width: number; // in inches
  height: number; // in inches
  description: string;
  category: "compact" | "standard" | "large";
}

export const MAGAZINE_SIZES: MagazineSize[] = [
  {
    id: "compact-55x75",
    width: 5.5,
    height: 7.5,
    description: "Compact digest size",
    category: "compact",
  },
  { id: "compact-7x10", width: 7, height: 10, description: "Small format", category: "compact" },
  {
    id: "standard-8x105",
    width: 8,
    height: 10.5,
    description: "Classic standard size",
    category: "standard",
  },
  {
    id: "standard-8x11",
    width: 8,
    height: 11,
    description: "Tall standard format",
    category: "standard",
  },
  {
    id: "standard-825x11",
    width: 8.25,
    height: 11,
    description: "Sports Illustrated format",
    category: "standard",
  },
  {
    id: "standard-letter",
    width: 8.5,
    height: 11,
    description: "Letter-size format",
    category: "standard",
  },
  {
    id: "standard-875x11",
    width: 8.75,
    height: 11,
    description: "Vogue format",
    category: "standard",
  },
  {
    id: "standard-9x11",
    width: 9,
    height: 11,
    description: "Wide fashion format",
    category: "standard",
  },
  {
    id: "large-10x105",
    width: 10,
    height: 10.5,
    description: "Square business format",
    category: "large",
  },
  {
    id: "large-10x12",
    width: 10,
    height: 12,
    description: "Large tabloid format",
    category: "large",
  },
  { id: "large-10x14", width: 10, height: 14, description: "W Magazine format", category: "large" },
  {
    id: "large-105x12",
    width: 10.5,
    height: 12,
    description: "Classic tabloid format",
    category: "large",
  },
  {
    id: "large-105x13",
    width: 10.5,
    height: 13,
    description: "Saturday Evening Post format",
    category: "large",
  },
  {
    id: "large-105x14",
    width: 10.5,
    height: 14,
    description: "Life magazine format",
    category: "large",
  },
  {
    id: "large-11x14",
    width: 11,
    height: 14,
    description: "Oversized tabloid format",
    category: "large",
  },
];

export function getMagazineSizeById(id: string): MagazineSize | undefined {
  return MAGAZINE_SIZES.find((size) => size.id === id);
}

export function getMagazineSizesByCategory(category: MagazineSize["category"]): MagazineSize[] {
  return MAGAZINE_SIZES.filter((size) => size.category === category);
}

export const MAGAZINE_DEFAULT_MAT_BORDER = 2.0;
export const MAGAZINE_DEFAULT_MAT_REVEAL = 0.25;
