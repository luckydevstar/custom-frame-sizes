import type { Metadata } from "next";
import { Suspense } from "react";

import { DesignerPageContent } from "@/components/designer/designer-page-content";

/** origina-store-b/client/src/pages/Designer.tsx — Helmet */
export const metadata: Metadata = {
  title: "Custom Frame Designer - Design Your Perfect Frame | ShadowboxFrames.com",
  description:
    "Design custom frames with our interactive designer. Choose your size, frame style, mat colors, and glazing options. See instant pricing and preview your design in real-time.",
  alternates: {
    canonical: "https://www.shadowboxframes.com/designer",
  },
  openGraph: {
    title: "Custom Frame Designer - Interactive Frame Builder",
    description:
      "Design and customize your perfect picture frame online. Any size, any style, instant pricing.",
    type: "website",
    url: "https://www.shadowboxframes.com/designer",
  },
};

export default function DesignerPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-16 min-h-[60vh] flex items-center justify-center text-muted-foreground">
          Loading designer…
        </div>
      }
    >
      <DesignerPageContent />
    </Suspense>
  );
}
