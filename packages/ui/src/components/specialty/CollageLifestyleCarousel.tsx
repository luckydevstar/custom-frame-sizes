"use client";

import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import { getSharedAssetUrl } from "@framecraft/core";

const COLLAGE_LIFESTYLE_PATHS: Array<{ path: string; alt: string }> = [
  {
    path: "collage/lifestyle/collage-lifestyle-1.jpg",
    alt: "Family holding custom multi-opening collage frame with family photos in outdoor setting",
  },
  {
    path: "collage/lifestyle/collage-lifestyle-2.jpg",
    alt: "Custom collage frame displaying wedding and family memories on living room wall",
  },
  {
    path: "collage/lifestyle/collage-lifestyle-3.jpg",
    alt: "Photo collage frame with multiple openings showcasing travel and vacation photos",
  },
  {
    path: "collage/lifestyle/collage-lifestyle-4.jpg",
    alt: "Large collage picture frame with family portraits arranged in modern layout",
  },
  {
    path: "collage/lifestyle/collage-lifestyle-5.jpg",
    alt: "Custom multi-photo frame displaying baby and family milestone photos",
  },
  {
    path: "collage/lifestyle/collage-lifestyle-6.jpg",
    alt: "Gallery wall with custom collage frames featuring coordinated family photos",
  },
  {
    path: "collage/lifestyle/collage-lifestyle-7.jpg",
    alt: "Multi-opening collage frame with graduation and school year photos",
  },
  {
    path: "collage/lifestyle/collage-lifestyle-8.jpg",
    alt: "Custom photo collage frame showcasing wedding party and ceremony moments",
  },
  {
    path: "collage/lifestyle/collage-lifestyle-9.jpg",
    alt: "Family memories displayed in large custom collage frame with white mat",
  },
  {
    path: "collage/lifestyle/collage-lifestyle-10.jpg",
    alt: "Professional collage frame arrangement with family and pet photos",
  },
];

const COLLAGE_LIFESTYLE_IMAGES = COLLAGE_LIFESTYLE_PATHS.map(({ path, alt }) => ({
  url: getSharedAssetUrl(path),
  alt,
}));

interface CollageLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function CollageLifestyleCarousel({ onImageClick }: CollageLifestyleCarouselProps = {}) {
  return (
    <BaseLifestyleCarousel
      eyebrow="See Our Collage Frames in Action"
      title="Collage Frames in Real Homes"
      subtitle="See how multi-opening frames display family photos and memories."
      images={COLLAGE_LIFESTYLE_IMAGES}
      onImageClick={onImageClick}
      testIdPrefix="collage-lifestyle"
      ariaLabel="Photo collage frame lifestyle gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
