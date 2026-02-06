"use client";

import { useMemo } from "react";
import { getPuzzleLifestyleImages } from "@framecraft/core/lib/puzzle-lifestyle-images";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import type { LifestyleImage } from "./shared/BaseLifestyleCarousel";

interface PuzzleLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
  images?: LifestyleImage[];
}

const DEFAULT_IMAGES = getPuzzleLifestyleImages();

export function PuzzleLifestyleCarousel({
  onImageClick,
  images,
}: PuzzleLifestyleCarouselProps = {}) {
  const lifestyleImages = useMemo(() => images ?? DEFAULT_IMAGES, [images]);

  if (lifestyleImages.length === 0) return null;

  return (
    <BaseLifestyleCarousel
      eyebrow="See Our Puzzle Frames in Action"
      title="Puzzle Frames in Real Homes"
      subtitle="See how completed puzzles become permanent wall art."
      images={lifestyleImages}
      onImageClick={onImageClick}
      testIdPrefix="puzzle-lifestyle"
      ariaLabel="Puzzle frame lifestyle photo gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
