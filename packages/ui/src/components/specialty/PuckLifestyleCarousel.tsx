"use client";

import { useMemo } from "react";
import { getPuckLifestyleImages } from "@framecraft/core";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";

export interface PuckLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

function buildImages(): Array<{ url: string; alt: string }> {
  return getPuckLifestyleImages();
}

const PUCK_LIFESTYLE_IMAGES = buildImages();

export function PuckLifestyleCarousel({ onImageClick }: PuckLifestyleCarouselProps = {}) {
  const images = useMemo(() => PUCK_LIFESTYLE_IMAGES, []);

  return (
    <BaseLifestyleCarousel
      title="Style Inspiration"
      subtitle="See how hockey fans display their prized pucks in custom frames."
      images={images}
      onImageClick={onImageClick}
      testIdPrefix="puck-lifestyle"
      ariaLabel="Hockey puck frame lifestyle photo gallery"
      randomize
      maxImages={26}
    />
  );
}
