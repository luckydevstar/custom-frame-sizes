/**
 * Color Gateway Image Management
 *
 * This file manages lifestyle images for color gateway pages.
 * Colors without dedicated lifestyle photos use placeholder images
 * from other frames until color-specific photos are uploaded.
 *
 * NOTE: Requires frames data from @framecraft/data
 * Usage: import frames from '@framecraft/data/frames.json'
 *
 * UPDATE INSTRUCTIONS:
 * When new lifestyle photos are uploaded for a color:
 * 1. Remove the color from PLACEHOLDER_COLORS array
 * 2. The system will automatically use real images from frames.json
 */

// ============================================================================
// PLACEHOLDER CONFIGURATION
// ============================================================================

/**
 * Colors currently using placeholder lifestyle images.
 * Remove color from this array when real lifestyle photos are uploaded.
 */
const PLACEHOLDER_COLORS: string[] = [
  // Add colors here that need placeholder images
];

/**
 * Generic framing lifestyle images used as placeholders.
 * These are pulled from frames with rich lifestyle collections.
 */
const PLACEHOLDER_IMAGE_POOL = [
  // From Wide Black (8446) - Gallery walls and modern interiors
  "/frames/8446/lifestyle_1.jpg",
  "/frames/8446/lifestyle_2.jpg",
  "/frames/8446/lifestyle_4.jpg",
  "/frames/8446/lifestyle_7.jpg",

  // From Slim White (6712) - Clean contemporary styling
  "/frames/6712/lifestyle_2.jpg",
  "/frames/6712/lifestyle_5.jpg",
  "/frames/6712/lifestyle_8.jpg",

  // From Slim Brown (6711) - Warm traditional settings
  "/frames/6711/lifestyle_1.jpg",
  "/frames/6711/lifestyle_3.jpg",
  "/frames/6711/lifestyle_4.jpg",
];

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
// IMAGE RETRIEVAL FUNCTIONS
// ============================================================================

/**
 * Get all lifestyle images for a specific color.
 * Returns color-specific images if available, otherwise returns placeholders.
 */
export function getColorLifestyleImages(
  colorName: string,
  frames: Frame[]
): Array<{
  url: string;
  alt: string;
  isPlaceholder: boolean;
}> {
  const normalizedColor = colorName.toLowerCase();
  const isPlaceholder = PLACEHOLDER_COLORS.map((c) => c.toLowerCase()).includes(normalizedColor);

  if (isPlaceholder) {
    // Use placeholder images with generic alt text
    return PLACEHOLDER_IMAGE_POOL.slice(0, 6).map((url) => ({
      url,
      alt: `Professional custom picture framing showcasing quality craftsmanship and versatile styling options for home and office decor`,
      isPlaceholder: true,
    }));
  }

  // Get real lifestyle images from frames in this color
  const colorFrames = frames.filter(
    (f) => f.colorName?.toLowerCase() === normalizedColor && f.category === "picture"
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

  return lifestyleImages;
}

/**
 * Get a hero image for a color gateway page.
 * Returns the first high-quality lifestyle image.
 */
export function getColorHeroImage(
  colorName: string,
  frames: Frame[]
): {
  url: string;
  alt: string;
  isPlaceholder: boolean;
} {
  const images = getColorLifestyleImages(colorName, frames);
  return (
    images[0] || {
      url: PLACEHOLDER_IMAGE_POOL[0],
      alt: "Custom picture frames in professional setting",
      isPlaceholder: true,
    }
  );
}

/**
 * Get sidebar images for FAQ section (3 images).
 */
export function getColorFAQSidebarImages(
  colorName: string,
  frames: Frame[]
): Array<{
  url: string;
  alt: string;
  isPlaceholder: boolean;
}> {
  const allImages = getColorLifestyleImages(colorName, frames);

  // Select diverse images: first, middle, last from collection
  const indices = [0, Math.floor(allImages.length / 2), Math.min(allImages.length - 1, 2)];
  return indices.map((i) => allImages[i] || allImages[0]);
}

/**
 * Get gallery images for mid-page visual break (2-3 images).
 */
export function getColorGalleryImages(
  colorName: string,
  frames: Frame[]
): Array<{
  url: string;
  alt: string;
  isPlaceholder: boolean;
}> {
  const allImages = getColorLifestyleImages(colorName, frames);

  // Skip first image (used in hero), get next 2-3
  return allImages.slice(1, 4);
}

/**
 * Check if a color is using placeholder images.
 * Useful for displaying "More photos coming soon" messages.
 */
export function isUsingPlaceholderImages(colorName: string): boolean {
  const normalizedColor = colorName.toLowerCase();
  return PLACEHOLDER_COLORS.map((c) => c.toLowerCase()).includes(normalizedColor);
}

// ============================================================================
// HUB PAGE REPRESENTATIVE IMAGES
// ============================================================================

/**
 * Preferred lifestyle image indices for hub cards.
 * These indices typically show room settings/gallery walls rather than people holding frames.
 * Based on typical lifestyle image patterns:
 * - lifestyle_1, lifestyle_2, lifestyle_4, lifestyle_7 = usually room settings
 * - lifestyle_3, lifestyle_8, lifestyle_9 = often people holding frames
 */
const PREFERRED_HUB_IMAGE_PATTERNS = [
  "lifestyle_1.jpg",
  "lifestyle_2.jpg",
  "lifestyle_4.jpg",
  "lifestyle_1.png",
  "lifestyle_2.png",
];

/**
 * Get the representative hub card image for a color.
 * Automatically selects the best room-setting lifestyle image from available frames.
 * Prioritizes images that typically show gallery walls/room settings over people holding frames.
 */
export function getColorHubImage(colorName: string, frames: Frame[]): string {
  const normalizedColor = colorName.toLowerCase();
  const isPlaceholder = PLACEHOLDER_COLORS.map((c) => c.toLowerCase()).includes(normalizedColor);

  if (isPlaceholder) {
    return PLACEHOLDER_IMAGE_POOL[0];
  }

  // Get all frames in this color
  const colorFrames = frames.filter(
    (f) => f.colorName?.toLowerCase() === normalizedColor && f.category === "picture"
  );

  // First pass: Look for preferred lifestyle image patterns (room settings)
  for (const pattern of PREFERRED_HUB_IMAGE_PATTERNS) {
    for (const frame of colorFrames) {
      const matchingImage = frame.alternateImages?.find(
        (img) => img.type === "lifestyle" && img.url.endsWith(pattern)
      );
      if (matchingImage) {
        return matchingImage.url;
      }
    }
  }

  // Second pass: Fall back to any lifestyle image
  for (const frame of colorFrames) {
    const firstLifestyle = frame.alternateImages?.find((img) => img.type === "lifestyle");
    if (firstLifestyle) {
      return firstLifestyle.url;
    }
  }

  // Final fallback
  return PLACEHOLDER_IMAGE_POOL[0];
}

// ============================================================================
// COLOR METADATA
// ============================================================================

/**
 * Color information for gateway pages.
 * Includes SEO-optimized descriptions and design guidance.
 */
export const COLOR_METADATA: Record<
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
      "Timeless black picture frames deliver bold contrast and contemporary elegance for any artwork or photography.",
    designStyle: "Modern, Gallery, Minimalist",
    bestFor: ["Contemporary art", "Black & white photography", "Gallery walls", "Fine art prints"],
  },
  Brown: {
    displayName: "Brown",
    slug: "brown",
    hex: "#654321",
    description:
      "Rich brown picture frames offer warm traditional elegance with natural wood tones perfect for classic interiors.",
    designStyle: "Traditional, Rustic, Warm",
    bestFor: ["Oil paintings", "Landscapes", "Family portraits", "Vintage photographs"],
  },
  Gold: {
    displayName: "Gold",
    slug: "gold",
    hex: "#d4af37",
    description:
      "Elegant gold picture frames add luxurious sophistication with ornate detailing perfect for formal presentations.",
    designStyle: "Formal, Luxurious, Ornate",
    bestFor: ["Fine art", "Certificates", "Formal portraits", "Museum-quality displays"],
  },
  Natural: {
    displayName: "Natural",
    slug: "natural",
    hex: "#d4a574",
    description:
      "Natural wood frames showcase authentic grain patterns and organic finishes for eco-friendly Scandinavian styling.",
    designStyle: "Scandinavian, Organic, Eco-Friendly",
    bestFor: ["Nature photography", "Minimalist art", "Botanical prints", "Modern interiors"],
  },
  Silver: {
    displayName: "Silver",
    slug: "silver",
    hex: "#c0c0c0",
    description:
      "Sleek silver picture frames provide modern metallic elegance with contemporary styling for professional displays.",
    designStyle: "Modern, Industrial, Professional",
    bestFor: ["Contemporary photography", "Abstract art", "Office displays", "Modern interiors"],
  },
  Blue: {
    displayName: "Blue",
    slug: "blue",
    hex: "#1e3a8a",
    description:
      "Distinctive blue picture frames offer bold color statements with coastal charm and creative personality.",
    designStyle: "Coastal, Creative, Bold",
    bestFor: ["Beach photography", "Watercolors", "Children's art", "Coastal decor"],
  },
  Bronze: {
    displayName: "Bronze",
    slug: "bronze",
    hex: "#cd7f32",
    description:
      "Warm bronze picture frames combine antique sophistication with rich metallic finishes for distinguished presentations.",
    designStyle: "Antique, Sophisticated, Warm",
    bestFor: ["Traditional art", "Historical photographs", "Certificates", "Formal displays"],
  },
  White: {
    displayName: "White",
    slug: "white",
    hex: "#ffffff",
    description:
      "Clean white picture frames create bright contemporary elegance with versatile styling for any modern interior.",
    designStyle: "Contemporary, Clean, Versatile",
    bestFor: ["Modern art", "Color photography", "Light interiors", "Minimalist spaces"],
  },
  Gray: {
    displayName: "Gray",
    slug: "gray",
    hex: "#808080",
    description:
      "Sophisticated gray picture frames offer neutral modern elegance with subtle refinement for contemporary displays.",
    designStyle: "Modern, Neutral, Refined",
    bestFor: [
      "Black & white photography",
      "Contemporary art",
      "Professional displays",
      "Modern interiors",
    ],
  },
  Red: {
    displayName: "Red",
    slug: "red",
    hex: "#dc2626",
    description:
      "Bold red picture frames make dramatic statements with vibrant energy perfect for eye-catching focal points.",
    designStyle: "Bold, Energetic, Dramatic",
    bestFor: ["Statement artwork", "Pop art", "Children's rooms", "Accent pieces"],
  },
  Pink: {
    displayName: "Pink",
    slug: "pink",
    hex: "#ec4899",
    description:
      "Playful pink picture frames add soft romantic charm with creative flair for unique personalized displays.",
    designStyle: "Romantic, Playful, Creative",
    bestFor: ["Children's art", "Feminine spaces", "Floral prints", "Creative displays"],
  },
};
