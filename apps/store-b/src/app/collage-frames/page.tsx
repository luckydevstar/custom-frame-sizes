import type { Metadata } from "next";

import { CollageFramesPageContent } from "@/components/collage-frames/collage-frames-page-content";

/** origina-store-b CollageFrames Seo */
export const metadata: Metadata = {
  title: "Multi Opening Frames | Multi Photo Frames & Collage Mats",
  description:
    "Multi-opening photo collage frames with custom mat layouts. Fits mixed photo sizes in one display.",
  keywords: [
    "collage frame",
    "multi opening frame",
    "multi opening mat",
    "photo collage frame",
    "multi photo frame",
    "family photo frame",
    "picture collage frame",
    "gallery wall frame",
    "multiple opening frame",
    "custom collage frame",
    "wedding collage frame",
    "baby collage frame",
  ],
  alternates: {
    canonical: "https://www.shadowboxframes.com/collage-frames",
  },
  openGraph: {
    title: "Multi Opening Frames | Multi Photo Frames & Collage Mats",
    description:
      "Multi-opening photo collage frames with custom mat layouts. Fits mixed photo sizes in one display.",
    type: "website",
  },
};

export default function CollageFramesPage() {
  return <CollageFramesPageContent />;
}
