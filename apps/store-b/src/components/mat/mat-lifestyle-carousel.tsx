"use client";

/**
 * origina-store-b/client/src/components/specialty/MatLifestyleCarousel.tsx
 */

import { BaseLifestyleCarousel } from "@framecraft/ui";

import { MAT_LIFESTYLE_IMAGES } from "@/constants/mat-lifestyle-images";

interface MatLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function MatLifestyleCarousel({ onImageClick }: MatLifestyleCarouselProps = {}) {
  return (
    <BaseLifestyleCarousel
      title="Mat boards in real displays"
      subtitle="See how custom mats enhance artwork and photos."
      images={MAT_LIFESTYLE_IMAGES}
      onImageClick={onImageClick}
      testIdPrefix="mat-lifestyle"
      ariaLabel="Mat board lifestyle photo gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
