import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FrameDesigner } from "@framecraft/ui";
import { getFrameStyleById, getStoreBaseAssetUrl } from "@framecraft/core";
import { getFramePageContent } from "./frame-page-content";
import { FrameDesignerHeroCta } from "./FrameDesignerHeroCta";
import { FrameHeroBadge } from "./FrameHeroBadge";
import { FrameDesignerPageSections } from "./FrameDesignerPageSections";

// Next.js 15: params is a Promise
type Props = { params: Promise<{ frameSlug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { frameSlug } = await params;
  const frame = getFrameStyleById(frameSlug);
  if (!frame) return { title: "Frame Not Found" };
  const title = `${frame.name} Frame - Custom Frame Designer | CustomFrameSizes.com`;
  const description =
    frame.shortDescription ||
    frame.featuredDescription ||
    `Design a custom ${frame.name} picture frame in any size. Choose your dimensions, mat, and glazing. Instant pricing.`;
  return {
    title,
    description,
    openGraph: {
      title: `${frame.name} Frame - Design Your Custom Frame`,
      description,
      type: "website",
    },
  };
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section - match original CustomFrameSizes-CODE (e.g. LightOakFrame.tsx) */}
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <FrameHeroBadge text={pageContent.heroBadgeText} />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-[1.1]">
            <span className="text-foreground">{frame.name}</span>
            <br />
            <span className="text-muted-foreground">Picture Frame</span>
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
  );
}
