import type { Metadata } from "next";

import { RecordAlbumFramesPageContent } from "@/components/record-album-frames/record-album-frames-page-content";

/** origina-store-b RecordAlbumFrames Seo */
export const metadata: Metadata = {
  title: "Custom Record Album Frames | Vinyl LP Display | Professional Framing",
  description:
    "Premium custom record album frames featuring 3 professional layouts for vinyl LP display. Archival-grade protection with framer's grade acrylic, archival matting, solid pine construction, and archival nylon mounting system. Frame album covers, vinyl records, and picture discs with reversible archival-grade materials.",
  keywords: [
    "record album frames",
    "vinyl record frames",
    "LP frames",
    "album cover frames",
    "music memorabilia framing",
    "vinyl display frames",
    "picture disc frames",
    "vinyl collection display",
    "record framing",
    "custom vinyl frames",
    "album art frames",
    "12 inch record frames",
    "gatefold album frames",
    "colored vinyl frames",
    "first pressing frames",
    "music room decor",
    "vinyl wall display",
  ],
  alternates: {
    canonical: "https://www.shadowboxframes.com/record-album-frames",
  },
  openGraph: {
    title: "Custom Record Album Frames | Vinyl LP Display | Professional Framing",
    description:
      "Premium custom record album frames featuring 3 professional layouts for vinyl LP display. Archival-grade protection with framer's grade acrylic, archival matting, solid pine construction, and archival nylon mounting system.",
    type: "website",
    images: ["https://www.shadowboxframes.com/images/record-album-lifestyle/Record_Frame_Lifestyle (1).png"],
  },
};

export default function RecordAlbumFramesPage() {
  return <RecordAlbumFramesPageContent />;
}
