"use client";

import { useMemo } from "react";
import { getMilitaryLifestyleImages } from "@framecraft/core";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";

export interface MilitaryLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

function buildImages(): Array<{ url: string; alt: string }> {
  return getMilitaryLifestyleImages();
}

const MILITARY_LIFESTYLE_IMAGES = buildImages();

export function MilitaryLifestyleCarousel({ onImageClick }: MilitaryLifestyleCarouselProps = {}) {
  const images = useMemo(() => MILITARY_LIFESTYLE_IMAGES, []);

  return (
    <BaseLifestyleCarousel
      title="Military Frames in Action"
      subtitle="See how service members and families display their military memories."
      images={images}
      onImageClick={onImageClick}
      testIdPrefix="military-lifestyle"
      ariaLabel="Military shadowbox frame lifestyle photo gallery"
      randomize={false}
      maxImages={50}
    />
  );
}
