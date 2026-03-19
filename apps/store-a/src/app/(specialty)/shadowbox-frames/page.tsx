import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Sparkles, Box, Palette, Layers, Shield } from "lucide-react";
import { ScrollToDesignerButton } from "./scroll-button";
import { getFramesByCategory, getStoreBaseAssetUrl } from "@framecraft/core";
import { Button } from "@framecraft/ui";

const ShadowboxDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.ShadowboxDesigner),
  { ssr: false }
);

// Avoid static prerender: designer deps reference `self` at module load
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Custom Shadowbox Frames | Memorabilia & 3D Display | CustomFrameSizes.com",
  description:
    "Design custom shadowbox frames for memorabilia, 3D items, and keepsakes. Adjustable depth, archival materials, and professional construction. Any size.",
  openGraph: {
    title: "Custom Shadowbox Frames | Memorabilia & 3D Display",
    description:
      "Custom shadowbox frames with adjustable depth for displaying 3D items, memorabilia, and keepsakes. Professional construction with archival materials.",
    type: "website",
  },
};

function getCornerOrThumbUrl(frame: {
  alternateImages?: { type: string; url: string; alt?: string }[];
  thumbnail?: string | null;
}) {
  const corner = frame.alternateImages?.find((img) => img.type === "corner");
  if (corner) {
    const path = corner.url.startsWith("/") ? corner.url.slice(1) : corner.url;
    return getStoreBaseAssetUrl(path);
  }
  if (frame.thumbnail) {
    const path = frame.thumbnail.startsWith("/") ? frame.thumbnail.slice(1) : frame.thumbnail;
    return getStoreBaseAssetUrl(path);
  }
  return null;
}

export default function ShadowboxFramesPage() {
  const shadowboxFrames = getFramesByCategory("shadowbox");
  const galleryFrames = shadowboxFrames.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Memorabilia &amp; 3D Display
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            data-testid="text-hero-title"
          >
            Custom Shadowbox Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Design a custom shadowbox in any size for your memorabilia, medals, jerseys, and 3D
            keepsakes. Set your dimensions, choose frame style and depth, and see real-time pricing.
            Built with archival materials and ready to display.
          </p>

          <ScrollToDesignerButton />
        </div>
      </section>

      {/* Designer Section */}
      <section id="design-tool" className="container mx-auto px-4 py-8 md:py-12">
        <div className="scroll-mt-20" data-testid="designer-section">
          <Suspense
            fallback={
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading designer...</p>
                </div>
              </div>
            }
          >
            <ShadowboxDesigner />
          </Suspense>
        </div>
      </section>

      {/* Description: what are shadowbox frames, use cases */}
      <section className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">What Are Shadowbox Frames?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Shadowbox frames are deep display frames designed to hold three-dimensional
              objects—jerseys, medals, signed memorabilia, military insignia, and keepsakes—with
              enough interior depth so nothing is compressed or damaged. Unlike flat picture frames,
              a shadowbox has a front-opening or rear-loading cavity that you set your items into,
              with optional matting and mounting to keep everything in place. Custom shadowbox
              frames are built to your exact interior dimensions and depth, so whether you are
              framing a single medal or a full jersey, the fit is precise and professional.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Common use cases include sports memorabilia (jerseys, signed balls, tickets), military
              shadowboxes (medals, patches, flags), wedding and event keepsakes (invitations,
              flowers, favors), and collectibles (coins, badges, awards). We build each shadowbox
              with archival-safe materials and UV-filtering glazing so your items stay protected for
              decades. Use our designer above to enter your dimensions, choose frame style and
              depth, and see real-time pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Why Choose Shadowbox Frames
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Box className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Adjustable Depth</h3>
                <p className="text-sm text-muted-foreground">
                  Set interior depth to fit medals, jerseys, keepsakes, and 3D objects. No
                  one-size-fits-all.
                </p>
              </div>
              <div className="text-center">
                <Palette className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Style &amp; Finish</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from multiple frame styles and finishes to match your décor and your piece.
                </p>
              </div>
              <div className="text-center">
                <Layers className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Any Size</h3>
                <p className="text-sm text-muted-foreground">
                  Enter exact interior dimensions. We build to your specs for a perfect fit.
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Archival Materials</h3>
                <p className="text-sm text-muted-foreground">
                  Acid-free backing and quality construction to protect and display your
                  memorabilia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery of example shadowbox frames */}
      {galleryFrames.length > 0 && (
        <section className="border-t py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Shadowbox Frame Styles</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryFrames.map((frame) => {
                  const imgSrc = getCornerOrThumbUrl(frame);
                  const alt =
                    frame.alternateImages?.find((i) => i.type === "corner")?.alt ??
                    `${frame.name} shadowbox frame`;
                  return (
                    <Link
                      key={frame.id}
                      href="/shadowbox/designer"
                      className="group relative overflow-hidden rounded-lg border bg-card hover:border-primary/30 transition-all block"
                    >
                      <div className="relative aspect-square overflow-hidden bg-muted/20">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={alt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Box className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">
                          {frame.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <Button asChild>
                  <Link href="/shadowbox/designer">Design Your Shadowbox</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related guides */}
      <section className="border-t py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
            <ul className="grid md:grid-cols-3 gap-4">
              <li>
                <Link
                  href="/learn"
                  className="block p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium">How to Frame a Jersey</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Step-by-step guide to jersey shadowbox framing.
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="block p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium">Shadowbox Depth Guide</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choosing the right depth for your items.
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="block p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium">Framing FAQ</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Common questions about custom framing.
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
