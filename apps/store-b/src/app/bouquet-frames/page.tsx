import type { Metadata } from "next";

import { BouquetFramesPageContent } from "@/components/bouquet/bouquet-frames-page-content";

/** origina-store-b/client/src/pages/BouquetFrames.tsx — Helmet + canonical */
export const metadata: Metadata = {
  title: "Preserved Bouquet Frames | Wedding Bouquet Framing | ShadowboxFrames",
  description:
    "Frame your wedding bouquet with premium bouquet frames. Deep frames for preserved flowers with custom sizing and framer's grade acrylic. Professional-grade preservation.",
  keywords: [
    "preserved bouquet frames",
    "wedding bouquet shadowbox",
    "bridal flower preservation",
    "dried bouquet framing",
    "3D flower frames",
    "wedding flower display",
  ],
  alternates: {
    canonical: "https://www.shadowboxframes.com/bouquet-frames",
  },
  openGraph: {
    title: "Preserved Bouquet Frames | Wedding Bouquet Framing | ShadowboxFrames",
    description:
      "Deep bouquet frames for preserved wedding bouquets. Custom sizing, framer's grade acrylic glazing, professional-grade preservation.",
    type: "website",
    url: "https://www.shadowboxframes.com/bouquet-frames",
  },
};

export default function BouquetFramesPage() {
  return <BouquetFramesPageContent />;
}
