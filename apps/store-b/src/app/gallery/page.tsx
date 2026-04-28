import type { Metadata } from "next";

import { GalleryPageContent } from "@/components/gallery/gallery-page-content";

/** origina-store-b/client/src/pages/Gallery.tsx — <Seo title description /> */
export const metadata: Metadata = {
  title: "Customer Gallery",
  description:
    "See how customers use ShadowboxFrames.com frames in their homes, offices, and galleries. Real projects, real results.",
};

export default function GalleryPage() {
  return <GalleryPageContent />;
}
