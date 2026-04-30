"use client";

/* eslint-disable react/no-unescaped-entities -- legacy copy from b-shadow-box-frames-original PlaybillFrames.tsx */

import { KeyFeaturesBar, type Feature } from "@/components/marketing/key-features-bar";
import { PLAYBILL_FAQS } from "@/config/playbill-frames-data";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Card } from "@framecraft/ui";
import {
  Archive,
  Award,
  Frame,
  Gift,
  Home,
  Layers,
  Shield,
  Sparkles,
  Theater,
  Ticket,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";

const PlaybillFrameDesignerDynamic = dynamic(
  () => import("@framecraft/ui").then((m) => ({ default: m.PlaybillFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center bg-background border rounded-lg">
        <p className="text-muted-foreground">Loading designer…</p>
      </div>
    ),
  },
);

const playbillFeatures: Feature[] = [
  {
    icon: Layers,
    title: "Shadowbox Depth",
    subtitle: "Keeps Programs Safe",
    testId: "feature-shadowbox-depth",
  },
  {
    icon: Shield,
    title: "Framer's Grade Acrylic",
    subtitle: "Stops Fading",
    testId: "feature-uv-protection",
  },
  {
    icon: Ticket,
    title: "Ticket Stub Slots",
    subtitle: "Show Programs & Tickets",
    testId: "feature-ticket-slots",
  },
  {
    icon: Frame,
    title: "30+ Layouts",
    subtitle: "Fit 1-12 Playbills",
    testId: "feature-multiple-layouts",
  },
];

/** b-shadow-box-frames-original/client/src/pages/specialty/PlaybillFrames.tsx */
export function PlaybillFramesPageContent() {
  useScrollToTop();

  const applications = [
    { icon: Theater, title: "Show Memories", description: "Keep your favorite nights" },
    { icon: Archive, title: "Collections", description: "Show off every program" },
    { icon: Sparkles, title: "Opening Nights", description: "Mark special premieres" },
    { icon: Gift, title: "Gifts", description: "For theater fans" },
    { icon: Home, title: "Home Decor", description: "Add style to any room" },
    { icon: Users, title: "Cast Gifts", description: "Thank the performers" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Theater className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary" data-testid="badge-hero">
              Playbill Display Frames
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight" data-testid="heading-hero">
            Custom Playbill Display Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto"
            data-testid="text-hero-description"
          >
            Custom frames for Broadway playbills and theater programs. Standard playbill dimensions with framer&apos;s grade
            acrylic to prevent fading.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Frame className="w-4 h-4" />
              <span>30+ Layouts</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Framer&apos;s Grade Acrylic</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Shadowbox Depth</span>
            </div>
          </div>
        </div>
      </section>

      <KeyFeaturesBar features={playbillFeatures} />

      <section className="border-t">
        <PlaybillFrameDesignerDynamic />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="heading-what-are-playbills">
            What Are Playbills?
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Playbills are programs handed out at Broadway shows and musicals. They measure 5.5 × 8.5 inches. Inside,
              you&apos;ll find the cast list and show info.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Fans collect playbills to remember great shows. Each one marks a special night, a cast, a date, a memory
              worth keeping.
            </p>
          </div>
        </div>
      </section>

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
                    The extra depth keeps playbills away from the acrylic. No creases. No moisture damage.
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
                  <h3 className="font-semibold mb-2">Acid-Free Mat Board</h3>
                  <p className="text-sm text-muted-foreground">Stops yellowing and keeps paper safe over time.</p>
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

          <div className="mt-10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-3">How Your Playbill Is Protected</h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-muted-foreground mb-3">
                  Your playbill slides into a nesting foam board and is held flush and flat, no adhesive, no tape, no risk
                  to the cover or binding. The 7/8&quot; shadowbox depth protects the full booklet thickness without
                  compression.
                </p>
                <p className="text-muted-foreground mb-3">
                  A precision-cut beveled mat frames the cover with clean, even borders. Protective acrylic seals the front,
                  and foam core backing locks everything in from behind.
                </p>
                <p className="text-muted-foreground">
                  Five layers of solid wood, acrylic, mat, foam board, and backing work together so your playbill stays
                  centered, protected, and looking the way it did opening night.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element -- served via /playbill asset rewrite */}
                <img
                  src="/playbill/whats-included-exploded.png"
                  alt="Exploded view of playbill frame layers: solid wood shadowbox moulding with 7/8 inch depth, protective acrylic front, precision-cut beveled mat, nesting foam board hero layer holding playbill securely without adhesive, and foam core backing"
                  className="w-full h-auto"
                  loading="lazy"
                  data-testid="img-playbill-exploded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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
                Rows or columns. Great for trilogies or top picks.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2">Four to Six Playbills</h3>
              <p className="text-sm text-muted-foreground">Grid layouts for big collections.</p>
            </Card>
          </div>
        </div>
      </section>

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
                  key={app.title}
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

      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-faq">
              Common Questions
            </h2>
            <p className="text-muted-foreground">Quick answers about playbill framing</p>
          </div>

          <div className="space-y-4">
            {PLAYBILL_FAQS.map((faq, idx) => (
              <Card key={faq.question} className="p-6" data-testid={`faq-card-${idx}`}>
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
