import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import {
  Heart,
  Flower2,
  Shield,
  Calendar,
  Award,
  Sparkles,
  ArrowDown,
  Ruler,
  CheckCircle2,
} from "lucide-react";
import { Card, Button } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ScrollToDesignerButton } from "./scroll-button";
import { brandConfig } from "../../brand.config";
import type { ShadowboxConfig } from "@framecraft/types";

const BouquetFrameDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.BouquetFrameDesigner),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading designer...</p>
        </div>
      </div>
    ),
  }
);

/** Bouquet-page defaults: 20×24", 2" depth for preserved bouquets, white mat, light backing. */
const BOUQUET_INITIAL_CONFIG: ShadowboxConfig = {
  widthIn: 20,
  heightIn: 24,
  depthIn: 2,
  matLayers: [{ color: "#FFFFFF", thicknessIn: 2.5 }],
  background: { material: "mat-color", color: "#F5F5F0" },
  glazing: "acrylic",
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preserved Bouquet Frames – Wedding Bouquet Framing | Custom Frame Sizes",
  description:
    "Frame your wedding bouquet with archival bouquet frames. Deep frames for preserved flowers with custom sizing and framer's grade acrylic. Professional-grade preservation.",
  keywords:
    "preserved bouquet frames, wedding bouquet shadowbox, bridal flower preservation, dried bouquet framing, 3D flower frames, wedding flower display",
  openGraph: {
    title: "Preserved Bouquet Frames – Wedding Bouquet Framing | Custom Frame Sizes",
    description:
      "Deep bouquet frames for preserved wedding bouquets. Custom sizing, framer's grade acrylic glazing, professional-grade preservation.",
    type: "website",
    url: "/bouquet-frames",
  },
  alternates: { canonical: "/bouquet-frames" },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Preserved Bouquet Frames – Wedding Bouquet Framing",
  description:
    "Deep bouquet frames designed specifically for displaying preserved wedding bouquets and bridal flowers. Custom sizing, 2-inch usable depth, framer's grade acrylic glazing, and archival backing.",
  brand: { "@type": "Brand", name: "CustomFrameSizes.com" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "65.00",
    highPrice: "175.00",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "152" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How deep of a frame do I need for a preserved bouquet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Preserved wedding bouquets require deep bouquet frames with at least 2 inches of usable depth. Our bouquet frames provide exactly 2 inches of interior space, which accommodates most preserved bridal bouquets including roses, peonies, and mixed arrangements.",
      },
    },
    {
      "@type": "Question",
      name: "What's the best way to preserve my wedding bouquet for framing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The two most effective preservation methods are air drying and silica gel drying. For air drying, hang your bouquet upside down in a cool, dark, dry location for 2-3 weeks. For faster results with better color retention, use silica gel crystals to dry flowers in 5-7 days.",
      },
    },
    {
      "@type": "Question",
      name: "Can I frame a bouquet myself or do I need professional help?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can absolutely frame your preserved bouquet yourself! Our deep bouquet frames come ready to assemble with all mounting hardware included. Simply arrange your dried flowers on the archival backing board, secure them gently with pins or adhesive, and close the frame.",
      },
    },
    {
      "@type": "Question",
      name: "What frame color works best for preserved wedding flowers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "White frames are the most popular choice for preserved bouquets as they complement traditional wedding aesthetics and make colorful flowers stand out. Black frames create dramatic contrast. Walnut brown frames add warmth and pair well with rustic, garden, or vintage wedding themes.",
      },
    },
    {
      "@type": "Question",
      name: "How do I protect my dried bouquet from fading?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Framer's grade acrylic is essential for preventing fading and yellowing of preserved flowers. All our bouquet frames include professional-grade acrylic. Additionally, display your framed bouquet away from direct sunlight and use archival backing materials.",
      },
    },
    {
      "@type": "Question",
      name: "What size frame do I need for my bridal bouquet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Frame size depends on your bouquet's dimensions and desired mat border. Small bridal bouquets fit best in 11×14 or 16×20 inch frames. Medium bouquets work well in 20×24 inch frames. Large cascading bouquets may require 24×30 or 24×36 inch frames. Measure your bouquet at its widest points and add 6-8 inches for mat borders.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: brandConfig.seo?.canonicalUrl || "https://customframesizes.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Preserved Bouquet Frames",
      item: `${brandConfig.seo?.canonicalUrl || "https://customframesizes.com"}/bouquet-frames`,
    },
  ],
};

const benefits = [
  {
    icon: Shield,
    title: "Extra-Deep Frames",
    desc: '2" usable depth accommodates full wedding bouquets without crushing delicate petals. Perfect for roses, peonies, and dimensional arrangements.',
  },
  {
    icon: Sparkles,
    title: "Framer's Grade Acrylic",
    desc: "Helps prevent fading and yellowing of dried flowers. Crystal-clear acrylic lets you see every petal while protecting your bouquet.",
  },
  {
    icon: Award,
    title: "Archival Preservation",
    desc: "Professional-grade backing keeps dried flowers safe for years. Archival materials help prevent wear and aging over time.",
  },
  {
    icon: Calendar,
    title: "Custom Sizing",
    desc: "Fits any bouquet arrangement from petite nosegays to cascading statement pieces. Enter your exact dimensions for a perfect fit.",
  },
  {
    icon: Heart,
    title: "Three Elegant Finishes",
    desc: "Choose white (most popular for weddings), matte black (dramatic contrast), or walnut brown (rustic warmth).",
  },
  {
    icon: Flower2,
    title: "Heirloom Quality",
    desc: "Display alongside wedding photos in your home and pass down through generations as a tangible memory of your special day.",
  },
];

export default function BouquetFramesPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Flower2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Wedding Preservation</span>
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
              data-testid="heading-hero"
            >
              Preserved Bouquet Frames
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Deep bouquet frames designed specifically for displaying preserved wedding bouquets
              and bridal flowers. Professional-grade materials ensure your flowers stay vibrant for
              decades.
            </p>
            <ScrollToDesignerButton />
          </div>
        </section>

        {/* Key Features Bar (matches original KeyFeaturesBar) */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center" data-testid="feature-custom-size">
                <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Custom Sizes</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Built to Fit Your Exact Art
                </p>
              </div>
              <div className="text-center" data-testid="feature-handcrafted">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Handcrafted</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Skilled Artisans Build Every Frame
                </p>
              </div>
              <div className="text-center" data-testid="feature-professional-grade">
                <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Frame Shop Quality
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  To Protect Your Items
                </p>
              </div>
              <div className="text-center" data-testid="feature-instant-pricing">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Instant Pricing
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  See Your Cost as You Customize
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Designer */}
        <section
          id="bouquet-designer"
          className="container mx-auto px-4 py-8 md:py-12 scroll-mt-20"
        >
          <div className="scroll-mt-20" data-testid="designer-section">
            <BouquetFrameDesigner embedded initialConfig={BOUQUET_INITIAL_CONFIG} />
          </div>
        </section>

        {/* Benefits */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold mb-8 text-center"
              data-testid="heading-benefits"
            >
              Why Frame Your Preserved Bouquet
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <Card key={i} className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Common Sizes */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Common Bouquet Frame Sizes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Small Bridal Bouquets</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Hand-tied, nosegay, or petite arrangements
                </p>
                <p className="text-sm font-medium text-primary">11×14&quot; or 16×20&quot;</p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Medium Bouquets</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Classic round or semi-cascading bouquets
                </p>
                <p className="text-sm font-medium text-primary">20×24&quot;</p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Large Cascading Bouquets</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Statement pieces and oversized arrangements
                </p>
                <p className="text-sm font-medium text-primary">24×30&quot; or larger</p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2">Round Toss Bouquets</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Compact round or sphere-shaped bouquets
                </p>
                <p className="text-sm font-medium text-primary">16×16&quot; or 18×18&quot;</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Preservation Tips */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Bouquet Preservation Tips
            </h2>
            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Choose Your Drying Method
                </h3>
                <p className="text-sm text-muted-foreground pl-8">
                  Air dry by hanging upside down in a cool, dark place (2-3 weeks) or use silica gel
                  crystals for faster drying with better color retention (5-7 days).
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Frame Within 2-4 Weeks
                </h3>
                <p className="text-sm text-muted-foreground pl-8">
                  Once dried, frame your bouquet promptly for best color retention. Prolonged
                  exposure to air and light accelerates fading.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  Display Away from Sunlight
                </h3>
                <p className="text-sm text-muted-foreground pl-8">
                  Even with framer&apos;s grade acrylic, avoid hanging in direct sunlight. Choose a
                  wall with indirect light for the longest-lasting color.
                </p>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  Consider Professional Services
                </h3>
                <p className="text-sm text-muted-foreground pl-8">
                  For complex arrangements or maximum longevity, professional preservation services
                  use freeze-drying and specialized techniques. Our frames work perfectly with DIY
                  or professional preservation.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Frame Your Bouquet?</h2>
            <p className="text-muted-foreground mb-6">
              Choose your size and finish. Get instant pricing.
            </p>
            <Button size="lg" asChild>
              <Link href="#bouquet-designer">
                <ArrowDown className="w-4 h-4 mr-2" />
                Start Designing
              </Link>
            </Button>
          </div>
        </section>

        <RelatedProducts
          productKeys={[
            "wedding-invitation",
            "signature-frames",
            "picture-frames",
            "collage-frames",
          ]}
          columns={4}
        />
      </div>
    </>
  );
}
