import type { Metadata } from "next";
import Link from "next/link";
import { Truck, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@framecraft/ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@framecraft/ui";
import { Button } from "@framecraft/ui";

export const metadata: Metadata = {
  title: "Order Frame, Mat & Acrylic Samples | Free Shipping | Custom Frame Sizes",
  description:
    "Order samples before you buy. Get 4-inch frame moulding pieces ($5) and 2x2-inch mat board or acrylic samples ($3). Free shipping on all sample orders. See colors, textures, and finishes in person.",
  keywords:
    "picture frame samples, mat board samples, acrylic samples, frame moulding samples, custom framing samples, free shipping samples",
  openGraph: {
    title: "Order Frame & Mat Samples | Free Shipping | Custom Frame Sizes",
    description:
      "Try before you buy. Order samples of our custom picture frames, mat boards, and acrylic glazing. Free shipping on all sample orders.",
    type: "website",
    url: "/samples",
  },
};

export default function SamplesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-screen-xl pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-page-title">
            Order Frame & Mat Samples
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            See our materials in person before you order. Frame samples are 4-inch pieces of actual
            moulding. Mat and acrylic samples are 2×2-inch pieces. Choose what you need below.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-4 py-2 rounded-full">
            <Truck className="w-5 h-5" />
            <span className="font-medium">Free Shipping on All Samples</span>
          </div>
        </div>

        {/* Pricing Summary */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frame Samples</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="font-semibold text-foreground">$5 each</p>
                <p className="text-sm mt-1">
                  4-inch piece of actual frame moulding. See true color, texture, profile, and
                  finish.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mat Board Samples</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="font-semibold text-foreground">$3 each</p>
                <p className="text-sm mt-1">
                  2×2-inch piece. Compare colors and textures against your artwork.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acrylic Glazing Samples</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="font-semibold text-foreground">$3 each</p>
                <p className="text-sm mt-1">
                  Standard and non-glare acrylic. 2×2-inch piece to test clarity and finish.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Select frame styles, mat colors, and acrylic types below. Add your choices to cart for
              checkout. Full sample builder with all styles is available — contact us to order
              specific samples.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Order Samples / Contact Us</Link>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="frame-size">
              <AccordionTrigger className="hover:no-underline">
                How big are the frame samples?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Frame samples are 4-inch pieces of actual frame moulding. You can see the true
                color, texture, profile, and finish of the frame before ordering.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="mat-acrylic-size">
              <AccordionTrigger className="hover:no-underline">
                How big are the mat and acrylic samples?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Mat board and acrylic samples are 2×2-inch pieces. This size lets you compare colors
                and textures against your artwork.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="hover:no-underline">
                Is shipping free on sample orders?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, all sample orders ship free within the United States. Samples typically arrive
                within 3–5 business days.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger className="hover:no-underline">
                Can I return unused samples?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Samples are non-refundable. They are yours to keep and use for future framing
                projects.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
}
