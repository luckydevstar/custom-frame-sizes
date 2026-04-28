"use client";

/**
 * Browse shadowboxes by style — origina-store-b/client/src/pages/shadowboxes/ShadowboxesByStyle.tsx
 */

import { getFrameSlug, getFrameStyles, resolveFramePhotoUrl } from "@framecraft/core";
import { Button, Card, CardContent } from "@framecraft/ui";
import type { FrameStyle } from "@framecraft/types";
import { ArrowRight, Box, Ruler } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";

import { buildShadowboxesByStyleFaqJsonLd } from "./shadowboxes-by-style-json-ld";

type ShadowboxListingFrame = FrameStyle & { displayName?: string };

interface StyleCategory {
  id: string;
  label: string;
  description: string;
  hex: string;
  slug: string;
  frameIds: string[];
}

/** Curated shadowbox listings by aesthetic — IDs from origina STYLE_CATEGORIES */
const STYLE_CATEGORIES: StyleCategory[] = [
  {
    id: "classic",
    label: "Classic",
    description:
      "Clean profiles with timeless appeal. Solid matte and gloss finishes that work in any room. The safe choice that always looks right.",
    hex: "#1a1a1a",
    slug: "classic",
    frameIds: [
      "standard-depth-matte-black",
      "standard-depth-bright-white",
      "extra-deep-matte-black",
      "extra-deep-bright-white",
      "ultra-deep-matte-black",
      "ultra-deep-bright-white",
      "deep-slim-matte-black",
      "standard-depth-modern-white",
      "standard-depth-modern-black",
    ],
  },
  {
    id: "modern",
    label: "Modern",
    description:
      "Sleek lines, glossy finishes, and metallic tones. Brushed silver, warm gold, and high-gloss options that feel current and polished.",
    hex: "#C0C0C0",
    slug: "modern",
    frameIds: [
      "medium-depth-gloss-white",
      "medium-depth-glossy-black",
      "medium-depth-stainless-silver",
      "medium-depth-gold",
      "deep-architectural-matte-black",
      "deep-charcoal-satin",
    ],
  },
  {
    id: "rustic",
    label: "Rustic & Barnwood",
    description:
      "Weathered textures and reclaimed wood character. Distressed finishes that add farmhouse warmth. Every frame looks a little different, that is the point.",
    hex: "#8B4513",
    slug: "rustic",
    frameIds: [
      "deep-rustic-walnut",
      "standard-depth-barn-black",
      "standard-depth-barn-blue",
      "standard-depth-coastal-whitewash",
    ],
  },
  {
    id: "natural-wood",
    label: "Natural Wood",
    description:
      "Real wood grain you can see and feel. Oak, maple, and walnut tones with minimal finish. Organic warmth for spaces that want something real.",
    hex: "#D2B48C",
    slug: "natural-wood",
    frameIds: [
      "standard-depth-honey-oak",
      "deep-natural-maple",
      "standard-depth-natural-wood",
      "extra-deep-rich-walnut",
      "ultra-deep-two-tone-walnut",
      "standard-depth-modern-brown",
    ],
  },
  {
    id: "statement",
    label: "Statement & Wide Profile",
    description:
      "Wide mouldings and bold depth for items that demand attention. These frames do not fade into the wall. They are part of the display.",
    hex: "#2C2C2C",
    slug: "statement",
    frameIds: ["deep-wide-profile-black", "ultra-deep-matte-black", "ultra-deep-bright-white", "ultra-deep-two-tone-walnut"],
  },
];

function frameProductHref(frameId: string): string {
  return `/shadowbox/${getFrameSlug(frameId)}`;
}

export function ShadowboxesByStylePageContent() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allShadowboxes = useMemo(() => {
    return getFrameStyles().filter((f) => f.category === "shadowbox") as ShadowboxListingFrame[];
  }, []);

  const faqJsonLd = buildShadowboxesByStyleFaqJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/30 to-background py-8 md:py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Shadowbox Frames by Style</h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                Your shadowbox is part of your room. The style should match. Clean and modern. Warm and rustic. Bold and
                dramatic. Pick the look that fits your space, then customize the size.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto space-y-12">
            {STYLE_CATEGORIES.map((style) => {
              const styleFrames = allShadowboxes.filter((f) => style.frameIds.includes(f.id));
              if (styleFrames.length === 0) return null;

              return (
                <div key={style.id} className="scroll-mt-20" id={style.slug} data-testid={`section-style-${style.slug}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-border flex-shrink-0"
                      style={{ backgroundColor: style.hex }}
                    />
                    <h2 className="text-xl md:text-2xl font-bold">{style.label}</h2>
                    <span className="text-sm text-muted-foreground">({styleFrames.length} frames)</span>
                  </div>
                  <p className="text-muted-foreground mb-4 max-w-2xl">{style.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {styleFrames.map((frame) => {
                      const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
                      const rawThumb = cornerImage?.url || frame.thumbnail;
                      const thumbnailSrc = rawThumb ? resolveFramePhotoUrl(rawThumb) : "";
                      return (
                        <Link key={frame.id} href={frameProductHref(frame.id)}>
                          <Card
                            className="hover-elevate active-elevate-2 overflow-hidden h-full cursor-pointer"
                            data-testid={`card-frame-${frame.id}`}
                          >
                            <div className="aspect-square overflow-hidden bg-muted/30">
                              {thumbnailSrc ? (
                                <img
                                  src={thumbnailSrc}
                                  alt={`${frame.name} shadowbox frame`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : null}
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-sm leading-tight mb-1">{frame.displayName ?? frame.name}</h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Box className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-xs text-muted-foreground">{frame.usableDepth}&quot; depth</span>
                                <span className="text-xs text-muted-foreground">·</span>
                                <Ruler className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-xs text-muted-foreground">{frame.mouldingWidth}&quot; moulding</span>
                              </div>
                              <Button
                                variant="outline"
                                className="w-full mt-3 text-xs"
                                size="sm"
                                data-testid={`button-design-${frame.id}`}
                              >
                                Design This Frame
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto space-y-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Choosing a Shadowbox Style</h2>
              <p className="text-muted-foreground mb-3">
                Think about where the frame will hang. A rustic barnwood shadowbox looks right at home in a den or cabin.
                A sleek modern frame fits a contemporary living room. Classic black or white works everywhere.
              </p>
              <p className="text-muted-foreground">
                Then think about what is inside. A vintage baseball mitt looks great in a rustic frame. A military display
                deserves the weight of a classic or statement frame. Wedding keepsakes glow in natural wood or bright
                white.
              </p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Style Questions</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card" data-testid="faq-most-popular">
                  <h3 className="font-semibold mb-1">Which style is most popular?</h3>
                  <p className="text-sm text-muted-foreground">
                    Classic matte black and white are our best sellers. They match any item and any room. Natural wood
                    tones are a close second for people who want warmth without a strong design statement.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card" data-testid="faq-mixing-styles">
                  <h3 className="font-semibold mb-1">Can I mix styles on the same wall?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, but keep it to two styles max. Match the color family even if the textures differ. Classic black
                    and natural wood pair well. Rustic and high-gloss modern can feel like two different rooms.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card" data-testid="faq-wedding">
                  <h3 className="font-semibold mb-1">Best style for wedding keepsakes?</h3>
                  <p className="text-sm text-muted-foreground">
                    Bright white or natural wood. White keeps the focus on the items inside. Natural wood adds warmth for a
                    living room or bedroom. Both are popular for bouquets, shoes, and invitation displays.
                  </p>
                </div>
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
              <Link href="/shadowboxes/colors">
                <Card className="hover-elevate h-full" data-testid="link-crosslink-colors">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">Browse by Color</h3>
                    <p className="text-sm text-muted-foreground">
                      Black, white, brown, gold, silver, blue, and natural finishes.
                    </p>
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

        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">See Every Option Side by Side</h2>
            <p className="text-muted-foreground mb-6">
              Open the designer to compare frame styles on your exact size. Swap between styles with one click to see what
              looks best.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button size="lg" className="min-h-11" asChild data-testid="button-open-designer">
                <Link href="/shadowbox/designer">Open the Designer</Link>
              </Button>
              <Button size="lg" variant="outline" className="min-h-11" asChild data-testid="button-browse-by-depth">
                <Link href="/shadowboxes/depth">Browse by Depth</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
