"use client";

import dynamic from "next/dynamic";
import {
  BookOpen,
  Shield,
  Frame,
  Layers,
  Award,
  Home,
  Sparkles,
  ArrowRight,
  Archive,
  Star,
  Crown,
  Camera,
  Gift,
} from "lucide-react";
import { Button } from "@framecraft/ui";
import { Card, CardContent } from "@framecraft/ui";

const MagazineFrameDesigner = dynamic(
  () =>
    import("@framecraft/ui").then((mod) => {
      const C = mod.MagazineFrameDesigner;
      if (!C) throw new Error("MagazineFrameDesigner not exported from @framecraft/ui");
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

const MagazineLifestyleCarousel = dynamic(
  () =>
    import("@framecraft/ui").then((mod) => {
      const C = mod.MagazineLifestyleCarousel;
      if (!C) throw new Error("MagazineLifestyleCarousel not exported from @framecraft/ui");
      return { default: C };
    }),
  { ssr: false }
);

function getSizeFormatId(sizeString: string): string {
  const sizeMap: Record<string, string> = {
    "5 1/2 × 7 1/2": "compact-55x75",
    "7 × 10": "compact-7x10",
    "8 × 10 1/2": "standard-8x105",
    "8 × 11": "standard-8x11",
    "8 1/4 × 11": "standard-825x11",
    "8 1/2 × 11": "standard-letter",
    "8 3/4 × 11": "standard-875x11",
    "9 × 11": "standard-9x11",
    "10 × 10 1/2": "large-10x105",
    "10 × 12": "large-10x12",
    "10 × 14": "large-10x14",
    "10 1/2 × 12": "large-105x12",
    "10 1/2 × 14": "large-105x14",
    "11 × 14": "large-11x14",
  };
  return sizeMap[sizeString] ?? "standard-letter";
}

const magazineSizes = [
  { magazine: "Allure Frame", size: "8 × 10 1/2" },
  { magazine: "Architectural Digest Frame", size: "8 1/2 × 11" },
  { magazine: "Better Homes and Gardens Frame", size: "8 × 10 1/2" },
  { magazine: "Bon Appetit Frame", size: "8 × 11" },
  { magazine: "Colliers Frame (historic)", size: "10 1/2 × 14" },
  { magazine: "Cosmopolitan Frame", size: "8 × 11" },
  { magazine: "Ebony Frame", size: "10 1/2 × 14" },
  { magazine: "Elle Magazine Frame", size: "9 × 11" },
  { magazine: "Entertainment Weekly Frame", size: "8 × 10 1/2" },
  { magazine: "Entrepreneur Frame", size: "10 × 10 1/2" },
  { magazine: "Esquire Magazine Frame", size: "8 1/2 × 11" },
  { magazine: "Fast Company Frame", size: "8 3/4 × 11" },
  { magazine: "Forbes Magazine Frame", size: "8 × 10 1/2" },
  { magazine: "Fortune Frame", size: "10 × 10 1/2" },
  { magazine: "GQ Magazine Frame", size: "8 × 11" },
  { magazine: "Glamour Frame", size: "8 × 11" },
  { magazine: "Good Housekeeping Frame", size: "8 × 11" },
  { magazine: "Harper's Bazaar Frame", size: "9 × 11" },
  { magazine: "Interview Magazine Frame", size: "10 × 12" },
  { magazine: "Jet Frame (historic)", size: "5 1/2 × 7 1/2" },
  { magazine: "Life Magazine Frame", size: "10 1/2 × 14" },
  { magazine: "MAD Magazine Frame", size: "8 × 10 1/2" },
  { magazine: "Marie Claire Frame", size: "9 × 11" },
  { magazine: "Men's Health Frame", size: "8 × 10 1/2" },
  { magazine: "National Geographic Frame", size: "7 × 10" },
  { magazine: "Newsweek Magazine Frame", size: "8 × 10 1/2" },
  { magazine: "Nintendo Power Frame", size: "8 × 10 1/2" },
  { magazine: "People Magazine Frame", size: "8 × 10 1/2" },
  { magazine: "Playboy Frame", size: "8 1/2 × 11" },
  { magazine: "Reader's Digest Frame", size: "5 1/2 × 7 1/2" },
  { magazine: "Rolling Stone Frame (1980s-2008+)", size: "10 × 12" },
  { magazine: "Rolling Stone Frame (2008-2018)", size: "8 × 11" },
  { magazine: "Saturday Evening Post Frame", size: "10 × 12" },
  { magazine: "Scientific American Frame", size: "8 × 10 1/2" },
  { magazine: "Smithsonian Frame", size: "8 × 10 1/2" },
  { magazine: "Sports Illustrated Frame", size: "8 × 10 1/2" },
  { magazine: "The Atlantic Frame", size: "8 × 10 1/2" },
  { magazine: "The Economist Frame", size: "8 × 10 1/2" },
  { magazine: "The New Yorker Frame", size: "8 × 10 1/2" },
  { magazine: "TIME Magazine Frame", size: "8 × 10 1/2" },
  { magazine: "TV Guide Frame (classic)", size: "5 1/2 × 7 1/2" },
  { magazine: "Town & Country Frame", size: "9 × 11" },
  { magazine: "Vanity Fair Frame", size: "8 3/4 × 11" },
  { magazine: "Vogue Magazine Frame", size: "8 3/4 × 11" },
  { magazine: "W Magazine Frame", size: "10 × 14" },
  { magazine: "Weekly World News Frame", size: "11 × 14" },
  { magazine: "Wired Magazine Frame", size: "8 × 11" },
];

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
    description:
      "Frame memorable celebrity covers, historic moments, and award-winning photography",
  },
  {
    icon: Crown,
    title: "Limited Editions",
    description:
      "Preserve special anniversary issues, collector editions, and commemorative publications",
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

const faqs = [
  {
    question: "What are the most common magazine sizes?",
    answer:
      'Magazine sizes vary by publication. Common sizes: TIME and People (8×10.5"), Sports Illustrated (8.5×11"), Vogue (8.875×11"), Life Magazine (10.5×14"), National Geographic (6.875×10"). Our frames fit all sizes.',
  },
  {
    question: "Can I frame multiple magazines together?",
    answer:
      "Yes. We have layouts for 2-6 magazines in one frame. Great for themed collections or series.",
  },
  {
    question: "What type of frame do I need for magazines?",
    answer:
      "Magazines need shadowbox frames. The extra depth keeps paper away from the acrylic. All frames use framer's grade acrylic and archival matting.",
  },
  {
    question: "How do I preserve vintage magazines from fading?",
    answer:
      "Use framer's grade acrylic and archival mat board. Our shadowbox frames keep magazines safe from light damage and yellowing.",
  },
  {
    question: "Do frames include protection from fading?",
    answer:
      "Yes. All frames use framer's grade acrylic that blocks harmful light. Pick standard or non-glare.",
  },
  {
    question: "Can I add an engraved plaque?",
    answer:
      "Yes. Add a brass plaque with the issue date, publication name, or a message. Great for gifts.",
  },
  {
    question: "Will framing protect the value of collectible magazines?",
    answer:
      "Yes. Proper framing with archival materials helps preserve condition and value. Our frames prevent damage, fading, and wear.",
  },
  {
    question: "What size frame do I need for Rolling Stone magazine?",
    answer:
      'Current issues: 8×11". Classic issues from earlier decades: 10.5×12". Our designer fits both sizes.',
  },
  {
    question: "Can I frame magazines with thick spines or special covers?",
    answer:
      "Yes. Shadowbox frames have room for thick bindings, embossed covers, and special packaging.",
  },
];

export function MagazineFramesContent() {
  const scrollToDesigner = () => {
    const el = document.getElementById("design-tool");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
            data-testid="heading-hero"
          >
            Magazine Frames in Custom Sizes
          </h1>
          <p
            className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto"
            data-testid="text-hero-description"
          >
            Frame collectible magazines in shadowbox frames made for all sizes. Pick from layouts
            with framer&apos;s grade acrylic and archival matting to keep vintage covers safe.
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
          <Button
            size="lg"
            onClick={scrollToDesigner}
            className="mt-6 rounded-full"
            data-testid="button-design-frame"
          >
            Design Your Frame
          </Button>
        </div>
      </section>

      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="feature-shadowbox-depth">
              <Layers className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Shadowbox Depth</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Deep Profile Protection
              </p>
            </div>
            <div className="text-center" data-testid="feature-uv-protection">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                Framer&apos;s Grade Acrylic
              </p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Stops Fading & Yellowing
              </p>
            </div>
            <div className="text-center" data-testid="feature-multiple-layouts">
              <Frame className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Multiple Layouts</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Single & Multi-Opening
              </p>
            </div>
            <div className="text-center" data-testid="feature-custom-sizes">
              <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Custom Sizes</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Fits All Magazine Dimensions
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
        <MagazineFrameDesigner embedded />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto text-center mb-4">
          <h2
            className="text-xl md:text-2xl font-bold mb-2"
            data-testid="heading-display-inspiration"
          >
            Magazine Display Inspiration
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse real customer frames showcasing magazines
          </p>
        </div>
        <MagazineLifestyleCarousel />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="heading-magazine-info">
            Framing Collectible Magazines
          </h2>
          <div className="prose prose-gray max-w-none text-muted-foreground mb-6">
            <p className="leading-relaxed mb-4">
              Collectible magazines mark key moments in history and culture. From iconic Life covers
              to first issues, vintage magazines deserve proper care.
            </p>
            <p className="leading-relaxed">
              Magazine sizes vary by publication and era. Our frames fit every dimension with proper
              spacing and protection.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-5">
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
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  Perfect For
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
              </CardContent>
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Layers className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Shadowbox Depth Prevents Damage</h3>
                    <p className="text-sm text-muted-foreground">
                      Deep profile frames keep magazines away from glass. This prevents creases,
                      spine damage, and paper deterioration over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                    <p className="text-sm text-muted-foreground">
                      Blocks harmful light that causes fading and yellowing. Pick standard or
                      non-glare.
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
                    <h3 className="font-semibold mb-2">Archival Mat Board</h3>
                    <p className="text-sm text-muted-foreground">
                      Professional-grade matting stops yellowing and damage over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Frame className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Custom Fit for All Magazine Sizes</h3>
                    <p className="text-sm text-muted-foreground">
                      Mat openings sized precisely for any magazine dimension with proper border
                      spacing and professional presentation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Single and Multi-Opening Layouts</h3>
                    <p className="text-sm text-muted-foreground">
                      Display one magazine or create collection displays with multiple magazines in
                      professional grid arrangements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Optional Brass Engraved Plaque</h3>
                    <p className="text-sm text-muted-foreground">
                      Add personalized plaques with issue dates, publication names, or special
                      messages for gifts and commemorations.
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
          <div className="text-center mb-10">
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              data-testid="heading-magazine-sizes"
            >
              Popular Magazine Sizes Reference Guide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common magazine dimensions to help you select the right frame size
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {magazineSizes.map((item, idx) => {
              const formatId = getSizeFormatId(item.size);
              return (
                <a
                  key={idx}
                  href="#design-tool"
                  onClick={(e) => {
                    e.preventDefault();
                    const newUrl = `${typeof window !== "undefined" ? window.location.pathname : ""}?format=${formatId}`;
                    if (typeof window !== "undefined") {
                      window.history.pushState({}, "", newUrl);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                      document
                        .getElementById("design-tool")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="block"
                  data-testid={`magazine-size-link-${idx}`}
                >
                  <Card
                    className="p-4 hover:shadow-md active:scale-[0.99] cursor-pointer transition-all group"
                    data-testid={`magazine-size-${idx}`}
                  >
                    <CardContent className="p-0">
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
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
          <div className="mt-6 p-5 bg-muted/50 rounded-lg border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Note:</strong> Magazine sizes can vary between publication eras and special
              editions. Measure your specific magazine for the most accurate frame sizing. Our
              designer accepts any custom dimensions.
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
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From vintage collections to iconic covers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app, idx) => {
              const Icon = app.icon;
              return (
                <Card
                  key={idx}
                  className="p-6 hover:shadow-md active:scale-[0.99] transition-all"
                  data-testid={`application-card-${idx}`}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{app.title}</h3>
                        <p className="text-sm text-muted-foreground">{app.description}</p>
                      </div>
                    </div>
                  </CardContent>
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
            <p className="text-muted-foreground">
              Common questions about framing and preserving collectible magazines
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-6" data-testid={`faq-card-${idx}`}>
                <CardContent className="p-0">
                  <h3 className="font-semibold mb-2 text-lg">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
