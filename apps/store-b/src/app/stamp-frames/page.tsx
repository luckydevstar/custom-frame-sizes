import type { Metadata } from "next";

import { StampFramesPageContent } from "@/components/stamp-frames/stamp-frames-page-content";
import { stampFaqSchema, stampProductSchema } from "@/config/stamp-frames-seo-data";

const pageUrl = "https://www.shadowboxframes.com/stamp-frames";

/** b-shadow-box-frames-original/client/src/pages/StampFrames.tsx */
export const metadata: Metadata = {
  title: "Stamp Display Frames | Custom Shadowbox Frames for Stamp Collections",
  description:
    "Design custom stamp display frames with shadowbox depth for your collection. Frame stamps with archival double matting, professional-grade acrylic, and optional brass nameplates. Available in preset and custom sizes.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Stamp Display Frames | Custom Shadowbox Frames for Stamp Collections",
    description:
      "Professional stamp display frames with shadowbox depth, archival matting, and professional-grade glazing. Designed for philatelic displays and stamp collections.",
    type: "website",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Stamp Display Frames | Custom Shadowbox Frames for Stamp Collections",
    description:
      "Shadowbox stamp frames—archival double matting and professional-grade glazing for philatelic displays.",
  },
};

export default function StampFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(stampProductSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(stampFaqSchema) }} />
      <StampFramesPageContent />
    </>
  );
}
