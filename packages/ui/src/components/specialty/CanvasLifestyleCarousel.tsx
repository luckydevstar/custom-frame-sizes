"use client";

import { getSharedAssetUrl } from "@framecraft/core";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import type { LifestyleImage } from "./shared/BaseLifestyleCarousel";

// Helper to create CDN URLs for canvas lifestyle images
const createCanvasImage = (path: string, alt: string): LifestyleImage => ({
  url: getSharedAssetUrl(path.startsWith("/") ? path.slice(1) : path),
  alt,
});

export const CANVAS_LIFESTYLE_IMAGES: LifestyleImage[] = [
  createCanvasImage(
    "canvas/lifestyle/lifestyle_1.jpg",
    "Canvas print in float frame displayed in modern living room"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_2.jpg",
    "Gallery wrapped canvas with float frame in home office"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_3.jpg",
    "Canvas artwork in float frame above contemporary sofa"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_4.jpg",
    "Abstract canvas print in floating frame in minimalist space"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_5.jpg",
    "Landscape canvas in float frame creating gallery wall"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_6.jpg",
    "Canvas photo print in float frame bedroom setting"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_7.jpg",
    "Modern canvas art in float frame dining room display"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_8.jpg",
    "Canvas portrait in float frame elegant home decor"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_9.jpg",
    "Nature canvas print with float frame entryway display"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_10.jpg",
    "Canvas artwork in float frame professional office setting"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_11.jpg",
    "Gallery canvas in floating frame studio apartment"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_12.jpg",
    "Canvas landscape print float frame coastal decor"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_13.jpg",
    "Abstract canvas art in float frame contemporary interior"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_14.jpg",
    "Canvas photography print floating frame living space"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_15.jpg",
    "Modern canvas in float frame above fireplace mantel"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_16.jpg",
    "Canvas artwork floating frame bedroom accent wall"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_17.jpg",
    "Large canvas print in float frame open concept home"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_18.jpg",
    "Canvas portrait with float frame traditional home"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_19.jpg",
    "Gallery canvas in floating frame hallway display"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_20.jpg",
    "Canvas nature print float frame sunlit room"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_21.jpg",
    "Modern canvas art floating frame industrial loft"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_22.jpg",
    "Canvas print in float frame cozy reading nook"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_23.jpg",
    "Abstract canvas floating frame contemporary gallery"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_24.jpg",
    "Canvas landscape in float frame mountain cabin"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_25.jpg",
    "Large format canvas floating frame great room"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_26.jpg",
    "Canvas photography print float frame urban apartment"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_27.jpg",
    "Gallery canvas in floating frame boutique hotel style"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_28.jpg",
    "Canvas artwork float frame mid-century modern decor"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_29.jpg",
    "Canvas print in float frame bohemian living space"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_30.jpg",
    "Modern canvas floating frame scandinavian interior"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_31.jpg",
    "Canvas landscape in float frame lake house setting"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_32.jpg",
    "Abstract canvas art floating frame designer home"
  ),
  createCanvasImage(
    "canvas/lifestyle/lifestyle_33.jpg",
    "Canvas photography float frame luxury penthouse"
  ),
];

interface CanvasLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function CanvasLifestyleCarousel({ onImageClick }: CanvasLifestyleCarouselProps = {}) {
  return (
    <BaseLifestyleCarousel
      title="Canvas Float Frames in Real Homes"
      subtitle="See how canvas prints look with professional float frames."
      images={CANVAS_LIFESTYLE_IMAGES}
      onImageClick={onImageClick}
      testIdPrefix="canvas-lifestyle"
      ariaLabel="Canvas float frame lifestyle photo gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
