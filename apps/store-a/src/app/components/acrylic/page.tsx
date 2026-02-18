import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Layers, Ruler, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";

export const metadata: Metadata = {
  title: "Custom-Cut Acrylic Sheets – Regular & Non-Glare Glazing | Custom Frame Sizes",
  description:
    "Order custom-cut acrylic glazing in regular and non-glare finishes. Popular sizes 11x14, 8x10, 24x36, 16x20, 18x24 with instant pricing. Bulk packs available.",
  openGraph: {
    title: "Custom-Cut Acrylic Sheets – Glazing",
    description: "Custom-cut acrylic glazing in regular and non-glare. Bulk packs available.",
    type: "website",
  },
};

export default function AcrylicPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            All Components
          </Link>

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Layers className="h-5 w-5" />
            <span className="text-sm font-medium">Components</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Acrylic Sheets</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Custom-cut acrylic glazing in regular and non-glare finishes. Popular sizes like 11×14,
            8×10, 24×36, 16×20, and 18×24 available with instant pricing. Bulk packs available.
          </p>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Layers className="h-5 w-5 text-primary" />
                    Regular & Non-Glare
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Crystal-clear regular acrylic and non-glare (matte) options. Cut to your exact
                  frame dimensions. Sizes from 4×4″ up to oversize; bulk packs save up to 40%.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Ruler className="h-5 w-5 text-primary" />
                    Custom Sizes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Enter width and height in inches. We cut to your specifications. No minimum order
                  for single sheets; pack sizes of 10 or 100 for volume pricing.
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12 py-8 border-t">
            <h2 className="text-xl font-semibold mb-4">How to Order</h2>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">In the Frame Designer:</strong> Add acrylic
                  glazing when building any custom frame. Choose regular or non-glare; dimensions
                  follow your frame size.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">Standalone sheets:</strong>{" "}
                  <Link href="/contact" className="text-primary underline hover:no-underline">
                    Contact us
                  </Link>{" "}
                  with your dimensions and quantity for a quote. Volume pricing for 10 or 100
                  sheets.
                </span>
              </li>
            </ul>
            <Button asChild size="lg">
              <Link href="/designer">Configure in Frame Designer</Link>
            </Button>
          </section>

          <section className="mb-12 py-8 border-t bg-muted/20 rounded-lg px-6">
            <h2 className="text-xl font-semibold mb-3">Popular Sizes</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We cut to any size. Common frame glazing sizes include 8×10, 11×14, 16×20, 18×24,
              24×36, and custom dimensions. Minimum 4×4″; oversize available.
            </p>
            <div className="flex flex-wrap gap-2">
              {["8×10", "11×14", "16×20", "18×24", "24×36"].map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-background border text-sm"
                >
                  {size}
                </span>
              ))}
            </div>
          </section>

          <RelatedProducts
            productKeys={["foam-board", "acrylic-cleaner", "picture-frames"]}
            title="Related Components & Frames"
            columns={3}
          />
        </div>
      </div>
    </div>
  );
}
