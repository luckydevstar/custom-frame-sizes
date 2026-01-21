/**
 * Shadowbox Color Gateway Image Management
 *
 * This file manages images and metadata for shadowbox color gateway pages.
 * Filters frames.json for category === 'shadowbox' and provides color-specific data.
 *
 * NOTE: Requires frames data from @framecraft/data
 * Usage: import frames from '@framecraft/data/frames.json'
 */

// ============================================================================
// TYPES
// ============================================================================

export interface Frame {
  id: string;
  name: string;
  colorName?: string;
  category: string;
  alternateImages?: Array<{
    type: string;
    url: string;
    alt: string;
  }>;
}

// ============================================================================
// PLACEHOLDER CONFIGURATION
// ============================================================================

/**
 * Generic shadowbox lifestyle images used when color-specific photos aren't available.
 * These show various memorabilia displays in shadowbox frames.
 */
const PLACEHOLDER_IMAGE_POOL = [
  "/frames/10478/lifestyle_1.jpg",
  "/frames/10479/lifestyle_1.jpg",
  "/frames/10475/lifestyle_1.jpg",
];

// ============================================================================
// SHADOWBOX COLOR METADATA
// ============================================================================

/**
 * Shadowbox color information with memorabilia-focused descriptions.
 * Optimized for 3D displays, collectibles, and preservation needs.
 */
export const SHADOWBOX_COLOR_METADATA: Record<
  string,
  {
    displayName: string;
    slug: string;
    hex: string;
    description: string;
    designStyle: string;
    bestFor: string[];
  }
> = {
  Black: {
    displayName: "Black",
    slug: "black",
    hex: "#1a1a1a",
    description:
      "Modern black shadowbox frames create professional displays perfect for sports jerseys, medals, and contemporary memorabilia.",
    designStyle: "Modern, Professional, Bold",
    bestFor: ["Sports jerseys", "Military medals", "Concert memorabilia", "Modern collectibles"],
  },
  White: {
    displayName: "White",
    slug: "white",
    hex: "#f5f5f5",
    description:
      "Clean white shadowbox frames offer gallery-style presentation ideal for signed memorabilia and light-toned collections.",
    designStyle: "Contemporary, Clean, Gallery",
    bestFor: ["Signed photos", "Light jerseys", "Wedding keepsakes", "Art collections"],
  },
  Brown: {
    displayName: "Brown",
    slug: "brown",
    hex: "#654321",
    description:
      "Warm brown shadowbox frames provide traditional elegance perfect for vintage collectibles and wood-toned memorabilia.",
    designStyle: "Traditional, Warm, Rustic",
    bestFor: ["Vintage memorabilia", "Vinyl records", "Heirloom displays", "Classic collectibles"],
  },
  Silver: {
    displayName: "Silver",
    slug: "silver",
    hex: "#c0c0c0",
    description:
      "Sleek silver shadowbox frames add metallic sophistication ideal for medals, awards, and contemporary achievement displays.",
    designStyle: "Metallic, Elegant, Modern",
    bestFor: ["Athletic medals", "Corporate awards", "Achievement displays", "Modern collectibles"],
  },
  Gold: {
    displayName: "Gold",
    slug: "gold",
    hex: "#d4af37",
    description:
      "Luxurious gold shadowbox frames deliver premium elegance perfect for championship memorabilia and formal award displays.",
    designStyle: "Luxurious, Formal, Premium",
    bestFor: ["Championship items", "Military honors", "Formal awards", "Premium collectibles"],
  },
  Blue: {
    displayName: "Blue",
    slug: "blue",
    hex: "#4a6d7c",
    description:
      "Unique blue shadowbox frames offer distinctive styling perfect for nautical themes, school colors, and statement displays.",
    designStyle: "Distinctive, Nautical, Bold",
    bestFor: ["Nautical memorabilia", "School colors", "Team displays", "Unique collectibles"],
  },
  Natural: {
    displayName: "Natural",
    slug: "natural",
    hex: "#d4a574",
    description:
      "Organic natural wood shadowbox frames showcase authentic grain patterns perfect for eco-friendly and rustic displays.",
    designStyle: "Organic, Eco-Friendly, Rustic",
    bestFor: ["Vintage items", "Nature collectibles", "Rustic displays", "Organic memorabilia"],
  },
};

// ============================================================================
// SHADOWBOX FRAME COUNTING
// ============================================================================

/**
 * Count shadowbox frames available in each color.
 * Returns object with color names as keys and frame counts as values.
 * Normalizes "Barn Blue" to "Blue" for consistent metadata mapping.
 */
export function getShadowboxColorCounts(frames: Frame[]): Record<string, number> {
  const shadowboxFrames = frames.filter((f) => f.category === "shadowbox");

  const counts: Record<string, number> = {};

  shadowboxFrames.forEach((frame) => {
    if (frame.colorName) {
      // Normalize "Barn Blue" to "Blue" to match SHADOWBOX_COLOR_METADATA
      const normalizedColor = frame.colorName === "Barn Blue" ? "Blue" : frame.colorName;
      counts[normalizedColor] = (counts[normalizedColor] || 0) + 1;
    }
  });

  return counts;
}

// ============================================================================
// IMAGE RETRIEVAL FUNCTIONS
// ============================================================================

/**
 * Get the representative hub card image for a shadowbox color.
 * Automatically selects the best lifestyle image from available shadowbox frames.
 * Prioritizes lifestyle images that show memorabilia displays.
 */
export function getShadowboxColorHubImage(colorName: string, frames: Frame[]): string {
  const normalizedColor = colorName.toLowerCase();

  // Handle special case for "Barn Blue" which appears as "Blue" in metadata
  const searchColor = colorName === "Blue" ? "barn blue" : normalizedColor;

  // Get all shadowbox frames in this color
  const colorFrames = frames.filter(
    (f) => f.category === "shadowbox" && f.colorName?.toLowerCase() === searchColor
  );

  // First pass: Look for lifestyle images
  for (const frame of colorFrames) {
    const firstLifestyle = frame.alternateImages?.find((img) => img.type === "lifestyle");
    if (firstLifestyle) {
      return firstLifestyle.url;
    }
  }

  // Second pass: Use corner or profile images if no lifestyle available
  for (const frame of colorFrames) {
    const firstCorner = frame.alternateImages?.find((img) => img.type === "corner");
    if (firstCorner) {
      return firstCorner.url;
    }
  }

  // Final fallback to placeholder pool
  return PLACEHOLDER_IMAGE_POOL[0];
}

/**
 * Get all lifestyle images for a specific shadowbox color.
 * Returns shadowbox-specific images for memorabilia display inspiration.
 */
export function getShadowboxColorLifestyleImages(
  colorName: string,
  frames: Frame[]
): Array<{
  url: string;
  alt: string;
  isPlaceholder: boolean;
}> {
  const normalizedColor = colorName.toLowerCase();
  const searchColor = colorName === "Blue" ? "barn blue" : normalizedColor;

  // Get shadowbox frames in this color
  const colorFrames = frames.filter(
    (f) => f.category === "shadowbox" && f.colorName?.toLowerCase() === searchColor
  );

  const lifestyleImages: Array<{ url: string; alt: string; isPlaceholder: boolean }> = [];

  colorFrames.forEach((frame) => {
    const frameLifestyle = frame.alternateImages?.filter((img) => img.type === "lifestyle") || [];
    frameLifestyle.forEach((img) => {
      lifestyleImages.push({
        url: img.url,
        alt: img.alt,
        isPlaceholder: false,
      });
    });
  });

  // If no lifestyle images found, use placeholders
  if (lifestyleImages.length === 0) {
    return PLACEHOLDER_IMAGE_POOL.slice(0, 3).map((url) => ({
      url,
      alt: `Professional shadowbox frame showcasing quality memorabilia display options for collectibles and three-dimensional keepsakes`,
      isPlaceholder: true,
    }));
  }

  return lifestyleImages;
}

/**
 * Get a hero image for a shadowbox color gateway page.
 * Returns the first high-quality lifestyle or display image.
 */
export function getShadowboxColorHeroImage(
  colorName: string,
  frames: Frame[]
): {
  url: string;
  alt: string;
  isPlaceholder: boolean;
} {
  const images = getShadowboxColorLifestyleImages(colorName, frames);
  return (
    images[0] || {
      url: PLACEHOLDER_IMAGE_POOL[0],
      alt: "Custom shadowbox frames for professional memorabilia display",
      isPlaceholder: true,
    }
  );
}

/**
 * Get gallery images for mid-page visual break (2-3 images).
 * Skips first image (used in hero), gets next 2-3 images.
 */
export function getShadowboxColorGalleryImages(
  colorName: string,
  frames: Frame[]
): Array<{
  url: string;
  alt: string;
  isPlaceholder: boolean;
}> {
  const allImages = getShadowboxColorLifestyleImages(colorName, frames);

  // Skip first image (used in hero), get next 2-3
  return allImages.slice(1, 4);
}

/**
 * Get FAQ sidebar images (3 images).
 * Selects diverse images from collection (first, middle, last).
 */
export function getShadowboxColorFAQSidebarImages(
  colorName: string,
  frames: Frame[]
): Array<{
  url: string;
  alt: string;
  isPlaceholder: boolean;
}> {
  const allImages = getShadowboxColorLifestyleImages(colorName, frames);

  // Select diverse images: first, middle, last from collection
  const indices = [0, Math.floor(allImages.length / 2), Math.min(allImages.length - 1, 2)];
  return indices.map((i) => allImages[i] || allImages[0]).filter(Boolean);
}

/**
 * Check if a shadowbox color is using placeholder images.
 * Useful for displaying "More photos coming soon" messages.
 */
export function isUsingShadowboxPlaceholderImages(colorName: string, frames: Frame[]): boolean {
  const images = getShadowboxColorLifestyleImages(colorName, frames);
  return images.length === 0 || images[0]?.isPlaceholder === true;
}
