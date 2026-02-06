import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { PuzzleFrameDesigner, PuzzleLifestyleCarousel } from "@framecraft/ui";
import { brandConfig } from "../../brand.config";
import { ScrollToDesignerButton } from "./scroll-button";
import { RelatedProducts } from "@/components/RelatedProducts";

export const metadata: Metadata = {
  title: "Jigsaw Puzzle Frames - Custom Sizes & Professional Preservation | Custom Frame Sizes",
  description:
    "Professional jigsaw puzzle frames for 100-2000 pieces. Custom sizes for standard, panoramic, square, and round puzzles. Shadowbox depth, puzzle glue sheets, circular mat cutouts.",
  openGraph: {
    title: "Jigsaw Puzzle Frames - Custom Sizes & Professional Preservation",
    description:
      "Shadowbox frames engineered for completed jigsaw puzzles. All sizes from 100 to 2000 pieces, including panoramic and round puzzles. Specialized backing and mat systems.",
    type: "website",
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

        {/* Puzzle Frames in Real Homes */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <PuzzleLifestyleCarousel />
            </div>
          </div>
        </section>

        {/* Professional Framing for Completed Jigsaw Puzzles */}
        <section className="border-t border-border py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-2xl md:text-3xl font-bold mb-6"
                data-testid="text-craftsmanship-title"
              >
                Professional Framing for Completed Jigsaw Puzzles
              </h2>

              <div className="prose prose-sm md:prose-base max-w-none space-y-4 text-muted-foreground">
                <p>
                  Regular picture frames don&apos;t work well for puzzles. A finished puzzle has
                  hundreds or thousands of loose pieces. Without the right backing, these pieces can
                  shift, warp, or fall apart. Humidity makes cardboard puzzle pieces swell and
                  shrink. Edge pieces react differently than center pieces. This causes stress that
                  can break connections between pieces. Professional puzzle framing solves these
                  problems. It uses special backing materials, permanent glue, and shadowbox frames
                  with the right depth.
                </p>

                <p>
                  Our puzzle frames use special glue sheets. You apply the sheet to the back of your
                  puzzle. It bonds all the pieces together into one solid surface. The glue sheet
                  stays flexible, so it won&apos;t crack if the puzzle expands a little. Glue sheets
                  work better than liquid puzzle glue. Liquid glue can leave gaps or cause warping
                  as it dries. Glue sheets cover evenly and dry flat. After gluing, we mount your
                  puzzle on archival backing board. This stiff board keeps everything flat and
                  stable.
                </p>

                <p>
                  Shadowbox frames give your puzzle room to breathe. Regular frames press artwork
                  against the glass. This causes problems for puzzles. Pieces can get dented. Ink
                  can stick to the glazing. Moisture can get trapped. Our shadowbox frames have
                  depth from 0.75 to 1.5 inches. This creates an air gap between your puzzle and the
                  framer&apos;s grade acrylic. The gap prevents contact damage. It also lets air
                  move so moisture doesn&apos;t build up. This is especially important in warm or
                  humid rooms.
                </p>

                <p>
                  Round puzzles need a special mat with a circular cutout. Regular rectangular
                  frames can&apos;t show a round shape without one. We cut the mat opening to match
                  your puzzle&apos;s exact diameter. The mat creates a border around the puzzle. It
                  supports the edges and hides where the round shape meets the square frame. Round
                  puzzles come in 500-piece (25-inch) and 1000-piece (27-inch) sizes. The mat keeps
                  your puzzle centered and stable inside the frame.
                </p>

                <p>
                  We frame all puzzle sizes from major brands. Standard puzzles range from 100
                  pieces (14.25×10.25 inches) to 2000 pieces (39×27 inches). We also frame panoramic
                  puzzles up to 39×13 inches, square puzzles up to 25×25 inches, and round puzzles
                  up to 27 inches across. Have an odd size? Our custom option handles vintage
                  puzzles and limited editions too. Each puzzle gets the right frame depth, mat
                  border, and backing for its size. Larger puzzles get stiffer backing to prevent
                  sagging. Professional-grade materials keep your puzzle looking great for decades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="border-t border-border bg-muted/30 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-2xl md:text-3xl font-bold mb-6"
                data-testid="text-specifications-title"
              >
                Technical Specifications
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    Standard Puzzle Sizes
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>100 pieces</span>
                      <span className="text-muted-foreground">14.25&quot; × 10.25&quot;</span>
                    </li>
                    <li className="flex justify-between">
                      <span>150 pieces</span>
                      <span className="text-muted-foreground">14.25&quot; × 10.25&quot;</span>
                    </li>
                    <li className="flex justify-between">
                      <span>200 pieces</span>
                      <span className="text-muted-foreground">19.25&quot; × 14.25&quot;</span>
                    </li>
                    <li className="flex justify-between">
                      <span>300 pieces</span>
                      <span className="text-muted-foreground">18&quot; × 24&quot;</span>
                    </li>
                    <li className="flex justify-between">
                      <span>500 pieces</span>
                      <span className="text-muted-foreground">19.25&quot; × 14.25&quot;</span>
                    </li>
                    <li className="flex justify-between">
                      <span>750 pieces</span>
                      <span className="text-muted-foreground">24&quot; × 18&quot;</span>
                    </li>
                    <li className="flex justify-between">
                      <span>1000 pieces</span>
                      <span className="text-muted-foreground">27&quot; × 20&quot;</span>
                    </li>
                    <li className="flex justify-between">
                      <span>1500 pieces</span>
                      <span className="text-muted-foreground">32&quot; × 24&quot;</span>
                    </li>
                    <li className="flex justify-between">
                      <span>2000 pieces</span>
                      <span className="text-muted-foreground">39&quot; × 27&quot;</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                      Specialty Formats
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>500 panoramic</span>
                        <span className="text-muted-foreground">26&quot; × 9&quot;</span>
                      </li>
                      <li className="flex justify-between">
                        <span>750 panoramic</span>
                        <span className="text-muted-foreground">37&quot; × 12&quot;</span>
                      </li>
                      <li className="flex justify-between">
                        <span>1000 panoramic</span>
                        <span className="text-muted-foreground">39&quot; × 13&quot;</span>
                      </li>
                      <li className="flex justify-between">
                        <span>500 square</span>
                        <span className="text-muted-foreground">21&quot; × 21&quot;</span>
                      </li>
                      <li className="flex justify-between">
                        <span>1000 square</span>
                        <span className="text-muted-foreground">25&quot; × 25&quot;</span>
                      </li>
                      <li className="flex justify-between">
                        <span>500 round</span>
                        <span className="text-muted-foreground">25&quot; diameter</span>
                      </li>
                      <li className="flex justify-between">
                        <span>1000 round</span>
                        <span className="text-muted-foreground">27&quot; diameter</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                      Custom Sizing
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Any dimensions within manufacturing range. Enter exact width and height for
                      non-standard puzzles, vintage editions, or limited releases.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    Frame Features
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        Shadowbox depth: 0.75&quot; to 1.5&quot; (prevents glazing contact)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Puzzle glue sheets available (archival-quality adhesive)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Archival backing board included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Standard or security hanging hardware</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Multiple shadowbox frame styles available</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    Mat &amp; Glass Options
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Single or double mat configurations (2&quot; border standard)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Circular mat cutouts required for round puzzles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Standard acrylic glazing (lightweight, shatter-resistant)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Framer&apos;s grade acrylic available (reduces fading from light)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Professional-grade preservation options</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <RelatedProducts
          productKeys={["picture-frames", "collage-frames", "comic-frames", "mat-boards"]}
          columns={4}
        />
      </div>
    </>
  );
}
