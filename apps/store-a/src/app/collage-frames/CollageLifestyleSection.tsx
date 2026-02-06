"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button, Dialog, DialogContent, DialogTitle } from "@framecraft/ui";
import { CollageLifestyleCarousel } from "@framecraft/ui/components/specialty/CollageLifestyleCarousel";

export function CollageLifestyleSection() {
  // Single state so modal always shows the image that was clicked (no stale url)
  const [fullscreenImage, setFullscreenImage] = useState<{ url: string; alt: string } | null>(null);

  const handleImageClick = (url: string, alt: string) => {
    setFullscreenImage({ url, alt });
  };

  return (
    <>
      <section className="border-t">
        <CollageLifestyleCarousel onImageClick={handleImageClick} />
      </section>

      <Dialog
        open={fullscreenImage !== null}
        onOpenChange={(open) => !open && setFullscreenImage(null)}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <div className="p-4 flex items-center justify-between border-b">
            <DialogTitle>Lifestyle Photo</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullscreenImage(null)}
              data-testid="button-close-fullscreen"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6 flex items-center justify-center bg-muted/30 relative w-full min-h-[70vh]">
            {fullscreenImage && (
              <Image
                key={fullscreenImage.url}
                src={fullscreenImage.url}
                alt={fullscreenImage.alt}
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
