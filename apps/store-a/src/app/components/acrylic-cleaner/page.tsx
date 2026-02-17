import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Sparkles, Droplets, Package, Check } from "lucide-react";
import { Card, Button } from "@framecraft/ui";

const PRODUCT_IMAGES = [
  "https://novuspolish.com/cdn/shop/files/NPP-1---8-oz_Front_1946x.jpg?v=1731410582",
  "https://novuspolish.com/cdn/shop/files/NPP-1---8-oz-Back_1946x.jpg?v=1731410582",
  "https://novuspolish.com/cdn/shop/files/NPP1_Group_square_20240916_1946x.jpg?v=1731411664",
] as const;

const MAIN_PRODUCT_IMAGE = PRODUCT_IMAGES[0];

const PRICE = 9.95;

export const metadata: Metadata = {
  title: "Acrylic Cleaner & Polish – Safe for Frame Glazing | Custom Frame Sizes",
  description:
    "Professional acrylic cleaner for picture frame glazing. Anti-static, streak-free formula safe for framer's grade acrylic. Resists fingerprints and dust. 8oz bottle – $9.95.",
  openGraph: {
    title: "Acrylic Cleaner & Polish – Safe for Frame Glazing",
    description:
      "Professional acrylic cleaner for picture frame glazing. Anti-static, streak-free formula. 8oz bottle – $9.95.",
    type: "website",
  },
};

export default function AcrylicCleanerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            All Components
          </Link>

          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-white border relative">
                <Image
                  src={MAIN_PRODUCT_IMAGE}
                  alt="NOVUS Acrylic Cleaner 8oz bottle"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">NOVUS Plastic Polish</p>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Acrylic Cleaner & Polish</h1>
                <p className="text-muted-foreground">8oz Bottle – Clean & Shine Formula</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${PRICE.toFixed(2)}</span>
                <span className="text-muted-foreground">per bottle</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Safe for Acrylic</p>
                    <p className="text-xs text-muted-foreground">No harsh chemicals</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Anti-Static</p>
                    <p className="text-xs text-muted-foreground">Resists dust</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Droplets className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Streak-Free</p>
                    <p className="text-xs text-muted-foreground">Crystal clear finish</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">8oz Bottle</p>
                    <p className="text-xs text-muted-foreground">Cleans 50+ frames</p>
                  </div>
                </div>
              </div>

              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">${PRICE.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/contact">Add to Cart / Inquire</Link>
                </Button>
              </Card>

              <div className="space-y-4 pt-4 border-t">
                <h2 className="font-semibold">The Right Cleaner for Acrylic Glazing</h2>
                <p className="text-sm text-muted-foreground">
                  Regular glass cleaner can damage acrylic and cause cloudiness over time. This
                  professional-grade formula is designed specifically for acrylic and plastic
                  surfaces — the same glazing used in our picture frames.
                </p>
                <p className="text-sm text-muted-foreground">
                  The anti-static formula repels dust and resists fingerprints, keeping your framed
                  artwork looking clean longer. Safe for all acrylic glazing including framer&apos;s
                  grade acrylic and non-glare acrylic.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h2 className="font-semibold">How to Use</h2>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Spray cleaner onto a soft microfiber cloth (never directly on the acrylic)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Wipe gently using long, sweeping strokes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Polish with circular strokes using a clean section of the cloth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Buff to a streak-free shine</span>
                  </li>
                </ol>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h2 className="font-semibold">What to Avoid</h2>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Never use ammonia-based glass cleaners on acrylic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Avoid paper towels — they can scratch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>Don&apos;t spray directly on the glazing surface</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
