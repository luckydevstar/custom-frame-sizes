import type { Metadata } from "next";
import { CardFramesContent } from "./card-frames-content";

const baseUrl = "https://customframesizes.com";
const pageUrl = `${baseUrl}/card-frames`;

export const metadata: Metadata = {
  title: "Graded Card Frames | PSA, SGC, CGC, BGS Card Display | CustomFrameSizes.com",
  description:
    "Shadowbox frames for PSA, SGC, CGC, and BGS graded cards. Display 1-8 slabs with double mats, brass nameplates, and archival protection. Custom layouts for sports cards and TCG.",
  keywords:
    "graded card frames, PSA card frames, BGS card display, SGC card frames, CGC card frames, sports card shadowbox, TCG card display, graded slab frames",
  openGraph: {
    title: "Graded Card Frames - Display Frames for PSA, SGC, CGC, BGS Slabs",
    description:
      "Professional shadowbox frames for graded sports cards and TCG. Custom layouts with archival protection.",
    type: "website",
    url: pageUrl,
  },
  alternates: { canonical: pageUrl },
};

export default function CardFramesPage() {
  return <CardFramesContent />;
}
