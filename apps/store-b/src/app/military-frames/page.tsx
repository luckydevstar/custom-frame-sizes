import type { Metadata } from "next";

import { MilitaryFramesPageContent } from "@/components/military-frames/military-frames-page-content";

/** origina-store-b/client/src/pages/MilitaryFrames.tsx Helmet */
export const metadata: Metadata = {
  title: "Military Shadow Box Frames | ShadowboxFrames.com",
  description:
    "Honor years of service with a handcrafted military shadow box. Display medals, flags, insignia, and service memories with the respect they deserve.",
  alternates: {
    canonical: "https://www.shadowboxframes.com/military-frames",
  },
  openGraph: {
    title: "Military Shadow Box Frames | ShadowboxFrames.com",
    description:
      "Honor years of service with a handcrafted military shadow box. Display medals, flags, insignia, and service memories with the respect they deserve.",
    type: "website",
  },
};

export default function MilitaryFramesPage() {
  return <MilitaryFramesPageContent />;
}
