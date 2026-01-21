/**
 * Style Gateway Image Management
 *
 * This file manages style definitions and frame assignments for the Browse by Style gateway.
 * Styles are organized by design aesthetic with frames assigned based on their visual characteristics.
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
  shortDescription?: string;
  mouldingWidth?: number;
  thumbnail?: string;
  alternateImages?: Array<{
    type: string;
    url: string;
    alt: string;
  }>;
}

// ============================================================================
// STYLE DEFINITIONS
// ============================================================================

export interface StyleMetadata {
  slug: string;
  displayName: string;
  hex: string;
  description: string;
  searchVolume: number;
  designStyle: string;
  bestFor: string[];
  keywords: string[];
}

export const STYLE_METADATA: Record<string, StyleMetadata> = {
  Modern: {
    slug: "modern",
    displayName: "Modern",
    hex: "#1a1a1a",
    description:
      "Clean lines, bold profiles, and contemporary sophistication. Modern frames feature sleek finishes and geometric precision for today's interiors.",
    searchVolume: 5400,
    designStyle: "Contemporary and Minimalist",
    bestFor: [
      "Contemporary art",
      "Abstract photography",
      "Urban landscapes",
      "Minimalist interiors",
    ],
    keywords: [
      "modern picture frames",
      "contemporary frames",
      "minimalist frames",
      "sleek picture frames",
    ],
  },
  Rustic: {
    slug: "rustic",
    displayName: "Rustic",
    hex: "#8B4513",
    description:
      "Weathered textures, distressed finishes, and farmhouse charm. Rustic frames bring natural warmth and handcrafted character to any space.",
    searchVolume: 6600,
    designStyle: "Farmhouse and Country",
    bestFor: ["Nature photography", "Family photos", "Farmhouse decor", "Country-style interiors"],
    keywords: ["rustic picture frames", "farmhouse frames", "distressed frames", "barnwood frames"],
  },
  Classic: {
    slug: "classic",
    displayName: "Classic",
    hex: "#654321",
    description:
      "Timeless elegance with traditional profiles and rich wood tones. Classic frames work beautifully with any artwork style.",
    searchVolume: 4200,
    designStyle: "Traditional and Timeless",
    bestFor: ["Portraits", "Traditional art", "Family heirlooms", "Professional settings"],
    keywords: ["classic picture frames", "traditional frames", "timeless frames", "elegant frames"],
  },
  Gallery: {
    slug: "gallery",
    displayName: "Gallery",
    hex: "#2C2C2C",
    description:
      "Professional-grade frames designed for serious art display. Gallery frames put the focus on your artwork.",
    searchVolume: 3800,
    designStyle: "Museum and Professional",
    bestFor: ["Fine art", "Photography exhibitions", "Professional displays", "Art collections"],
    keywords: ["gallery frames", "museum frames", "professional frames", "art gallery frames"],
  },
  Vintage: {
    slug: "vintage",
    displayName: "Vintage",
    hex: "#C9A227",
    description:
      "Old-world charm with ornate details and antique finishes. Vintage frames add timeless elegance and historical character.",
    searchVolume: 3600,
    designStyle: "Antique and Historical",
    bestFor: ["Antique photos", "Historical documents", "Classic artwork", "Victorian interiors"],
    keywords: ["vintage picture frames", "antique frames", "ornate frames", "old fashioned frames"],
  },
  Natural: {
    slug: "natural-wood",
    displayName: "Natural Wood",
    hex: "#D2B48C",
    description:
      "Pure wood beauty with organic grain patterns and warm tones. Natural frames bring the outdoors in with authentic character.",
    searchVolume: 4500,
    designStyle: "Organic and Scandinavian",
    bestFor: ["Nature photography", "Botanical prints", "Scandinavian decor", "Eco-friendly homes"],
    keywords: ["natural wood frames", "wood picture frames", "organic frames", "light wood frames"],
  },
  Minimalist: {
    slug: "minimalist",
    displayName: "Minimalist",
    hex: "#333333",
    description:
      "Simple profiles that let your artwork shine. Minimalist frames offer clean aesthetics without distraction.",
    searchVolume: 3200,
    designStyle: "Simple and Understated",
    bestFor: ["Modern photography", "Line art", "Contemporary prints", "Zen interiors"],
    keywords: ["minimalist frames", "simple frames", "thin frames", "slim picture frames"],
  },
  Ornate: {
    slug: "ornate",
    displayName: "Ornate",
    hex: "#DAA520",
    description:
      "Decorative details and rich finishes for statement-making displays. Ornate frames turn artwork into focal points.",
    searchVolume: 2900,
    designStyle: "Decorative and Luxurious",
    bestFor: ["Formal portraits", "Fine art reproductions", "Luxury interiors", "Statement pieces"],
    keywords: ["ornate frames", "decorative frames", "fancy frames", "elaborate frames"],
  },
};

// ============================================================================
// FRAME-TO-STYLE ASSIGNMENTS
// ============================================================================

/**
 * Maps frame IDs to their primary style category.
 * Frames can belong to multiple styles, but this defines the primary assignment.
 */
export const FRAME_STYLE_ASSIGNMENTS: Record<string, string[]> = {
  // Modern Style
  "modern-black": ["Modern", "Minimalist", "Gallery"],
  "modern-white": ["Modern", "Minimalist"],
  "modern-red": ["Modern"],
  "modern-blue": ["Modern"],
  "modern-gold": ["Modern", "Ornate"],
  "modern-silver": ["Modern", "Gallery"],
  "black-wood": ["Modern", "Minimalist"],
  "white-wood": ["Modern", "Minimalist"],
  "silver-wood": ["Modern"],
  "bronz-picture-frame": ["Modern", "Gallery"],
  "iron-ore-silver": ["Modern", "Gallery"],
  "black-peak": ["Modern"],
  "pink-wood": ["Modern"],

  // Rustic Style
  "barnwood-brown": ["Rustic", "Natural"],
  "barnwood-black": ["Rustic", "Modern"],
  "barnwood-white": ["Rustic"],
  "barnwood-gray": ["Rustic", "Modern"],
  "white-wash-wood": ["Rustic"],
  "coastal-white": ["Rustic"],
  "deep-rustic-walnut": ["Rustic", "Natural"],

  // Classic Style
  "wide-black": ["Classic", "Gallery"],
  "wide-brown": ["Classic", "Natural"],
  "executive-brown": ["Classic"],
  "brown-picture-frame": ["Classic", "Natural"],

  // Gallery Style
  "museum-bronze": ["Gallery", "Classic"],
  "museum-gold": ["Gallery", "Ornate", "Vintage"],
  "museum-silver": ["Gallery"],
  "museum-black": ["Gallery", "Ornate"],
  "wide-museum-gold": ["Gallery", "Ornate", "Vintage"],
  "wide-museum-silver": ["Gallery", "Ornate"],

  // Vintage Style
  "antique-gold": ["Vintage", "Ornate"],
  "antique-silver": ["Vintage"],
  "royal-gold": ["Vintage", "Ornate"],

  // Natural Style
  "natural-picture-frame": ["Natural", "Minimalist"],
  "light-oak": ["Natural", "Minimalist"],
  "brown-bamboo": ["Natural"],
  "gold-bamboo": ["Natural", "Ornate"],
  "wide-brown-bamboo": ["Natural"],

  // Minimalist Style
  "simple-picture-frame": ["Minimalist", "Classic"],

  // Ornate Style
  "red-wood": ["Ornate"],
  "blue-wood": ["Ornate"],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all frames belonging to a specific style.
 */
export function getFramesForStyle(styleName: string, frames: Frame[]): Frame[] {
  const styleFrames = frames.filter((frame) => {
    if (frame.category !== "picture") return false;
    const assignments = FRAME_STYLE_ASSIGNMENTS[frame.id];
    return assignments?.includes(styleName);
  });

  // If no explicit assignments, use heuristic matching
  if (styleFrames.length === 0) {
    return getFramesByHeuristic(styleName, frames);
  }

  return styleFrames;
}

/**
 * Fallback heuristic matching based on frame name/description keywords.
 */
function getFramesByHeuristic(styleName: string, frames: Frame[]): Frame[] {
  const style = styleName.toLowerCase();

  return frames.filter((frame) => {
    if (frame.category !== "picture") return false;

    const name = frame.name.toLowerCase();
    const desc = (frame.shortDescription || "").toLowerCase();
    const combined = `${name} ${desc}`;

    switch (style) {
      case "modern":
        return (
          combined.includes("modern") ||
          combined.includes("contemporary") ||
          combined.includes("sleek")
        );
      case "rustic":
        return (
          combined.includes("rustic") ||
          combined.includes("barnwood") ||
          combined.includes("farmhouse") ||
          combined.includes("distressed")
        );
      case "classic":
        return (
          combined.includes("classic") ||
          combined.includes("traditional") ||
          combined.includes("executive") ||
          combined.includes("wide")
        );
      case "gallery":
        return combined.includes("museum") || combined.includes("gallery");
      case "vintage":
        return (
          combined.includes("antique") ||
          combined.includes("vintage") ||
          combined.includes("ornate")
        );
      case "natural":
        return (
          combined.includes("natural") ||
          combined.includes("oak") ||
          combined.includes("bamboo") ||
          combined.includes("wood grain")
        );
      case "minimalist":
        return (
          combined.includes("simple") ||
          combined.includes("slim") ||
          combined.includes("minimalist") ||
          (frame.mouldingWidth !== undefined && frame.mouldingWidth <= 0.75)
        );
      case "ornate":
        return (
          combined.includes("ornate") ||
          combined.includes("royal") ||
          combined.includes("museum") ||
          combined.includes("baroque")
        );
      default:
        return false;
    }
  });
}

/**
 * Get lifestyle images for a specific style from assigned frames.
 */
export function getStyleLifestyleImages(
  styleName: string,
  frames: Frame[]
): Array<{
  url: string;
  alt: string;
  frameName: string;
}> {
  const styleFrames = getFramesForStyle(styleName, frames);
  const images: Array<{ url: string; alt: string; frameName: string }> = [];

  styleFrames.forEach((frame) => {
    const lifestyleImages = frame.alternateImages?.filter((img) => img.type === "lifestyle") || [];
    lifestyleImages.slice(0, 3).forEach((img) => {
      images.push({
        url: img.url,
        alt: img.alt,
        frameName: frame.name,
      });
    });
  });

  return images.slice(0, 12);
}

/**
 * Get a hero image for a style gateway page.
 */
export function getStyleHeroImage(
  styleName: string,
  frames: Frame[]
): {
  url: string;
  alt: string;
} {
  const images = getStyleLifestyleImages(styleName, frames);
  if (images.length > 0 && images[0]) {
    return { url: images[0].url, alt: images[0].alt };
  }

  // Fallback to first frame's thumbnail
  const styleFrames = getFramesForStyle(styleName, frames);
  if (styleFrames.length > 0 && styleFrames[0]) {
    const firstFrame = styleFrames[0];
    const cornerImg = firstFrame.alternateImages?.find((img) => img.type === "corner");
    return {
      url: cornerImg?.url || firstFrame.thumbnail || "/frames/8446/lifestyle_1.jpg",
      alt: `${styleName} style picture frame`,
    };
  }

  return {
    url: "/frames/8446/lifestyle_1.jpg",
    alt: "Custom picture frames in professional setting",
  };
}

/**
 * Get a representative hub image for the style.
 */
export function getStyleHubImage(styleName: string, frames: Frame[]): string {
  // Curated hub images per style for best visual representation
  const hubImages: Record<string, string> = {
    Modern: "/frames/6711/lifestyle_10.png",
    Rustic: "/frames/10570/lifestyle_10.png",
    Classic: "/frames/8446/lifestyle_1.jpg",
    Gallery: "/frames/6301/lifestyle12.jpg",
    Vintage: "/frames/8981/lifestyle_10.jpg",
    Natural: "/frames/8750/lifestyle_10.jpg",
    Minimalist: "/frames/9135/lifestyle_10.png",
    Ornate: "/frames/10783/lifestyle_10.png",
  };

  if (hubImages[styleName]) {
    return hubImages[styleName];
  }

  // Fallback to first available lifestyle image
  const heroImage = getStyleHeroImage(styleName, frames);
  return heroImage.url;
}

/**
 * Count frames per style for display purposes.
 */
export function countFramesPerStyle(frames: Frame[]): Record<string, number> {
  const counts: Record<string, number> = {};

  Object.keys(STYLE_METADATA).forEach((styleName) => {
    counts[styleName] = getFramesForStyle(styleName, frames).length;
  });

  return counts;
}
