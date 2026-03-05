import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import {
  Theater,
  Ticket,
  Shield,
  Award,
  Layers,
  Sparkles,
  Gift,
  Home,
  Users,
  Archive,
} from "lucide-react";
import { Card } from "@framecraft/ui";

const PlaybillFrameDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.PlaybillFrameDesigner),
  { ssr: false }
);
import { ScrollToDesignerButton } from "./scroll-button";
import { PLAYBILL_DIMENSIONS, TICKET_DIMENSIONS } from "@framecraft/core";

export const metadata: Metadata = {
  title: "Custom Playbill Frames | Broadway Program Display Frames",
  description:
    'Display Broadway programs and theater playbills in perfectly-sized frames. Standard 5.5x8.5" sizing with acid-free mats and professional-grade construction.',
  openGraph: {
    title: "Custom Playbill Frames | Broadway Program Display Frames",
    description:
      "Perfect frames for Broadway playbills and theater programs. Standard sizing with archival materials and professional construction.",
    type: "website",
  },
};

const applications = [
  { icon: Theater, title: "Show Memories", description: "Keep your favorite nights" },
  { icon: Archive, title: "Collections", description: "Show off every program" },
  { icon: Sparkles, title: "Opening Nights", description: "Mark special premieres" },
  { icon: Gift, title: "Gifts", description: "For theater fans" },
  { icon: Home, title: "Home Decor", description: "Add style to any room" },
  { icon: Users, title: "Cast Gifts", description: "Thank the performers" },
];

const faqs = [
  {
    question: "What size are playbills?",
    answer: `Playbills are ${PLAYBILL_DIMENSIONS.width}" × ${PLAYBILL_DIMENSIONS.height}" (tall format). Our frames fit this size with proper mat borders.`,
  },
  {
    question: "What size are ticket stubs?",
    answer: `Ticket stubs are about ${TICKET_DIMENSIONS.width}" × ${TICKET_DIMENSIONS.height}" (wide format). Our layouts have openings sized just for tickets.`,
  },
  {
    question: "Can I frame multiple playbills together?",
    answer:
      "Yes. We have layouts for 1-12 playbills in one frame. Pick side-by-side, stacked, or grid styles.",
  },
  {
    question: "What type of frame do I need?",
    answer:
      "Playbills need shadowbox frames. The extra depth keeps the paper away from the acrylic to prevent damage.",
  },
  {
    question: "Can I add an engraved plaque?",
    answer:
      "Yes. Add a brass plaque with the show name, date, or a custom message. Great for gifts.",
  },
  {
    question: "Do frames protect against fading?",
    answer:
      "Yes. All frames use framer's grade acrylic that blocks light damage. Pick standard or non-glare.",
  },
  {
    question: "How do I keep playbills from yellowing?",
    answer:
      "Use our shadowbox frames with archival mat board. The deep frame keeps paper safe from moisture and light.",
  },
  {
    question: "Can I frame playbills with ticket stubs?",
    answer: "Yes. Many layouts have openings for both. Show the whole theater memory in one frame.",
  },
];

export default function PlaybillFramesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Ticket className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Broadway Memories
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            data-testid="text-hero-title"
          >
            Custom Playbill Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Display Broadway programs and theater playbills in perfectly-sized frames. Standard
            5.5x8.5&quot; sizing with acid-free mats and professional-grade construction.
          </p>

          <ScrollToDesignerButton />
        </div>
      </section>

      {/* Designer Section (includes "Playbill Frames in Real Homes" carousel inside) */}
      <section id="playbill-designer" className="container mx-auto px-4 py-8 md:py-12">
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
            <PlaybillFrameDesigner />
          </Suspense>
        </div>
      </section>

      {/* What Are Playbills */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            data-testid="heading-what-are-playbills"
          >
            What Are Playbills?
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Playbills are programs handed out at Broadway shows and musicals. They measure 5.5 ×
              8.5 inches. Inside, you&apos;ll find the cast list and show info.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Fans collect playbills to remember great shows. Each one marks a special night—a cast,
              a date, a memory worth keeping.
            </p>
          </div>
        </div>
      </section>

      {/* Why Shadowbox Frames Work Best - 6 cards */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-why-choose">
              Why Shadowbox Frames Work Best
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The right frame keeps playbills safe for years
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Deep Frame Stops Damage</h3>
                  <p className="text-sm text-muted-foreground">
                    The extra depth keeps playbills away from the acrylic. No creases. No moisture
                    damage.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                  <p className="text-sm text-muted-foreground">
                    Blocks light that causes fading and yellowing. Pick standard or non-glare.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Archival Mat Board</h3>
                  <p className="text-sm text-muted-foreground">
                    Stops yellowing and keeps paper safe over time.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Theater className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Fits 5.5×8.5&quot; Playbills</h3>
                  <p className="text-sm text-muted-foreground">
                    Mat openings sized for standard programs with even borders.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Ticket Stub Openings</h3>
                  <p className="text-sm text-muted-foreground">
                    5.5×2&quot; slots for tickets. Show the whole night together.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Add a Brass Plaque</h3>
                  <p className="text-sm text-muted-foreground">
                    Engrave the show name, date, or a message. Great for gifts.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Layout Options - 4 cards */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-layout-options">
            Layout Options
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Frame 1-6 playbills in one frame. All layouts have ticket stub slots.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="font-semibold mb-2">Single Playbill</h3>
              <p className="text-sm text-muted-foreground">
                One program with or without a ticket slot. Good for gifts.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2">Two Playbills</h3>
              <p className="text-sm text-muted-foreground">
                Side-by-side or stacked. Great for matinee and evening shows.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2">Three Playbills</h3>
              <p className="text-sm text-muted-foreground">
                Rows or columns. Perfect for trilogies or top picks.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2">Four to Six Playbills</h3>
              <p className="text-sm text-muted-foreground">Grid layouts for big collections.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Ways to Use Playbill Frames - 6 cards */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-applications">
              Ways to Use Playbill Frames
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              For collectors, gift-givers, and theater fans
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app, idx) => {
              const Icon = app.icon;
              return (
                <Card
                  key={idx}
                  className="p-6 hover-elevate active-elevate-2 transition-all"
                  data-testid={`application-card-${idx}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{app.title}</h3>
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Common Questions - 8 FAQs */}
      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-faq">
              Common Questions
            </h2>
            <p className="text-muted-foreground">Quick answers about playbill framing</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-6" data-testid={`faq-card-${idx}`}>
                <h3 className="font-semibold mb-2 text-lg">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
