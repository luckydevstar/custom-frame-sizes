/**
 * Legacy Ticket SVG Generation
 *
 * This file has been deprecated in favor of using real ticket images.
 * Kept for backward compatibility but all SVG generation has been removed.
 *
 * New ticket images are located in: public/playbill/tickets/
 * See: constants/playbill-insert-images.ts for ticket management
 */

export interface TicketDesign {
  showName: string;
  theater: string;
  date: string;
  time: string;
  section: string;
  row: string;
  seat: string;
  price: string;
  ticketNumber: string;
  colorScheme: {
    primary: string;
    secondary: string;
    text: string;
  };
}

/**
 * @deprecated This function is no longer used. Real ticket images are now used instead.
 * See: constants/playbill-insert-images.ts
 */
export function generateTicketSVG(_design: TicketDesign): string {
  console.warn("generateTicketSVG is deprecated. Use real ticket images instead.");
  return "";
}

/**
 * @deprecated This function is no longer used. Real ticket images are now used instead.
 * See: constants/playbill-insert-images.ts
 */
export function getRandomTicketDesign(): TicketDesign {
  console.warn("getRandomTicketDesign is deprecated. Use real ticket images instead.");
  return {
    showName: "",
    theater: "",
    date: "",
    time: "",
    section: "",
    row: "",
    seat: "",
    price: "",
    ticketNumber: "",
    colorScheme: { primary: "", secondary: "", text: "" },
  };
}
