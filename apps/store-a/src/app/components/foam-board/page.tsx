import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, SquareStack, Palette, Package, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";

export const metadata: Metadata = {
  title:
    "Foam Board – Mounting Board for Frames | White, Black, Self-Adhesive | Custom Frame Sizes",
  description:
    "Professional foam board in white, black, and self-adhesive. Popular sizes 24x36, 8x10, 13x19, 11x17, 12x18. Photo mounting and frame backing with wholesale pricing.",
  openGraph: {
    title: "Foam Board – Mounting Board for Frames",
    description: "Professional foam board in white, black, and self-adhesive. Wholesale pricing.",
    type: "website",
  },
};

export default function FoamBoardPage() {
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
            <SquareStack className="h-5 w-5" />
            <span className="text-sm font-medium">Components</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Foam Board</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Professional mounting boards in white, black, and self-adhesive options. Popular sizes
            like 24×36, 8×10, 13×19, 11×17, and 12×18 for photo mounting and frame backing.
          </p>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Palette className="h-5 w-5 text-primary" />
                    Multiple Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Standard white, black, and self-adhesive white. Archival-quality foam core for
                  mounting photos and artwork. Cut to your exact dimensions.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Package className="h-5 w-5 text-primary" />
                    Wholesale Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Bulk packs of 10 or 100 sheets with volume discounts. Same-day cutting available
                  for frame shops and serious DIY framers.
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
                  <strong className="text-foreground">In the Frame Designer:</strong> Foam board is
                  included as backing when you build a custom frame. We cut to your frame size.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">Standalone sheets:</strong>{" "}
                  <Link href="/contact" className="text-primary underline hover:no-underline">
                    Contact us
                  </Link>{" "}
                  with dimensions and quantity. Volume pricing for 10 or 100 sheets.
                </span>
              </li>
            </ul>
            <Button asChild size="lg">
              <Link href="/designer">Use in Frame Designer</Link>
            </Button>
          </section>

          <RelatedProducts
            productKeys={["acrylic", "security-hardware-kit", "picture-frames"]}
            title="Related Components & Frames"
            columns={3}
          />
        </div>
      </div>
    </div>
  );
}
