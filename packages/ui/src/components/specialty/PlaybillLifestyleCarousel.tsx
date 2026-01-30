"use client";

import { getSharedAssetUrl } from "@framecraft/core";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import type { LifestyleImage } from "./shared/BaseLifestyleCarousel";

// Helper to create CDN URLs for playbill lifestyle images
const createPlaybillImage = (path: string, alt: string): LifestyleImage => ({
  url: getSharedAssetUrl(path.startsWith("/") ? path.slice(1) : path),
  alt,
});

const PLAYBILL_LIFESTYLE_IMAGES: LifestyleImage[] = [
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-1.jpg",
    "Hamilton, Lion King, and Wicked Playbills in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-2.jpg",
    "Wicked Playbill in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-3.jpg",
    "Hamilton Playbill in natural wood frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-4.jpg",
    "Book of Mormon Playbill in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-5.jpg",
    "Hamilton Playbill with ticket stub in dark frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-6.jpg",
    "Twelve Playbill collection in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-7.jpg",
    "Lion King Playbill in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-8.jpg",
    "Wicked Playbill with ticket in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-9.jpg",
    "Dear Evan Hansen, Hadestown, and Six Playbills in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-10.jpg",
    "Hamilton Playbill in dark frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-11.jpg",
    "Cats Playbill in natural wood frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-12.jpg",
    "Wicked Playbill with ticket stub in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-13.jpg",
    "Lion King Playbill in black frame greenhouse setting"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-14.jpg",
    "Hamilton Playbill with ticket stub in black frame cafe setting"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-15.jpg",
    "Hamilton, Wicked, Lion King triple Playbill in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-16.jpg",
    "Phantom of the Opera Playbill with ticket in dark frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-17.jpg",
    "Wicked Playbill with ticket in natural wood frame park setting"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-18.jpg",
    "Les Miserables, Phantom, Chicago triple Playbill in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-19.jpg",
    "Phantom, Wicked, Hamilton triple Playbill in black frame"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-20.jpg",
    "Phantom of the Opera Playbill in natural wood frame library setting"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-21.jpg",
    "Hamilton, Phantom, Hadestown triple Playbill in walnut frame outdoor cafe"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-22.jpg",
    "Wicked Playbill in black frame cozy living room"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-23.jpg",
    "Wicked Playbill in walnut frame Central Park setting"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-24.jpg",
    "Phantom, Hadestown, Come From Away triple Playbill in walnut frame library"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-25.jpg",
    "Phantom of the Opera Playbill with ticket in black frame art studio"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-26.jpg",
    "Hamilton, Wicked, Lion King triple Playbill in black frame library"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-27.jpg",
    "Wicked Playbill in black frame vintage theater decor"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-28.jpg",
    "Hamilton Playbill in black frame Central Park"
  ),
  createPlaybillImage(
    "/lifestyle/playbill/playbill-lifestyle-29.jpg",
    "Phantom of the Opera Playbill in black frame coffee shop"
  ),
];

interface PlaybillLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function PlaybillLifestyleCarousel({ onImageClick }: PlaybillLifestyleCarouselProps = {}) {
  return (
    <BaseLifestyleCarousel
      title="Playbill Frames in Real Homes"
      subtitle="See how theater fans display their Broadway memories."
      images={PLAYBILL_LIFESTYLE_IMAGES}
      onImageClick={onImageClick}
      testIdPrefix="playbill-lifestyle"
      ariaLabel="Playbill frame lifestyle photo gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
