import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import type { LifestyleImage } from "./shared/BaseLifestyleCarousel";

const PLAYBILL_LIFESTYLE_IMAGES: LifestyleImage[] = [
  {
    url: "/lifestyle/playbill/playbill-lifestyle-1.jpg",
    alt: "Hamilton, Lion King, and Wicked Playbills in black frame",
  },
  { url: "/lifestyle/playbill/playbill-lifestyle-2.jpg", alt: "Wicked Playbill in black frame" },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-3.jpg",
    alt: "Hamilton Playbill in natural wood frame",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-4.jpg",
    alt: "Book of Mormon Playbill in black frame",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-5.jpg",
    alt: "Hamilton Playbill with ticket stub in dark frame",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-6.jpg",
    alt: "Twelve Playbill collection in black frame",
  },
  { url: "/lifestyle/playbill/playbill-lifestyle-7.jpg", alt: "Lion King Playbill in black frame" },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-8.jpg",
    alt: "Wicked Playbill with ticket in black frame",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-9.jpg",
    alt: "Dear Evan Hansen, Hadestown, and Six Playbills in black frame",
  },
  { url: "/lifestyle/playbill/playbill-lifestyle-10.jpg", alt: "Hamilton Playbill in dark frame" },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-11.jpg",
    alt: "Cats Playbill in natural wood frame",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-12.jpg",
    alt: "Wicked Playbill with ticket stub in black frame",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-13.jpg",
    alt: "Lion King Playbill in black frame greenhouse setting",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-14.jpg",
    alt: "Hamilton Playbill with ticket stub in black frame cafe setting",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-15.jpg",
    alt: "Hamilton, Wicked, Lion King triple Playbill in black frame",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-16.jpg",
    alt: "Phantom of the Opera Playbill with ticket in dark frame",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-17.jpg",
    alt: "Wicked Playbill with ticket in natural wood frame park setting",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-18.jpg",
    alt: "Les Miserables, Phantom, Chicago triple Playbill in black frame",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-19.jpg",
    alt: "Phantom, Wicked, Hamilton triple Playbill in black frame",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-20.jpg",
    alt: "Phantom of the Opera Playbill in natural wood frame library setting",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-21.jpg",
    alt: "Hamilton, Phantom, Hadestown triple Playbill in walnut frame outdoor cafe",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-22.jpg",
    alt: "Wicked Playbill in black frame cozy living room",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-23.jpg",
    alt: "Wicked Playbill in walnut frame Central Park setting",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-24.jpg",
    alt: "Phantom, Hadestown, Come From Away triple Playbill in walnut frame library",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-25.jpg",
    alt: "Phantom of the Opera Playbill with ticket in black frame art studio",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-26.jpg",
    alt: "Hamilton, Wicked, Lion King triple Playbill in black frame library",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-27.jpg",
    alt: "Wicked Playbill in black frame vintage theater decor",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-28.jpg",
    alt: "Hamilton Playbill in black frame Central Park",
  },
  {
    url: "/lifestyle/playbill/playbill-lifestyle-29.jpg",
    alt: "Phantom of the Opera Playbill in black frame coffee shop",
  },
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
