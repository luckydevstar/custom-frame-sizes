/**
 * Ticket Stub Lifestyle Photos - for ticket frame designer and pages.
 * Paths relative to shared_assets/ticket-frames/lifestyle/.
 * Use getSharedAssetUrl(path) for img src.
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export interface TicketStubLifestyleImage {
  url: string;
  alt: string;
}

const LIFESTYLE_COUNT = 17;
const BASE_PATH = "ticket-frames/lifestyle";

const ALTS: string[] = [
  "Custom framed concert ticket in rustic barnwood frame with cream mat, living room setting with leather sofa",
  "Framed Winterland concert ticket in weathered wood frame, cozy living room with brown leather furniture",
  "Three-ticket display featuring indie concert tickets in dark wood frame, home decor setting",
  "Concert ticket frame with multiple rock show tickets displayed with dates, held in modern interior",
  "Six-ticket concert collection in oak frame featuring classic rock memorabilia",
  "Framed ticket and concert photo combo in honey oak frame, vintage music room decor",
  "Large custom framed concert ticket collection with rock memorabilia in black frame",
  "Framed arena concert ticket in rustic barnwood frame, record player and vinyl collection visible",
  "Rock concert ticket in weathered wood shadowbox frame, held in home music room",
  "Large framed concert memorabilia collection with artwork and event tickets in natural wood frame",
  "Stadium concert ticket in walnut frame with white mat, gallery wall of photos in background",
  "Multi-ticket concert frame with nine classic rock show tickets in oak frame",
  "Three-ticket display featuring rock and indie concert tickets in barnwood shadowbox",
  "Large framed ticket collection with multiple classic rock concerts in barnwood frame",
  "Framed ticket and concert photo combo in honey oak frame, vintage record player visible",
  "Framed arena ticket in weathered barnwood frame, brown leather couch background",
  "Stadium concert ticket in natural oak shadowbox frame, leather sofa and gallery wall visible",
];

function getPath(i: number): string {
  return `${BASE_PATH}/ticket_lifestyle_${i}.jpeg`;
}

/**
 * Returns all ticket stub lifestyle images (URLs via getSharedAssetUrl).
 */
export function getTicketStubLifestyleImages(): TicketStubLifestyleImage[] {
  const out: TicketStubLifestyleImage[] = [];
  for (let i = 1; i <= LIFESTYLE_COUNT; i++) {
    out.push({
      url: getSharedAssetUrl(getPath(i)),
      alt: ALTS[i - 1] ?? "Ticket stub frame lifestyle",
    });
  }
  return out;
}

/**
 * Returns a single random ticket stub lifestyle image.
 */
export function getRandomTicketStubLifestyleImage(): TicketStubLifestyleImage {
  const images = getTicketStubLifestyleImages();
  const index = Math.floor(Math.random() * images.length);
  return images[index] ?? images[0]!;
}
