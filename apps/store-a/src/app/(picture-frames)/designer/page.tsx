import { FrameDesigner } from "@framecraft/ui";
import Link from "next/link";
import { Suspense } from "react";

import type { Metadata } from "next";

import {
  generateMetadata,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateWebsiteSchema,
  getCanonicalUrl,
} from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Custom Picture Frame Designer | Design Your Frame | CustomFrameSizes.com",
  description:
    "Design custom picture frames online with our interactive designer. Any size from 4×4 to 60×60 inches. 100+ styles, instant pricing, and real-time preview.",
  canonical: "https://customframesizes.com/designer",
  ogTitle: "Custom Picture Frame Designer - Interactive Builder",
  ogDescription:
    "Design and customize your perfect picture frame online. Any size, any style, instant pricing.",
});

export default function DesignerPage() {
  const breadcrumbs = [
    { name: "Home", url: getCanonicalUrl("/") },
    { name: "Designer", url: getCanonicalUrl("/designer") },
  ];

  return (
    <>
      {/* Structured Data - Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateProductSchema({
            name: "Custom Picture Frame",
            description:
              "Design custom picture frames online with our interactive designer. Any size from 4×4 to 60×60 inches. Choose from 100+ styles, instant pricing, and real-time preview.",
            lowPrice: 25,
            highPrice: 500,
            url: getCanonicalUrl("/designer"),
            material: "Wood (premium hardwoods), Metal, Metal composites",
            additionalProperties: [
              { name: "Size Range", value: "4×4 to 60×60 inches" },
              { name: "Frame Styles", value: "100+" },
              { name: "Size Granularity", value: "1/8 inch" },
              { name: "Features", value: "Custom size, real-time preview, instant pricing" },
            ],
          }),
        }}
      />

      {/* Structured Data - BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbSchema(breadcrumbs),
        }}
      />

      {/* Structured Data - WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateWebsiteSchema(),
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Above tool: H1 and intro for SEO */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold mb-4">Custom Picture Frame Designer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Use our custom picture frame designer to create the perfect frame for your artwork.
            Enter any size from 4×4 to 60×60 inches in 1/8&quot; increments, choose from 100+ frame
            styles, and add mats and glazing with real-time pricing. What you see in the preview is
            exactly what we build and ship to you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Main: Designer tool + below-tool content */}
          <div className="flex-1 min-w-0">
            <Suspense
              fallback={
                <div className="min-h-[600px] flex items-center justify-center">
                  Loading designer...
                </div>
              }
            >
              <FrameDesigner />
            </Suspense>

            {/* Below tool: How to Use, Frame Styles, Customization Options */}
            <div className="mt-16 space-y-14">
              <section>
                <h2 className="font-serif text-2xl font-bold mb-6">How to Use the Designer</h2>
                <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Enter your size</strong> — Type your artwork
                    dimensions (width × height) in inches. Use fractions or decimals; we support
                    1/8&quot; precision.
                  </li>
                  <li>
                    <strong className="text-foreground">Choose a frame style</strong> — Browse
                    picture frames, shadowbox frames, and specialty styles. Click to select; the
                    preview updates instantly.
                  </li>
                  <li>
                    <strong className="text-foreground">Add a mat (optional)</strong> — Select
                    single or double mat, pick from 46 mat colors, and set border width. The
                    designer shows the exact opening size.
                  </li>
                  <li>
                    <strong className="text-foreground">Select glazing</strong> — Choose standard
                    glass, acrylic, or non-glare acrylic. We recommend acrylic for larger sizes and
                    shipping safety.
                  </li>
                  <li>
                    <strong className="text-foreground">Review and add to cart</strong> — Check the
                    live preview and price, then add to cart. Your configuration is saved for
                    checkout.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold mb-6">Available Frame Styles</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our custom picture frame designer includes wood frames in classic and modern
                  profiles, metal frames, and composite options. Each style is shown with accurate
                  color and finish. Popular categories include black picture frames, natural wood
                  frames, white and gold frames, and narrow or wide moulding profiles. All frames
                  are available in any size you enter.
                </p>
                <Link href="/frames" className="text-primary font-medium hover:underline">
                  Browse all frame styles →
                </Link>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold mb-6">Customization Options</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Artwork size</strong> — Any dimensions from
                    4×4 to 60×60 inches, 1/8&quot; increments
                  </li>
                  <li>
                    <strong className="text-foreground">Frame style</strong> — 100+ styles (wood,
                    metal, composite)
                  </li>
                  <li>
                    <strong className="text-foreground">Mat board</strong> — Single or double mat,
                    46 colors, custom border width
                  </li>
                  <li>
                    <strong className="text-foreground">Glazing</strong> — Standard glass,
                    framer&apos;s acrylic, non-glare acrylic
                  </li>
                  <li>
                    <strong className="text-foreground">Quantity</strong> — Order one or multiple
                    identical frames
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Sidebar: Related guides, FAQ snippets, Popular configurations */}
          <aside className="lg:w-80 shrink-0 space-y-8">
            <section className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Related Guides</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/learn" className="text-primary hover:underline">
                    How to Measure for a Picture Frame
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="text-primary hover:underline">
                    Mat Border Width Guide
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-primary hover:underline">
                    Custom Frame FAQ
                  </Link>
                </li>
              </ul>
            </section>

            <section className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">FAQ</h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <p className="font-medium text-foreground">Can I order non-standard sizes?</p>
                  <p>
                    Yes. Enter any size from 4×4 to 60×60 inches in 1/8&quot; increments. Custom
                    sizes are our specialty.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-foreground">When do I see the price?</p>
                  <p>
                    Pricing updates in real time as you change size, frame, mat, and glazing. No
                    surprises at checkout.
                  </p>
                </li>
              </ul>
              <Link
                href="/faq"
                className="text-primary font-medium text-sm hover:underline mt-2 inline-block"
              >
                More FAQs →
              </Link>
            </section>

            <section className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Popular Configurations</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/designer?width=8&height=10" className="text-primary hover:underline">
                    8×10 inch
                  </Link>
                </li>
                <li>
                  <Link
                    href="/designer?width=16&height=20"
                    className="text-primary hover:underline"
                  >
                    16×20 inch
                  </Link>
                </li>
                <li>
                  <Link
                    href="/designer?width=11&height=14"
                    className="text-primary hover:underline"
                  >
                    11×14 inch
                  </Link>
                </li>
                <li>
                  <Link
                    href="/designer?width=24&height=36"
                    className="text-primary hover:underline"
                  >
                    24×36 inch
                  </Link>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
