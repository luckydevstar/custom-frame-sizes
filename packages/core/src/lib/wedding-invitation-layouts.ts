/**
 * Wedding Invitation Frame Layouts
 * Invitation sizes, layout types, and frame calculations for wedding invitation framing.
 */

export type WeddingLayoutType = "invite-only" | "invite-photo" | "invite-rsvp";

export interface InvitationSize {
  id: string;
  name: string;
  displayName: string;
  description: string;
  width: number;
  height: number;
  isSquare: boolean;
  isPopular: boolean;
}

export interface SecondaryOpeningSize {
  id: string;
  name: string;
  displayName: string;
  width: number;
  height: number;
  applicableTo: ("photo" | "rsvp")[];
}

export interface WeddingLayout {
  id: WeddingLayoutType;
  name: string;
  displayName: string;
  description: string;
  icon: "single" | "dual-horizontal" | "dual-vertical";
  openingCount: 1 | 2;
}

export interface WeddingFrameConfig {
  layoutType: WeddingLayoutType;
  invitationSize: InvitationSize;
  secondarySize?: SecondaryOpeningSize;
  matBorder: number;
  openingSpacing: number;
  matOverlap: number;
  frameWidth: number;
  frameHeight: number;
  primaryOpening: { x: number; y: number; width: number; height: number };
  secondaryOpening?: { x: number; y: number; width: number; height: number };
}

export const PLAQUE_FRAME_EXTENSION = 0.75;

export const INVITATION_SIZES: InvitationSize[] = [
  {
    id: "size-3.5x5",
    name: '3.5×5"',
    displayName: '3.5×5" Enclosure',
    description: "RSVP & enclosure card size",
    width: 3.5,
    height: 5,
    isSquare: false,
    isPopular: false,
  },
  {
    id: "size-4x6",
    name: '4×6"',
    displayName: '4×6" Details Card',
    description: "Details & accommodations card",
    width: 4,
    height: 6,
    isSquare: false,
    isPopular: false,
  },
  {
    id: "size-4.25x5.5",
    name: '4.25×5.5"',
    displayName: '4.25×5.5" A2',
    description: "A2 card size",
    width: 4.25,
    height: 5.5,
    isSquare: false,
    isPopular: false,
  },
  {
    id: "size-4.5x6.25",
    name: '4.5×6.25"',
    displayName: '4.5×6.25" A6',
    description: "A6-style invitation",
    width: 4.5,
    height: 6.25,
    isSquare: false,
    isPopular: false,
  },
  {
    id: "size-5x7",
    name: '5×7"',
    displayName: '5×7" Standard',
    description: "Most common wedding invitation size",
    width: 5,
    height: 7,
    isSquare: false,
    isPopular: true,
  },
  {
    id: "size-5.5x7.5",
    name: '5.5×7.5"',
    displayName: '5.5×7.5" Boutique',
    description: "Boutique oversized invitation",
    width: 5.5,
    height: 7.5,
    isSquare: false,
    isPopular: false,
  },
  {
    id: "size-5x5",
    name: '5×5"',
    displayName: '5×5" Square',
    description: "Square invitation format",
    width: 5,
    height: 5,
    isSquare: true,
    isPopular: false,
  },
  {
    id: "size-6x6",
    name: '6×6"',
    displayName: '6×6" Square',
    description: "Large square invitation",
    width: 6,
    height: 6,
    isSquare: true,
    isPopular: false,
  },
];

export function getInvitationSizeById(id: string): InvitationSize | undefined {
  return INVITATION_SIZES.find((s) => s.id === id);
}

export function getDefaultInvitationSize(): InvitationSize {
  return INVITATION_SIZES.find((s) => s.isPopular) ?? INVITATION_SIZES[4]!;
}

export const SECONDARY_OPENING_SIZES: SecondaryOpeningSize[] = [
  {
    id: "secondary-3.5x5",
    name: '3.5×5"',
    displayName: '3.5×5"',
    width: 3.5,
    height: 5,
    applicableTo: ["photo", "rsvp"],
  },
  {
    id: "secondary-4x6",
    name: '4×6"',
    displayName: '4×6"',
    width: 4,
    height: 6,
    applicableTo: ["photo", "rsvp"],
  },
  {
    id: "secondary-5x7",
    name: '5×7"',
    displayName: '5×7"',
    width: 5,
    height: 7,
    applicableTo: ["photo"],
  },
  {
    id: "secondary-8x10",
    name: '8×10"',
    displayName: '8×10"',
    width: 8,
    height: 10,
    applicableTo: ["photo"],
  },
];

export function getSecondaryOpeningSizeById(id: string): SecondaryOpeningSize | undefined {
  return SECONDARY_OPENING_SIZES.find((s) => s.id === id);
}

export function getSecondaryOpeningSizesForLayout(
  layoutType: WeddingLayoutType
): SecondaryOpeningSize[] {
  if (layoutType === "invite-only") return [];
  const type = layoutType === "invite-photo" ? "photo" : "rsvp";
  return SECONDARY_OPENING_SIZES.filter((s) => s.applicableTo.includes(type));
}

export function getDefaultSecondarySize(
  layoutType: WeddingLayoutType
): SecondaryOpeningSize | undefined {
  if (layoutType === "invite-only") return undefined;
  const sizes = getSecondaryOpeningSizesForLayout(layoutType);
  if (layoutType === "invite-photo") return sizes.find((s) => s.id === "secondary-5x7") ?? sizes[0];
  return sizes.find((s) => s.id === "secondary-3.5x5") ?? sizes[0];
}

export const WEDDING_LAYOUTS: WeddingLayout[] = [
  {
    id: "invite-only",
    name: "Invite Only",
    displayName: "Invitation Only",
    description: "Single opening for your wedding invitation",
    icon: "single",
    openingCount: 1,
  },
  {
    id: "invite-photo",
    name: "Invite + Photo",
    displayName: "Invitation + Photo",
    description: "Side-by-side invitation and wedding photo",
    icon: "dual-horizontal",
    openingCount: 2,
  },
  {
    id: "invite-rsvp",
    name: "Invite + RSVP",
    displayName: "Invitation + RSVP",
    description: "Display invitation alongside RSVP card",
    icon: "dual-horizontal",
    openingCount: 2,
  },
];

export function getWeddingLayoutById(id: WeddingLayoutType): WeddingLayout | undefined {
  return WEDDING_LAYOUTS.find((l) => l.id === id);
}

export const DEFAULT_MAT_BORDER = 2.0;
export const OPENING_SPACING = 1.0;
export const MAT_OVERLAP = 0.125;

export const CUSTOM_SIZE_LIMITS = {
  MIN_WIDTH: 2,
  MAX_WIDTH: 12,
  MIN_HEIGHT: 2,
  MAX_HEIGHT: 16,
} as const;

export function calculateWindowSize(
  cardWidth: number,
  cardHeight: number
): { width: number; height: number } {
  return {
    width: cardWidth - MAT_OVERLAP * 2,
    height: cardHeight - MAT_OVERLAP * 2,
  };
}

export function calculateWeddingFrameConfig(
  layoutType: WeddingLayoutType,
  invitationSize: InvitationSize,
  secondarySize: SecondaryOpeningSize | undefined,
  matBorder: number = DEFAULT_MAT_BORDER,
  frameMouldingWidth: number = 1.0
): WeddingFrameConfig {
  const primaryWindow = calculateWindowSize(invitationSize.width, invitationSize.height);
  let frameWidth: number;
  let frameHeight: number;
  let primaryOpening: { x: number; y: number; width: number; height: number };
  let secondaryOpening: { x: number; y: number; width: number; height: number } | undefined;

  if (layoutType === "invite-only" || !secondarySize) {
    const interiorWidth = primaryWindow.width + matBorder * 2;
    const interiorHeight = primaryWindow.height + matBorder * 2;
    frameWidth = interiorWidth + frameMouldingWidth * 2;
    frameHeight = interiorHeight + frameMouldingWidth * 2;
    primaryOpening = {
      x: matBorder,
      y: matBorder,
      width: primaryWindow.width,
      height: primaryWindow.height,
    };
  } else {
    const secondaryWindow = calculateWindowSize(secondarySize.width, secondarySize.height);
    const maxHeight = Math.max(primaryWindow.height, secondaryWindow.height);
    const interiorWidth =
      matBorder + primaryWindow.width + OPENING_SPACING + secondaryWindow.width + matBorder;
    const interiorHeight = matBorder * 2 + maxHeight;
    frameWidth = interiorWidth + frameMouldingWidth * 2;
    frameHeight = interiorHeight + frameMouldingWidth * 2;
    const primaryYOffset = (maxHeight - primaryWindow.height) / 2;
    const secondaryYOffset = (maxHeight - secondaryWindow.height) / 2;
    primaryOpening = {
      x: matBorder,
      y: matBorder + primaryYOffset,
      width: primaryWindow.width,
      height: primaryWindow.height,
    };
    secondaryOpening = {
      x: matBorder + primaryWindow.width + OPENING_SPACING,
      y: matBorder + secondaryYOffset,
      width: secondaryWindow.width,
      height: secondaryWindow.height,
    };
  }

  return {
    layoutType,
    invitationSize,
    secondarySize,
    matBorder,
    openingSpacing: OPENING_SPACING,
    matOverlap: MAT_OVERLAP,
    frameWidth,
    frameHeight,
    primaryOpening,
    secondaryOpening,
  };
}

export function validateCustomDimensions(
  width: number,
  height: number
): { valid: boolean; error?: string } {
  if (width < CUSTOM_SIZE_LIMITS.MIN_WIDTH)
    return { valid: false, error: `Width must be at least ${CUSTOM_SIZE_LIMITS.MIN_WIDTH}"` };
  if (width > CUSTOM_SIZE_LIMITS.MAX_WIDTH)
    return { valid: false, error: `Width cannot exceed ${CUSTOM_SIZE_LIMITS.MAX_WIDTH}"` };
  if (height < CUSTOM_SIZE_LIMITS.MIN_HEIGHT)
    return { valid: false, error: `Height must be at least ${CUSTOM_SIZE_LIMITS.MIN_HEIGHT}"` };
  if (height > CUSTOM_SIZE_LIMITS.MAX_HEIGHT)
    return { valid: false, error: `Height cannot exceed ${CUSTOM_SIZE_LIMITS.MAX_HEIGHT}"` };
  return { valid: true };
}

export function createCustomInvitationSize(width: number, height: number): InvitationSize {
  return {
    id: "custom",
    name: `${width}×${height}"`,
    displayName: `${width}×${height}" Custom`,
    description: "Custom invitation dimensions",
    width,
    height,
    isSquare: width === height,
    isPopular: false,
  };
}

export function createCustomSecondarySize(
  width: number,
  height: number,
  type: "photo" | "rsvp"
): SecondaryOpeningSize {
  return {
    id: "custom-secondary",
    name: `${width}×${height}"`,
    displayName: `${width}×${height}" Custom`,
    width,
    height,
    applicableTo: [type],
  };
}

export interface WeddingPreviewDimensions {
  scale: number;
  previewWidth: number;
  previewHeight: number;
  frameFaceWidth: number;
  openings: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    type: "primary" | "secondary";
  }>;
}

export function calculateWeddingPreviewDimensions(
  config: WeddingFrameConfig,
  containerWidth: number,
  containerHeight: number,
  frameMouldingWidth: number = 1.0,
  padding: number = 20
): WeddingPreviewDimensions {
  const availableWidth = containerWidth - padding * 2;
  const availableHeight = containerHeight - padding * 2;
  const scaleX = availableWidth / config.frameWidth;
  const scaleY = availableHeight / config.frameHeight;
  const scale = Math.min(scaleX, scaleY, 50);
  const previewWidth = config.frameWidth * scale;
  const previewHeight = config.frameHeight * scale;
  const frameFaceWidth = frameMouldingWidth * scale;
  const openings: WeddingPreviewDimensions["openings"] = [
    {
      x: config.primaryOpening.x * scale,
      y: config.primaryOpening.y * scale,
      width: config.primaryOpening.width * scale,
      height: config.primaryOpening.height * scale,
      type: "primary",
    },
  ];
  if (config.secondaryOpening) {
    openings.push({
      x: config.secondaryOpening.x * scale,
      y: config.secondaryOpening.y * scale,
      width: config.secondaryOpening.width * scale,
      height: config.secondaryOpening.height * scale,
      type: "secondary",
    });
  }
  return { scale, previewWidth, previewHeight, frameFaceWidth, openings };
}
