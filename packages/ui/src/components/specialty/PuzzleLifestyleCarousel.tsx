import { useMemo } from "react";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import type { LifestyleImage } from "./shared/BaseLifestyleCarousel";

interface PuzzleLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
  // Images should be provided from app level or via props
  images?: LifestyleImage[];
}

export function PuzzleLifestyleCarousel({
  onImageClick,
  images,
}: PuzzleLifestyleCarouselProps = {}) {
  // If images are provided, use them; otherwise use empty array (app should provide via factory or context)
  const lifestyleImages = useMemo(() => {
    return images || [];
  }, [images]);

  if (lifestyleImages.length === 0) {
    return null;
  }

  return (
    <BaseLifestyleCarousel
      title="Puzzle Frames in Real Homes"
      subtitle="See how completed puzzles become permanent wall art."
      images={lifestyleImages}
      onImageClick={onImageClick}
      testIdPrefix="puzzle-lifestyle"
      ariaLabel="Puzzle frame lifestyle photo gallery"
      randomize={false}
      maxImages={30}
    />
  );
}
