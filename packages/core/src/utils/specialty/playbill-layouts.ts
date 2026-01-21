/**
 * Playbill Frame Layout Configurations
 * Defines standard dimensions and specifications for framing playbills and theater tickets.
 *
 * Coordinate system:
 *  - All opening x/y are measured from the FRAME INTERIOR top-left
 *    (after subtracting frame molding/rabbet which is typically 1.0").
 *  - frameWidth/frameHeight represent the OUTER frame dimensions.
 *  - The actual interior space is frameWidth - (2 × FRAME_MOLDING_WIDTH).
 */

/** Default frame molding width (inches). */
export const DEFAULT_FRAME_MOLDING_WIDTH = 1.0;

/** Standard playbill magazine size (portrait) */
export const PLAYBILL_DIMENSIONS = {
  width: 5.5,
  height: 8.5,
} as const;

/** Standard theater ticket stub size (landscape) */
export const TICKET_DIMENSIONS = {
  width: 5.5,
  height: 2.0,
} as const;

/** Standard mat border for playbill frames */
export const PLAYBILL_MAT_BORDER = 2.0;

/** Spacing between items in multi-opening layouts */
export const PLAYBILL_SPACING = 0.5;

/** Additional height added to frame bottom when brass plaque is enabled */
export const PLAQUE_FRAME_EXTENSION = 0.75;

/** Distance from bottom of frame to plaque (when plaque is enabled) */
export const PLAQUE_BOTTOM_MARGIN = 1.0;

export type PlaybillLayoutType =
  | "playbill-single"
  | "playbill-ticket-1"
  | "playbill-2h"
  | "playbill-2v"
  | "playbill-2v-ticket-2"
  | "playbill-3h"
  | "playbill-3v"
  | "playbill-3v-ticket-3"
  | "playbill-4"
  | "playbill-4h"
  | "playbill-4h-ticket-4"
  | "playbill-4v"
  | "playbill-4v-ticket-4"
  | "playbill-5h"
  | "playbill-5h-ticket-5"
  | "playbill-6h"
  | "playbill-6h-ticket-6"
  | "playbill-2-ticket-2"
  | "playbill-3-ticket-3"
  | "playbill-4-ticket-4"
  | "playbill-6-2x3"
  | "playbill-6-2x3-ticket-6"
  | "playbill-6-3x2"
  | "playbill-6-3x2-ticket-6"
  | "playbill-8-2x4"
  | "playbill-8-2x4-ticket-8"
  | "playbill-8-4x2"
  | "playbill-8-4x2-ticket-8"
  | "playbill-9-3x3"
  | "playbill-9-3x3-ticket-9"
  | "playbill-12-3x4";

export interface PlaybillOpening {
  type: "playbill" | "ticket";
  x: number; // Position from frame interior top-left (inches)
  y: number; // Position from frame interior top-left (inches)
  width: number; // Opening width (inches)
  height: number; // Opening height (inches)
  zIndex?: number; // Stacking order: higher = front
}

export interface PlaybillLayout {
  id: PlaybillLayoutType;
  name: string;
  description: string;
  frameWidth: number; // Total outer frame size (inches)
  frameHeight: number; // Total outer frame size (inches)
  playbillCount: number;
  ticketCount: number;
  openings: PlaybillOpening[];
  recommendedFor: string[];
}

/**
 * All playbill layout configurations
 * Frame sizes calculated from: mat border (2.0") + spacing (0.5") + molding (1.0")
 */
export const PLAYBILL_LAYOUTS: PlaybillLayout[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // SINGLE PLAYBILL
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "playbill-single",
    name: "Single Playbill",
    description: "One playbill",
    frameWidth: 11.5,
    frameHeight: 14.5,
    playbillCount: 1,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Broadway debuts", "Special performances", "Favorite shows", "Gift displays"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PLAYBILL + TICKET COMBINATIONS (Vertical Arrangements)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "playbill-ticket-1",
    name: "Playbill + 1 Ticket",
    description: "One playbill with matching ticket",
    frameWidth: 11.5,
    frameHeight: 17.0,
    playbillCount: 1,
    ticketCount: 1,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2,
        zIndex: 1,
      },
    ],
    recommendedFor: [
      "Complete show memento",
      "First theater experience",
      "Anniversary shows",
      "Special occasions",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MULTIPLE PLAYBILLS - DUAL LAYOUTS
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "playbill-2h",
    name: "2 Playbills (Horizontal)",
    description: "Two playbills side by side",
    frameWidth: 17.5,
    frameHeight: 14.5,
    playbillCount: 2,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: [
      "Companion shows",
      "Before and after revival",
      "Dual role performances",
      "Theater season highlights",
    ],
  },
  {
    id: "playbill-2v",
    name: "2 Playbills (Vertical)",
    description: "Two playbills stacked",
    frameWidth: 11.5,
    frameHeight: 23.5,
    playbillCount: 2,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: [
      "Show evolution",
      "Original and revival",
      "Chronological collection",
      "Vertical wall space",
    ],
  },
  {
    id: "playbill-2v-ticket-2",
    name: "2 Playbills + 2 Tickets (Vertical)",
    description: "Two playbills with tickets in alternating rows",
    frameWidth: 11.5,
    frameHeight: 28.5,
    playbillCount: 2,
    ticketCount: 2,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Complete show collection", "Theater season memories"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MULTIPLE PLAYBILLS - TRIPLE AND QUAD
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "playbill-3h",
    name: "3 Playbills (Horizontal)",
    description: "Three playbills in a row",
    frameWidth: 23.5,
    frameHeight: 14.5,
    playbillCount: 3,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Trilogy series", "Best of year", "Top three favorites", "Theater festival"],
  },
  {
    id: "playbill-3v",
    name: "3 Playbills (Vertical)",
    description: "Three playbills stacked vertically",
    frameWidth: 11.5,
    frameHeight: 32.5,
    playbillCount: 3,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Show trilogy", "Chronological display", "Vertical wall space"],
  },
  {
    id: "playbill-3v-ticket-3",
    name: "3 Playbills + 3 Tickets (Vertical)",
    description: "Three playbills with tickets in alternating rows",
    frameWidth: 11.5,
    frameHeight: 40.0,
    playbillCount: 3,
    ticketCount: 3,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 26.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 35.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Complete trilogy collection", "Season highlights"],
  },
  {
    id: "playbill-4",
    name: "4 Playbills (2×2 Grid)",
    description: "Four playbills in 2×2 grid",
    frameWidth: 17.5,
    frameHeight: 23.5,
    playbillCount: 4,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: [
      "Theater season collection",
      "Big Four musicals",
      "Broadway favorites",
      "Quarterly highlights",
    ],
  },
  {
    id: "playbill-4h",
    name: "4 Playbills (Horizontal)",
    description: "Four playbills in a row",
    frameWidth: 29.5,
    frameHeight: 14.5,
    playbillCount: 4,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 21.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Broadway season", "Four-show series", "Horizontal display"],
  },
  {
    id: "playbill-4h-ticket-4",
    name: "4 Playbills + 4 Tickets (Horizontal)",
    description: "Four playbills with matching tickets below",
    frameWidth: 29.5,
    frameHeight: 17.0,
    playbillCount: 4,
    ticketCount: 4,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 21.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 21.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Complete season display", "Four-show memories"],
  },
  {
    id: "playbill-4v",
    name: "4 Playbills (Vertical)",
    description: "Four playbills stacked vertically",
    frameWidth: 11.5,
    frameHeight: 41.5,
    playbillCount: 4,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 30.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Chronological progression", "Tall vertical space", "Timeline display"],
  },
  {
    id: "playbill-4v-ticket-4",
    name: "4 Playbills + 4 Tickets (Vertical)",
    description: "Four playbills with tickets in alternating rows",
    frameWidth: 11.5,
    frameHeight: 51.5,
    playbillCount: 4,
    ticketCount: 4,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 26.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 35.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 37.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 46.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Complete vertical collection", "Tall wall display"],
  },
  {
    id: "playbill-5h",
    name: "5 Playbills (Horizontal)",
    description: "Five playbills in a row",
    frameWidth: 35.5,
    frameHeight: 14.5,
    playbillCount: 5,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 21.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 27.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Five-show series", "Extended horizontal display", "Top five favorites"],
  },
  {
    id: "playbill-5h-ticket-5",
    name: "5 Playbills + 5 Tickets (Horizontal)",
    description: "Five playbills with matching tickets below",
    frameWidth: 35.5,
    frameHeight: 17.0,
    playbillCount: 5,
    ticketCount: 5,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 21.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 27.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 21.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 27.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Five-show complete collection", "Extended memories"],
  },
  {
    id: "playbill-6h",
    name: "6 Playbills (Horizontal)",
    description: "Six playbills in a row",
    frameWidth: 41.5,
    frameHeight: 14.5,
    playbillCount: 6,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 21.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 27.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 33.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Six-show series", "Half-year collection", "Wide horizontal display"],
  },
  {
    id: "playbill-6h-ticket-6",
    name: "6 Playbills + 6 Tickets (Horizontal)",
    description: "Six playbills with matching tickets below",
    frameWidth: 41.5,
    frameHeight: 17.0,
    playbillCount: 6,
    ticketCount: 6,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 21.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 27.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 33.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 21.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 27.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 33.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Six-show complete collection", "Half-year memories"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MIXED LAYOUTS - PLAYBILLS + TICKETS
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "playbill-2-ticket-2",
    name: "2 Playbills + 2 Tickets",
    description: "Two playbills with matching tickets",
    frameWidth: 17.5,
    frameHeight: 17.0,
    playbillCount: 2,
    ticketCount: 2,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2,
        zIndex: 1,
      },
    ],
    recommendedFor: [
      "Couples collection",
      "Two-show memories",
      "Complete mementos",
      "Date night series",
    ],
  },
  {
    id: "playbill-3-ticket-3",
    name: "3 Playbills + 3 Tickets",
    description: "Three playbills with matching tickets",
    frameWidth: 23.5,
    frameHeight: 17.0,
    playbillCount: 3,
    ticketCount: 3,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 2,
        zIndex: 1,
      },
    ],
    recommendedFor: [
      "Family theater outings",
      "Three-show series",
      "Complete experience",
      "Special occasions",
    ],
  },
  {
    id: "playbill-4-ticket-4",
    name: "4 Playbills + 4 Tickets",
    description: "Four playbills with tickets in alternating rows",
    frameWidth: 17.5,
    frameHeight: 28.5,
    playbillCount: 4,
    ticketCount: 4,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 23.5,
        width: 5.5,
        height: 2,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 23.5,
        width: 5.5,
        height: 2,
        zIndex: 1,
      },
    ],
    recommendedFor: [
      "Advanced collectors",
      "Season subscriptions",
      "Complete theater year",
      "Ultimate display",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // LARGE COLLECTOR LAYOUTS - 6 PLAYBILLS
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "playbill-6-2x3",
    name: "6 Playbills (2×3 Grid)",
    description: "Six playbills in 2-column, 3-row layout",
    frameWidth: 17.5,
    frameHeight: 32.5,
    playbillCount: 6,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Theater enthusiast", "Award season"],
  },
  {
    id: "playbill-6-2x3-ticket-6",
    name: "6 Playbills + 6 Tickets (2×3 Grid)",
    description: "Six playbills with tickets in alternating pattern",
    frameWidth: 17.5,
    frameHeight: 41.0,
    playbillCount: 6,
    ticketCount: 6,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 26.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 26.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 35.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 35.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Complete season collection"],
  },
  {
    id: "playbill-6-3x2",
    name: "6 Playbills (3×2 Grid)",
    description: "Six playbills in 3-column, 2-row layout",
    frameWidth: 23.5,
    frameHeight: 23.5,
    playbillCount: 6,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Best of Broadway", "Theater season"],
  },
  {
    id: "playbill-6-3x2-ticket-6",
    name: "6 Playbills + 6 Tickets (3×2 Grid)",
    description: "Six playbills with tickets in alternating pattern",
    frameWidth: 23.5,
    frameHeight: 30.0,
    playbillCount: 6,
    ticketCount: 6,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Complete theater collection"],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PREMIUM LAYOUTS - 8, 9, 12 PLAYBILLS
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: "playbill-8-2x4",
    name: "8 Playbills (2×4 Grid)",
    description: "Eight playbills in 2-column, 4-row layout",
    frameWidth: 17.5,
    frameHeight: 41.5,
    playbillCount: 8,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 30.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 30.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Theater season", "Advanced collector"],
  },
  {
    id: "playbill-8-2x4-ticket-8",
    name: "8 Playbills + 8 Tickets (2×4 Grid)",
    description: "Eight playbills with tickets in alternating rows",
    frameWidth: 17.5,
    frameHeight: 51.5,
    playbillCount: 8,
    ticketCount: 8,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 26.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 26.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 35.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 35.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 37.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 37.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 46.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 46.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Complete annual collection", "Ultimate theater display"],
  },
  {
    id: "playbill-8-4x2",
    name: "8 Playbills (4×2 Grid)",
    description: "Eight playbills in 4-column, 2-row layout",
    frameWidth: 29.5,
    frameHeight: 23.5,
    playbillCount: 8,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 21.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 21.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Wide wall display", "Theater season highlights"],
  },
  {
    id: "playbill-8-4x2-ticket-8",
    name: "8 Playbills + 8 Tickets (4×2 Grid)",
    description: "Eight playbills with tickets in alternating rows",
    frameWidth: 29.5,
    frameHeight: 28.5,
    playbillCount: 8,
    ticketCount: 8,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 21.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 21.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 21.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 21.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Wide complete display", "Eight-show collection"],
  },
  {
    id: "playbill-9-3x3",
    name: "9 Playbills (3×3 Grid)",
    description: "Nine playbills in 3-column, 3-row layout",
    frameWidth: 23.5,
    frameHeight: 32.5,
    playbillCount: 9,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Year collection", "Statement display"],
  },
  {
    id: "playbill-9-3x3-ticket-9",
    name: "9 Playbills + 9 Tickets (3×3 Grid)",
    description: "Nine playbills with tickets in alternating pattern",
    frameWidth: 23.5,
    frameHeight: 39.0,
    playbillCount: 9,
    ticketCount: 9,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 14.5,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 23.5,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 26.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 26.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 26.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 3.0,
        y: 35.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 9.0,
        y: 35.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
      {
        type: "ticket",
        x: 15.0,
        y: 35.0,
        width: 5.5,
        height: 2.0,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Complete year display"],
  },
  {
    id: "playbill-12-3x4",
    name: "12 Playbills (3×4 Grid)",
    description: "Twelve playbills in 3-column, 4-row layout",
    frameWidth: 23.5,
    frameHeight: 41.5,
    playbillCount: 12,
    ticketCount: 0,
    openings: [
      {
        type: "playbill",
        x: 3.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 3.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 12.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 21.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 3.0,
        y: 30.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 9.0,
        y: 30.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
      {
        type: "playbill",
        x: 15.0,
        y: 30.0,
        width: 5.5,
        height: 8.5,
        zIndex: 1,
      },
    ],
    recommendedFor: ["Ultimate collection", "Full season"],
  },
];

/**
 * Get a specific playbill layout by ID
 */
export function getPlaybillLayoutById(id: PlaybillLayoutType): PlaybillLayout {
  const layout = PLAYBILL_LAYOUTS.find((layout) => layout.id === id);
  // Fallback to single playbill if layout not found (e.g., deleted layouts from old share links)
  return layout || PLAYBILL_LAYOUTS.find((layout) => layout.id === "playbill-single")!;
}

/**
 * Get all playbill layouts
 */
export function getAllPlaybillLayouts(): PlaybillLayout[] {
  return PLAYBILL_LAYOUTS;
}

/**
 * Calculate adjusted frame height when brass plaque or bottom weighted matting is enabled
 * Adds PLAQUE_FRAME_EXTENSION to the bottom of the frame for plaque
 * Adds bottomWeightedExtra (0.5") to the bottom for bottom weighted matting
 */
export function getAdjustedFrameHeight(
  layout: PlaybillLayout,
  brassPlaqueEnabled: boolean,
  bottomWeightedExtra: number = 0
): number {
  let height = layout.frameHeight + bottomWeightedExtra;
  if (brassPlaqueEnabled) {
    height += PLAQUE_FRAME_EXTENSION;
  }
  return height;
}

/**
 * Get playbill layouts by count
 * Filter layouts based on number of playbills and tickets
 */
export function getPlaybillLayoutsByCount(playbills?: number, tickets?: number): PlaybillLayout[] {
  return PLAYBILL_LAYOUTS.filter((layout) => {
    const playbillMatch = playbills === undefined || layout.playbillCount === playbills;
    const ticketMatch = tickets === undefined || layout.ticketCount === tickets;
    return playbillMatch && ticketMatch;
  });
}

/**
 * Get playbill layouts grouped by category
 */
export function getPlaybillLayoutsGrouped(): {
  single: PlaybillLayout[];
  withTickets: PlaybillLayout[];
  multiplePlaybills: PlaybillLayout[];
  mixed: PlaybillLayout[];
  ultimate: PlaybillLayout[];
} {
  return {
    single: PLAYBILL_LAYOUTS.filter((l) => l.playbillCount === 1 && l.ticketCount === 0),
    withTickets: PLAYBILL_LAYOUTS.filter((l) => l.playbillCount === 1 && l.ticketCount > 0),
    multiplePlaybills: PLAYBILL_LAYOUTS.filter(
      (l) => l.playbillCount > 1 && l.playbillCount <= 4 && l.ticketCount === 0
    ),
    mixed: PLAYBILL_LAYOUTS.filter((l) => l.playbillCount > 1 && l.ticketCount > 0),
    ultimate: PLAYBILL_LAYOUTS.filter((l) => l.playbillCount === 6),
  };
}

/**
 * Calculate frame dimensions including molding
 */
export function calculatePlaybillFrameDimensions(layout: PlaybillLayout): {
  frameWidth: number;
  frameHeight: number;
  interiorWidth: number;
  interiorHeight: number;
} {
  const interiorWidth = layout.frameWidth - 2 * DEFAULT_FRAME_MOLDING_WIDTH;
  const interiorHeight = layout.frameHeight - 2 * DEFAULT_FRAME_MOLDING_WIDTH;

  return {
    frameWidth: layout.frameWidth,
    frameHeight: layout.frameHeight,
    interiorWidth,
    interiorHeight,
  };
}

/**
 * Validate if a layout can fit within manufacturing limits
 */
export function validatePlaybillLayoutSize(layout: PlaybillLayout): {
  valid: boolean;
  error?: string;
} {
  const MAX_WIDTH = 48;
  const MAX_HEIGHT = 48;

  if (layout.frameWidth > MAX_WIDTH || layout.frameHeight > MAX_HEIGHT) {
    return {
      valid: false,
      error: `Frame size ${layout.frameWidth}" × ${layout.frameHeight}" exceeds maximum manufacturable size of ${MAX_WIDTH}" × ${MAX_HEIGHT}"`,
    };
  }

  return { valid: true };
}

/**
 * Get pricing tier for playbill frames
 */
export function getPlaybillPriceTier(layout: PlaybillLayout): string {
  const area = layout.frameWidth * layout.frameHeight;

  if (area <= 250) return "small";
  if (area <= 450) return "medium";
  if (area <= 700) return "large";
  return "xlarge";
}
