import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import { Sparkles, Frame, Palette, Brush, Shield, Layers, Ruler } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ScrollToDesignerButton } from "./scroll-button";

const CanvasFrameDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.CanvasFrameDesigner),
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
      {/* Title section: Custom Canvas Float Frames (Hero) - hidden on mobile for preview-first UX per original */}
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

      {/* Benefit Bar - hidden on mobile per original */}
      <section className="hidden md:block border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="benefit-float-effect">
              <Layers className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Floating Effect</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Gallery look
              </p>
            </div>
            <div className="text-center" data-testid="benefit-custom-sizes">
              <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Custom Sizes</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Up to 32×40&quot;
              </p>
            </div>
            <div className="text-center" data-testid="benefit-no-glass">
              <Brush className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">No Glass Needed</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Show texture
              </p>
            </div>
            <div className="text-center" data-testid="benefit-solid-wood">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Solid Wood</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Real materials
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Designer section */}
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

      {/* Why Choose Canvas Float Frames? - exact heading from original */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t bg-muted/20"
        data-testid="section-features"
      >
        <div className="text-center mb-8 sm:mb-10">
          <h2
            className="font-serif font-semibold mb-3 sm:mb-4 text-3xl md:text-4xl"
            data-testid="text-features-title"
          >
            Why Choose Canvas Float Frames?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="hover-elevate" data-testid="card-feature-1">
            <CardHeader className="pb-3 sm:pb-4">
              <Frame
                className="h-6 w-6 text-primary mb-3"
                data-testid="icon-feature-1"
                aria-hidden
              />
              <CardTitle className="font-semibold text-lg" data-testid="text-feature-1-title">
                Float Frame Design
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p
                className="text-muted-foreground leading-relaxed text-sm"
                data-testid="text-feature-1-description"
              >
                Your canvas sits inside the frame. It looks like it&apos;s floating. Shows off your
                whole painting.
              </p>
            </CardContent>
          </Card>
          <Card className="hover-elevate" data-testid="card-feature-2">
            <CardHeader className="pb-3 sm:pb-4">
              <Palette
                className="h-6 w-6 text-primary mb-3"
                data-testid="icon-feature-2"
                aria-hidden
              />
              <CardTitle className="font-semibold text-lg" data-testid="text-feature-2-title">
                Works with Any Canvas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p
                className="text-muted-foreground leading-relaxed text-sm"
                data-testid="text-feature-2-description"
              >
                Oil paintings, acrylics, prints on canvas, and more. Sizes up to 32×40 inches.
              </p>
            </CardContent>
          </Card>
          <Card className="hover-elevate" data-testid="card-feature-3">
            <CardHeader className="pb-3 sm:pb-4">
              <Brush
                className="h-6 w-6 text-primary mb-3"
                data-testid="icon-feature-3"
                aria-hidden
              />
              <CardTitle className="font-semibold text-lg" data-testid="text-feature-3-title">
                Show Your Brush Strokes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p
                className="text-muted-foreground leading-relaxed text-sm"
                data-testid="text-feature-3-description"
              >
                No glass or mat covers your art. Your canvas breathes and looks natural.
              </p>
            </CardContent>
          </Card>
          <Card className="hover-elevate" data-testid="card-feature-4">
            <CardHeader className="pb-3 sm:pb-4">
              <Shield
                className="h-6 w-6 text-primary mb-3"
                data-testid="icon-feature-4"
                aria-hidden
              />
              <CardTitle className="font-semibold text-lg" data-testid="text-feature-4-title">
                Solid Wood Frames
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p
                className="text-muted-foreground leading-relaxed text-sm"
                data-testid="text-feature-4-description"
              >
                Real wood gives your canvas strong support. Looks great and lasts for years.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Design + What's Included */}
      <section className="py-12 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">How to Design Your Frame</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Pick your canvas depth (measure from front to back)</li>
                    <li>Enter the width and height of your canvas</li>
                    <li>Choose a frame color that matches your art</li>
                    <li>Select hanging hardware for your wall type</li>
                    <li>Add to cart and we build it for you</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">What&apos;s Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Custom-sized solid wood float frame</li>
                    <li>Professional assembly by hand</li>
                    <li>Archival build that protects your canvas</li>
                    <li>Hanging hardware included (your choice)</li>
                    <li>No glass needed—shows off your canvas texture</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Common Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="measure">
                    <AccordionTrigger className="hover:no-underline">
                      How do I measure my canvas?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Measure the outside edges of your stretched canvas. Include the wooden
                      stretcher bars. Enter those numbers in the width and height fields in the
                      designer.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="depth">
                    <AccordionTrigger className="hover:no-underline">
                      What if my canvas is thicker than 1⅝&quot;?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Our deepest frames fit canvases up to 1⅝&quot; thick. If yours is thicker,
                      contact us and we can help find a solution.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="glass">
                    <AccordionTrigger className="hover:no-underline">
                      Do I need glass on a canvas float frame?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      No. Canvas paintings don&apos;t need glass. The float frame shows off your
                      brush strokes and canvas texture. Framer&apos;s grade acrylic is optional if
                      you want extra protection.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What is a Float Frame */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  What is a Canvas Float Frame?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  A float frame is made for stretched canvas art. The frame sits behind your canvas.
                  Your art looks like it&apos;s floating in the frame. You can see the whole
                  painting, even the edges.
                </p>
                <p>
                  The frame has a deep channel where your canvas rests. A thin lip around the edge
                  adds style and keeps your canvas safe. No glass, mat, or backing is needed. Your
                  canvas can breathe, and your brush strokes stay visible.
                </p>
                <p>
                  Great for oil paintings, acrylics, mixed media, and canvas prints. The simple
                  design keeps the focus on your art while the frame adds a polished, professional
                  look.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional-Grade Materials */}
      <section className="py-12 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Professional-Grade Materials
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>Solid wood construction</strong> — Real wood, not plastic or composite.
                    Stained and finished by hand.
                  </li>
                  <li>
                    <strong>Archival build</strong> — Materials that protect your canvas for years.
                    No cheap fillers or shortcuts.
                  </li>
                  <li>
                    <strong>Precision-cut joints</strong> — Corners are cut at exact 45° angles for
                    a tight, seamless fit.
                  </li>
                  <li>
                    <strong>Hand inspection</strong> — Every frame is checked before shipping. We
                    catch flaws so you don&apos;t have to.
                  </li>
                  <li>
                    <strong>Optional framer&apos;s grade acrylic</strong> — If you want extra
                    protection, add clear acrylic glazing.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <RelatedProducts
        productKeys={["picture-frames", "jersey-frames", "certificate-frames", "diploma-frames"]}
        columns={4}
      />
    </div>
  );
}
