"use client";

import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";

const GRADED_CARD_LIFESTYLE_IMAGES: Array<{ url: string; alt: string }> = [
  {
    url: "/lifestyle/graded-card/lifestyle_1.jpg",
    alt: "PSA graded sports cards displayed in custom shadowbox frame",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_2.jpg",
    alt: "BGS graded basketball cards in shadowbox frame man cave",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_3.jpg",
    alt: "Graded Pokemon cards collection in professional frame display",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_4.jpg",
    alt: "PSA 10 gem mint cards in custom shadowbox home office",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_5.jpg",
    alt: "Graded baseball cards in shadowbox frame sports room",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_6.jpg",
    alt: "CGC graded comic cards in shadowbox frame collection",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_7.jpg",
    alt: "Graded football cards displayed in elegant shadowbox",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_8.jpg",
    alt: "PSA graded vintage cards in archival shadowbox frame",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_9.jpg",
    alt: "Graded trading cards collection shadowbox living room",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_10.jpg",
    alt: "BGS graded cards in multi-slot shadowbox display",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_11.jpg",
    alt: "Graded sports cards in shadowbox frame game room",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_12.jpg",
    alt: "PSA graded rookie cards in custom frame display",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_13.jpg",
    alt: "Graded TCG cards collection in shadowbox home",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_14.jpg",
    alt: "Vintage graded cards in archival shadowbox frame",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_15.jpg",
    alt: "Graded basketball cards shadowbox modern interior",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_16.jpg",
    alt: "PSA graded cards collection in wall mounted frame",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_17.jpg",
    alt: "Graded Pokemon cards in shadowbox kids room",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_18.jpg",
    alt: "BGS graded cards in professional shadowbox display",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_19.jpg",
    alt: "Graded sports memorabilia cards in shadowbox office",
  },
  {
    url: "/lifestyle/graded-card/lifestyle_20.jpg",
    alt: "PSA graded vintage cards in classic frame setting",
  },
];

interface GradedCardLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

export function GradedCardLifestyleCarousel({
  onImageClick,
}: GradedCardLifestyleCarouselProps = {}) {
  return (
    <BaseLifestyleCarousel
      title="Graded Card Frames in Real Homes"
      subtitle="See how collectors display their PSA, BGS, and CGC graded cards."
      images={GRADED_CARD_LIFESTYLE_IMAGES}
      onImageClick={onImageClick}
      testIdPrefix="graded-card-lifestyle"
      ariaLabel="Graded card frame lifestyle photo gallery"
      randomize={true}
      maxImages={30}
    />
  );
}
