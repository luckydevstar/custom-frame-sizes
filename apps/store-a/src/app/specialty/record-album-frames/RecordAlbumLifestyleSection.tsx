"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button, Dialog, DialogContent, DialogTitle, FrameDetailCarousel } from "@framecraft/ui";
import type { GalleryImage } from "@framecraft/ui";

interface RecordAlbumLifestyleSectionProps {
  images: GalleryImage[];
}

export function RecordAlbumLifestyleSection({ images }: RecordAlbumLifestyleSectionProps) {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const selectedImage = fullscreenIndex !== null ? (images[fullscreenIndex] ?? null) : null;

  return (
    <>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Vinyl Record Frames in Real Spaces
              </h2>
              <p className="text-lg text-muted-foreground">
                Professional custom framing elevates your vinyl collection from storage to stunning
                wall art
              </p>
            </div>
            <FrameDetailCarousel
              images={images}
              onImageClick={(index) => setFullscreenIndex(index)}
            />
          </div>
        </div>
      </section>

      <Dialog
        open={fullscreenIndex !== null}
        onOpenChange={(open) => !open && setFullscreenIndex(null)}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <div className="p-4 flex items-center justify-between border-b">
            <DialogTitle>Lifestyle Photo</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullscreenIndex(null)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="p-6 flex items-center justify-center bg-muted/30 relative w-full min-h-[70vh]">
            {selectedImage && (
              <Image
                key={selectedImage.url}
                src={selectedImage.url}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="95vw"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
