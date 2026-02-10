import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, Badge } from "@framecraft/ui";
import { FrameDesigner } from "@framecraft/ui";
import {
  COLOR_METADATA,
  getColorHeroImage,
  getColorGalleryImages,
  getFramesByColor,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import { brandConfig } from "../../../../brand.config";
import type { FrameStyle } from "@framecraft/types";

interface ColorDetailPageProps {
  params: { slug: string };
}

// Helper to get corner image for a frame (store-a CDN)
function getCornerImage(frame: FrameStyle) {
  const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
  if (cornerImage) {
    const localPath = cornerImage.url.startsWith("/") ? cornerImage.url.slice(1) : cornerImage.url;
    return {
      url: getStoreBaseAssetUrl(localPath),
      alt: cornerImage.alt,
    };
  }
  const localPath = (frame.thumbnail ?? "").startsWith("/")
    ? (frame?.thumbnail ?? "").slice(1)
    : frame.thumbnail;
  return {
    url: getStoreBaseAssetUrl(localPath ?? ""),
    alt: `${frame.name} Frame corner detail`,
  };
}

// Get complementary colors
function getComplementaryColors(colorName: string) {
  const relatedMap: Record<string, string[]> = {
    Black: ["White", "Gray", "Silver"],
    White: ["Black", "Gray", "Natural"],
    Brown: ["Natural", "Bronze", "Gold"],
    Gold: ["Bronze", "Brown", "Silver"],
    Silver: ["Gray", "Black", "White"],
    Natural: ["Brown", "White", "Bronze"],
    Blue: ["Silver", "White", "Gray"],
    Bronze: ["Gold", "Brown", "Natural"],
    Gray: ["Black", "White", "Silver"],
    Red: ["Black", "White", "Gold"],
    Pink: ["White", "Silver", "Gray"],
    Espresso: ["Brown", "Natural", "Gold"],
  };

  const related = relatedMap[colorName] || ["Black", "White", "Natural"];
  return related
    .map((name) => {
      const entry = Object.entries(COLOR_METADATA).find(([key]) => key === name);
      if (!entry) return null;
      return { colorName: entry[0], ...entry[1] };
    })
    .filter((color): color is NonNullable<typeof color> => color !== null)
    .slice(0, 3);
}

export async function generateMetadata({ params }: ColorDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  const entry = Object.entries(COLOR_METADATA).find(([_, data]) => data.slug === slug);

  if (!entry) {
    return {
      title: "Color Not Found",
    };
  }

  const [, colorData] = entry;

  return {
    title: `${colorData.displayName} Frames - Custom Sizes | ${brandConfig.name}`,
    description: `Shop ${colorData.displayName.toLowerCase()} picture frames in custom sizes 4×4 to 48×72 inches. ${colorData.description} Expert craftsmanship with instant pricing.`,
    openGraph: {
      title: `${colorData.displayName} Picture Frames - Custom Sizes`,
      description: colorData.description,
      type: "website",
    },
  };
}

export default async function ColorDetailPage({ params }: ColorDetailPageProps) {
  const { slug } = params;
  const entry = Object.entries(COLOR_METADATA).find(([_, data]) => data.slug === slug);

  if (!entry) {
    notFound();
  }

  const [colorName, colorData] = entry;
  const colorFrames = getFramesByColor(colorName);
  const featuredFrame =
    colorFrames.length > 0
      ? colorFrames.reduce((prev, current) =>
          (current.pricePerInch || 0) > (prev.pricePerInch || 0) ? current : prev
        )
      : null;
  const otherFrames = colorFrames.filter((f) => f.id !== featuredFrame?.id);
  const heroImage = getColorHeroImage(colorName);
  const galleryImages = getColorGalleryImages(colorName);
  const complementaryColors = getComplementaryColors(colorName);

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: brandConfig.seo?.canonicalUrl || "https://customframesizes.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Frames by Color",
        item: `${brandConfig.seo?.canonicalUrl || "https://customframesizes.com"}/frames/colors`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${colorData.displayName} Frames`,
        item: `${brandConfig.seo?.canonicalUrl || "https://customframesizes.com"}/frames/colors/${colorData.slug}`,
      },
    ],
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do ${colorData.displayName.toLowerCase()} frames work with any type of artwork?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${colorData.displayName} frames accommodate diverse artwork types including ${colorData.bestFor.slice(0, 2).join(", ")}, and ${colorData.bestFor[2] || "decorative prints"}. ${colorData.displayName === "Black" ? "Black frames create universal contrast suitable for both color and monochrome artwork." : colorData.displayName === "White" ? "White frames work particularly well with contemporary art, color photography, and bright modern compositions." : colorData.displayName + " frames work best with artwork sharing complementary color relationships."}`,
        },
      },
      {
        "@type": "Question",
        name: `What mat colors pair best with ${colorData.displayName.toLowerCase()} frames?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${colorData.displayName === "Black" ? "White, cream, and light gray mat boards create classic high-contrast pairings with black frames." : colorData.displayName === "White" ? "White mat boards create seamless monochromatic presentations, while colored mats add subtle variation." : colorData.displayName === "Gold" ? "Cream, ivory, and warm beige mat boards harmonize with gold finishes." : "Neutral mat boards (white, cream, gray) provide versatile foundations."}`,
        },
      },
      {
        "@type": "Question",
        name: `What sizes are available in ${colorData.displayName.toLowerCase()} picture frames?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Our ${colorData.displayName.toLowerCase()} picture frames are available in any custom size from 4×4 inches to 48×72 inches with 1/16 inch precision. Standard popular sizes include 8×10, 11×14, 16×20, 18×24, 24×36, and 30×40 inches.`,
        },
      },
    ],
  };

  // Product Schema
  const productSchema = featuredFrame
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${featuredFrame.name} - ${colorData.displayName} Picture Frame`,
        description: `${featuredFrame.shortDescription || featuredFrame.name} in ${colorData.displayName.toLowerCase()} finish. Custom sizes 4×4 to 48×72 inches.`,
        image: getCornerImage(featuredFrame).url,
        brand: {
          "@type": "Brand",
          name: brandConfig.name,
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: ((featuredFrame.pricePerInch || 0) * 20).toFixed(2),
          highPrice: ((featuredFrame.pricePerInch || 0) * 200).toFixed(2),
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Breadcrumb */}
              <div className="mb-6">
                <Button variant="ghost" size="sm" asChild data-testid="button-back-to-colors">
                  <Link href="/frames/colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All Frame Colors
                  </Link>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full border-2 border-border"
                      style={{ backgroundColor: colorData.hex }}
                      aria-label={`${colorData.displayName} color swatch`}
                    />
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {colorData.displayName} Picture Frames
                    </h1>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">{colorData.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" data-testid="badge-design-style">
                      {colorData.designStyle}
                    </Badge>
                    <Badge variant="outline" data-testid="badge-frame-count">
                      {colorFrames.length}{" "}
                      {colorFrames.length === 1 ? "Frame Style" : "Frame Styles"}
                    </Badge>
                  </div>
                </div>

                {heroImage && (
                  <div className="rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroImage.url}
                      alt={`${colorData.displayName} picture frames displayed in ${colorData.designStyle.toLowerCase()} interior`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Sizes */}
        <section className="container mx-auto px-4 py-8 border-b">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Popular {colorData.displayName} Frame Sizes</h2>
            <div className="flex flex-wrap gap-2">
              {["8x10", "11x14", "16x20", "18x24", "20x24", "24x36", "30x40"].map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  size="sm"
                  asChild
                  data-testid={`button-size-${size}`}
                >
                  <Link href={`/frames/sizes/${size}`}>
                    {size.replace("x", "×")}&quot; {colorData.displayName}
                  </Link>
                </Button>
              ))}
              <Button variant="ghost" size="sm" asChild data-testid="button-all-sizes">
                <Link href="/frames/sizes">All Sizes →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Product Showcase */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {featuredFrame && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  Featured {colorData.displayName} Frame
                </h2>

                <Card className="mb-12 overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-8 p-6">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getCornerImage(featuredFrame).url}
                        alt={`${featuredFrame.name} ${colorData.displayName.toLowerCase()} frame corner detail`}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-2xl font-bold mb-2">{featuredFrame.name} Frame</h3>
                      <p className="text-muted-foreground mb-4">{featuredFrame.shortDescription}</p>
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Moulding Width:</span>
                          <span className="font-medium">{featuredFrame.mouldingWidth}&quot;</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Depth:</span>
                          <span className="font-medium">{featuredFrame.usableDepth}&quot;</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Material:</span>
                          <span className="font-medium">{featuredFrame.material}</span>
                        </div>
                      </div>
                      <Button
                        size="lg"
                        asChild
                        data-testid={`button-customize-${featuredFrame.id}`}
                      >
                        <Link href={`/picture-frames?frame=${featuredFrame.id}`}>
                          Customize This Frame
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* All Frames Grid */}
            {otherFrames.length > 0 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  All {colorData.displayName} Frames
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {otherFrames.map((frame) => (
                    <Card
                      key={frame.id}
                      className="hover-elevate active-elevate-2 overflow-hidden"
                      data-testid={`card-frame-${frame.id}`}
                    >
                      <div className="aspect-square bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getCornerImage(frame).url}
                          alt={`${frame.name} ${colorData.displayName.toLowerCase()} frame`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-1">{frame.name} Frame</h3>
                        {frame.shortDescription && (
                          <p className="text-xs text-muted-foreground/80 italic mb-2">
                            {frame.shortDescription}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mb-3">
                          {frame.mouldingWidth}&quot; width
                        </p>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href={`/picture-frames?frame=${frame.id}`}>Customize Frame</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Interactive Frame Designer */}
        <section className="container mx-auto px-4 py-12 border-t bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Design Your {colorData.displayName} Frame
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Try our interactive designer to customize your {colorData.displayName.toLowerCase()}{" "}
                frame with precise dimensions, mat boards, and glass options. See real-time pricing
                and visualization.
              </p>
            </div>
            <div data-designer-anchor>
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
                <FrameDesigner defaultFrameId={featuredFrame?.id} embedded />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Lifestyle Gallery */}
        {galleryImages.length > 0 && (
          <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {galleryImages.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEO Content */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-5xl mx-auto space-y-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Why {colorData.displayName} Frames Work
              </h2>
              <p className="text-muted-foreground mb-4">
                {colorData.displayName} frames create {colorData.designStyle.toLowerCase()}{" "}
                aesthetics that work particularly well with{" "}
                {colorData.bestFor.slice(0, 2).join(" and ")}. This collection includes{" "}
                {colorFrames.length} {colorData.displayName.toLowerCase()} frame{" "}
                {colorFrames.length === 1 ? "style" : "styles"} in various widths and profiles.
              </p>
              <p className="text-muted-foreground">
                {colorData.description} Choose from our selection to find the perfect frame for your
                artwork and interior design style.
              </p>
            </div>
          </div>
        </section>

        {/* Related Colors */}
        {complementaryColors.length > 0 && (
          <section className="container mx-auto px-4 py-12 border-t">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Explore Similar Colors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {complementaryColors.map((color) => (
                  <Link key={color.slug} href={`/frames/colors/${color.slug}`}>
                    <Card className="hover-elevate active-elevate-2 cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-border"
                            style={{ backgroundColor: color.hex }}
                            aria-label={`${color.displayName} color swatch`}
                          />
                          <h3 className="text-lg font-bold">{color.displayName} Frames</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {color.description}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          View {color.displayName} Frames
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/frames/colors">View All Frame Colors</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
