import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import { Box, Star, ArrowRight, Trophy, Medal, Heart, Shield, Maximize, Award } from "lucide-react";
import { getFrameStyles, getStoreBaseAssetUrl } from "@framecraft/core";
import { brandConfig } from "../../brand.config";
import type { FrameStyle } from "@framecraft/types";
import { ScrollToDesignerButton } from "./scroll-button";

const ShadowboxDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.ShadowboxDesigner),
  { ssr: false }
);

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Custom Shadowbox Frames - 3D Display & Deep Frames | ${brandConfig.name}`,
  description:
    "Custom shadowbox frames for memorabilia, jerseys, medals and 3D objects. Multiple styles, depths (0.875-2.5 in), 4x4 to 32x40. Instant pricing, museum quality.",
  keywords:
    "custom shadowbox frames, deep shadowbox, shadowbox display, jersey frame, medal display, 3D picture frames, memorabilia frames, shadow box custom size",
  openGraph: {
    title: "Custom Shadowbox Frames - 3D Display & Deep Frames",
    description:
      "Custom shadowbox frames for memorabilia, jerseys, medals and 3D objects. Multiple styles and depths. Professional-grade materials with instant pricing.",
    type: "website",
  },
};

function getCornerImage(frame: FrameStyle) {
  const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
  if (cornerImage) {
    const localPath = cornerImage.url.startsWith("/") ? cornerImage.url.slice(1) : cornerImage.url;
    return { url: getStoreBaseAssetUrl(localPath), alt: cornerImage.alt };
  }
  const localPath = (frame.thumbnail ?? "").startsWith("/")
    ? (frame.thumbnail ?? "").slice(1)
    : frame.thumbnail;
  return {
    url: getStoreBaseAssetUrl(localPath ?? ""),
    alt: `${frame.name} frame corner detail`,
  };
}

/** Shuffle array and return first n items (Fisher-Yates). Used so featured frames rotate on each page load. */
function pickRandom<T>(array: T[], n: number): T[] {
  if (array.length <= n) return [...array];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

export default function ShadowboxPage() {
  const allShadowboxFrames = getFrameStyles().filter(
    (f) => f.category === "shadowbox"
  ) as FrameStyle[];
  const featuredFrames = pickRandom(allShadowboxFrames, 3);
  const baseUrl = brandConfig.seo?.canonicalUrl || "https://customframesizes.com";

  const priceValidUntil = new Date();
  priceValidUntil.setDate(priceValidUntil.getDate() + 30);
  const priceValidUntilStr = priceValidUntil.toISOString().split("T")[0];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Custom Shadowbox Frames - Deep Display Frames for 3D Objects",
    description:
      "Professional custom shadowbox frames with multiple frame styles and depth options. Custom sizing from 4×4 to 32×40 inches for memorabilia, jerseys, medals, and 3D objects with professional-grade materials.",
    brand: { "@type": "Brand", name: brandConfig.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "55.00",
      highPrice: "165.00",
      priceValidUntil: priceValidUntilStr,
      offerCount: allShadowboxFrames.length,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "287",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a shadowbox frame?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A shadowbox frame is a deep display frame designed to showcase three-dimensional objects rather than flat artwork. Unlike standard picture frames with 0.25-0.5 inch depth, shadowbox frames provide 0.875 to 2.5 inches of usable depth, creating space between the glazing and backing. This depth accommodates dimensional items like sports jerseys, military medals, collectibles, preserved flowers, and memorabilia while protecting them behind acrylic or glass glazing.",
        },
      },
      {
        "@type": "Question",
        name: "How much depth do I need for my items?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Depth selection depends on your item's thickness. Standard shadowbox frames (0.875-1.0 inch usable depth) accommodate flat collectibles, coins, thin medals, photos with thick mats, and lightweight memorabilia. Deep shadowbox frames (1.25-1.5 inch usable depth) are required for jerseys, thick military medals, championship belts, preserved bouquets, and bulky three-dimensional objects. Measure your item's thickest point and add 0.25 inches clearance to determine minimum required depth.",
        },
      },
      {
        "@type": "Question",
        name: "What items work best in shadowbox frames?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shadowbox frames excel at displaying sports memorabilia (jerseys, signed balls, medals), military honors (service medals, badges, ribbons, challenge coins), collectibles (coins, stamps, vintage items, autographs), wedding keepsakes (preserved flowers, invitations), baby memorabilia (hospital bracelets, first shoes), achievement awards, family heirlooms, and concert tickets.",
        },
      },
      {
        "@type": "Question",
        name: "How much do custom shadowbox frames cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Custom shadowbox frame pricing ranges from approximately $55 to $165 depending on size, depth, and frame style. Our interactive designer provides instant pricing based on your exact specifications.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between shadowbox and regular frames?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shadowbox frames feature significantly greater depth (0.875-2.5 inches usable) compared to regular picture frames (0.25-0.5 inches). This depth accommodates three-dimensional objects, while regular frames hold only flat artwork, photos, or prints.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Shadowbox Frames", item: `${baseUrl}/shadowbox` },
    ],
  };

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
              <Box className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Deep Display Frames for 3D Objects
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
              data-testid="heading-hero"
            >
              Custom Shadowbox Frames
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Professional shadowbox frames for displaying memorabilia, jerseys, medals, and
              dimensional objects. Choose your exact size, frame style, and depth.
            </p>
            <ScrollToDesignerButton />
          </div>
        </section>

        {/* Featured Shadowbox Frames */}
        {allShadowboxFrames.length > 0 && (
          <section className="container mx-auto px-4 py-12 md:py-16 border-t">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Featured Shadowboxes</span>
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold"
                  data-testid="heading-signature-collection"
                >
                  Premium Deep Display Collection
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredFrames.map((frame) => {
                  const cornerImg = getCornerImage(frame);
                  return (
                    <Link
                      key={frame.id}
                      href={`/shadowbox/${frame.id}`}
                      className="group relative overflow-hidden rounded-lg border-2 border-primary/20 bg-gradient-to-br from-card to-muted/20 hover-elevate active:elevate-2 transition-all block"
                      data-testid={`featured-frame-${frame.id}`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20">
                        {cornerImg.url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={cornerImg.url}
                            alt={cornerImg.alt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Box className="w-16 h-16 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2">{frame.name}</h3>
                        {frame.featuredDescription && (
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                            {frame.featuredDescription}
                          </p>
                        )}
                        <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground w-full">
                          Design Your Frame
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Browse All Shadowbox Styles */}
        <section className="container mx-auto px-4 py-8 md:py-12 border-t">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                data-testid="heading-all-shadowboxes"
              >
                Browse All Shadowbox Styles
              </h2>
              <p className="text-muted-foreground">
                Choose from our complete collection of custom shadowbox frames for dimensional
                displays
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allShadowboxFrames.map((frame) => {
                const cornerImg = getCornerImage(frame);
                return (
                  <Link
                    key={frame.id}
                    href={`/shadowbox/${frame.id}`}
                    className="group relative overflow-hidden rounded-lg border bg-card hover-elevate active:elevate-2 transition-all block"
                    data-testid={`shadowbox-${frame.id}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/20">
                      {cornerImg.url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cornerImg.url}
                          alt={cornerImg.alt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: `${frame.borderColor}20` }}
                        >
                          <div
                            className="w-20 h-20 rounded-full border-8 opacity-30"
                            style={{ borderColor: frame.borderColor }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors mb-1">
                        {frame.name}
                      </h3>
                      {frame.shortDescription && (
                        <p
                          className="text-xs text-muted-foreground/80 italic mb-2"
                          data-testid="text-shadowbox-short-description"
                        >
                          {frame.shortDescription}
                        </p>
                      )}
                      {frame.usableDepth && (
                        <p className="text-xs font-medium text-primary">
                          {frame.usableDepth}&quot; depth
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Shadowbox Designer */}
        <div
          className="container mx-auto px-4 py-8 border-t scroll-mt-20"
          id="design-tool"
          data-designer-anchor
          data-testid="designer-section"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Custom Shadowbox Designer</h2>
            <p className="text-muted-foreground">
              Design your perfect shadowbox frame with real-time pricing
            </p>
          </div>
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

        {/* Use Cases */}
        <section className="container mx-auto px-4 py-12 border-t" data-testid="section-use-cases">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2
                className="text-2xl md:text-3xl font-bold mb-3"
                data-testid="text-use-cases-title"
              >
                Professional Shadowbox Applications for Memorabilia &amp; 3D Objects
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                className="text-center p-6 rounded-lg border bg-card hover-elevate"
                data-testid="card-use-case-1"
              >
                <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Sports Memorabilia</h3>
                <p className="text-sm text-muted-foreground">
                  Jerseys, signed balls, championship medals, team photos
                </p>
              </div>
              <div
                className="text-center p-6 rounded-lg border bg-card hover-elevate"
                data-testid="card-use-case-2"
              >
                <Medal className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Military Honors</h3>
                <p className="text-sm text-muted-foreground">
                  Service medals, badges, insignia, ribbons, challenge coins
                </p>
              </div>
              <div
                className="text-center p-6 rounded-lg border bg-card hover-elevate"
                data-testid="card-use-case-3"
              >
                <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Collectibles</h3>
                <p className="text-sm text-muted-foreground">
                  Coins, stamps, vintage items, concert tickets, autographs
                </p>
              </div>
              <div
                className="text-center p-6 rounded-lg border bg-card hover-elevate"
                data-testid="card-use-case-4"
              >
                <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Keepsakes</h3>
                <p className="text-sm text-muted-foreground">
                  Wedding flowers, baby items, achievement awards, family heirlooms
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Introduction */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Professional Custom Shadowbox Framing for Dimensional Displays
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                  <p>
                    Shadowbox frames provide specialized display solutions for three-dimensional
                    objects that standard picture frames cannot accommodate. With depth capacity
                    ranging from 0.875 to 2.5 inches, shadowbox frames create protective space
                    between glazing and backing materials, allowing jerseys, medals, collectibles,
                    and memorabilia to be displayed without compression or damage. Unlike
                    traditional frames limited to flat artwork, shadowbox construction incorporates
                    deeper moulding profiles with expanded rabbet measurements specifically
                    engineered for dimensional objects.
                  </p>
                  <p>
                    Professional shadowbox framing combines structural depth with preservation-grade
                    materials. Professional-grade acrylic glazing protects items from dust and
                    handling while maintaining optical clarity superior to standard glass. Custom
                    sizing from 4×4 to 32×40 inches ensures proper proportions for individual
                    medals, championship jerseys, collectible displays, and wedding memorabilia.
                    Solid wood construction with reinforced corner joinery supports heavier objects,
                    while optional mat board configurations create visual separation and
                    professional presentation standards essential for valuable collections and
                    irreplaceable keepsakes.
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getStoreBaseAssetUrl("frames/8446/lifestyle_2.jpg")}
                  alt="Professional shadowbox frame displaying three-dimensional memorabilia with proper depth and professional-grade materials"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications & Applications */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Custom Shadowbox Frame Specifications &amp; Applications
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Professional Applications</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Sports Display:</strong> Championship
                    jerseys, signed memorabilia, medals, and team photographs require shadowbox
                    depth for proper presentation. Standard 0.875-1.25&quot; depth accommodates
                    folded jerseys and thick medal collections, while 2.0-2.5&quot; profiles handle
                    bulky items like championship belts and autographed equipment.
                  </p>
                  <p>
                    <strong className="text-foreground">Military Recognition:</strong> Service
                    medals, ribbons, badges, and insignia deserve professional display honoring
                    achievement. Shadowbox frames provide secure mounting for dimensional military
                    items while protecting against dust and deterioration with professional-grade
                    glazing.
                  </p>
                  <p>
                    <strong className="text-foreground">Wedding Keepsakes:</strong> Preserved
                    bouquets, invitations, photographs, and wedding accessories create cherished
                    displays. Deep shadowbox capacity accommodates dried flowers, dimensional
                    embellishments, and multi-layered arrangements requiring 1.5-2.5&quot; depth.
                  </p>
                  <p>
                    <strong className="text-foreground">Collectible Preservation:</strong> Coins,
                    stamps, vintage tickets, autographs, and memorabilia benefit from shadowbox
                    protection. Individual compartments created with mat board inserts organize
                    collections while maintaining visual hierarchy and professional presentation.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Depth Options:</strong> Standard shadowbox
                    frames (0.875-1.0&quot;) suit flat collectibles and lightweight items. Deep
                    profiles (1.25-1.5&quot;) accommodate jerseys and thick medals. Extra-deep
                    configurations (2.0-2.5&quot;) handle bulky objects, preserved flowers, and
                    multi-dimensional displays.
                  </p>
                  <p>
                    <strong className="text-foreground">Size Range:</strong> 4×4 inches minimum to
                    32×40 inches maximum with 1/16-inch precision. Small formats (8×10 to 11×14)
                    suit individual medals and collectibles. Medium sizes (16×20 to 20×24)
                    accommodate jerseys and multi-item displays. Large formats (24×36 to 32×40)
                    provide gallery-scale presentation.
                  </p>
                  <p>
                    <strong className="text-foreground">Moulding Profiles:</strong> Width ranges
                    from 0.75 to 1.5 inches. Narrow profiles (0.75-1.0&quot;) suit contemporary
                    minimalist displays. Wide mouldings (1.25-1.5&quot;) provide traditional
                    shadowbox presence and structural support for heavier items.
                  </p>
                  <p>
                    <strong className="text-foreground">Material Standards:</strong> Solid wood
                    construction prevents warping. Professional-grade acrylic glazing provides
                    impact resistance and UV protection. Archival backing materials prevent acid
                    migration. Professional mounting techniques ensure secure display without
                    damaging collectibles.
                  </p>
                </div>
              </div>
            </div>
            {/* Lifestyle Image */}
            <div className="rounded-lg overflow-hidden max-w-3xl mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getStoreBaseAssetUrl("frames/8446/lifestyle_7.jpg")}
                alt="Custom shadowbox frames displaying dimensional memorabilia in professional gallery arrangement"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Custom Shadowbox Frame Questions
            </h2>
            <div className="grid md:grid-cols-[1fr,320px] gap-8 items-start">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What is a shadowbox frame?</h3>
                  <p className="text-muted-foreground">
                    A shadowbox frame is a deep display frame designed to showcase three-dimensional
                    objects rather than flat artwork. Unlike standard picture frames with 0.25-0.5
                    inch depth, shadowbox frames provide 0.875 to 2.5 inches of usable depth,
                    creating space between the glazing and backing. This depth accommodates
                    dimensional items like sports jerseys, military medals, collectibles, preserved
                    flowers, and memorabilia while protecting them behind acrylic or glass glazing.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    How much depth do I need for my items?
                  </h3>
                  <p className="text-muted-foreground">
                    Depth selection depends on your item&apos;s thickness. Standard shadowbox frames
                    (0.875-1.0 inch usable depth) accommodate flat collectibles, coins, thin medals,
                    photos with thick mats, and lightweight memorabilia. Deep shadowbox frames
                    (1.25-1.5 inch usable depth) are required for jerseys, thick military medals,
                    and bulky objects. Extra-deep profiles (2.0-2.5 inches) handle championship
                    belts, preserved bouquets, and multi-dimensional displays. Measure your
                    item&apos;s thickest point and add 0.25 inches clearance to determine minimum
                    required depth.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    What items work best in shadowbox frames?
                  </h3>
                  <p className="text-muted-foreground">
                    Shadowbox frames excel at displaying sports memorabilia (jerseys, signed balls,
                    medals), military honors (service medals, badges, ribbons, challenge coins),
                    collectibles (coins, stamps, vintage items, autographs), wedding keepsakes
                    (preserved flowers, invitations), baby memorabilia (hospital bracelets, first
                    shoes), achievement awards, family heirlooms, and concert tickets. Items should
                    be lightweight enough for secure mounting and fit within the depth capacity of
                    your selected frame.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    How much do custom shadowbox frames cost?
                  </h3>
                  <p className="text-muted-foreground">
                    Custom shadowbox frame pricing varies based on size, depth, and frame style.
                    Shadowbox frames cost more than standard picture frames due to deeper moulding
                    profiles and increased material requirements. Small sizes typically start around
                    $55-75, medium sizes range $85-120, and larger sizes cost $120-165 or more. Deep
                    profile frames and premium finishes increase pricing. Our interactive designer
                    provides instant pricing based on your exact specifications, allowing you to
                    compare different frame styles and depths before ordering.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    What&apos;s the difference between shadowbox and regular frames?
                  </h3>
                  <p className="text-muted-foreground">
                    Shadowbox frames feature significantly greater depth (0.875-2.5 inches usable)
                    compared to regular picture frames (0.25-0.5 inches). This depth accommodates
                    three-dimensional objects, while regular frames hold only flat artwork, photos,
                    or prints. Shadowbox frames use deeper moulding profiles with larger rabbet
                    measurements, specialized mounting techniques for dimensional objects, and
                    typically cost 30-50% more due to increased materials and construction
                    complexity. Regular frames are optimal for flat artwork; shadowbox frames are
                    essential for displaying memorabilia and 3D objects.
                  </p>
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-6 sticky top-4">
                <div className="rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getStoreBaseAssetUrl("frames/8446/lifestyle_3.jpg")}
                    alt="Professional shadowbox frame presentation showing professional-grade craftsmanship"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getStoreBaseAssetUrl("frames/8446/lifestyle_4.jpg")}
                    alt="Custom shadowbox frames in modern interior displaying dimensional memorabilia"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getStoreBaseAssetUrl("frames/8446/lifestyle_5.jpg")}
                    alt="Detail view of shadowbox frame corner highlighting precision construction"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learn More */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-learn-more">
                Learn More About Shadowbox Framing
              </h2>
              <p className="text-muted-foreground">
                Explore our comprehensive guides for professional shadowbox techniques and expert
                advice
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/shadowboxes/colors" data-testid="link-colors">
                <div className="p-5 rounded-lg border bg-card hover-elevate active:elevate-2 transition-all cursor-pointer h-full">
                  <Shield className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Shadowbox Colors</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse shadowbox frames by color: black, white, brown, silver, gold, blue, and
                    natural
                  </p>
                </div>
              </Link>
              <Link href="/jersey-frames" data-testid="link-jerseys">
                <div className="p-5 rounded-lg border bg-card hover-elevate active:elevate-2 transition-all cursor-pointer h-full">
                  <Maximize className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Jersey Frames</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep frames and mounting for sports jerseys and team memorabilia
                  </p>
                </div>
              </Link>
              <Link href="/military-frames" data-testid="link-mounting-guide">
                <div className="p-5 rounded-lg border bg-card hover-elevate active:elevate-2 transition-all cursor-pointer h-full">
                  <Award className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Military Frames</h3>
                  <p className="text-sm text-muted-foreground">
                    Shadowbox displays for medals, ribbons, and service memorabilia
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
