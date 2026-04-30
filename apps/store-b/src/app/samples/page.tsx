import type { Metadata } from "next";

import { SamplesPageContent } from "@/components/samples/samples-page-content";

/** b-shadow-box-frames-original SamplesPage.tsx — JSON-LD in SamplesPageContent */
export const metadata: Metadata = {
  title: "Order Shadow Box Samples | ShadowboxFrames.com",
  description:
    "Order frame corner samples and mat board swatches to see our artisanal shadow box materials in person before you commit to your project.",
  keywords:
    "picture frame samples, mat board samples, acrylic samples, frame moulding samples, custom framing samples",
  alternates: { canonical: "https://www.shadowboxframes.com/samples" },
};

export default function SamplesPage() {
  return <SamplesPageContent />;
}
