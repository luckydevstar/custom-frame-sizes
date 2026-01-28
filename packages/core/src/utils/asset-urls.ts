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
 * Get environment variable (works in both client and server)
 */
function getEnvVar(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
}

/**
 * Get the shared assets CDN URL
 */
function getSharedCdnUrl(): string | null {
  const value = getEnvVar("NEXT_PUBLIC_CDN_SHARED_URL");
  return value || null;
}

/**
 * Get the store-a assets CDN URL
 */
function getStoreCdnUrl(): string | null {
  const value = getEnvVar("NEXT_PUBLIC_CDN_STORE_A_URL");
  return value || null;
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

  // Fallback to local path
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
 * Get CDN URL for a canvas lifestyle image
 *
 * @param filename - Canvas image filename (e.g., "10117-lifestyle-a.jpg")
 * @returns Full CDN URL or local path
 *
 * Note: Canvas images are stored in frames/{sku}/ directory
 * Format: frames/10117/lifestyle-a.jpg
 */
export function getCanvasImageUrl(filename: string): string {
  // Extract SKU from filename (e.g., "10117-lifestyle-a.jpg" -> "10117")
  const sku = filename.split("-")[0];
  // Extract the rest (e.g., "lifestyle-a.jpg")
  const imageName = filename.substring(sku?.length ?? 0 + 1);

  return getSharedAssetUrl(`frames/${sku}/${imageName}`);
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
