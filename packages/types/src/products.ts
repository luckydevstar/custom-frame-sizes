/**
 * Product type definitions for FrameCraft
 * These types match the JSON data in /data folder and support Shopify integration
 *
 * NOTE: These types have been extracted to @framecraft/types.
 */

/**
 * Frame style configuration
 * Represents a picture frame moulding option with pricing and visual properties
 */
export interface AlternateImage {
  type:
    | "corner"
    | "profile"
    | "lifestyle"
    | "jersey_lifestyle"
    | "military_lifestyle"
    | "comic_lifestyle"
    | "diploma_lifestyle"
    | "card_lifestyle"
    | "playbill_lifestyle"
    | "designer";
  url: string;
  alt: string;
}

export interface FrameStyle {
  id: string;
  name: string;
  material: string;
  color: string; // Hex color code
  colorName?: string; // Human-readable color name for filtering (e.g., "Black", "White", "Bronze")
  pricePerInch: number; // Price per linear inch of perimeter
  borderColor: string; // Hex color for border rendering
  mouldingWidth: number; // Width of the moulding in inches (affects price and visual display)
  usableDepth: number; // Usable depth in inches (important for shadowbox/canvas frames)
  rabbetInsetRatio?: number; // Optional: ratio (0.0-1.0) for frame-specific rabbet positioning (default ~0.92 if omitted)
  category: "picture" | "shadowbox" | "canvas"; // Frame classification for designer filtering
  shopifyVariantId?: string | null; // Shopify variant ID for checkout
  sku?: string; // SKU for local photo lookup (photo-based 2D rendering)
  thumbnail?: string; // Path to thumbnail image for frame style selector
  swatchImage?: string; // Path to swatch image for frame style selector (horizontal strip showing frame finish)
  featured?: boolean; // Whether this frame should appear in featured frames section
  shortDescription?: string; // Brief tagline description for hero sections and listings
  featuredDescription?: string; // Rich description for featured display
  dimensionalDiagram?: string; // Path to dimensional diagram image showing frame profile measurements
  photos?: {
    topUrl?: string; // Pre-oriented top piece (decorative edge facing down)
    bottomUrl?: string; // Pre-oriented bottom piece (decorative edge facing up)
    leftUrl?: string; // Pre-oriented left piece (decorative edge facing right)
    rightUrl?: string; // Pre-oriented right piece (decorative edge facing left)
    cornerUrl?: string; // Corner view photo for gallery
    profileUrl?: string; // Profile/stick view photo for gallery
    lifestyleUrl?: string; // Lifestyle/room setting photo for gallery
  };
  alternateImages?: AlternateImage[]; // Ordered array of alternate images (max 5: corner, profile, lifestyle×3)
}

/**
 * Mat board color option
 * Represents a mat board color from the mats.json catalog
 * Data structure matches /api/mats endpoint response
 */
export interface MatColor {
  id: string; // e.g. "mat-1", "mat-2"
  lineNumber: number;
  type: string; // e.g. "Regular", "Premium"
  name: string; // e.g. "White", "Black", "Pansy"
  swatchFile: string; // e.g. "1.jpg", "2.jpg"
  hexColor: string; // Hex color code (e.g. "#FFFFFF", "#4682B4")
  coreColor: string; // Core color ("white" or "black")
  isRegular: boolean;
  isPremium: boolean;
  sizes: {
    "32x40"?: {
      sku: string;
      price: number;
      vendor: string;
    } | null;
    "40x60"?: {
      sku: string;
      price: number;
      vendor: string;
    } | null;
  };
  // Backward compatibility
  color?: string; // Alias for hexColor
  pricePerInch?: number; // Calculated from sizes
  shopifyVariantId?: string | null;
}

/**
 * Glass/acrylic type option
 * Represents glazing options with pricing per square foot
 */
export interface GlassType {
  id: string;
  name: string;
  pricePerSqFt: number; // Price per square foot (can be negative for "no glass")
  shopifyVariantId?: string | null; // Shopify variant ID for checkout
}

/**
 * Pricing configuration
 * Contains all pricing rules and multipliers
 */
export interface PricingConfig {
  printAndFrame: {
    pricePerSquareInch: number;
    description: string;
  };
  oversizeFees: {
    threshold75to99: {
      minDimension: number;
      maxDimension: number;
      fee: number;
      description: string;
    };
    threshold100Plus: {
      minDimension: number;
      blocked: boolean;
      description: string;
    };
  };
  matMultipliers: {
    none: number;
    single: number;
    double: number;
  };
}

/**
 * Frame configuration
 * Represents a complete frame design with all customer selections
 */
export interface FrameConfiguration {
  serviceType: "frame-only" | "print-and-frame";
  artworkWidth: number; // in inches
  artworkHeight: number; // in inches
  frameStyleId: string;
  matType: "none" | "single" | "double";
  matBorderWidth: number; // in inches
  matRevealWidth: number; // in inches (for double mat)
  matColorId: string; // outer mat or single mat
  matInnerColorId?: string; // inner mat for double mat
  glassTypeId: string;
  imageUrl?: string; // for print-and-frame service
  copyrightAgreed?: boolean;
  orderSource?: string; // Track order source (e.g., "ai-recommendation", "manual")
  imageFit?: "cover" | "contain"; // How to fit image in frame (cover=crop, contain=stretch/scale)
  brassNameplateConfig?: any; // Brass nameplate configuration for specialty frames
  bottomWeighted?: boolean; // Add 0.5" to bottom mat border for professional weighting
}

/**
 * Pricing breakdown
 * Detailed breakdown of all costs for a frame configuration
 */
export interface PricingBreakdown {
  framePrice: number;
  matPrice: number;
  glassPrice: number;
  printPrice: number;
  oversizeFee: number;
  subtotal: number;
  total: number;
  isTooLarge: boolean;
  totalDimensions: number; // sum of width + height
}

/**
 * Gallery Wall Builder Types
 */

/**
 * Frame position within a gallery wall layout
 */
export interface GalleryFramePosition {
  id: string; // Unique ID for this frame position (e.g., "frame-1", "frame-2")
  x: number; // X position in inches from left edge of layout
  y: number; // Y position in inches from top edge of layout
  width: number; // Frame outer width in inches (including moulding)
  height: number; // Frame outer height in inches (including moulding)
  suggestedArtworkWidth?: number; // Suggested artwork size for this position
  suggestedArtworkHeight?: number; // Suggested artwork size for this position
  label?: string; // Optional label for display (e.g., "Center Large", "Top Left")
}

/**
 * Gallery wall layout template
 * Pre-defined arrangement of frames
 */
export interface GalleryWallLayoutTemplate {
  id: string; // Layout ID (e.g., "grid-2x2", "salon-5")
  name: string; // Display name (e.g., "2x2 Grid", "5-Frame Salon")
  description: string; // Description of the layout
  framePositions: GalleryFramePosition[]; // Array of frame positions
  totalWidth: number; // Total wall width in inches
  totalHeight: number; // Total wall height in inches
  spacing: number; // Default spacing between frames in inches
  frameCount: number; // Total number of frames
  thumbnail?: string; // Preview image URL
  category: "grid" | "salon" | "staircase" | "gallery-row" | "center-focus"; // Layout category
}

/**
 * Individual frame configuration within a gallery wall
 */
export interface GalleryFrameConfig {
  positionId: string; // References GalleryFramePosition.id
  frameConfiguration: FrameConfiguration; // Reuses existing FrameConfiguration
  imageUrl?: string; // Uploaded photo for this frame
  pricing?: PricingBreakdown; // Individual frame pricing
}

/**
 * Complete gallery wall configuration
 * Represents user's complete gallery wall design
 */
export interface GalleryWallConfiguration {
  layoutId: string; // References GalleryWallLayoutTemplate.id
  frames: GalleryFrameConfig[]; // Array of configured frames
  globalFrameStyle?: {
    frameStyleId: string;
    matType: "none" | "single" | "double";
    matBorderWidth: number;
    matRevealWidth: number;
    matColorId: string;
    matInnerColorId?: string;
    glassTypeId: string;
  }; // Global settings applied to all frames (when not using individual customization)
  useIndividualCustomization: boolean; // Toggle between global and individual customization
  spacing: number; // Spacing between frames in inches (can override template default)
}

/**
 * Bundle pricing tier
 * Discount tiers based on number of frames
 */
export interface BundlePricingTier {
  minFrames: number;
  maxFrames: number;
  discountPercent: number;
  label: string; // Display label (e.g., "10% Off 2-3 Frames")
}

/**
 * Gallery wall bundle pricing breakdown
 */
export interface GalleryWallPricing {
  frames: Array<{
    positionId: string;
    pricing: PricingBreakdown;
  }>;
  subtotal: number; // Sum of all frame prices
  bundleDiscount: number; // Discount amount based on tier
  discountPercent: number; // Applied discount percentage
  total: number; // Final total after discount
  tier?: BundlePricingTier; // Applied pricing tier
}
