import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import {
  Stamp,
  Clock,
  CheckCircle,
  Shield,
  Hexagon,
  Ruler,
  Award,
  Hand,
  ArrowDown,
} from "lucide-react";
import { Badge, Button } from "@framecraft/ui";
import { ScrollToDesignerButton } from "./scroll-button";
import { RelatedProducts } from "@/components/RelatedProducts";
import type { ShadowboxConfig } from "@framecraft/types";

const ShadowboxDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.ShadowboxDesigner),
  { ssr: false }
);

/** Stamp-page defaults: Compact 14×12", white-on-black double mat, black backing. */
const STAMP_INITIAL_CONFIG: ShadowboxConfig = {
  widthIn: 14,
  heightIn: 12,
  depthIn: 1.25,
  matLayers: [
    { color: "#FFFFFF", thicknessIn: 2.5 },
    { color: "#000000", thicknessIn: 0.25 },
  ],
  background: { material: "mat-color", color: "#000000" },
  glazing: "acrylic",
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stamp Display Frames | Custom Shadow Box Frames for Stamp Collections",
  description:
    "Design custom stamp display frames with shadowbox depth for your collection. Frame stamps with archival double matting, professional-grade acrylic, and optional brass nameplates. Available in preset and custom sizes.",
  openGraph: {
    title: "Stamp Display Frames | Custom Shadow Box Frames for Stamp Collections",
    description:
      "Professional stamp display frames with shadowbox depth, archival matting, and professional-grade glazing. Perfect for philatelic displays and stamp collections.",
    type: "website",
    url: "/stamp-frames",
  },
  alternates: { canonical: "/stamp-frames" },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Stamp Display Frames",
  description:
    "Professional shadowbox frames for stamp collections with archival double matting, White on Black mat configuration, professional-grade acrylic glazing, and optional brass nameplates. Available in Compact (14×12), Standard (17×13), Large (28×16), and custom sizes.",
  category: "Philatelic Display Framing",
  sku: "STAMP-FRAME-CUSTOM",
  brand: { "@type": "Brand", name: "Custom Frame Sizes" },
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    lowPrice: "89",
    highPrice: "249",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "89",
      maxPrice: "249",
      priceCurrency: "USD",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "156",
    bestRating: "5",
    worstRating: "1",
  },
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Frame Depth",
      value: "Shadowbox depth for stamp presentation",
    },
    { "@type": "PropertyValue", name: "Matting", value: "Archival double mat (White on Black)" },
    {
      "@type": "PropertyValue",
      name: "Backing Options",
      value: "Black, White, Light Gray, Off White",
    },
    {
      "@type": "PropertyValue",
      name: "Glazing",
      value: "Framer's grade acrylic (regular or non-glare)",
    },
    {
      "@type": "PropertyValue",
      name: "Available Sizes",
      value: "Compact (14×12), Standard (17×13), Large (28×16), Custom",
    },
    { "@type": "PropertyValue", name: "Made in USA", value: "Handcrafted to order" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What frame size do I need for my stamp collection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose based on your collection size. Compact (14×12 inches) fits small stamp sets or single sheets. Standard (17×13 inches) holds medium collections or stamp blocks. Large (28×16 inches) fits extensive collections or commemorative sheets. Need a different size? Use our custom sizing option.",
      },
    },
    {
      "@type": "Question",
      name: "Why use a shadowbox frame for stamps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shadowbox frames provide depth between your stamps and the acrylic glazing. This prevents stamps from touching the glass and allows for dimensional displays. The depth also creates an elegant presentation effect.",
      },
    },
    {
      "@type": "Question",
      name: "What backing colors are available for stamp frames?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer four backing options: Black (most popular for contrast), White, Light Gray, and Off White. Black backing makes stamps stand out with maximum visual impact.",
      },
    },
    {
      "@type": "Question",
      name: "What is the White on Black mat configuration?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our stamp frames use a double mat system with a white top mat and black bottom mat. The white inner border frames your stamps while the black mat adds depth and contrast. Both mats are archival for preservation.",
      },
    },
    {
      "@type": "Question",
      name: "Should I choose regular or non-glare acrylic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Regular acrylic is crystal clear and shows stamps with maximum clarity. Non-glare acrylic reduces reflections if your frame will hang opposite windows or lights. Both are framer's grade acrylic.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add a brass nameplate to my stamp frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Add a custom brass nameplate with up to three lines of text. Perfect for collection names, dates, or descriptions. Choose from multiple font styles and finishes.",
      },
    },
  ],
};

export default function StampFramesPage() {
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

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-background to-muted py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4" data-testid="badge-category">
                <Stamp className="w-3 h-3 mr-1" />
                Stamp Display Frames
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Stamp Collection Display Frames
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Professional shadowbox frames for your stamp collection. Archival double matting,
                framer&apos;s grade acrylic, and customizable sizing for any display.
              </p>
              <ScrollToDesignerButton />
            </div>
          </div>
        </section>

        {/* Benefit Bar */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center" data-testid="benefit-framers-acrylic">
                <Hexagon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
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
              <div className="text-center" data-testid="benefit-frame-shop-quality">
                <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Frame Shop Quality
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  To protect your items
                </p>
              </div>
              <div className="text-center" data-testid="benefit-handcrafted">
                <Hand className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
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

        {/* Designer Section */}
        <section id="stamp-designer" className="py-8 scroll-mt-20">
          <div className="container mx-auto px-4">
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
                <ShadowboxDesigner embedded initialConfig={STAMP_INITIAL_CONFIG} />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Trust & Quality Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Why Collectors Choose Custom Frame Sizes
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Archival Materials</h3>
                  <p className="text-muted-foreground">
                    All mats and backing are archival to protect your stamps. No yellowing, no
                    damage, no worry.
                  </p>
                </div>
                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Clock className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Handcrafted to Order</h3>
                  <p className="text-muted-foreground">
                    Each frame is built by hand to your exact specifications. Made in our
                    professional frame shop.
                  </p>
                </div>
                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lifetime Guarantee</h3>
                  <p className="text-muted-foreground">
                    We guarantee our work for life. If anything breaks or fails, we fix or replace
                    it at no cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How Stamp Display Frames Work</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-6">
                  Our stamp frames use shadowbox construction with archival materials. The White on
                  Black double mat creates visual depth while protecting your collection. Choose
                  from preset sizes or enter custom dimensions.
                </p>
                <h3 className="text-2xl font-semibold mb-4 mt-8">White on Black Double Mat</h3>
                <p className="text-muted-foreground mb-4">
                  The classic double mat configuration uses a white top mat with a black bottom mat.
                  The white inner border frames your stamps while the black reveals add depth and
                  contrast.
                </p>
                <p className="text-muted-foreground mb-6">
                  Both mats are archival to prevent damage to your stamps over time. The 2-inch mat
                  border provides professional framing proportions.
                </p>
                <h3 className="text-2xl font-semibold mb-4 mt-8">Four Backing Color Options</h3>
                <p className="text-muted-foreground mb-4">
                  Choose the background color for your stamp display:
                </p>
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
                <h3 className="text-2xl font-semibold mb-4 mt-8">
                  Framer&apos;s Grade Acrylic Glazing
                </h3>
                <p className="text-muted-foreground mb-4">
                  Choose between regular acrylic for crystal clarity or non-glare acrylic to reduce
                  reflections. Both are the same professional-grade acrylic used in custom frame
                  shops.
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
                    <strong>Large (28×16&quot;):</strong> Extensive collections, commemorative
                    sheets
                  </li>
                </ul>
                <p className="text-muted-foreground mb-6">
                  Need a different size? Use our custom sizing option for any dimensions from
                  6×6&quot; up to 48×48&quot;.
                </p>
                <h3 className="text-2xl font-semibold mb-4 mt-8">Optional Brass Nameplate</h3>
                <p className="text-muted-foreground mb-4">
                  Add a custom brass nameplate with up to three lines of text. Perfect for
                  collection names, issue dates, or descriptive labels.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Design Your Stamp Frame?
              </h2>
              <p className="text-muted-foreground mb-6">
                Choose your size and mat colors. Get instant pricing.
              </p>
              <Button size="lg" asChild>
                <Link href="#stamp-designer">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Start Designing
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <RelatedProducts
          productKeys={[
            "currency-frames",
            "signature-frames",
            "certificate-frames",
            "picture-frames",
          ]}
          columns={4}
        />
      </div>
    </>
  );
}
