import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import { Award, Clock, CheckCircle, Shield } from "lucide-react";
import { Badge, Card } from "@framecraft/ui";
import { getStoreBaseAssetUrl } from "@framecraft/core";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ScrollToDesignerButton } from "./scroll-button";

const ShadowboxDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.ShadowboxDesigner),
  { ssr: false }
);

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Military Shadow Box Frames | Custom Memorabilia Display Cases for Medals, Ribbons & Flags",
  description:
    "Design custom military shadow boxes with branch-specific colors. Frame medals, ribbons, patches, and flags with 2-inch depth and premium suede backing. Available for Army, Navy, Air Force, Marines, Coast Guard, and Space Force.",
  openGraph: {
    title:
      "Military Shadow Box Frames | Custom Memorabilia Display Cases for Medals, Ribbons & Flags",
    description:
      "Professional military shadow box frames with branch-specific colors, conservation mounting, and 2-inch depth. Display medals, ribbons, patches, flags, and photos with premium suede backing.",
    type: "website",
    url: "/military-frames",
  },
  alternates: { canonical: "/military-frames" },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Military Shadow Box Frames",
  description:
    "Professional shadowbox frames for military memorabilia with branch-specific color schemes (Army, Navy, Air Force, Marine Corps, Coast Guard, Space Force), premium suede backing, 2-inch usable depth, and conservation mounting.",
  category: "Military Memorabilia Framing",
  sku: "MILITARY-FRAME-CUSTOM",
  brand: { "@type": "Brand", name: "Custom Frame Sizes" },
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    lowPrice: "129",
    highPrice: "299",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "312",
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
      name: "What depth shadowbox do I need for military medals and ribbons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You need 2 inches of depth to hold medals and ribbons without squashing them. Our shadow boxes give you 2 full inches inside. This lets you pin medals without touching the glass.",
      },
    },
    {
      "@type": "Question",
      name: "Can I customize mat colors to match my military branch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Pick your service branch to get matching colors for Army, Navy, Air Force, Marine Corps, Coast Guard, or Space Force. You choose three colors: top mat, bottom mat, and suede backing. All mats are archival to protect your medals.",
      },
    },
    {
      "@type": "Question",
      name: "What sizes are available for military shadow box frames?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer three sizes. Compact (11×14 inches) fits ribbons and small medal sets. Standard (16×20 inches) holds multiple medals, ribbons, patches, and photos. Large (20×32 inches) fits folded flags and complete medal collections.",
      },
    },
    {
      "@type": "Question",
      name: "What is suede backing and why is it used for military frames?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Suede is soft fabric used as the background in your shadow box. It looks better than cardboard and holds pins securely. Suede comes in colors that match each military branch.",
      },
    },
    {
      "@type": "Question",
      name: "How do I mount medals and ribbons in the shadow box?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use pins to attach medals through the suede backing. Never use glue or tape on medals or ribbons. Pins let you remove items later without damage. The 2-inch depth gives you plenty of room for pins.",
      },
    },
    {
      "@type": "Question",
      name: "Are these frames suitable for displaying folded flags?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our Large (20×32 inch) shadow box fits standard burial flags when folded. The 2-inch depth holds the flag thickness. The Standard (16×20 inch) size works for smaller flags.",
      },
    },
  ],
};

const branches = [
  { name: "Army", desc: "Army Green, Black, and Gold colors match Army heritage." },
  { name: "Navy", desc: "Navy Blue, Gold, and White colors for naval tradition." },
  { name: "Air Force", desc: "Air Force Blue, Silver, and White for aviation service." },
  { name: "Marine Corps", desc: "Scarlet, Gold, and Forest Green for Marine tradition." },
  { name: "Coast Guard", desc: "Coast Guard Blue, White, and Orange for maritime service." },
  { name: "Space Force", desc: "Space Force Blue, Silver, and White for space operations." },
];

export default function MilitaryFramesPage() {
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
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-background to-muted py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4" data-testid="badge-category">
                <Award className="w-3 h-3 mr-1" />
                Military Shadowbox Frames
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                DIY Military Shadow Boxes
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Shadow boxes built for displaying military medals and ribbons. Frame your service
                items with branch-inspired mat colors and premium suede backing.
              </p>
              <ScrollToDesignerButton />
            </div>
          </div>
        </section>

        {/* Designer */}
        <section id="military-designer" className="py-8 scroll-mt-20">
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
                <ShadowboxDesigner />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Lifestyle / gallery */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">
                Real Military Display Examples
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-center">
                See how veterans display their medals, ribbons, patches, flags, and photos in our
                shadow boxes. Each frame features branch-specific colors and 2-inch depth. Choose
                your branch in the designer to get matching mat and backing colors for Army, Navy,
                Air Force, Marine Corps, Coast Guard, and Space Force.
              </p>
              <div className="rounded-lg border bg-card overflow-hidden max-w-4xl mx-auto">
                <div className="aspect-[16/10] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getStoreBaseAssetUrl("frames/10478/lifestyle_1.jpg")}
                    alt="Military shadow box display with medals and ribbons in branch-specific mat colors, 2-inch depth frame"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Why Veterans Trust Custom Frame Sizes
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-card rounded-lg border p-6 text-center">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Professional Quality</h3>
                  <p className="text-muted-foreground">
                    We use archival mats and framer&apos;s grade acrylic to protect your medals and
                    ribbons.
                  </p>
                </div>
                <div className="bg-card rounded-lg border p-6 text-center">
                  <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Fast Production</h3>
                  <p className="text-muted-foreground">
                    Your frame ships in 7-10 business days. We build each shadow box by hand with
                    your chosen mat colors and size.
                  </p>
                </div>
                <div className="bg-card rounded-lg border p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Lifetime Guarantee</h3>
                  <p className="text-muted-foreground">
                    We guarantee our work for life. If anything breaks or fails, we fix or replace
                    it at no cost to you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works - condensed */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How Military Shadow Boxes Work
              </h2>
              <p className="text-muted-foreground mb-6">
                Our shadow boxes hold your medals, ribbons, patches, and photos with 2-inch depth.
                You get a DIY frame that arrives ready to fill. Pick your service branch colors and
                size in our designer tool above.
              </p>
              <h3 className="text-2xl font-semibold mb-4">
                2-Inch Depth Holds Your Medals and Ribbons
              </h3>
              <p className="text-muted-foreground mb-6">
                Shadow boxes need depth to hold medals without squashing them. Our frames give you 2
                full inches of space inside. This lets you pin medals and ribbons without touching
                the glass.
              </p>
              <h3 className="text-2xl font-semibold mb-4">Branch-Specific Colors</h3>
              <p className="text-muted-foreground mb-6">
                Pick your branch to get matching military colors. We offer Army, Navy, Air Force,
                Marine Corps, Coast Guard, and Space Force color sets. You select three colors: top
                mat, bottom mat, and suede backing. All mats are archival.
              </p>
              <h3 className="text-2xl font-semibold mb-4">Three Sizes</h3>
              <p className="text-muted-foreground">
                Compact (11×14 inches) fits ribbons and small medal sets. Standard (16×20 inches)
                holds multiple medals, ribbons, patches, and photos. Large (20×32 inches) fits
                folded flags and complete medal collections.
              </p>
            </div>
          </div>
        </section>

        {/* Branch colors */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                Branch-Specific Color Options
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Each service branch has coordinating colors to match your medals and ribbons.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {branches.map((b) => (
                  <Card key={b.name} className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{b.name}</h3>
                    <p className="text-muted-foreground text-sm">{b.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <RelatedProducts
          productKeys={["jersey-frames", "signature-frames", "diploma-frames", "picture-frames"]}
          columns={4}
        />
      </div>
    </>
  );
}
