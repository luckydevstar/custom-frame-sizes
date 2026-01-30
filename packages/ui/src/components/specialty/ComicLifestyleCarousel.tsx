"use client";

import { useMemo } from "react";
import { getFramesByCategory, getSharedAssetUrl } from "@framecraft/core";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import type { LifestyleImage } from "./shared/BaseLifestyleCarousel";
import type { AlternateImage } from "@framecraft/types";

interface ComicLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function ComicLifestyleCarousel({ onImageClick }: ComicLifestyleCarouselProps = {}) {
  const lifestyleImages = useMemo(() => {
    const shadowboxFrames = getFramesByCategory("shadowbox");
    const imageMap = new Map<string, LifestyleImage>();

    shadowboxFrames.forEach((frame) => {
      const comicLifestyleImages =
        frame.alternateImages?.filter((img: AlternateImage) => img.type === "comic_lifestyle") ||
        [];
      comicLifestyleImages.forEach((img: AlternateImage) => {
        // Convert local path to CDN URL
        const localPath = img.url.startsWith("/") ? img.url.slice(1) : img.url;
        const cdnUrl = getSharedAssetUrl(localPath);

        if (!imageMap.has(cdnUrl)) {
          const filename = img.url.split("/").pop() || "";
          const imageNumber = filename.match(/\((\d+)\)/)?.[1] || "";
          const altText = `Custom shadowbox frame displaying framed comic books in ${frame.name} style - professional comic collection display example ${imageNumber}`;

          imageMap.set(cdnUrl, {
            url: cdnUrl,
            alt: altText,
          });
        }
      });
    });

    return Array.from(imageMap.values());
  }, []);

  if (lifestyleImages.length === 0) {
    return null;
  }

  return (
    <BaseLifestyleCarousel
      title="Comic Display Inspiration"
      subtitle="Browse real customer frames showcasing comic books and graded slabs."
      images={lifestyleImages}
      onImageClick={onImageClick}
      testIdPrefix="comic-lifestyle"
      ariaLabel="Comic frame lifestyle photo gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
