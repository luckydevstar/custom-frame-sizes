import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, CardContent, Badge } from "@framecraft/ui";
import { Box, Shield, Ruler, Disc3, Shirt, Trophy, Music, Heart } from "lucide-react";
import {
  getFrameStyles,
  SHADOWBOX_COLOR_METADATA,
  getShadowboxColorCounts,
  getShadowboxColorHubImage,
} from "@framecraft/core";
import { brandConfig } from "../../../brand.config";

const frames = getFrameStyles();
const colorCounts = getShadowboxColorCounts(
  frames as Parameters<typeof getShadowboxColorCounts>[0]
);
const orderedColors = Object.entries(SHADOWBOX_COLOR_METADATA)
  .sort((a, b) => (colorCounts[b[0]] || 0) - (colorCounts[a[0]] || 0))
  .map(([colorName, metadata]) => ({
    ...metadata,
    colorName,
    count: colorCounts[colorName] || 0,
    image: getShadowboxColorHubImage(
      colorName,
      frames as Parameters<typeof getShadowboxColorHubImage>[1]
    ),
  }));

export const metadata: Metadata = {
  title: "Shadowbox Frames by Color - Custom Depth Display Cases | Custom Frame Sizes",
  description:
    "Professional shadowbox frames in 7 color finishes: black, white, brown, silver, gold, blue, and natural wood. Deep-profile display cases for sports jerseys, military medals, vinyl records, and memorabilia.",
  keywords:
    "shadowbox frames by color, black shadowbox, white shadowbox, brown shadowbox frames, gold shadowbox frames, silver shadowbox display case, blue shadowbox, natural wood shadowbox, jersey display frames, medal display case, memorabilia frames",
  openGraph: {
    title: "Shadowbox Frames by Color - Custom Depth Display Cases | Custom Frame Sizes",
    description:
      "Professional shadowbox frames in 7 color finishes for sports jerseys, military medals, and memorabilia. Professional-grade preservation with UV protection.",
    type: "website",
  },
  alternates: { canonical: "/shadowbox-frames/colors" },
};

const baseUrl = brandConfig.seo?.canonicalUrl || "https://customframesizes.com";

export default function ShadowboxColorsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shadowboxes by Color",
        item: `${baseUrl}/shadowbox-frames/colors`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What's the best shadowbox color for sports jerseys?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Black shadowbox frames are most popular for sports jerseys, creating professional stadium-style displays that emphasize team colors and signatures. White shadowboxes work beautifully for light-colored jerseys and signed memorabilia requiring clean gallery presentation.",
        },
      },
      {
        "@type": "Question",
        name: "Should I match shadowbox color to team colors or room décor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Prioritize room décor integration for shadowboxes displayed in living spaces. Use team-color-matching frames for dedicated fan caves and sports rooms. For versatile displays, select neutral black, white, or brown shadowboxes.",
        },
      },
      {
        "@type": "Question",
        name: "Do dark shadowboxes protect memorabilia better than light ones?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Frame color does not affect UV protection or preservation quality—these depend on glazing selection and archival materials. Choose frame colors based on design preferences while selecting UV-protective glazing for proper memorabilia preservation.",
        },
      },
      {
        "@type": "Question",
        name: "Can I mix different shadowbox colors on the same wall?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mixing shadowbox colors creates dynamic gallery walls when executed with intentional strategy. Alternate two complementary colors, group similar colors in clusters, or create visual rhythm. Maintain consistent frame widths and depth profiles for visual unity.",
        },
      },
      {
        "@type": "Question",
        name: "What shadowbox color works best for vintage memorabilia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Brown and natural wood shadowbox frames complement vintage memorabilia with warm traditional elegance. Gold frames add formal sophistication to vintage military medals and formal awards. Black frames modernize vintage items for contemporary interiors.",
        },
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shadowbox Frames by Color",
    description:
      "Browse custom shadowbox frames by color: black, white, brown, silver, gold, blue, and natural finishes. Deep-profile frames for memorabilia, jerseys, medals, and three-dimensional collectibles.",
    url: `${baseUrl}/shadowbox-frames/colors`,
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      name: "Shadowbox Frame Colors",
      numberOfItems: orderedColors.length,
      itemListElement: orderedColors.map((color, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${color.displayName} Shadowbox Frames`,
        url: `${baseUrl}/shadowbox-frames/colors/${color.slug}`,
        description: color.description,
      })),
    },
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
                Shadowbox Frames by Color
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-6">
                Browse our curated collection of custom shadowbox frames organized by finish color.
                Deep-profile frames designed to preserve and showcase your three-dimensional
                treasures—from sports jerseys to military medals.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {orderedColors.map((color) => (
                <Link
                  key={color.colorName}
                  href={`/shadowbox-frames/colors/${color.slug}`}
                  data-testid={`card-color-${color.slug}`}
                >
                  <Card className="hover-elevate active-elevate-2 overflow-hidden h-full cursor-pointer">
                    <div className="aspect-[16/10] md:aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={color.image}
                        alt={`${color.displayName} shadowbox frames for custom memorabilia display`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-border flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                          aria-label={`${color.displayName} color swatch`}
                        />
                        <h2
                          className="text-xl md:text-2xl font-bold"
                          data-testid={`text-color-${color.slug}`}
                        >
                          {color.displayName}
                        </h2>
                      </div>
                      <p
                        className="text-sm text-muted-foreground mb-3"
                        data-testid={`text-count-${color.slug}`}
                      >
                        {color.count} {color.count === 1 ? "style" : "styles"} available
                      </p>
                      <p className="text-sm text-muted-foreground mb-4 hidden md:block">
                        {color.description}
                      </p>
                      <div className="hidden md:flex flex-wrap gap-2 mb-4">
                        {color.designStyle.split(", ").map((style, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {style}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        className="w-full"
                        variant="outline"
                        data-testid={`button-view-${color.slug}`}
                      >
                        View {color.displayName} Shadowboxes
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Shadowbox Color Matters</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
                  Frame color dramatically impacts how your memorabilia integrates with your
                  interior. Dark shadowbox colors like black and brown create professional-grade
                  presentation with dramatic depth. Light colors including white and natural wood
                  suggest contemporary gallery styling.
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
                  Consider whether your shadowbox should match or contrast with memorabilia
                  colors—matching creates cohesive thematic displays ideal for team collections,
                  while contrasting emphasizes individual items. Metallic finishes like gold and
                  silver add formal elegance for awards and championship memorabilia.
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Frame color operates independently from preservation quality—UV protection depends
                  on glazing selection. Choose shadowbox colors based on design preferences while
                  selecting proper archival materials and UV-protective glazing for optimal
                  memorabilia preservation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                How to Choose Shadowbox Colors by Memorabilia Type
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <Trophy className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">Sports Jerseys & Uniforms</h3>
                    <p className="text-sm text-muted-foreground">
                      Black shadowboxes deliver professional stadium-style presentation. White
                      frames provide clean gallery aesthetics for light-colored jerseys. Brown and
                      natural wood add traditional warmth to vintage jerseys.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Shield className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">Military Medals & Awards</h3>
                    <p className="text-sm text-muted-foreground">
                      Gold and brown shadowbox frames offer traditional formal elegance for military
                      honors. Black shadowboxes modernize military displays for contemporary
                      interiors. Silver frames add refined metallic sophistication.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Music className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">Music Memorabilia</h3>
                    <p className="text-sm text-muted-foreground">
                      Natural wood and brown shadowboxes complement vintage vinyl records. Black
                      frames modernize concert posters and signed guitars. White shadowboxes create
                      gallery-quality presentation for album artwork.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Heart className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">Personal Heirlooms</h3>
                    <p className="text-sm text-muted-foreground">
                      Match shadowbox colors to family décor for seamless integration. White
                      shadowboxes excel for wedding memorabilia including preserved bouquets and
                      invitations. Gold frames add formal sophistication to family crests and
                      ceremonial items.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Shadowbox Depth Options</h2>
              <p className="text-base md:text-lg text-muted-foreground mb-8">
                Shadowbox frames come in multiple depth profiles to accommodate different types of
                memorabilia. Whether you&apos;re framing a jersey, vinyl record, military medals, or
                collectible figurines, choosing the right depth ensures your items are securely
                displayed without compression.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <Ruler className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Standard Depth (1.5&quot;)</h3>
                    <p className="text-sm text-muted-foreground">
                      Perfect for medals, pins, photos with mat borders, and flat memorabilia
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Box className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Deep Profile (2.5&quot;)</h3>
                    <p className="text-sm text-muted-foreground">
                      Ideal for vinyl records, folded jerseys, thicker collectibles, and shadow
                      displays
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Shield className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Extra Deep (3.5&quot;)</h3>
                    <p className="text-sm text-muted-foreground">
                      Best for full-size jerseys, large memorabilia, and complex multi-layer
                      displays
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">
                      What&apos;s the best shadowbox color for sports jerseys?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Black shadowbox frames are most popular for sports jerseys, creating
                      professional stadium-style displays. White shadowboxes work beautifully for
                      light-colored jerseys and signed memorabilia. Consider matching your frame
                      color to dominant team colors or select contrasting colors to make jerseys
                      stand out.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">
                      Should I match shadowbox color to team colors or room décor?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Prioritize room décor integration for shadowboxes in living spaces, bedrooms,
                      and offices. Use team-color-matching frames for dedicated fan caves and sports
                      rooms. For versatile displays, select neutral black, white, or brown
                      shadowboxes that complement both your collectibles and surrounding
                      furnishings.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">
                      Do dark shadowboxes protect memorabilia better than light ones?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Frame color does not affect UV protection or preservation quality—these depend
                      on glazing selection and archival materials. Darker frame colors visually
                      minimize dust visibility and create professional presentation. Choose frame
                      colors based on design preferences while selecting UV-protective glazing and
                      acid-free backing for proper preservation.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">
                      Can I mix different shadowbox colors on the same wall?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Mixing shadowbox colors creates dynamic gallery walls when executed with
                      intentional strategy. Alternate two complementary colors in checkerboard
                      patterns, group similar colors in thematic clusters, or create visual rhythm
                      with repeating sequences. Maintain consistent frame widths and depth profiles
                      to preserve visual unity.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">
                      What shadowbox color works best for vintage memorabilia?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Brown and natural wood shadowbox frames complement vintage memorabilia with
                      warm traditional elegance. These finishes work well for vinyl records, vintage
                      photographs, heirloom textiles, and aged collectibles. Gold frames add formal
                      sophistication to vintage military medals and formal awards. Black frames
                      modernize vintage items for contemporary interior integration.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Popular Shadowbox Applications
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/record-album-frames" data-testid="link-record-album-frames">
                  <Card className="hover-elevate active-elevate-2 cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Disc3 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Record Album Frames</h3>
                          <p className="text-sm text-muted-foreground">
                            Display your vinyl collection with specialized shadowbox frames designed
                            for 12&quot; LP records
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/jersey-frames" data-testid="link-jersey-frames">
                  <Card className="hover-elevate active-elevate-2 cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Shirt className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Jersey Display Frames</h3>
                          <p className="text-sm text-muted-foreground">
                            Preserve sports jerseys and team memorabilia with deep-profile shadowbox
                            frames
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Preserve Your Memories?
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                Choose your shadowbox color and explore frames designed to protect and showcase your
                most treasured items.
              </p>
              <Button size="lg" variant="default" asChild data-testid="button-browse-all">
                <Link href="/shadowbox/designer">Browse All Shadowboxes</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
