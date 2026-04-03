import { Button } from "@framecraft/ui";
import { ArrowLeft } from "lucide-react";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";

import type { Metadata } from "next";

import {
  generateMetadata,
  generateProductSchema,
  generateBreadcrumbSchema,
  getCanonicalUrl,
} from "@/lib/seo";

const ShadowboxDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.ShadowboxDesigner),
  { ssr: false },
);

export const dynamic = "force-dynamic";

export const metadata: Metadata = generateMetadata({
  title: "Custom Shadowbox Designer | Design Your Shadowbox | CustomFrameSizes.com",
  description:
    "Design custom shadowbox frames with adjustable depth. Display 3D items, collectibles, jerseys, and memorabilia. Choose size, style, and glass options.",
  canonical: "https://www.customframesizes.com/shadowbox/designer",
  ogTitle: "Custom Shadowbox Designer - 3D Display Frames",
  ogDescription:
    "Design custom shadowbox frames for jerseys, medals, collectibles. Adjustable depth, professional display quality.",
});

export default function ShadowboxDesignerPage() {
  const breadcrumbs = [
    { name: "Home", url: getCanonicalUrl("/") },
    { name: "Shadowbox", url: getCanonicalUrl("/shadowbox") },
    { name: "Designer", url: getCanonicalUrl("/shadowbox/designer") },
  ];

  return (
    <>
      {/* Structured Data - Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateProductSchema({
            name: "Custom Shadowbox Frame",
            description:
              "Design custom shadowbox frames with adjustable depth. Display 3D items, collectibles, jerseys, and memorabilia. Choose size, style, and glass options. Professional display quality with real-time pricing.",
            lowPrice: 50,
            highPrice: 600,
            url: getCanonicalUrl("/shadowbox/designer"),
            material: "Wood, Glass or Acrylic",
            additionalProperties: [
              { name: "Depth Adjustment", value: "Adjustable" },
              { name: "Best For", value: "3D items, collectibles, jerseys, medals, memorabilia" },
              { name: "Glass Options", value: "Glass, Standard Acrylic, Non-Glare Acrylic" },
              { name: "Size Granularity", value: "1/8 inch" },
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

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/shadowbox">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shadowbox Frames
            </Link>
          </Button>
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Custom Shadowbox Designer</h1>
            <p className="text-muted-foreground">
              Design your perfect shadowbox frame with real-time pricing
            </p>
          </div>
          <Suspense
            fallback={
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading designer...</p>
                </div>
              </div>
            }
          >
            <ShadowboxDesigner />
          </Suspense>
        </div>
      </div>
    </>
  );
}
