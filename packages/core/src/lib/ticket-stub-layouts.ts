/**
 * Ticket Stub Layout Configurations
 * Defines standard dimensions and specifications for framing concert/event tickets and memorabilia.
 *
 * Coordinate system:
 *  - All opening x/y are measured from the FRAME INTERIOR top-left
 *    (after subtracting frame molding/rabbet which is typically 1.0").
 *  - frameWidth/frameHeight represent the OUTER frame dimensions.
 *  - The actual interior space is frameWidth - (2 × FRAME_MOLDING_WIDTH).
 */

/** Default frame molding width (inches). */
export const DEFAULT_FRAME_MOLDING_WIDTH = 1.0;

/** Standard ticket dimensions */
export const TICKET_STANDARD_DIMENSIONS = {
  width: 5.625, // Ticketmaster standard
  height: 2.125,
} as const;

export const TICKET_STUBLESS_DIMENSIONS = {
  width: 5.5,
  height: 2.0,
} as const;

export const TICKET_VIP_DIMENSIONS = {
  width: 8.5,
  height: 2.75,
} as const;

/** Standard poster dimensions */
export const POSTER_DIMENSIONS = {
  small: { width: 11, height: 17 },
  windowCard: { width: 14, height: 20 },
  medium: { width: 18, height: 24 },
  large: { width: 24, height: 36 },
} as const;

/** Standard photo dimensions */
export const PHOTO_DIMENSIONS = {
  small: { width: 4, height: 6 },
  medium: { width: 5, height: 7 },
  large: { width: 8, height: 10 },
} as const;

/** Photo size options for ticket+photo layouts (portrait orientation: width x height) */
export const TICKET_PHOTO_SIZES = {
  "4x6": { width: 6, height: 4, displayName: '4×6"' },
  "5x7": { width: 7, height: 5, displayName: '5×7"' },
  "8x10": { width: 10, height: 8, displayName: '8×10"' },
} as const;

export type TicketPhotoSizeId = keyof typeof TICKET_PHOTO_SIZES;

/** Poster size options for concert poster layouts (portrait: width x height) */
export const TICKET_POSTER_SIZES = {
  "11x17": { width: 11, height: 17, displayName: '11×17"' },
  "18x24": { width: 18, height: 24, displayName: '18×24"' },
  "24x36": { width: 24, height: 36, displayName: '24×36"' },
} as const;

export type TicketPosterSizeId = keyof typeof TICKET_POSTER_SIZES;

/** Standard mat border for ticket frames */
export const TICKET_MAT_BORDER = 2.0;

/** Spacing between items in multi-opening layouts */
export const TICKET_SPACING = 0.5;

export type TicketStubLayoutType =
  | "ticket-photo-single-4x6"
  | "ticket-photo-single-5x7"
  | "ticket-photo-single-8x10"
  | "ticket-trio"
  | "ticket-grid-4"
  | "single-ticket"
  | "concert-poster-tickets-11x17"
  | "concert-poster-tickets-18x24"
  | "festival-timeline";

export interface TicketStubOpening {
  type: "ticket" | "ticket-stubless" | "ticket-vip" | "poster" | "photo";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
}

export interface TicketStubLayout {
  id: TicketStubLayoutType;
  name: string;
  description: string;
  frameWidth: number;
  frameHeight: number;
  ticketCount: number;
  photoCount: number;
  posterCount: number;
  openings: TicketStubOpening[];
  recommendedFor: string[];
  photoSize?: TicketPhotoSizeId;
  posterSize?: TicketPosterSizeId;
  supportsPrintAndFrame?: boolean;
}

/**
 * All ticket stub layout configurations
 * Frame sizes calculated to fit within max 32×40" or 40×32" mat board
 */
export const TICKET_STUB_LAYOUTS: TicketStubLayout[] = [
  {
    id: "ticket-photo-single-4x6",
    name: "Single Ticket + Photo",
    description: "One ticket with a 4×6 photo",
    frameWidth: 12.0,
    frameHeight: 13.0,
    ticketCount: 1,
    photoCount: 1,
    posterCount: 0,
    photoSize: "4x6",
    supportsPrintAndFrame: true,
    openings: [
      { type: "ticket", x: 3.1875, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "photo", x: 3.0, y: 6.0, width: 6.0, height: 4.0, zIndex: 1 },
    ],
    recommendedFor: [
      "First concert",
      "Special performance",
      "Birthday gift",
      "Meet and greet memory",
    ],
  },
  {
    id: "single-ticket",
    name: "Single Ticket",
    description: "One ticket with elegant matting",
    frameWidth: 10.0,
    frameHeight: 6.0,
    ticketCount: 1,
    photoCount: 0,
    posterCount: 0,
    openings: [{ type: "ticket", x: 2.1875, y: 1.9375, width: 5.625, height: 2.125, zIndex: 1 }],
    recommendedFor: ["First concert", "Special event", "Gift for fan", "Meaningful memory"],
  },
  {
    id: "ticket-photo-single-5x7",
    name: "Single Ticket + Photo",
    description: "One ticket with a 5×7 photo",
    frameWidth: 13.0,
    frameHeight: 14.0,
    ticketCount: 1,
    photoCount: 1,
    posterCount: 0,
    photoSize: "5x7",
    supportsPrintAndFrame: true,
    openings: [
      { type: "ticket", x: 3.6875, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "photo", x: 3.0, y: 6.0, width: 7.0, height: 5.0, zIndex: 1 },
    ],
    recommendedFor: [
      "First concert",
      "Special performance",
      "Birthday gift",
      "Meet and greet memory",
    ],
  },
  {
    id: "ticket-photo-single-8x10",
    name: "Single Ticket + Photo",
    description: "One ticket with an 8×10 photo",
    frameWidth: 16.0,
    frameHeight: 17.0,
    ticketCount: 1,
    photoCount: 1,
    posterCount: 0,
    photoSize: "8x10",
    supportsPrintAndFrame: true,
    openings: [
      { type: "ticket", x: 5.1875, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "photo", x: 3.0, y: 6.0, width: 10.0, height: 8.0, zIndex: 1 },
    ],
    recommendedFor: [
      "First concert",
      "Special performance",
      "Birthday gift",
      "Meet and greet memory",
    ],
  },
  {
    id: "ticket-trio",
    name: "Ticket Trio",
    description: "Three tickets displayed horizontally",
    frameWidth: 24.0,
    frameHeight: 8.0,
    ticketCount: 3,
    photoCount: 0,
    posterCount: 0,
    openings: [
      { type: "ticket", x: 3.0, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 9.125, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 15.25, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
    ],
    recommendedFor: [
      "Three-night tour",
      "Festival highlights",
      "Best shows of year",
      "Trilogy events",
    ],
  },
  {
    id: "ticket-grid-4",
    name: "Ticket Grid 4",
    description: "Four tickets in 2×2 grid",
    frameWidth: 17.5,
    frameHeight: 10.5,
    ticketCount: 4,
    photoCount: 0,
    posterCount: 0,
    openings: [
      { type: "ticket", x: 3.0, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 9.125, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 3.0, y: 5.625, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 9.125, y: 5.625, width: 5.625, height: 2.125, zIndex: 1 },
    ],
    recommendedFor: ["Concert series", "Quarterly events", "Tour dates", "Band collection"],
  },
  {
    id: "concert-poster-tickets-11x17",
    name: "Concert Poster + Tickets",
    description: "11×17 poster with one ticket below",
    frameWidth: 17.0,
    frameHeight: 25.0,
    ticketCount: 1,
    photoCount: 0,
    posterCount: 1,
    posterSize: "11x17",
    openings: [
      { type: "poster", x: 3.0, y: 3.0, width: 11.0, height: 17.0, zIndex: 1 },
      { type: "ticket", x: 5.6875, y: 20.5, width: 5.625, height: 2.125, zIndex: 1 },
    ],
    recommendedFor: [
      "Concert memorabilia",
      "Tour poster display",
      "Festival keepsake",
      "Complete concert memory",
    ],
  },
  {
    id: "concert-poster-tickets-18x24",
    name: "Concert Poster + Tickets",
    description: "18×24 poster with two tickets below",
    frameWidth: 24.0,
    frameHeight: 32.0,
    ticketCount: 2,
    photoCount: 0,
    posterCount: 1,
    posterSize: "18x24",
    openings: [
      { type: "poster", x: 3.0, y: 3.0, width: 18.0, height: 24.0, zIndex: 1 },
      { type: "ticket", x: 5.375, y: 27.5, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 13.0, y: 27.5, width: 5.625, height: 2.125, zIndex: 1 },
    ],
    recommendedFor: [
      "Concert memorabilia",
      "Tour poster display",
      "Festival keepsake",
      "Complete concert memory",
    ],
  },
  {
    id: "festival-timeline",
    name: "Festival Timeline",
    description: "Six tickets in chronological order",
    frameWidth: 41.5,
    frameHeight: 8.0,
    ticketCount: 6,
    photoCount: 0,
    posterCount: 0,
    openings: [
      { type: "ticket", x: 2.5, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 8.625, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 14.75, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 20.875, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 27.0, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
      { type: "ticket", x: 33.125, y: 3.0, width: 5.625, height: 2.125, zIndex: 1 },
    ],
    recommendedFor: [
      "Music festival",
      "Multi-day event",
      "Chronological display",
      "Tour progression",
    ],
  },
];
