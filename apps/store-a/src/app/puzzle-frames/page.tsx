import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { PuzzleFrameDesigner, PuzzleLifestyleCarousel } from "@framecraft/ui";
import { brandConfig } from "../../brand.config";
import { ScrollToDesignerButton } from "./scroll-button";

export const metadata: Metadata = {
  title: "Jigsaw Puzzle Frames - Custom Sizes & Professional Preservation | Custom Frame Sizes",
  description:
    "Professional jigsaw puzzle frames for 100-2000 pieces. Custom sizes for standard, panoramic, square, and round puzzles. Shadowbox depth, puzzle glue sheets, circular mat cutouts.",
  openGraph: {
    title: "Jigsaw Puzzle Frames - Custom Sizes & Professional Preservation",
    description:
      "Shadowbox frames engineered for completed jigsaw puzzles. All sizes from 100 to 2000 pieces, including panoramic and round puzzles. Specialized backing and mat systems.",
    type: "product",
  },
};

export default function PuzzleFramesPage() {
  const pageUrl = `${brandConfig.seo?.canonicalUrl || ""}/puzzle-frames`;

  return (
    <>
      {/* Structured Data - Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: "Jigsaw Puzzle Frames - Custom Sizes",
            description:
              "Professional custom framing for completed jigsaw puzzles. Shadowbox frames for all puzzle sizes from 100 to 2000 pieces, including panoramic, square, and round puzzles. Specialized backing system, optional puzzle glue sheets, and custom mat cutouts for circular puzzles.",
            brand: {
              "@type": "Brand",
              name: brandConfig.name,
            },
            offers: {
              "@type": "AggregateOffer",
              url: pageUrl,
              priceCurrency: "USD",
              lowPrice: "45.00",
              highPrice: "250.00",
              priceValidUntil: "2025-12-31",
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
            },
          }),
        }}
      />

      {/* Structured Data - FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Can I frame any size jigsaw puzzle?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, we can frame any puzzle size from 100 to 2000 pieces. This includes standard, panoramic, square, and round puzzles. We have 14 preset sizes that match common puzzle dimensions.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need to glue my puzzle before framing?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, you need to glue your puzzle before framing. Without glue, pieces will shift and fall out over time. We offer puzzle glue sheets as an add-on option.",
                },
              },
            ],
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-medium" data-testid="text-badge">
                Preserve Your Puzzle Masterpieces
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
              data-testid="text-hero-title"
            >
              Picture Frames in Custom Sizes for Jigsaw Puzzles
            </h1>

            <p
              className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
              data-testid="text-hero-subtitle"
            >
              Professional shadowbox frames engineered for completed jigsaw puzzles from 100 to 2000
              pieces. Custom sizing for standard, panoramic, square, and round puzzles with
              specialized backing systems and precision mat cutouts.
            </p>

            <ScrollToDesignerButton />
          </div>
        </section>

        {/* Designer Section */}
        <section className="py-6 md:py-8" data-designer-anchor>
          <div className="container mx-auto px-4">
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
              <PuzzleFrameDesigner embedded={true} />
            </Suspense>
          </div>
        </section>

        {/* Lifestyle Gallery Section */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Puzzle Frame Gallery
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
                See how completed puzzles are preserved and displayed in professional shadowbox
                frames.
              </p>
              <PuzzleLifestyleCarousel />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
