import { getFrameStyles, getStoreBaseAssetUrl } from "@framecraft/core";
import { Button } from "@framecraft/ui";
import { ArrowRight, Box, Zap, Ruler, Layers, Award } from "lucide-react";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  buildFrameProductMetaDescription,
  generateBreadcrumbSchema,
  generateMetadata as buildSeoMetadata,
  generateProductSchema,
  getCanonicalUrl,
  getOgImage,
} from "@/lib/seo";
import { brandConfig } from "../../../../brand.config";

import type { FrameStyle } from "@framecraft/types";
import type { Metadata } from "next";

const ShadowboxDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.ShadowboxDesigner),
  { ssr: false }
);

function getAllShadowboxSlugs(): string[] {
  const frames = getFrameStyles().filter((f) => f.category === "shadowbox");
  return frames.map((f) => f.id);
}

export function generateStaticParams() {
  return getAllShadowboxSlugs().map((slug) => ({ slug }));
}

interface ShadowboxFramePageProps {
  params: Promise<{ slug: string }>;
}

function getShadowboxFrameBySlug(slug: string): FrameStyle | undefined {
  const frames = getFrameStyles().filter((f) => f.category === "shadowbox") as FrameStyle[];
  return frames.find((f) => f.id === slug);
}

export async function generateMetadata({ params }: ShadowboxFramePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "designer") return {};
  const frame = getShadowboxFrameBySlug(slug);
  if (!frame) return { title: "Shadowbox | Custom Frame Sizes" };

  const path = `/shadowbox/${slug}`;
  const description = buildFrameProductMetaDescription({
    name: `${frame.name} Shadowbox`,
    shortDescription: frame.shortDescription,
    featuredDescription: frame.featuredDescription,
  });
  const lifestyle =
    frame.alternateImages?.find((i) => i.type === "lifestyle") ?? frame.alternateImages?.[0];
  const ogFromAsset = lifestyle?.url
    ? getStoreBaseAssetUrl(lifestyle.url.startsWith("/") ? lifestyle.url.slice(1) : lifestyle.url)
    : undefined;

  return buildSeoMetadata({
    title: `${frame.name} Shadowbox Frame - Custom Sizing | ${brandConfig.name}`,
    description,
    canonical: getCanonicalUrl(path),
    ogImage: getOgImage(ogFromAsset),
    ogTitle: `${frame.name} Shadowbox Frame - Custom Framing`,
    ogDescription: description,
  });
}

export default async function ShadowboxFramePage({ params }: ShadowboxFramePageProps) {
  const { slug } = await params;
  if (slug === "designer") notFound();
  const frame = getShadowboxFrameBySlug(slug);
  if (!frame) notFound();

  const lifestyleImages = frame.alternateImages?.filter((img) => img.type === "lifestyle") ?? [];

  const productImage = lifestyleImages[0]?.url
    ? getStoreBaseAssetUrl(
        lifestyleImages[0].url.startsWith("/") ? lifestyleImages[0].url.slice(1) : lifestyleImages[0].url
      )
    : undefined;

  const breadcrumbJson = generateBreadcrumbSchema([
    { name: "Home", url: getCanonicalUrl("/") },
    { name: "Shadowbox Frames", url: getCanonicalUrl("/shadowbox") },
    { name: `${frame.name} Shadowbox`, url: getCanonicalUrl(`/shadowbox/${slug}`) },
  ]);

  const productJson = generateProductSchema({
    name: `${frame.name} Shadowbox Frame`,
    description:
      frame.featuredDescription ||
      frame.shortDescription ||
      `Custom ${frame.name} shadowbox frame with professional display depth.`,
    url: getCanonicalUrl(`/shadowbox/${slug}`),
    image: productImage,
    material: frame.material,
    lowPrice: 49,
    highPrice: 899,
    additionalProperties: [
      { name: "Usable depth", value: `${frame.usableDepth}"` },
      { name: "Moulding width", value: `${frame.mouldingWidth}"` },
      { name: "Category", value: "Shadowbox" },
    ],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJson }} />
      {/* Hero */}
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/shadowbox">
              <Box className="w-4 h-4 mr-2" />
              All Shadowbox Frames
            </Link>
          </Button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Box className="w-3 h-3" />
            <span className="text-xs font-medium">Deep Profile Display</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-[1.1]">
            <span className="text-foreground">{frame.name} Shadowbox Frame</span>
          </h1>
          <p
            className="text-sm md:text-base text-muted-foreground mb-1.5 leading-snug max-w-2xl mx-auto italic"
            data-testid="text-short-description"
          >
            {frame.shortDescription || ""}
          </p>
          <div className="flex justify-center mt-6">
            <Button size="lg" asChild data-testid="button-design-shadowbox-hero">
              <Link href="#designer">
                Design Your Shadowbox
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Designer */}
      <section
        id="designer"
        className="container mx-auto px-4 py-4 md:py-6 scroll-mt-20"
        data-designer-anchor
      >
        <div className="max-w-7xl mx-auto">
          <Suspense
            fallback={
              <div className="min-h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading designer...</p>
              </div>
            }
          >
            <ShadowboxDesigner defaultFrameId={frame.id} embedded />
          </Suspense>
        </div>
      </section>

      {/* Style Inspiration */}
      {lifestyleImages.length > 0 && (
        <section className="container mx-auto px-4 py-12 md:py-16 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                data-testid="heading-style-inspiration"
              >
                Style Inspiration
              </h2>
              <p className="text-muted-foreground">
                {frame.shortDescription || `${frame.name} shadowbox frame`}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {lifestyleImages.slice(0, 6).map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getStoreBaseAssetUrl(img.url.startsWith("/") ? img.url.slice(1) : img.url)}
                    alt={img.alt}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Design & Craftsmanship */}
      {frame.featuredDescription && (
        <section className="container mx-auto px-4 py-8 md:py-12 border-b bg-muted/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Design &amp; Craftsmanship
            </h2>
            <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground text-center">
              <p>{frame.featuredDescription}</p>
            </div>
          </div>
        </section>
      )}

      {/* Key benefits */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div data-testid="benefit-instant-pricing">
              <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">Instant Pricing</div>
              <div className="text-sm text-muted-foreground">See your cost as you customize</div>
            </div>
            <div data-testid="benefit-custom-size">
              <Ruler className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">Any Custom Size</div>
              <div className="text-sm text-muted-foreground">Built to your exact dimensions</div>
            </div>
            <div data-testid="benefit-depth">
              <Layers className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">Shadowbox Depth</div>
              <div className="text-sm text-muted-foreground">
                {frame.usableDepth}&quot; for 3D items
              </div>
            </div>
            <div data-testid="benefit-display">
              <Award className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">Professional Display</div>
              <div className="text-sm text-muted-foreground">Focus on your keepsake</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-b">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Technical Specifications
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Moulding Width:</span>
                <span className="text-muted-foreground">{frame.mouldingWidth}&quot; inches</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Usable Depth:</span>
                <span className="text-muted-foreground">{frame.usableDepth}&quot; inches</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Profile Type:</span>
                <span className="text-muted-foreground">Shadowbox</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Finish:</span>
                <span className="text-muted-foreground">{frame.colorName ?? frame.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Material:</span>
                <span className="text-muted-foreground">{frame.material}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Category:</span>
                <span className="text-muted-foreground">Shadowbox</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Ready to Create Your Custom Shadowbox?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Design your perfect shadowbox with our easy-to-use designer tool. Get instant pricing
            and real-time preview.
          </p>
          <Button size="lg" asChild data-testid="button-design-shadowbox-cta">
            <Link href="#designer">
              Start Designing Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
