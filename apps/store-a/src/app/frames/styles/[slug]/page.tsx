import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent } from "@framecraft/ui";
import {
  STYLE_METADATA,
  getFramesForStyle,
  getFrameStyles,
  getSharedAssetUrl,
} from "@framecraft/core";
import { brandConfig } from "../../../../brand.config";

const frames = getFrameStyles();

type Props = { params: Promise<{ slug: string }> };

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

  function getCornerImage(frame: (typeof styleFrames)[0]) {
    const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
    if (cornerImage) {
      const path = cornerImage.url.startsWith("/") ? cornerImage.url.slice(1) : cornerImage.url;
      return { url: getSharedAssetUrl(path), alt: cornerImage.alt };
    }
    const thumb = frame.thumbnail ?? "";
    const path = thumb.startsWith("/") ? thumb.slice(1) : thumb;
    return {
      url: getSharedAssetUrl(path || "frames/8446/lifestyle_1.jpg"),
      alt: `${frame.name} Frame`,
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen">
        <section className="border-b bg-muted/20">
          <div className="container mx-auto px-4 py-6">
            <Link
              href="/frames/styles"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Frames by Style
            </Link>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-border"
                  style={{ backgroundColor: styleData.hex }}
                  aria-hidden
                />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  {styleData.displayName} Frames
                </h1>
              </div>
              <p className="text-muted-foreground mb-6">{styleData.description}</p>
              <Button asChild size="lg">
                <Link href="/designer">Start Designing</Link>
              </Button>
            </div>
          </div>
        </section>

        {styleFrames.length > 0 ? (
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl font-bold mb-6">Frame Options in This Style</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {styleFrames.map((frame) => {
                  const img = getCornerImage(frame);
                  return (
                    <Link key={frame.id} href={`/designer?frame=${frame.id}`}>
                      <Card className="h-full overflow-hidden hover:border-primary/30 transition-all cursor-pointer">
                        <div className="aspect-square bg-muted/20">
                          {/* eslint-disable-next-line @next/next/no-img-element -- dynamic frame image URL */}
                          <img
                            src={img.url}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm">{frame.name} Frame</h3>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-muted-foreground mb-6">
                Browse our full frame collection and filter by style in the designer to find{" "}
                {styleData.displayName.toLowerCase()} options.
              </p>
              <Button asChild size="lg">
                <Link href="/designer">Open Frame Designer</Link>
              </Button>
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl font-bold mb-4">Ready to frame your art?</h2>
            <p className="text-muted-foreground mb-6">
              Use our designer to choose your size, mat, and glazing. Any size from 4×4&quot; to
              48×72&quot;.
            </p>
            <Button asChild>
              <Link href="/designer">Go to Designer</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
