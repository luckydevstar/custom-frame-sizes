"use client";

import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";
import { getSharedAssetUrl } from "@framecraft/core";

const MAGAZINE_LIFESTYLE_PATHS: Array<{ path: string; alt: string }> = [
  {
    path: "magazine/lifestyle/lifestyle_1.jpg",
    alt: "Custom framed Sports Illustrated magazine cover display in home office setting",
  },
  {
    path: "magazine/lifestyle/lifestyle_2.jpg",
    alt: "Framed Time Magazine covers creating gallery wall in living room",
  },
  {
    path: "magazine/lifestyle/lifestyle_3.jpg",
    alt: "LIFE magazine cover professionally framed with archival matting",
  },
  {
    path: "magazine/lifestyle/lifestyle_4.jpg",
    alt: "Vintage National Geographic magazine displayed in custom shadowbox frame",
  },
  {
    path: "magazine/lifestyle/lifestyle_5.jpg",
    alt: "Entertainment Weekly magazine cover framed as wall art decor",
  },
  {
    path: "magazine/lifestyle/lifestyle_6.jpg",
    alt: "Rolling Stone magazine cover in professional frame display",
  },
  {
    path: "magazine/lifestyle/lifestyle_7.jpg",
    alt: "Framed magazine collection arranged as gallery wall centerpiece",
  },
  {
    path: "magazine/lifestyle/lifestyle_8.jpg",
    alt: "Sports magazine cover showcased in premium custom frame",
  },
  {
    path: "magazine/lifestyle/lifestyle_9.jpg",
    alt: "Vintage magazine art display in shadowbox frame with double mat",
  },
  {
    path: "magazine/lifestyle/lifestyle_10.jpg",
    alt: "Magazine cover collection framed in matching black frames",
  },
  {
    path: "magazine/lifestyle/lifestyle_11.jpg",
    alt: "Celebrity magazine cover professionally displayed in custom frame",
  },
  {
    path: "magazine/lifestyle/lifestyle_12.jpg",
    alt: "Historic magazine covers preserved in archival quality frames",
  },
  {
    path: "magazine/lifestyle/lifestyle_13.jpg",
    alt: "Magazine gallery wall featuring multiple framed covers",
  },
  {
    path: "magazine/lifestyle/lifestyle_14.jpg",
    alt: "Custom framed magazine display in modern interior design",
  },
  {
    path: "magazine/lifestyle/lifestyle_15.jpg",
    alt: "Collectible magazine covers in professional shadowbox frames",
  },
  {
    path: "magazine/lifestyle/lifestyle_16.jpg",
    alt: "Fashion magazine cover art displayed in elegant frame setting",
  },
  {
    path: "magazine/lifestyle/lifestyle_17.jpg",
    alt: "Framed magazine covers creating statement wall in home",
  },
  {
    path: "magazine/lifestyle/lifestyle_18.jpg",
    alt: "Sports memorabilia magazine framed with team-coordinated matting",
  },
  {
    path: "magazine/lifestyle/lifestyle_19.jpg",
    alt: "Vintage magazine collection displayed in coordinated frames",
  },
  {
    path: "magazine/lifestyle/lifestyle_20.jpg",
    alt: "Custom magazine frame display in collector showcase room",
  },
  {
    path: "magazine/lifestyle/lifestyle_21.jpg",
    alt: "LIFE Magazine Moon Landing cover in custom shadowbox frame",
  },
  {
    path: "magazine/lifestyle/lifestyle_22.jpg",
    alt: "LIFE Magazine JFK memorial cover professionally framed",
  },
  {
    path: "magazine/lifestyle/lifestyle_23.jpg",
    alt: "LIFE Magazine astronaut cover displayed in premium frame",
  },
  {
    path: "magazine/lifestyle/lifestyle_24.jpg",
    alt: "LIFE Magazine Wizard of Oz cover in archival quality frame",
  },
  {
    path: "magazine/lifestyle/lifestyle_25.jpg",
    alt: "Sports Illustrated swimsuit issue framed in home display",
  },
  {
    path: "magazine/lifestyle/lifestyle_26.jpg",
    alt: "Sports Illustrated boxing legend cover in premium frame",
  },
  {
    path: "magazine/lifestyle/lifestyle_27.jpg",
    alt: "Mens Health magazine cover professionally framed display",
  },
  {
    path: "magazine/lifestyle/lifestyle_28.jpg",
    alt: "GamePro gaming magazine cover in custom shadowbox frame",
  },
  {
    path: "magazine/lifestyle/lifestyle_29.jpg",
    alt: "National Geographic gallery wall with coordinated frames",
  },
  {
    path: "magazine/lifestyle/lifestyle_30.jpg",
    alt: "Dog Fancy magazine collection displayed in matching frames",
  },
];

export const MAGAZINE_LIFESTYLE_IMAGES: Array<{ url: string; alt: string }> =
  MAGAZINE_LIFESTYLE_PATHS.map(({ path, alt }) => ({ url: getSharedAssetUrl(path), alt }));

export function getRandomMagazineLifestyleImage(): { url: string; alt: string } {
  const randomIndex = Math.floor(Math.random() * MAGAZINE_LIFESTYLE_IMAGES.length);
  return MAGAZINE_LIFESTYLE_IMAGES[randomIndex] ?? MAGAZINE_LIFESTYLE_IMAGES[0]!;
}

interface MagazineLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function MagazineLifestyleCarousel({ onImageClick }: MagazineLifestyleCarouselProps = {}) {
  return (
    <BaseLifestyleCarousel
      title="Magazine Frames in Real Homes"
      subtitle="See how collectors display their favorite magazine covers."
      images={MAGAZINE_LIFESTYLE_IMAGES}
      onImageClick={onImageClick}
      testIdPrefix="magazine-lifestyle"
      ariaLabel="Magazine frame lifestyle photo gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
