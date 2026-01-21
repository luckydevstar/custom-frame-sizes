import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "./ImageGallery";

interface FrameDetailCarouselProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

export function FrameDetailCarousel({ images, onImageClick }: FrameDetailCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    // Defensive guard: if no scrolling is possible, hide both buttons
    const EPSILON = 5;
    if (scrollWidth <= clientWidth + EPSILON) {
      setShowPrevButton(false);
      setShowNextButton(false);
      return;
    }

    setShowPrevButton(scrollLeft > 10);
    setShowNextButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const getScrollStep = () => {
    const container = scrollContainerRef.current;
    if (!container) return 344; // fallback

    const firstChild = container.querySelector(".flex > div") as HTMLElement;
    if (!firstChild) return 344; // fallback

    // Get the actual width of the first child plus gap
    const childWidth = firstChild.offsetWidth;
    const flexContainer = container.querySelector(".flex") as HTMLElement;
    const computedStyle = window.getComputedStyle(flexContainer);
    const gap = parseFloat(computedStyle.gap) || 24;

    return childWidth + gap;
  };

  const scrollPrevious = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Early return if no scrolling is possible
    const { scrollWidth, clientWidth } = container;
    if (scrollWidth <= clientWidth + 5) return;

    const scrollStep = getScrollStep();
    container.scrollBy({ left: -scrollStep, behavior: "smooth" });
  };

  const scrollNext = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Early return if no scrolling is possible
    const { scrollWidth, clientWidth } = container;
    if (scrollWidth <= clientWidth + 5) return;

    const scrollStep = getScrollStep();
    container.scrollBy({ left: scrollStep, behavior: "smooth" });
  };

  // Use useLayoutEffect for immediate measurement after layout
  useLayoutEffect(() => {
    handleScroll();
  }, [images.length]);

  // Set up ResizeObserver to handle container size changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  // Handle image load events
  const handleImageLoad = () => {
    handleScroll();
  };

  if (images.length === 0) return null;

  return (
    <div className="relative group">
      {/* Previous Button */}
      {showPrevButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/90 hover:bg-background shadow-lg opacity-80 hover:opacity-100 transition-opacity"
          onClick={scrollPrevious}
          aria-label="Previous image"
          data-testid="button-carousel-previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scroll-smooth scrollbar-hide"
        onScroll={handleScroll}
        data-testid="carousel-container"
      >
        <div className="flex gap-6 px-2">
          {images.map((image, index) => (
            <div
              key={image.url}
              className="group/card relative rounded-lg border bg-card cursor-pointer transition-all flex-shrink-0 w-80 hover-elevate active-elevate-2"
              onClick={() => onImageClick(index)}
              data-testid={`image-preview-${index}`}
            >
              <div className="aspect-[4/3]">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105 rounded-lg"
                  onLoad={handleImageLoad}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors flex items-center justify-center rounded-lg">
                <span className="text-white opacity-0 group-hover/card:opacity-100 transition-opacity text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                  Click to enlarge
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Button */}
      {showNextButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/90 hover:bg-background shadow-lg opacity-80 hover:opacity-100 transition-opacity"
          onClick={scrollNext}
          aria-label="Next image"
          data-testid="button-carousel-next"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
