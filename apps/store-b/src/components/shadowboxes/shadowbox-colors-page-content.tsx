"use client";

/**
 * Shadow boxes by color hub — origina-store-b/client/src/pages/shadowboxes/ShadowboxColors.tsx
 * Color metadata & counts from @framecraft/core (shadowbox-color-images).
 */

import {
  getFrameStyles,
  getShadowboxColorCounts,
  getShadowboxColorHubImage,
  SHADOWBOX_COLOR_METADATA,
} from "@framecraft/core";
import { Badge, Button, Card, CardContent } from "@framecraft/ui";
import { Box, Disc3, Heart, Music, Shield, Shirt, Trophy, Ruler } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";

import {
  buildShadowboxColorsCollectionJsonLd,
  buildShadowboxColorsFaqJsonLd,
} from "./shadowbox-colors-json-ld";

export function ShadowboxColorsPageContent() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const frames = useMemo(() => getFrameStyles(), []);

  const orderedColors = useMemo(() => {
    const colorCounts = getShadowboxColorCounts(frames);
    return Object.entries(SHADOWBOX_COLOR_METADATA)
      .sort((a, b) => (colorCounts[b[0]] || 0) - (colorCounts[a[0]] || 0))
      .map(([colorName, metadata]) => ({
        ...metadata,
        colorName,
        count: colorCounts[colorName] || 0,
        image: getShadowboxColorHubImage(colorName, frames),
      }));
  }, [frames]);

  const faqJsonLd = useMemo(() => buildShadowboxColorsFaqJsonLd(), []);

  const collectionJsonLd = useMemo(
    () =>
      buildShadowboxColorsCollectionJsonLd(
        orderedColors.map((c) => ({
          displayName: c.displayName,
          slug: c.slug,
          description: c.description,
        }))
      ),
    [orderedColors]
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/30 to-background py-8 md:py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Shadow Box Frames by Color</h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-6">
                The right color does more than match your decor -- it sets the mood for your entire display. A classic black frame lets your keepsakes take center stage, while a warm walnut adds richness to your wall. Browsing by color is the fastest way to find your shadow box.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {orderedColors.map((color) => (
                <Link key={color.colorName} href={`/shadowboxes/${color.slug}-shadowbox-frames`}>
                  <Card className="hover-elevate active-elevate-2 overflow-hidden h-full cursor-pointer" data-testid={`card-color-${color.slug}`}>
                    <div className="aspect-[16/10] md:aspect-[4/3] overflow-hidden">
                      <img
                        src={color.image}
                        alt={`${color.displayName} shadow box frames for custom memorabilia display`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-border flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                          aria-label={`${color.displayName} color swatch`}
                        />
                        <h3 className="text-xl md:text-2xl font-bold" data-testid={`text-color-${color.slug}`}>
                          {color.displayName}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3" data-testid={`text-count-${color.slug}`}>
                        {color.count} {color.count === 1 ? "style" : "styles"} available
                      </p>
                      <p className="text-sm text-muted-foreground mb-4 hidden md:block">{color.description}</p>
                      <div className="hidden md:flex flex-wrap gap-2 mb-4">
                        {color.designStyle.split(", ").map((style, idx) => (
                          <Badge key={`${color.slug}-style-${idx}`} variant="secondary" className="text-xs">
                            {style}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full" variant="outline" data-testid={`button-view-${color.slug}`}>
                        View {color.displayName} Shadow Boxes
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
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Color Sets the Tone</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
                  Think about the feeling you want your display to create. A crisp white shadow box gives a wedding bouquet an airy, romantic quality. A deep espresso frame lends weight and gravitas to military medals. A natural oak finish makes travel souvenirs feel warm and lived-in. Color isn&apos;t just decoration -- it&apos;s part of the story you&apos;re telling. That&apos;s why we&apos;ve organized our entire curated collection by finish, so you can start with the feeling and find the frame.
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
                  Classic black remains our most requested finish -- it&apos;s versatile, timeless, and works with practically any display. Close behind are our walnut and cherry wood tones, favorites for sports memorabilia and military honors. White and off-white frames are beloved for weddings, baby keepsakes, and botanical displays. And for those looking to make a statement, our metallic silver and gold options add a touch of occasion to any shadow box.
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Our boutique selection goes well beyond standard black and white. You&apos;ll find weathered gray finishes that pair beautifully with coastal and travel themes, rich mahogany tones for a distinguished look, and even two-tone mouldings that combine a dark exterior with a lighter interior reveal. Every finish is chosen with care to complement the kinds of items our customers most love to display.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                How to Choose Shadow Box Colors by Memorabilia Type
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <Trophy className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">Sports Jerseys & Uniforms</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Black shadow boxes deliver professional stadium-style presentation suited to team jerseys, creating dramatic displays that emphasize uniform colors and player signatures. White frames provide clean gallery aesthetics ideal for light-colored jerseys and signed memorabilia requiring bright contemporary styling.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Consider your display location, use team-color-matching frames for dedicated fan caves where thematic consistency matters, or select neutral colors for living spaces requiring broader décor integration. Brown and natural wood frames add traditional warmth to vintage jerseys and retro uniforms.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Shield className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">Military Medals & Awards</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Gold and brown shadow box frames bring traditional formal elegance appropriate for military honors, campaign medals, and service awards requiring dignified presentation. These classic finishes echo military tradition while providing sophisticated backdrop for ribbon colors and metallic insignia.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Black shadow boxes modernize military displays for contemporary interiors, creating sleek professional presentation suitable for office environments and modern homes. Silver frames add refined metallic sophistication well-matched to air force memorabilia and modern service recognition.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Music className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">Music Memorabilia</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Natural wood and brown shadow boxes complement vintage vinyl records with warm organic tones that echo classic album era aesthetics. These finishes work beautifully for jazz collections, classic rock memorabilia, and retro music displays requiring period-appropriate presentation.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Black frames modernize concert posters, signed guitars, and contemporary music collectibles with bold dramatic styling. White shadow boxes create gallery-quality presentation for album artwork and signed photographs requiring clean contemporary aesthetics that work in modern listening rooms.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Heart className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">Personal Heirlooms</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Match shadow box colors to family décor for seamless interior integration, brown frames suit traditional homes with wood furniture, while white complements modern minimalist spaces. Natural wood finishes bridge styles, working equally well in transitional and contemporary settings.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      White shadow boxes excel for wedding memorabilia including preserved bouquets, invitations, and dress fabrics requiring pristine elegant presentation. Gold frames add formal sophistication to family crests, genealogy documents, and ceremonial items deserving prestigious display treatment.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shadow Box Color Gallery Wall Combinations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-3">Matching Color Series</h3>
                    <p className="text-sm text-muted-foreground">
                      Create cohesive themed displays using identical shadow box colors throughout your gallery wall. All-black sports memorabilia walls deliver professional stadium aesthetics tailored to team shrines featuring jerseys, signed balls, and championship collectibles. Matching color series emphasize collection unity while maintaining clean visual consistency across multiple frames and varied memorabilia types.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-3">Complementary Contrast</h3>
                    <p className="text-sm text-muted-foreground">
                      Alternate black and white shadow boxes in checkerboard patterns for dynamic visual interest across diverse memorabilia collections. This high-contrast approach works beautifully mixing dark and light collectibles, creating rhythm through frame color variation while maintaining professional gallery presentation. Establish clear alternating patterns rather than random distribution for intentional design impact.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-3">Metallic Accent Walls</h3>
                    <p className="text-sm text-muted-foreground">
                      Gold and silver shadow boxes create prestigious award walls designed to display medals, trophies, and championship memorabilia requiring formal elegant presentation. Mix metallic finishes strategically, cluster similar colors in groups or alternate metallics with neutral frames for sophisticated variation. Metallic accent walls work particularly well in offices, trophy rooms, and formal display spaces.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-3">Natural Wood Warmth</h3>
                    <p className="text-sm text-muted-foreground">
                      Brown and natural wood shadow boxes create inviting warm gallery walls crafted to showcase vintage heirloom collections, family memorabilia, and traditional displays. These organic tones work beautifully in living rooms and bedrooms requiring cozy intimate presentation. Mix different wood tones subtly or maintain consistent finish for unified traditional elegance across your shadow box collection.
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
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Questions we hear most</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">What frame color works best for a sports jersey shadow box?</h3>
                    <p className="text-sm text-muted-foreground">
                      It depends on the jersey. Many customers match the frame to one of the team&apos;s colors -- a black frame for a dark jersey, or a walnut or cherry frame for warmer-colored uniforms. When in doubt, classic black is always a safe and sharp-looking choice.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">Do the frame colors look the same in person as online?</h3>
                    <p className="text-sm text-muted-foreground">
                      We work hard to photograph and display our finishes accurately. That said, monitor settings can shift colors slightly. Our product images are taken in natural light to give you the most honest representation of each finish.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">Can I match a shadow box frame to my existing decor?</h3>
                    <p className="text-sm text-muted-foreground">
                      Absolutely. Browsing by color is the best way to coordinate your shadow box with your wall color, furniture, and other frames in the room. If you&apos;re creating a grouping of frames, sticking to the same finish family (all wood tones or all blacks, for example) creates a cohesive look.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-3">Do you offer natural unfinished wood frames?</h3>
                    <p className="text-sm text-muted-foreground">
                      We carry several natural wood-tone options that showcase the grain and warmth of real wood. These are finished with a clear protective coat to prevent damage, while keeping that natural, organic look.
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
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Shadow Box Depth Options</h2>
              <p className="text-base md:text-lg text-muted-foreground mb-8">
                Shadow box frames come in multiple depth profiles to accommodate different types of memorabilia. Whether you&apos;re framing a jersey, vinyl record, military medals, or collectible figurines, choosing the right depth ensures your items are securely displayed without compression.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <Ruler className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Standard Depth (1.5&quot;)</h3>
                    <p className="text-sm text-muted-foreground">
                      Accommodates medals, pins, photos with mat borders, and flat memorabilia
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Box className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Deep Profile (2.5&quot;)</h3>
                    <p className="text-sm text-muted-foreground">
                      Ideal for vinyl records, folded jerseys, thicker collectibles, and shadow displays
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Shield className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Extra Deep (3.5&quot;)</h3>
                    <p className="text-sm text-muted-foreground">
                      Best for full-size jerseys, large memorabilia, and complex multi-layer displays
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
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Popular Shadow Box Applications</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/record-album-frames" data-testid="link-record-album-frames">
                  <Card className="hover-elevate active-elevate-2 cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Disc3 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Record Album Frames</h3>
                          <p className="text-sm text-muted-foreground">
                            Display your vinyl collection with specialized shadow box frames designed for 12&quot; LP records
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
                            Preserve sports jerseys and team memorabilia with deep-profile shadow box frames
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

        <section className="container mx-auto px-4 py-12 border-t bg-muted/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">More Ways to Browse</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/shadowboxes/depth">
                <Card className="hover-elevate h-full" data-testid="link-crosslink-depth">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">Browse by Depth</h3>
                    <p className="text-sm text-muted-foreground">Standard, medium, deep, and ultra deep options.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/shadowboxes/styles">
                <Card className="hover-elevate h-full" data-testid="link-crosslink-styles">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">Browse by Style</h3>
                    <p className="text-sm text-muted-foreground">Classic, modern, rustic, natural, and statement frames.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/shadowbox/deep-frames">
                <Card className="hover-elevate h-full" data-testid="link-crosslink-deep-frames">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">Deep Shadowboxes</h3>
                    <p className="text-sm text-muted-foreground">All our deepest frames for large 3D items.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Preserve Your Memories?</h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                Choose your shadow box color and explore frames designed to protect and showcase your most treasured items.
              </p>
              <Button size="lg" variant="default" asChild data-testid="button-browse-all">
                <Link href="/shadowbox">Browse All Shadow Boxes</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
