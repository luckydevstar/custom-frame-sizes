import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, CardContent } from "@framecraft/ui";
import {
  STYLE_METADATA,
  getStyleHubImage,
  countFramesPerStyle,
  getFrameStyles,
} from "@framecraft/core";
import { brandConfig } from "../../../brand.config";

const frames = getFrameStyles();
const styleCounts = countFramesPerStyle(frames as Parameters<typeof countFramesPerStyle>[0]);

const orderedStyles = Object.entries(STYLE_METADATA)
  .sort((a, b) => (b[1].searchVolume ?? 0) - (a[1].searchVolume ?? 0))
  .map(([styleName, metadata]) => ({
    ...metadata,
    styleName,
    count: styleCounts[styleName] ?? 0,
    image: getStyleHubImage(styleName, frames as Parameters<typeof getStyleHubImage>[1]),
  }));

export const metadata: Metadata = {
  title: "Picture Frames by Style - Modern, Rustic, Classic | CFS",
  description:
    "Shop picture frames by style. Modern, rustic, classic, gallery, vintage, and minimalist frames in custom sizes 4×4 to 48×72 inches. Find your perfect aesthetic.",
  keywords:
    "modern picture frames, rustic frames, farmhouse frames, classic frames, gallery frames, minimalist frames, vintage frames",
  openGraph: {
    title: "Picture Frames by Style - Custom Sizes",
    description:
      "Browse custom frames by style: modern, rustic, classic, gallery, vintage, and minimalist. Expert craftsmanship in any size.",
    type: "website",
    url: "/frames/styles",
  },
  alternates: { canonical: "/frames/styles" },
};

export default function FramesByStylePage() {
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
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What picture frame styles are most popular?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rustic and modern frames are the most searched styles. Rustic frames bring farmhouse charm with distressed finishes. Modern frames feature clean lines and sleek profiles. Classic, gallery, and minimalist styles also remain popular for different decor needs.",
        },
      },
      {
        "@type": "Question",
        name: "How do I choose the right frame style for my artwork?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Match your frame style to both your artwork and room decor. Modern frames work best with contemporary art and minimalist spaces. Rustic frames suit nature photography and farmhouse interiors. Classic frames complement traditional artwork and formal settings.",
        },
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Picture Frames by Style",
    description:
      "Browse custom picture frames by style: modern, rustic, classic, gallery, vintage, natural wood, minimalist, and ornate. Find the perfect aesthetic for your artwork.",
    url: `${baseUrl}/frames/styles`,
    inLanguage: "en-US",
  };

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
        <section className="bg-gradient-to-b from-muted/30 to-background py-8 md:py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                Picture Frames by Style
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-6">
                Your frame style sets the tone. Modern frames feel sleek and clean. Rustic frames
                add warmth and character. Classic frames work with anything. Browse by style below
                to find your match.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {orderedStyles.map((style) => {
                // getStyleHubImage already returns full store-a CDN URL
                const imageSrc = style.image;
                return (
                  <Link key={style.styleName} href={`/frames/styles/${style.slug}`}>
                    <Card
                      className="hover:border-primary/30 transition-all overflow-hidden h-full cursor-pointer"
                      data-testid={`card-style-${style.slug}`}
                    >
                      <div className="aspect-[16/10] md:aspect-[4/3] overflow-hidden bg-muted/20">
                        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic asset URL from getStyleHubImage (store-a CDN) */}
                        <img
                          src={imageSrc}
                          alt={`${style.displayName} style picture frames in custom sizes`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-2 md:gap-3 mb-2">
                          <div
                            className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-border flex-shrink-0"
                            style={{ backgroundColor: style.hex }}
                            aria-label={`${style.displayName} style swatch`}
                          />
                          <h2 className="text-lg md:text-xl font-bold leading-tight">
                            {style.displayName} Frames
                          </h2>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                          {style.count} {style.count === 1 ? "style" : "styles"} available
                        </p>
                        <p className="hidden md:block text-sm text-muted-foreground mb-4 line-clamp-2">
                          {style.description}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full min-h-11 text-sm"
                          data-testid={`button-view-${style.slug}`}
                        >
                          View {style.displayName} Frames
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Frame Style Matters</h2>
                <p className="text-muted-foreground mb-4">
                  The same artwork looks completely different in a modern black frame versus a
                  rustic barnwood frame. Style isn&apos;t just decoration—it tells a story about the
                  art and the space.
                </p>
                <p className="text-muted-foreground">
                  Our style categories help you browse frames by aesthetic rather than just color or
                  size. Each style includes multiple frame options with different profiles, widths,
                  and finishes.
                </p>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Popular Frame Style Guide</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Modern Frames</h3>
                    <p className="text-muted-foreground">
                      Clean lines, bold profiles, and sleek finishes. Modern frames work best with
                      contemporary art, abstract photography, and minimalist interiors.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Rustic Frames</h3>
                    <p className="text-muted-foreground">
                      Weathered textures, distressed finishes, and farmhouse charm. Rustic frames
                      add warmth to nature photography, family photos, and country-style homes.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Classic Frames</h3>
                    <p className="text-muted-foreground">
                      Timeless elegance with traditional profiles. Classic frames work with
                      virtually any artwork. Perfect for portraits, diplomas, and professional
                      settings.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Gallery Frames</h3>
                    <p className="text-muted-foreground">
                      Professional-grade frames for serious art display. Gallery frames keep focus
                      on the artwork, not the frame.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Try Different Styles on Your Art
            </h2>
            <p className="text-muted-foreground mb-6">
              Upload your image and preview how different frame styles transform your artwork. See
              it before you buy it.
            </p>
            <Button size="lg" asChild className="min-h-11" data-testid="button-start-designing">
              <Link href="/designer">Try the Designer</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
