import type { Metadata } from "next";

import { MagazineSizesGuidePageContent } from "@/components/magazine-sizes-guide/magazine-sizes-guide-page-content";

const pageUrl = "https://www.shadowboxframes.com/magazine-sizes-guide";

/** b-shadow-box-frames-original/client/src/pages/MagazineSizesGuide.tsx */
export const metadata: Metadata = {
  title: "Magazine Frame Sizes Guide - Dimensions for TIME, Vogue, National Geographic & More | ShadowboxFrames",
  description:
    "Complete guide to magazine frame sizes. Find the right size for TIME (8×10.5″), Vogue (8.75×11″), National Geographic (7×10″), Life Magazine (10.5×14″), and 30+ popular magazines. Free custom framing guide.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Magazine Frame Sizes Guide - Sizes for Popular Magazines",
    description:
      "Find the right frame size for your magazine collection. Includes TIME, Vogue, Rolling Stone, National Geographic, and more.",
    type: "website",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Magazine Frame Sizes Guide - Sizes for Popular Magazines",
    description:
      "Dimensions for TIME, Vogue, Rolling Stone, National Geographic, Life Magazine, and more.",
  },
};

export default function MagazineSizesGuidePage() {
  return <MagazineSizesGuidePageContent />;
}
