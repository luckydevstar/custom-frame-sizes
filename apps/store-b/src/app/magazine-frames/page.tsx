import type { Metadata } from "next";

import { MagazineFramesPageContent } from "@/components/magazine-frames/magazine-frames-page-content";
import {
  magazineFaqSchema,
  magazineProductSchema,
} from "@/config/magazine-frames-data";

const pageUrl = "https://www.shadowboxframes.com/magazine-frames";

/** b-shadow-box-frames-original/client/src/pages/specialty/MagazineFrames.tsx — Seo */
export const metadata: Metadata = {
  title: "Magazine Frames - Custom Shadowbox Frames for Collectible Magazines",
  description:
    "Custom magazine frames with shadowbox depth for collectible magazines. Framer's grade acrylic, archival matting, and multiple layouts. Frame vintage magazines from TIME, Life, Vogue, Rolling Stone, National Geographic, and more.",
  keywords: [
    "magazine frames",
    "shadowbox magazine frame",
    "vintage magazine frame",
    "collectible magazine display",
    "magazine cover frame",
    "custom magazine frame",
    "Life magazine frame",
    "Vogue frame",
    "Rolling Stone frame",
    "National Geographic frame",
    "TIME magazine frame",
    "magazine preservation frame",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Magazine Frames - Custom Shadowbox Frames for Collectible Magazines",
    description:
      "Custom magazine frames with shadowbox depth for collectible magazines. Framer's grade acrylic, archival matting, and multiple layouts.",
    type: "website",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Magazine Frames - Custom Shadowbox Frames for Collectible Magazines",
    description:
      "Custom magazine frames with shadowbox depth—framer's grade acrylic and archival matting for collectible magazines.",
  },
};

export default function MagazineFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(magazineProductSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(magazineFaqSchema) }} />
      <MagazineFramesPageContent />
    </>
  );
}
