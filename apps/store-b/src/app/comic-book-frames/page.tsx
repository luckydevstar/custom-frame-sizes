import type { Metadata } from "next";

import { ComicBookFramesPageContent } from "@/components/comic-book-frames/comic-book-frames-page-content";

const pageUrl = "https://www.shadowboxframes.com/comic-book-frames";

/** b-shadow-box-frames-original/client/src/pages/ComicBookFrames.tsx */
export const metadata: Metadata = {
  title: "Custom Comic Book Frames | Display & Protect Your Collection | ShadowboxFrames.com",
  description:
    "Frame your comic book collection with custom shadowbox frames. Sized for raw comics (Golden, Silver, Bronze, Modern Age) and graded slabs (CGC, PGX, CBCS). Choose single display or multi-comic layouts.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Custom Comic Book Frames | Display & Protect Your Collection",
    description:
      "Frame your comic book collection with custom shadowbox frames. Accommodates raw comics and graded slabs. Professional UV protection and archival backing.",
    type: "website",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Comic Book Frames | Display & Protect Your Collection",
    description:
      "Custom shadowbox frames for comics and graded slabs—UV protection and archival backing.",
  },
};

export default function ComicBookFramesPage() {
  return <ComicBookFramesPageContent />;
}
