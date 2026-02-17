import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, Badge } from "@framecraft/ui";
import {
  getFrameStyles,
  SHADOWBOX_COLOR_METADATA,
  getShadowboxColorHeroImage,
  getShadowboxColorGalleryImages,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import { brandConfig } from "../../../../brand.config";
import type { FrameStyle } from "@framecraft/types";

interface ShadowboxColorDetailPageProps {
  params: { slug: string };
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

export async function generateMetadata({
  params,
}: ShadowboxColorDetailPageProps): Promise<Metadata> {
  const { slug } = params;
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
  const { slug } = params;
  const entry = Object.entries(SHADOWBOX_COLOR_METADATA).find(([_, data]) => data.slug === slug);
  if (!entry) notFound();

  const [colorName, colorData] = entry;
  const frames = getFrameStyles() as Parameters<typeof getShadowboxColorHeroImage>[1];
  const colorFrames = getShadowboxFramesByColor(colorName);
  const heroImage = getShadowboxColorHeroImage(colorName, frames);
  const galleryImages = getShadowboxColorGalleryImages(colorName, frames);
  const baseUrl = brandConfig.seo?.canonicalUrl || "https://customframesizes.com";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shadowbox Frames by Color",
        item: `${baseUrl}/shadowbox-frames/colors`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${colorData.displayName} Shadowbox Frames`,
        item: `${baseUrl}/shadowbox-frames/colors/${colorData.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/30 to-background py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <Button variant="ghost" size="sm" asChild data-testid="button-back-to-colors">
                  <Link href="/shadowbox-frames/colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All Shadowbox Colors
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
                      {colorData.displayName} Shadowbox Frames
                    </h1>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">{colorData.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{colorData.designStyle}</Badge>
                    <Badge variant="outline" data-testid="badge-frame-count">
                      {colorFrames.length}{" "}
                      {colorFrames.length === 1 ? "Frame Style" : "Frame Styles"}
                    </Badge>
                  </div>
                  <Button size="lg" className="mt-4" asChild>
                    <Link href="/shadowbox/designer">Design Shadowbox</Link>
                  </Button>
                </div>
                {heroImage?.url && (
                  <div className="rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroImage.url}
                      alt={heroImage.alt}
                      className="w-full h-full object-cover aspect-[4/3]"
                      loading="eager"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {colorFrames.length > 0 && (
          <section className="container mx-auto px-4 py-8 border-b">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-bold mb-4">{colorData.displayName} Shadowbox Styles</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {colorFrames.slice(0, 10).map((frame) => {
                  const img = getCornerImage(frame);
                  return (
                    <Link key={frame.id} href="/shadowbox/designer">
                      <Card className="overflow-hidden h-full hover-elevate cursor-pointer">
                        <div className="aspect-square relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm font-medium truncate">{frame.name}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <Button asChild>
                  <Link href="/shadowbox/designer">
                    Design Your {colorData.displayName} Shadowbox
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {galleryImages.length > 0 && (
          <section className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Display Ideas</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {galleryImages.slice(0, 3).map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Design Your Shadowbox?</h2>
              <p className="text-muted-foreground mb-6">
                Choose your size, depth, and options in our shadowbox designer. We build to order
                with archival materials and framer&apos;s grade acrylic.
              </p>
              <Button size="lg" asChild>
                <Link href="/shadowbox/designer">Open Shadowbox Designer</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
