"use client";

import { useMemo } from "react";
import { getTicketStubLifestyleImages } from "@framecraft/core";
import { BaseLifestyleCarousel } from "./shared/BaseLifestyleCarousel";

export interface TicketStubLifestyleCarouselProps {
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
}

function buildImages(): Array<{ url: string; alt: string }> {
  return getTicketStubLifestyleImages();
}

const TICKET_LIFESTYLE_IMAGES = buildImages();

export function TicketStubLifestyleCarousel({ onImageClick }: TicketStubLifestyleCarouselProps) {
  const images = useMemo(() => TICKET_LIFESTYLE_IMAGES, []);

  return (
    <BaseLifestyleCarousel
      title="Ticket Frame Ideas"
      subtitle="Get inspired by these custom ticket frame displays. Frame your concert memories, sports events, and shows."
      images={images}
      onImageClick={onImageClick}
      testIdPrefix="ticket-lifestyle"
      ariaLabel="Ticket stub frame lifestyle photos"
      randomize={true}
      maxImages={30}
    />
  );
}
