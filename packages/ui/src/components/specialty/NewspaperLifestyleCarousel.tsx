"use client";

import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import { getNewspaperLifestyleImages, getSharedAssetUrl } from "@framecraft/core";

const NEWSPAPER_LIFESTYLE_IMAGES = (() => {
  const items = getNewspaperLifestyleImages();
  return items.map(({ path, alt }) => ({ url: getSharedAssetUrl(path), alt }));
})();

interface NewspaperLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function NewspaperLifestyleCarousel({ onImageClick }: NewspaperLifestyleCarouselProps = {}) {
  return (
    <BaseLifestyleCarousel
      eyebrow="See Our Newspaper Frames in Action"
      title="Newspaper Frames in Real Homes"
      subtitle="See how families preserve their historic headlines and milestones."
      images={NEWSPAPER_LIFESTYLE_IMAGES}
      onImageClick={onImageClick}
      testIdPrefix="newspaper-lifestyle"
      ariaLabel="Newspaper frame lifestyle photo gallery"
      randomize={true}
      maxImages={26}
    />
  );
}
