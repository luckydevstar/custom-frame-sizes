import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, Badge } from "@framecraft/ui";
import { FrameDesigner } from "@framecraft/ui";
import {
  STYLE_METADATA,
  getFramesForStyle,
  getFrameStyles,
  getStyleHeroImage,
  getStyleLifestyleImages,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import { brandConfig } from "../../../../brand.config";

const frames = getFrameStyles();

type Props = { params: Promise<{ slug: string }> };

const RELATED_STYLES_COUNT = 3;

type RelatedStyleEntry = {
  styleName: string;
  displayName: string;
  slug: string;
  hex: string;
  description: string;
  designStyle: string;
  bestFor: string[];
};

function getRelatedStyles(styleName: string): RelatedStyleEntry[] {
  const relatedMap: Record<string, string[]> = {
    Modern: ["Minimalist", "Gallery", "Classic"],
    Rustic: ["Natural", "Classic", "Vintage"],
    Classic: ["Gallery", "Natural", "Modern"],
    Gallery: ["Modern", "Minimalist", "Classic"],
    Vintage: ["Ornate", "Classic", "Rustic"],
    Natural: ["Rustic", "Minimalist", "Classic"],
    Minimalist: ["Modern", "Gallery", "Natural"],
    Ornate: ["Vintage", "Gallery", "Classic"],
  };
  const related = relatedMap[styleName] ?? ["Modern", "Classic", "Gallery"];
  const available = new Set(Object.keys(STYLE_METADATA));

  const fromRelated: RelatedStyleEntry[] = related
    .filter((name) => available.has(name) && name !== styleName)
    .slice(0, RELATED_STYLES_COUNT)
    .map((name) => {
      const meta = STYLE_METADATA[name]!;
      return {
        styleName: name,
        displayName: meta.displayName,
        slug: meta.slug,
        hex: meta.hex,
        description: meta.description,
        designStyle: meta.designStyle,
        bestFor: meta.bestFor,
      };
    });

  if (fromRelated.length >= RELATED_STYLES_COUNT) return fromRelated;

  const rest: RelatedStyleEntry[] = (Object.keys(STYLE_METADATA) as (keyof typeof STYLE_METADATA)[])
    .filter((name) => name !== styleName && !fromRelated.some((s) => s.styleName === name))
    .slice(0, RELATED_STYLES_COUNT - fromRelated.length)
    .map((name) => {
      const meta = STYLE_METADATA[name]!;
      return {
        styleName: name,
        displayName: meta.displayName,
        slug: meta.slug,
        hex: meta.hex,
        description: meta.description,
        designStyle: meta.designStyle,
        bestFor: meta.bestFor,
      };
    });

  return [...fromRelated, ...rest].slice(0, RELATED_STYLES_COUNT);
}

function resolveImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  const path = url.startsWith("/") ? url.slice(1) : url;
  return getStoreBaseAssetUrl(path);
}

export function generateStaticParams() {
  return Object.values(STYLE_METADATA).map((data) => ({ slug: data.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = Object.entries(STYLE_METADATA).find(([, data]) => data.slug === slug);
  if (!entry) return { title: "Style Not Found" };
  const [, styleData] = entry;
  return {
    title: `${styleData.displayName} Frames - Custom Sizes | ${brandConfig.name}`,
    description: `Shop ${styleData.displayName} picture frames in custom sizes 4×4 to 48×72 inches. ${styleData.description} Expert craftsmanship with instant pricing.`,
    openGraph: {
      title: `${styleData.displayName} Picture Frames - Custom Sizes`,
      description: styleData.description,
      type: "website",
    },
  };
}

export default async function StyleDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = Object.entries(STYLE_METADATA).find(([, data]) => data.slug === slug);
  if (!entry) notFound();

  const [styleName, styleData] = entry;
  const styleFrames = getFramesForStyle(
    styleName,
    frames as Parameters<typeof getFramesForStyle>[1]
  );
  const baseUrl = brandConfig.seo?.canonicalUrl || "https://customframesizes.com";

  const featuredFrame =
    styleFrames.length > 0
      ? styleFrames.reduce((prev, current) =>
          ((current as { pricePerInch?: number }).pricePerInch ?? 0) >
          ((prev as { pricePerInch?: number }).pricePerInch ?? 0)
            ? current
            : prev
        )
      : null;
  const otherFrames = styleFrames.filter((f) => f.id !== featuredFrame?.id);

  const heroImage = getStyleHeroImage(styleName, frames as Parameters<typeof getStyleHeroImage>[1]);
  const lifestyleImagesRaw = getStyleLifestyleImages(
    styleName,
    frames as Parameters<typeof getStyleLifestyleImages>[1]
  );
  const lifestyleImages = lifestyleImagesRaw.map((img) => ({
    url: resolveImageUrl(img.url),
    alt: img.alt,
  }));
  const heroImageResolved = heroImage
    ? { url: resolveImageUrl(heroImage.url), alt: heroImage.alt }
    : null;

  const relatedStyles = getRelatedStyles(styleName);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Frames by Style",
        item: `${baseUrl}/frames/styles`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${styleData.displayName} Frames`,
        item: `${baseUrl}/frames/styles/${styleData.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What makes a frame ${styleData.displayName.toLowerCase()} style?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${styleData.displayName} frames feature ${styleData.designStyle.toLowerCase()} characteristics. They work best with ${styleData.bestFor.slice(0, 2).join(" and ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I get ${styleData.displayName.toLowerCase()} frames in custom sizes?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, all ${styleData.displayName.toLowerCase()} frames are available in custom sizes from 4×4 to 48×72 inches. Enter your exact dimensions in our designer for instant pricing.`,
        },
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${styleData.displayName} Picture Frames`,
    description: `Browse ${styleData.displayName.toLowerCase()} style custom picture frames. ${styleData.description} Custom sizes from 4×4 to 48×72 inches.`,
    url: `${baseUrl}/frames/styles/${styleData.slug}`,
    inLanguage: "en-US",
  };

  function getCornerImage(frame: (typeof styleFrames)[0]) {
    const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
    if (cornerImage) {
      const path = cornerImage.url.startsWith("/") ? cornerImage.url.slice(1) : cornerImage.url;
      return { url: getStoreBaseAssetUrl(path), alt: cornerImage.alt };
    }
    const thumb = frame.thumbnail ?? "";
    const path = thumb.startsWith("/") ? thumb.slice(1) : thumb;
    return {
      url: getStoreBaseAssetUrl(path || "frames/8446/lifestyle_1.jpg"),
      alt: `${frame.name} Frame`,
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero - 2-col with hero image */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-6 md:py-10 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <Link
                href="/frames/styles"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 md:mb-6"
                data-testid="link-back-to-styles"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>All Frame Styles</span>
              </Link>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-border flex-shrink-0"
                      style={{ backgroundColor: styleData.hex }}
                      aria-label={`${styleData.displayName} style swatch`}
                    />
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                      {styleData.displayName} Frames
                    </h1>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
                    {styleData.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                    {styleData.bestFor.map((use, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">{styleFrames.length}</span>{" "}
                    {styleData.displayName.toLowerCase()} frame{" "}
                    {styleFrames.length === 1 ? "style" : "styles"} available
                  </p>
                </div>

                {heroImageResolved && (
                  <div className="relative hidden md:block aspect-[4/3] min-w-[280px]">
                    <Image
                      src={heroImageResolved.url}
                      alt={heroImageResolved.alt}
                      fill
                      className="rounded-lg shadow-xl object-cover"
                      sizes="(max-width: 768px) 0px, 50vw"
                      priority
                      data-testid="img-hero-lifestyle"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured frame + embedded designer (no separate section title for designer) */}
        {featuredFrame && (
          <section className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold mb-6">
                Featured {styleData.displayName} Frame
              </h2>
              <div className="mt-10" data-designer-anchor>
                <Suspense
                  fallback={
                    <div className="min-h-[500px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading designer...</p>
                      </div>
                    </div>
                  }
                >
                  <FrameDesigner defaultFrameId={featuredFrame.id} embedded />
                </Suspense>
              </div>
            </div>
          </section>
        )}

        {/* More [Style] Frames */}
        {otherFrames.length > 0 && (
          <section className="container mx-auto px-4 py-8 md:py-12 bg-muted/20 border-t">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold mb-6">
                More {styleData.displayName} Frames
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {otherFrames.map((frame) => {
                  const cornerImg = getCornerImage(frame);
                  return (
                    <Link
                      key={frame.id}
                      href={`/picture-frames?frame=${frame.id}`}
                      data-testid={`card-frame-${frame.id}`}
                    >
                      <Card className="hover:border-primary/30 active:scale-[0.98] h-full cursor-pointer transition-all">
                        <CardContent className="p-3 md:p-4">
                          <div className="relative aspect-square mb-3 overflow-hidden rounded-md bg-muted">
                            <Image
                              src={cornerImg.url}
                              alt={cornerImg.alt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            />
                          </div>
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{frame.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {frame.mouldingWidth}&quot; width
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Lifestyle images */}
        {lifestyleImages.length > 3 && (
          <section className="container mx-auto px-4 py-8 md:py-12 border-t">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold mb-6">
                {styleData.displayName} Frames in Action
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {lifestyleImages.slice(0, 8).map((img, index) => (
                  <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About + FAQ content */}
        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  About {styleData.displayName} Frames
                </h2>
                <p className="text-muted-foreground mb-4">
                  {styleData.description} This aesthetic complements{" "}
                  {styleData.bestFor.slice(0, 2).join(" and ")} particularly well.
                </p>
                <p className="text-muted-foreground">
                  All {styleData.displayName.toLowerCase()} frames are available in custom sizes
                  from 4×4 to 48×72 inches. Each frame is made-to-order with framer&apos;s grade
                  acrylic and archival backing included.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  {styleData.displayName} Frame Questions
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      What artwork works best with {styleData.displayName.toLowerCase()} frames?
                    </h3>
                    <p className="text-muted-foreground">
                      {styleData.displayName} frames pair naturally with{" "}
                      {styleData.bestFor.join(", ")}. The {styleData.designStyle.toLowerCase()}{" "}
                      aesthetic creates distinctive visual impact.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Can I mix {styleData.displayName.toLowerCase()} frames with other styles?
                    </h3>
                    <p className="text-muted-foreground">
                      {styleData.displayName} frames mix well with{" "}
                      {relatedStyles.map((s) => s.displayName.toLowerCase()).join(" and ")} styles.
                      Keep color or width consistent when mixing styles for cohesive gallery walls.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      What sizes do {styleData.displayName.toLowerCase()} frames come in?
                    </h3>
                    <p className="text-muted-foreground">
                      Every {styleData.displayName.toLowerCase()} frame is available in custom sizes
                      from 4×4 to 48×72 inches. Popular sizes include 8×10, 11×14, 16×20, 18×24,
                      24×36, and 30×40. Enter your exact dimensions for instant pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Frame Styles */}
        {relatedStyles.length > 0 && (
          <section className="container mx-auto px-4 py-8 md:py-12 border-t">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold mb-6">Related Frame Styles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedStyles.map((relatedStyle) => (
                  <Link
                    key={relatedStyle.styleName}
                    href={`/frames/styles/${relatedStyle.slug}`}
                    data-testid={`card-related-${relatedStyle.slug}`}
                  >
                    <Card className="hover:border-primary/30 active:scale-[0.98] cursor-pointer transition-all">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-border flex-shrink-0"
                          style={{ backgroundColor: relatedStyle.hex }}
                          aria-hidden
                        />
                        <div>
                          <h3 className="font-semibold">{relatedStyle.displayName} Frames</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {relatedStyle.designStyle}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
