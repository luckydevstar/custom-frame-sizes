"use client";

/**
 * Deep shadowbox depth guide — origina-store-b/client/src/pages/DeepShadowboxFrames.tsx
 */

import { getFrameSlug, getFrameStyles, resolveFramePhotoUrl } from "@framecraft/core";
import { Badge, Button, Card, CardContent } from "@framecraft/ui";
import type { FrameStyle } from "@framecraft/types";
import { ArrowRight, Box, Layers, Ruler, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";

import { KeyFeaturesBar } from "@/components/marketing/key-features-bar";

import { buildDeepShadowboxFramesFaqJsonLd } from "./deep-shadowbox-frames-json-ld";

export function DeepShadowboxFramesPageContent() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allFrames = useMemo(
    () => getFrameStyles().filter((f) => f.category === "shadowbox") as FrameStyle[],
    []
  );

  const depthTiers = useMemo(() => {
    const tiers = [
      {
        label: "Standard Depth",
        range: '0.75"-0.875"',
        min: 0.7,
        max: 0.9,
        items: "Medals, coins, photos, flat collectibles",
        color: "bg-muted-foreground/15",
      },
      {
        label: "Medium Depth",
        range: '1"-1.5"',
        min: 0.95,
        max: 1.55,
        items: "Folded fabric, thick documents, stacked coins",
        color: "bg-muted-foreground/25",
      },
      {
        label: "Deep Profile",
        range: '1.25"-2.5"',
        min: 1.2,
        max: 2.6,
        items: "Jerseys, sports memorabilia, flowers, bulky items",
        color: "bg-muted-foreground/35",
      },
      {
        label: "Ultra Deep",
        range: '3.5"',
        min: 3,
        max: 4,
        items: "Helmets, sculptures, championship belts",
        color: "bg-primary",
      },
    ];

    return tiers.map((tier) => ({
      ...tier,
      frames: allFrames.filter((f) => f.usableDepth >= tier.min && f.usableDepth <= tier.max),
    }));
  }, [allFrames]);

  const faqSchema = buildDeepShadowboxFramesFaqJsonLd();

  const faqQuestions = faqSchema.mainEntity as Array<{
    name: string;
    acceptedAnswer: { "@type": string; text: string };
  }>;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">Depth Guide</Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-deep-frames-title">
                Shadowbox Frames by Depth
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto" data-testid="text-deep-frames-subtitle">
                From flat medals to full-size helmets, we have the right depth for every display. Compare all four tiers
                side by side and find the frame that fits your item.
              </p>
            </div>
          </div>
        </section>

        <KeyFeaturesBar />

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">Depth at a Glance</h2>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {depthTiers.map((tier) => (
                  <div key={tier.label} className="flex flex-col items-center text-center">
                    <div className="w-full max-w-[80px] mx-auto mb-3">
                      <div
                        className={`${tier.color} rounded-t-md mx-auto`}
                        style={{
                          width: "60px",
                          height:
                            tier.label === "Standard Depth"
                              ? "22px"
                              : tier.label === "Medium Depth"
                                ? "38px"
                                : tier.label === "Deep Profile"
                                  ? "56px"
                                  : "88px",
                        }}
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold ${tier.label === "Ultra Deep" ? "text-primary" : ""}`}
                    >
                      {tier.label}
                    </span>
                    <span
                      className={`text-lg font-bold ${tier.label === "Ultra Deep" ? "text-primary" : "text-foreground"}`}
                    >
                      {tier.range}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">{tier.items}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {tier.frames.length} frame{tier.frames.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {depthTiers.map((tier, tierIndex) => (
          <section key={tier.label} className={`py-12 ${tierIndex % 2 === 0 ? "bg-muted/20" : "bg-background"}`}>
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{tier.label}</h2>
                  {tier.label === "Ultra Deep" && <Badge>Our Deepest</Badge>}
                </div>
                <p className="text-muted-foreground mb-2">
                  <strong>Depth:</strong> {tier.range} &nbsp;|&nbsp; <strong>Best for:</strong> {tier.items}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {tier.frames.length} frame{tier.frames.length !== 1 ? "s" : ""} available in this depth range
                </p>

                {tier.frames.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tier.frames.map((frame) => {
                      const slug = getFrameSlug(frame.id);
                      const thumb = frame.thumbnail ? resolveFramePhotoUrl(frame.thumbnail) : "";
                      return (
                        <Card key={frame.id}>
                          <CardContent className="pt-4 pb-4">
                            {thumb ? (
                              <div className="h-16 rounded mb-2 overflow-hidden">
                                <img
                                  src={thumb}
                                  alt={`${frame.name} shadowbox frame`}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                  data-testid={`img-depth-frame-${frame.id}`}
                                />
                              </div>
                            ) : (
                              <div
                                className="h-16 rounded mb-2"
                                style={{
                                  background: `linear-gradient(135deg, ${frame.color} 0%, ${frame.borderColor} 100%)`,
                                }}
                              />
                            )}
                            <h3 className="text-sm font-semibold mb-1 line-clamp-2">{frame.name}</h3>
                            <div className="text-xs text-muted-foreground mb-2">
                              <span>
                                Depth: {frame.usableDepth}
                                {'"'}
                              </span>
                              <span className="mx-1">|</span>
                              <span>
                                Width: {frame.mouldingWidth}
                                {'"'}
                              </span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full" asChild data-testid={`button-depth-frame-${frame.id}`}>
                              <Link href={slug ? `/shadowbox/${slug}` : `/shadowbox/designer?frame=${encodeURIComponent(frame.id)}`}>
                                View Frame
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Frames in this depth range are available in the designer,
                    <Link href="/shadowbox" className="text-primary underline ml-1">
                      start designing
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>
          </section>
        ))}

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">How to Choose the Right Depth</h2>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <Ruler className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-1">Measure Your Item</h3>
                    <p className="text-sm text-muted-foreground">
                      Measure the thickest part from front to back. Add at least a quarter inch of clearance so nothing
                      presses against the acrylic front.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Layers className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-1">Account for Layers</h3>
                    <p className="text-sm text-muted-foreground">
                      If you&apos;re placing items at different planes, like a photo behind a medal, add up all the layers
                      plus spacing between them.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Box className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-1">When in Doubt, Go Deeper</h3>
                    <p className="text-sm text-muted-foreground">
                      A little extra depth looks fine, but an item pressing against the acrylic doesn&apos;t. If you&apos;re
                      between two options, pick the deeper one.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Shield className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-1">All Depths, Same Quality</h3>
                    <p className="text-sm text-muted-foreground">
                      Every frame uses solid wood mouldings, acid-free backing, and framer&apos;s grade acrylic,
                      regardless of depth tier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Common Items and Recommended Depth</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <h3 className="font-semibold mb-2">Standard Depth (0.875&quot;)</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Pinned medals and ribbons</li>
                      <li>Mounted coins (single layer)</li>
                      <li>Ticket stubs and programs</li>
                      <li>Pressed flowers (flat)</li>
                      <li>Photos with dimensional matting</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <h3 className="font-semibold mb-2">Medium Depth (1&quot; to 1.5&quot;)</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Folded fabric swatches</li>
                      <li>Thick certificate displays</li>
                      <li>Stacked coin sets</li>
                      <li>Small figurines</li>
                      <li>Photo + object layered displays</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <h3 className="font-semibold mb-2">Deep Profile (1.25&quot; to 2.5&quot;)</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Folded jerseys</li>
                      <li>Sports memorabilia</li>
                      <li>Dried flower bouquets (moderate)</li>
                      <li>Military medal arrangements</li>
                      <li>Multi-item shadow boxes</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <h3 className="font-semibold mb-2 text-primary">Ultra Deep (3.5&quot;)</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Full-size helmets</li>
                      <li>Championship belts</li>
                      <li>Thick sculptures and figurines</li>
                      <li>Oversized dried bouquets</li>
                      <li>Combat boots and bulky gear</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Questions we hear most</h2>
              <div className="space-y-4">
                {faqQuestions.map((faq, i) => (
                  <div key={faq.name} className="bg-card rounded-lg border p-5">
                    <h3 className="font-semibold mb-2" data-testid={`text-depth-faq-q-${i}`}>
                      {faq.name}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-depth-faq-a-${i}`}>
                      {faq.acceptedAnswer?.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Pick a frame, set your size, and see your price instantly. Every shadowbox is custom-cut and hand-assembled.
            </p>
            <Button size="lg" asChild data-testid="button-depth-start-designing">
              <Link href="/shadowbox">
                Design Your Shadowbox
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
