import type { Metadata } from "next";

import { ShadowboxColorsPageContent } from "@/components/shadowboxes/shadowbox-colors-page-content";

const canonical = "https://www.shadowboxframes.com/shadowboxes/colors";

/** origina-store-b/client/src/pages/shadowboxes/ShadowboxColors.tsx — Helmet */
export const metadata: Metadata = {
  title: "Shadow Box Frames by Color | ShadowboxFrames.com",
  description:
    "Browse our shadow box frames by color. From classic black and white to natural wood tones and bold finishes -- find the perfect frame to match your display.",
  keywords: [
    "shadowbox frames by color",
    "black shadowbox",
    "white shadowbox",
    "brown shadowbox frames",
    "gold shadowbox frames",
    "silver shadowbox display case",
    "blue shadowbox",
    "natural wood shadowbox",
    "jersey display frames",
    "medal display case",
    "memorabilia frames",
    "deep profile frames",
    "3D display frames",
  ],
  alternates: { canonical },
  openGraph: {
    title: "Shadow Box Frames by Color | ShadowboxFrames.com",
    description:
      "Browse our shadow box frames by color. From classic black and white to natural wood tones and bold finishes -- find the perfect frame to match your display.",
    type: "website",
    url: canonical,
    images: [{ url: "https://www.shadowboxframes.com/images/shadowbox-colors-hero.jpg" }],
  },
};

export default function ShadowboxColorsPage() {
  return <ShadowboxColorsPageContent />;
}
