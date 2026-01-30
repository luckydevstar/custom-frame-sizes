"use client";

import dynamic from "next/dynamic";
import {
  Shield,
  Sparkles,
  Ruler,
  CheckCircle2,
  Layers,
  Award,
  LayoutGrid,
  Tag,
} from "lucide-react";
import { Button } from "@framecraft/ui";
import { Card, CardContent } from "@framecraft/ui";
import { GradedCardLifestyleCarousel } from "@framecraft/ui";

const CardFrameDesigner = dynamic(
  () =>
    import("@framecraft/ui").then((mod) => {
      const C = mod.CardFrameDesigner;
      if (!C) throw new Error("CardFrameDesigner not exported from @framecraft/ui");
      return { default: C };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Loading designer…</p>
      </div>
    ),
  }
);

export function CardFramesContent() {
  const scrollToDesigner = () => {
    const el = document.getElementById("design-tool");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-24 lg:pb-8">
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Shield className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Protect Your Graded Card Collection
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            data-testid="text-hero-title"
          >
            Graded Card Frames for Sports & TCG
          </h1>
          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Professional shadowbox frames for PSA, SGC, CGC, and BGS graded cards. Custom layouts
            from single cards to 8-card displays with double mat systems, brass plaques, and
            archival protection.
          </p>
          <Button
            size="lg"
            onClick={scrollToDesigner}
            className="gap-2 rounded-full"
            data-testid="button-scroll-to-designer"
          >
            Design Your Frame
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="feature-custom-size">
              <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Custom Sizes</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Built to fit your slabs
              </p>
            </div>
            <div className="text-center" data-testid="feature-handcrafted">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Handcrafted</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Skilled artisans
              </p>
            </div>
            <div className="text-center" data-testid="feature-professional-grade">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                Professional-Grade
              </p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Archival materials
              </p>
            </div>
            <div className="text-center" data-testid="feature-instant-pricing">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Instant Pricing</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                See cost as you customize
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="design-tool"
        className="scroll-mt-20 container mx-auto px-4 py-12 md:py-16"
        data-testid="designer-section"
      >
        <CardFrameDesigner embedded />
      </section>

      {/* Card Display Inspiration - lifestyle carousel (matches original page order) */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Card Display Inspiration</h2>
          <p className="text-muted-foreground">
            Browse real customer frames showcasing graded cards and graded slabs
          </p>
        </div>
        <GradedCardLifestyleCarousel />
      </section>

      {/* Why Collectors Choose - single instance, correct position after designer + carousel */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Why Collectors Choose Our Graded Card Frames
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional shadowbox frames made for PSA, BGS, CGC, and SGC graded cards
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                    <p className="text-sm text-muted-foreground">
                      Professional glazing protects your slabs from dust and damage. Safer and
                      lighter than glass.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Ruler className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fits All Grading Companies</h3>
                    <p className="text-sm text-muted-foreground">
                      Built-in layouts for PSA, BGS, CGC, and SGC slabs. We size each opening to fit
                      your cards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Layers className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Archival Materials</h3>
                    <p className="text-sm text-muted-foreground">
                      Mat board and backing are archival quality. Your cards stay safe for years.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Frame Shop Quality</h3>
                    <p className="text-sm text-muted-foreground">
                      Each frame is handcrafted in our shop. Real wood frames with solid
                      construction.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <LayoutGrid className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Multi-Card Layouts</h3>
                    <p className="text-sm text-muted-foreground">
                      Display 1 to 12 graded cards in one frame. Great for sets, rookies, and team
                      collections.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Tag className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Optional Nameplate</h3>
                    <p className="text-sm text-muted-foreground">
                      Add a brass nameplate with your player&apos;s name, card year, or collection
                      title.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Graded Card Frames Work - long-form (matches original) */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How Graded Card Frames Work</h2>
          <div className="space-y-8 text-muted-foreground">
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">
                Built for Graded Slabs
              </h3>
              <p className="mb-3">
                Our frames use shadowbox construction. This means the frame is deep enough to hold
                your graded cards without pressing them against the acrylic. Each slab sits in its
                own precision-cut opening.
              </p>
              <p>
                We support all major grading companies: PSA, BGS, CGC, and SGC. Pick your grading
                company and we size the openings to match. The slabs drop right in.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">
                Layout Options for Every Collection
              </h3>
              <p className="mb-3">
                Frame a single prized card or build a display of 12 cards. Our layouts work for
                rookie cards, team sets, and mixed collections. Popular choices include 3-card and
                6-card layouts for sets.
              </p>
              <p>
                Each layout shows you the final frame size so you know how it will fit on your wall.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Mat Colors and Styles</h3>
              <p className="mb-3">
                Pick from single or double matting. Double mats add a thin color border around each
                card for extra depth. We offer black, white, and team-friendly colors.
              </p>
              <p>
                Black mats are most popular. They make card colors pop and give a clean, modern
                look.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">
                Brass Nameplate Personalization
              </h3>
              <p className="mb-3">
                Add a custom brass nameplate below your cards. Include the player&apos;s name, card
                year, or collection title. Great for gifts or awards.
              </p>
              <p>
                The nameplate uses engraved text on brushed brass. It adds a professional touch to
                any display.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Ready to Hang</h3>
              <p>
                Every frame ships with hanging hardware installed. Just unpack and hang. Your cards
                slide into the openings from the back. No tools needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Graded Card Frame Questions - full FAQ (7 items, matches original; no Related Products) */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Graded Card Frame Questions
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                What grading companies do your frames fit?
              </h3>
              <p>
                Our frames fit PSA, BGS (Beckett), CGC, and SGC slabs. Pick your grading company in
                the designer and we size each opening to fit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                How many cards can I put in one frame?
              </h3>
              <p>
                You can frame 1 to 12 graded cards. We offer layouts for single cards, pairs, rows
                of 3, grids of 4 or 6, and larger displays up to 12 cards.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Do the cards touch the acrylic?
              </h3>
              <p>
                No. Our shadowbox frames have depth. The mat board holds your slabs away from the
                acrylic. This protects the cards and gives the display dimension.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Can I mix different grading companies in one frame?
              </h3>
              <p>
                Each frame is sized for one grading company since slab sizes differ. For mixed
                collections, we recommend separate frames for each grading company.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                How do I install my cards?
              </h3>
              <p>
                Open the back of the frame and slide your slabs into each opening. The openings are
                cut slightly larger than your slabs so they drop in easily. No tools or tape needed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                What frame materials do you use?
              </h3>
              <p>
                Frames are solid wood. Mat boards and backing are archival quality. Glazing is
                framer&apos;s grade acrylic — lighter and safer than glass.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Can I add a nameplate?</h3>
              <p>
                Yes. Our brass nameplate option lets you add up to three lines of text. Include the
                player&apos;s name, card year, or any custom message.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
