"use client";

import { getFrameSlug, getStoreBaseAssetUrl } from "@framecraft/core";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Button } from "../ui/button";

import type { FrameStyle } from "@framecraft/types";

export type ShadowboxShowcaseVariant = "default" | "shadowboxframes";

export interface ShadowboxShowcaseProps {
  frames: FrameStyle[];
  shadowboxLink?: string;
  /**
   * `shadowboxframes` matches b-shadow-box-frames-original ShadowboxShowcase (heading, copy, slug links, subtitles).
   * `default` keeps generic store-a style labels.
   */
  variant?: ShadowboxShowcaseVariant;
}

const SHADOWBOXFRAMES_COPY = {
  heading: "Our Curated Shadow Box Collection",
  intro:
    "Browse our thoughtfully designed collection of shadow box frames, each crafted with care in a range of depths, finishes, and styles. From sleek modern profiles to warm wood tones, every frame in our collection is built to showcase three-dimensional keepsakes with the attention they deserve.",
  footer:
    'ShadowboxFrames.com offers the most comprehensive online shadowbox frame builder available. Choose from multiple frame colors, set your depth from ¾" to 3.5", including our Ultra Deep option for extra-thick displays. Select from 46 acid-free mat board colors and preview your design in real time. Every shadowbox frame is precision-cut and hand-assembled in our US workshop.',
  viewAllLabel: "View All Shadowbox Frames",
} as const;

export function ShadowboxShowcase({
  frames = [],
  shadowboxLink = "/shadowbox",
  variant = "default",
}: ShadowboxShowcaseProps) {
  const shadowboxFrames = useMemo(
    () => frames.filter((frame) => frame.category === "shadowbox"),
    [frames],
  );

  const shadowboxStyles = useMemo(
    () =>
      shadowboxFrames.map((frame) => {
        const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
        const localPath = cornerImage?.url || frame.thumbnail;
        const cdnPath = localPath
          ? getStoreBaseAssetUrl(localPath.startsWith("/") ? localPath.slice(1) : localPath)
          : "";
        const ext = frame as FrameStyle & { displayName?: string; brandSubtitle?: string };
        return {
          id: frame.id,
          name: ext.displayName || frame.name,
          brandSubtitle: ext.brandSubtitle || "",
          description: frame.shortDescription || "Custom deep frame for memorabilia",
          image: cdnPath,
          fallbackUrl: frame.thumbnail
            ? getStoreBaseAssetUrl(
                frame.thumbnail.startsWith("/") ? frame.thumbnail.slice(1) : frame.thumbnail,
              )
            : "",
          alt: cornerImage?.alt || `${frame.name} corner detail`,
          href:
            variant === "shadowboxframes"
              ? `${shadowboxLink}/${getFrameSlug(frame.id)}`
              : `${shadowboxLink}/${frame.id}`,
        };
      }),
    [shadowboxFrames, shadowboxLink, variant],
  );

  const heading = variant === "shadowboxframes" ? SHADOWBOXFRAMES_COPY.heading : "Shadowbox Frames";
  const intro =
    variant === "shadowboxframes"
      ? SHADOWBOXFRAMES_COPY.intro
      : "Deep frames designed for 3D objects, medals, jerseys, and cherished memorabilia";
  const footerText =
    variant === "shadowboxframes"
      ? SHADOWBOXFRAMES_COPY.footer
      : "Our custom shadowbox frames feature deep profiles (0.5-2 inches) to display three-dimensional objects like jerseys, medals, and collectibles. Shadowboxes are available in popular sizes including 11x14, 16x20, 18x24, 22x28, and 24x36, or any custom size built to your exact specifications with professional-grade construction and framer's grade acrylic glazing.";
  const viewAllLabel =
    variant === "shadowboxframes" ? SHADOWBOXFRAMES_COPY.viewAllLabel : "Explore Shadowbox Frames";

  return (
    <section className="py-10 sm:py-12" data-testid="section-shadowbox-frames">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2
            className="font-serif text-3xl font-semibold mb-2"
            data-testid="text-shadowbox-heading"
          >
            {heading}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">{intro}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {shadowboxStyles.map((shadowbox) => (
            <Link
              key={shadowbox.id}
              href={shadowbox.href}
              data-testid={`link-shadowbox-${shadowbox.id}`}
            >
              <div
                className="group relative rounded-lg overflow-hidden hover-elevate cursor-pointer"
                data-testid={`shadowbox-${shadowbox.id}`}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {/* Native img + onError: CDN 404s fall back to thumbnail (matches shadowboxframes variant) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shadowbox.image}
                    alt={shadowbox.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.retried && shadowbox.fallbackUrl) {
                        target.dataset.retried = "true";
                        target.src = shadowbox.fallbackUrl;
                      }
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3
                      className="font-serif text-lg font-semibold mb-0.5"
                      data-testid={`text-shadowbox-name-${shadowbox.id}`}
                    >
                      {shadowbox.name}
                    </h3>
                    {variant === "shadowboxframes" && shadowbox.brandSubtitle ? (
                      <p
                        className="text-xs text-white/70 italic mb-0.5"
                        data-testid={`text-shadowbox-subtitle-${shadowbox.id}`}
                      >
                        {shadowbox.brandSubtitle}
                      </p>
                    ) : null}
                    <p
                      className="text-sm text-white/90"
                      data-testid={`text-shadowbox-description-${shadowbox.id}`}
                    >
                      {shadowbox.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed">{footerText}</p>
        </div>

        <div className="text-center mt-6">
          <Link href={shadowboxLink}>
            <Button variant="default" size="lg" data-testid="button-view-all-shadowboxes">
              {viewAllLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
