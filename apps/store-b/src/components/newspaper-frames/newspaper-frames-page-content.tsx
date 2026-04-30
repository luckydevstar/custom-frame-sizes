"use client";

import { KeyFeaturesBar } from "@/components/marketing/key-features-bar";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Button, Card } from "@framecraft/ui";
import { Newspaper, Shield, Award, Sparkles, Check, Frame, ArrowDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback } from "react";

const NewspaperFrameDesignerDynamic = dynamic(
  () => import("@framecraft/ui").then((m) => ({ default: m.NewspaperFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center bg-background border rounded-lg">
        <p className="text-muted-foreground">Loading designer…</p>
      </div>
    ),
  },
);

const faqData = [
  {
    question: "What size frame do I need for a newspaper?",
    answer:
      'Most newspapers are 11" x 22" (tabloid) or 15" x 22.75" (broadsheet). Add 2-3 inches to each side for mat borders. Our designer helps you find the right size.',
  },
  {
    question: "How deep should a newspaper frame be?",
    answer:
      "Use a shadowbox frame with 1-1.5 inches of depth. This keeps your newspaper away from the glass and allows room for archival backing.",
  },
  {
    question: "Will my newspaper yellow or fade over time?",
    answer:
      "Good framing slows aging. Framer's grade acrylic blocks harmful light. Archival mats and backing help keep paper in better shape longer.",
  },
  {
    question: "Can I frame two newspapers together?",
    answer:
      "Yes. Our double layout puts two newspapers side by side in one frame. Great for before-and-after stories or milestone events.",
  },
  {
    question: "Should newspapers be matted?",
    answer:
      "Yes. Mats add space between the paper and acrylic. They also protect the edges. A 2-3 inch border is standard.",
  },
];

/** origina-store-b/client/src/pages/specialty/NewspaperFrames.tsx */
export function NewspaperFramesPageContent() {
  useScrollToTop();

  const scrollToDesigner = useCallback(() => {
    const designerElement = document.getElementById("designer");
    if (designerElement) {
      designerElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Newspaper className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Professional Newspaper Framing</span>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
            data-testid="heading-hero"
          >
            Custom Newspaper Display Frames
          </h1>

          <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
            Frame any newspaper clipping. Our shadowbox frames protect headlines, birth announcements, and historic
            front pages.
          </p>

          <div className="flex justify-center mt-4">
            <Button size="lg" onClick={scrollToDesigner} className="px-8" data-testid="button-design-frame">
              Design Your Frame
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <KeyFeaturesBar />

      <section id="designer" className="container mx-auto px-4 py-12 md:py-16 border-t scroll-mt-20">
        <NewspaperFrameDesignerDynamic embedded />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-why-choose">
              Why Choose Our Newspaper Frames
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built to keep your newspapers safe for years</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6" data-testid="card-feature-shadowbox">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shadowbox Depth</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep frames keep paper away from the glass. This helps prevent damage.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="card-feature-acrylic">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Award className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                  <p className="text-sm text-muted-foreground">Blocks harmful light that causes fading and yellowing.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="card-feature-archival">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Sparkles className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Archival Mat Board</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional-grade materials slow yellowing and damage over time.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="card-feature-hardware">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Check className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Secure Hanging Hardware</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional mounting hardware included for safe wall display.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="card-feature-plaque">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Newspaper className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Optional Engraved Plaque</h3>
                  <p className="text-sm text-muted-foreground">Add a custom brass plaque to mark the date and meaning.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="card-feature-custom">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Frame className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Custom Sizing</h3>
                  <p className="text-sm text-muted-foreground">
                    Perfect fit for any newspaper, from tabloid to full broadsheet.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-3">How Your Newspaper Is Protected</h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-muted-foreground mb-3">
                  Your newspaper slides into a nesting foam board and lies perfectly flat, no pins, no tape, no damage to
                  historic paper. The foam board holds it in place so it can&apos;t shift, bow, or curl over time.
                </p>
                <p className="text-muted-foreground mb-3">
                  A precision-cut beveled mat frames the front page with clean borders. The solid wood shadowbox moulding
                  provides enough depth so the paper never touches the acrylic, just 0.62&quot; of clearance that makes all the
                  difference.
                </p>
                <p className="text-muted-foreground">
                  Protective acrylic seals the front, and foam core backing locks everything in from behind. Five layers
                  working together to keep your newspaper safe and looking sharp on the wall.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element -- asset served via /newspaper rewrite */}
                <img
                  src="/newspaper/whats-included-exploded.png"
                  alt="Exploded view of newspaper frame layers: solid wood shadowbox moulding, protective acrylic front, precision-cut beveled mat, nesting foam board holding newspaper flat without pins or tape, and foam core backing"
                  className="w-full h-auto"
                  loading="lazy"
                  data-testid="img-newspaper-exploded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" data-testid="heading-applications">
            What to Frame
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4 text-muted-foreground">
                <div data-testid="application-birth">
                  <p className="font-semibold text-foreground mb-1">Birth Announcements</p>
                  <p className="text-sm">Celebrate a new baby with the original newspaper announcement.</p>
                </div>
                <div data-testid="application-headlines">
                  <p className="font-semibold text-foreground mb-1">Historic Headlines</p>
                  <p className="text-sm">Capture big moments in history. Moon landing, championships, elections.</p>
                </div>
                <div data-testid="application-wedding">
                  <p className="font-semibold text-foreground mb-1">Wedding Announcements</p>
                  <p className="text-sm">Frame the wedding announcement as a keepsake for the couple.</p>
                </div>
                <div data-testid="application-sports">
                  <p className="font-semibold text-foreground mb-1">Sports Championships</p>
                  <p className="text-sm">Display front-page coverage of team victories and big wins.</p>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4 text-muted-foreground">
                <div data-testid="application-birthday">
                  <p className="font-semibold text-foreground mb-1">Milestone Birthdays</p>
                  <p className="text-sm">Gift a newspaper from someone&apos;s birth date. A unique present.</p>
                </div>
                <div data-testid="application-memorial">
                  <p className="font-semibold text-foreground mb-1">Obituaries</p>
                  <p className="text-sm">Honor loved ones with dignified preservation of memorials.</p>
                </div>
                <div data-testid="application-local">
                  <p className="font-semibold text-foreground mb-1">Local History</p>
                  <p className="text-sm">Document community milestones and local events.</p>
                </div>
                <div data-testid="application-political">
                  <p className="font-semibold text-foreground mb-1">Political Events</p>
                  <p className="text-sm">Preserve coverage of elections and inaugurations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" data-testid="heading-faq">
            Common Questions
          </h2>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={faq.question} data-testid={`faq-item-${index}`}>
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-final-cta">
            Ready to Frame Your Newspaper?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Use the designer above to pick your size, mat, and frame style. See instant pricing.
          </p>
          <Button
            size="lg"
            onClick={scrollToDesigner}
            className="text-lg px-10 h-14"
            data-testid="button-scroll-to-designer"
          >
            Back to Designer
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No account needed. Instant pricing. Professional-grade materials.
          </p>
        </div>
      </section>
    </div>
  );
}
