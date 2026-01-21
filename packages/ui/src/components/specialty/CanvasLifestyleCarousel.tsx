import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import type { LifestyleImage } from "./shared/BaseLifestyleCarousel";

export const CANVAS_LIFESTYLE_IMAGES: LifestyleImage[] = [
  {
    url: "/lifestyle/canvas/lifestyle_1.jpg",
    alt: "Canvas print in float frame displayed in modern living room",
  },
  {
    url: "/lifestyle/canvas/lifestyle_2.jpg",
    alt: "Gallery wrapped canvas with float frame in home office",
  },
  {
    url: "/lifestyle/canvas/lifestyle_3.jpg",
    alt: "Canvas artwork in float frame above contemporary sofa",
  },
  {
    url: "/lifestyle/canvas/lifestyle_4.jpg",
    alt: "Abstract canvas print in floating frame in minimalist space",
  },
  {
    url: "/lifestyle/canvas/lifestyle_5.jpg",
    alt: "Landscape canvas in float frame creating gallery wall",
  },
  {
    url: "/lifestyle/canvas/lifestyle_6.jpg",
    alt: "Canvas photo print in float frame bedroom setting",
  },
  {
    url: "/lifestyle/canvas/lifestyle_7.jpg",
    alt: "Modern canvas art in float frame dining room display",
  },
  {
    url: "/lifestyle/canvas/lifestyle_8.jpg",
    alt: "Canvas portrait in float frame elegant home decor",
  },
  {
    url: "/lifestyle/canvas/lifestyle_9.jpg",
    alt: "Nature canvas print with float frame entryway display",
  },
  {
    url: "/lifestyle/canvas/lifestyle_10.jpg",
    alt: "Canvas artwork in float frame professional office setting",
  },
  {
    url: "/lifestyle/canvas/lifestyle_11.jpg",
    alt: "Gallery canvas in floating frame studio apartment",
  },
  {
    url: "/lifestyle/canvas/lifestyle_12.jpg",
    alt: "Canvas landscape print float frame coastal decor",
  },
  {
    url: "/lifestyle/canvas/lifestyle_13.jpg",
    alt: "Abstract canvas art in float frame contemporary interior",
  },
  {
    url: "/lifestyle/canvas/lifestyle_14.jpg",
    alt: "Canvas photography print floating frame living space",
  },
  {
    url: "/lifestyle/canvas/lifestyle_15.jpg",
    alt: "Modern canvas in float frame above fireplace mantel",
  },
  {
    url: "/lifestyle/canvas/lifestyle_16.jpg",
    alt: "Canvas artwork floating frame bedroom accent wall",
  },
  {
    url: "/lifestyle/canvas/lifestyle_17.jpg",
    alt: "Large canvas print in float frame open concept home",
  },
  {
    url: "/lifestyle/canvas/lifestyle_18.jpg",
    alt: "Canvas portrait with float frame traditional home",
  },
  {
    url: "/lifestyle/canvas/lifestyle_19.jpg",
    alt: "Gallery canvas in floating frame hallway display",
  },
  { url: "/lifestyle/canvas/lifestyle_20.jpg", alt: "Canvas nature print float frame sunlit room" },
  {
    url: "/lifestyle/canvas/lifestyle_21.jpg",
    alt: "Modern canvas art floating frame industrial loft",
  },
  {
    url: "/lifestyle/canvas/lifestyle_22.jpg",
    alt: "Canvas print in float frame cozy reading nook",
  },
  {
    url: "/lifestyle/canvas/lifestyle_23.jpg",
    alt: "Abstract canvas floating frame contemporary gallery",
  },
  {
    url: "/lifestyle/canvas/lifestyle_24.jpg",
    alt: "Canvas landscape in float frame mountain cabin",
  },
  {
    url: "/lifestyle/canvas/lifestyle_25.jpg",
    alt: "Large format canvas floating frame great room",
  },
  {
    url: "/lifestyle/canvas/lifestyle_26.jpg",
    alt: "Canvas photography print float frame urban apartment",
  },
  {
    url: "/lifestyle/canvas/lifestyle_27.jpg",
    alt: "Gallery canvas in floating frame boutique hotel style",
  },
  {
    url: "/lifestyle/canvas/lifestyle_28.jpg",
    alt: "Canvas artwork float frame mid-century modern decor",
  },
  {
    url: "/lifestyle/canvas/lifestyle_29.jpg",
    alt: "Canvas print in float frame bohemian living space",
  },
  {
    url: "/lifestyle/canvas/lifestyle_30.jpg",
    alt: "Modern canvas floating frame scandinavian interior",
  },
  {
    url: "/lifestyle/canvas/lifestyle_31.jpg",
    alt: "Canvas landscape in float frame lake house setting",
  },
  {
    url: "/lifestyle/canvas/lifestyle_32.jpg",
    alt: "Abstract canvas art floating frame designer home",
  },
  {
    url: "/lifestyle/canvas/lifestyle_33.jpg",
    alt: "Canvas photography float frame luxury penthouse",
  },
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
