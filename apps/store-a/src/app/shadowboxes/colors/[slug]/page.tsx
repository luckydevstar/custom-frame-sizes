import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shirt, Disc3, Award, Box, Shield, Palette, Package, Ruler } from "lucide-react";
import { Button, Card, CardContent, Badge } from "@framecraft/ui";
import {
  getFrameStyles,
  SHADOWBOX_COLOR_METADATA,
  getShadowboxColorHeroImage,
  isUsingShadowboxPlaceholderImages,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import { brandConfig } from "../../../../brand.config";
import type { FrameStyle } from "@framecraft/types";
import {
  COMPLEMENTARY_COLORS_MAP,
  FRAME_MATERIALS_COPY,
  SHADOWBOX_COLOR_FAQ,
} from "./shadowbox-color-detail-data";

const VALID_SLUGS = ["black", "white", "brown", "silver", "gold", "blue", "natural"];

interface ShadowboxColorDetailPageProps {
  params: Promise<{ slug: string }>;
}

function getShadowboxFramesByColor(colorName: string): FrameStyle[] {
  const frames = getFrameStyles();
  const searchColor = colorName === "Blue" ? "barn blue" : colorName.toLowerCase();
  return frames.filter(
    (f) => f.category === "shadowbox" && f.colorName?.toLowerCase() === searchColor
  );
}

function getCornerImage(frame: FrameStyle) {
  const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
  if (cornerImage) {
    const localPath = cornerImage.url.startsWith("/") ? cornerImage.url.slice(1) : cornerImage.url;
    return { url: getStoreBaseAssetUrl(localPath), alt: cornerImage.alt };
  }
  const localPath = (frame.thumbnail ?? "").startsWith("/")
    ? (frame.thumbnail ?? "").slice(1)
    : frame.thumbnail;
  return { url: getStoreBaseAssetUrl(localPath ?? ""), alt: `${frame.name} frame corner detail` };
}

export async function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ShadowboxColorDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = Object.entries(SHADOWBOX_COLOR_METADATA).find(([_, data]) => data.slug === slug);
  if (!entry) return { title: "Color Not Found" };
  const [, colorData] = entry;
  return {
    title: `${colorData.displayName} Shadowbox Frames - Custom Depth Display | ${brandConfig.name}`,
    description: `Shop ${colorData.displayName.toLowerCase()} shadowbox frames for memorabilia, jerseys, and 3D displays. ${colorData.description} Custom sizes and depths.`,
    openGraph: {
      title: `${colorData.displayName} Shadowbox Frames - Custom Depth Display`,
      description: colorData.description,
      type: "website",
    },
  };
}

export default async function ShadowboxColorDetailPage({ params }: ShadowboxColorDetailPageProps) {
  const { slug } = await params;
  const entry = Object.entries(SHADOWBOX_COLOR_METADATA).find(([_, data]) => data.slug === slug);
  if (!entry) notFound();

  const [colorName, colorData] = entry;
  const frames = getFrameStyles() as Parameters<typeof getShadowboxColorHeroImage>[1];
  const colorFrames = getShadowboxFramesByColor(colorName);
  const heroImage = getShadowboxColorHeroImage(colorName, frames);
  const usingPlaceholders = isUsingShadowboxPlaceholderImages(colorName, frames);
  const baseUrl = brandConfig.seo?.canonicalUrl || "https://customframesizes.com";

  const featuredFrame =
    colorFrames.length > 0
      ? colorFrames.reduce((prev, current) =>
          (current.pricePerInch ?? 0) > (prev.pricePerInch ?? 0) ? current : prev
        )
      : null;
  const otherFrames = featuredFrame
    ? colorFrames.filter((f) => f.id !== featuredFrame.id)
    : colorFrames;

  const depths = colorFrames
    .map((f) => f.usableDepth)
    .filter((d): d is number => typeof d === "number");
  const depthOptions =
    depths.length > 0
      ? { min: Math.min(...depths), max: Math.max(...depths), count: new Set(depths).size }
      : null;
  const widthOptions = new Set(
    colorFrames.map((f) => f.mouldingWidth).filter((w): w is number => typeof w === "number")
  ).size;

  const complementaryNames = COMPLEMENTARY_COLORS_MAP[colorName] ?? [];
  const complementaryColors = complementaryNames
    .map((name) => SHADOWBOX_COLOR_METADATA[name as keyof typeof SHADOWBOX_COLOR_METADATA])
    .filter((c): c is NonNullable<typeof c> => c != null);

  const faqItems = SHADOWBOX_COLOR_FAQ[colorName] ?? [];
  const frameMaterialsCopy = FRAME_MATERIALS_COPY[colorName] ?? "Premium hardwood construction.";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shadowboxes by Color",
        item: `${baseUrl}/shadowboxes/colors`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${colorData.displayName} Shadowbox Frames`,
        item: `${baseUrl}/shadowboxes/colors/${colorData.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/shadowboxes/colors/${colorData.slug}#faq`,
    mainEntity: faqItems.map((item, i) => ({
      "@type": "Question",
      "@id": `${baseUrl}/shadowboxes/colors/${colorData.slug}#faq-${i}`,
      name: item.name,
      acceptedAnswer: { "@type": "Answer", text: item.text },
    })),
  };

  const productSchema =
    featuredFrame && colorFrames.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${featuredFrame.name} - ${colorName} Shadowbox Frame`,
          description:
            featuredFrame.shortDescription ||
            `Professional ${colorName.toLowerCase()} shadowbox frame with ${featuredFrame.usableDepth}" depth for memorabilia display`,
          image: [
            heroImage.url,
            getCornerImage(featuredFrame).url,
            ...(featuredFrame.alternateImages
              ?.filter((img) => img.type === "lifestyle")
              .slice(0, 2)
              .map((img) =>
                getStoreBaseAssetUrl(img.url.startsWith("/") ? img.url.slice(1) : img.url)
              ) ?? []),
          ],
          sku: featuredFrame.id.toUpperCase(),
          url: `${baseUrl}/shadowbox/designer?frame=${featuredFrame.id}`,
          category: "Shadowbox Frames",
          brand: { "@type": "Brand", name: brandConfig.name },
          offers: {
            "@type": "AggregateOffer",
            url: `${baseUrl}/shadowboxes/colors/${colorData.slug}`,
            priceCurrency: "USD",
            lowPrice: Math.min(...colorFrames.map((f) => f.pricePerInch ?? 0)),
            highPrice: Math.max(...colorFrames.map((f) => f.pricePerInch ?? 0)),
            priceValidUntil: "2025-12-31",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "Organization", name: brandConfig.name },
          },
        }
      : null;

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
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-background to-muted py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              data-testid="button-back-to-colors"
              className="mb-6"
            >
              <Link href="/shadowboxes/colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shadowbox Colors
              </Link>
            </Button>
            <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-border"
                    style={{ backgroundColor: colorData.hex }}
                    data-testid="color-swatch"
                    aria-label={`${colorData.displayName} color swatch`}
                  />
                  <div>
                    <Badge className="mb-2" data-testid="badge-design-style">
                      {colorData.designStyle}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {colorData.displayName} Shadowbox Frames
                    </h1>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-6">{colorData.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" data-testid="badge-frame-count">
                    <Package className="w-3 h-3 mr-1" />
                    {colorFrames.length} Frame{colorFrames.length !== 1 ? "s" : ""}
                  </Badge>
                  {depthOptions && (
                    <Badge variant="secondary" data-testid="badge-depth-options">
                      <Box className="w-3 h-3 mr-1" />
                      {depthOptions.count} Depth Option{depthOptions.count !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  <Badge variant="secondary" data-testid="badge-width-options">
                    <Ruler className="w-3 h-3 mr-1" />
                    {widthOptions} Width{widthOptions !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <Button size="lg" asChild data-testid="button-design-shadowbox">
                  <Link href="/shadowbox/designer">
                    Design Your {colorData.displayName} Shadowbox
                  </Link>
                </Button>
              </div>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage.url}
                  alt={heroImage.alt}
                  className="rounded-lg shadow-lg w-full"
                  data-testid="hero-image"
                  loading="eager"
                />
                {usingPlaceholders && (
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    More photos coming soon
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Quick Facts</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{colorFrames.length}</div>
                    <div className="text-sm text-muted-foreground">Frame Options</div>
                  </CardContent>
                </Card>
                {depthOptions && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {depthOptions.min}&quot; - {depthOptions.max}&quot;
                      </div>
                      <div className="text-sm text-muted-foreground">Depth Range</div>
                    </CardContent>
                  </Card>
                )}
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{widthOptions}</div>
                    <div className="text-sm text-muted-foreground">Width Options</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">Wood</div>
                    <div className="text-sm text-muted-foreground">Material</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Applications */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Popular Applications</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" asChild data-testid="link-jerseys">
                  <Link href="/jersey-frames">Sports Jerseys</Link>
                </Button>
                <Button variant="outline" asChild data-testid="link-medals">
                  <Link href="/military-frames">Military Medals</Link>
                </Button>
                <Button variant="outline" asChild data-testid="link-vinyl">
                  <Link href="/specialty/record-album-frames">Vinyl Records</Link>
                </Button>
                <Button variant="outline" asChild data-testid="link-collectibles">
                  <Link href="/shadowbox/designer">Collectibles</Link>
                </Button>
                <Button variant="outline" asChild data-testid="link-awards">
                  <Link href="/shadowbox/designer">Awards &amp; Honors</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Showcase */}
        {colorFrames.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  Our {colorData.displayName} Shadowbox Frames
                </h2>
                {featuredFrame && (
                  <Card className="mb-12">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getCornerImage(featuredFrame).url}
                            alt={getCornerImage(featuredFrame).alt}
                            className="rounded-lg w-full"
                            data-testid="featured-frame-image"
                          />
                        </div>
                        <div>
                          <Badge className="mb-2">Featured</Badge>
                          <h3 className="text-2xl font-bold mb-3">{featuredFrame.name}</h3>
                          <p className="text-muted-foreground mb-6">
                            {featuredFrame.shortDescription}
                          </p>
                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Moulding Width</span>
                              <span className="font-semibold">
                                {featuredFrame.mouldingWidth}&quot;
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Usable Depth</span>
                              <span className="font-semibold">
                                {featuredFrame.usableDepth}&quot;
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Material</span>
                              <span className="font-semibold">{featuredFrame.material}</span>
                            </div>
                          </div>
                          <Button size="lg" asChild data-testid="button-customize-featured">
                            <Link href={`/shadowbox/designer?frame=${featuredFrame.id}`}>
                              Customize This Shadowbox
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {otherFrames.length > 0 && (
                  <>
                    <h3 className="text-2xl font-bold mb-6">
                      All {colorData.displayName} Shadowboxes
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {otherFrames.map((frame) => {
                        const cornerImg = getCornerImage(frame);
                        return (
                          <Card key={frame.id}>
                            <CardContent className="pt-6">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={cornerImg.url}
                                alt={cornerImg.alt}
                                className="rounded-lg w-full mb-4"
                                data-testid={`frame-image-${frame.id}`}
                              />
                              <h4 className="font-semibold mb-2">{frame.name}</h4>
                              <div className="text-sm text-muted-foreground mb-4">
                                <div>Width: {frame.mouldingWidth}&quot;</div>
                                <div>Depth: {frame.usableDepth}&quot;</div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="w-full"
                                data-testid={`button-customize-${frame.id}`}
                              >
                                <Link href={`/shadowbox/designer?frame=${frame.id}`}>
                                  Customize Shadowbox
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Use Case Vignettes */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Perfect For Every Memory</h2>
              <div className="space-y-12">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <Shirt className="w-16 h-16 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="text-2xl font-semibold mb-3">Sports Memorabilia</h3>
                        <p className="text-muted-foreground mb-4">
                          {colorData.displayName} frames create striking contrast that makes team
                          jerseys pop. The professional look complements athletic memorabilia—from
                          signed game-worn jerseys to championship gear. Deep profiles accommodate
                          folded uniforms, and {colorData.displayName.toLowerCase()} borders direct
                          attention to team colors and player numbers without distraction.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Popular for: Signed jerseys, game-worn uniforms, championship team gear,
                          sports autographs
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <Disc3 className="w-16 h-16 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="text-2xl font-semibold mb-3">Music &amp; Entertainment</h3>
                        <p className="text-muted-foreground mb-4">
                          Showcase vinyl records, signed album covers, and concert memorabilia in
                          sleek {colorData.displayName.toLowerCase()} frames. The neutral finish
                          highlights colorful album artwork while the shadowbox depth protects
                          valuable records from dust and damage. Create a sophisticated music
                          gallery wall that celebrates your collection.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Popular for: Vinyl LP records, signed album covers, concert tickets,
                          backstage passes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <Award className="w-16 h-16 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="text-2xl font-semibold mb-3">Awards &amp; Achievements</h3>
                        <p className="text-muted-foreground mb-4">
                          Military medals, corporate awards, and achievement certificates deserve
                          elegant presentation. {colorData.displayName} shadowboxes provide formal,
                          dignified display for career milestones and service honors. Multi-depth
                          compartments organize medals, ribbons, and documentation with professional
                          sophistication.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Popular for: Military medals, challenge coins, corporate awards, service
                          ribbons
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Technical Specifications</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <Box className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Depth Options</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Available in multiple depths from 0.875&quot; to 3.5&quot; for flat items,
                      jerseys, or complex displays
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Standard: Medals, photos, documents</li>
                      <li>• Deep: Jerseys, thick items, records</li>
                      <li>• Extra Deep: Multi-layer displays</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Shield className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">UV Protection</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Museum-grade acrylic with 99% UV filtering preserves fabric colors and
                      prevents fading
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Blocks harmful UV rays</li>
                      <li>• Prevents jersey fading</li>
                      <li>• Crystal-clear viewing</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Palette className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Frame Materials</h3>
                    <p className="text-sm text-muted-foreground mb-3">{frameMaterialsCopy}</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Solid wood construction</li>
                      <li>• Matte or satin finishes</li>
                      <li>• Professional quality</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Complementary Colors */}
        {complementaryColors.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  Also Explore These Shadowbox Colors
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {complementaryColors.map((color) => (
                    <Card key={color.slug} className="hover-elevate">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className="w-12 h-12 rounded-lg border-2 border-border"
                            style={{ backgroundColor: color.hex }}
                          />
                          <h3 className="font-semibold text-lg">{color.displayName}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {color.description.split(".")[0]}.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full"
                          data-testid={`link-color-${color.slug}`}
                        >
                          <Link href={`/shadowboxes/colors/${color.slug}`}>
                            View {color.displayName} Shadowboxes
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Create Your {colorData.displayName} Shadowbox Frame
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Design a custom {colorData.displayName.toLowerCase()} shadowbox frame with the
                perfect depth for your memorabilia. Choose from multiple depth options, add
                professional-grade UV protection, and create a professional display worthy of your
                treasured items.
              </p>
              <Button size="lg" variant="default" asChild data-testid="button-final-cta">
                <Link href="/shadowbox/designer">Start Designing Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
