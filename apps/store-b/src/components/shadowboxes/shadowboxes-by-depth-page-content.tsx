"use client";

/**
 * Browse shadowboxes by depth — origina-store-b/client/src/pages/shadowboxes/ShadowboxesByDepth.tsx
 * Frame list from @framecraft/core getFrameStyles; links use /shadowbox/[slug] via getFrameSlug.
 */

import { getFrameSlug, getFrameStyles, resolveFramePhotoUrl } from "@framecraft/core";
import { Button, Card, CardContent } from "@framecraft/ui";
import type { FrameStyle } from "@framecraft/types";
import { ArrowRight, Box, Layers, Ruler } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { buildShadowboxesByDepthFaqJsonLd } from "./shadowboxes-by-depth-json-ld";

type ShadowboxListingFrame = FrameStyle & {
  displayName?: string;
};

interface DepthTier {
  id: string;
  label: string;
  range: string;
  description: string;
  bestFor: string[];
  color: string;
  barHeight: number;
}

const DEPTH_TIERS: DepthTier[] = [
  {
    id: "standard",
    label: "Standard",
    range: '0.875"',
    description:
      "The go-to for flat keepsakes. Medals, coins, photos, ticket stubs, and thin collectibles sit perfectly behind the acrylic.",
    bestFor: ["Medals & pins", "Flat photos", "Ticket stubs", "Coins & patches"],
    color: "hsl(var(--primary))",
    barHeight: 25,
  },
  {
    id: "medium",
    label: "Medium",
    range: '1" | 1.5"',
    description:
      "A step up for items with some thickness. Small figurines, folded fabric, stacked coins, and thick documents all fit comfortably.",
    bestFor: ["Folded fabric", "Small figurines", "Thick documents", "Stacked coins"],
    color: "hsl(var(--primary))",
    barHeight: 40,
  },
  {
    id: "deep",
    label: "Deep Profile",
    range: '1.25" | 2.5"',
    description:
      "Built for items that need real room. Folded jerseys, dried flowers, sports memorabilia, and multi-layer displays all fit with space to spare.",
    bestFor: ["Folded jerseys", "Dried flowers", "Sports gear", "Layered displays"],
    color: "hsl(var(--primary))",
    barHeight: 65,
  },
  {
    id: "ultra-deep",
    label: "Ultra Deep",
    range: '3.5"',
    description:
      "Our deepest frame. Full helmets, thick sculptures, oversized bouquets, championship belts, and bulky keepsakes that nothing else can hold.",
    bestFor: ["Helmets", "Sculptures", "Oversized bouquets", "Championship belts"],
    color: "hsl(var(--primary))",
    barHeight: 100,
  },
];

function FrameProfileIcon({ heightPercent, className = "" }: { heightPercent: number; className?: string }) {
  const totalH = Math.max(24, (heightPercent / 100) * 64);
  const faceW = totalH * 0.5;
  const depthH = totalH;
  const lipH = totalH * 0.22;
  const thick = Math.max(3, totalH * 0.12);
  const svgW = faceW;
  const svgH = depthH;

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      fill="currentColor"
      className={`flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d={[
          `M 0,0`,
          `L ${faceW},0`,
          `L ${faceW},${lipH}`,
          `L ${thick},${lipH}`,
          `L ${thick},${svgH}`,
          `L 0,${svgH}`,
          `Z`,
        ].join(" ")}
      />
    </svg>
  );
}

function getDepthTier(depth: number): string {
  if (depth <= 0.875) return "standard";
  if (depth <= 1.5) return "medium";
  if (depth <= 2.5) return "deep";
  return "ultra-deep";
}

function frameProductHref(frameId: string): string {
  return `/shadowbox/${getFrameSlug(frameId)}`;
}

export function ShadowboxesByDepthPageContent() {
  const [activeTier, setActiveTier] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shadowboxFrames = useMemo(() => {
    return getFrameStyles()
      .filter((f) => f.category === "shadowbox")
      .map((f) => ({
        ...(f as ShadowboxListingFrame),
        tier: getDepthTier(f.usableDepth ?? 0),
      }));
  }, []);

  const filteredFrames = activeTier ? shadowboxFrames.filter((f) => f.tier === activeTier) : shadowboxFrames;

  const sortedFrames = [...filteredFrames].sort((a, b) => a.usableDepth - b.usableDepth);

  const faqJsonLd = buildShadowboxesByDepthFaqJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/30 to-background py-8 md:py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                <Layers className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">Browse by Depth</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Shadowbox Frames by Depth</h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                Not sure how deep your shadowbox needs to be? Start with your item. We have four depth tiers, from thin keepsakes to full-size helmets. Pick the one that fits.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12 border-b">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Pick Your Depth</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {DEPTH_TIERS.map((tier) => {
                const count = shadowboxFrames.filter((f) => f.tier === tier.id).length;
                const isActive = activeTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setActiveTier(isActive ? null : tier.id)}
                    className={`relative rounded-lg border-2 p-4 text-left transition-colors ${
                      isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                    data-testid={`button-depth-tier-${tier.id}`}
                  >
                    <div className="flex items-end gap-2 mb-3 h-16">
                      <FrameProfileIcon
                        heightPercent={tier.barHeight}
                        className={isActive ? "text-primary" : "text-primary/70"}
                      />
                      <div className="text-right flex-1">
                        <p className="text-lg md:text-xl font-bold leading-none">{tier.range}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm mb-0.5">{tier.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {count} {count === 1 ? "frame" : "frames"}
                    </p>
                  </button>
                );
              })}
            </div>
            {activeTier && (
              <div className="mt-4 text-center">
                <Button variant="ghost" size="sm" onClick={() => setActiveTier(null)} data-testid="button-clear-filter">
                  Show all depths
                </Button>
              </div>
            )}
          </div>
        </section>

        {activeTier && (
          <section className="container mx-auto px-4 py-6 border-b bg-muted/10">
            <div className="max-w-4xl mx-auto">
              {(() => {
                const tier = DEPTH_TIERS.find((t) => t.id === activeTier);
                if (!tier) return null;
                return (
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {tier.label} Depth, {tier.range}
                      </h3>
                      <p className="text-muted-foreground mb-3">{tier.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {tier.bestFor.map((item) => (
                          <span
                            key={item}
                            className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-end justify-center gap-4 h-32">
                      {DEPTH_TIERS.map((t) => (
                        <div key={t.id} className="flex flex-col items-center gap-1">
                          <FrameProfileIcon
                            heightPercent={t.barHeight}
                            className={t.id === activeTier ? "text-primary" : "text-muted-foreground/30"}
                          />
                          <span
                            className={`text-[0.6rem] ${t.id === activeTier ? "font-bold text-primary" : "text-muted-foreground"}`}
                          >
                            {t.range}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              {activeTier ? `${DEPTH_TIERS.find((t) => t.id === activeTier)?.label} Frames` : "All Shadowbox Frames"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {activeTier
                ? `${sortedFrames.length} frames at ${DEPTH_TIERS.find((t) => t.id === activeTier)?.range} depth`
                : `${sortedFrames.length} frames across all depth tiers`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {sortedFrames.map((frame) => {
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
                            alt={`${frame.name} | ${frame.usableDepth}" usable depth`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm leading-tight">{frame.displayName ?? frame.name}</h3>
                          {frame.usableDepth >= 3.5 && (
                            <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary whitespace-nowrap flex-shrink-0">
                              DEEPEST
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Box className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">
                            {frame.usableDepth}&quot; depth
                          </span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <Ruler className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">
                            {frame.mouldingWidth}&quot; moulding
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className="w-4 h-4 rounded-full border border-border flex-shrink-0"
                            style={{ backgroundColor: frame.color }}
                          />
                          <span className="text-xs text-muted-foreground">{frame.colorName}</span>
                        </div>
                        <Button variant="outline" className="w-full mt-3 text-xs" size="sm" data-testid={`button-design-${frame.id}`}>
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
        </section>

        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto space-y-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">How to Pick the Right Depth</h2>
              <p className="text-muted-foreground mb-3">
                Grab your item. Measure the thickest part from back to front. Add about a quarter inch so it does not press
                against the acrylic. That number is the minimum depth you need.
              </p>
              <p className="text-muted-foreground">
                If you are not sure, go one tier deeper. A little extra room looks better than a tight fit. Your items
                will sit naturally behind the glass instead of being squeezed in.
              </p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Depth Questions</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card" data-testid="faq-what-depth">
                  <h3 className="font-semibold mb-1">What depth do I need for a folded jersey?</h3>
                  <p className="text-sm text-muted-foreground">
                    A folded jersey typically needs 1.5 to 2 inches of depth. Our Deep Profile frames (1.25 to 2.5
                    inches) are the sweet spot. If the jersey is thick or you want it loosely folded, go with the 2-inch
                    or 2.5-inch option.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card" data-testid="faq-dried-bouquet">
                  <h3 className="font-semibold mb-1">How deep for a dried wedding bouquet?</h3>
                  <p className="text-sm text-muted-foreground">
                    Most dried bouquets need 2 to 3.5 inches depending on how thick the arrangement is. Smaller pressed
                    bouquets fit in our 2-inch Deep Profile frames. Oversized or loosely preserved bouquets need the
                    Ultra Deep at 3.5 inches.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card" data-testid="faq-medals">
                  <h3 className="font-semibold mb-1">Can I frame medals and pins in a standard depth?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes. Medals, pins, coins, and flat collectibles all fit in our Standard depth frames at 0.875 inches.
                    They sit flush behind the acrylic with a clean, finished look.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card" data-testid="faq-deepest">
                  <h3 className="font-semibold mb-1">What is the deepest shadowbox you offer?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our Ultra Deep frames at 3.5 inches of usable depth. Available in matte black and bright white. They
                    hold full-size helmets, sculptures, championship belts, and anything else up to 3.5 inches thick.
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
              <Link href="/shadowboxes/styles">
                <Card className="hover-elevate h-full" data-testid="link-crosslink-styles">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">Browse by Style</h3>
                    <p className="text-sm text-muted-foreground">Classic, modern, rustic, natural, and statement frames.</p>
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
              <Link href="/shadowbox/depth-guide">
                <Card className="hover-elevate h-full" data-testid="link-crosslink-depth-guide">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">Depth Guide</h3>
                    <p className="text-sm text-muted-foreground">Detailed help choosing the right depth for your items.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Sure Which Depth?</h2>
            <p className="text-muted-foreground mb-6">
              Try the designer. Pick any frame, enter your size, and see exactly what fits. Swap depths until it looks
              right.
            </p>
            <Button size="lg" className="min-h-11" asChild data-testid="button-try-designer">
              <Link href="/shadowbox/designer">Open the Shadowbox Designer</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
