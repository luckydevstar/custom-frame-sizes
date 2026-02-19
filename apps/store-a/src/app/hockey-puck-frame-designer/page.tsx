import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import { Sparkles, Shield, Package, Layers, Target } from "lucide-react";
import { ScrollToDesignerButton } from "./scroll-button";

const PuckFrameDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.PuckFrameDesigner),
  { ssr: false }
);

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hockey Puck Display Frames – Complete Kit with Foam Insert | Custom Frame Sizes",
  description:
    "Display hockey pucks safely with our complete frame kit. Includes nesting foam insert for friction-fit mounting — no adhesives or hardware that can damage your pucks. Design your display now.",
  keywords:
    "hockey puck frames, puck display case, hockey memorabilia frame, signed puck frame, NHL puck display, shadowbox puck frame, foam insert puck holder, friction fit puck mount",
  openGraph: {
    title: "Hockey Puck Display Frames – Complete Kit with Foam Insert",
    description:
      "Display hockey pucks safely with our complete frame kit. Includes nesting foam insert for friction-fit mounting — no adhesives or hardware that can damage your pucks.",
    type: "website",
    url: "/hockey-puck-frame-designer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hockey Puck Display Frames – Complete Kit with Foam Insert",
    description:
      "Display hockey pucks safely with our complete frame kit. Includes nesting foam insert for friction-fit mounting.",
  },
  alternates: { canonical: "/hockey-puck-frame-designer" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Custom Hockey Puck Display Framing",
  provider: { "@type": "Organization", name: "Custom Frame Sizes" },
  areaServed: "US",
  description:
    "Professional shadowbox frames for hockey pucks with foam insert system for safe, damage-free display",
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Hockey Puck Display Frame Kit",
  description:
    "Complete puck display kit with deep shadowbox frame and nesting foam insert. Pucks friction-fit securely with no adhesives or mounting hardware.",
  brand: { "@type": "Brand", name: "Custom Frame Sizes" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "49",
    highPrice: "299",
    offerCount: "20",
  },
};

export default function HockeyPuckFrameDesignerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-medium" data-testid="text-badge">
                Complete Display Kit
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
              data-testid="text-hero-title"
            >
              Hockey Puck Display Frames
            </h1>
            <p
              className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
              data-testid="text-hero-subtitle"
            >
              Professional shadowbox frames with custom foam insert. Your pucks friction-fit
              securely — no adhesives or mounting hardware that can damage your collection.
            </p>
            <ScrollToDesignerButton />
          </div>
        </section>

        {/* Benefit Bar */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center" data-testid="benefit-foam-insert">
                <Package className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Foam Insert Included
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Friction-Fit Mounting
                </p>
              </div>
              <div className="text-center" data-testid="benefit-no-adhesive">
                <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">No Adhesives</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Protects Your Pucks
                </p>
              </div>
              <div className="text-center" data-testid="benefit-multi-layouts">
                <Layers className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  1–12 Puck Layouts
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  With Photo Options
                </p>
              </div>
              <div className="text-center" data-testid="benefit-precision">
                <Target className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Precision Cut</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Perfect Puck Fit
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Designer */}
        <section id="design-tool" className="py-4 md:py-6 scroll-mt-20">
          <div className="container mx-auto px-4">
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
                <PuckFrameDesigner embedded />
              </Suspense>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-12 md:py-16 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                What&apos;s Included
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Extra-Deep Frame</h3>
                  <p className="text-sm text-muted-foreground">
                    2&quot; usable depth in matte black, bright white, or walnut brown wood finish.
                  </p>
                </div>
                <div className="p-5 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Mat Board with Precision Openings</h3>
                  <p className="text-sm text-muted-foreground">
                    Archival mat with 3&quot; diameter circular cutouts for each puck. Choose any
                    mat color.
                  </p>
                </div>
                <div className="p-5 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                  <p className="text-sm text-muted-foreground">
                    Crystal-clear protection that helps prevent fading of autographs and logos.
                  </p>
                </div>
                <div className="p-5 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Hanging Hardware</h3>
                  <p className="text-sm text-muted-foreground">
                    Sawtooth hanger included. Security hardware available for public display.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hockey Puck Frame FAQ */}
        <section className="py-12 md:py-16 border-t bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Hockey Puck Frame FAQ
              </h2>
              <div className="space-y-4">
                <div className="p-5 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">What size are the puck openings?</h3>
                  <p className="text-sm text-muted-foreground">
                    Each opening is exactly 3&quot; in diameter, sized for standard hockey pucks
                    (3&quot; wide × 1&quot; thick).
                  </p>
                </div>
                <div className="p-5 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">How deep is the frame?</h3>
                  <p className="text-sm text-muted-foreground">
                    The frame has 2&quot; usable depth, providing ample room for pucks plus the mat
                    and acrylic.
                  </p>
                </div>
                <div className="p-5 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Will autographed pucks be protected?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes. Framer&apos;s grade acrylic helps prevent fading of signatures. Display
                    away from direct sunlight for best results.
                  </p>
                </div>
                <div className="p-5 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Can I add a brass nameplate?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes. Add custom text (player name, game date, team) on a polished brass
                    nameplate with your choice of font.
                  </p>
                </div>
                <div className="p-5 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">
                    What&apos;s the difference between single and double mat?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Single mat uses one color around the puck openings. Double mat adds a second
                    color visible as a thin reveal ring around each opening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
