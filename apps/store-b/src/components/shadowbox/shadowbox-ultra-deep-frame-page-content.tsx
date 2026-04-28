"use client";

import { getFrameStyleById, resolveFramePhotoUrl } from "@framecraft/core";
import {
  ArrowRight,
  Award,
  Box,
  ChevronLeft,
  ChevronRight,
  Layers,
  Ruler,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { KeyFeaturesBar } from "@/components/marketing/key-features-bar";

import { Button } from "@framecraft/ui/components/ui/button";
import { ShadowboxDesigner } from "@framecraft/ui";

/** origina-store-b/pages/UltraDeepMatteBlack.tsx + UltraDeepBrightWhite.tsx merged */
export function ShadowboxUltraDeepFramePageContent({
  variant,
}: {
  variant: "black" | "white";
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [variant]);

  const frameId = variant === "black" ? "ultra-deep-matte-black" : "ultra-deep-bright-white";
  const frameData = getFrameStyleById(frameId);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const lifestyleImages = useMemo(() => {
    let all = frameData?.alternateImages?.filter((img) => img.type === "lifestyle") ?? [];
    const resolved = all.map((img) => ({
      ...img,
      url: resolveFramePhotoUrl(img.url),
    }));
    all = [...resolved];
    if (!clientReady || all.length <= 1) return resolved;
    const shuffled = [...all];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = shuffled[i];
      const b = shuffled[j];
      if (a !== undefined && b !== undefined) {
        shuffled[i] = b;
        shuffled[j] = a;
      }
    }
    return shuffled;
  }, [frameData, clientReady]);

  const diagUrl =
    variant === "black"
      ? resolveFramePhotoUrl(frameData?.dimensionalDiagram ?? "")
      : resolveFramePhotoUrl(frameData?.dimensionalDiagram ?? "");

  const iso = (): string =>
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: variant === "black" ? "Ultra Deep Black Shadow Box Frame" : "Ultra Deep White Shadow Box Frame",
      description:
        variant === "black"
          ? "3.5 inches of usable depth in matte black, our deepest shadowbox frame for helmets, sculptures, thick memorabilia, and oversized keepsakes."
          : "3.5 inches of usable depth in bright white, our deepest shadowbox frame for helmets, sculptures, thick memorabilia, and oversized keepsakes.",
      brand: { "@type": "Brand", name: "ShadowboxFrames.com" },
      category: "Shadowbox Frames",
      material: "Solid Wood",
      color: variant === "black" ? "Matte Black" : "Bright White",
    });

  const faqLd = (): string =>
    variant === "black"
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How deep is the Ultra Deep shadowbox frame?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The Ultra Deep shadowbox has 3.5 inches of usable interior depth, our deepest frame by far. It fits full-size helmets, thick sculptures, oversized dried bouquets, and stacked memorabilia arrangements.",
              },
            },
            {
              "@type": "Question",
              name: "What items fit in a 3.5-inch deep shadowbox?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Items up to 3.5 inches thick fit comfortably: football and baseball helmets, thick sculpture, oversized dried flower bouquets, multi-layer memorial displays, stacked collectible arrangements, large medals with ribbons, championship belts, bulky baby shoes, and deep mixed-media art.",
              },
            },
            {
              "@type": "Question",
              name: "What is the moulding width on the Ultra Deep frame?",
              acceptedAnswer: {
                "@type": "Answer",
                text: 'The moulding is 1¼ inches wide, slightly wider than our standard deep frames. The wider profile supports the extra depth and gives the frame a substantial, gallery-ready look on the wall.',
              },
            },
          ],
        })
      : JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How deep is the Ultra Deep white shadowbox frame?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The Ultra Deep white shadowbox has 3.5 inches of usable interior depth, our deepest frame by far. It fits full-size helmets, thick sculptures, oversized dried bouquets, and stacked memorabilia arrangements.",
              },
            },
            {
              "@type": "Question",
              name: "What items fit in a 3.5-inch deep white shadowbox?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Items up to 3.5 inches thick fit comfortably: football and baseball helmets, thick sculpture, oversized dried flower bouquets, multi-layer memorial displays, stacked collectible arrangements, large medals with ribbons, championship belts, bulky baby shoes, and deep mixed-media art.",
              },
            },
            {
              "@type": "Question",
              name: "Why choose white over black for a deep shadowbox?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "White keeps heavy, dimensional contents from feeling visually heavy on the wall. It works especially well for sentimental displays in living rooms and bedrooms where you want warmth without weight, wedding bouquets, baby keepsakes, and memorial arrangements.",
              },
            },
          ],
        });

  const builtItemsBlack = [
    { title: "Helmets", desc: "Football, baseball, motorcycle, military, full-size helmets fit with room for a mat border." },
    { title: "Thick Memorabilia", desc: "Championship belts, stacked medals, bulky awards, and layered sports collectibles." },
    { title: "Dried Bouquets", desc: "Oversized wedding bouquets, thick floral arrangements, and dimensional pressed flowers." },
    { title: "Sculptures & Art", desc: "Small sculptures, thick mixed-media pieces, and dimensional wall art." },
    { title: "Memorial Displays", desc: "Multi-layer arrangements with photos, medals, flags, and personal items." },
    { title: "Baby Keepsakes", desc: "Bulky baby shoes, christening outfits, and first-year milestone collections." },
  ];

  const builtItemsWhite = [
    { title: "Wedding Bouquets", desc: "Oversized dried bouquets and thick floral arrangements preserved in their full shape." },
    { title: "Baby Keepsakes", desc: "Bulky baby shoes, christening outfits, first-year milestone items, and nursery mementos." },
    { title: "Memorial Displays", desc: "Multi-layer arrangements with photos, medals, flags, and personal items." },
    { title: "Helmets", desc: "Football, baseball, motorcycle, military, full-size helmets fit with room for a mat border." },
    { title: "Sculptures & Art", desc: "Small sculptures, thick mixed-media pieces, and dimensional wall art." },
    { title: "Thick Memorabilia", desc: "Championship belts, stacked medals, bulky awards, and layered sports collectibles." },
  ];

  const builtItems = variant === "black" ? builtItemsBlack : builtItemsWhite;

  const faqSection =
    variant === "black"
      ? [
          {
            test: "faq-depth",
            title: "How deep is the Ultra Deep frame?",
            body:
              '3.5 inches of usable interior depth, our deepest frame by far. The total profile height is 4 inches from wall to front.',
          },
          {
            test: "faq-items",
            title: "What items fit inside 3.5 inches?",
            body:
              "Full-size helmets, thick sculptures, oversized dried bouquets, championship belts, stacked medals, multi-layer memorial displays, bulky baby keepsakes, and deep mixed-media art. Anything up to 3.5 inches thick fits with room to spare.",
          },
          {
            test: "faq-moulding",
            title: "Why is the moulding wider than other frames?",
            body:
              "The 1¼-inch moulding width supports the extra depth. A wider profile gives the frame more strength and a heavier, gallery-ready look on the wall that matches the scale of the items inside.",
          },
          {
            test: "faq-sizing",
            title: "Can I order any custom size?",
            body: "Yes. Enter any width and height in the designer above and get instant pricing. Every frame is cut to your exact measurements.",
          },
        ]
      : [
          {
            test: "faq-depth",
            title: "How deep is the Ultra Deep white frame?",
            body:
              "3.5 inches of usable interior depth, our deepest frame by far. The total profile height is 4 inches from wall to front.",
          },
          {
            test: "faq-items",
            title: "What items fit inside 3.5 inches?",
            body:
              "Full-size helmets, thick sculptures, oversized dried bouquets, championship belts, stacked medals, multi-layer memorial displays, bulky baby keepsakes, and deep mixed-media art. Anything up to 3.5 inches thick fits with room to spare.",
          },
          {
            test: "faq-white-vs-black",
            title: "Why choose white over black?",
            body:
              "White keeps heavy, dimensional contents from feeling visually heavy on the wall. It works especially well for sentimental displays, wedding bouquets, baby keepsakes, and memorial arrangements, in living rooms and bedrooms.",
          },
          {
            test: "faq-sizing",
            title: "Can I order any custom size?",
            body: "Yes. Enter any width and height in the designer above and get instant pricing. Every frame is cut to your exact measurements.",
          },
        ];

  const intro =
    variant === "black" ? (
      <>
        <p className="text-muted-foreground mb-3">
          Most shadowboxes max out around 2 to 2.5 inches of depth. This one gives you 3.5 inches, significantly more room than any other option. That is enough space for full-size helmets, thick sculptures, bulky dried bouquets, or multi-layer memorial displays.
        </p>
        <p className="text-muted-foreground mb-3">
          Your items sit well behind the acrylic front with room to spare. No pressing, no cramming, no compromise. The 1¼-inch-wide matte black moulding supports the extra depth and gives the frame a solid, gallery-ready look on the wall.
        </p>
        <p className="text-muted-foreground">
          The matte black finish absorbs light and pushes attention inward. Thick, dimensional objects appear to float inside the frame instead of sitting flat against a surface.
        </p>
      </>
    ) : (
      <>
        <p className="text-muted-foreground mb-3">
          Most shadowboxes max out around 2 to 2.5 inches of depth. This one gives you 3.5 inches, significantly more room than any other option. That is enough space for full-size helmets, thick sculptures, bulky dried bouquets, or multi-layer memorial displays.
        </p>
        <p className="text-muted-foreground mb-3">
          Your items sit well behind the acrylic front with room to spare. No pressing, no cramming, no compromise. The 1¼-inch-wide bright white moulding supports the extra depth and gives the frame a clean, gallery-ready look.
        </p>
        <p className="text-muted-foreground">
          White keeps heavy, dimensional contents from feeling visually heavy on the wall. This makes it ideal for living rooms, bedrooms, and nurseries, spaces where you want warmth without weight.
        </p>
      </>
    );

  const dimAlt =
    variant === "black"
      ? "Dimensional diagram of ultra deep black shadowbox frame showing 4 inch total height, 1¼ inch moulding width, and 3⅝ inch usable depth"
      : "Dimensional diagram of ultra deep white shadowbox frame showing 4 inch total height, 1¼ inch moulding width, and 3⅝ inch usable depth";

  const dimTest = variant === "black" ? "img-ultra-deep-black-dim" : "img-ultra-deep-white-dim";

  const finishLabel = variant === "black" ? "Matte Black" : "Bright White";
  const sku = frameData?.sku ?? (variant === "black" ? "83946" : "83947");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: iso() }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd() }} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Layers className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">Our Deepest Frame</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-[1.1]">
              <span className="text-foreground">
                {variant === "black" ? "Ultra Deep Black Shadowbox Frame" : "Ultra Deep White Shadowbox Frame"}
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-2 leading-snug max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              3.5 inches of display depth. Nearly twice as deep as our next-deepest frame.
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto italic mb-4" data-testid="text-short-description">
              {frameData?.shortDescription ?? ""}
            </p>

            <div className="flex justify-center gap-3 flex-wrap mt-6">
              <Button
                size="lg"
                onClick={() => {
                  document.querySelector("[data-designer-anchor]")?.scrollIntoView({ behavior: "smooth" });
                }}
                data-testid="button-design-shadowbox-hero"
              >
                Design Your Shadowbox
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center" data-testid="benefit-depth">
                <Box className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">3.5&quot; Usable Depth</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">Our Deepest Frame</p>
              </div>
              <div className="text-center" data-testid="benefit-moulding">
                <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">1¼&quot; Moulding</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">Wide Solid Wood</p>
              </div>
              <div className="text-center" data-testid="benefit-acrylic">
                <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Acrylic Front</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">Shatter-Resistant</p>
              </div>
              <div className="text-center" data-testid="benefit-custom">
                <Zap className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Any Custom Size</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">Instant Pricing</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12 border-b">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Built for Items Other Frames Can&apos;t Hold</h2>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>{intro}</div>
              <div className="rounded-lg overflow-hidden border shadow-sm">
                {diagUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- legacy asset URLs from catalog
                  <img src={diagUrl} alt={dimAlt} className="w-full h-auto bg-white p-4" loading="lazy" data-testid={dimTest} />
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12 border-b bg-muted/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">What Fits Inside 3.5 Inches of Depth</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {builtItems.map((item, i) => (
                <div key={item.title} className="p-4 rounded-lg border bg-card" data-testid={`card-use-case-${i}`}>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-6 md:py-8" data-designer-anchor>
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <ShadowboxDesigner defaultFrameId={frameId} embedded />
            </div>
          </div>
        </section>

        {lifestyleImages.length > 0 ? (
          <section className="container mx-auto px-4 py-8 md:py-12 border-b bg-muted/10">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">See It in Action</h2>
              <p className="text-muted-foreground text-center mb-6">Real ideas for what fits inside 3.5 inches of depth</p>
              <div className="relative">
                <div className="overflow-hidden rounded-lg border shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lifestyleImages[carouselIndex]?.url}
                    alt={
                      lifestyleImages[carouselIndex]?.alt ||
                      (variant === "black" ? "Ultra Deep Black Shadowbox lifestyle" : "Ultra Deep White Shadowbox lifestyle")
                    }
                    className="w-full aspect-[4/3] object-cover"
                    data-testid="img-lifestyle-carousel"
                  />
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={() =>
                    setCarouselIndex((prev) => (prev - 1 + lifestyleImages.length) % lifestyleImages.length)
                  }
                  data-testid="button-carousel-prev"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={() => setCarouselIndex((prev) => (prev + 1) % lifestyleImages.length)}
                  data-testid="button-carousel-next"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {carouselIndex + 1} / {lifestyleImages.length}
                </div>
              </div>
              <div className="grid grid-cols-7 md:grid-cols-10 gap-1.5 mt-3">
                {lifestyleImages.slice(0, 10).map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCarouselIndex(i)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      carouselIndex === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    data-testid={`button-lifestyle-thumb-${i}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <KeyFeaturesBar
          features={[
            { icon: Zap, title: "Instant Pricing", subtitle: "See Your Cost as You Customize", testId: "benefit-instant-pricing" },
            { icon: Ruler, title: "Any Custom Size", subtitle: "Built to Fit Your Exact Items", testId: "benefit-custom-size" },
            { icon: Box, title: '3.5" Ultra Deep', subtitle: "Nearly 2x Our Next-Deepest Frame", testId: "benefit-ultra-deep" },
            { icon: Award, title: "Frame Shop Quality", subtitle: "Solid Wood Construction", testId: "benefit-professional" },
          ]}
        />

        <section className="container mx-auto px-4 py-8 md:py-12 border-b">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Technical Specifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Moulding Width:</span>
                  <span className="text-muted-foreground">1¼ inches</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Usable Depth:</span>
                  <span className="text-muted-foreground">3.5 inches</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Total Height:</span>
                  <span className="text-muted-foreground">4 inches</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Finish:</span>
                  <span className="text-muted-foreground">{finishLabel}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Material:</span>
                  <span className="text-muted-foreground">Solid Wood</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">SKU:</span>
                  <span className="text-muted-foreground">{sku}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12 border-b bg-muted/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Common Questions</h2>
            <div className="space-y-4">
              {faqSection.map((faq) => (
                <div key={faq.test} className="p-4 rounded-lg border bg-card" data-testid={faq.test}>
                  <h3 className="font-semibold mb-1">{faq.title}</h3>
                  <p className="text-sm text-muted-foreground">{faq.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Frame Something Big?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Design your ultra deep shadowbox with our easy tool. Get instant pricing and a real-time preview.
            </p>
            <Button
              size="lg"
              onClick={() => document.querySelector("[data-designer-anchor]")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-design-shadowbox-cta"
            >
              Start Designing Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
