"use client";

/* eslint-disable react/no-unescaped-entities -- legacy copy from b-shadow-box-frames-original ComicBookFrames.tsx */

import { RelatedProducts } from "@/components/marketing/related-products";
import { Box, Grid3x3, Shield, Sparkles, Star } from "lucide-react";
import dynamic from "next/dynamic";

import { Button, TrustBox } from "@framecraft/ui";
import { useCallback } from "react";

const ComicBookFrameDesignerDynamic = dynamic(
  () => import("@framecraft/ui").then((m) => ({ default: m.ComicBookFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center bg-background border rounded-lg">
        <p className="text-muted-foreground">Loading designer…</p>
      </div>
    ),
  },
);

/** b-shadow-box-frames-original/client/src/pages/ComicBookFrames.tsx */
export function ComicBookFramesPageContent() {
  const scrollToDesigner = useCallback(() => {
    const designerElement = document.getElementById("design-tool");
    if (designerElement) {
      designerElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="hidden md:block container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Comic Book Display Frames
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4" data-testid="text-hero-title">
            Custom Comic Book Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Custom frames for Golden Age, Silver Age, and Modern comics. Framer&apos;s grade acrylic blocks UV light that
            fades covers and degrades paper.
          </p>

          <Button size="lg" onClick={scrollToDesigner} data-testid="button-design-frame" className="rounded-full">
            Design Your Frame
          </Button>
        </div>
      </section>

      <section className="hidden md:block border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="benefit-uv-protection">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">UV Protection</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">Prevents fading</p>
            </div>

            <div className="text-center" data-testid="benefit-shadowbox-depth">
              <Box className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Shadowbox Depth</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">Fits graded slabs</p>
            </div>

            <div className="text-center" data-testid="benefit-multi-layouts">
              <Grid3x3 className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Multi-Layouts</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">1-6 comic displays</p>
            </div>

            <div className="text-center" data-testid="benefit-era-sizing">
              <Star className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Era-Specific Sizing</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">All comic ages</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-8 md:pb-12">
        <div id="design-tool" className="scroll-mt-20" data-testid="designer-section">
          <ComicBookFrameDesignerDynamic />
        </div>
      </section>

      <div className="border-t bg-background">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">What&apos;s Included</h2>
              <p className="text-lg text-muted-foreground">Every frame is built with real materials. No cheap shortcuts.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                {/* eslint-disable-next-line @next/next/no-img-element -- /comic asset rewrite */}
                <img
                  src="/comic/whats-included-exploded.png"
                  alt="Exploded view of comic book frame layers: solid wood moulding, protective acrylic front, precision-cut beveled mat, nesting foam board, and foam core backing"
                  className="w-full rounded-lg border shadow-sm"
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
                  <p className="text-muted-foreground">Real solid pine wood. Not pressed wood. Built to last.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Framer&apos;s Grade Acrylic</h3>
                  <p className="text-muted-foreground">
                    Real frame shop acrylic. Not cheap plastic. Protects against fading.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Archival Bevel Cut Matting</h3>
                  <p className="text-muted-foreground">Professional-grade framing quality. Prevents yellowing over time.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Archival Nesting Foam</h3>
                  <p className="text-muted-foreground">Secures your graded comic in place. No shifting or damage.</p>
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
                    <span className="font-bold">Comic Book NOT INCLUDED</span>, Frames are custom cut to fit multiple comic
                    book types and eras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <TrustBox />
      </div>

      <div className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Flexible Layout Options</h2>
              <p className="text-muted-foreground mb-4">
                Display a single prized issue or create stunning multi-comic arrangements. Choose from 10 different
                layouts including horizontal rows, vertical columns, and grid arrangements.
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
              <p className="text-muted-foreground mb-4">
                All frames feature shadowbox depth to safely house your comics without contact, archival matting to prevent
                yellowing, and framer&apos;s grade acrylic options to shield against fading. Your collection stays pristine
                for generations.
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Custom Brass Plaques:</strong> Add a laser-engraved brass plaque to
                highlight special issues, milestone purchases, or collection details. Choose from multiple fonts and finishes.
              </p>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Sized for Every Comic Era</h2>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <p className="text-muted-foreground mb-4">
                    Each era has different dimensions. Pick the era that matches your comic and measure before ordering. Our
                    designer lets you select Golden Age, Silver Age, Bronze Age, or Modern Age sizing. Accepts standard bags
                    and boards.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Golden Age (1938-1956): 7.75&quot; × 10.5&quot;</li>
                    <li>• Silver Age (1956-1970): 7.125&quot; × 10.25&quot;</li>
                    <li>• Bronze Age (1970-1985): 7.125&quot; × 10.25&quot;</li>
                    <li>• Modern Age (1985-Present): 6.625&quot; × 10.1875&quot;</li>
                    <li>• Graded Slabs: Fits CGC, PGX, and CBCS cases</li>
                  </ul>
                </div>
                <div className="rounded-lg overflow-hidden border shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element -- /comic asset rewrite */}
                  <img
                    src="/comic/comic-era-sizes.png"
                    alt="Comic book era size comparison showing Golden Age, Silver Age, Bronze Age, and Modern Age dimensions with standard bags and boards compatibility"
                    className="w-full h-auto"
                    loading="lazy"
                    data-testid="img-comic-era-sizes"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts
        productKeys={["magazine-frames", "ticket-frames", "signature-frames", "picture-frames"]}
        columns={4}
      />
    </div>
  );
}
