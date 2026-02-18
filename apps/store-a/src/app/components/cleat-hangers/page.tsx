import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Star, Ruler, Check } from "lucide-react";
import { Card, CardContent, Button } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";

export const metadata: Metadata = {
  title:
    '12" Heavy-Duty Metal Cleat Bar Hanging System - Professional French Cleat Picture Hangers | Custom Frame Sizes',
  description:
    "Rock-solid French cleat hanging system for large & heavy frames. 12-inch metal cleat bars with perfect leveling, heavy-duty weight support. Trusted by galleries, frame shops & installers. Bulk pricing available.",
  keywords:
    "french cleat picture hanger, metal cleat bar, heavy duty frame hanger, 12 inch cleat hanger, large frame hanging system, professional picture hanging, gallery hanging hardware, interlocking cleat system",
  openGraph: {
    title: '12" Heavy-Duty Metal Cleat Bar Hanging System',
    description:
      "French cleat system for large frames. Heavy-duty support, perfect leveling. From $8.95.",
    type: "website",
  },
};

export default function CleatHangersPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            All Components
          </Link>

          <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <Shield className="w-24 h-24 text-muted-foreground/50" />
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Star className="w-4 h-4" />
                Professional Grade
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                12&quot; Heavy-Duty Metal Cleat Bar System
              </h1>
              <p className="text-muted-foreground">
                Heavy-duty French cleat hanging system for large and oversized frames. Rock-solid
                interlocking design with perfect leveling every time.
              </p>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">$8.95</span>
                <span className="text-muted-foreground">per set</span>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                  Heavy-Duty Support
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                  Perfect Leveling
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                  Professional Grade
                </li>
              </ul>

              <Card className="p-4">
                <CardContent className="p-0 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Bulk pricing available for 10, 25, or 100 sets. Trusted by galleries, frame
                    shops, and installers for large and heavy frames.
                  </p>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/contact">Add to Cart / Inquire</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <section className="py-8 border-t">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Ruler className="h-5 w-5 text-primary" />
              How to Use
            </h2>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Mount the wall half of the cleat level on the wall with screws into studs or
                  anchors.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Attach the frame half to the back of your frame with the included hardware.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Hang the frame by sliding the two cleat halves together. The interlocking design
                  keeps the frame level and secure.
                </span>
              </li>
            </ul>
          </section>

          <RelatedProducts
            productKeys={["security-hardware-kit", "brass-nameplates", "acrylic"]}
            title="Related Components"
            columns={3}
          />
        </div>
      </div>
    </div>
  );
}
