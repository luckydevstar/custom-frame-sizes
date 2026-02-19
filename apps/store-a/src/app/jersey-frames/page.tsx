import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Shirt, Shield, Ruler, Layers, Award, CheckCircle2, ArrowDown } from "lucide-react";
import { JerseyFrameDesigner, JerseyLifestyleCarousel, Card, Button } from "@framecraft/ui";
import { getJerseyLifestyleImages } from "@framecraft/core";
import { brandConfig } from "../../brand.config";
import { ScrollToDesignerButton } from "./scroll-button";
import { RelatedProducts } from "@/components/RelatedProducts";

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

        {/* Full-Width Lifestyle Feature */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div
                className="relative rounded-lg border bg-card overflow-hidden"
                data-testid="jersey-lifestyle-feature-1"
              >
                <div className="aspect-[3/2] md:aspect-[3/2] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getJerseyLifestyleImages()[3]?.url ?? ""}
                    alt="Autographed Dallas Cowboys jersey frame in extra deep white shadowbox with 2 inch capacity, displaying signed #8 AIKMAN NFL jersey with navy and silver triple matting in elegant living room"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-white text-lg md:text-xl font-semibold max-w-3xl">
                      Custom team color mats make your signed jerseys and championship gear look
                      amazing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Build Your Jersey Frame */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How We Build Your Jersey Frame
              </h2>
              <p className="text-muted-foreground mb-6">
                We use archival materials and professional-grade construction to frame jerseys.
                Design your own shadowbox frame with team colors for NHL, NBA, MLB, NFL, or concert
                jerseys.
              </p>
              <h3 className="text-2xl font-semibold mb-4 mt-8">Extra-Deep Shadowbox Frames</h3>
              <p className="text-muted-foreground mb-6">
                Jerseys need deep frames. Ours have 2 inches of depth—the standard for jersey
                displays. This keeps your jersey flat without squishing it. We offer three real wood
                finishes: Matte Black, Bright White, and Rich Walnut.
              </p>
              <h3 className="text-2xl font-semibold mb-4 mt-8">Team Color Mats</h3>
              <div
                className="grid md:grid-cols-2 gap-6 mb-6 not-prose"
                data-testid="jersey-lifestyle-feature-2"
              >
                <div className="rounded-lg border bg-card overflow-hidden">
                  <div className="aspect-[4/5] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getJerseyLifestyleImages()[10]?.url ?? ""}
                      alt="Deep matte black jersey display frame with navy blue and red team color triple matting showcasing autographed baseball jersey"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-xl font-semibold mb-4">Triple Mat Benefits</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Pick your top mat, bottom mat, and backing color</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>165+ team colors plus black and white options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Archival mats keep colors bright for years</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Pick from 165+ team colors for NHL, NBA, MLB, and NFL teams. You choose three mat
                colors: the top border, middle layer, and background. All mats are archival so they
                won&apos;t yellow over time.
              </p>
              <h3 className="text-2xl font-semibold mb-4 mt-8">Protection From Fading</h3>
              <p className="text-muted-foreground mb-6">
                Sunlight fades jersey colors over time. Our frames use framer&apos;s grade acrylic
                that blocks 99% of UV rays. The 2-inch depth also keeps the fabric away from the
                acrylic surface.
              </p>
              <h3 className="text-2xl font-semibold mb-4 mt-8">Add a Brass Plaque</h3>
              <p className="text-muted-foreground mb-6">
                Add a brass plaque with custom text. Great for player names, jersey numbers, game
                dates, or special messages. Plaques are mounted on the mat so they don&apos;t cover
                your jersey.
              </p>
              <h3 className="text-2xl font-semibold mb-4 mt-8">Standard and Oversize Frames</h3>
              <p className="text-muted-foreground mb-6">
                Standard frames fit most jerseys up to 32×40 inches. Larger jerseys or wider mat
                borders need oversize frames. Our designer shows you the price for your exact size.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    What depth shadowbox do I need for jersey framing?
                  </h3>
                  <p className="text-muted-foreground">
                    Our frames have 2 inches of depth. This is the standard for jersey displays and
                    keeps your jersey flat without squishing it.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Can I customize mat colors to match my team?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! Pick from 165+ team colors. You choose three layers: top mat, bottom mat,
                    and backing color. All mats are archival to protect your jersey.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    What frame finishes are available for jersey displays?
                  </h3>
                  <p className="text-muted-foreground">
                    We offer three real wood finishes: Matte Black, Bright White, and Rich Walnut.
                    All have 2-inch depth, professional-grade construction, and framer&apos;s grade
                    acrylic.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    How do I add a brass plaque to my jersey frame?
                  </h3>
                  <p className="text-muted-foreground">
                    Add a plaque in our designer. Type your custom text and we mount it on the mat.
                    It won&apos;t cover your jersey.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    What&apos;s the difference between standard and oversize jersey frames?
                  </h3>
                  <p className="text-muted-foreground">
                    Standard frames fit most jerseys up to 32×40 inches. Larger jerseys need
                    oversize frames. Our designer shows pricing for both.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Are these frames suitable for both sports and concert jerseys?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! Frame any jersey—sports, concert, school, or personal. Use team colors or
                    pick black and white mats for custom designs.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Design Your Jersey Frame?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Pick your team colors and size. Get instant pricing.
              </p>
              <Button size="lg" className="text-lg" asChild data-testid="button-design-cta-final">
                <Link href="#jersey-designer">
                  <ArrowDown className="w-5 h-5 mr-2" />
                  Start Designing Now
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <RelatedProducts
          productKeys={["signature-frames", "ticket-frames", "comic-frames", "picture-frames"]}
          columns={4}
        />
      </div>
    </>
  );
}
