"use client";

import { useMemo } from "react";
import { getJerseyLifestyleImages } from "@framecraft/core";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";

export interface JerseyLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

function buildImages(): Array<{ url: string; alt: string }> {
  return getJerseyLifestyleImages();
}

const JERSEY_LIFESTYLE_IMAGES = buildImages();

export function JerseyLifestyleCarousel({ onImageClick }: JerseyLifestyleCarouselProps = {}) {
  const images = useMemo(() => JERSEY_LIFESTYLE_IMAGES, []);

  return (
    <BaseLifestyleCarousel
      title="Jersey Frames in Real Homes"
      subtitle="See how sports fans display their treasured jerseys."
      images={images}
      onImageClick={onImageClick}
      testIdPrefix="jersey-lifestyle"
      ariaLabel="Jersey frame lifestyle photo gallery"
      randomize
      maxImages={30}
    />
  );
}
