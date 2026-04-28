import type { Metadata } from "next";
import { Suspense } from "react";

import { PictureFramesPageContent } from "@/components/picture-frames/picture-frames-page-content";

/** origina-store-b/client/src/pages/PictureFrames.tsx — Seo */
export const metadata: Metadata = {
  title: "Picture Frames from Our Shadow Box Workshop",
  description:
    "Custom picture frames from our shadow box workshop. Solid wood and metal profiles, cut to your exact dimensions.",
  alternates: {
    canonical: "https://www.shadowboxframes.com/picture-frames",
  },
  keywords:
    "custom picture frames, wood frames, custom framing, picture frame gallery, fine art frames, photo frames, gold picture frames",
};

export default function PictureFramesPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-gradient-to-b from-background to-muted/30" />}>
      <PictureFramesPageContent />
    </Suspense>
  );
}
