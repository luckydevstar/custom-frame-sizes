/**
 * Wedding invitation lifestyle photos for designer and pages.
 * Paths relative to shared_assets/invitation-frames/lifestyle/.
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

export interface InvitationLifestyleImage {
  url: string;
  alt: string;
}

const BASE = "invitation-frames/lifestyle";
const ALTS: string[] = [
  "Couple holding framed wedding invitation with photo in garden setting, oak frame with white mat",
  "Bride and groom displaying framed invitation with photo in cozy living room, natural wood frame",
  "Couple holding white framed wedding invitation with RSVP card in modern kitchen",
  "Newlyweds in rustic barn venue with framed wedding invitation and photo, walnut frame",
  "Elegant couple holding ornate framed invitation with vineyard wedding photo",
  "Close-up of framed wedding invitation with photo in dark walnut frame with white mat",
  "Couple in garden with natural oak framed wedding invitation and engagement photo",
  "Couple in living room holding white framed wedding invitation set with green accent mat",
  "Older couple in modern home with framed invitation and photo in dark wood frame",
  "Couple outdoors with rustic wood framed wedding invitation and RSVP card",
  "Couple in cozy living room displaying oak framed invitation with RSVP, warm lighting",
  "Bride and groom in ballroom with gold framed invitation and photo, elegant setting",
  "Couple in living room with oak framed invitation and RSVP card, casual setting",
  "Bride and groom in vineyard holding rustic framed invitation with wedding photo",
  "Same vineyard photo, couple with framed invitation in sunset lighting",
  "Couple in garden with gold framed invitation and dance photo, roses in background",
  "Older couple in garden with black framed invitation and vintage wedding photo",
  "Couple in cabin setting with oak framed invitation and small wedding photo",
];

export function getInvitationLifestyleImages(): InvitationLifestyleImage[] {
  const out: InvitationLifestyleImage[] = [];
  for (let i = 1; i <= 18; i++) {
    const num = i.toString().padStart(2, "0");
    out.push({
      url: getSharedAssetUrl(`${BASE}/invitation_${num}.jpeg`),
      alt: ALTS[i - 1] ?? "Wedding invitation frame lifestyle",
    });
  }
  return out;
}

export function getRandomInvitationLifestyleImage(): InvitationLifestyleImage {
  const images = getInvitationLifestyleImages();
  return images[Math.floor(Math.random() * images.length)] ?? images[0]!;
}
