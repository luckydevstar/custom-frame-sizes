"use client";

import { useEffect } from "react";
import { Badge, TooltipProvider, BrassNameplateOrderModule } from "@framecraft/ui";
import { Sparkles, Ruler, Palette, Type, CheckCircle2 } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What sizes are available for custom nameplates?",
    answer:
      'Our brass nameplates can be made in any size from 1.5" to 12" in both width and height. You enter exact dimensions, and we cut to your specifications.',
  },
  {
    question: "How is the engraving area calculated?",
    answer:
      'The usable engraving area is 0.25" smaller on all sides than the plate dimensions. For example, a 4" × 2" plate has a 3.5" × 1.5" engraving area.',
  },
  {
    question: "What font options are available?",
    answer:
      "We offer five professional fonts: Georgia (classic serif), Arial (clean sans-serif), Cinzel (formal Roman-style), Dancing Script (elegant cursive), and Courier New (monospace).",
  },
  {
    question: "What finish options are available?",
    answer:
      "Choose from four finishes: Brass with Black Text, Silver with Black Text, Black with Gold Text, or Black with Silver Text. All feature laser-engraved text for durability.",
  },
  {
    question: "How many lines of text can I add?",
    answer:
      "You can add up to 10 lines of text. Each line has its own font size slider (8pt to 72pt) and bold option. The system shows a warning if text may not fit.",
  },
  {
    question: "Can I add decorative icons?",
    answer:
      "Yes! Choose from our library of engravable icons including hearts, stars, anchors, crosses, flourishes, and more. Icons are laser-engraved along with your text.",
  },
  {
    question: "How is pricing calculated?",
    answer:
      "Custom engraved brass nameplates start at $29 for smaller sizes. Larger nameplates scale reasonably with size. The maximum price is $129, regardless of size.",
  },
  {
    question: "Can I order multiple nameplates?",
    answer:
      "Yes, select your desired quantity before adding to cart. Each nameplate in your order will have the same design and specifications.",
  },
];

const WHY_CHOOSE_FEATURES = [
  {
    title: "Precision Laser Engraving",
    description:
      "High-resolution laser engraving creates crisp, permanent text that won't fade or wear off.",
  },
  {
    title: "Custom Sizes",
    description:
      'Enter exact dimensions from 1.5" to 12" in both width and height for the perfect fit.',
  },
  {
    title: "Multiple Finishes",
    description:
      "Choose brass, silver, or black backgrounds with contrasting gold, silver, or black text.",
  },
  {
    title: "Decorative Icons",
    description:
      "Add hearts, stars, crosses, anchors, and more from our library of engravable icons.",
  },
];

export function BrassNameplatesClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Custom Brass Nameplates",
    description:
      'Laser-engraved brass nameplates in custom sizes from 1.5" to 12". Choose from brass, silver, or black finishes with personalized text and decorative icons.',
    brand: {
      "@type": "Brand",
      name: "Custom Frame Sizes",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "29.00",
      priceValidUntil: "2025-12-31",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <TooltipProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* 1. Hero */}
        <section className="relative bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 dark:to-background py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4" data-testid="badge-hero">
                <Sparkles className="h-3 w-3 mr-1" />
                Laser Engraved
              </Badge>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
                data-testid="heading-hero"
              >
                Custom Brass Nameplates
              </h1>
              <p className="text-lg text-muted-foreground mb-8" data-testid="text-hero-description">
                Create personalized brass nameplates in any size from 1.5&quot; to 12&quot;. Add
                custom text, choose your finish, and include decorative icons.
              </p>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-amber-500" />
                  <span>Custom Sizes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-amber-500" />
                  <span>4 Finishes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-amber-500" />
                  <span>5 Fonts</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Order module */}
        <section className="container mx-auto px-4 py-8 sm:py-12">
          <BrassNameplateOrderModule />
        </section>

        {/* 3. Why Choose Our Brass Nameplates */}
        <section className="bg-muted/30 py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="heading-features">
              Why Choose Our Brass Nameplates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {WHY_CHOOSE_FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg p-6 border"
                  data-testid={`feature-card-${index}`}
                >
                  <CheckCircle2 className="h-6 w-6 text-amber-500 mb-3" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. FAQ */}
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <h2 className="text-2xl font-bold text-center mb-8" data-testid="heading-faq">
            Brass Nameplate Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-card"
                data-testid={`faq-card-${index}`}
              >
                <h3 className="font-semibold mb-2">{item.question}</h3>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="lg:hidden h-20" />
      </div>
    </TooltipProvider>
  );
}
