"use client";

import { Newspaper, Shield, Award, Sparkles, Check, Frame, ArrowDown } from "lucide-react";
import { Button } from "@framecraft/ui";
import { Card, CardContent } from "@framecraft/ui";
import { NewspaperFrameDesigner } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";

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

export function NewspaperFramesContent() {
  const scrollToDesigner = () => {
    const el = document.getElementById("design-tool");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            Newspaper Frames in Custom Sizes
          </h1>
          <p
            className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Frame any newspaper clipping. Our shadowbox frames protect headlines, birth
            announcements, and historic front pages.
          </p>
          <Button
            size="lg"
            onClick={scrollToDesigner}
            className="px-8 rounded-full"
            data-testid="button-design-frame"
          >
            Design Your Frame
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="benefit-shadowbox">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Shadowbox Depth</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Keeps paper away from glass
              </p>
            </div>
            <div className="text-center" data-testid="benefit-acrylic">
              <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                Framer&apos;s Grade Acrylic
              </p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Blocks fading & yellowing
              </p>
            </div>
            <div className="text-center" data-testid="benefit-archival">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                Archival Mat Board
              </p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Slows aging
              </p>
            </div>
            <div className="text-center" data-testid="benefit-hardware">
              <Check className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Secure Hanging</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Professional hardware
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
        <NewspaperFrameDesigner />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-why-choose">
              Why Choose Our Newspaper Frames
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built to keep your newspapers safe for years
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card data-testid="card-feature-shadowbox">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Shadowbox Depth</h3>
                    <p className="text-sm text-muted-foreground">
                      Deep frames keep paper away from the glass. This helps prevent damage.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-feature-acrylic">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                    <p className="text-sm text-muted-foreground">
                      Blocks harmful light that causes fading and yellowing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-feature-archival">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Archival Mat Board</h3>
                    <p className="text-sm text-muted-foreground">
                      Professional-grade materials slow yellowing and damage over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-feature-plaque">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Newspaper className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Optional Engraved Plaque</h3>
                    <p className="text-sm text-muted-foreground">
                      Add a custom brass plaque to mark the date and meaning.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-feature-custom">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Frame className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Custom Sizing</h3>
                    <p className="text-sm text-muted-foreground">
                      Perfect fit for any newspaper, from tabloid to full broadsheet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" data-testid="heading-applications">
            What to Frame
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
            <div className="space-y-4">
              <div data-testid="application-birth">
                <p className="font-semibold text-foreground mb-1">Birth Announcements</p>
                <p className="text-sm">
                  Celebrate a new baby with the original newspaper announcement.
                </p>
              </div>
              <div data-testid="application-headlines">
                <p className="font-semibold text-foreground mb-1">Historic Headlines</p>
                <p className="text-sm">
                  Capture big moments in history. Moon landing, championships, elections.
                </p>
              </div>
              <div data-testid="application-wedding">
                <p className="font-semibold text-foreground mb-1">Wedding Announcements</p>
                <p className="text-sm">
                  Frame the wedding announcement as a keepsake for the couple.
                </p>
              </div>
              <div data-testid="application-sports">
                <p className="font-semibold text-foreground mb-1">Sports Championships</p>
                <p className="text-sm">
                  Display front-page coverage of team victories and big wins.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div data-testid="application-birthday">
                <p className="font-semibold text-foreground mb-1">Milestone Birthdays</p>
                <p className="text-sm">
                  Gift a newspaper from someone&apos;s birth date. A unique present.
                </p>
              </div>
              <div data-testid="application-memorial">
                <p className="font-semibold text-foreground mb-1">Obituaries</p>
                <p className="text-sm">
                  Honor loved ones with dignified preservation of memorials.
                </p>
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
      </section>

      <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" data-testid="heading-faq">
            Common Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} data-testid={`faq-item-${index}`}>
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedProducts
        productKeys={["magazine-frames", "certificate-frames", "picture-frames", "diploma-frames"]}
        columns={4}
      />
    </div>
  );
}
