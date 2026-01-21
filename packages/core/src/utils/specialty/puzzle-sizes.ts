/**
 * Jigsaw Puzzle Size Configurations
 * Standard puzzle sizes with piece counts and dimensions
 */

export interface PuzzleSize {
  id: string;
  pieces: number;
  pieceLabel: string; // e.g., "100", "1000 panoramic"
  width: number; // inches
  height: number; // inches
  diameter?: number; // For round puzzles only (inches)
  isRound: boolean;
  isPanoramic: boolean;
  isSquare: boolean;
  category: "standard" | "panoramic" | "square" | "round";
  aspectRatio: number;
  label: string; // Display label: "1000 pieces — 27" × 20""
}

/**
 * All standard puzzle sizes parsed from specification
 */
export const PUZZLE_SIZES: PuzzleSize[] = [
  // Standard sizes
  {
    id: "puzzle-100",
    pieces: 100,
    pieceLabel: "100",
    width: 14.25,
    height: 10.25,
    isRound: false,
    isPanoramic: false,
    isSquare: false,
    category: "standard",
    aspectRatio: 14.25 / 10.25,
    label: '100 pieces — 14.25" × 10.25"',
  },
  {
    id: "puzzle-150",
    pieces: 150,
    pieceLabel: "150",
    width: 14.25,
    height: 10.25,
    isRound: false,
    isPanoramic: false,
    isSquare: false,
    category: "standard",
    aspectRatio: 14.25 / 10.25,
    label: '150 pieces — 14.25" × 10.25"',
  },
  {
    id: "puzzle-200",
    pieces: 200,
    pieceLabel: "200",
    width: 19.25,
    height: 14.25,
    isRound: false,
    isPanoramic: false,
    isSquare: false,
    category: "standard",
    aspectRatio: 19.25 / 14.25,
    label: '200 pieces — 19.25" × 14.25"',
  },
  {
    id: "puzzle-300",
    pieces: 300,
    pieceLabel: "300",
    width: 18,
    height: 24,
    isRound: false,
    isPanoramic: false,
    isSquare: false,
    category: "standard",
    aspectRatio: 18 / 24,
    label: '300 pieces — 18" × 24"',
  },
  {
    id: "puzzle-500",
    pieces: 500,
    pieceLabel: "500",
    width: 19.25,
    height: 14.25,
    isRound: false,
    isPanoramic: false,
    isSquare: false,
    category: "standard",
    aspectRatio: 19.25 / 14.25,
    label: '500 pieces — 19.25" × 14.25"',
  },
  {
    id: "puzzle-750",
    pieces: 750,
    pieceLabel: "750",
    width: 24,
    height: 18,
    isRound: false,
    isPanoramic: false,
    isSquare: false,
    category: "standard",
    aspectRatio: 24 / 18,
    label: '750 pieces — 24" × 18"',
  },
  {
    id: "puzzle-1000",
    pieces: 1000,
    pieceLabel: "1000",
    width: 27,
    height: 20,
    isRound: false,
    isPanoramic: false,
    isSquare: false,
    category: "standard",
    aspectRatio: 27 / 20,
    label: '1000 pieces — 27" × 20"',
  },
  {
    id: "puzzle-1500",
    pieces: 1500,
    pieceLabel: "1500",
    width: 32,
    height: 24,
    isRound: false,
    isPanoramic: false,
    isSquare: false,
    category: "standard",
    aspectRatio: 32 / 24,
    label: '1500 pieces — 32" × 24"',
  },
  {
    id: "puzzle-2000",
    pieces: 2000,
    pieceLabel: "2000",
    width: 39,
    height: 27,
    isRound: false,
    isPanoramic: false,
    isSquare: false,
    category: "standard",
    aspectRatio: 39 / 27,
    label: '2000 pieces — 39" × 27"',
  },

  // Panoramic sizes
  {
    id: "puzzle-500-panoramic",
    pieces: 500,
    pieceLabel: "500 panoramic",
    width: 26,
    height: 9,
    isRound: false,
    isPanoramic: true,
    isSquare: false,
    category: "panoramic",
    aspectRatio: 26 / 9,
    label: '500 pieces (panoramic) — 26" × 9"',
  },
  {
    id: "puzzle-750-panoramic",
    pieces: 750,
    pieceLabel: "750 panoramic",
    width: 37,
    height: 12,
    isRound: false,
    isPanoramic: true,
    isSquare: false,
    category: "panoramic",
    aspectRatio: 37 / 12,
    label: '750 pieces (panoramic) — 37" × 12"',
  },
  {
    id: "puzzle-1000-panoramic",
    pieces: 1000,
    pieceLabel: "1000 panoramic",
    width: 39,
    height: 13,
    isRound: false,
    isPanoramic: true,
    isSquare: false,
    category: "panoramic",
    aspectRatio: 39 / 13,
    label: '1000 pieces (panoramic) — 39" × 13"',
  },

  // Square sizes
  {
    id: "puzzle-500-square",
    pieces: 500,
    pieceLabel: "500 square",
    width: 21,
    height: 21,
    isRound: false,
    isPanoramic: false,
    isSquare: true,
    category: "square",
    aspectRatio: 1,
    label: '500 pieces (square) — 21" × 21"',
  },
  {
    id: "puzzle-1000-square",
    pieces: 1000,
    pieceLabel: "1000 square",
    width: 25,
    height: 25,
    isRound: false,
    isPanoramic: false,
    isSquare: true,
    category: "square",
    aspectRatio: 1,
    label: '1000 pieces (square) — 25" × 25"',
  },

  // Round sizes (diameter specified)
  {
    id: "puzzle-500-round",
    pieces: 500,
    pieceLabel: "500 round",
    width: 25,
    height: 25,
    diameter: 25,
    isRound: true,
    isPanoramic: false,
    isSquare: false,
    category: "round",
    aspectRatio: 1,
    label: '500 pieces (round) — 25" diameter',
  },
  {
    id: "puzzle-1000-round",
    pieces: 1000,
    pieceLabel: "1000 round",
    width: 27,
    height: 27,
    diameter: 27,
    isRound: true,
    isPanoramic: false,
    isSquare: false,
    category: "round",
    aspectRatio: 1,
    label: '1000 pieces (round) — 27" diameter',
  },
];

/**
 * Get puzzle sizes grouped by category
 */
export function getPuzzleSizesByCategory() {
  return {
    standard: PUZZLE_SIZES.filter((p) => p.category === "standard"),
    panoramic: PUZZLE_SIZES.filter((p) => p.category === "panoramic"),
    square: PUZZLE_SIZES.filter((p) => p.category === "square"),
    round: PUZZLE_SIZES.filter((p) => p.category === "round"),
  };
}

/**
 * Get puzzle size by ID
 */
export function getPuzzleSizeById(id: string): PuzzleSize | undefined {
  return PUZZLE_SIZES.find((p) => p.id === id);
}

/**
 * Get puzzle sizes by piece count
 */
export function getPuzzleSizesByPieces(pieces: number): PuzzleSize[] {
  return PUZZLE_SIZES.filter((p) => p.pieces === pieces);
}
