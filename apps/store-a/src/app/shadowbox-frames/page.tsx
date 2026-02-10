import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import { Sparkles, Box, Palette, Layers, Shield } from "lucide-react";
import { ScrollToDesignerButton } from "./scroll-button";

const ShadowboxDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.ShadowboxDesigner),
  { ssr: false }
);

// Avoid static prerender: designer deps reference `self` at module load
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Custom Shadowbox Frames | Memorabilia & 3D Display | CustomFrameSizes.com",
  description:
    "Design custom shadowbox frames for memorabilia, 3D items, and keepsakes. Adjustable depth, archival materials, and professional construction. Any size.",
  openGraph: {
    title: "Custom Shadowbox Frames | Memorabilia & 3D Display",
    description:
      "Custom shadowbox frames with adjustable depth for displaying 3D items, memorabilia, and keepsakes. Professional construction with archival materials.",
    type: "website",
  },
};

export default function ShadowboxFramesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="hidden md:block container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Memorabilia &amp; 3D Display
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            data-testid="text-hero-title"
          >
            Custom Shadowbox Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Design a custom shadowbox in any size for your memorabilia, medals, jerseys, and 3D
            keepsakes. Set your dimensions, choose frame style and depth, and see real-time pricing.
            Built with archival materials and ready to display.
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
            <ShadowboxDesigner />
          </Suspense>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Why Choose Shadowbox Frames
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Box className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Adjustable Depth</h3>
                <p className="text-sm text-muted-foreground">
                  Set interior depth to fit medals, jerseys, keepsakes, and 3D objects. No
                  one-size-fits-all.
                </p>
              </div>
              <div className="text-center">
                <Palette className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Style &amp; Finish</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from multiple frame styles and finishes to match your décor and your piece.
                </p>
              </div>
              <div className="text-center">
                <Layers className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Any Size</h3>
                <p className="text-sm text-muted-foreground">
                  Enter exact interior dimensions. We build to your specs for a perfect fit.
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Archival Materials</h3>
                <p className="text-sm text-muted-foreground">
                  Acid-free backing and quality construction to protect and display your
                  memorabilia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
