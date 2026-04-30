import type { Metadata } from "next";

import { PlaybillFramesPageContent } from "@/components/playbill-frames/playbill-frames-page-content";
import { playbillFaqSchema, playbillProductSchema } from "@/config/playbill-frames-data";

const pageUrl = "https://www.shadowboxframes.com/playbill-frames";

/** b-shadow-box-frames-original/client/src/pages/specialty/PlaybillFrames.tsx */
export const metadata: Metadata = {
  title: "Playbill Frames - Custom Shadowbox Frames for Theater Programs",
  description:
    "Custom shadowbox frames for theater playbills and ticket stubs. Framer's grade acrylic, acid-free matting, and 30+ layouts. Fits 5.5×8.5 inch programs. Frame 1-12 playbills.",
  keywords: [
    "playbill frames",
    "shadowbox playbill frame",
    "theater program frame",
    "broadway memorabilia frame",
    "ticket stub display frame",
    "musical theater frame",
    "playbill display case",
    "5.5x8.5 playbill frame",
    "custom playbill frame",
    "theater memorabilia shadowbox",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Playbill Frames - Custom Shadowbox Frames for Theater Programs",
    description:
      "Shadowbox frames for playbills and ticket stubs—acid-free matting, framer's grade acrylic, 30+ layouts.",
    type: "website",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Playbill Frames - Custom Shadowbox Frames for Theater Programs",
    description:
      "Custom shadowbox frames for Broadway playbills and ticket stubs with 30+ layouts.",
  },
};

export default function PlaybillFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(playbillProductSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(playbillFaqSchema) }} />
      <PlaybillFramesPageContent />
    </>
  );
}
