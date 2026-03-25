/**
 * Image Optimization Utilities for Next.js Image Component
 *
 * This module provides best practices and utilities for optimizing images
 * using Next.js Image component with responsive sizing and lazy loading.
 */

/**
 * Responsive image sizes for different breakpoints
 * Used in Image component's "sizes" prop
 */
export const RESPONSIVE_SIZES = {
  // Hero images - full width
  hero: "(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px",

  // Container images - content width
  container: "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1024px",

  // Cards in grid - responsive columns
  card: "(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(50vw - 2rem), calc(33vw - 1rem)",

  // Thumbnail images - small fixed
  thumbnail: "(max-width: 640px) 80px, 120px",

  // Gallery images - variable width
  gallery:
    "(max-width: 640px) calc(50vw - 1rem), (max-width: 1024px) calc(33vw - 1rem), calc(25vw - 1rem)",

  // Icon images - very small
  icon: "32px",

  // Avatar images
  avatar: "(max-width: 640px) 40px, 48px",
};

/**
 * Image quality presets
 * Recommended quality values for different image types
 */
export const IMAGE_QUALITY = {
  // High quality for hero/showcase images
  hero: 85,

  // Medium-high for product/content images
  product: 80,

  // Medium for thumbnails
  thumbnail: 75,

  // Lower for background images
  background: 70,

  // Very high for photography/art
  premium: 90,
};

/**
 * Image optimization configuration
 */
export const IMAGE_CONFIG = {
  // Always use Next.js Image component (not <img>)
  useNextImage: true,

  // Enable lazy loading for below-fold images
  lazyLoad: true,

  // Use blur placeholders for perceived performance
  usePlaceholder: true,

  // Enable responsive sizing
  responsive: true,

  // Supported formats (modern first)
  formats: ["image/webp", "image/avif", "image/jpeg"],

  // Disable optimization for external CDN images if needed
  unoptimized: false,
};

/**
 * Common image optimization patterns
 */
export const IMAGE_PATTERNS = {
  // Above-fold hero image
  heroImage: {
    priority: true,
    loading: undefined, // Don't use lazy for above-fold
    placeholder: "blur",
    quality: IMAGE_QUALITY.hero,
    sizes: RESPONSIVE_SIZES.hero,
  },

  // Product/content images (mostly below-fold)
  productImage: {
    priority: false,
    loading: "lazy",
    placeholder: "blur",
    quality: IMAGE_QUALITY.product,
    sizes: RESPONSIVE_SIZES.container,
  },

  // Gallery/grid images
  galleryImage: {
    priority: false,
    loading: "lazy",
    placeholder: "empty", // Can use empty for gallery performance
    quality: IMAGE_QUALITY.product,
    sizes: RESPONSIVE_SIZES.gallery,
  },

  // Small thumbnails
  thumbnail: {
    priority: false,
    loading: "lazy",
    placeholder: "empty",
    quality: IMAGE_QUALITY.thumbnail,
    sizes: RESPONSIVE_SIZES.thumbnail,
  },

  // Background images (decorative)
  background: {
    priority: false,
    loading: "lazy",
    placeholder: "empty",
    quality: IMAGE_QUALITY.background,
    fill: true,
  },
};

/**
 * Image format recommendations
 * Choose the best format based on content type
 */
export const FORMAT_GUIDE = {
  photographs: {
    format: "webp/jpeg",
    quality: 80,
    reason: "Photos compress well with WebP, fallback to JPEG",
  },
  illustrations: {
    format: "webp/png",
    quality: 85,
    reason: "Illustrations need lossless compression",
  },
  icons: {
    format: "svg",
    quality: "N/A",
    reason: "SVG is vector-based, scales perfectly",
  },
  logos: {
    format: "svg/png",
    quality: 90,
    reason: "SVG preferred, PNG for non-SVG support",
  },
  screenshots: {
    format: "png/webp",
    quality: 85,
    reason: "Screenshots need sharpness, WebP for size",
  },
};

/**
 * Image optimization checklist for developers
 */
export const OPTIMIZATION_CHECKLIST = [
  {
    task: "Use Next.js Image component",
    why: "Automatic responsive sizing, format conversion, lazy loading",
    check: "All <img> tags replaced with <Image>",
  },
  {
    task: "Add responsive sizes prop",
    why: "Ensures correct image size at each breakpoint",
    check: "sizes prop matches actual layout widths",
  },
  {
    task: "Set priority for above-fold images",
    why: "Improves LCP (Largest Contentful Paint)",
    check: "priority={true} on hero/above-fold images only",
  },
  {
    task: "Add placeholder blur for above-fold",
    why: "Better perceived performance during load",
    check: 'placeholder="blur" + blurDataURL for above-fold',
  },
  {
    task: "Enable lazy loading for below-fold",
    why: "Reduces initial page load",
    check: 'loading="lazy" for below-fold images',
  },
  {
    task: "Optimize image quality",
    why: "Reduces file size while maintaining visual quality",
    check: "quality=80-85 for products, =90 for premium",
  },
  {
    task: "Use WebP format with JPEG fallback",
    why: "WebP is 25-30% smaller than JPEG",
    check: "Browser auto-selects via Next.js Image",
  },
  {
    task: "Compress source images",
    why: "Smaller source = smaller optimized output",
    check: "Source images < 1MB before optimization",
  },
];

/**
 * Common mistakes to avoid
 */
export const AVOID = [
  "❌ Using <img> tag instead of <Image>",
  "❌ Forgetting sizes prop (causes layout shift)",
  "❌ Using priority={true} on all images (wastes resources)",
  "❌ Not setting width/height (causes layout shift)",
  "❌ Using 100% quality (no compression benefit)",
  "❌ Large uncompressed source images (>5MB)",
  "❌ Not using lazy loading for below-fold images",
  "❌ Ignoring WebP format (missing 25-30% size reduction)",
];
