import type { Metadata } from "next";
import { Suspense } from "react";

import { MatDesignerPageContent } from "@/components/mat/mat-designer-page-content";

/** origina-store-b/client/src/pages/MatDesigner.tsx — Helmet */
export const metadata: Metadata = {
  title: "Custom Mat Board Designer - Single Opening Design in Any Size | ShadowboxFrames",
  description:
    "Design custom picture mats with our professional mat cutting tool. Create single or double mats with V-groove decorative detail, 50 mat colors, and various opening shapes. Precision 1/8-inch measurements, backing boards included, bulk pricing available. Used by professional framers, photographers, and artists.",
  keywords: [
    "custom mat board",
    "picture mat cutting",
    "double mat",
    "oval mat",
    "v-groove mat",
    "museum mat",
    "photo mat",
    "custom matting",
    "mat board cutter",
    "professional picture matting",
    "backing boards",
    "bulk mat pricing",
  ],
  alternates: {
    canonical: "https://www.shadowboxframes.com/mat-designer",
  },
  openGraph: {
    title: "Custom Mat Board Designer - Single Opening Design | ShadowboxFrames",
    description:
      "Professional mat board designer with 50 mat colors, V-groove decorative detail, single/double mat options. Backing boards included, bulk pricing available. Precision cutting to 1/8-inch for professional framing.",
    type: "website",
    url: "https://www.shadowboxframes.com/mat-designer",
    images: [{ url: "https://www.shadowboxframes.com/og-mat-designer.jpg" }],
  },
};

export default function MatDesignerPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-6 py-16 min-h-[60vh] flex items-center justify-center text-muted-foreground">
          Loading mat designer…
        </div>
      }
    >
      <MatDesignerPageContent />
    </Suspense>
  );
}
