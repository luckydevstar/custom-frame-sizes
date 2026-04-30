import { getFrameStyleById, getStoreBaseAssetUrl } from "@framecraft/core";
import { FrameDesigner } from "@framecraft/ui";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import {
  buildFrameProductMetaDescription,
  generateDetailMetadata,
  generateProductSchema,
  generateBreadcrumbSchema,
  getCanonicalUrl,
} from "@/lib/seo";
import { getFramePageContent } from "./frame-page-content";
import { FrameDesignerHeroCta } from "./FrameDesignerHeroCta";
import { FrameDesignerPageSections } from "./FrameDesignerPageSections";
import { FrameHeroBadge } from "./FrameHeroBadge";

// Next.js 15: params is a Promise
type Props = { params: Promise<{ frameSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { frameSlug } = await params;
  const frame = getFrameStyleById(frameSlug);
  if (!frame) return { title: "Frame Not Found" };

  const description = buildFrameProductMetaDescription({
    name: frame.name,
    shortDescription: frame.shortDescription,
    featuredDescription: frame.featuredDescription,
  });

  return generateDetailMetadata({
    name: frame.name,
    description,
    slug: `frames/${frameSlug}`,
  });
}

export default async function FrameDesignerBySlugPage({ params }: Props) {
  const { frameSlug } = await params;
  const frame = getFrameStyleById(frameSlug);
  if (!frame) notFound();

  const displayImages = frame.alternateImages?.filter((img) => img.type === "lifestyle") ?? [];
  const lifestyleImages = displayImages.map((img) => ({
    url: getStoreBaseAssetUrl(img.url.startsWith("/") ? img.url.slice(1) : img.url),
    alt: img.alt ?? `${frame.name} frame lifestyle`,
    type: img.type,
  }));

  const pageContent = getFramePageContent(frame);

  const description = buildFrameProductMetaDescription({
    name: frame.name,
    shortDescription: frame.shortDescription,
    featuredDescription: frame.featuredDescription,
  });

  const breadcrumbs = [
    { name: "Home", url: getCanonicalUrl("/") },
    { name: "Frames", url: getCanonicalUrl("/frames/styles") },
    { name: frame.name, url: getCanonicalUrl(`/frames/${frameSlug}`) },
  ];

  return (
    <>
      {/* Structured Data - Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateProductSchema({
            name: `${frame.name} Picture Frame`,
            description,
            lowPrice: 25,
            highPrice: 300,
            url: getCanonicalUrl(`/frames/${frameSlug}`),
            material: `${frame.material || "Wood (premium hardwoods)"} with ${frame.mouldingWidth}" width`,
            additionalProperties: [
              { name: "Frame Style", value: frame.name },
              { name: "Color", value: frame.color },
              { name: "Moulding Width", value: `${frame.mouldingWidth}"` },
              { name: "Size Granularity", value: "1/8 inch" },
            ],
          }),
        }}
      />

      {/* Structured Data - BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbSchema(breadcrumbs),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section - match original CustomFrameSizes-CODE (e.g. LightOakFrame.tsx) */}
        <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <FrameHeroBadge text={pageContent.heroBadgeText} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-[1.1]">
              <span className="text-foreground">{frame.name}</span>
              <br />
              <span className="text-muted-foreground"> Picture Frame</span>
            </h1>
            <p
              className="text-sm md:text-base text-muted-foreground mb-1.5 leading-snug max-w-2xl mx-auto italic"
              data-testid="text-short-description"
            >
              {frame.shortDescription ?? ""}
            </p>
            <FrameDesignerHeroCta />
          </div>
        </section>

        {/* Embedded Frame Designer - match original */}
        <section className="container mx-auto px-4 py-4 md:py-6" data-designer-anchor>
          <div className="max-w-7xl mx-auto">
            <Suspense
              fallback={
                <div className="min-h-[600px] flex items-center justify-center">
                  Loading designer...
                </div>
              }
            >
              <FrameDesigner defaultFrameId={frameSlug} embedded />
            </Suspense>
          </div>
        </section>

        {/* Style Inspiration + Explanation (Design & Craftsmanship, KeyFeaturesBar, Specs, Perfect For, Final CTA) */}
        <FrameDesignerPageSections
          frame={frame}
          lifestyleImages={lifestyleImages}
          pageContent={pageContent}
        />
      </div>
    </>
  );
}
