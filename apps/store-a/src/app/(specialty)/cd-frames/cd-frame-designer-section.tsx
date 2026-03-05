"use client";

import { Suspense } from "react";
import { Disc3 } from "lucide-react";
import { RecordAlbumDesigner } from "@framecraft/ui";

export function CdFrameDesignerSection() {
  return (
    <section
      id="design-tool"
      className="pt-4 md:pt-6 pb-8 bg-background scroll-mt-20"
      data-testid="designer-section"
    >
      <div className="container mx-auto px-4">
        <Suspense
          fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Disc3 className="w-12 h-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
                <p className="text-muted-foreground">Loading designer...</p>
              </div>
            </div>
          }
        >
          <RecordAlbumDesigner layoutType="cd" />
        </Suspense>
      </div>
    </section>
  );
}
