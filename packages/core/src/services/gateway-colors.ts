/**
 * Color Gateway Service
 *
 * Provides color metadata and helper functions for color gateway pages.
 * Migrated from CustomFrameSizes-CODE/client/src/lib/colorGatewayImages.ts
 */

import { getFrameStyles } from "./products";
import { getStoreBaseAssetUrl } from "../utils/asset-urls";
import type { FrameStyle } from "@framecraft/types";

/**
 * Color metadata for gateway pages.
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
      "Sleek silver picture frames provide contemporary metallic elegance perfect for modern art and photography.",
    designStyle: "Contemporary, Metallic, Modern",
    bestFor: [
      "Modern photography",
      "Abstract art",
      "Professional displays",
      "Contemporary interiors",
    ],
  },
  White: {
    displayName: "White",
    slug: "white",
    hex: "#f5f5f5",
    description:
      "Classic white picture frames brighten artwork with clean contemporary styling perfect for modern galleries.",
    designStyle: "Contemporary, Clean, Minimalist",
    bestFor: ["Color photography", "Modern art", "Gallery walls", "Bright interiors"],
  },
  Espresso: {
    displayName: "Espresso",
    slug: "espresso",
    hex: "#3d2817",
    description:
      "Deep espresso picture frames offer rich dark brown elegance with sophisticated depth for traditional settings.",
    designStyle: "Traditional, Rich, Sophisticated",
    bestFor: ["Traditional art", "Formal portraits", "Classic interiors", "Professional settings"],
  },
  Gray: {
    displayName: "Gray",
    slug: "gray",
    hex: "#808080",
    description:
      "Versatile gray picture frames provide neutral sophistication that complements any artwork without competing for attention.",
    designStyle: "Neutral, Versatile, Sophisticated",
    bestFor: ["Versatile displays", "Neutral interiors", "Mixed artwork", "Professional displays"],
  },
};

/**
 * Get all lifestyle images for a specific color.
 * Returns color-specific images from frames in that color.
 */
export function getColorLifestyleImages(colorName: string): Array<{
  url: string;
  alt: string;
}> {
  const normalizedColor = colorName.toLowerCase();
  const frames = getFrameStyles();

  // Get frames in this color
  const colorFrames = frames.filter(
    (f) => f.colorName?.toLowerCase() === normalizedColor && f.category === "picture"
  );

  const lifestyleImages: Array<{ url: string; alt: string }> = [];

  colorFrames.forEach((frame) => {
    const frameLifestyle = frame.alternateImages?.filter((img) => img.type === "lifestyle") || [];
    frameLifestyle.forEach((img) => {
      // Convert local path to CDN URL
      const localPath = img.url.startsWith("/") ? img.url.slice(1) : img.url;
      lifestyleImages.push({
        url: getStoreBaseAssetUrl(localPath),
        alt: img.alt,
      });
    });
  });

  return lifestyleImages;
}

/**
 * Get a hero image for a color gateway page.
 * Returns the first high-quality lifestyle image.
 */
export function getColorHeroImage(colorName: string): {
  url: string;
  alt: string;
} | null {
  const images = getColorLifestyleImages(colorName);
  return images.length > 0 ? (images[0] ?? null) : null;
}

/**
 * Get a hub/thumbnail image for color index page.
 * Returns the first lifestyle image from the most popular frame in that color.
 */
export function getColorHubImage(colorName: string): string {
  const normalizedColor = colorName.toLowerCase();
  const frames = getFrameStyles();

  // Get frames in this color, sorted by price (higher price = more premium = better image)
  const colorFrames = frames
    .filter((f) => f.colorName?.toLowerCase() === normalizedColor && f.category === "picture")
    .sort((a, b) => (b.pricePerInch || 0) - (a.pricePerInch || 0));

  const topFrame = colorFrames[0];
  if (topFrame) {
    const lifestyleImages =
      topFrame.alternateImages?.filter((img) => img.type === "lifestyle") ?? [];
    const first = lifestyleImages[0];
    if (first) {
      const localPath = first.url.startsWith("/") ? first.url.slice(1) : first.url;
      return getStoreBaseAssetUrl(localPath);
    }
    if (topFrame.thumbnail) {
      const localPath = topFrame.thumbnail.startsWith("/")
        ? topFrame.thumbnail.slice(1)
        : topFrame.thumbnail;
      return getStoreBaseAssetUrl(localPath);
    }
  }

  return getStoreBaseAssetUrl("frames/8446/lifestyle_1.jpg");
}

/**
 * Get frames filtered by color name
 */
export function getFramesByColor(colorName: string): FrameStyle[] {
  const normalizedColor = colorName.toLowerCase();
  return getFrameStyles().filter(
    (f) => f.colorName?.toLowerCase() === normalizedColor && f.category === "picture"
  );
}

/**
 * Get gallery images for color detail page (first 6 lifestyle images)
 */
export function getColorGalleryImages(colorName: string): Array<{
  url: string;
  alt: string;
}> {
  return getColorLifestyleImages(colorName).slice(0, 6);
}

/**
 * Get FAQ sidebar images (first 3 lifestyle images)
 */
export function getColorFAQSidebarImages(colorName: string): Array<{
  url: string;
  alt: string;
}> {
  return getColorLifestyleImages(colorName).slice(0, 3);
}

/**
 * Check if color is using placeholder images
 * (Currently always returns false as we use real images from frames)
 */
export function isUsingPlaceholderImages(_colorName: string): boolean {
  return false;
}

/**
 * Count frames per color
 */
export function countFramesPerColor(): Record<string, number> {
  return getFrameStyles().reduce<Record<string, number>>((acc, frame) => {
    if (frame.category === "picture" && frame.colorName) {
      acc[frame.colorName] = (acc[frame.colorName] ?? 0) + 1;
    }
    return acc;
  }, {});
}
