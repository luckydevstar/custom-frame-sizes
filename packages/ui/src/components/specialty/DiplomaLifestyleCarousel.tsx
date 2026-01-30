"use client";

import { DIPLOMA_LIFESTYLE_IMAGES } from "@framecraft/core";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";

interface DiplomaLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function DiplomaLifestyleCarousel({ onImageClick }: DiplomaLifestyleCarouselProps = {}) {
  return (
    <BaseLifestyleCarousel
      title="Style Inspiration"
      subtitle="See how our diploma frames look in real homes and offices."
      images={DIPLOMA_LIFESTYLE_IMAGES}
      onImageClick={onImageClick}
      testIdPrefix="diploma-lifestyle"
      ariaLabel="Diploma frame lifestyle photo gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
