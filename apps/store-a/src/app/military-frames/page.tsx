import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import { Award, Clock, CheckCircle, Shield } from "lucide-react";
import { Badge, Card } from "@framecraft/ui";
import { getSharedAssetUrl } from "@framecraft/core/utils/asset-urls";
import { getMilitaryLifestyleImageByNumber } from "@framecraft/core/lib/military-lifestyle-images";
import { brandConfig } from "../../brand.config";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ScrollToDesignerButton } from "./scroll-button";
import { MilitaryLifestyleCarousel } from "@framecraft/ui";
/**
 * Military Frame Designer with branch presets, military layouts, brass nameplate, and hanging hardware.
 */
const MilitaryFrameDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.MilitaryFrameDesigner),
  { ssr: false }
);

export const dynamic = "force-dynamic";

const baseUrl = brandConfig.seo?.canonicalUrl ?? "https://customframesizes.com";

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
    "Professional shadowbox frames for military memorabilia with branch-specific color schemes (Army, Navy, Air Force, Marine Corps, Coast Guard, Space Force), premium suede backing, 2-inch usable depth, and conservation mounting. Designed for medals, ribbons, patches, flags, and photos.",
  category: "Military Memorabilia Framing",
  sku: "MILITARY-FRAME-CUSTOM",
  brand: { "@type": "Brand", name: brandConfig.name },
  image: getSharedAssetUrl("military/lifestyle/lifestyle_01.jpg"),
  url: `${baseUrl}/military-frames`,
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    lowPrice: "129",
    highPrice: "299",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "129",
      maxPrice: "299",
      priceCurrency: "USD",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "312",
    bestRating: "5",
    worstRating: "1",
  },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Frame Depth", value: "2 inches usable depth" },
    { "@type": "PropertyValue", name: "Backing Material", value: "Premium suede in branch colors" },
    {
      "@type": "PropertyValue",
      name: "Mat Configuration",
      value: "Triple mat system with branch-specific colors",
    },
    {
      "@type": "PropertyValue",
      name: "Military Branches",
      value: "Army, Navy, Air Force, Marine Corps, Coast Guard, Space Force",
    },
    { "@type": "PropertyValue", name: "Available Sizes", value: "11×14, 16×20, 20×32 inches" },
    { "@type": "PropertyValue", name: "Production Time", value: "7-10 business days" },
    { "@type": "PropertyValue", name: "Warranty", value: "Lifetime craftsmanship guarantee" },
  ],
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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
    {
      "@type": "ListItem",
      position: 2,
      name: "Military Shadow Box Frames",
      item: `${baseUrl}/military-frames`,
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
  const img12 = getMilitaryLifestyleImageByNumber(12);
  const img27 = getMilitaryLifestyleImageByNumber(27);
  const img08 = getMilitaryLifestyleImageByNumber(8);
  const img35 = getMilitaryLifestyleImageByNumber(35);
  const img42 = getMilitaryLifestyleImageByNumber(42);
  const img18 = getMilitaryLifestyleImageByNumber(18);
  const img50 = getMilitaryLifestyleImageByNumber(50);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section – original */}
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

        {/* Designer Section – original uses MilitaryFrameDesigner embedded */}
        <section id="military-designer" className="py-8 overflow-visible">
          <div className="container mx-auto px-4 overflow-visible">
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
                <MilitaryFrameDesigner embedded />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Lifestyle Gallery Section – original: Real Military Display Examples + MilitaryLifestyleCarousel */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">
                Real Military Display Examples
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
                See how veterans display their medals, ribbons, patches, flags, and photos in our
                shadow boxes. Each frame features branch-specific colors and 2-inch depth.
              </p>
              <MilitaryLifestyleCarousel />
            </div>
          </div>
        </section>

        {/* Trust & Quality Section – original copy (incl. “Our materials meet professional framing standards.”) */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Why Veterans Trust Custom Frame Sizes
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Professional Quality</h3>
                  <p className="text-muted-foreground">
                    We use archival mats and framer&apos;s grade acrylic to protect your medals and
                    ribbons. Our materials meet professional framing standards.
                  </p>
                </div>
                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Clock className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fast Production</h3>
                  <p className="text-muted-foreground">
                    Your frame ships in 7-10 business days. We build each shadow box by hand with
                    your chosen mat colors and size.
                  </p>
                </div>
                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-12 h-12 text-primary" />
                  </div>
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

        {/* How It Works Section – full original content and inline images */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How Military Shadow Boxes Work
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-6">
                  Our shadow boxes hold your medals, ribbons, patches, and photos with 2-inch depth.
                  You get a DIY frame that arrives ready to fill. Pick your service branch colors
                  and size in our designer tool above.
                </p>

                <h3 className="text-2xl font-semibold mb-4 mt-8">
                  2-Inch Depth Holds Your Medals and Ribbons
                </h3>
                <p className="text-muted-foreground mb-4">
                  Shadow boxes need depth to hold medals without squashing them. Our frames give you
                  2 full inches of space inside. This lets you pin medals and ribbons without
                  touching the glass.
                </p>
                <p className="text-muted-foreground mb-6">
                  Each frame uses 1-inch wide real wood in your choice of finish. Learn more about
                  our{" "}
                  <Link href="/shadowboxes/colors" className="text-primary hover:underline">
                    shadowbox frame styles
                  </Link>{" "}
                  and sizes.
                </p>
                <div className="my-8 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img12.url}
                    alt="Military shadow box displaying medals, ribbons, and patches with premium suede backing"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-2xl font-semibold mb-4 mt-8">
                  Branch-Specific Colors for Every Service
                </h3>
                <p className="text-muted-foreground mb-4">
                  Pick your branch to get matching military colors. We offer Army, Navy, Air Force,
                  Marine Corps, Coast Guard, and Space Force color sets. You select three colors:
                  top mat, bottom mat, and suede backing.
                </p>
                <p className="text-muted-foreground mb-6">
                  All mats are archival to protect your medals long-term. See all our{" "}
                  <Link href="/designer" className="text-primary hover:underline">
                    custom mat colors
                  </Link>{" "}
                  for more options.
                </p>
                <div className="my-8 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img27.url}
                    alt="Branch-specific military display with coordinated mat colors and service memorabilia"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Premium Suede Backing</h3>
                <p className="text-muted-foreground mb-4">
                  The back of your shadow box uses soft suede fabric instead of plain cardboard.
                  Suede looks better and holds pins securely. It comes in colors that match each
                  military branch.
                </p>
                <p className="text-muted-foreground mb-6">
                  Suede won&apos;t damage medals or ribbons. The texture helps pins stay in place
                  without sliding.
                </p>
                <div className="my-8 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img08.url}
                    alt="Premium suede backing in military shadow box frame with medals and ribbons"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-2xl font-semibold mb-4 mt-8">
                  Three Sizes for Different Displays
                </h3>
                <p className="text-muted-foreground mb-4">
                  Compact (11×14 inches) fits ribbons and small medal sets. Standard (16×20 inches)
                  holds multiple medals, ribbons, patches, and photos. Large (20×32 inches) fits
                  folded flags, complete medal sets, and large photo collections.
                </p>
                <div className="my-8 grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img35.url}
                      alt="Compact military shadow box with ribbons and medals"
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img42.url}
                      alt="Large military shadow box displaying folded flag with medals and photos"
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-semibold mb-4 mt-8">How to Mount Your Medals</h3>
                <p className="text-muted-foreground mb-4">
                  Use pins to attach medals through the suede backing. Never use glue or tape on
                  medals or ribbons. Pins let you remove items later without damage.
                </p>
                <p className="text-muted-foreground mb-6">
                  For photos, use corner mounts that don&apos;t touch the photo surface. This
                  protects your pictures and lets you remove them if needed.
                </p>
                <div className="my-8 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img18.url}
                    alt="Professional conservation mounting of military medals and photos in shadow box"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-2xl font-semibold mb-4 mt-8">
                  Keeping Your Display Looking Good
                </h3>
                <p className="text-muted-foreground mb-4">
                  Keep your shadow box away from direct sun and damp areas. UV glass helps protect
                  ribbons from fading. Clean the glass once a year with a soft cloth.
                </p>
                <div className="my-8 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img50.url}
                    alt="Well-maintained military shadow box display with preserved medals and memorabilia"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Military-Inspired Mat Color Palettes – original section title in code; visible: Branch-Specific Color Options */}
        <section className="py-12 bg-muted/30">
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

        {/* Related Products – original has no Final CTA before this */}
        <RelatedProducts
          productKeys={["jersey-frames", "signature-frames", "diploma-frames", "picture-frames"]}
          columns={4}
        />
      </div>
    </>
  );
}
