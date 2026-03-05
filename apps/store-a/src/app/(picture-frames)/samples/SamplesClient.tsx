"use client";

/**
 * Sample Order Gateway Page
 * Customers can order frame, mat board, and acrylic samples
 * Frame samples: $5 for 4" piece
 * Mat samples: $3 for 2"x2" piece
 * Acrylic samples: $3 for 2"x2" piece
 * Free shipping on all samples
 */

import { useState, useMemo, useEffect } from "react";
import { Check, Truck, ChevronDown, ChevronUp, ShoppingCart, X } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@framecraft/ui";
import {
  getFrameStyles,
  getStoreBaseAssetUrl,
  getSharedAssetUrl,
  getFrameImageUrl,
  getCanvasImageUrl,
} from "@framecraft/core";
import { getRegularMats, getPremiumMats, matNeedsBorder } from "@framecraft/config";
import type { FrameStyle } from "@framecraft/types";
import type { Mat } from "@framecraft/config";

/** Frame with optional canvas-specific lifestyleImage (from frames.json). */
type FrameWithLifestyle = FrameStyle & { lifestyleImage?: string };

/**
 * Sample card image URL:
 * - Picture & shadowbox: corner/border image (exact path from frames.json when available).
 * - Canvas only: lifestyle image.
 */
function getFrameSampleImage(frame: FrameWithLifestyle): string {
  const sku = frame.sku || frame.id || "";

  if (frame.category === "canvas") {
    const path = frame.lifestyleImage;
    if (path) {
      const localPath = path.startsWith("/") ? path.slice(1) : path;
      return getStoreBaseAssetUrl(localPath);
    }
    return sku ? getCanvasImageUrl(`${sku}-lifestyle-a.jpg`) : "";
  }

  const cornerEntry = frame.alternateImages?.find((img) => img.type === "corner");
  if (cornerEntry?.url) {
    const localPath = cornerEntry.url.startsWith("/") ? cornerEntry.url.slice(1) : cornerEntry.url;
    return getStoreBaseAssetUrl(localPath);
  }

  return sku ? getFrameImageUrl(sku, "corner") : "";
}

const FRAME_SAMPLE_PRICE = 5.0;
const MAT_SAMPLE_PRICE = 3.0;
const ACRYLIC_SAMPLE_PRICE = 3.0;

const ACRYLIC_SAMPLES = [
  {
    id: "standard-acrylic",
    name: "Standard Acrylic",
    description:
      "Crystal-clear, lightweight, and shatter-resistant. Our most popular glazing option.",
  },
  {
    id: "non-glare-acrylic",
    name: "Non-Glare Acrylic",
    description:
      "Reduces reflections for artwork in brightly lit spaces. Slightly diffused appearance.",
  },
];

interface SampleSelection {
  frames: Set<string>;
  mats: Set<string>;
  acrylics: Set<string>;
}

export function SamplesClient() {
  const [selections, setSelections] = useState<SampleSelection>({
    frames: new Set(),
    mats: new Set(),
    acrylics: new Set(),
  });

  const [openSections, setOpenSections] = useState({
    pictureFrames: true,
    shadowboxFrames: true,
    canvasFrames: true,
    regularMats: true,
    premiumMats: true,
    acrylics: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allFrames = useMemo(() => getFrameStyles(), []);
  const regularMats = useMemo(() => getRegularMats(), []);
  const premiumMats = useMemo(() => getPremiumMats(), []);

  const framesByCategory = useMemo(
    () => ({
      picture: allFrames.filter((f) => f.category === "picture"),
      shadowbox: allFrames.filter((f) => f.category === "shadowbox"),
      canvas: allFrames.filter((f) => f.category === "canvas"),
    }),
    [allFrames]
  );

  const totals = useMemo(() => {
    const frameCount = selections.frames.size;
    const matCount = selections.mats.size;
    const acrylicCount = selections.acrylics.size;
    const totalItems = frameCount + matCount + acrylicCount;
    const totalPrice =
      frameCount * FRAME_SAMPLE_PRICE +
      matCount * MAT_SAMPLE_PRICE +
      acrylicCount * ACRYLIC_SAMPLE_PRICE;
    return { frameCount, matCount, acrylicCount, totalItems, totalPrice };
  }, [selections]);

  const toggleFrame = (id: string) => {
    setSelections((prev) => {
      const newFrames = new Set(prev.frames);
      if (newFrames.has(id)) newFrames.delete(id);
      else newFrames.add(id);
      return { ...prev, frames: newFrames };
    });
  };

  const toggleMat = (id: string) => {
    setSelections((prev) => {
      const newMats = new Set(prev.mats);
      if (newMats.has(id)) newMats.delete(id);
      else newMats.add(id);
      return { ...prev, mats: newMats };
    });
  };

  const toggleAcrylic = (id: string) => {
    setSelections((prev) => {
      const newAcrylics = new Set(prev.acrylics);
      if (newAcrylics.has(id)) newAcrylics.delete(id);
      else newAcrylics.add(id);
      return { ...prev, acrylics: newAcrylics };
    });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAll = () => {
    setSelections({ frames: new Set(), mats: new Set(), acrylics: new Set() });
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Custom Frame Sample Kit",
    description:
      "Order samples of our custom picture frames, mat boards, and acrylic glazing options. Frame samples are 4-inch pieces ($5 each), mat and acrylic samples are 2x2-inch pieces ($3 each). Free shipping on all sample orders.",
    brand: { "@type": "Brand", name: "Custom Frame Sizes" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: 3,
      highPrice: 5,
      offerCount: allFrames.length + regularMats.length + premiumMats.length + 2,
      availability: "https://schema.org/InStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How big are the frame samples?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Frame samples are 4-inch pieces of actual frame moulding. You can see the true color, texture, profile, and finish of the frame before ordering.",
        },
      },
      {
        "@type": "Question",
        name: "How big are the mat and acrylic samples?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mat board and acrylic samples are 2x2-inch pieces. This size lets you compare colors and textures against your artwork.",
        },
      },
      {
        "@type": "Question",
        name: "Is shipping free on sample orders?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all sample orders ship free within the United States. Samples typically arrive within 3-5 business days.",
        },
      },
      {
        "@type": "Question",
        name: "Can I return unused samples?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Samples are non-refundable. They are yours to keep and use for future framing projects.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.customframesizes.com" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Samples",
        item: "https://www.customframesizes.com/samples",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto px-4 py-8 max-w-screen-xl pb-32">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-page-title">
            Order Frame & Mat Samples
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            See our materials in person before you order. Frame samples are 4-inch pieces of actual
            moulding. Mat and acrylic samples are 2x2-inch pieces. Choose what you need below.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-4 py-2 rounded-full">
            <Truck className="w-5 h-5" />
            <span className="font-medium">Free Shipping on All Samples</span>
          </div>
        </div>

        {/* Frame Samples Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6" data-testid="text-section-frames">
            Frame Samples
          </h2>
          <p className="text-muted-foreground mb-6">
            Each frame sample is a 4-inch piece of actual moulding. Feel the weight, see the true
            color, and check the profile before ordering.
          </p>

          <Collapsible
            open={openSections.pictureFrames}
            onOpenChange={() => toggleSection("pictureFrames")}
            className="mb-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mb-2"
                data-testid="button-toggle-picture-frames"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold">Picture Frames</span>
                  <Badge variant="secondary">{framesByCategory.picture.length} styles</Badge>
                </span>
                {openSections.pictureFrames ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {framesByCategory.picture.map((frame) => (
                  <FrameSampleCard
                    key={frame.id}
                    frame={frame}
                    selected={selections.frames.has(frame.id)}
                    onToggle={() => toggleFrame(frame.id)}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {framesByCategory.shadowbox.length > 0 && (
            <Collapsible
              open={openSections.shadowboxFrames}
              onOpenChange={() => toggleSection("shadowboxFrames")}
              className="mb-4"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between mb-2"
                  data-testid="button-toggle-shadowbox-frames"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-semibold">Shadowbox Frames</span>
                    <Badge variant="secondary">{framesByCategory.shadowbox.length} styles</Badge>
                  </span>
                  {openSections.shadowboxFrames ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {framesByCategory.shadowbox.map((frame) => (
                    <FrameSampleCard
                      key={frame.id}
                      frame={frame}
                      selected={selections.frames.has(frame.id)}
                      onToggle={() => toggleFrame(frame.id)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {framesByCategory.canvas.length > 0 && (
            <Collapsible
              open={openSections.canvasFrames}
              onOpenChange={() => toggleSection("canvasFrames")}
              className="mb-4"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between mb-2"
                  data-testid="button-toggle-canvas-frames"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-semibold">Canvas Frames</span>
                    <Badge variant="secondary">{framesByCategory.canvas.length} styles</Badge>
                  </span>
                  {openSections.canvasFrames ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {framesByCategory.canvas.map((frame) => (
                    <FrameSampleCard
                      key={frame.id}
                      frame={frame}
                      selected={selections.frames.has(frame.id)}
                      onToggle={() => toggleFrame(frame.id)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </section>

        <Separator className="my-8" />

        {/* Mat Samples Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6" data-testid="text-section-mats">
            Mat Board Samples
          </h2>
          <p className="text-muted-foreground mb-6">
            Each mat sample is a 2x2-inch piece. Compare colors against your artwork and see the
            texture and core color in person.
          </p>

          <Collapsible
            open={openSections.regularMats}
            onOpenChange={() => toggleSection("regularMats")}
            className="mb-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mb-2"
                data-testid="button-toggle-regular-mats"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold">Standard Mat Boards</span>
                  <Badge variant="secondary">{regularMats.length} colors</Badge>
                </span>
                {openSections.regularMats ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                {regularMats.map((mat) => (
                  <MatSampleCard
                    key={mat.id}
                    mat={mat}
                    selected={selections.mats.has(mat.id)}
                    onToggle={() => toggleMat(mat.id)}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={openSections.premiumMats}
            onOpenChange={() => toggleSection("premiumMats")}
            className="mb-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mb-2"
                data-testid="button-toggle-premium-mats"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold">Premium Mat Boards</span>
                  <Badge variant="secondary">{premiumMats.length} colors</Badge>
                </span>
                {openSections.premiumMats ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                {premiumMats.map((mat) => (
                  <MatSampleCard
                    key={mat.id}
                    mat={mat}
                    selected={selections.mats.has(mat.id)}
                    onToggle={() => toggleMat(mat.id)}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        <Separator className="my-8" />

        {/* Acrylic Samples Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6" data-testid="text-section-acrylics">
            Acrylic Glazing Samples
          </h2>
          <p className="text-muted-foreground mb-6">
            Compare our glazing options side by side. Each sample is a 2x2-inch piece of actual
            acrylic.
          </p>

          <Collapsible
            open={openSections.acrylics}
            onOpenChange={() => toggleSection("acrylics")}
            className="mb-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mb-2"
                data-testid="button-toggle-acrylics"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold">Acrylic Options</span>
                  <Badge variant="secondary">2 types</Badge>
                </span>
                {openSections.acrylics ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ACRYLIC_SAMPLES.map((acrylic) => (
                  <AcrylicSampleCard
                    key={acrylic.id}
                    acrylic={acrylic}
                    selected={selections.acrylics.has(acrylic.id)}
                    onToggle={() => toggleAcrylic(acrylic.id)}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* FAQ Section for SEO */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">How big are the frame samples?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Frame samples are 4-inch pieces of actual frame moulding. You can see the true
                  color, texture, profile, and finish of the frame before ordering.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">How big are the mat and acrylic samples?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mat board and acrylic samples are 2x2-inch pieces. This size lets you compare
                  colors and textures against your artwork.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Is shipping free on sample orders?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, all sample orders ship free within the United States. Samples typically
                  arrive within 3-5 business days.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Can I return unused samples?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Samples are non-refundable. They are yours to keep and use for future framing
                  projects.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Floating Cart Summary */}
      {totals.totalItems > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50"
          data-testid="container-floating-cart"
        >
          <div className="container mx-auto px-4 py-4 max-w-screen-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-semibold">
                    {totals.totalItems} sample{totals.totalItems !== 1 ? "s" : ""}
                  </span>
                </div>
                {totals.frameCount > 0 && (
                  <Badge variant="outline">
                    {totals.frameCount} frame{totals.frameCount !== 1 ? "s" : ""}
                  </Badge>
                )}
                {totals.matCount > 0 && (
                  <Badge variant="outline">
                    {totals.matCount} mat{totals.matCount !== 1 ? "s" : ""}
                  </Badge>
                )}
                {totals.acrylicCount > 0 && (
                  <Badge variant="outline">
                    {totals.acrylicCount} acrylic{totals.acrylicCount !== 1 ? "s" : ""}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  data-testid="button-clear-samples"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold" data-testid="text-total-price">
                    ${totals.totalPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Free shipping
                  </div>
                </div>
                <Button size="lg" className="min-w-[140px]" data-testid="button-add-to-cart">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FrameSampleCard({
  frame,
  selected,
  onToggle,
}: {
  frame: FrameStyle;
  selected: boolean;
  onToggle: () => void;
}) {
  const imageUrl = getFrameSampleImage(frame);
  return (
    <div
      className={`group relative cursor-pointer transition-all ${selected ? "scale-[1.01]" : ""}`}
      onClick={onToggle}
      data-testid={`card-frame-sample-${frame.id}`}
    >
      <div
        className={`relative overflow-hidden rounded-lg shadow-sm ${selected ? "ring-2 ring-primary shadow-md" : "group-hover:shadow-md"}`}
      >
        <div className="aspect-square bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`${frame.name} frame sample`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        <div className="absolute top-2 right-2 z-10">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${selected ? "bg-primary text-primary-foreground" : "bg-background/80 backdrop-blur-sm border"}`}
          >
            {selected ? (
              <Check className="w-3 h-3" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full border-2 border-muted-foreground/50" />
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 px-1">
        <div className="text-sm font-medium truncate" title={frame.name}>
          {frame.name}
        </div>
        <div className="text-xs text-muted-foreground">{frame.mouldingWidth}&quot; moulding</div>
      </div>
    </div>
  );
}

function MatSampleCard({
  mat,
  selected,
  onToggle,
}: {
  mat: Mat;
  selected: boolean;
  onToggle: () => void;
}) {
  const swatchUrl = getSharedAssetUrl(`mats/swatches/${mat.swatchFile}`);
  const needsBorder = matNeedsBorder(mat);
  return (
    <div
      className={`group relative cursor-pointer transition-all ${selected ? "scale-[1.02]" : ""}`}
      onClick={onToggle}
      data-testid={`card-mat-sample-${mat.id}`}
    >
      <div
        className={`relative overflow-hidden rounded-lg shadow-sm ${selected ? "ring-2 ring-primary shadow-md" : "group-hover:shadow-md"}`}
      >
        <div className={`aspect-square ${needsBorder ? "border border-muted-foreground/20" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={swatchUrl}
            alt={`${mat.name} mat board sample`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              (target.parentElement as HTMLElement).style.backgroundColor =
                mat.hexColor || "#FFFFFF";
            }}
          />
        </div>
        <div className="absolute top-1.5 right-1.5 z-10">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${selected ? "bg-primary text-primary-foreground" : "bg-background/80 backdrop-blur-sm border"}`}
          >
            {selected ? (
              <Check className="w-3 h-3" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full border-2 border-muted-foreground/50" />
            )}
          </div>
        </div>
      </div>
      <div className="mt-1.5 px-0.5 text-center">
        <div className="text-xs font-medium truncate" title={mat.name}>
          {mat.name}
        </div>
      </div>
    </div>
  );
}

function AcrylicSampleCard({
  acrylic,
  selected,
  onToggle,
}: {
  acrylic: (typeof ACRYLIC_SAMPLES)[0];
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`group relative cursor-pointer transition-all ${selected ? "scale-[1.01]" : ""}`}
      onClick={onToggle}
      data-testid={`card-acrylic-sample-${acrylic.id}`}
    >
      <div
        className={`relative overflow-hidden rounded-lg bg-card p-4 shadow-sm ${selected ? "ring-2 ring-primary shadow-md" : "group-hover:shadow-md border"}`}
      >
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div
              className={`w-20 h-20 rounded-lg shadow-inner ${acrylic.id === "non-glare-acrylic" ? "bg-gradient-to-br from-gray-200 to-gray-300" : "bg-gradient-to-br from-sky-100 to-sky-200"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent rounded-lg" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-base mb-1">{acrylic.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">{acrylic.description}</div>
          </div>
          <div className="flex-shrink-0">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selected ? "bg-primary text-primary-foreground" : "bg-muted border"}`}
            >
              {selected ? (
                <Check className="w-4 h-4" />
              ) : (
                <div className="w-3 h-3 rounded-full border-2 border-muted-foreground/50" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
