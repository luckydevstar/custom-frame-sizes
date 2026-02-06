import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { Card, ComingSoonDesigner, Separator } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ScrollToDesignerButton } from "./scroll-button";
import { brandConfig } from "../../brand.config";

export const metadata: Metadata = {
  title: "Wedding Frame for Guest Signatures - Replace Your Guest Book | Custom Frame Sizes",
  description:
    "Wedding frame with mat board for guest signatures. Replace your wedding guest book with a custom picture frame. Photo opening in center, wide mat for signatures. Includes colored pens. Choose 5×5 or 8×8 inch openings.",
  openGraph: {
    title: "Wedding Frame for Guest Signatures - Replace Your Guest Book",
    description:
      "Wedding frame replaces your guest book. Custom picture frame with photo opening and mat border for signatures. Includes colored pens. Perfect for weddings, graduations, and events.",
    type: "website",
    url: "/signature-frames",
  },
  alternates: { canonical: "/signature-frames" },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Wedding Frame for Guest Signatures",
  description:
    "Wedding frame with mat board for guest signatures. Custom picture frame replaces guest book at weddings. Photo opening in center (5x5 or 8x8 inches). Wide mat border for signatures. Includes colored signature pens. Archival matting in 46 colors. Square or circle opening shapes available.",
  brand: { "@type": "Brand", name: "Custom Frame Sizes" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: 45.0,
    highPrice: 165.0,
    availability: "https://schema.org/InStock",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "218" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a wedding frame for signatures?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A wedding frame for signatures is a custom picture frame that replaces your guest book. It has a wide mat border where wedding guests sign their names and write messages. The center has a photo opening (5×5 or 8×8 inches) for your engagement or wedding photo. After your wedding, the signed mat goes in the frame to hang in your home as a keepsake.",
      },
    },
    {
      "@type": "Question",
      name: "What size wedding frame should I get for guest signatures?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose based on your guest count. The 5×5 inch opening works for 20-50 wedding guests and creates frames from 17×17 to 29×29 inches. The 8×8 inch opening works for 50-100+ guests and creates frames from 20×20 to 32×32 inches. Larger mat borders give more space for signatures.",
      },
    },
    {
      "@type": "Question",
      name: "Do wedding signature frames come with pens?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every wedding signature frame includes a set of colored signature pens at no cost. These archival-quality pens are designed for writing on mat board. They won't fade or bleed over time. The colored pens let guests write messages in different colors.",
      },
    },
    {
      "@type": "Question",
      name: "How do I use a wedding signature frame at my reception?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Before your wedding, insert an engagement photo (or leave blank). Display the unframed mat board at your reception with the included pens. Set up a sign asking guests to sign around the photo. After your wedding, put the mat back in the frame and hang it in your home as a reminder of everyone who celebrated with you.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: brandConfig.seo?.canonicalUrl || "https://www.customframesizes.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Signature Frames",
      item: `${brandConfig.seo?.canonicalUrl || "https://www.customframesizes.com"}/signature-frames`,
    },
  ],
};

export default function SignatureFramesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
              <Heart className="w-3 h-3" />
              <span className="text-xs font-medium" data-testid="text-badge">
                Wedding Guest Book Alternative
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
              data-testid="text-hero-title"
            >
              Wedding Frame for Guest Signatures
            </h1>
            <p
              className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
              data-testid="text-hero-subtitle"
            >
              Replace your wedding guest book with a custom picture frame. Your engagement photo
              goes in the center. Wedding guests sign the mat board around it. After your wedding,
              hang it in your home as a keepsake. Includes colored signature pens.
            </p>
            <ScrollToDesignerButton />
          </div>
        </section>

        {/* Benefit bar */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto text-center">
              <div>
                <p className="text-[0.7rem] md:text-sm font-medium">5×5 or 8×8 Openings</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground">Photo in center</p>
              </div>
              <div>
                <p className="text-[0.7rem] md:text-sm font-medium">46 Mat Colors</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground">Archival matting</p>
              </div>
              <div>
                <p className="text-[0.7rem] md:text-sm font-medium">Pens Included</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground">
                  Colored signature pens
                </p>
              </div>
              <div>
                <p className="text-[0.7rem] md:text-sm font-medium">Square or Circle</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground">Opening shapes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Designer */}
        <section id="design-tool" className="py-6 md:py-8 scroll-mt-20">
          <div className="container mx-auto px-4">
            <ComingSoonDesigner
              title="Signature frame designer coming soon"
              description="Use our main frame designer to choose your size and mat. We'll add a dedicated wedding signature frame designer with 5×5 and 8×8 openings soon."
              buttonLabel="Design your wedding frame"
            />
          </div>
        </section>

        {/* Lifestyle heading */}
        <section className="py-12 px-4 border-t">
          <div className="container mx-auto max-w-7xl text-center mb-8">
            <h2
              className="text-2xl md:text-3xl font-bold mb-3"
              data-testid="text-lifestyle-heading"
            >
              Wedding Frames at Real Weddings
            </h2>
            <p
              className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-lifestyle-description"
            >
              Real wedding photos showing couples using signature frames instead of guest books
            </p>
          </div>
        </section>

        {/* Popular Uses */}
        <section className="py-12 px-4 border-t bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              How to Use Wedding Signature Frames
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-3">
                <h3 className="font-semibold text-lg">At Your Wedding Reception</h3>
                <p className="text-sm text-muted-foreground">
                  Put your engagement photo in the center. Set the frame at your reception entrance
                  or guest book table. Wedding guests sign the white mat border with the included
                  colored pens.
                </p>
              </Card>
              <Card className="p-6 space-y-3">
                <h3 className="font-semibold text-lg">Display in Your Home</h3>
                <p className="text-sm text-muted-foreground">
                  After your wedding, the signed mat goes back in the frame. Hang your wedding
                  signature frame in your bedroom, hallway, or living room.
                </p>
              </Card>
              <Card className="p-6 space-y-3">
                <h3 className="font-semibold text-lg">Also Perfect For Graduations</h3>
                <p className="text-sm text-muted-foreground">
                  Use the same signature frame concept for graduation parties. Display your
                  graduation photo. Collect signatures from classmates, teachers, and family.
                </p>
              </Card>
              <Card className="p-6 space-y-3">
                <h3 className="font-semibold text-lg">Baby Showers &amp; Birthdays</h3>
                <p className="text-sm text-muted-foreground">
                  Signature frames work for any celebration. Baby showers, milestone birthdays,
                  retirement parties, anniversaries. Collect advice, wishes, and memories.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4 border-t">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Wedding Signature Frame Questions
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold">What is a wedding frame for signatures?</h3>
                <p className="text-sm text-muted-foreground">
                  A wedding frame for signatures is a custom picture frame that replaces your guest
                  book. It has a wide mat border where wedding guests sign their names and write
                  messages. The center has a photo opening (5×5 or 8×8 inches) for your engagement
                  or wedding photo. After your wedding, the signed mat goes in the frame to hang in
                  your home as a keepsake.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">
                  What size wedding frame should I get for guest signatures?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose based on your guest count. The 5×5 inch opening works for 20-50 wedding
                  guests and creates frames from 17×17 to 29×29 inches. The 8×8 inch opening works
                  for 50-100+ guests and creates frames from 20×20 to 32×32 inches.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Do wedding signature frames come with pens?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. Every wedding signature frame includes a set of colored signature pens at no
                  cost. These archival-quality pens are designed for writing on mat board. They
                  won&apos;t fade or bleed over time.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">
                  How do I use a wedding signature frame at my reception?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Before your wedding, insert an engagement photo (or leave blank). Display the
                  unframed mat board at your reception with the included pens. Set up a sign asking
                  guests to sign around the photo. After your wedding, put the mat back in the frame
                  and hang it in your home.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedProducts
          productKeys={[
            "wedding-invitation",
            "preserved-bouquet",
            "picture-frames",
            "collage-frames",
          ]}
          columns={4}
        />
      </div>
    </>
  );
}
