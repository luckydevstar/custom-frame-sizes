import type { Metadata } from "next";

import { ShadowboxesByDepthPageContent } from "@/components/shadowboxes/shadowboxes-by-depth-page-content";

const canonical = "https://www.shadowboxframes.com/shadowboxes/depth";

/** origina-store-b/client/src/pages/shadowboxes/ShadowboxesByDepth.tsx — Helmet */
export const metadata: Metadata = {
  title: "Shadowbox Frames by Depth | Find the Right Fit | ShadowboxFrames.com",
  description:
    "Browse shadowbox frames by depth. Standard, medium, deep, and ultra deep options from 0.875 to 3.5 inches. Find the exact depth your items need. Custom sizes with instant pricing.",
  keywords: [
    "shadowbox frame depth",
    "deep shadowbox frames",
    "how deep shadowbox",
    "shadowbox depth guide",
    "ultra deep shadowbox",
    "deep display case",
  ],
  alternates: { canonical },
  openGraph: {
    title: "Shadowbox Frames by Depth, From 0.875 to 3.5 Inches",
    description:
      "Find the right shadowbox depth for your items. Four depth tiers from flat keepsakes to full-size helmets.",
    type: "website",
    url: canonical,
  },
};

export default function ShadowboxesByDepthPage() {
  return <ShadowboxesByDepthPageContent />;
}
