"use client";

import { getFrameStyleById, resolveFramePhotoUrl } from "@framecraft/core";import { Award, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { KeyFeaturesBar } from "@/components/marketing/key-features-bar";
import { FrameDesigner } from "@framecraft/ui";

import { useScrollToTop } from "@/hooks/use-scroll-to-top";

import { Button } from "@framecraft/ui/components/ui/button";

function photoUrl(raw: string) {
  return resolveFramePhotoUrl(raw.startsWith("/") ? raw.slice(1) : raw);
}

export function PictureFrameSlugDetailContent({
  frameId,
  galleryKeySlug,
}: {
  frameId: string;
  /** Stable segment for React keys (canonical SEO slug) */
  galleryKeySlug: string;
}) {
  useScrollToTop();

  const frame = getFrameStyleById(frameId);
  if (!frame) {
    return null;
  }

  const lifestyle =
    frame.alternateImages?.filter(
      (img) => img.type === "lifestyle" && typeof img.url === "string",
    ) ?? [];

  const widthLabel =
    typeof frame.mouldingWidth === "number" ? `${frame.mouldingWidth}" wide` : String(frame.mouldingWidth ?? "");
  const materialLine = [frame.material || "Premium wood", widthLabel].filter(Boolean).join(" · ");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <Button variant="ghost" size="sm" className="mb-6 min-h-11" asChild>
          <Link href="/picture-frames">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Picture frames hub
          </Link>
        </Button>

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Shadow Box Workshop framing</span>
          </div>
          <h1 className="mb-2 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            <span>{frame.name}</span>
            <span className="text-muted-foreground"> Picture Frame</span>
          </h1>
          {frame.shortDescription ? (
            <p
              className="mx-auto mb-1 max-w-2xl text-sm italic leading-snug text-muted-foreground md:text-base"
              data-testid="text-short-description"
            >
              {frame.shortDescription}
            </p>
          ) : null}
          <p className="mx-auto mb-6 max-w-2xl text-sm text-muted-foreground">{materialLine}</p>
        </div>
      </section>

      {frame.featuredDescription ? (
        <section className="container mx-auto max-w-3xl px-4 pb-10">
          <p className="text-center leading-relaxed text-muted-foreground">{frame.featuredDescription}</p>
        </section>
      ) : null}

      <KeyFeaturesBar />

      {lifestyle.length > 0 ? (
        <section className="container mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-8 text-center text-2xl font-bold">Gallery & inspiration</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {lifestyle.slice(0, 4).map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- lifestyle tiles from storefront CDN URLs
              <img
                key={`${galleryKeySlug}-ls-${i}`}
                src={photoUrl(img.url)}
                alt={img.alt ?? `${frame.name} frame lifestyle`}
                className="aspect-[4/3] w-full rounded-lg object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
        <h2 id="design-your-frame" className="sr-only">
          Customize this frame online
        </h2>
        <FrameDesigner defaultFrameId={frameId} embedded />
      </section>
    </div>
  );
}
