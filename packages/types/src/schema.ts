/**
 * Schema Types
 *
 * Database schema type definitions and shared constants:
 * - User: User account types
 * - MatDesign: Mat design types
 * - UploadedImage: Image upload types
 * - OrderFile: Order file types
 * - DesignRecommendation: AI recommendation types
 * - BrassNameplateConfig: Brass nameplate configuration
 * - BRASS_NAMEPLATE_SPECS: Brass nameplate physical specifications
 */

// ============================================================================
// AI DESIGNER RECOMMENDATION TYPES
// ============================================================================

export interface DesignRecommendationRequest {
  imageBase64: string;
  imageMimeType: string;
  imageWidth: number;
  imageHeight: number;
}

export interface SizeOption {
  label: string; // "Small" or "Standard"
  width: number;
  height: number;
  price: number;
}

export interface DesignRecommendation {
  frameId: string;
  frameName: string;
  frameSku?: string;
  frameColor?: string;
  topMatId: string;
  topMatName: string;
  topMatColor: string;
  bottomMatId: string;
  bottomMatName: string;
  bottomMatColor: string;
  explanation: string;
  sizes: SizeOption[];
}

export interface DesignRecommendationResponse {
  recommendations: DesignRecommendation[];
  analysis: {
    subject: string;
    style: string;
    dominantColors: string[];
    mood: string;
  };
}

// ============================================================================
// BRASS NAMEPLATE TYPES
// ============================================================================

/**
 * Brass Nameplate Behavior Types
 *
 * Type A: Stretched Border (most specialty designers)
 *   - Bottom mat border becomes fixed 3.75" when enabled
 *   - Nameplate positioned 1" below mat opening
 *   - Used by: Playbill, Ticket Stub, Collage, Newspaper, Record Album, Military,
 *              Diploma, Certificate, Comic, Magazine, Card
 *
 * Type B: Stretched Border with User Override (generic designers)
 *   - Same as Type A, BUT if user border >= 3.75", no change needed
 *   - Nameplate placed 1" below mat opening
 *   - Used by: Generic Picture Frame, Generic Shadowbox
 *
 * Type C: Integrated Fixed Position (Jersey)
 *   - Pre-cut mat opening, fixed coordinates, no extension
 *   - Nameplate is part of designed mat cutout pattern
 *   - Used by: Jersey Frame Designer (Premium layouts)
 *
 * Type D: Integrated Fixed Distance from Opening (Signature)
 *   - Fixed 1" below mat opening, no extension
 *   - Bottom border calculated to accommodate positioning
 *   - Used by: Signature Frame Designer
 */
export type NameplateBehaviorType = "A" | "B" | "C" | "D";

/**
 * Brass Nameplate Physical Specifications
 * For LightBurn file generation and positioning calculations
 */
export const BRASS_NAMEPLATE_SPECS = {
  // Physical dimensions in inches
  NAMEPLATE_WIDTH: 4.5,
  NAMEPLATE_HEIGHT: 1.5,

  // === Behavior Type A/B Positioning (Stretched Border) ===
  MIN_BOTTOM_BORDER: 3.75, // Fixed bottom mat border when enabled (1" + 1.5" + 1.25")
  OFFSET_FROM_OPENING: 1.0, // Distance from mat opening to nameplate top
  BOTTOM_CLEARANCE: 1.25, // Space below nameplate to frame edge

  // === Legacy constants (for backward compatibility) ===
  NAMEPLATE_FRAME_EXTENSION: 1.5, // @deprecated - use MIN_BOTTOM_BORDER instead
  NAMEPLATE_BOTTOM_MARGIN: 1.0, // @deprecated - use OFFSET_FROM_OPENING instead

  // Usable text area
  TEXT_AREA_WIDTH: 4.0,
  TEXT_AREA_HEIGHT: 1.1,

  // Padding
  HORIZONTAL_PADDING: 0.2,

  // Font sizes in points (progressive hierarchy)
  LINE1_FONT_SIZE_PT: 16.2, // ≈32px at 150 DPI (headline emphasis)
  LINE2_FONT_SIZE_PT: 12, // ≈24px at 150 DPI
  LINE3_FONT_SIZE_PT: 11, // ≈22px at 150 DPI (subtle diminishment)

  // Line spacing (baseline to baseline)
  LINE_SPACING_INCHES: 0.25, // Balanced spacing

  // Pricing
  PRICE: 29,

  // Laser settings by color (for LightBurn file generation)
  LASER_SETTINGS: {
    "brass-black": { minPower: 50, maxPower: 60, speed: 400 }, // Anodized brass
    "black-gold": { minPower: 70, maxPower: 100, speed: 300 }, // Black with gold
    "black-silver": { minPower: 70, maxPower: 100, speed: 300 }, // Black with silver
    "silver-black": { minPower: 50, maxPower: 60, speed: 400 }, // Anodized silver
  },
} as const;

/**
 * Brass Nameplate Font Options
 */
export const brassNameplateFonts = [
  "georgia", // Classic elegant serif
  "arial", // Clean sans-serif
  "trajan-pro", // Formal Roman-style (rendered as Cinzel)
  "dancing-script", // Elegant cursive script
  "courier-new", // Monospace (military dog tag style)
] as const;

export type BrassNameplateFont = (typeof brassNameplateFonts)[number];

/**
 * Brass Nameplate Color Options
 */
export const brassNameplateColors = [
  "brass-black", // Brass nameplate with black engraving
  "silver-black", // Silver nameplate with black engraving
  "black-gold", // Black nameplate with gold engraving
  "black-silver", // Black nameplate with silver engraving
] as const;

export type BrassNameplateColor = (typeof brassNameplateColors)[number];

/**
 * Brass Nameplate Configuration
 */
export interface BrassNameplateConfig {
  // Enable/disable nameplate
  enabled: boolean;

  // Text content with character limits
  line1: string; // Headline (30 chars max)
  line2: string; // Line 2 (40 chars max)
  line3: string; // Line 3 (40 chars max)

  // Font selection
  font: BrassNameplateFont;

  // Color combination
  color: BrassNameplateColor;

  // Optional US flag graphic (no additional charge)
  includeFlag: boolean;
}

/**
 * Calculate bottom mat border for Type A behavior (Stretched Border)
 * Returns the fixed 3.75" bottom border when nameplate is enabled
 */
export function getTypeABottomBorder(
  nameplateEnabled: boolean,
  baseBottomBorder: number = 0
): number {
  if (!nameplateEnabled) return baseBottomBorder;
  return BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER;
}

/**
 * Calculate bottom mat border for Type B behavior (Stretched with User Override)
 * If user's border is already >= 3.75", no change needed
 */
export function getTypeBBottomBorder(nameplateEnabled: boolean, userBottomBorder: number): number {
  if (!nameplateEnabled) return userBottomBorder;
  return Math.max(userBottomBorder, BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER);
}

/**
 * Calculate nameplate Y position from mat opening (for Type A, B, D)
 * Always positioned 1" below the mat opening (artwork area)
 */
export function getNameplateYFromOpening(matOpeningBottom: number): number {
  return matOpeningBottom + BRASS_NAMEPLATE_SPECS.OFFSET_FROM_OPENING;
}
