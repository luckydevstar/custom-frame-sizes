/**
 * Shared Components
 *
 * Reusable components used across multiple designers and pages.
 */

export { TermsOfServiceModal } from "./TermsOfServiceModal";
export { ObjectUploader } from "./ObjectUploader";
export { ImageGallery } from "./ImageGallery";
export type { GalleryImage } from "./ImageGallery";
export { PhotoUploadOptions } from "./PhotoUploadOptions";
export { ImageEditor } from "./ImageEditor";
// ARViewer not re-exported here: it imports @google/model-viewer which uses `self` (browser-only).
// Export it from the main package index via "./components/shared/ARViewer" to avoid SSR errors.
export { FrameDetailCarousel } from "./FrameDetailCarousel";
export { FrameCornerSwatch } from "./FrameCornerSwatch";
export { FrameProfileDiagram } from "./FrameProfileDiagram";
