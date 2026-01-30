"use client";

import { useMemo } from "react";
import { getFrameStyleById, getSharedAssetUrl } from "@framecraft/core";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import type { LifestyleImage } from "./shared/BaseLifestyleCarousel";
import type { AlternateImage } from "@framecraft/types";

interface JerseyLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function JerseyLifestyleCarousel({ onImageClick }: JerseyLifestyleCarouselProps = {}) {
  const lifestyleImages = useMemo(() => {
    const jerseyFrameIds = [
      "extra-deep-matte-black",
      "extra-deep-bright-white",
      "extra-deep-rich-walnut",
    ];
    const allImages: LifestyleImage[] = [];

    jerseyFrameIds.forEach((frameId) => {
      const frame = getFrameStyleById(frameId);
      if (frame) {
        const jerseyLifestyleImages =
          frame.alternateImages?.filter((img: AlternateImage) => img.type === "jersey_lifestyle") ||
          [];
        jerseyLifestyleImages.forEach((img: AlternateImage) => {
          // Convert local path to CDN URL
          const localPath = img.url.startsWith("/") ? img.url.slice(1) : img.url;
          allImages.push({
            url: getSharedAssetUrl(localPath),
            alt: img.alt,
          });
        });
      }
    });

    return allImages;
  }, []);

  if (lifestyleImages.length === 0) {
    return null;
  }

  return (
    <BaseLifestyleCarousel
      title="Jersey Frames in Real Homes"
      subtitle="See how sports fans display their treasured jerseys."
      images={lifestyleImages}
      onImageClick={onImageClick}
      testIdPrefix="jersey-lifestyle"
      ariaLabel="Jersey frame lifestyle photo gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
