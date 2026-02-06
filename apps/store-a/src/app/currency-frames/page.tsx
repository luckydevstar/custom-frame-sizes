import type { Metadata } from "next";
import { Sparkles, Shield, Ruler, Layers, Award } from "lucide-react";
import { Card, ComingSoonDesigner } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ScrollToDesignerButton } from "./scroll-button";

export const metadata: Metadata = {
  title: "Currency Display Frames | Custom Shadow Box Frames for Paper Money",
  description:
    "Design custom currency display frames with shadowbox depth for your collection. Frame paper money with archival double matting, framer's grade acrylic, and optional brass nameplates. Available in preset and custom sizes.",
  openGraph: {
    title: "Currency Display Frames | Custom Shadow Box Frames for Paper Money",
    description:
      "Professional currency display frames with shadowbox depth, archival matting, and framer's grade acrylic glazing. Perfect for paper money displays and currency collections.",
    type: "website",
    url: "/currency-frames",
  },
  alternates: { canonical: "/currency-frames" },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Currency Display Frames",
  description:
    "Professional shadowbox frames for currency collections with archival double matting, White on Black mat configuration, framer's grade acrylic glazing, and optional brass nameplates. Available in Compact (14×12), Standard (17×13), Large (28×16), and custom sizes.",
  category: "Numismatic Display Framing",
  sku: "CURRENCY-FRAME-CUSTOM",
  brand: { "@type": "Brand", name: "Custom Frame Sizes" },
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    lowPrice: "139",
    highPrice: "299",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "89",
    bestRating: "5",
    worstRating: "1",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What frame size do I need for my currency collection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose based on your collection size. Compact (14×12 inches) fits small currency sets or single bills. Standard (17×13 inches) holds medium collections or multiple bills. Large (28×16 inches) fits extensive collections or commemorative currency. Need a different size? Use our custom sizing option.",
      },
    },
    {
      "@type": "Question",
      name: "Why use a shadowbox frame for currency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shadowbox frames provide depth between your currency and the acrylic glazing. This prevents bills from touching the glass and allows for dimensional displays. The depth also creates an elegant presentation effect.",
      },
    },
    {
      "@type": "Question",
      name: "What backing colors are available for currency frames?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer four backing options: Black (most popular for contrast), White, Light Gray, and Off White. Black backing makes currency stand out with maximum visual impact.",
      },
    },
    {
      "@type": "Question",
      name: "Are your currency frames archival quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We use archival mat board and backing materials that won't damage your currency over time. Our framer's grade acrylic glazing provides UV protection to prevent fading.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add a brass nameplate to my currency frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Our optional brass nameplates let you add up to three lines of custom text. Perfect for noting the currency type, year, or any commemorative information.",
      },
    },
    {
      "@type": "Question",
      name: "How are currency frames made?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each currency frame is handcrafted to order in our professional frame shop. We use archival materials and framer's grade acrylic to ensure your collection is protected for a lifetime.",
      },
    },
  ],
};

export default function CurrencyFramesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-medium" data-testid="text-badge">
                Protect Your Collection
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
              data-testid="text-hero-title"
            >
              Currency Display Frames
            </h1>
            <p
              className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
              data-testid="text-hero-subtitle"
            >
              Frame paper money collections in custom shadowbox frames with archival double matting.
              We use framer&apos;s grade acrylic so your currency stays protected for life.
            </p>
            <ScrollToDesignerButton />
          </div>
        </section>

        {/* Benefit Bar */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center" data-testid="benefit-uv-glazing">
                <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Framer&apos;s Grade Acrylic
                </p>
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
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Frame Shop Quality
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  To protect your items
                </p>
              </div>
              <div className="text-center" data-testid="benefit-handcrafted">
                <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Handcrafted to Order
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Made in our frame shop
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Designer */}
        <section id="currency-designer" className="scroll-mt-4 py-8">
          <div className="container mx-auto px-4">
            <ComingSoonDesigner
              title="Currency frame designer coming soon"
              description="Use our main frame designer to choose your size, backing color, and mat options. We'll add a dedicated currency display designer with White on Black presets soon."
              buttonLabel="Design your frame"
            />
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                How Currency Display Frames Work
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Shadowbox Depth for Paper Money</h3>
                  <p className="text-muted-foreground">
                    Currency frames use shadowbox construction. This creates space between your
                    bills and the acrylic. Your paper money floats inside the frame instead of
                    pressing flat against the glass.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">White on Black Double Mat</h3>
                  <p className="text-muted-foreground mb-3">
                    The classic currency display uses a white top mat with a black bottom mat. The
                    white border frames your bills. The black accent adds depth and makes your
                    currency stand out. Both mats are archival.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Four Backing Colors</h3>
                  <p className="text-muted-foreground mb-3">
                    Choose the background behind your currency:
                  </p>
                  <ul className="text-muted-foreground space-y-1.5 ml-4 list-disc">
                    <li>
                      <strong>Black:</strong> High contrast, makes bills pop
                    </li>
                    <li>
                      <strong>White:</strong> Clean, bright backdrop
                    </li>
                    <li>
                      <strong>Light Gray:</strong> Neutral, subtle background
                    </li>
                    <li>
                      <strong>Off White:</strong> Warm, classic look
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Preset and Custom Sizes</h3>
                  <p className="text-muted-foreground mb-6">
                    Pick a preset size or enter your own dimensions. Compact (14×12&quot;), Standard
                    (17×13&quot;), Large (28×16&quot;). Need a different size? Use our custom sizing
                    option.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <Card className="p-5">
                <h3 className="font-semibold mb-2">What sizes are available?</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from Compact (14×12&quot;), Standard (17×13&quot;), or Large (28×16&quot;).
                  Need something else? Enter custom dimensions in our designer.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">How do I mount my currency?</h3>
                <p className="text-sm text-muted-foreground">
                  Use archival mounting corners or photo corners (not included) to hold your bills.
                  This keeps your currency safe without adhesives.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Can I change the mat colors?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. White on Black is the classic look, but you can pick any mat colors in our
                  designer.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Why use a shadowbox for currency?</h3>
                <p className="text-sm text-muted-foreground">
                  Shadowbox depth keeps your bills from touching the acrylic. This protects delicate
                  paper and creates an elegant floating effect.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <RelatedProducts
          productKeys={["comic-frames", "ticket-frames", "signature-frames", "picture-frames"]}
          columns={4}
        />
      </div>
    </>
  );
}
