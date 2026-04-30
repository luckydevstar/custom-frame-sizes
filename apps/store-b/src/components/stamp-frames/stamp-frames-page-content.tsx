"use client";

/* eslint-disable react/no-unescaped-entities -- legacy copy from b-shadow-box-frames-original StampFrames.tsx */

import { Badge } from "@framecraft/ui/components/ui/badge";
import { Button } from "@framecraft/ui";
import {
  ArrowDown,
  Award,
  CheckCircle,
  Clock,
  Hand,
  Hexagon,
  Ruler,
  Shield,
  Stamp,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback } from "react";

const StampFrameDesignerDynamic = dynamic(
  () => import("@framecraft/ui").then((m) => ({ default: m.StampFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center bg-background border rounded-lg mx-4">
        <p className="text-muted-foreground">Loading designer…</p>
      </div>
    ),
  },
);

/** b-shadow-box-frames-original/client/src/pages/StampFrames.tsx */
export function StampFramesPageContent() {
  const scrollToDesigner = useCallback(() => {
    const designerSection = document.getElementById("stamp-designer");
    if (designerSection) {
      designerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-background to-muted py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" data-testid="badge-category">
              <Stamp className="w-3 h-3 mr-1" />
              Custom Shadowbox Frames for Stamps
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Stamp Collection Display Frames
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Display stamp collections, first-day covers, and postal memorabilia in custom frames with acid-free materials
              and framer&apos;s grade acrylic.
            </p>

            <Button size="lg" className="text-lg" onClick={scrollToDesigner} data-testid="button-design-now">
              <ArrowDown className="w-5 h-5 mr-2" />
              Design Your Frame
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="benefit-framers-acrylic">
              <Hexagon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Framer&apos;s Grade Acrylic</p>
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

            <div className="text-center" data-testid="benefit-frame-shop-quality">
              <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Frame Shop Quality</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                To protect your items
              </p>
            </div>

            <div className="text-center" data-testid="benefit-handcrafted">
              <Hand className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Handcrafted to Order</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Made in our frame shop
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="stamp-designer" className="py-8">
        <StampFrameDesignerDynamic embedded />
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Why Collectors Choose ShadowboxFrames
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-card rounded-lg border p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Archival Materials</h3>
                <p className="text-muted-foreground">
                  Acid-free mats and framer&apos;s grade acrylic protect your stamps from UV damage and deterioration.
                </p>
              </div>

              <div className="bg-card rounded-lg border p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Clock className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Built to Order</h3>
                <p className="text-muted-foreground">
                  Each frame ships in 7-10 business days, assembled by hand in our Somerset, NJ workshop.
                </p>
              </div>

              <div className="bg-card rounded-lg border p-6 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Satisfaction Guaranteed</h3>
                <p className="text-muted-foreground">
                  If anything is wrong with your frame, we&apos;ll make it right. No hassle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How Stamp Display Frames Work</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                Our stamp frames use shadowbox construction with archival materials. The White on Black double mat creates
                visual depth while protecting your collection. Choose from preset sizes or enter custom dimensions.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">White on Black Double Mat</h3>
              <p className="text-muted-foreground mb-4">
                The classic double mat configuration uses a white top mat with a black bottom mat. The white inner border
                frames your stamps while the black reveals add depth and contrast.
              </p>
              <p className="text-muted-foreground mb-6">
                Both mats are archival to prevent damage to your stamps over time. The 2-inch mat border provides
                professional framing proportions.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Four Backing Color Options</h3>
              <p className="text-muted-foreground mb-4">Choose the background color for your stamp display:</p>
              <ul className="text-muted-foreground mb-6 space-y-2">
                <li>
                  <strong>Black:</strong> Maximum contrast, makes stamps pop
                </li>
                <li>
                  <strong>White:</strong> Clean, bright background for any stamps
                </li>
                <li>
                  <strong>Light Gray:</strong> Subtle, neutral backdrop
                </li>
                <li>
                  <strong>Off White:</strong> Warm, classic presentation
                </li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Framer&apos;s Grade Acrylic Glazing</h3>
              <p className="text-muted-foreground mb-4">
                Choose between regular acrylic for crystal clarity or non-glare acrylic to reduce reflections. Both are the
                same professional-grade acrylic used in custom frame shops.
              </p>
              <p className="text-muted-foreground mb-6">
                Acrylic is lighter and safer than glass. It won&apos;t shatter if bumped.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Preset and Custom Sizes</h3>
              <p className="text-muted-foreground mb-4">We offer three popular preset sizes:</p>
              <ul className="text-muted-foreground mb-6 space-y-2">
                <li>
                  <strong>Compact (14×12&quot;):</strong> Small stamp sets, single sheets
                </li>
                <li>
                  <strong>Standard (17×13&quot;):</strong> Medium collections, stamp blocks
                </li>
                <li>
                  <strong>Large (28×16&quot;):</strong> Extensive collections, commemorative sheets
                </li>
              </ul>
              <p className="text-muted-foreground mb-6">
                Need a different size? Use our custom sizing option for any dimensions from 6×6&quot; up to 48×48&quot;.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Optional Brass Nameplate</h3>
              <p className="text-muted-foreground mb-4">
                Add a custom brass nameplate with up to three lines of text. Suited to collection names, issue dates, or
                descriptive labels.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
