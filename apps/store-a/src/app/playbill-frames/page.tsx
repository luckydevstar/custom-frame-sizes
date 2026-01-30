import type { Metadata } from "next";
import { Suspense } from "react";
import { Ticket } from "lucide-react";
import { PlaybillFrameDesigner, PlaybillLifestyleCarousel } from "@framecraft/ui";
import { ScrollToDesignerButton } from "./scroll-button";

export const metadata: Metadata = {
  title: "Custom Playbill Frames | Broadway Program Display Frames",
  description:
    'Display Broadway programs and theater playbills in perfectly-sized frames. Standard 5.5x8.5" sizing with acid-free mats and professional-grade construction.',
  openGraph: {
    title: "Custom Playbill Frames | Broadway Program Display Frames",
    description:
      "Perfect frames for Broadway playbills and theater programs. Standard sizing with archival materials and professional construction.",
    type: "website",
  },
};

export default function PlaybillFramesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Ticket className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Broadway Memories
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            data-testid="text-hero-title"
          >
            Custom Playbill Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Display Broadway programs and theater playbills in perfectly-sized frames. Standard
            5.5x8.5&quot; sizing with acid-free mats and professional-grade construction.
          </p>

          <ScrollToDesignerButton />
        </div>
      </section>

      {/* Designer Section */}
      <section id="playbill-designer" className="container mx-auto px-4 py-8 md:py-12">
        <div className="scroll-mt-20" data-testid="designer-section">
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
            <PlaybillFrameDesigner />
          </Suspense>
        </div>
      </section>

      {/* Lifestyle Gallery Section */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Playbill Frame Gallery
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              See how theater enthusiasts display their Broadway memories in professional frames.
            </p>
            <PlaybillLifestyleCarousel />
          </div>
        </div>
      </section>
    </div>
  );
}
