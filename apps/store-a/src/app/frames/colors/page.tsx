import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, CardContent } from "@framecraft/ui";
import { COLOR_METADATA, getColorHubImage, countFramesPerColor } from "@framecraft/core";
import { brandConfig } from "../../../brand.config";

// Count frames per color
const colorCounts = countFramesPerColor();

// Order colors by popularity (frame count)
const orderedColors = Object.entries(COLOR_METADATA)
  .sort((a, b) => (colorCounts[b[0]] || 0) - (colorCounts[a[0]] || 0))
  .map(([colorName, metadata]) => ({
    ...metadata,
    colorName,
    count: colorCounts[colorName] || 0,
    image: getColorHubImage(colorName),
  }));

export const metadata: Metadata = {
  title: "Picture Frames by Color - Custom Sizes | Custom Frame Sizes",
  description:
    "Shop custom picture frames by color. Black, white, gold, brown, silver finishes in sizes 4×4 to 48×72 inches. Expert craftsmanship with instant pricing.",
  openGraph: {
    title: "Picture Frames by Color - Custom Sizes",
    description:
      "Explore custom frames by color: black, white, gold, brown, silver, and specialty finishes. Expert craftsmanship in any size.",
    type: "website",
  },
};

export default function FramesByColorPage() {
  // Breadcrumb Schema for SERP breadcrumb trails
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
    ],
  };

  // FAQ Schema for "People Also Ask" rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What's the most popular picture frame color?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Black picture frames represent our highest-demand color, offering timeless versatility that complements both color and monochrome artwork. White frames follow as second most popular, particularly for contemporary and minimalist interiors. Natural wood tones and gold metallic finishes maintain strong demand for traditional and formal framing applications.",
        },
      },
      {
        "@type": "Question",
        name: "Should I choose black or white picture frames?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Black frames create dramatic emphasis and gallery-quality presentation, working best on light-colored walls with high contrast. White frames suggest clean contemporary styling and work particularly well with bright modern compositions, color photography, and Scandinavian-inspired interiors. Consider your wall color, artwork palette, and existing décor when selecting between black and white finishes.",
        },
      },
      {
        "@type": "Question",
        name: "Do gold frames work in modern interiors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contemporary gold frames integrate successfully into modern spaces when selecting brushed gold or champagne metallic finishes rather than traditional ornate styles. Use gold frames strategically as accent pieces paired with white mats and clean compositions to balance traditional finish with modern presentation. Avoid overwhelming entire gallery walls with gold—mix with neutral colors for sophisticated results.",
        },
      },
      {
        "@type": "Question",
        name: "How do I match frame color to my artwork?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Identify dominant or accent colors within your artwork and select frame finishes echoing these tones. Neutral colors (black, white, natural wood) provide versatile foundations suitable for diverse artwork styles. For colored frames, use shades slightly different from artwork colors to prevent competition for viewer attention. Test frame samples against artwork under actual lighting conditions before final selection.",
        },
      },
      {
        "@type": "Question",
        name: "Can I mix different frame colors on the same wall?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mixing frame colors creates dynamic gallery walls when executed with intentional strategy. Establish clear organization patterns—alternating two colors in checkerboard arrangement, grouping similar colors in clusters, or creating ombre gradients. Maintain consistent frame widths across different colors to preserve visual unity. Avoid random color distribution which appears disorganized.",
        },
      },
    ],
  };

  // CollectionPage Schema for better semantic understanding
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Picture Frames by Color",
    description:
      "Browse custom picture frames by color: black, white, gold, brown, silver, and specialty finishes. Expert craftsmanship in sizes from 4×4 to 48×72 inches.",
    url: `${brandConfig.seo?.canonicalUrl || "https://customframesizes.com"}/frames/colors`,
    inLanguage: "en-US",
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section - Mobile optimized */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-8 md:py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                Picture Frames by Color
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-6">
                Same art, different frame color? Completely different vibe. Black frames make
                everything look gallery-ready. White feels clean and modern. Natural wood adds
                warmth. Browse by color below.
              </p>
            </div>
          </div>
        </section>

        {/* Color Grid - Mobile optimized with cleaner cards */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {orderedColors.map((color) => (
                <Link
                  key={color.colorName}
                  href={`/frames/colors/${color.slug}`}
                  data-testid={`card-color-${color.slug}`}
                >
                  <Card className="hover-elevate active-elevate-2 overflow-hidden h-full cursor-pointer">
                    {/* Image - Optimized aspect ratio for mobile */}
                    <div className="aspect-[16/10] md:aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={color.image}
                        alt={`${color.displayName} picture frames in custom sizes`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <div
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-border flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                          aria-label={`${color.displayName} color swatch`}
                        />
                        <h2 className="text-lg md:text-xl font-bold leading-tight">
                          {color.displayName} Frames
                        </h2>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                        {color.count} {color.count === 1 ? "style" : "styles"} available
                      </p>
                      {/* Description - Hidden on mobile for cleaner UI */}
                      <p className="hidden md:block text-sm text-muted-foreground mb-4 line-clamp-2">
                        {color.description}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full min-h-11 text-sm"
                        data-testid={`button-view-${color.slug}`}
                      >
                        View {color.displayName} Frames
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section - Below Fold */}
        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-12">
              {/* Why Color Matters */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Why Frame Color Actually Changes Everything
                </h2>
                <p className="text-muted-foreground mb-4">
                  A bright watercolor in a chunky black frame? Pops off the wall. Same piece in
                  honey-toned natural wood? Suddenly feels warm and organic. The frame color
                  isn&apos;t decorative—it&apos;s half the visual equation.
                </p>
                <p className="text-muted-foreground mb-4">
                  Black frames create gallery-quality contrast. White frames brighten and modernize.
                  Natural wood adds warmth. Gold frames add prestige. Each color tells a different
                  story about your art.
                </p>
                <p className="text-muted-foreground">
                  Browse frames by color to see how the same artwork transforms with different
                  finishes. Our color categories help you find frames that match your aesthetic
                  vision.
                </p>
              </div>

              {/* Popular Colors Guide */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Popular Frame Color Guide</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Black Frames</h3>
                    <p className="text-muted-foreground">
                      The most versatile frame color. Black frames work with everything—color
                      photography, black and white prints, fine art, and contemporary pieces. They
                      create strong contrast and gallery-quality presentation.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">White Frames</h3>
                    <p className="text-muted-foreground">
                      Clean and contemporary. White frames brighten artwork and work particularly
                      well with color photography, modern art, and Scandinavian-inspired interiors.
                      They create a fresh, minimalist aesthetic.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Natural Wood Frames</h3>
                    <p className="text-muted-foreground">
                      Warm and organic. Natural wood frames add texture and warmth to any space.
                      Perfect for nature photography, botanical prints, and eco-friendly interiors.
                      Each frame showcases unique grain patterns.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Gold Frames</h3>
                    <p className="text-muted-foreground">
                      Elegant and prestigious. Gold frames add luxury and formality to fine art,
                      certificates, and formal portraits. Choose brushed gold for modern spaces or
                      ornate gold for traditional settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
