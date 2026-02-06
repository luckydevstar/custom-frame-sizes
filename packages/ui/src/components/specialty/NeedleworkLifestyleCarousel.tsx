"use client";

import { useMemo } from "react";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import { getNeedleworkLifestyleImages, getSharedAssetUrl } from "@framecraft/core";

const NEEDLEWORK_LIFESTYLE_IMAGES: Array<{ url: string; alt: string }> = (() => {
  const items = getNeedleworkLifestyleImages();
  return items.map(({ path, alt }) => ({ url: getSharedAssetUrl(path) ?? "", alt: alt ?? "" }));
})();

function getRandomizedNeedleworkLifestyleImages(): Array<{ url: string; alt: string }> {
  const shuffled = [...NEEDLEWORK_LIFESTYLE_IMAGES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = shuffled[i]!;
    const b = shuffled[j]!;
    shuffled[i] = b;
    shuffled[j] = a;
  }
  return shuffled;
}

interface NeedleworkLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function NeedleworkLifestyleCarousel({
  onImageClick,
}: NeedleworkLifestyleCarouselProps = {}) {
  const images = useMemo(() => getRandomizedNeedleworkLifestyleImages(), []);

  return (
    <BaseLifestyleCarousel
      title="Needlework Frames in Real Homes"
      subtitle="See how crafters display their cross-stitch, embroidery, and needlework."
      images={images}
      onImageClick={onImageClick}
      testIdPrefix="needlework-lifestyle"
      ariaLabel="Needlework frame lifestyle photo gallery"
      randomize={false}
      maxImages={30}
    />
  );
}
