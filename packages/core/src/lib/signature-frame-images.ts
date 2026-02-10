/**
 * Signature frame placeholder/lifestyle images for preview.
 * Paths relative to shared_assets/signature-frames/lifestyle/.
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

const BASE = "signature-frames/lifestyle";

/** Filenames used in CODE – same names under shared_assets/signature-frames/lifestyle/ */
const SIGNATURE_IMAGE_FILENAMES = [
  "engagement-couple-park.jpg",
  "engagement-couple-romantic.jpg",
  "engagement-ring-closeup-flowers.jpg",
  "engagement-ring-lake.jpg",
  "proposal-beach-ring.jpg",
  "proposal-beach-sunset.jpg",
  "proposal-car-scenic.jpg",
  "proposal-dock-waterfront.jpg",
  "proposal-dramatic-sky.jpg",
  "proposal-garden-patio.jpg",
  "proposal-park-surprise.jpg",
  "proposal-winter-sunset.jpg",
  "maternity-couple-baby-shoes.jpg",
  "maternity-couple-beach.jpg",
  "maternity-couple-indoor.jpg",
  "maternity-heart-hands.jpg",
  "pregnancy-announcement-ultrasound.jpg",
  "baby-shower-belly-touch.jpg",
  "baby-shower-celebration.jpg",
  "baby-shower-group-celebration.jpg",
  "college-graduate-diploma.jpg",
  "college-graduate-portrait.jpg",
  "college-graduation-celebration.jpg",
  "graduates-friends-diplomas.jpg",
  "graduation-cap-toss.jpg",
  "preschool-graduation-child.jpg",
];

/**
 * Returns a random signature frame image URL (for preview placeholder).
 */
export function getRandomSignatureImageUrl(): string {
  const name =
    SIGNATURE_IMAGE_FILENAMES[Math.floor(Math.random() * SIGNATURE_IMAGE_FILENAMES.length)]!;
  return getSharedAssetUrl(`${BASE}/${name}`);
}

/**
 * Returns the URL for a given filename (e.g. from a fixed list).
 */
export function getSignatureImageUrl(filename: string): string {
  return getSharedAssetUrl(`${BASE}/${filename}`);
}

/**
 * Returns all signature image URLs.
 */
export function getAllSignatureImageUrls(): string[] {
  return SIGNATURE_IMAGE_FILENAMES.map((name) => getSharedAssetUrl(`${BASE}/${name}`));
}
