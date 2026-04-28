import type { Metadata } from "next";

import { ShadowboxesByStylePageContent } from "@/components/shadowboxes/shadowboxes-by-style-page-content";

const canonical = "https://www.shadowboxframes.com/shadowboxes/styles";

/** origina-store-b/client/src/pages/shadowboxes/ShadowboxesByStyle.tsx — Helmet */
export const metadata: Metadata = {
  title: "Shadowbox Frames by Style | Classic, Modern, Rustic & More | ShadowboxFrames.com",
  description:
    "Browse shadowbox frames by style. Classic, modern, rustic, natural wood, and statement frames in custom sizes. Find the aesthetic that fits your space.",
  keywords: [
    "shadowbox frame styles",
    "modern shadowbox",
    "rustic shadowbox",
    "classic shadow box",
    "natural wood shadowbox",
    "custom shadowbox frames",
  ],
  alternates: { canonical },
  openGraph: {
    title: "Shadowbox Frames by Style, Find Your Aesthetic",
    description:
      "Shop shadowbox frames by style. Classic, modern, rustic, natural wood, and bold statement options in any custom size.",
    type: "website",
    url: canonical,
  },
};

export default function ShadowboxesByStylePage() {
  return <ShadowboxesByStylePageContent />;
}
