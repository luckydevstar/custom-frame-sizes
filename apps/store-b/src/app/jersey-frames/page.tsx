import type { Metadata } from "next";

import { JerseyFramesPageContent } from "@/components/jersey-frames/jersey-frames-page-content";

/** origina-store-b/client/src/pages/JerseyFrames.tsx Helmet title + meta description + canonical */
export const metadata: Metadata = {
  title: "Custom Jersey Shadow Box Frames | ShadowboxFrames.com",
  description:
    "Display your jerseys the way they deserve. Handcrafted jersey shadow boxes for game-worn, signed, and team jerseys, built by shadow box specialists.",
  alternates: {
    canonical: "https://www.shadowboxframes.com/jersey-frames",
  },
  openGraph: {
    title: "Custom Jersey Shadow Box Frames | ShadowboxFrames.com",
    description:
      "Display your jerseys the way they deserve. Handcrafted jersey shadow boxes for game-worn, signed, and team jerseys, built by shadow box specialists.",
    type: "website",
  },
};

export default function JerseyFramesPage() {
  return <JerseyFramesPageContent />;
}
