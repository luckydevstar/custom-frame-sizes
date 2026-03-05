import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { Sparkles, Shield, Box, Grid3x3, Star } from "lucide-react";
import { ComicBookFrameDesigner, TrustBox } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";
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

      {/* What&apos;s Included Section */}
      <div className="border-t bg-background">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">What&apos;s Included</h2>
              <p className="text-lg text-muted-foreground">
                Every frame is built with real materials. No cheap shortcuts.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1 relative aspect-[4/3] w-full rounded-lg overflow-hidden border shadow-sm">
                <Image
                  src="/comic/whats-included.jpg"
                  alt="Comic book frame components breakdown showing frame, mats, backing, hardware, and acrylic"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  data-testid="img-whats-included"
                />
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    Our Frames are Proudly Made to Order in the USA
                  </p>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-5">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Solid Wood Picture Frame</h3>
                  <p className="text-muted-foreground">
                    Real solid pine wood. Not pressed wood. Built to last.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Framer&apos;s Grade Acrylic</h3>
                  <p className="text-muted-foreground">
                    Real frame shop acrylic. Not cheap plastic. Protects against fading.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Archival Bevel Cut Matting</h3>
                  <p className="text-muted-foreground">
                    Professional-grade framing quality. Prevents yellowing over time.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Archival Nesting Foam</h3>
                  <p className="text-muted-foreground">
                    Secures your graded comic in place. No shifting or damage.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Archival Foam Board Backing</h3>
                  <p className="text-muted-foreground">
                    Prevents your art from yellowing. Archives your collection properly.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Wall Hanging Hardware</h3>
                  <p className="text-muted-foreground">
                    Bendable metal clips pre-installed in the back. Hangs vertical or horizontal.
                  </p>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm font-medium">
                    <span className="font-bold">Comic Book NOT INCLUDED</span> — Frames are custom
                    cut to fit multiple comic book types and eras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Box */}
      <div className="container mx-auto px-4 py-12">
        <TrustBox />
      </div>

      {/* Information Section */}
      <div className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Perfect for Any Comic Era</h2>
              <p className="text-muted-foreground mb-4">
                Our frames accommodate comics from every publishing era, from large Golden Age books
                to modern slimmer issues. We also support professionally graded slabs from CGC, PGX,
                and CBCS.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Golden Age (1938-1956): 7.0&quot; × 10.25&quot;</li>
                <li>• Silver/Bronze Age (1956-1985): 6.75&quot; × 10.25&quot;</li>
                <li>• Modern Age (1985-Present): 6.625&quot; × 10.25&quot;</li>
                <li>• Graded Slabs: 8.25&quot; × 13&quot; with 0.75&quot; depth</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Flexible Layout Options</h2>
              <p className="text-muted-foreground mb-4">
                Display a single prized issue or create stunning multi-comic arrangements. Choose
                from 10 different layouts including horizontal rows, vertical columns, and grid
                arrangements.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Single comic display</li>
                <li>• 2-6 comics in horizontal rows</li>
                <li>• 3-4 comics in vertical columns</li>
                <li>• 4 or 6 comics in grid layouts</li>
                <li>• Custom brass plaque engraving available</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Archival Protection</h2>
              <p className="text-muted-foreground">
                All frames feature shadowbox depth to safely house your comics without contact,
                archival matting to prevent yellowing, and framer&apos;s grade acrylic options to
                shield against fading. Your collection stays pristine for generations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Custom Brass Plaques</h2>
              <p className="text-muted-foreground">
                Add a professional laser-engraved brass plaque to commemorate special issues,
                milestone purchases, or collection highlights. Choose from multiple fonts and
                finishes to match your display style.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        productKeys={["magazine-frames", "ticket-frames", "signature-frames", "picture-frames"]}
        columns={4}
      />
    </div>
  );
}
