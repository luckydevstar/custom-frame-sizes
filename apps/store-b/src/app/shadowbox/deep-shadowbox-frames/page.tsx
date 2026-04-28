import type { Metadata } from "next";

import { DeepShadowboxFramesPageContent } from "@/components/shadowboxes/deep-shadowbox-frames-page-content";

const pageUrl = "https://www.shadowboxframes.com/shadowbox/deep-shadowbox-frames";

/** origina-store-b/client/src/pages/DeepShadowboxFrames.tsx — Helmet */
export const metadata: Metadata = {
  title: 'Deep Shadowbox Frames | 0.875" to 3.5" Depth | ShadowboxFrames.com',
  description:
    "Find the right shadowbox frame depth for your display. Compare standard, medium, deep, and ultra deep frames from 0.875 to 3.5 inches. Custom sizes, solid wood, professional-grade materials.",
  keywords: [
    "deep shadow box frame",
    "3.5 inch shadowbox",
    "deep shadowbox for jersey",
    "extra deep shadow box",
    "helmet shadow box frame",
    "thick shadow box",
    "deep display case",
    "custom deep shadowbox",
    "shadow box depth comparison",
    "ultra deep shadow box",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Deep Shadowbox Frames, Compare Every Depth Option",
    description:
      "Shadow box frames in four depth tiers from 0.875 to 3.5 inches. Find the right depth for medals, jerseys, helmets, and everything in between.",
    type: "website",
    url: pageUrl,
  },
};

export default function DeepShadowboxFramesPage() {
  return <DeepShadowboxFramesPageContent />;
}
