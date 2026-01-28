/**
 * Asset URL Helper Functions
 *
 * Provides utilities for generating CDN URLs for static assets.
 * Supports both local development (serving from /public) and production (Cloudflare R2 CDN).
 *
 * CDN Structure:
 * - cfs-shared-assets: frames/, mats/, comic/, diploma/, military/, puzzle-frames/, etc.
 * - cfs-store-a-assets: assets/ (brand/, hero/, canvas/, images/, etc.)
 *
 * Environment Variables:
 * - NEXT_PUBLIC_CDN_BASE_URL: Single base URL for all buckets (optional)
 * - NEXT_PUBLIC_CDN_SHARED_URL: URL for cfs-shared-assets bucket (required if not using BASE_URL)
 * - NEXT_PUBLIC_CDN_STORE_A_URL: URL for cfs-store-a-assets bucket (required if not using BASE_URL)
 */

/**
 * Get the CDN base URL from environment variables
 * If NEXT_PUBLIC_CDN_BASE_URL is set, use it for all buckets
 * Otherwise, use bucket-specific URLs
 */
export function getCdnBaseUrl(): string | null {
  if (typeof window !== "undefined") {
    // Client-side: use window or process.env
    return (
      (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_CDN_BASE_URL ||
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CDN_BASE_URL) ||
      null
    );
  }
  // Server-side: use process.env
  return process.env?.NEXT_PUBLIC_CDN_BASE_URL || null;
}

/**
 * Get the shared assets CDN URL
 */
export function getSharedCdnUrl(): string | null {
  const baseUrl = getCdnBaseUrl();
  if (baseUrl) {
    // If base URL is set, append bucket name
    return baseUrl;
  }

  // Otherwise, use bucket-specific URL
  if (typeof window !== "undefined") {
    return (
      (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_CDN_SHARED_URL ||
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CDN_SHARED_URL) ||
      null
    );
  }
  return process.env?.NEXT_PUBLIC_CDN_SHARED_URL || null;
}

/**
 * Get the store-specific assets CDN URL
 */
export function getStoreCdnUrl(): string | null {
  const baseUrl = getCdnBaseUrl();
  if (baseUrl) {
    // If base URL is set, append bucket name
    return baseUrl;
  }

  // Otherwise, use bucket-specific URL
  if (typeof window !== "undefined") {
    return (
      (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_CDN_STORE_A_URL ||
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CDN_STORE_A_URL) ||
      null
    );
  }
  return process.env?.NEXT_PUBLIC_CDN_STORE_A_URL || null;
}

/**
 * Get the shared assets bucket name
 */
export function getSharedBucketName(): string {
  return process.env.NEXT_PUBLIC_CDN_SHARED_BUCKET || "cfs-shared-assets";
}

/**
 * Get the store-specific assets bucket name
 */
export function getStoreBucketName(): string {
  return process.env.NEXT_PUBLIC_CDN_STORE_BUCKET || "cfs-store-a-assets";
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
 * @param path - Relative path from public directory (e.g., "frames/8576/corner.jpg")
 * @returns Full CDN URL or local path
 *
 * @example
 * getSharedAssetUrl("frames/8576/corner.jpg")
 * // Returns: "https://cfs-shared-assets.yourdomain.com/frames/8576/corner.jpg"
 * // Or: "https://cdn.yourdomain.com/cfs-shared-assets/frames/8576/corner.jpg" (if using BASE_URL)
 * // Or locally: "/frames/8576/corner.jpg"
 */
export function getSharedAssetUrl(path: string): string {
  const cdnUrl = getSharedCdnUrl();
  if (cdnUrl) {
    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const normalizedUrl = normalizeCdnUrl(cdnUrl);

    // Check if using base URL (needs bucket name) or bucket-specific URL
    const baseUrl = getCdnBaseUrl();
    if (baseUrl) {
      // Using base URL - append bucket name
      const bucketName = getSharedBucketName();
      return `${normalizeCdnUrl(baseUrl)}/${bucketName}/${cleanPath}`;
    } else {
      // Using bucket-specific URL - use as-is
      return `${normalizedUrl}/${cleanPath}`;
    }
  }
  // Fallback to local path
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Get CDN URL for a store-specific asset (assets/ directory)
 *
 * @param path - Relative path from assets directory (e.g., "brand/logo.png" or "hero/video.mp4")
 * @returns Full CDN URL or local path
 *
 * @example
 * getStoreAssetUrl("brand/logo.png")
 * // Returns: "https://cfs-store-a-assets.yourdomain.com/assets/brand/logo.png"
 * // Or: "https://cdn.yourdomain.com/cfs-store-a-assets/assets/brand/logo.png" (if using BASE_URL)
 * // Or locally: "/assets/brand/logo.png"
 */
export function getStoreAssetUrl(path: string): string {
  const cdnUrl = getStoreCdnUrl();
  if (cdnUrl) {
    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    // Ensure path starts with "assets/"
    const assetPath = cleanPath.startsWith("assets/") ? cleanPath : `assets/${cleanPath}`;
    const normalizedUrl = normalizeCdnUrl(cdnUrl);

    // Check if using base URL (needs bucket name) or bucket-specific URL
    const baseUrl = getCdnBaseUrl();
    if (baseUrl) {
      // Using base URL - append bucket name
      const bucketName = getStoreBucketName();
      return `${normalizeCdnUrl(baseUrl)}/${bucketName}/${assetPath}`;
    } else {
      // Using bucket-specific URL - use as-is
      return `${normalizedUrl}/${assetPath}`;
    }
  }
  // Fallback to local path
  const localPath = path.startsWith("/") ? path : `/${path}`;
  return localPath.startsWith("/assets/") ? localPath : `/assets/${localPath}`;
}

/**
 * Get CDN URL for a frame image
 *
 * @param sku - Frame SKU
 * @param imageType - Type of frame image (corner, top, bottom, left, right, profile)
 * @returns Full CDN URL or local path
 *
 * @example
 * getFrameImageUrl("8576", "corner")
 * // Returns: "https://cdn.yourdomain.com/cfs-shared-assets/frames/8576/corner.jpg"
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
 *
 * @example
 * getMatImageUrl("1")
 * // Returns: "https://cdn.yourdomain.com/cfs-shared-assets/mats/1.jpg"
 */
export function getMatImageUrl(id: string): string {
  return getSharedAssetUrl(`mats/${id}.jpg`);
}

/**
 * Get CDN URL for a hero video/image
 *
 * @param filename - Hero video/image filename (e.g., "collage-wall-1.mp4")
 * @returns Full CDN URL or local path
 *
 * @example
 * getHeroAssetUrl("collage-wall-1.mp4")
 * // Returns: "https://cdn.yourdomain.com/cfs-store-a-assets/assets/hero/collage-wall-1.mp4"
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
 * @example
 * getCanvasImageUrl("10117-lifestyle-a.jpg")
 * // Returns: "https://cdn.yourdomain.com/cfs-store-a-assets/assets/canvas/10117-lifestyle-a.jpg"
 */
export function getCanvasImageUrl(filename: string): string {
  return getStoreAssetUrl(`canvas/${filename}`);
}

/**
 * Get CDN URL for a brand asset (logo, etc.)
 *
 * @param path - Path relative to assets/brand (e.g., "logo.png" or "cfs-logo.svg")
 * @returns Full CDN URL or local path
 *
 * @example
 * getBrandAssetUrl("logo.png")
 * // Returns: "https://cfs-store-a-assets.yourdomain.com/assets/brand/logo.png"
 */
export function getBrandAssetUrl(path: string): string {
  return getStoreAssetUrl(`brand/${path}`);
}

/**
 * Get CDN URL for a mat swatch image
 *
 * @param path - Mat swatch path (e.g., "1.jpg" or "swatches/1.jpg" or "mat-id/swatch.jpg")
 * @returns Full CDN URL or local path
 *
 * @example
 * getMatSwatchUrl("1.jpg")
 * // Returns: "https://cfs-shared-assets.yourdomain.com/mats/1.jpg"
 * getMatSwatchUrl("swatches/1.jpg")
 * // Returns: "https://cfs-shared-assets.yourdomain.com/mats/swatches/1.jpg"
 */
export function getMatSwatchUrl(path: string): string {
  // Handle different path formats
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  if (cleanPath.startsWith("mats/")) {
    return getSharedAssetUrl(cleanPath);
  }
  if (cleanPath.startsWith("swatches/")) {
    return getSharedAssetUrl(`mats/${cleanPath}`);
  }
  // Assume it's a direct mat file (e.g., "1.jpg" or "mat-id/swatch.jpg")
  return getSharedAssetUrl(`mats/${cleanPath}`);
}

/**
 * Check if CDN is configured
 */
export function isCdnConfigured(): boolean {
  return getSharedCdnUrl() !== null || getStoreCdnUrl() !== null;
}
