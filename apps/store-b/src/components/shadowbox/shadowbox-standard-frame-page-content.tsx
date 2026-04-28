"use client";

import { getFrameStyleById, resolveFramePhotoUrl } from "@framecraft/core";
import type { ShadowboxStandardPageCopy, ShadowboxBarIconKey } from "@/components/shadowbox/shadowbox-standard-types";
import registry from "@/components/shadowbox/shadowbox-standard-registry.json";

import type { FrameStyle } from "@framecraft/types";
import { ArrowRight, Award, Box as BoxIcon, Ruler, Shield, Sparkles, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { KeyFeaturesBar } from "@/components/marketing/key-features-bar";

import { Button } from "@framecraft/ui/components/ui/button";
import type { GalleryImage } from "@framecraft/ui/components/shared/ImageGallery";
import { FrameDetailCarousel, ImageGallery, ShadowboxDesigner } from "@framecraft/ui";

type Registry = Record<string, ShadowboxStandardPageCopy>;

const ICONS: Record<ShadowboxBarIconKey, LucideIcon> = {
  Zap,
  Ruler,
  Box: BoxIcon,
  Award,
  Sparkles,
  Shield,
};

function normalizeGalleryImages(frameData: FrameStyle | undefined): GalleryImage[] {
  const lifestyle = frameData?.alternateImages?.filter((img) => img.type === "lifestyle") ?? [];
  return lifestyle.map((img) => ({
    url: resolveFramePhotoUrl(img.url),
    alt: img.alt,
    type: img.type,
  }));
}

/** SKU detail pages mirror origina-store-b/components/*StandardDepth*.tsx */
export function ShadowboxStandardFramePageContent({ frameId }: { frameId: string }) {
  const raw = (registry as unknown as Registry)[frameId];
  const frameData = getFrameStyleById(frameId);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [frameId]);

  const galleryImages = useMemo(() => normalizeGalleryImages(frameData), [frameData]);

  if (!raw) return null;

  const copy = raw;

  const subtitleText =
    copy.hero.subtitleMode === "shortFromCatalog"
      ? (frameData?.shortDescription ?? "")
      : copy.hero.brandItalic ?? "";

  const designBody =
    copy.designBodySource === "featuredDescription"
      ? (frameData?.featuredDescription ?? "")
      : copy.designBodyParagraph ?? "";

  const mw = frameData?.mouldingWidth;
  const ud = frameData?.usableDepth;
  /** Legacy uses `1.25" inches` vs `1.25"` */
  const fmtSpec = (n: number | undefined) =>
    copy.specsFormat === "inchesWords" ? `${n}" inches` : `${n}"`;

  const barFeatures =
    copy.features?.map((f) => ({
      icon: ICONS[f.icon],
      title: f.title,
      subtitle: f.subtitle,
      testId: f.testId,
    })) ?? [];

  const scrollToDesigner = () => {
    document.querySelector("[data-designer-anchor]")?.scrollIntoView({ behavior: "smooth" });
  };

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <BoxIcon className="w-3 h-3" />
            <span className="text-xs font-medium">{copy.hero.badgeLabel}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-[1.1]">
            <span className="text-foreground">{copy.hero.headline}</span>
          </h1>

          <p
            className="text-sm md:text-base text-muted-foreground mb-1.5 leading-snug max-w-2xl mx-auto italic"
            data-testid="text-short-description"
          >
            {subtitleText}
          </p>

          <div className="flex justify-center mt-6">
            <Button size="lg" onClick={scrollToDesigner} data-testid="button-design-shadowbox-hero">
              {copy.hero.designButtonLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-4 md:py-6" data-designer-anchor>
        <div className="max-w-7xl mx-auto">
          <ShadowboxDesigner defaultFrameId={frameId} embedded />
        </div>
      </section>

      {copy.hasCarousel && galleryImages.length > 0 ? (
        <section className="container mx-auto px-4 py-12 md:py-16 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-style-inspiration">
                Style Inspiration
              </h2>
              <p className="text-muted-foreground">{copy.inspirationSubtitle}</p>
            </div>

            <FrameDetailCarousel images={galleryImages} onImageClick={openGallery} />
          </div>
        </section>
      ) : null}

      {copy.hasCarousel ? (
        <ImageGallery images={galleryImages} initialIndex={galleryIndex} open={galleryOpen} onOpenChange={setGalleryOpen} />
      ) : null}

      <section className="container mx-auto px-4 py-8 md:py-12 border-b bg-muted/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">{copy.designHeading}</h2>
          <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground text-center">
            <p>{designBody}</p>
          </div>
        </div>
      </section>

      <KeyFeaturesBar features={barFeatures.length ? barFeatures : undefined} />

      <section className="container mx-auto px-4 py-8 md:py-12 border-b">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Moulding Width:</span>
                <span className="text-muted-foreground">{fmtSpec(mw)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Usable Depth:</span>
                <span className="text-muted-foreground">{fmtSpec(ud)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Profile Type:</span>
                <span className="text-muted-foreground">{copy.categoryLabel}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Finish:</span>
                <span className="text-muted-foreground">{frameData?.colorName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Material:</span>
                <span className="text-muted-foreground">{frameData?.material}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Category:</span>
                <span className="text-muted-foreground">{copy.categoryLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{copy.cta.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{copy.cta.description}</p>
          <Button size="lg" onClick={scrollToDesigner} data-testid="button-design-shadowbox-cta">
            Start Designing Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
