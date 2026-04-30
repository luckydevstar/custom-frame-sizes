"use client";

/* eslint-disable react/no-unescaped-entities -- legacy copy from b-shadow-box-frames-original MagazineFrames.tsx */

import { KeyFeaturesBar, type Feature } from "@/components/marketing/key-features-bar";
import { MAGAZINE_FAQS, MAGAZINE_SIZE_ROWS, getMagazineSizeFormatId } from "@/config/magazine-frames-data";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Card } from "@framecraft/ui";
import {
  Archive,
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  Crown,
  Frame,
  Gift,
  Home,
  Layers,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import dynamic from "next/dynamic";

const MagazineFrameDesignerDynamic = dynamic(
  () => import("@framecraft/ui").then((m) => ({ default: m.MagazineFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center bg-background border rounded-lg">
        <p className="text-muted-foreground">Loading designer…</p>
      </div>
    ),
  },
);

const magazineFeatures: Feature[] = [
  {
    icon: Layers,
    title: "Shadowbox Depth",
    subtitle: "Deep Profile Protection",
    testId: "feature-shadowbox-depth",
  },
  {
    icon: Shield,
    title: "Framer's Grade Acrylic",
    subtitle: "Stops Fading & Yellowing",
    testId: "feature-uv-protection",
  },
  {
    icon: Frame,
    title: "Multiple Layouts",
    subtitle: "Single & Multi-Opening Designs",
    testId: "feature-multiple-layouts",
  },
  {
    icon: Award,
    title: "Custom Sizes",
    subtitle: "Fits All Magazine Dimensions",
    testId: "feature-custom-sizes",
  },
];

/** b-shadow-box-frames-original/client/src/pages/specialty/MagazineFrames.tsx */
export function MagazineFramesPageContent() {
  useScrollToTop();

  const applications = [
    {
      icon: Archive,
      title: "Vintage Magazine Collections",
      description:
        "Display historic issues like Life, Look, and Saturday Evening Post with proper archival protection",
    },
    {
      icon: Star,
      title: "Iconic Covers",
      description: "Frame memorable celebrity covers, historic moments, and award-winning photography",
    },
    {
      icon: Crown,
      title: "Limited Editions",
      description: "Preserve special anniversary issues, collector editions, and commemorative publications",
    },
    {
      icon: Sparkles,
      title: "First Issues",
      description: "Protect inaugural publications and milestone editions worth preserving",
    },
    {
      icon: Camera,
      title: "Themed Collections",
      description: "Curate covers by decade, topic, or publication for gallery wall displays",
    },
    {
      icon: Gift,
      title: "Collector Gifts",
      description: "Create meaningful gifts featuring magazines with personal significance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary" data-testid="badge-hero">
              Professional Magazine Preservation
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight" data-testid="heading-hero">
            Magazine Frames in Custom Sizes
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto"
            data-testid="text-hero-description"
          >
            Frame collectible magazines in shadowbox frames made for all sizes. Pick from layouts with framer&apos;s grade acrylic
            and archival matting to keep vintage covers safe.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Frame className="w-4 h-4" />
              <span>Multiple Layouts</span>
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

      <KeyFeaturesBar features={magazineFeatures} />

      <section id="designer-section" className="border-t scroll-mt-4">
        <MagazineFrameDesignerDynamic />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="heading-magazine-info">
            Framing Collectible Magazines
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Collectible magazines mark key moments in history and culture. From iconic Life covers to first issues,
              vintage magazines deserve proper care.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Magazine sizes vary by publication and era. Our frames fit every dimension with proper spacing and protection.
            </p>
          </div>

          <div className="mt-8 mb-8">
            <h3 className="text-xl font-semibold mb-3">How It All Fits Together</h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-muted-foreground mb-3">
                  Your magazine slides into a nesting foam board that holds it flush and flat, no adhesive, no tape, no risk
                  to the cover or spine. The foam board centers your magazine inside a precision-cut beveled mat, with the
                  cover fully visible.
                </p>
                <p className="text-muted-foreground mb-3">
                  The solid wood shadowbox moulding gives you 1.5&quot; of depth so the cover never touches the acrylic.
                  Protective acrylic glazing seals the front, and a foam core backing locks everything in place.
                </p>
                <p className="text-muted-foreground">
                  The result is a clean, professional display where the magazine appears to float inside the frame, cover
                  centered and protected.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element -- served via /magazine asset rewrite */}
                <img
                  src="/magazine/whats-included-exploded.png"
                  alt="Exploded view of magazine frame layers: solid wood shadowbox moulding, protective acrylic front, precision-cut beveled mat, nesting foam board hero layer holding magazine flush and flat, and foam core backing"
                  className="w-full h-auto"
                  loading="lazy"
                  data-testid="img-magazine-exploded"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                What&apos;s Included
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Solid wood shadowbox frame with deep profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Framer&apos;s grade acrylic glazing (standard or non-glare)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Archival mat board with precision-cut openings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Archival backing board</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Hanging hardware installed</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Recommended For
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Vintage magazine collections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Celebrity cover appearances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Sports moments and athlete features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Historic news events</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Personal features and achievements</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-why-choose">
              Why Choose Shadowbox Frames for Magazines
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proper framing protects collectible magazines for decades
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shadowbox Depth Prevents Damage</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep profile frames keep magazines away from glass. This prevents creases, spine damage, and paper
                    deterioration over time.
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
                    Blocks harmful light that causes fading and yellowing. Pick standard or non-glare.
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
                    Professional-grade matting stops yellowing and damage over time.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Frame className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Custom Fit for All Magazine Sizes</h3>
                  <p className="text-sm text-muted-foreground">
                    Mat openings sized precisely for any magazine dimension with proper border spacing and professional
                    presentation.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Single and Multi-Opening Layouts</h3>
                  <p className="text-sm text-muted-foreground">
                    Display one magazine or create collection displays with multiple magazines in professional grid arrangements.
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
                  <h3 className="font-semibold mb-2">Optional Brass Engraved Plaque</h3>
                  <p className="text-sm text-muted-foreground">
                    Add personalized plaques with issue dates, publication names, or special messages for gifts and
                    commemorations.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-magazine-sizes">
              Popular Magazine Sizes Reference Guide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common magazine dimensions to help you select the right frame size
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MAGAZINE_SIZE_ROWS.map((item, idx) => {
              const formatId = getMagazineSizeFormatId(item.size);
              return (
                <a
                  key={`${item.magazine}-${idx}`}
                  href="#designer-section"
                  onClick={(e) => {
                    e.preventDefault();
                    const newUrl = `/magazine-frames?format=${formatId}`;
                    window.history.pushState({}, "", newUrl);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                    document.getElementById("designer-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block"
                  data-testid={`magazine-size-link-${idx}`}
                >
                  <Card
                    className="p-4 hover-elevate active-elevate-2 cursor-pointer transition-all group"
                    data-testid={`magazine-size-${idx}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{item.magazine}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm text-muted-foreground font-mono whitespace-nowrap">
                          {item.size}&quot;
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>

          <div className="mt-6 p-5 bg-muted/50 rounded-lg border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Note:</strong> Magazine sizes can vary between publication eras and special editions. Measure your
              specific magazine for the most accurate frame sizing. Our designer accepts any custom dimensions.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-applications">
              Popular Uses for Magazine Frames
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From vintage collections to iconic covers</p>
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
              Magazine Framing Questions
            </h2>
            <p className="text-muted-foreground">Common questions about framing and preserving collectible magazines</p>
          </div>

          <div className="space-y-4">
            {MAGAZINE_FAQS.map((faq, idx) => (
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
