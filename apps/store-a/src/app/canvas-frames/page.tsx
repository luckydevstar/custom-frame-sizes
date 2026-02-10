import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import { Sparkles, Frame, Palette, Brush, Shield } from "lucide-react";
import { ScrollToDesignerButton } from "./scroll-button";

const CanvasFrameDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.CanvasFrameDesigner),
  { ssr: false }
);

const CanvasLifestyleCarousel = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.CanvasLifestyleCarousel),
  { ssr: false }
);

// Avoid static prerender: designer deps (e.g. recharts/framer-motion) reference `self` at module load
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Custom Canvas Float Frames | Any Size | CustomFrameSizes.com",
  description:
    "Design custom canvas float frames in any size. Your canvas floats inside the frame for a gallery look. Made from solid wood. Ships fast.",
  openGraph: {
    title: "Custom Canvas Float Frames | Any Size",
    description:
      "Design custom canvas float frames in any size. Your canvas floats inside the frame for a gallery look.",
    type: "website",
  },
};

export default function CanvasFramesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section - Hidden on mobile for preview-first UX */}
      <section className="hidden md:block container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Premium Canvas Framing
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            data-testid="text-hero-title"
          >
            Custom Canvas Float Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Design a custom float frame in any size for your stretched canvas. Enter your exact
            measurements, pick your frame style, and see real-time pricing. We build each frame by
            hand with archival materials and ship it ready to hang.
          </p>

          <ScrollToDesignerButton />
        </div>
      </section>

      {/* Designer Section */}
      <section id="design-tool" className="container mx-auto px-4 py-8 md:py-12">
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
            <CanvasFrameDesigner />
          </Suspense>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Why Choose Canvas Float Frames
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Frame className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Float Frame Design</h3>
                <p className="text-sm text-muted-foreground">
                  Your canvas sits inside the frame. It looks like it&apos;s floating. Shows off
                  your whole painting.
                </p>
              </div>
              <div className="text-center">
                <Palette className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Works with Any Canvas</h3>
                <p className="text-sm text-muted-foreground">
                  Oil paintings, acrylics, prints on canvas, and more. Sizes up to 32×40 inches.
                </p>
              </div>
              <div className="text-center">
                <Brush className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Show Your Brush Strokes</h3>
                <p className="text-sm text-muted-foreground">
                  No glass or mat covers your art. Your canvas breathes and looks natural.
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Solid Wood Frames</h3>
                <p className="text-sm text-muted-foreground">
                  Real wood gives your canvas strong support. Looks great and lasts for years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Gallery Section */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Canvas Frame Gallery
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              See how artists and collectors display their canvas artwork in professional float
              frames.
            </p>
            <CanvasLifestyleCarousel />
          </div>
        </div>
      </section>
    </div>
  );
}
