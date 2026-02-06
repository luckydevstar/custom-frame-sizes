"use client";

import { DIPLOMA_LIFESTYLE_IMAGES, getSharedAssetUrl } from "@framecraft/core";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";

interface DiplomaLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function DiplomaLifestyleCarousel({ onImageClick }: DiplomaLifestyleCarouselProps = {}) {
  const images = DIPLOMA_LIFESTYLE_IMAGES.map((img) => ({
    ...img,
    url: getSharedAssetUrl(img.url),
  }));
  return (
    <BaseLifestyleCarousel
      title="Style Inspiration"
      subtitle="See how our diploma frames look in real homes and offices."
      images={images}
      onImageClick={onImageClick}
      testIdPrefix="diploma-lifestyle"
      ariaLabel="Diploma frame lifestyle photo gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
