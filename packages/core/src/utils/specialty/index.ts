/**
 * Specialty Designer Utilities
 *
 * Utilities for specialty frame designers (puzzle, comic, jersey, playbill, etc.)
 */

export * from "./puzzle-sizes";
export * from "./comic-formats";
export * from "./comic-layouts";
export * from "./playbill-layouts";
export * from "./mat-tiling";
export * from "./jersey-layouts";
export * from "./jersey-mat-paths";
export * from "./jersey-teams";
export * from "./collage-math";
export * from "./certificate-sizes";
export * from "./diploma-sizes";
export type { CDLayoutType, CDLayout, CDPriceTier } from "./cd-layouts";
export {
  CD_SPECS,
  CD_LAYOUTS,
  getCDLayout,
  getAllCDLayouts,
  cdLayoutRequiresCover,
  getCDOrderDimensions,
  getCDPricingDimensions,
  getCDPriceTier,
} from "./cd-layouts";
export type {
  RecordAlbumLayoutType,
  RecordAlbumOpening,
  RecordAlbumLayout,
  RecordAlbumPriceTier,
} from "./record-album-layouts";
export {
  VINYL_DIMENSIONS,
  RECORD_ALBUM_LAYOUTS,
  getRecordAlbumLayout,
  getRecordAlbumLayoutWithMolding,
  getAllRecordAlbumLayouts,
  layoutRequiresCover,
  getLayoutPricingDimensions,
  getRecordAlbumPriceTier,
} from "./record-album-layouts";
export * from "./svg-path-generator";
export type { CardFormat } from "./card-formats";
export {
  CARD_FORMATS,
  getCardFormatById,
  getPSAFormat,
  getOtherGradingFormats,
  CARD_DEFAULT_MAT_BORDER,
  isSlabbedFormat as isSlabbedCardFormat,
} from "./card-formats";
export * from "./card-layouts";
export * from "./magazine-sizes";
export * from "./magazine-layouts";
