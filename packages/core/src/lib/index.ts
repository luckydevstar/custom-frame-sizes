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
