"use client";

import { useMemo } from "react";
import { Button } from "../../ui/button";
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";
import { useCarouselScroll } from "./useCarouselScroll";

export interface LifestyleImage {
  url: string;
  alt: string;
}

interface BaseLifestyleCarouselProps {
  /** Optional label above the title (e.g. "See Our Newspaper Frames in Action") */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  images: LifestyleImage[];
  onImageClick?: (imageUrl: string, imageAlt: string) => void;
  testIdPrefix: string;
  ariaLabel: string;
  randomize?: boolean;
  maxImages?: number;
}

/** Seeded shuffle so server and client render the same order (avoids wrong image in modal on click). */
function seededShuffle<T>(array: T[], seed: string): T[] {
  const shuffled = [...array];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  const next = () => {
    h = (Math.imul(1664525, h) + 1013904223) | 0;
    return (h >>> 0) / (0xffffffff + 1);
  };
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

export function BaseLifestyleCarousel({
  eyebrow,
  title,
  subtitle,
  images,
  onImageClick,
  testIdPrefix,
  ariaLabel,
  randomize = true,
  maxImages = 30,
}: BaseLifestyleCarouselProps) {
  const displayImages = useMemo(() => {
    const processed = randomize ? seededShuffle(images, testIdPrefix) : images;
    return processed.slice(0, maxImages);
  }, [images, randomize, maxImages, testIdPrefix]);

  const {
    scrollContainerRef,
    showPrevButton,
    showNextButton,
    scrollPrevious,
    scrollNext,
    handleScroll,
    handleImageLoad,
    handleKeyDown,
  } = useCarouselScroll(displayImages.length);

  if (displayImages.length === 0) return null;

  const isClickable = !!onImageClick;

  return (
    <section className="py-8 md:py-12" data-testid={`${testIdPrefix}-section`}>
      <div className="text-center mb-6">
        {eyebrow && (
          <p className="text-lg text-muted-foreground mb-2" data-testid={`${testIdPrefix}-eyebrow`}>
            {eyebrow}
          </p>
        )}
        <h2
          className="text-2xl md:text-3xl font-semibold mb-2"
          data-testid={`${testIdPrefix}-heading`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-muted-foreground max-w-2xl mx-auto"
            data-testid={`${testIdPrefix}-subtitle`}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="relative group px-4"
        onKeyDown={handleKeyDown}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {showPrevButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/90 hover:bg-background shadow-lg opacity-80 hover:opacity-100 transition-opacity"
            onClick={scrollPrevious}
            aria-label="View previous photos"
            data-testid={`button-${testIdPrefix}-carousel-previous`}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scroll-smooth scrollbar-hide"
          onScroll={handleScroll}
          data-testid={`${testIdPrefix}-carousel-container`}
          role="list"
          aria-label={`${ariaLabel} images`}
        >
          <div className="flex gap-5 px-2">
            {displayImages.map((image, index) => {
              const TileComponent = isClickable ? "button" : "div";

              return (
                <TileComponent
                  key={`${image.url}-${index}`}
                  onClick={isClickable ? () => onImageClick?.(image.url, image.alt) : undefined}
                  className={`group/card relative rounded-lg border bg-card flex-shrink-0 w-72 md:w-80 lg:w-[340px] overflow-hidden hover-elevate ${isClickable ? "active-elevate-2 cursor-pointer" : ""}`}
                  data-testid={`${testIdPrefix}-image-${index}`}
                  role="listitem"
                  aria-label={
                    isClickable
                      ? `Gallery image ${index + 1} of ${displayImages.length} - Click to enlarge`
                      : `Gallery image ${index + 1} of ${displayImages.length}: ${image.alt}`
                  }
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                      loading="lazy"
                      onLoad={handleImageLoad}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    {isClickable && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/30">
                        <div className="bg-background/90 p-3 rounded-full shadow-lg">
                          <Maximize className="h-6 w-6" />
                        </div>
                      </div>
                    )}
                  </div>
                </TileComponent>
              );
            })}
          </div>
        </div>

        {showNextButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/90 hover:bg-background shadow-lg opacity-80 hover:opacity-100 transition-opacity"
            onClick={scrollNext}
            aria-label="View next photos"
            data-testid={`button-${testIdPrefix}-carousel-next`}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </section>
  );
}
