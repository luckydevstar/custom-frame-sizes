"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button, Dialog, DialogContent, DialogTitle, FrameDetailCarousel } from "@framecraft/ui";
import type { GalleryImage } from "@framecraft/ui";

interface SignatureLifestyleSectionProps {
  images: GalleryImage[];
}

export function SignatureLifestyleSection({ images }: SignatureLifestyleSectionProps) {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const selectedImage = fullscreenIndex !== null ? (images[fullscreenIndex] ?? null) : null;

  return (
    <>
      <section className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Wedding Frames at Real Weddings</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-6">
              Real wedding photos showing couples using signature frames instead of guest books
            </p>
          </div>
          {images.length > 0 ? (
            <FrameDetailCarousel
              images={images}
              onImageClick={(index) => setFullscreenIndex(index)}
            />
          ) : null}
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
