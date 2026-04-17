import { CardFramesContent } from "./card-frames-content";

import type { Metadata } from "next";

import { generatePageMetadata } from "@/lib/seo-utils";

const baseUrl = "https://www.customframesizes.com";

export const metadata: Metadata = generatePageMetadata("/card-frames", {
  title: "Graded Card Frames | PSA, SGC, CGC, BGS Card Display | CustomFrameSizes.com",
  description:
    "Shadowbox frames for PSA, SGC, CGC, and BGS graded cards. Display 1-8 slabs with double mats, brass nameplates, and archival protection. Custom layouts for sports cards and TCG.",
  keywords: [
    "graded card frames",
    "PSA card frames",
    "BGS card display",
    "SGC card frames",
    "CGC card frames",
    "sports card shadowbox",
    "TCG card display",
    "graded slab frames",
  ],
  domain: baseUrl,
});

export default function CardFramesPage() {
  return <CardFramesContent />;
}
