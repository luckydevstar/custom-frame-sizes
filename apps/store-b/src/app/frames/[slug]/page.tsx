import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PictureFrameSlugDetailContent } from "@/components/picture-frames/picture-frame-slug-detail-content";
import { env } from "@/lib/env";
import { canonicalPictureFrameSlug, resolvePictureFrameSlug } from "@/lib/resolve-picture-frame-slug";
import { getFrameSlug, getFrameStyles, resolveFramePhotoUrl } from "@framecraft/core";

import type { FrameStyle } from "@framecraft/types";

const siteOrigin = (
  env.siteOrigin ?? `https://${env.shopify.storeDomain ?? "www.shadowboxframes.com"}`
).replace(/\/$/, "");

type PageProps = { params: { slug: string } };

export function generateStaticParams(): { slug: string }[] {
  const slugs = new Set<string>();
  for (const frame of getFrameStyles()) {
    slugs.add(frame.id);
    slugs.add(getFrameSlug(frame.id));
  }
  return [...slugs].sort().map((slug) => ({ slug }));
}

function metaDescription(frame: Pick<FrameStyle, "featuredDescription" | "shortDescription" | "name">): string {
  const raw =
    frame.featuredDescription ||
    frame.shortDescription ||
    `${frame.name} custom picture frame with professional finishes.`;
  return raw.length > 300 ? `${raw.slice(0, 297)}…` : raw;
}

function cornerImageAbsolute(frame: FrameStyle): string | undefined {
  const corner = frame.alternateImages?.find((img) => img.type === "corner" && typeof img.url === "string");
  if (!corner) return undefined;
  const path = corner.url.startsWith("/") ? corner.url.slice(1) : corner.url;
  return resolveFramePhotoUrl(path);
}

function buildProductLd(frame: FrameStyle, canonicalUrl: string, description: string) {
  const image = cornerImageAbsolute(frame);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${frame.name} Picture Frame`,
    description,
    brand: {
      "@type": "Brand",
      name: "ShadowboxFrames.com",
    },
    ...(image ? { image } : {}),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "25",
      highPrice: "400",
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
    },
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const frame = resolvePictureFrameSlug(params.slug);
  if (!frame) {
    return { title: "Frame Not Found | ShadowboxFrames.com" };
  }

  const pathSegment = canonicalPictureFrameSlug(frame);
  const canonical = `${siteOrigin}/frames/${pathSegment}`;
  const titleHead = `${frame.name} Picture Frame`;
  const title = `${titleHead} | ShadowboxFrames.com`;
  const description = metaDescription(frame);
  const ogImg = cornerImageAbsolute(frame);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      ...(ogImg ? { images: [ogImg] } : {}),
    },
    twitter: {
      card: ogImg ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImg ? { images: [ogImg] } : {}),
    },
  };
}

export default function PictureFrameSlugPage({ params }: PageProps) {
  const frame = resolvePictureFrameSlug(params.slug);
  if (!frame) {
    notFound();
  }

  const canonicalSeg = canonicalPictureFrameSlug(frame);
  const description = metaDescription(frame);
  const canonicalUrl = `${siteOrigin}/frames/${canonicalSeg}`;
  const productLd = buildProductLd(frame, canonicalUrl, description);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <Suspense fallback={<div className="min-h-[50vh] bg-gradient-to-b from-background to-muted/30" />}>
        <PictureFrameSlugDetailContent frameId={frame.id} galleryKeySlug={canonicalSeg} />
      </Suspense>
    </>
  );
}
