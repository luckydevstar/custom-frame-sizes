import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles, Shield, Box, Grid3x3, Star } from "lucide-react";
import { ComicBookFrameDesigner, ComicLifestyleCarousel } from "@framecraft/ui";
import { ScrollToDesignerButton } from "./scroll-button";

export const metadata: Metadata = {
  title: "Custom Comic Book Frames | Display & Protect Your Collection | CustomFrameSizes.com",
  description:
    "Frame your comic book collection with custom shadowbox frames. Perfect for raw comics (Golden, Silver, Bronze, Modern Age) and graded slabs (CGC, PGX, CBCS). Choose single display or multi-comic layouts.",
  openGraph: {
    title: "Custom Comic Book Frames | Display & Protect Your Collection",
    description:
      "Frame your comic book collection with custom shadowbox frames. Perfect for raw comics and graded slabs. Professional UV protection and archival backing.",
    type: "website",
  },
};

export default function ComicBookFramesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section - Hidden on mobile for preview-first UX */}
      <section className="hidden md:block container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Protect Your Collection
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            data-testid="text-hero-title"
          >
            Custom Comic Book Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Display and protect your comics with shadowbox frames sized for any era. Raw comics from
            Golden Age to Modern or graded slabs from CGC, PGX, and CBCS. Choose single displays or
            multi-comic gallery layouts.
          </p>

          <ScrollToDesignerButton />
        </div>
      </section>

      {/* Benefit Bar - Hidden on mobile for preview-first UX */}
      <section className="hidden md:block border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="benefit-uv-protection">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">UV Protection</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Prevents fading
              </p>
            </div>

            <div className="text-center" data-testid="benefit-shadowbox-depth">
              <Box className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Shadowbox Depth</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Fits graded slabs
              </p>
            </div>

            <div className="text-center" data-testid="benefit-multi-layouts">
              <Grid3x3 className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Multi-Layouts</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                1-6 comic displays
              </p>
            </div>

            <div className="text-center" data-testid="benefit-era-sizing">
              <Star className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                Era-Specific Sizing
              </p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                All comic ages
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Designer Embed */}
      <section className="container mx-auto px-4 pb-8 md:pb-12">
        <div id="design-tool" className="scroll-mt-20" data-testid="designer-section">
          <Suspense
            fallback={
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading designer...</p>
                </div>
              </div>
            }
          >
            <ComicBookFrameDesigner />
          </Suspense>
        </div>
      </section>

      {/* Lifestyle Gallery Section */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Comic Book Frame Gallery
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              See how collectors display raw comics and graded slabs in professional shadowbox
              frames.
            </p>
            <ComicLifestyleCarousel />
          </div>
        </div>
      </section>
    </div>
  );
}
