"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface GalleryImage {
  url: string;
  alt: string;
  type?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageGallery({ images, initialIndex = 0, open, onOpenChange }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, open]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX ?? 0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? 0);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goToPrevious, goToNext, onOpenChange]);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-7xl w-[95vw] h-[95vh] p-0 overflow-hidden bg-black/95 border-none"
        data-testid="dialog-image-gallery"
      >
        <DialogDescription className="sr-only">
          Image gallery showing frame details including corner, profile, and lifestyle views
        </DialogDescription>
        <div
          className="relative w-full h-full flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 h-10 w-10"
            onClick={() => onOpenChange(false)}
            aria-label="Close gallery"
            data-testid="button-close-gallery"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </Button>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20 h-14 w-14"
                onClick={goToPrevious}
                aria-label="Previous image"
                data-testid="button-previous-image"
              >
                <ChevronLeft className="h-10 w-10" aria-hidden="true" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20 h-14 w-14"
                onClick={goToNext}
                aria-label="Next image"
                data-testid="button-next-image"
              >
                <ChevronRight className="h-10 w-10" aria-hidden="true" />
              </Button>
            </>
          )}

          <img
            src={currentImage?.url ?? ""}
            alt={currentImage?.alt ?? ""}
            className="max-w-full max-h-full object-contain"
            data-testid={`image-gallery-${currentIndex}`}
          />

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
                  }`}
                  data-testid={`button-dot-${index}`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/80 text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
