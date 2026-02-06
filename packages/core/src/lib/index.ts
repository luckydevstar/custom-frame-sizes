/**
 * Lib Utilities
 *
 * Library-level utilities for FrameCraft:
 * - holiday-calculator.ts: Holiday date calculations (Easter, Thanksgiving, etc.)
 * - seasonal-collections.ts: Seasonal image collection configuration
 * - nameplate-positioning.ts: Brass nameplate positioning calculations
 * - color-gateway-images.ts: Color gateway page image management
 * - shadowbox-color-images.ts: Shadowbox color gateway image management
 * - style-gateway-images.ts: Style gateway image management
 * - stock-images.ts: Stock image library factory (requires image data injection)
 */

export * from "./holiday-calculator";
export * from "./seasonal-collections";
export * from "./nameplate-positioning";
// Color gateway functions are exported from services/gateway-colors only (single source of truth)
export type { Frame as ColorGatewayFrame } from "./color-gateway-images";
// Export shadowbox-color-images functions but avoid duplicate Frame type
export {
  getShadowboxColorLifestyleImages,
  getShadowboxColorHeroImage,
  getShadowboxColorFAQSidebarImages,
  getShadowboxColorGalleryImages,
  getShadowboxColorHubImage,
  getShadowboxColorCounts,
  isUsingShadowboxPlaceholderImages,
} from "./shadowbox-color-images";
export type { Frame as ShadowboxColorFrame } from "./shadowbox-color-images";
// Export style-gateway-images functions but avoid duplicate Frame type
export {
  STYLE_METADATA,
  getStyleLifestyleImages,
  getStyleHeroImage,
  getStyleHubImage,
  getFramesForStyle,
  countFramesPerStyle,
} from "./style-gateway-images";
export type { Frame as StyleGatewayFrame } from "./style-gateway-images";
export * from "./stock-images";
export * from "./diploma-insert-images";
export * from "./diploma-lifestyle-images";
export * from "./cd-lifestyle-images";
export * from "./record-album-lifestyle-images";
export {
  GOLD_SILVER_BRONZE_COVERS,
  MODERN_COVERS,
  SLABBED_COVERS,
  getComicCoverPool,
  getRandomComicCover,
  getRandomComicCovers,
  createCoverSeed,
  getCoversForConfig as getComicCoversForConfig,
} from "./comic-cover-images";
export * from "./card-insert-images";
export type { MagazineInsertSet } from "./magazine-cover-images";
export {
  MAGAZINE_INSERT_SETS,
  GENERIC_MAGAZINE_COVERS,
  getInsertSetsForSize,
  getMagazineCoverPool,
  getRandomMagazineCover,
  getRandomMagazineCovers,
  getCoversForConfig as getMagazineCoversForConfig,
} from "./magazine-cover-images";
export * from "./magazine-reference-data";
export {
  getNeedleworkInsertPaths,
  getRandomNeedleworkInsertPath,
} from "./needlework-insert-images";
export {
  getNeedleworkLifestyleImages,
  getRandomNeedleworkLifestyleImage,
} from "./needlework-lifestyle-images";
export type { NeedleworkLifestyleImage } from "./needlework-lifestyle-images";
export {
  getNewspaperInsertPaths,
  getRandomNewspaperInsertPath,
  getUniqueRandomNewspaperInsertPaths,
} from "./newspaper-insert-images";
export {
  getNewspaperLifestyleImages,
  getRandomNewspaperLifestyleImage,
} from "./newspaper-lifestyle-images";
export type { NewspaperLifestyleImage } from "./newspaper-lifestyle-images";
export { NEWSPAPER_PRESETS, getNewspaperLayoutsForSize } from "./newspaper-layouts";
export type { NewspaperLayoutType, NewspaperLayout, NewspaperOpening } from "./newspaper-layouts";
// Collage layouts: explicit exports to avoid duplicate names already exported from utils (CollageOpening, DEFAULT_FRAME_MOLDING_WIDTH, PLAQUE_FRAME_EXTENSION, getLayoutsByCategory)
export {
  PHOTO_SIZES,
  FILTER_SIZES,
  COLLAGE_MAT_BORDER,
  COLLAGE_SPACING,
  COLLAGE_LAYOUTS,
  getLayoutById,
  getLayoutsByOpeningCount,
  calculateInteriorDimensions,
  getAvailableOpeningCounts,
  getAvailableCategories,
  getCollageCategories,
  CONSOLIDATED_CATEGORY_MAP,
  CONSOLIDATED_CATEGORY_INFO,
  getConsolidatedCategories,
  getConsolidatedCategoryForLayout,
  SIZE_FILTER_INFO,
  getSizeFilterOptions,
  getFilterIdsFromDisplayIds,
  filterLayoutsBySize,
  LAYOUT_FAMILIES,
  getLayoutFamily,
  getFamilyLayoutIds,
  getHeroLayoutForFamily,
  getLayoutForFamilySize,
  familyHasSize,
  getStandaloneLayouts,
  filterSizeToVariantSize,
} from "./collage-layouts";
export type {
  PhotoSizeId,
  FilterSizeId,
  OpeningShape,
  CollageCategory,
  LayoutFamilyId,
  VariantSizeId,
  CollageLayoutType,
  CollageLayout,
  CategoryWithLayouts,
  ConsolidatedCategory,
  DisplaySizeId,
  SizeFilterOption,
  LayoutFamilyVariant,
  LayoutFamily,
} from "./collage-layouts";
// Re-export CollageOpening from collage-layouts as CollageLayoutOpening to avoid conflict with utils/specialty/collage-math
export type { CollageOpening as CollageLayoutOpening } from "./collage-layouts";
export {
  getAvailableSets,
  getCollageImagePathsForLayout,
  type CollagePhotoSet,
} from "./collage-insert-images";
export { getSchoolLayoutPresetImages, isSchoolDaysPresetLayout } from "./school-days-inserts";
export {
  getRandomPlaybillInserts,
  getRandomTicketInserts,
  createPlaybillInsertSeed,
} from "./playbill-insert-images";
export type { TicketInsert } from "./playbill-insert-images";
export {
  getRandomPuzzlePhoto,
  getRandomPuzzleImage,
  getPuzzleLifestyleImages,
} from "./puzzle-lifestyle-images";
export type { PuzzleLifestylePhoto } from "./puzzle-lifestyle-images";
