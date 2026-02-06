/**
 * Asset URL Helper Functions
 *
 * Simple two-bucket CDN setup:
 * - Shared assets (frames, mats, comic, etc.): NEXT_PUBLIC_CDN_SHARED_URL
 * - Store-A assets (assets/ directory): NEXT_PUBLIC_CDN_STORE_A_URL
 *
 * Environment Variables:
 * - NEXT_PUBLIC_CDN_SHARED_URL: Base URL for shared assets bucket
 * - NEXT_PUBLIC_CDN_STORE_A_URL: Base URL for store-a assets bucket
 */

/**
 * Get the shared assets CDN URL
 * In Next.js, NEXT_PUBLIC_* variables are replaced at build time by webpack
 * We need to access them directly (not through a function) for webpack to replace them
 */
function getSharedCdnUrl(): string | null {
  // Direct access so webpack can replace at build time
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof process !== "undefined" && process.env) {
    return process.env.NEXT_PUBLIC_CDN_SHARED_URL || null;
  }
  return null;
}

/**
 * Get the store-a assets CDN URL
 * In Next.js, NEXT_PUBLIC_* variables are replaced at build time by webpack
 */
function getStoreCdnUrl(): string | null {
  // Direct access so webpack can replace at build time
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof process !== "undefined" && process.env) {
    return process.env.NEXT_PUBLIC_CDN_STORE_A_URL || null;
  }
  return null;
}

/**
 * Normalize CDN URL (remove trailing slash)
 */
function normalizeCdnUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Get CDN URL for a shared asset (frames, mats, comic, etc.)
 *
 * @param path - Relative path (e.g., "frames/8576/corner.jpg" or "comic/inserts/golden-silver-bronze/ActionComics_1.jpg")
 * @returns Full CDN URL or local path
 *
 * @example
 * getSharedAssetUrl("frames/8576/corner.jpg")
 * // Returns: "https://pub-d2f459227a6d44cab26325fa3d6ea821.r2.dev/frames/8576/corner.jpg"
 */
export function getSharedAssetUrl(path: string): string {
  const cdnUrl = getSharedCdnUrl();
  if (cdnUrl) {
    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const normalizedUrl = normalizeCdnUrl(cdnUrl);
    return `${normalizedUrl}/${cleanPath}`;
  }

  // Fallback to local path (served by app via /api/asset rewrites when using assets_to_use)
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Get CDN URL for a store-a asset (assets/ directory)
 *
 * @param path - Relative path from assets directory (e.g., "brand/logo.png" or "plywood-texture.png")
 * @returns Full CDN URL or local path
 *
 * @example
 * getStoreAssetUrl("plywood-texture.png")
 * // Returns: "https://pub-e7bceef7c942453b92d35da77e807c44.r2.dev/assets/plywood-texture.png"
 */
export function getStoreAssetUrl(path: string): string {
  const cdnUrl = getStoreCdnUrl();
  if (cdnUrl) {
    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    // Ensure path starts with "assets/"
    const assetPath = cleanPath.startsWith("assets/") ? cleanPath : `assets/${cleanPath}`;
    const normalizedUrl = normalizeCdnUrl(cdnUrl);
    return `${normalizedUrl}/${assetPath}`;
  }
  // Fallback to local path
  const localPath = path.startsWith("/") ? path : `/${path}`;
  return localPath.startsWith("/assets/") ? localPath : `/assets/${localPath}`;
}

/**
 * Get CDN URL for a frame image
 *
 * @param sku - Frame SKU
 * @param imageType - Type of frame image (corner, top, bottom, left, right, profile, lifestyle)
 * @returns Full CDN URL or local path
 */
export function getFrameImageUrl(
  sku: string,
  imageType: "corner" | "top" | "bottom" | "left" | "right" | "profile" | "lifestyle"
): string {
  return getSharedAssetUrl(`frames/${sku}/${imageType}.jpg`);
}

/**
 * Get CDN URL for a mat board image
 *
 * @param id - Mat board ID or filename
 * @returns Full CDN URL or local path
 */
export function getMatImageUrl(id: string): string {
  return getSharedAssetUrl(`mats/${id}.jpg`);
}

/**
 * Get CDN URL for a hero video/image
 *
 * @param filename - Hero video/image filename (e.g., "collage-wall-1.mp4")
 * @returns Full CDN URL or local path
 */
export function getHeroAssetUrl(filename: string): string {
  return getStoreAssetUrl(`hero/${filename}`);
}

/**
 * Get CDN URL for a canvas frame image (shared_assets/canvas/images)
 *
 * @param filename - Canvas image filename (e.g., "10117-lifestyle-a.jpg")
 * @returns Full CDN URL or local path
 */
export function getCanvasImageUrl(filename: string): string {
  return getSharedAssetUrl(`canvas/images/${filename}`);
}

/**
 * Get CDN URL for a brand asset (logo, etc.)
 *
 * @param path - Path relative to assets/brand (e.g., "logo.png" or "logo-blue.png")
 * @returns Full CDN URL or local path
 */
export function getBrandAssetUrl(path: string): string {
  return getStoreAssetUrl(`brand/${path}`);
}

/**
 * Check if CDN is configured
 */
export function isCdnConfigured(): boolean {
  return getSharedCdnUrl() !== null || getStoreCdnUrl() !== null;
}

/**
 * Get CDN configuration status (for debugging)
 */
export function getCdnConfig(): {
  sharedUrl: string | null;
  storeUrl: string | null;
  isConfigured: boolean;
} {
  return {
    sharedUrl: getSharedCdnUrl(),
    storeUrl: getStoreCdnUrl(),
    isConfigured: isCdnConfigured(),
  };
}
