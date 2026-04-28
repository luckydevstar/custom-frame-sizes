"use client";

/**
 * Bouquet frames landing — origina-store-b/client/src/pages/BouquetFrames.tsx
 */

import { buildBouquetFramesJsonLd } from "@/components/bouquet/bouquet-frames-json-ld";
import { KeyFeaturesBar } from "@/components/marketing/key-features-bar";
import { RelatedProducts } from "@/components/marketing/related-products";
import dynamic from "next/dynamic";
import { Award, Calendar, Flower2, Heart, Shield, Sparkles } from "lucide-react";

const BouquetFrameDesigner = dynamic(
  () => import("@framecraft/ui").then((m) => m.BouquetFrameDesigner),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading designer…</p>
        </div>
      </div>
    ),
  }
);

export function BouquetFramesPageContent() {
  const jsonLd = buildBouquetFramesJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Flower2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Wedding Bouquet Preservation Frames</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight" data-testid="heading-hero">
              Shadowbox Frames for Dried Wedding Flowers
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Frame your dried wedding bouquet in a custom shadowbox with enough depth for pressed or dimensional
              flowers. Acid-free materials and framer&apos;s grade acrylic keep your bouquet preserved.
            </p>
          </div>
        </section>

        <KeyFeaturesBar />

        <section id="bouquet-designer" className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <BouquetFrameDesigner />
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" data-testid="heading-benefits">
              Keep your bouquet on the wall
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border bg-card hover-elevate">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Extra-Deep Frames</h3>
                <p className="text-sm text-muted-foreground">
                  2&quot; usable depth accommodates full wedding bouquets without crushing delicate petals. Designed for
                  roses, peonies, and dimensional arrangements.
                </p>
              </div>

              <div className="p-6 rounded-lg border bg-card hover-elevate">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                <p className="text-sm text-muted-foreground">
                  Helps prevent fading and yellowing of dried flowers. Crystal-clear acrylic lets you see every petal
                  while protecting your bouquet.
                </p>
              </div>

              <div className="p-6 rounded-lg border bg-card hover-elevate">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Acid-Free Preservation</h3>
                <p className="text-sm text-muted-foreground">
                  Professional-grade backing keeps dried flowers safe for years. Acid-free materials help prevent wear
                  and aging over time.
                </p>
              </div>

              <div className="p-6 rounded-lg border bg-card hover-elevate">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Custom Sizing</h3>
                <p className="text-sm text-muted-foreground">
                  Fits any bouquet arrangement from petite nosegays to cascading statement pieces. Enter your desired
                  size for a perfect fit.
                </p>
              </div>

              <div className="p-6 rounded-lg border bg-card hover-elevate">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Three Elegant Finishes</h3>
                <p className="text-sm text-muted-foreground">
                  Choose white (most popular for weddings), matte black (dramatic contrast), or walnut brown (rustic
                  warmth).
                </p>
              </div>

              <div className="p-6 rounded-lg border bg-card hover-elevate">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Flower2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Heirloom Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Display alongside wedding photos in your home and pass down through generations as a tangible memory
                  of your special day.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Common Bouquet Frame Sizes</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Small Bridal Bouquets</h3>
                <p className="text-sm text-muted-foreground mb-2">Hand-tied, nosegay, or petite arrangements</p>
                <p className="text-sm font-medium text-primary">11×14&quot; or 16×20&quot;</p>
              </div>

              <div className="p-5 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Medium Bouquets</h3>
                <p className="text-sm text-muted-foreground mb-2">Classic round or semi-cascading bouquets</p>
                <p className="text-sm font-medium text-primary">20×24&quot;</p>
              </div>

              <div className="p-5 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Large Cascading Bouquets</h3>
                <p className="text-sm text-muted-foreground mb-2">Statement pieces and oversized arrangements</p>
                <p className="text-sm font-medium text-primary">24×30&quot; or larger</p>
              </div>

              <div className="p-5 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Round Toss Bouquets</h3>
                <p className="text-sm text-muted-foreground mb-2">Compact round or sphere-shaped bouquets</p>
                <p className="text-sm font-medium text-primary">16×16&quot; or 18×18&quot;</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Bouquet Preservation Tips</h2>

            <div className="space-y-4">
              <div className="p-5 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Choose Your Drying Method
                </h3>
                <p className="text-sm text-muted-foreground pl-8">
                  Air dry by hanging upside down in a cool, dark place (2-3 weeks) or use silica gel crystals for faster
                  drying with better color retention (5-7 days).
                </p>
              </div>

              <div className="p-5 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Frame Within 2-4 Weeks
                </h3>
                <p className="text-sm text-muted-foreground pl-8">
                  Once dried, frame your bouquet promptly for best color retention. Prolonged exposure to air and light
                  accelerates fading.
                </p>
              </div>

              <div className="p-5 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  Display Away from Sunlight
                </h3>
                <p className="text-sm text-muted-foreground pl-8">
                  Even with framer&apos;s grade acrylic, avoid hanging in direct sunlight. Choose a wall with indirect
                  light for the longest-lasting color.
                </p>
              </div>

              <div className="p-5 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  Consider Professional Services
                </h3>
                <p className="text-sm text-muted-foreground pl-8">
                  For complex arrangements or maximum longevity, professional preservation services use freeze-drying and
                  specialized techniques. Our frames work perfectly with DIY or professional preservation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedProducts
          productKeys={["wedding-invitation", "signature-frames", "picture-frames", "collage-frames"]}
          columns={4}
        />
      </div>
    </>
  );
}
