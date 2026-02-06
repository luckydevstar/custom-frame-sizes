/**
 * Photo Collage Frame Layout Definitions
 *
 * Defines layout configurations for multi-opening photo collage frames.
 * Supports multiple categories: Simple Grids, Mixed Orientation, Asymmetric/Gallery,
 * Creative Shapes, Single Openings, Specialty Shapes, School & Memory, Signature & Wedding
 *
 * Coordinate system:
 *  - All opening x/y are measured from the FRAME INTERIOR top-left
 *    (after subtracting frame molding which is typically 1.0").
 *  - frameWidth/frameHeight represent the OUTER frame dimensions.
 *  - The actual interior space is frameWidth - (2 × FRAME_MOLDING_WIDTH).
 *
 * Layout Philosophy:
 *  - Every layout should maximize photo coverage with minimal white space
 *  - Standard mat border of 2" on outer edges
 *  - 0.5" spacing between adjacent openings
 *  - All layouts are tight and visually balanced
 */

/** Default frame molding width (inches). */
export const DEFAULT_FRAME_MOLDING_WIDTH = 1.0;

/** Standard photo dimensions in inches (width x height for landscape orientation) */
export const PHOTO_SIZES = {
  "4x6": { width: 6, height: 4, displayName: '4×6"' },
  "5x7": { width: 7, height: 5, displayName: '5×7"' },
  "8x10": { width: 10, height: 8, displayName: '8×10"' },
  "11x14": { width: 14, height: 11, displayName: '11×14"' },
  "16x20": { width: 20, height: 16, displayName: '16×20"' },
} as const;

export type PhotoSizeId = keyof typeof PHOTO_SIZES;

/** Filter size options for layout filtering (includes standard sizes plus square) */
export type FilterSizeId = "4x6" | "5x7" | "8x10" | "11x14" | "16x20" | "square";

export const FILTER_SIZES: Record<FilterSizeId, { displayName: string; description: string }> = {
  "4x6": { displayName: '4×6"', description: "Standard snapshot size" },
  "5x7": { displayName: '5×7"', description: "Portrait size" },
  "8x10": { displayName: '8×10"', description: "Large portrait size" },
  "11x14": { displayName: '11×14"', description: "Large artwork size" },
  "16x20": { displayName: '16×20"', description: "Extra large size" },
  square: { displayName: "Square", description: "Square photos (4×4, 8×8)" },
};

/** Opening shape options */
export type OpeningShape = "rectangle" | "circle" | "oval" | "heart" | "paw" | "hexagon";

/** Layout category for filtering */
export type CollageCategory =
  | "simple-grids"
  | "mixed-orientation"
  | "asymmetric-gallery"
  | "creative-shapes"
  | "single-openings"
  | "specialty-shapes"
  | "school-memory";

/** Standard mat border for collage frames */
export const COLLAGE_MAT_BORDER = 2.0;

/** Spacing between openings in multi-opening layouts */
export const COLLAGE_SPACING = 0.5;

/** Frame height extension when brass nameplate is enabled (inches) */
export const PLAQUE_FRAME_EXTENSION = 0.75;

/** Layout family identifiers for grouping related size variants */
export type LayoutFamilyId =
  | "two-portrait"
  | "three-portrait-row"
  | "four-portrait-row"
  | "four-grid"
  | "six-grid"
  | "nine-grid"
  | "twelve-grid"
  | "two-mixed"
  | "four-mixed"
  | "six-mixed-grid"
  | "three-mixed"
  | "three-wide"
  | "triple-column"
  | "three-oval"
  | "bottom-weighted"
  | "three-circle"
  | "four-circle"
  | "fifteen-photo"
  | "fifteen-photo-compact"
  | "instagram-grid";

/** Variant size identifier for family-based layouts */
export type VariantSizeId = "4x6" | "5x7" | "8x10" | "11x14" | "16x20";

export type CollageLayoutType =
  // Simple Grids
  | "2-grid"
  | "3-grid-horizontal"
  // Three Portrait Row Family Variants
  | "3-row-4x6"
  | "3-row-5x7"
  | "3-row-8x10"
  | "3-row-11x14"
  // Four Portrait Row Family Variants
  | "4-row-4x6"
  | "4-row-5x7"
  | "4-row-8x10"
  // Four Grid Family Variants (2×2)
  | "4-grid-4x6"
  | "4-grid" // 5×7 hero
  | "4-grid-8x10"
  | "4-grid-11x14"
  // Six Grid Family Variants (2×3)
  | "6-grid-4x6"
  | "6-grid" // 5×7 hero
  | "6-grid-8x10"
  // Nine Grid Family Variants (3×3)
  | "9-grid" // 4×6 hero
  | "9-grid-5x7"
  | "9-grid-8x10"
  // Twelve Grid Family Variants (3×4)
  | "12-grid" // 4×6 hero
  | "12-grid-5x7"
  // Two Mixed Family Variants
  | "2-mixed-4x6"
  | "2-mixed" // 5×7 hero
  | "2-mixed-8x10"
  | "2-mixed-11x14"
  // Four Mixed Family Variants (2×2 landscapes)
  | "4-mixed-4x6"
  | "4-mixed" // 5×7 hero
  | "4-mixed-8x10"
  | "4-mixed-11x14"
  // Six Mixed Grid Family Variants
  | "6-mixed-grid" // 4×6 hero
  | "6-mixed-grid-5x7"
  | "6-mixed-grid-8x10"
  // Three Mixed Family Variants
  | "3-mixed" // 8×10 + 5×7 hero
  | "3-mixed-8x10-4x6" // 8×10 + 4×6
  | "3-mixed-11x14-8x10" // 11×14 + 8×10
  // Two Portrait Family Variants
  | "2-portrait-4x6"
  | "2-portrait-8x10"
  | "2-portrait-11x14"
  | "2-portrait-16x20"
  // Mixed Orientation
  | "2-mixed"
  | "3-mixed"
  | "4-mixed"
  | "6-mixed-grid"
  // Three Wide (Landscape Row) Family Variants
  | "triple-row-4x6"
  | "triple-row-5x7"
  | "triple-row" // 8×10 hero
  | "triple-row-11x14"
  // Triple Column Family Variants
  | "triple-column-4x6"
  | "triple-column" // 5×7 hero
  | "triple-column-8x10"
  // Asymmetric/Gallery
  | "1-large-2-small"
  | "2-large-4-small"
  // Creative Shapes
  | "3-circles-4x4"
  | "3-circles" // 5" hero
  | "3-circles-8x8"
  | "4-circles-4x4"
  | "4-circles" // 5" hero
  | "4-circles-8x8"
  | "3-ovals-4x6"
  | "3-ovals-5x7"
  | "3-ovals-8x10"
  | "beehive"
  // Single Openings / Bottom Weighted Family
  | "weight-bottom-4x6"
  | "weight-bottom-5x7"
  | "weight-bottom" // 8×10 hero
  | "weight-bottom-11x14"
  | "weight-bottom-16x20"
  // Multi-Opening Grids
  | "15-photo"
  | "15-photo-5x7"
  | "15-photo-compact"
  | "15-photo-compact-5x7"
  | "instagram-square"
  | "instagram-square-16"
  | "instagram-square-25"
  | "center-large-6-small"
  | "1-large-5-small"
  | "center-focus"
  // School & Memory
  | "school-days"
  | "k12-school-years";

export interface CollageOpening {
  x: number; // Position from frame interior top-left (inches)
  y: number; // Position from frame interior top-left (inches)
  width: number; // Opening width (inches)
  height: number; // Opening height (inches)
  shape: OpeningShape; // Shape of the opening
  orientation: "landscape" | "portrait" | "square"; // Photo orientation
  zIndex?: number; // Stacking order: higher = front
}

export interface CollageLayout {
  id: CollageLayoutType;
  name: string;
  description: string;
  category: CollageCategory;
  frameWidth: number; // Total outer frame size (inches)
  frameHeight: number; // Total outer frame size (inches)
  openingCount: number; // Number of photo openings
  openings: CollageOpening[];
  recommendedFor: string[];
  defaultPhotoSize: PhotoSizeId; // Suggested photo size for this layout
  photoSizeLabel?: string; // Optional custom label for mixed photo sizes (e.g., "5×7 & 8×10")
  supportedSizes: FilterSizeId[]; // Size filter IDs this layout matches (for filtering)
  familyId?: LayoutFamilyId; // Links to a layout family for size variants
  variantSize?: VariantSizeId; // The specific size variant this layout represents
}

/**
 * All collage layout configurations
 * Frame sizes calculated to fit within max 32×40" or 40×32" mat board
 *
 * Layout math for tight spacing:
 *  - Interior = frameWidth - 2" (1" molding each side)
 *  - Content area = interior - 4" (2" mat border each side)
 *  - Opening spacing = 0.5" between adjacent openings
 */
export const COLLAGE_LAYOUTS: CollageLayout[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // SIMPLE GRIDS - Uniform rectangular openings in tight grid patterns
  // ═══════════════════════════════════════════════════════════════════════
  // ─────────────────────────────────────────────────────────────────────────
  // TWO PORTRAIT FAMILY - Same layout in multiple photo sizes
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "2-portrait-4x6",
    name: "2 Portraits",
    description: "Two portrait photos side by side",
    category: "simple-grids",
    frameWidth: 14.5,
    frameHeight: 12.0,
    openingCount: 2,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "two-portrait",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Couples", "Before & after", "Parent & child", "Best friends"],
  },
  {
    id: "2-grid",
    name: "2 Portraits",
    description: "Two portrait photos side by side",
    category: "simple-grids",
    frameWidth: 16.5,
    frameHeight: 13.0,
    openingCount: 2,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "two-portrait",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Couples", "Before & after", "Parent & child", "Best friends"],
  },
  {
    id: "2-portrait-8x10",
    name: "2 Portraits",
    description: "Two portrait photos side by side",
    category: "simple-grids",
    frameWidth: 22.5,
    frameHeight: 16.0,
    openingCount: 2,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "two-portrait",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Couples", "Before & after", "Parent & child", "Best friends"],
  },
  {
    id: "2-portrait-11x14",
    name: "2 Portraits",
    description: "Two portrait photos side by side",
    category: "simple-grids",
    frameWidth: 28.5,
    frameHeight: 20.0,
    openingCount: 2,
    defaultPhotoSize: "8x10",
    supportedSizes: ["11x14"],
    familyId: "two-portrait",
    variantSize: "11x14",
    openings: [
      { x: 2.0, y: 2.0, width: 11, height: 14, shape: "rectangle", orientation: "portrait" },
      { x: 13.5, y: 2.0, width: 11, height: 14, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Couples", "Before & after", "Parent & child", "Best friends"],
  },
  {
    id: "2-portrait-16x20",
    name: "2 Portraits",
    description: "Two portrait photos side by side",
    category: "simple-grids",
    frameWidth: 38.5,
    frameHeight: 26.0,
    openingCount: 2,
    defaultPhotoSize: "8x10",
    supportedSizes: ["16x20"],
    familyId: "two-portrait",
    variantSize: "16x20",
    openings: [
      { x: 2.0, y: 2.0, width: 16, height: 20, shape: "rectangle", orientation: "portrait" },
      { x: 18.5, y: 2.0, width: 16, height: 20, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Couples", "Before & after", "Parent & child", "Best friends"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // THREE PORTRAIT ROW FAMILY - Same layout in multiple photo sizes
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "3-row-4x6",
    name: "3 Portraits",
    description: "Three portrait photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 19.0,
    frameHeight: 12.0,
    openingCount: 3,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "three-portrait-row",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 11.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Growing family", "Three generations", "Best memories", "Pet trio"],
  },
  {
    id: "3-grid-horizontal",
    name: "3 Portraits",
    description: "Three portrait photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 22.0,
    frameHeight: 13.0,
    openingCount: 3,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "three-portrait-row",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 13.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Growing family", "Three generations", "Best memories", "Pet trio"],
  },
  {
    id: "3-row-8x10",
    name: "3 Portraits",
    description: "Three portrait photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 31.0,
    frameHeight: 16.0,
    openingCount: 3,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "three-portrait-row",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 19.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Growing family", "Three generations", "Best memories", "Pet trio"],
  },
  {
    id: "3-row-11x14",
    name: "3 Portraits",
    description: "Three portrait photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 40.0,
    frameHeight: 20.0,
    openingCount: 3,
    defaultPhotoSize: "11x14",
    supportedSizes: ["11x14"],
    familyId: "three-portrait-row",
    variantSize: "11x14",
    openings: [
      { x: 2.0, y: 2.0, width: 11, height: 14, shape: "rectangle", orientation: "portrait" },
      { x: 13.5, y: 2.0, width: 11, height: 14, shape: "rectangle", orientation: "portrait" },
      { x: 25.0, y: 2.0, width: 11, height: 14, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Growing family", "Three generations", "Best memories", "Pet trio"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // FOUR PORTRAIT ROW FAMILY - Same layout in multiple photo sizes
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "4-row-4x6",
    name: "4 Portraits",
    description: "Four portrait photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 23.5,
    frameHeight: 12.0,
    openingCount: 4,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "four-portrait-row",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 11.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 15.5, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Four seasons", "Quarterly milestones", "Family of four", "Pet quartet"],
  },
  {
    id: "4-row-5x7",
    name: "4 Portraits",
    description: "Four portrait photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 27.5,
    frameHeight: 13.0,
    openingCount: 4,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "four-portrait-row",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 13.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 18.5, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Four seasons", "Quarterly milestones", "Family of four", "Pet quartet"],
  },
  {
    id: "4-row-8x10",
    name: "4 Portraits",
    description: "Four portrait photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 39.5,
    frameHeight: 16.0,
    openingCount: 4,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "four-portrait-row",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 19.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 27.5, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Four seasons", "Quarterly milestones", "Family of four", "Pet quartet"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // FOUR GRID FAMILY (2×2) - Same layout in multiple photo sizes
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "4-grid-4x6",
    name: "4 Photo Grid",
    description: "Four portrait photos in a 2×2 grid",
    category: "simple-grids",
    frameWidth: 14.5,
    frameHeight: 18.5,
    openingCount: 4,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "four-grid",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Family of four", "Seasons", "Vacation highlights", "Pet portraits"],
  },
  {
    id: "4-grid",
    name: "4 Photo Grid",
    description: "Four portrait photos in a 2×2 grid",
    category: "simple-grids",
    frameWidth: 16.5,
    frameHeight: 20.5,
    openingCount: 4,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "four-grid",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Family of four", "Seasons", "Vacation highlights", "Pet portraits"],
  },
  {
    id: "4-grid-8x10",
    name: "4 Photo Grid",
    description: "Four portrait photos in a 2×2 grid",
    category: "simple-grids",
    frameWidth: 22.5,
    frameHeight: 26.5,
    openingCount: 4,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "four-grid",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 12.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 12.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Family of four", "Seasons", "Vacation highlights", "Pet portraits"],
  },
  {
    id: "4-grid-11x14",
    name: "4 Photo Grid",
    description: "Four portrait photos in a 2×2 grid",
    category: "simple-grids",
    frameWidth: 28.5,
    frameHeight: 34.5,
    openingCount: 4,
    defaultPhotoSize: "11x14",
    supportedSizes: ["11x14"],
    familyId: "four-grid",
    variantSize: "11x14",
    openings: [
      { x: 2.0, y: 2.0, width: 11, height: 14, shape: "rectangle", orientation: "portrait" },
      { x: 13.5, y: 2.0, width: 11, height: 14, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 16.5, width: 11, height: 14, shape: "rectangle", orientation: "portrait" },
      { x: 13.5, y: 16.5, width: 11, height: 14, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Family of four", "Seasons", "Vacation highlights", "Pet portraits"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // SIX GRID FAMILY (2×3) - Same layout in multiple photo sizes
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "6-grid-4x6",
    name: "6 Photo Grid",
    description: "Six portrait photos in a 2×3 grid",
    category: "simple-grids",
    frameWidth: 14.5,
    frameHeight: 25.0,
    openingCount: 6,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "six-grid",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 15.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 15.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Half-year highlights", "Wedding party", "Extended family", "Travel memories"],
  },
  {
    id: "6-grid",
    name: "6 Photo Grid",
    description: "Six portrait photos in a 2×3 grid",
    category: "simple-grids",
    frameWidth: 16.5,
    frameHeight: 28.0,
    openingCount: 6,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "six-grid",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 17.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 17.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Half-year highlights", "Wedding party", "Extended family", "Travel memories"],
  },
  {
    id: "6-grid-8x10",
    name: "6 Photo Grid",
    description: "Six portrait photos in a 2×3 grid",
    category: "simple-grids",
    frameWidth: 22.5,
    frameHeight: 37.0,
    openingCount: 6,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "six-grid",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 12.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 12.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 23.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 23.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Half-year highlights", "Wedding party", "Extended family", "Travel memories"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // NINE GRID FAMILY (3×3) - Same layout in multiple photo sizes
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "9-grid",
    name: "9 Photo Grid",
    description: "Nine portrait photos in a 3×3 grid",
    category: "simple-grids",
    frameWidth: 19.0,
    frameHeight: 25.0,
    openingCount: 9,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "nine-grid",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 11.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 11.0, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 15.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 15.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 11.0, y: 15.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Year in review", "Large family", "Instagram grid", "Monthly milestones"],
  },
  {
    id: "9-grid-5x7",
    name: "9 Photo Grid",
    description: "Nine portrait photos in a 3×3 grid",
    category: "simple-grids",
    frameWidth: 22.0,
    frameHeight: 28.0,
    openingCount: 9,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "nine-grid",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 13.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 13.0, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 17.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 17.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 13.0, y: 17.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Year in review", "Large family", "Instagram grid", "Monthly milestones"],
  },
  {
    id: "9-grid-8x10",
    name: "9 Photo Grid",
    description: "Nine portrait photos in a 3×3 grid",
    category: "simple-grids",
    frameWidth: 31.0,
    frameHeight: 37.0,
    openingCount: 9,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "nine-grid",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 19.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 12.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 12.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 19.0, y: 12.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 23.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 23.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 19.0, y: 23.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Year in review", "Large family", "Instagram grid", "Monthly milestones"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // TWELVE GRID FAMILY (3×4) - Same layout in multiple photo sizes
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "12-grid",
    name: "12 Photo Grid",
    description: "Twelve portrait photos in a 3×4 grid",
    category: "simple-grids",
    frameWidth: 19.0,
    frameHeight: 32.0,
    openingCount: 12,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "twelve-grid",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 11.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 11.0, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 15.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 15.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 11.0, y: 15.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 21.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 21.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 11.0, y: 21.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Year timeline", "Monthly memories", "Wedding highlights", "Baby first year"],
  },
  {
    id: "12-grid-5x7",
    name: "12 Photo Grid",
    description: "Twelve portrait photos in a 3×4 grid",
    category: "simple-grids",
    frameWidth: 22.0,
    frameHeight: 35.5,
    openingCount: 12,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "twelve-grid",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 13.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 13.0, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 17.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 17.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 13.0, y: 17.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 24.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 24.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 13.0, y: 24.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Year timeline", "Monthly memories", "Wedding highlights", "Baby first year"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // THREE WIDE FAMILY (Landscape Row) - 3 landscape photos in a horizontal row
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "triple-row-4x6",
    name: "3 Wide Photos",
    description: "Three 6×4 landscape photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 25,
    frameHeight: 10,
    openingCount: 3,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "three-wide",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
      { x: 8.5, y: 2.0, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
      { x: 15.0, y: 2.0, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Family trio", "Three generations", "Best friends", "Timeline"],
  },
  {
    id: "triple-row-5x7",
    name: "3 Wide Photos",
    description: "Three 7×5 landscape photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 28,
    frameHeight: 11,
    openingCount: 3,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "three-wide",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
      { x: 9.5, y: 2.0, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
      { x: 17.0, y: 2.0, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Family trio", "Three generations", "Best friends", "Timeline"],
  },
  {
    id: "triple-row",
    name: "3 Wide Photos",
    description: "Three 10×8 landscape photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 37,
    frameHeight: 14,
    openingCount: 3,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "three-wide",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 12.5, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 23.0, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Family trio", "Three generations", "Best friends", "Timeline"],
  },
  {
    id: "triple-row-11x14",
    name: "3 Wide Photos",
    description: "Three 14×11 landscape photos in a horizontal row",
    category: "simple-grids",
    frameWidth: 49,
    frameHeight: 17,
    openingCount: 3,
    defaultPhotoSize: "11x14",
    supportedSizes: ["11x14"],
    familyId: "three-wide",
    variantSize: "11x14",
    openings: [
      { x: 2.0, y: 2.0, width: 14, height: 11, shape: "rectangle", orientation: "landscape" },
      { x: 16.5, y: 2.0, width: 14, height: 11, shape: "rectangle", orientation: "landscape" },
      { x: 31.0, y: 2.0, width: 14, height: 11, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Family trio", "Three generations", "Best friends", "Timeline"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // TRIPLE COLUMN FAMILY - 3 portrait photos stacked vertically
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "triple-column-4x6",
    name: "Triple Column",
    description: "Three 4×6 photos stacked vertically",
    category: "simple-grids",
    frameWidth: 10,
    frameHeight: 25,
    openingCount: 3,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "triple-column",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 8.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 15.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Growth timeline", "Vertical display", "Narrow wall space", "Stairway"],
  },
  {
    id: "triple-column",
    name: "Triple Column",
    description: "Three 5×7 photos stacked vertically",
    category: "simple-grids",
    frameWidth: 11,
    frameHeight: 28,
    openingCount: 3,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "triple-column",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 9.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 17.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Growth timeline", "Vertical display", "Narrow wall space", "Stairway"],
  },
  {
    id: "triple-column-8x10",
    name: "Triple Column",
    description: "Three 8×10 photos stacked vertically",
    category: "simple-grids",
    frameWidth: 14,
    frameHeight: 37,
    openingCount: 3,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "triple-column",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 12.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 23.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Growth timeline", "Vertical display", "Narrow wall space", "Stairway"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // FIFTEEN PHOTO FAMILY - 15 photos in 5×3 grid
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "15-photo",
    name: "15 Photos",
    description: "Fifteen 4×6 photo openings in a 5×3 grid with signature space below",
    category: "simple-grids",
    frameWidth: 28,
    frameHeight: 36,
    openingCount: 15,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "fifteen-photo",
    variantSize: "4x6",
    openings: (() => {
      const openings: CollageOpening[] = [];
      const photoW = 4;
      const photoH = 6;
      const spacing = 0.5;
      const gridWidth = 5 * photoW + 4 * spacing;
      const startX = (26 - gridWidth) / 2;
      const startY = 2;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          openings.push({
            x: Math.round((startX + col * (photoW + spacing)) * 8) / 8,
            y: Math.round((startY + row * (photoH + spacing)) * 8) / 8,
            width: photoW,
            height: photoH,
            shape: "rectangle",
            orientation: "portrait",
          });
        }
      }
      return openings;
    })(),
    recommendedFor: [
      "Year highlights",
      "Travel memories",
      "Event collection",
      "Photo album display",
    ],
  },
  {
    id: "15-photo-5x7",
    name: "15 Photos",
    description: "Fifteen 5×7 photo openings in a 5×3 grid",
    category: "simple-grids",
    frameWidth: 34,
    frameHeight: 37,
    openingCount: 15,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "fifteen-photo",
    variantSize: "5x7",
    openings: (() => {
      const openings: CollageOpening[] = [];
      const photoW = 5;
      const photoH = 7;
      const spacing = 0.5;
      const gridWidth = 5 * photoW + 4 * spacing;
      const frameW = 32;
      const startX = (frameW - gridWidth) / 2;
      const startY = 2;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          openings.push({
            x: Math.round((startX + col * (photoW + spacing)) * 8) / 8,
            y: Math.round((startY + row * (photoH + spacing)) * 8) / 8,
            width: photoW,
            height: photoH,
            shape: "rectangle",
            orientation: "portrait",
          });
        }
      }
      return openings;
    })(),
    recommendedFor: [
      "Year highlights",
      "Travel memories",
      "Event collection",
      "Photo album display",
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // FIFTEEN PHOTO COMPACT FAMILY - 15 photos in centered 5×3 grid
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "15-photo-compact",
    name: "15 Photos Compact",
    description: "Fifteen 4×6 photo openings in a centered 5×3 grid",
    category: "simple-grids",
    frameWidth: 28,
    frameHeight: 25,
    openingCount: 15,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "fifteen-photo-compact",
    variantSize: "4x6",
    openings: (() => {
      const openings: CollageOpening[] = [];
      const photoW = 4;
      const photoH = 6;
      const spacing = 0.5;
      const gridWidth = 5 * photoW + 4 * spacing;
      const gridHeight = 3 * photoH + 2 * spacing;
      const startX = (26 - gridWidth) / 2;
      const startY = (23 - gridHeight) / 2;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          openings.push({
            x: Math.round((startX + col * (photoW + spacing)) * 8) / 8,
            y: Math.round((startY + row * (photoH + spacing)) * 8) / 8,
            width: photoW,
            height: photoH,
            shape: "rectangle",
            orientation: "portrait",
          });
        }
      }
      return openings;
    })(),
    recommendedFor: [
      "Year highlights",
      "Travel memories",
      "Event collection",
      "Photo album display",
    ],
  },
  {
    id: "15-photo-compact-5x7",
    name: "15 Photos Compact",
    description: "Fifteen 5×7 photo openings in a centered 5×3 grid",
    category: "simple-grids",
    frameWidth: 34,
    frameHeight: 28,
    openingCount: 15,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "fifteen-photo-compact",
    variantSize: "5x7",
    openings: (() => {
      const openings: CollageOpening[] = [];
      const photoW = 5;
      const photoH = 7;
      const spacing = 0.5;
      const gridWidth = 5 * photoW + 4 * spacing;
      const gridHeight = 3 * photoH + 2 * spacing;
      const frameW = 32;
      const frameH = 26;
      const startX = (frameW - gridWidth) / 2;
      const startY = (frameH - gridHeight) / 2;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          openings.push({
            x: Math.round((startX + col * (photoW + spacing)) * 8) / 8,
            y: Math.round((startY + row * (photoH + spacing)) * 8) / 8,
            width: photoW,
            height: photoH,
            shape: "rectangle",
            orientation: "portrait",
          });
        }
      }
      return openings;
    })(),
    recommendedFor: [
      "Year highlights",
      "Travel memories",
      "Event collection",
      "Photo album display",
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // INSTAGRAM GRID FAMILY - Square photos in grid layouts
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "instagram-square",
    name: "Instagram Grid 9",
    description: "Nine 4×4 square photos in a 3×3 grid",
    category: "simple-grids",
    frameWidth: 19,
    frameHeight: 19,
    openingCount: 9,
    defaultPhotoSize: "4x6",
    supportedSizes: ["square"],
    photoSizeLabel: "4×4",
    familyId: "instagram-grid",
    openings: (() => {
      const openings: CollageOpening[] = [];
      const photoSize = 4;
      const spacing = 0.5;
      const startX = 2;
      const startY = 2;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          openings.push({
            x: startX + col * (photoSize + spacing),
            y: startY + row * (photoSize + spacing),
            width: photoSize,
            height: photoSize,
            shape: "rectangle",
            orientation: "square",
          });
        }
      }
      return openings;
    })(),
    recommendedFor: ["Social media display", "Square photos", "Modern grid", "Feed showcase"],
  },
  {
    id: "instagram-square-16",
    name: "Instagram Grid 16",
    description: "Sixteen 4×4 square photos in a 4×4 grid",
    category: "simple-grids",
    frameWidth: 23.5,
    frameHeight: 23.5,
    openingCount: 16,
    defaultPhotoSize: "4x6",
    supportedSizes: ["square"],
    photoSizeLabel: "4×4",
    familyId: "instagram-grid",
    openings: (() => {
      const openings: CollageOpening[] = [];
      const photoSize = 4;
      const spacing = 0.5;
      const startX = 2;
      const startY = 2;

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          openings.push({
            x: startX + col * (photoSize + spacing),
            y: startY + row * (photoSize + spacing),
            width: photoSize,
            height: photoSize,
            shape: "rectangle",
            orientation: "square",
          });
        }
      }
      return openings;
    })(),
    recommendedFor: ["Social media display", "Square photos", "Modern grid", "Feed showcase"],
  },
  {
    id: "instagram-square-25",
    name: "Instagram Grid 25",
    description: "Twenty-five 4×4 square photos in a 5×5 grid",
    category: "simple-grids",
    frameWidth: 28,
    frameHeight: 28,
    openingCount: 25,
    defaultPhotoSize: "4x6",
    supportedSizes: ["square"],
    photoSizeLabel: "4×4",
    familyId: "instagram-grid",
    openings: (() => {
      const openings: CollageOpening[] = [];
      const photoSize = 4;
      const spacing = 0.5;
      const startX = 2;
      const startY = 2;

      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          openings.push({
            x: startX + col * (photoSize + spacing),
            y: startY + row * (photoSize + spacing),
            width: photoSize,
            height: photoSize,
            shape: "rectangle",
            orientation: "square",
          });
        }
      }
      return openings;
    })(),
    recommendedFor: ["Social media display", "Square photos", "Modern grid", "Feed showcase"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MIXED ORIENTATION - Combines landscape and portrait photos tightly
  // ═══════════════════════════════════════════════════════════════════════
  // ─────────────────────────────────────────────────────────────────────────
  // TWO MIXED FAMILY - One landscape + one portrait side by side
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "2-mixed-4x6",
    name: "2 Photos Mixed",
    description: "One landscape paired with one portrait",
    category: "mixed-orientation",
    frameWidth: 16.5,
    frameHeight: 11.5,
    openingCount: 2,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "two-mixed",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
      { x: 8.5, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Couple portrait", "Scenic + portrait", "Event highlight", "Before & after"],
  },
  {
    id: "2-mixed",
    name: "2 Photos Mixed",
    description: "One landscape paired with one portrait",
    category: "mixed-orientation",
    frameWidth: 18.5,
    frameHeight: 13.0,
    openingCount: 2,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "two-mixed",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
      { x: 9.5, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Couple portrait", "Scenic + portrait", "Event highlight", "Before & after"],
  },
  {
    id: "2-mixed-8x10",
    name: "2 Photos Mixed",
    description: "One landscape paired with one portrait",
    category: "mixed-orientation",
    frameWidth: 24.5,
    frameHeight: 16.0,
    openingCount: 2,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "two-mixed",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 12.5, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Couple portrait", "Scenic + portrait", "Event highlight", "Before & after"],
  },
  {
    id: "2-mixed-11x14",
    name: "2 Photos Mixed",
    description: "One landscape paired with one portrait",
    category: "mixed-orientation",
    frameWidth: 31.5,
    frameHeight: 20.0,
    openingCount: 2,
    defaultPhotoSize: "11x14",
    supportedSizes: ["11x14"],
    familyId: "two-mixed",
    variantSize: "11x14",
    openings: [
      { x: 2.0, y: 2.0, width: 14, height: 11, shape: "rectangle", orientation: "landscape" },
      { x: 16.5, y: 2.0, width: 11, height: 14, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Couple portrait", "Scenic + portrait", "Event highlight", "Before & after"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // THREE MIXED FAMILY - Large landscape + two smaller portraits
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "3-mixed",
    name: "3 Photos Mixed",
    description: "One large landscape with two smaller portraits",
    category: "mixed-orientation",
    frameWidth: 18.0,
    frameHeight: 22.0,
    openingCount: 3,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7", "8x10"],
    photoSizeLabel: "8×10 & 5×7",
    familyId: "three-mixed",
    variantSize: "5x7",
    openings: [
      { x: 3.0, y: 2.25, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 2.75, y: 10.75, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 8.25, y: 10.75, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Family portrait", "Wedding trio", "Vacation feature", "Pet family"],
  },
  {
    id: "3-mixed-8x10-4x6",
    name: "3 Photos Mixed",
    description: "One large landscape with two smaller portraits",
    category: "mixed-orientation",
    frameWidth: 16.0,
    frameHeight: 20.5,
    openingCount: 3,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6", "8x10"],
    photoSizeLabel: "8×10 & 4×6",
    familyId: "three-mixed",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 2.75, y: 10.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 7.25, y: 10.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Family portrait", "Wedding trio", "Vacation feature", "Pet family"],
  },
  {
    id: "3-mixed-11x14-8x10",
    name: "3 Photos Mixed",
    description: "One large landscape with two smaller portraits",
    category: "mixed-orientation",
    frameWidth: 22.5,
    frameHeight: 27.5,
    openingCount: 3,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10", "11x14"],
    photoSizeLabel: "11×14 & 8×10",
    familyId: "three-mixed",
    variantSize: "11x14",
    openings: [
      { x: 3.25, y: 2.0, width: 14, height: 11, shape: "rectangle", orientation: "landscape" },
      { x: 2.0, y: 13.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 13.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Family portrait", "Wedding trio", "Vacation feature", "Pet family"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // FOUR MIXED FAMILY - 2×2 grid of landscape photos
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "4-mixed-4x6",
    name: "4 Photos Mixed",
    description: "Four landscape photos in a 2×2 grid",
    category: "mixed-orientation",
    frameWidth: 18.5,
    frameHeight: 14.5,
    openingCount: 4,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "four-mixed",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
      { x: 8.5, y: 2.0, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
      { x: 2.0, y: 6.5, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
      { x: 8.5, y: 6.5, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Dynamic memories", "Travel mix", "Life moments", "Best of collection"],
  },
  {
    id: "4-mixed",
    name: "4 Photos Mixed",
    description: "Four landscape photos in a 2×2 grid",
    category: "mixed-orientation",
    frameWidth: 20.5,
    frameHeight: 16.5,
    openingCount: 4,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "four-mixed",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
      { x: 9.5, y: 2.0, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
      { x: 2.0, y: 7.5, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
      { x: 9.5, y: 7.5, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Dynamic memories", "Travel mix", "Life moments", "Best of collection"],
  },
  {
    id: "4-mixed-8x10",
    name: "4 Photos Mixed",
    description: "Four landscape photos in a 2×2 grid",
    category: "mixed-orientation",
    frameWidth: 26.5,
    frameHeight: 22.5,
    openingCount: 4,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "four-mixed",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 12.5, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 2.0, y: 10.5, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 12.5, y: 10.5, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Dynamic memories", "Travel mix", "Life moments", "Best of collection"],
  },
  {
    id: "4-mixed-11x14",
    name: "4 Photos Mixed",
    description: "Four landscape photos in a 2×2 grid",
    category: "mixed-orientation",
    frameWidth: 34.5,
    frameHeight: 28.5,
    openingCount: 4,
    defaultPhotoSize: "11x14",
    supportedSizes: ["11x14"],
    familyId: "four-mixed",
    variantSize: "11x14",
    openings: [
      { x: 2.0, y: 2.0, width: 14, height: 11, shape: "rectangle", orientation: "landscape" },
      { x: 16.5, y: 2.0, width: 14, height: 11, shape: "rectangle", orientation: "landscape" },
      { x: 2.0, y: 13.5, width: 14, height: 11, shape: "rectangle", orientation: "landscape" },
      { x: 16.5, y: 13.5, width: 14, height: 11, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Dynamic memories", "Travel mix", "Life moments", "Best of collection"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // SIX MIXED GRID FAMILY - Asymmetric mixed arrangement
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "6-mixed-grid",
    name: "6 Photos Mixed",
    description: "Six photos in a tight mixed arrangement",
    category: "mixed-orientation",
    frameWidth: 23,
    frameHeight: 16.5,
    openingCount: 6,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "six-mixed-grid",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
      { x: 8.5, y: 2.0, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
      { x: 15.0, y: 2.0, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 6.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 6.5, y: 6.5, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
      { x: 13.0, y: 8.5, width: 6, height: 4, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Eclectic mix", "Event highlights", "Creative display", "Random favorites"],
  },
  {
    id: "6-mixed-grid-5x7",
    name: "6 Photos Mixed",
    description: "Six photos in a tight mixed arrangement",
    category: "mixed-orientation",
    frameWidth: 26.5,
    frameHeight: 18.5,
    openingCount: 6,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "six-mixed-grid",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
      { x: 9.5, y: 2.0, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
      { x: 17.0, y: 2.0, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 7.5, width: 5, height: 7, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 7.5, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
      { x: 15.0, y: 9.5, width: 7, height: 5, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Eclectic mix", "Event highlights", "Creative display", "Random favorites"],
  },
  {
    id: "6-mixed-grid-8x10",
    name: "6 Photos Mixed",
    description: "Six photos in a tight mixed arrangement",
    category: "mixed-orientation",
    frameWidth: 35.0,
    frameHeight: 24.5,
    openingCount: 6,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "six-mixed-grid",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 12.5, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 23.0, y: 2.0, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 2.0, y: 10.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 10.5, y: 10.5, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 21.0, y: 12.5, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
    ],
    recommendedFor: ["Eclectic mix", "Event highlights", "Creative display", "Random favorites"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ASYMMETRIC/GALLERY - One featured photo with smaller accents, tightly packed
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "1-large-2-small",
    name: "1 Large + 2 Small",
    description: "One large feature with two stacked squares",
    category: "asymmetric-gallery",
    frameWidth: 20.5,
    frameHeight: 14.0,
    openingCount: 3,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    openings: [
      { x: 2.0, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 13.5, y: 2.25, width: 3, height: 3, shape: "rectangle", orientation: "square" },
      { x: 13.5, y: 6.75, width: 3, height: 3, shape: "rectangle", orientation: "square" },
    ],
    recommendedFor: ["Wedding feature", "Baby portrait", "Pet showcase", "Achievement photo"],
  },
  {
    id: "2-large-4-small",
    name: "2 Large + 4 Small",
    description: "Two 10×8 landscape photos with four 4×6 portrait accents",
    category: "asymmetric-gallery",
    frameWidth: 27,
    frameHeight: 20,
    openingCount: 6,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10", "4x6"],
    photoSizeLabel: "10×8 & 4×6",
    openings: [
      { x: 2.0, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 12.5, y: 2.0, width: 10, height: 8, shape: "rectangle", orientation: "landscape" },
      { x: 3.0, y: 10.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 7.5, y: 10.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 13.0, y: 10.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
      { x: 17.5, y: 10.5, width: 4, height: 6, shape: "rectangle", orientation: "portrait" },
    ],
    recommendedFor: ["Dual heroes", "Wedding couple", "Siblings", "Best moments"],
  },
  {
    id: "center-large-6-small",
    name: "Center + 6 Small",
    description: "One 8×10 portrait center photo with six 4×4 surrounding",
    category: "asymmetric-gallery",
    frameWidth: 22,
    frameHeight: 19,
    openingCount: 7,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10", "square"],
    photoSizeLabel: "8×10 & 4×4",
    openings: [
      { x: 6.0, y: 3.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 1.0, y: 1.0, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 15.0, y: 1.0, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 1.0, y: 6.5, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 15.0, y: 6.5, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 1.0, y: 12.0, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 15.0, y: 12.0, width: 4, height: 4, shape: "rectangle", orientation: "square" },
    ],
    recommendedFor: ["Feature collage", "Hero photo", "Main event", "Star of the show"],
  },
  {
    id: "1-large-5-small",
    name: "1 Large + 5 Small",
    description: "One 8×8 with five 4×4 photos arranged around it",
    category: "asymmetric-gallery",
    frameWidth: 18.5,
    frameHeight: 18.5,
    openingCount: 6,
    defaultPhotoSize: "8x10",
    supportedSizes: ["square"],
    photoSizeLabel: "8×8 & 4×4",
    openings: [
      { x: 2, y: 2, width: 8, height: 8, shape: "rectangle", orientation: "square" },
      { x: 11, y: 2, width: 3.5, height: 3.5, shape: "rectangle", orientation: "square" },
      { x: 11, y: 6.5, width: 3.5, height: 3.5, shape: "rectangle", orientation: "square" },
      { x: 2, y: 11, width: 3.5, height: 3.5, shape: "rectangle", orientation: "square" },
      { x: 6.5, y: 11, width: 3.5, height: 3.5, shape: "rectangle", orientation: "square" },
      { x: 11, y: 11, width: 3.5, height: 3.5, shape: "rectangle", orientation: "square" },
    ],
    recommendedFor: [
      "Family feature",
      "Hero with details",
      "Main event collage",
      "Portrait showcase",
    ],
  },
  {
    id: "center-focus",
    name: "Center Focus",
    description: "One 8×10 portrait center photo surrounded by ten 4×4 photos",
    category: "asymmetric-gallery",
    frameWidth: 22.5,
    frameHeight: 26,
    openingCount: 11,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10", "square"],
    photoSizeLabel: "8×10, 4x6, & 4×4",
    openings: [
      { x: 2, y: 2, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 7.5, y: 2, width: 6, height: 4, shape: "rectangle", orientation: "square" },
      { x: 15, y: 2, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 2, y: 7.5, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 2, y: 13.4, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 6.5, y: 7.5, width: 8, height: 10, shape: "rectangle", orientation: "portrait" },
      { x: 15, y: 7.5, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 15, y: 13.4, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 2, y: 18.5, width: 4, height: 4, shape: "rectangle", orientation: "square" },
      { x: 7.5, y: 18.5, width: 6, height: 4, shape: "rectangle", orientation: "square" },
      { x: 15, y: 18.5, width: 4, height: 4, shape: "rectangle", orientation: "square" },
    ],
    recommendedFor: ["Hero focus", "Center showcase", "Main event", "Feature photo"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CREATIVE SHAPES - Circles, ovals, and hearts in tight arrangements
  // ═══════════════════════════════════════════════════════════════════════
  // ─────────────────────────────────────────────────────────────────────────
  // THREE CIRCLES FAMILY - 3 circles in a row
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "3-circles-4x4",
    name: "3 Circles",
    description: 'Three 4" circular openings in a tight row',
    category: "creative-shapes",
    frameWidth: 19,
    frameHeight: 10,
    openingCount: 3,
    defaultPhotoSize: "4x6",
    supportedSizes: ["square"],
    photoSizeLabel: "4×4",
    familyId: "three-circle",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 4, shape: "circle", orientation: "square" },
      { x: 6.5, y: 2.0, width: 4, height: 4, shape: "circle", orientation: "square" },
      { x: 11.0, y: 2.0, width: 4, height: 4, shape: "circle", orientation: "square" },
    ],
    recommendedFor: ["Portrait trio", "Soft aesthetic", "Minimalist display", "Children portraits"],
  },
  {
    id: "3-circles",
    name: "3 Circles",
    description: 'Three 5" circular openings in a tight row',
    category: "creative-shapes",
    frameWidth: 22,
    frameHeight: 11,
    openingCount: 3,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7", "square"],
    familyId: "three-circle",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 5, shape: "circle", orientation: "square" },
      { x: 7.5, y: 2.0, width: 5, height: 5, shape: "circle", orientation: "square" },
      { x: 13.0, y: 2.0, width: 5, height: 5, shape: "circle", orientation: "square" },
    ],
    recommendedFor: ["Portrait trio", "Soft aesthetic", "Minimalist display", "Children portraits"],
  },
  {
    id: "3-circles-8x8",
    name: "3 Circles",
    description: 'Three 8" circular openings in a tight row',
    category: "creative-shapes",
    frameWidth: 31,
    frameHeight: 14,
    openingCount: 3,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10", "square"],
    photoSizeLabel: "8×8",
    familyId: "three-circle",
    openings: [
      { x: 2.0, y: 2.0, width: 8, height: 8, shape: "circle", orientation: "square" },
      { x: 10.5, y: 2.0, width: 8, height: 8, shape: "circle", orientation: "square" },
      { x: 19.0, y: 2.0, width: 8, height: 8, shape: "circle", orientation: "square" },
    ],
    recommendedFor: ["Portrait trio", "Soft aesthetic", "Minimalist display", "Children portraits"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // FOUR CIRCLES FAMILY - 4 circles in 2×2 grid
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "4-circles-4x4",
    name: "4 Circles Grid",
    description: 'Four 4" circular openings in a tight 2×2 grid',
    category: "creative-shapes",
    frameWidth: 14.5,
    frameHeight: 14.5,
    openingCount: 4,
    defaultPhotoSize: "4x6",
    supportedSizes: ["square"],
    photoSizeLabel: "4×4",
    familyId: "four-circle",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 4, shape: "circle", orientation: "square" },
      { x: 6.5, y: 2.0, width: 4, height: 4, shape: "circle", orientation: "square" },
      { x: 2.0, y: 6.5, width: 4, height: 4, shape: "circle", orientation: "square" },
      { x: 6.5, y: 6.5, width: 4, height: 4, shape: "circle", orientation: "square" },
    ],
    recommendedFor: ["Family four", "Pet portraits", "Soft look", "Modern aesthetic"],
  },
  {
    id: "4-circles",
    name: "4 Circles Grid",
    description: 'Four 5" circular openings in a tight 2×2 grid',
    category: "creative-shapes",
    frameWidth: 16.5,
    frameHeight: 16.5,
    openingCount: 4,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7", "square"],
    familyId: "four-circle",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 5, shape: "circle", orientation: "square" },
      { x: 7.5, y: 2.0, width: 5, height: 5, shape: "circle", orientation: "square" },
      { x: 2.0, y: 7.5, width: 5, height: 5, shape: "circle", orientation: "square" },
      { x: 7.5, y: 7.5, width: 5, height: 5, shape: "circle", orientation: "square" },
    ],
    recommendedFor: ["Family four", "Pet portraits", "Soft look", "Modern aesthetic"],
  },
  {
    id: "4-circles-8x8",
    name: "4 Circles Grid",
    description: 'Four 8" circular openings in a tight 2×2 grid',
    category: "creative-shapes",
    frameWidth: 22.5,
    frameHeight: 22.5,
    openingCount: 4,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10", "square"],
    photoSizeLabel: "8×8",
    familyId: "four-circle",
    openings: [
      { x: 2.0, y: 2.0, width: 8, height: 8, shape: "circle", orientation: "square" },
      { x: 10.5, y: 2.0, width: 8, height: 8, shape: "circle", orientation: "square" },
      { x: 2.0, y: 10.5, width: 8, height: 8, shape: "circle", orientation: "square" },
      { x: 10.5, y: 10.5, width: 8, height: 8, shape: "circle", orientation: "square" },
    ],
    recommendedFor: ["Family four", "Pet portraits", "Soft look", "Modern aesthetic"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // THREE OVALS FAMILY - 3 ovals in a row
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "3-ovals-4x6",
    name: "3 Ovals",
    description: "Three 4×6 oval openings in a row",
    category: "creative-shapes",
    frameWidth: 19,
    frameHeight: 12,
    openingCount: 3,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "three-oval",
    variantSize: "4x6",
    openings: [
      { x: 2.0, y: 2.0, width: 4, height: 6, shape: "oval", orientation: "portrait" },
      { x: 6.5, y: 2.0, width: 4, height: 6, shape: "oval", orientation: "portrait" },
      { x: 11.0, y: 2.0, width: 4, height: 6, shape: "oval", orientation: "portrait" },
    ],
    recommendedFor: ["Elegant portraits", "Vintage style", "Formal display", "Classic elegance"],
  },
  {
    id: "3-ovals-5x7",
    name: "3 Ovals",
    description: "Three 5×7 oval openings in a row",
    category: "creative-shapes",
    frameWidth: 22,
    frameHeight: 13,
    openingCount: 3,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "three-oval",
    variantSize: "5x7",
    openings: [
      { x: 2.0, y: 2.0, width: 5, height: 7, shape: "oval", orientation: "portrait" },
      { x: 7.5, y: 2.0, width: 5, height: 7, shape: "oval", orientation: "portrait" },
      { x: 13.0, y: 2.0, width: 5, height: 7, shape: "oval", orientation: "portrait" },
    ],
    recommendedFor: ["Elegant portraits", "Vintage style", "Formal display", "Classic elegance"],
  },
  {
    id: "3-ovals-8x10",
    name: "3 Ovals",
    description: "Three 8×10 oval openings in a row",
    category: "creative-shapes",
    frameWidth: 31,
    frameHeight: 16,
    openingCount: 3,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "three-oval",
    variantSize: "8x10",
    openings: [
      { x: 2.0, y: 2.0, width: 8, height: 10, shape: "oval", orientation: "portrait" },
      { x: 10.5, y: 2.0, width: 8, height: 10, shape: "oval", orientation: "portrait" },
      { x: 19.0, y: 2.0, width: 8, height: 10, shape: "oval", orientation: "portrait" },
    ],
    recommendedFor: ["Elegant portraits", "Vintage style", "Formal display", "Classic elegance"],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // BOTTOM WEIGHTED FAMILY - Single opening with heavier bottom border
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "weight-bottom-4x6",
    name: "Bottom Weighted",
    description: "Classic matting with heavier bottom border for visual balance",
    category: "single-openings",
    frameWidth: 12,
    frameHeight: 14,
    openingCount: 1,
    defaultPhotoSize: "4x6",
    supportedSizes: ["4x6"],
    familyId: "bottom-weighted",
    variantSize: "4x6",
    openings: [{ x: 2, y: 2, width: 6, height: 4, shape: "rectangle", orientation: "landscape" }],
    recommendedFor: ["Artwork display", "Museum style", "Gallery display", "Classic presentation"],
  },
  {
    id: "weight-bottom-5x7",
    name: "Bottom Weighted",
    description: "Classic matting with heavier bottom border for visual balance",
    category: "single-openings",
    frameWidth: 13,
    frameHeight: 15,
    openingCount: 1,
    defaultPhotoSize: "5x7",
    supportedSizes: ["5x7"],
    familyId: "bottom-weighted",
    variantSize: "5x7",
    openings: [{ x: 2, y: 2, width: 7, height: 5, shape: "rectangle", orientation: "landscape" }],
    recommendedFor: ["Artwork display", "Museum style", "Gallery display", "Classic presentation"],
  },
  {
    id: "weight-bottom",
    name: "Bottom Weighted",
    description: "Classic matting with heavier bottom border for visual balance",
    category: "single-openings",
    frameWidth: 16,
    frameHeight: 20,
    openingCount: 1,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    familyId: "bottom-weighted",
    variantSize: "8x10",
    openings: [{ x: 2, y: 2, width: 10, height: 8, shape: "rectangle", orientation: "landscape" }],
    recommendedFor: ["Large artwork", "Panoramic photo", "Museum style", "Gallery display"],
  },
  {
    id: "weight-bottom-11x14",
    name: "Bottom Weighted",
    description: "Classic matting with heavier bottom border for visual balance",
    category: "single-openings",
    frameWidth: 20,
    frameHeight: 24,
    openingCount: 1,
    defaultPhotoSize: "11x14",
    supportedSizes: ["11x14"],
    familyId: "bottom-weighted",
    variantSize: "11x14",
    openings: [{ x: 2, y: 2, width: 14, height: 11, shape: "rectangle", orientation: "landscape" }],
    recommendedFor: ["Large artwork", "Panoramic photo", "Museum style", "Gallery display"],
  },
  {
    id: "weight-bottom-16x20",
    name: "Bottom Weighted",
    description: "Classic matting with heavier bottom border for visual balance",
    category: "single-openings",
    frameWidth: 26,
    frameHeight: 32,
    openingCount: 1,
    defaultPhotoSize: "16x20",
    supportedSizes: ["16x20"],
    familyId: "bottom-weighted",
    variantSize: "16x20",
    openings: [{ x: 2, y: 2, width: 20, height: 16, shape: "rectangle", orientation: "landscape" }],
    recommendedFor: ["Large artwork", "Panoramic photo", "Museum style", "Gallery display"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SCHOOL & MEMORY - Educational and milestone layouts
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "school-days",
    name: "School Days",
    description: "Center 8×10 portrait photo with 12 small 2×3 photos arranged in a clock pattern",
    category: "school-memory",
    frameWidth: 28,
    frameHeight: 28,
    openingCount: 13,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10"],
    photoSizeLabel: "8×10 & 2×3",
    openings: (() => {
      const openings: CollageOpening[] = [];
      const overallSize = 26;
      const centerX = overallSize / 2;
      const centerY = overallSize / 2;
      const centerW = 8;
      const centerH = 10;
      const smallW = 2;
      const smallH = 3;

      // Center portrait (index 0) - perfectly centered
      openings.push({
        x: Math.round(((overallSize - centerW) / 2) * 8) / 8,
        y: Math.round(((overallSize - centerH) / 2) * 8) / 8,
        width: centerW,
        height: centerH,
        shape: "rectangle",
        orientation: "portrait",
      });

      // Clock positions with per-position fine-tuned offsets
      // Each position adjusted for visual balance accounting for rectangular opening geometry
      // Format: [radius, offsetX, offsetY] - offsets push positions to align with mat edges
      const clockConfigs: [number, number, number][] = [
        [10, 0, 0], // 12 o'clock (index 1) - top center
        [10.6, -0.2, 0.1], // 1 o'clock (index 2) - push left and down slightly
        [10.5, -0.3, 0.15], // 2 o'clock (index 3) - push left and down
        [10, 0, 0], // 3 o'clock (index 4) - right center
        [10.5, -0.3, -0.15], // 4 o'clock (index 5) - push left and up
        [10.6, -0.2, -0.1], // 5 o'clock (index 6) - push left and up slightly
        [10, 0, 0], // 6 o'clock (index 7) - bottom center
        [10.6, 0.2, -0.1], // 7 o'clock (index 8) - push right and up slightly
        [10.5, 0.3, -0.15], // 8 o'clock (index 9) - push right and up
        [10, 0, 0], // 9 o'clock (index 10) - left center
        [10.5, 0.3, 0.15], // 10 o'clock (index 11) - push right and down
        [10.6, 0.2, 0.1], // 11 o'clock (index 12) - push right and down slightly
      ];

      for (let i = 0; i < 12; i++) {
        const angleDeg = -90 + i * 30;
        const angleRad = (angleDeg * Math.PI) / 180;
        const config = clockConfigs[i];
        if (!config) continue;
        const [radius, offsetX, offsetY] = config;

        const rectCenterX = centerX + radius * Math.cos(angleRad) + offsetX;
        const rectCenterY = centerY + radius * Math.sin(angleRad) + offsetY;

        openings.push({
          x: Math.round((rectCenterX - smallW / 2) * 8) / 8,
          y: Math.round((rectCenterY - smallH / 2) * 8) / 8,
          width: smallW,
          height: smallH,
          shape: "rectangle",
          orientation: "portrait",
        });
      }
      return openings;
    })(),
    recommendedFor: ["School years", "PreK-12 photos", "Graduation milestone", "Growth timeline"],
  },
  {
    id: "k12-school-years",
    name: "K-12 School Years",
    description: "Two 8×8 center graduation photos with 12 yearly 2×3 school photos",
    category: "school-memory",
    frameWidth: 28,
    frameHeight: 20,
    openingCount: 14,
    defaultPhotoSize: "8x10",
    supportedSizes: ["8x10", "square"],
    photoSizeLabel: "8×8 & 2×3",
    openings: (() => {
      const openings: CollageOpening[] = [];
      const overallWIn = 26;
      const overallHIn = 18;
      const gradSize = 8;
      const yearlyW = 2;
      const yearlyH = 3;
      const spacing = 0.5;

      openings.push({
        x: Math.round((overallWIn / 2 - gradSize - spacing / 2) * 8) / 8,
        y: Math.round((overallHIn / 2 - gradSize / 2) * 8) / 8,
        width: gradSize,
        height: gradSize,
        shape: "rectangle",
        orientation: "square",
      });
      openings.push({
        x: Math.round((overallWIn / 2 + spacing / 2) * 8) / 8,
        y: Math.round((overallHIn / 2 - gradSize / 2) * 8) / 8,
        width: gradSize,
        height: gradSize,
        shape: "rectangle",
        orientation: "square",
      });

      const topRowWidth = 6 * yearlyW + 5 * spacing;
      const topStartX = (overallWIn - topRowWidth) / 2;
      const topY = 1;

      for (let i = 0; i < 6; i++) {
        openings.push({
          x: Math.round((topStartX + i * (yearlyW + spacing)) * 8) / 8,
          y: Math.round(topY * 8) / 8,
          width: yearlyW,
          height: yearlyH,
          shape: "rectangle",
          orientation: "portrait",
        });
      }

      const bottomY = overallHIn - yearlyH - 1;
      for (let i = 0; i < 6; i++) {
        openings.push({
          x: Math.round((topStartX + i * (yearlyW + spacing)) * 8) / 8,
          y: Math.round(bottomY * 8) / 8,
          width: yearlyW,
          height: yearlyH,
          shape: "rectangle",
          orientation: "portrait",
        });
      }
      return openings;
    })(),
    recommendedFor: [
      "Kindergarten to senior",
      "School journey",
      "Education milestone",
      "Child growth",
    ],
  },
];

/**
 * Get all layouts in a specific category
 */
export function getLayoutsByCategory(category: CollageCategory): CollageLayout[] {
  return COLLAGE_LAYOUTS.filter((layout) => layout.category === category);
}

/**
 * Get a layout by its ID
 */
export function getLayoutById(id: CollageLayoutType): CollageLayout | undefined {
  return COLLAGE_LAYOUTS.find((layout) => layout.id === id);
}

/**
 * Get layouts by opening count
 */
export function getLayoutsByOpeningCount(count: number): CollageLayout[] {
  return COLLAGE_LAYOUTS.filter((layout) => layout.openingCount === count);
}

/**
 * Calculate the total frame interior dimensions (after molding)
 */
export function calculateInteriorDimensions(layout: CollageLayout): {
  width: number;
  height: number;
} {
  return {
    width: layout.frameWidth - 2 * DEFAULT_FRAME_MOLDING_WIDTH,
    height: layout.frameHeight - 2 * DEFAULT_FRAME_MOLDING_WIDTH,
  };
}

/**
 * Get all unique opening counts across layouts
 */
export function getAvailableOpeningCounts(): number[] {
  const counts = new Set(COLLAGE_LAYOUTS.map((l) => l.openingCount));
  return Array.from(counts).sort((a, b) => a - b);
}

/**
 * Get all categories with at least one layout (simple string array)
 */
export function getAvailableCategories(): CollageCategory[] {
  const categories = new Set(COLLAGE_LAYOUTS.map((l) => l.category));
  return Array.from(categories) as CollageCategory[];
}

/** Category display names */
const CATEGORY_DISPLAY_NAMES: Record<CollageCategory, string> = {
  "simple-grids": "Simple Grids",
  "mixed-orientation": "Mixed Orientation",
  "asymmetric-gallery": "Asymmetric Gallery",
  "creative-shapes": "Creative Shapes",
  "single-openings": "Single Openings",
  "specialty-shapes": "Specialty Shapes",
  "school-memory": "School & Memory",
};

export interface CategoryWithLayouts {
  category: CollageCategory;
  displayName: string;
  layouts: CollageLayout[];
}

/**
 * Get all collage categories with their layouts and display names.
 * Named getCollageCategories to avoid conflict with card-insert-images getAllCategories.
 */
export function getCollageCategories(): CategoryWithLayouts[] {
  const categories = getAvailableCategories();
  return categories.map((category) => ({
    category,
    displayName: CATEGORY_DISPLAY_NAMES[category],
    layouts: COLLAGE_LAYOUTS.filter((l) => l.category === category),
  }));
}

/**
 * Consolidated category system - groups 8 categories into 4 for simpler navigation
 */
export type ConsolidatedCategory = "grids" | "gallery" | "shapes" | "themed";

/** Maps original categories to consolidated groups */
export const CONSOLIDATED_CATEGORY_MAP: Record<CollageCategory, ConsolidatedCategory> = {
  "simple-grids": "grids",
  "mixed-orientation": "grids",
  "asymmetric-gallery": "gallery",
  "creative-shapes": "shapes",
  "single-openings": "shapes",
  "specialty-shapes": "shapes",
  "school-memory": "themed",
};

/** Consolidated category display names and descriptions */
export const CONSOLIDATED_CATEGORY_INFO: Record<
  ConsolidatedCategory,
  { displayName: string; description: string }
> = {
  grids: {
    displayName: "Grid Layouts",
    description: "Standard grid arrangements for multiple photos",
  },
  gallery: {
    displayName: "Gallery Style",
    description: "Asymmetric gallery-wall arrangements",
  },
  shapes: {
    displayName: "Shape Layouts",
    description: "Single openings and creative shapes",
  },
  themed: {
    displayName: "Themed",
    description: "School memories, weddings & special occasions",
  },
};

export interface ConsolidatedCategoryWithLayouts {
  category: ConsolidatedCategory;
  displayName: string;
  description: string;
  layouts: CollageLayout[];
  originalCategories: CollageCategory[];
}

/**
 * Get consolidated categories with their layouts (4 groups instead of 8)
 */
export function getConsolidatedCategories(): ConsolidatedCategoryWithLayouts[] {
  const consolidatedOrder: ConsolidatedCategory[] = ["grids", "gallery", "shapes", "themed"];

  return consolidatedOrder
    .map((consolidated) => {
      const originalCategories = (
        Object.entries(CONSOLIDATED_CATEGORY_MAP) as [CollageCategory, ConsolidatedCategory][]
      )
        .filter(([_, group]) => group === consolidated)
        .map(([original]) => original);

      const layouts = COLLAGE_LAYOUTS.filter((l) => originalCategories.includes(l.category));

      return {
        category: consolidated,
        displayName: CONSOLIDATED_CATEGORY_INFO[consolidated].displayName,
        description: CONSOLIDATED_CATEGORY_INFO[consolidated].description,
        layouts,
        originalCategories,
      };
    })
    .filter((group) => group.layouts.length > 0);
}

/**
 * Get the consolidated category for a layout
 */
export function getConsolidatedCategoryForLayout(
  layoutId: CollageLayoutType
): ConsolidatedCategory {
  const layout = COLLAGE_LAYOUTS.find((l) => l.id === layoutId);
  if (!layout) return "grids";
  return CONSOLIDATED_CATEGORY_MAP[layout.category];
}

/**
 * Size filter display info
 */
export const SIZE_FILTER_INFO: Record<
  FilterSizeId,
  { displayName: string; shortName: string; description: string }
> = {
  "4x6": { displayName: "4×6", shortName: "4×6", description: "Standard snapshot size" },
  "5x7": { displayName: "5×7", shortName: "5×7", description: "Portrait and gift size" },
  "8x10": { displayName: "8×10", shortName: "8×10", description: "Large display size" },
  "11x14": { displayName: "11×14", shortName: "11×14", description: "Large artwork size" },
  "16x20": { displayName: "16×20", shortName: "16×20", description: "Extra large size" },
  square: { displayName: "Square", shortName: "Square", description: "Square photo sizes" },
};

/** Display-level size options that separate square sizes visually */
export type DisplaySizeId = "4x6" | "5x7" | "8x10" | "11x14" | "16x20" | "4x4" | "5x5" | "8x8";

export interface SizeFilterOption {
  displayId: DisplaySizeId;
  filterId: FilterSizeId; // The actual filter to apply
  displayName: string;
  isSquare: boolean;
}

/** All display size options with their filter mappings */
const DISPLAY_SIZE_OPTIONS: SizeFilterOption[] = [
  { displayId: "4x6", filterId: "4x6", displayName: "4×6", isSquare: false },
  { displayId: "5x7", filterId: "5x7", displayName: "5×7", isSquare: false },
  { displayId: "8x10", filterId: "8x10", displayName: "8×10", isSquare: false },
  { displayId: "11x14", filterId: "11x14", displayName: "11×14", isSquare: false },
  { displayId: "16x20", filterId: "16x20", displayName: "16×20", isSquare: false },
  { displayId: "4x4", filterId: "square", displayName: "4×4", isSquare: true },
  { displayId: "5x5", filterId: "square", displayName: "5×5", isSquare: true },
  { displayId: "8x8", filterId: "square", displayName: "8×8", isSquare: true },
];

/**
 * Get all size filter options for display
 * Returns rectangular sizes first, then square sizes separately
 */
export function getSizeFilterOptions(): SizeFilterOption[] {
  return DISPLAY_SIZE_OPTIONS;
}

/**
 * Get the underlying filter IDs from selected display IDs
 */
export function getFilterIdsFromDisplayIds(displayIds: DisplaySizeId[]): FilterSizeId[] {
  const filterIds = new Set<FilterSizeId>();
  displayIds.forEach((displayId) => {
    const option = DISPLAY_SIZE_OPTIONS.find((o) => o.displayId === displayId);
    if (option) {
      filterIds.add(option.filterId);
    }
  });
  return Array.from(filterIds);
}

/**
 * Filter layouts by selected size filters (OR logic - layout matches if ANY selected size is supported)
 * Returns all layouts if no filters are selected
 */
export function filterLayoutsBySize(selectedSizes: FilterSizeId[]): CollageLayout[] {
  if (selectedSizes.length === 0) {
    return COLLAGE_LAYOUTS;
  }

  return COLLAGE_LAYOUTS.filter((layout) =>
    selectedSizes.some((size) => layout.supportedSizes.includes(size))
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT FAMILIES - Groups related layouts that differ only by photo size
// ═══════════════════════════════════════════════════════════════════════════

export interface LayoutFamilyVariant {
  sizeId: VariantSizeId;
  layoutId: CollageLayoutType;
  displayName: string; // e.g., "4×6"
}

export interface LayoutFamily {
  familyId: LayoutFamilyId;
  name: string;
  description: string;
  heroSizeId: VariantSizeId; // Default size to show
  variants: LayoutFamilyVariant[];
}

/**
 * Layout families group similar layouts with different photo sizes
 * Each family shows as ONE card with size options
 */
export const LAYOUT_FAMILIES: LayoutFamily[] = [
  {
    familyId: "two-portrait",
    name: "2 Portraits",
    description: "Two portrait photos side by side",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "2-portrait-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "2-grid", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "2-portrait-8x10", displayName: "8×10" },
      { sizeId: "11x14", layoutId: "2-portrait-11x14", displayName: "11×14" },
      { sizeId: "16x20", layoutId: "2-portrait-16x20", displayName: "16×20" },
    ],
  },
  {
    familyId: "three-portrait-row",
    name: "3 Portraits",
    description: "Three portrait photos in a horizontal row",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "3-row-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "3-grid-horizontal", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "3-row-8x10", displayName: "8×10" },
      { sizeId: "11x14", layoutId: "3-row-11x14", displayName: "11×14" },
    ],
  },
  {
    familyId: "four-portrait-row",
    name: "4 Portraits",
    description: "Four portrait photos in a horizontal row",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "4-row-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "4-row-5x7", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "4-row-8x10", displayName: "8×10" },
    ],
  },
  {
    familyId: "four-grid",
    name: "4 Photo Grid",
    description: "Four portrait photos in a 2×2 grid",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "4-grid-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "4-grid", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "4-grid-8x10", displayName: "8×10" },
      { sizeId: "11x14", layoutId: "4-grid-11x14", displayName: "11×14" },
    ],
  },
  {
    familyId: "six-grid",
    name: "6 Photo Grid",
    description: "Six portrait photos in a 2×3 grid",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "6-grid-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "6-grid", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "6-grid-8x10", displayName: "8×10" },
    ],
  },
  {
    familyId: "nine-grid",
    name: "9 Photo Grid",
    description: "Nine portrait photos in a 3×3 grid",
    heroSizeId: "4x6",
    variants: [
      { sizeId: "4x6", layoutId: "9-grid", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "9-grid-5x7", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "9-grid-8x10", displayName: "8×10" },
    ],
  },
  {
    familyId: "twelve-grid",
    name: "12 Photo Grid",
    description: "Twelve portrait photos in a 3×4 grid",
    heroSizeId: "4x6",
    variants: [
      { sizeId: "4x6", layoutId: "12-grid", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "12-grid-5x7", displayName: "5×7" },
    ],
  },
  {
    familyId: "two-mixed",
    name: "2 Photos Mixed",
    description: "One landscape paired with one portrait",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "2-mixed-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "2-mixed", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "2-mixed-8x10", displayName: "8×10" },
      { sizeId: "11x14", layoutId: "2-mixed-11x14", displayName: "11×14" },
    ],
  },
  {
    familyId: "four-mixed",
    name: "4 Photos Mixed",
    description: "Four landscape photos in a 2×2 grid",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "4-mixed-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "4-mixed", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "4-mixed-8x10", displayName: "8×10" },
      { sizeId: "11x14", layoutId: "4-mixed-11x14", displayName: "11×14" },
    ],
  },
  {
    familyId: "six-mixed-grid",
    name: "6 Photos Mixed",
    description: "Six photos in a tight mixed arrangement",
    heroSizeId: "4x6",
    variants: [
      { sizeId: "4x6", layoutId: "6-mixed-grid", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "6-mixed-grid-5x7", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "6-mixed-grid-8x10", displayName: "8×10" },
    ],
  },
  {
    familyId: "three-mixed",
    name: "3 Photos Mixed",
    description: "One large landscape with two smaller portraits",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "3-mixed-8x10-4x6", displayName: "8×10 + 4×6" },
      { sizeId: "5x7", layoutId: "3-mixed", displayName: "8×10 + 5×7" },
      { sizeId: "11x14", layoutId: "3-mixed-11x14-8x10", displayName: "11×14 + 8×10" },
    ],
  },
  {
    familyId: "three-wide",
    name: "3 Wide Photos",
    description: "Three landscape photos in a horizontal row",
    heroSizeId: "8x10",
    variants: [
      { sizeId: "4x6", layoutId: "triple-row-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "triple-row-5x7", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "triple-row", displayName: "8×10" },
      { sizeId: "11x14", layoutId: "triple-row-11x14", displayName: "11×14" },
    ],
  },
  {
    familyId: "triple-column",
    name: "Triple Column",
    description: "Three portrait photos stacked vertically",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "triple-column-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "triple-column", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "triple-column-8x10", displayName: "8×10" },
    ],
  },
  {
    familyId: "instagram-grid",
    name: "Instagram Grid",
    description: "Square photos in a grid layout",
    heroSizeId: "4x6",
    variants: [
      { sizeId: "4x6", layoutId: "instagram-square", displayName: "9 Photos" },
      { sizeId: "5x7", layoutId: "instagram-square-16", displayName: "16 Photos" },
      { sizeId: "8x10", layoutId: "instagram-square-25", displayName: "25 Photos" },
    ],
  },
  {
    familyId: "three-circle",
    name: "3 Circles",
    description: "Three circular openings in a row",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "3-circles-4x4", displayName: '4"' },
      { sizeId: "5x7", layoutId: "3-circles", displayName: '5"' },
      { sizeId: "8x10", layoutId: "3-circles-8x8", displayName: '8"' },
    ],
  },
  {
    familyId: "four-circle",
    name: "4 Circles",
    description: "Four circular openings in a 2×2 grid",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "4-circles-4x4", displayName: '4"' },
      { sizeId: "5x7", layoutId: "4-circles", displayName: '5"' },
      { sizeId: "8x10", layoutId: "4-circles-8x8", displayName: '8"' },
    ],
  },
  {
    familyId: "three-oval",
    name: "3 Ovals",
    description: "Three oval openings in a row",
    heroSizeId: "5x7",
    variants: [
      { sizeId: "4x6", layoutId: "3-ovals-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "3-ovals-5x7", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "3-ovals-8x10", displayName: "8×10" },
    ],
  },
  {
    familyId: "bottom-weighted",
    name: "Bottom Weighted",
    description: "Single opening with heavier bottom mat border",
    heroSizeId: "8x10",
    variants: [
      { sizeId: "4x6", layoutId: "weight-bottom-4x6", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "weight-bottom-5x7", displayName: "5×7" },
      { sizeId: "8x10", layoutId: "weight-bottom", displayName: "8×10" },
      { sizeId: "11x14", layoutId: "weight-bottom-11x14", displayName: "11×14" },
      { sizeId: "16x20", layoutId: "weight-bottom-16x20", displayName: "16×20" },
    ],
  },
  {
    familyId: "fifteen-photo",
    name: "15 Photos",
    description: "Fifteen photos in a 3×5 grid layout",
    heroSizeId: "4x6",
    variants: [
      { sizeId: "4x6", layoutId: "15-photo", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "15-photo-5x7", displayName: "5×7" },
    ],
  },
  {
    familyId: "fifteen-photo-compact",
    name: "15 Photos Compact",
    description: "Fifteen square photos in a compact 3×5 grid",
    heroSizeId: "4x6",
    variants: [
      { sizeId: "4x6", layoutId: "15-photo-compact", displayName: "4×6" },
      { sizeId: "5x7", layoutId: "15-photo-compact-5x7", displayName: "5×7" },
    ],
  },
];

/**
 * Get a layout family by ID
 */
export function getLayoutFamily(familyId: LayoutFamilyId): LayoutFamily | undefined {
  return LAYOUT_FAMILIES.find((f) => f.familyId === familyId);
}

/**
 * Get all layout IDs that belong to any family
 */
export function getFamilyLayoutIds(): Set<CollageLayoutType> {
  const ids = new Set<CollageLayoutType>();
  LAYOUT_FAMILIES.forEach((family) => {
    family.variants.forEach((v) => ids.add(v.layoutId));
  });
  return ids;
}

/**
 * Get the hero layout for a family (the default size variant to display)
 */
export function getHeroLayoutForFamily(familyId: LayoutFamilyId): CollageLayout | undefined {
  const family = getLayoutFamily(familyId);
  if (!family) return undefined;

  const heroVariant = family.variants.find((v) => v.sizeId === family.heroSizeId);
  if (!heroVariant) {
    const first = family.variants[0];
    return first ? COLLAGE_LAYOUTS.find((l) => l.id === first.layoutId) : undefined;
  }
  return COLLAGE_LAYOUTS.find((l) => l.id === heroVariant.layoutId);
}

/**
 * Get the layout for a specific family size variant
 */
export function getLayoutForFamilySize(
  familyId: LayoutFamilyId,
  sizeId: VariantSizeId
): CollageLayout | undefined {
  const family = getLayoutFamily(familyId);
  if (!family) return undefined;

  const variant = family.variants.find((v) => v.sizeId === sizeId);
  if (!variant) return undefined;

  return COLLAGE_LAYOUTS.find((l) => l.id === variant.layoutId);
}

/**
 * Check if a family has a variant for a specific size
 */
export function familyHasSize(familyId: LayoutFamilyId, sizeId: VariantSizeId): boolean {
  const family = getLayoutFamily(familyId);
  if (!family) return false;
  return family.variants.some((v) => v.sizeId === sizeId);
}

/**
 * Get non-family layouts (standalone layouts that are not part of any family)
 */
export function getStandaloneLayouts(): CollageLayout[] {
  const familyLayoutIds = getFamilyLayoutIds();
  return COLLAGE_LAYOUTS.filter((layout) => !familyLayoutIds.has(layout.id));
}

/**
 * Maps filter size IDs to variant size IDs for family selection
 */
export function filterSizeToVariantSize(filterId: FilterSizeId): VariantSizeId | null {
  const mapping: Record<FilterSizeId, VariantSizeId | null> = {
    "4x6": "4x6",
    "5x7": "5x7",
    "8x10": "8x10",
    "11x14": "11x14",
    "16x20": "16x20",
    square: null, // Square doesn't map to portrait variants
  };
  return mapping[filterId] ?? null;
}
