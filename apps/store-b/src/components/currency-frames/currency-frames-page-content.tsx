"use client";

/* eslint-disable react/no-unescaped-entities -- legacy copy from b-shadow-box-frames-original CurrencyFrames.tsx */

import { RelatedProducts } from "@/components/marketing/related-products";
import { Button } from "@framecraft/ui";
import { ArrowDown, Award, Layers, Ruler, Shield, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback } from "react";

const CurrencyFrameDesignerDynamic = dynamic(
  () => import("@framecraft/ui").then((m) => ({ default: m.CurrencyFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center bg-background border rounded-lg mx-4">
        <p className="text-muted-foreground">Loading designer…</p>
      </div>
    ),
  },
);

/** b-shadow-box-frames-original/client/src/pages/CurrencyFrames.tsx */
export function CurrencyFramesPageContent() {
  const scrollToDesigner = useCallback(() => {
    const designerSection = document.getElementById("currency-designer");
    if (designerSection) {
      designerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Frame Your Currency Collection
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4" data-testid="text-hero-title">
            Currency Shadowbox Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Display paper money in custom shadowbox frames with acid-free double matting and framer's grade acrylic. Built to
            protect bills and banknotes for decades.
          </p>

          <Button size="lg" onClick={scrollToDesigner} data-testid="button-start-designing">
            Design Your Frame
            <ArrowDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="benefit-uv-glazing">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Framer's Grade Acrylic</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Used by Pro Framers
              </p>
            </div>

            <div className="text-center" data-testid="benefit-custom-sizing">
              <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Custom Sizing</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Any format or dimension
              </p>
            </div>

            <div className="text-center" data-testid="benefit-mat-options">
              <Layers className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Frame Shop Quality</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                To protect your items
              </p>
            </div>

            <div className="text-center" data-testid="benefit-handcrafted">
              <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Handcrafted to Order</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Made in our frame shop
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="currency-designer" className="scroll-mt-4">
        <CurrencyFrameDesignerDynamic embedded />
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">How Our Currency Frames Are Built</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Shadowbox Construction</h3>
                <p className="text-muted-foreground">
                  The frame has interior depth that keeps your bills separated from the acrylic front. Paper money sits
                  inside the frame without being pressed flat, which prevents creasing and contact damage.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Double Mat Standard</h3>
                <p className="text-muted-foreground">
                  White over black is the most popular combination for currency displays. The white border defines the viewing
                  area and the black accent mat adds visual depth. Both layers are acid-free to prevent yellowing and paper
                  degradation.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Backing Options</h3>
                <p className="text-muted-foreground">
                  Pick from four background colors: black (highest contrast), white (clean and bright), light gray (neutral), or
                  off-white (warm). The backing sits behind your currency inside the shadowbox.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Acrylic Glazing</h3>
                <p className="text-muted-foreground">
                  Standard acrylic gives maximum clarity. Non-glare acrylic cuts reflections in bright rooms. Both are lighter
                  and safer than glass.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Preset and Custom Sizes</h2>

            <p className="text-muted-foreground mb-6">
              Pick a preset size or enter your own dimensions. All sizes include the same archival materials and construction.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-lg border p-5">
                <h3 className="font-semibold mb-2">Compact (14×12&quot;)</h3>
                <p className="text-sm text-muted-foreground">
                  Good for single bills or small sets. Fits a few notes with room for a nameplate.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-5">
                <h3 className="font-semibold mb-2">Standard (17×13&quot;)</h3>
                <p className="text-sm text-muted-foreground">
                  Our most popular size. Holds multiple bills or a medium collection.
                </p>
              </div>
              <div className="bg-card rounded-lg border p-5">
                <h3 className="font-semibold mb-2">Large (28×16&quot;)</h3>
                <p className="text-sm text-muted-foreground">
                  Big collections or oversized currency. Room for many bills or large format notes.
                </p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Need a different size? Enter custom dimensions from 6×6&quot; up to 48×48&quot; in our designer.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">What's Included</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Every Frame Includes:</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Shadowbox frame with depth for currency</li>
                  <li>• Acid-free double mat (White on Black or custom)</li>
                  <li>• Framer's grade acrylic glazing</li>
                  <li>• Acid-free backing board</li>
                  <li>• Hanging hardware</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Optional Add-Ons:</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Brass nameplate with custom text</li>
                  <li>• Non-glare acrylic upgrade</li>
                  <li>• Custom mat colors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Questions we hear most</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-card rounded-lg p-5 border">
              <h3 className="font-semibold mb-2">What sizes are available?</h3>
              <p className="text-sm text-muted-foreground">
                Choose from Compact (14×12&quot;), Standard (17×13&quot;), or Large (28×16&quot;). Need something else? Enter custom
                dimensions in our designer.
              </p>
            </div>
            <div className="bg-card rounded-lg p-5 border">
              <h3 className="font-semibold mb-2">How do I mount my currency?</h3>
              <p className="text-sm text-muted-foreground">
                Use acid-free mounting corners or photo corners (not included) to hold your bills. This keeps your currency safe
                without adhesives.
              </p>
            </div>
            <div className="bg-card rounded-lg p-5 border">
              <h3 className="font-semibold mb-2">Can I change the mat colors?</h3>
              <p className="text-sm text-muted-foreground">
                Yes. White on Black is the classic look, but you can pick any mat colors in our designer.
              </p>
            </div>
            <div className="bg-card rounded-lg p-5 border">
              <h3 className="font-semibold mb-2">Why use a shadowbox for currency?</h3>
              <p className="text-sm text-muted-foreground">
                Shadowbox depth keeps your bills from touching the acrylic. This protects delicate paper and creates an elegant
                floating effect.
              </p>
            </div>
            <div className="bg-card rounded-lg p-5 border">
              <h3 className="font-semibold mb-2">Are the materials acid-free?</h3>
              <p className="text-sm text-muted-foreground">
                Yes. We use acid-free mats and backing that won't damage your currency. Your collection stays protected for
                decades.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts
        productKeys={["comic-frames", "ticket-frames", "signature-frames", "picture-frames"]}
        columns={4}
      />
    </>
  );
}
