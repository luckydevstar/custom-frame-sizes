import type { Metadata } from "next";
import Link from "next/link";
import { Ruler, Frame } from "lucide-react";
import { Button, Card, CardContent } from "@framecraft/ui";
import { brandConfig } from "../../../brand.config";

/** Common frame sizes for browse-by-size. Links to designer with size pre-filled where supported. */
const COMMON_SIZES = [
  { w: 4, h: 6, label: '4×6"', popular: true },
  { w: 5, h: 7, label: '5×7"', popular: true },
  { w: 8, h: 10, label: '8×10"', popular: true },
  { w: 11, h: 14, label: '11×14"', popular: true },
  { w: 16, h: 20, label: '16×20"', popular: true },
  { w: 18, h: 24, label: '18×24"', popular: false },
  { w: 24, h: 36, label: '24×36"', popular: true },
  { w: 8, h: 8, label: '8×8"', popular: false },
  { w: 12, h: 12, label: '12×12"', popular: false },
  { w: 20, h: 24, label: '20×24"', popular: false },
  { w: 20, h: 30, label: '20×30"', popular: false },
  { w: 30, h: 40, label: '30×40"', popular: false },
];

export const metadata: Metadata = {
  title: "Picture Frames by Size - Custom Dimensions | CFS",
  description:
    "Shop 100+ custom picture frame sizes from 4×4 to 48×72 inches. Standard sizes (8×10, 16×20, 24×36) and hard-to-find dimensions. Made-to-order with instant pricing.",
  openGraph: {
    title: "Picture Frames by Size - Custom Dimensions",
    description:
      "Shop custom frames by size: standard dimensions like 8×10 and 16×20, plus hard-to-find custom sizes. Precision-made to your exact specifications.",
    type: "website",
    url: "/frames/sizes",
  },
  alternates: { canonical: "/frames/sizes" },
};

export default function FramesBySizePage() {
  const baseUrl = brandConfig.seo?.canonicalUrl || "https://customframesizes.com";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Frames by Size", item: `${baseUrl}/frames/sizes` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What's the most popular picture frame size?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 24×36 inch format represents our highest-volume frame size, accommodating standard poster prints, large photography, and oversized art reproductions. For smaller artwork, the 8×10 and 16×20 sizes remain perennially popular for family photos, professional portraits, and gallery walls.",
        },
      },
      {
        "@type": "Question",
        name: "Do you make custom sizes not listed here?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we manufacture any rectangular frame dimension from 4×4 inches minimum to 48×72 inches maximum in 1/16 inch increments. Use our custom frame designer to specify exact dimensions and receive instant pricing for any size combination.",
        },
      },
      {
        "@type": "Question",
        name: "How do I know what size frame to order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Measure your artwork dimensions (width × height), then add your desired mat border width to all four sides. For example, a 16×20 print with 3-inch mat borders requires a 22×26 frame (16+3+3 by 20+3+3). Our interactive designer includes measurement guides and size calculators to simplify this process.",
        },
      },
      {
        "@type": "Question",
        name: "Are larger frame sizes more expensive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Frame pricing calculates by total frame perimeter (width + width + height + height), with proportional increases for larger dimensions. Our per-inch pricing remains consistent across all sizes—you pay fairly for the actual frame length manufactured regardless of dimension.",
        },
      },
      {
        "@type": "Question",
        name: "Can I frame artwork larger than 48×72 inches?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our current manufacturing capabilities accommodate frames up to 48×72 inches. Artwork exceeding these dimensions requires consultation for specialized oversize framing solutions. Contact our framing specialists for large-scale artwork requiring dimensions beyond our standard manufacturing range.",
        },
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Picture Frames by Size",
    description:
      "Browse 100+ custom picture frame sizes from 4×4 to 48×72 inches. Standard sizes like 8×10, 16×20, and 24×36, plus hard-to-find custom dimensions.",
    url: `${baseUrl}/frames/sizes`,
    inLanguage: "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen">
        <section className="relative bg-gradient-to-b from-muted/30 to-background py-8 md:py-16 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <Ruler className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                      Picture Frames by Size
                    </h1>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
                    Browse our complete collection of custom picture frame sizes organized by
                    dimensions. From popular standard sizes like 8×10 and 24×36 to hard-to-find
                    custom measurements.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <Button
                      size="lg"
                      asChild
                      className="min-h-12"
                      data-testid="button-hero-start-designing"
                    >
                      <Link href="/designer">
                        <Frame className="w-4 h-4 mr-2" />
                        Start Designing
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="min-h-12"
                      data-testid="button-hero-view-all"
                    >
                      <Link href="#all-sizes">View Common Sizes</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="all-sizes" className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Common Frame Sizes</h2>
            <p className="text-muted-foreground mb-8">
              Click a size to open the designer. You can enter any custom dimensions from 4×4&quot;
              to 48×72&quot; in 1/16&quot; increments.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {COMMON_SIZES.map((size) => (
                <Link key={size.label} href={`/designer?width=${size.w}&height=${size.h}`}>
                  <Card
                    className={`h-full cursor-pointer transition-all hover:border-primary/30 ${size.popular ? "ring-2 ring-primary/30" : ""}`}
                    data-testid={`size-${size.w}x${size.h}`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold">{size.label}</div>
                      {size.popular && <div className="text-xs text-primary mt-1">Popular</div>}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <p className="text-muted-foreground mt-6 text-center">
              Need a different size? Our designer supports any dimensions from 4×4&quot; to
              48×72&quot; in 1/16&quot; increments.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Frame Size Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">
                  What&apos;s the most popular picture frame size?
                </h3>
                <p className="text-muted-foreground text-sm">
                  The 24×36 inch format is our highest-volume frame size. For smaller artwork, 8×10
                  and 16×20 remain perennially popular for family photos, professional portraits,
                  and gallery walls.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you make custom sizes not listed here?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes. We manufacture any rectangular frame dimension from 4×4 inches to 48×72
                  inches maximum in 1/16 inch increments. Use our custom frame designer to specify
                  exact dimensions and get instant pricing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do I know what size frame to order?</h3>
                <p className="text-muted-foreground text-sm">
                  Measure your artwork (width × height), then add your desired mat border to all
                  four sides. For example, a 16×20 print with 3-inch mat borders needs a 22×26
                  frame. Our designer includes measurement guides.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl font-bold mb-4">Ready to order?</h2>
            <p className="text-muted-foreground mb-6">
              Enter your exact dimensions in our designer for instant pricing and professional-grade
              frames.
            </p>
            <Button size="lg" asChild>
              <Link href="/designer">Open Frame Designer</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
