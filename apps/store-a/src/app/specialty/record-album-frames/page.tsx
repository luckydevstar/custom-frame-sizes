import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { RecordAlbumDesigner } from "@framecraft/ui";
import { ScrollToDesignerButton } from "./scroll-button";

export const metadata: Metadata = {
  title:
    "Custom Record Album Frames | Vinyl LP Display | Professional Framing | Custom Frame Sizes",
  description:
    "Premium custom record album frames featuring 3 professional layouts for vinyl LP display. Professional-grade protection with framer's grade acrylic, archival matting, solid pine construction, and archival nylon mounting system.",
  openGraph: {
    title: "Custom Record Album Frames | Vinyl LP Display",
    description:
      "Professional custom framing for vinyl records and album covers. 3 specialized layouts with solid pine frames, framer's grade acrylic, archival matting, and archival mounting system.",
    type: "website",
  },
};

export default function RecordAlbumFramesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium">Preserve Your Vinyl</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            Custom Record Album Frames
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto">
            Display and protect vinyl LPs with custom shadowbox frames. Three specialized layouts
            for album covers, vinyl discs, and gatefold albums.
          </p>
          <ScrollToDesignerButton />
        </div>
      </section>

      <section
        id="design-tool"
        className="pt-4 md:pt-6 pb-8 bg-background scroll-mt-20"
        data-testid="designer-section"
      >
        <div className="container mx-auto px-4">
          <Suspense
            fallback={
              <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading designer...</p>
              </div>
            }
          >
            <RecordAlbumDesigner layoutType="vinyl" />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
