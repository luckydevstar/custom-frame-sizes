import type { Metadata } from "next";
import { Suspense } from "react";
import { FrameDesigner } from "@framecraft/ui";
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
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4">Design Your Perfect Frame</h1>
          <p className="hidden md:block text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your image and customize every detail to create a frame that&apos;s uniquely
            yours
          </p>
          <p className="md:hidden text-base text-muted-foreground max-w-2xl mx-auto">
            Start by tapping Customize to adjust your size, mat, and finish. Switch to Preview
            anytime to see it in real time.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="min-h-[600px] flex items-center justify-center">
              Loading designer...
            </div>
          }
        >
          <FrameDesigner />
        </Suspense>
      </div>
    </>
  );
}
