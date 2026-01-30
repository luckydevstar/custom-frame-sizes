import type { Metadata } from "next";
import { Suspense } from "react";
import { Shirt, Shield, Ruler, Layers, Award } from "lucide-react";
import { JerseyFrameDesigner, JerseyLifestyleCarousel } from "@framecraft/ui";
import { brandConfig } from "../../brand.config";
import { ScrollToDesignerButton } from "./scroll-button";

export const metadata: Metadata = {
  title: "Custom Jersey Display Frames | Professional Sports Memorabilia Shadowbox Framing",
  description:
    "Professional jersey display frames with 2-inch depth, team-specific triple mat colors, optional brass plaque engraving, and framer's grade acrylic. Designed for NHL, NBA, MLB, NFL jerseys and concert memorabilia.",
  openGraph: {
    title: "Custom Jersey Display Frames | Professional Sports Memorabilia Shadowbox Framing",
    description:
      "Expert jersey framing with team colors, conservation mounting, and 2-inch depth shadowboxes. Triple mat options for NHL, NBA, MLB, NFL jerseys with brass plaque engraving.",
    type: "website",
  },
};

export default function JerseyFramesPage() {
  return (
    <>
      {/* Structured Data - Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Custom Jersey Display Frames",
            description:
              "Professional shadowbox frames for sports jerseys with team-specific triple mat colors, optional brass plaque engraving, 2-inch usable depth, and framer's grade acrylic. Expert conservation mounting for NHL, NBA, MLB, NFL, and concert jerseys.",
            category: "Sports Memorabilia Framing",
            sku: "JERSEY-FRAME-CUSTOM",
            brand: {
              "@type": "Brand",
              name: brandConfig.name,
            },
            offers: {
              "@type": "AggregateOffer",
              availability: "https://schema.org/InStock",
              priceCurrency: "USD",
              lowPrice: "149",
              highPrice: "399",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "487",
              bestRating: "5",
              worstRating: "1",
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
                name: "What depth shadowbox do I need for jersey framing?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Jersey frames require a minimum 2-inch usable depth shadowbox to accommodate the fabric thickness and conservation mounting techniques. Our extra-deep shadowbox frames provide exactly 2 inches of depth, which is the professional standard for jersey display framing.",
                },
              },
              {
                "@type": "Question",
                name: "Can I customize mat colors to match my team?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Our Jersey Frame Designer features 165+ professional sports teams with color options inspired by team colors. You independently select three mat colors: Top Mat (visible border), Bottom Mat (middle layer), and Backing Color (background).",
                },
              },
            ],
          }),
        }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
              <Shirt className="w-3 h-3" />
              <span className="text-xs font-medium" data-testid="text-badge">
                Jersey Display Frames
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
              data-testid="text-hero-title"
            >
              DIY Jersey Frames
            </h1>

            <p
              className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
              data-testid="text-hero-subtitle"
            >
              Frame your jersey in team colors. Pick your layout, mat layers, and add custom
              engraving. Our 2-inch deep shadowboxes fit any jersey with room to spare.
            </p>

            <ScrollToDesignerButton />
          </div>
        </section>

        {/* Benefit Bar */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center" data-testid="benefit-uv-glazing">
                <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Framer&apos;s Grade Acrylic
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Used by Pro Framers
                </p>
              </div>

              <div className="text-center" data-testid="benefit-custom-sizing">
                <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  2&quot; Deep Shadowbox
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  For jersey thickness
                </p>
              </div>

              <div className="text-center" data-testid="benefit-mat-options">
                <Layers className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Frame Shop Quality
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  To protect your items
                </p>
              </div>

              <div className="text-center" data-testid="benefit-handcrafted">
                <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Handcrafted to Order
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Made in our frame shop
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Designer Section */}
        <section id="jersey-designer" className="container mx-auto px-4 pb-8 md:pb-12">
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
              <JerseyFrameDesigner embedded />
            </Suspense>
          </div>
        </section>

        {/* Lifestyle Gallery Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Jersey Frame Gallery
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
                See how collectors display NHL, NBA, MLB, and NFL jerseys. Our extra-deep
                shadowboxes hold any jersey with custom team colors and optional brass plaques.
              </p>
              <JerseyLifestyleCarousel />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
