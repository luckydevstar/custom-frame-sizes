import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@framecraft/ui";

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
        <div className="max-w-3xl mx-auto">
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
            Custom-cut acrylic glazing in regular and non-glare finishes. Popular sizes like 11x14,
            8x10, 24x36, 16x20, and 18x24 available with instant pricing. Bulk packs available.
          </p>

          <div className="grid gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Regular & Non-Glare</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Crystal-clear regular acrylic and non-glare (matte) options. Cut to your exact frame
                dimensions. Sizes from 4×4″ up to oversize; bulk packs save up to 40%.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Custom Sizes</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Enter width and height in inches. We cut to your specifications. No minimum order
                for single sheets; pack sizes of 10 or 100 for volume pricing.
              </CardContent>
            </Card>
          </div>

          <Button asChild size="lg">
            <Link href="/designer">Configure in Frame Designer</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Add acrylic glazing when building a custom frame, or{" "}
            <Link href="/contact" className="text-primary underline hover:no-underline">
              contact us
            </Link>{" "}
            for standalone sheet orders.
          </p>
        </div>
      </div>
    </div>
  );
}
