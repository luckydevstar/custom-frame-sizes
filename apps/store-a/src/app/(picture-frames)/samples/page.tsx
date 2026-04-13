import type { Metadata } from "next";

import { generatePageMetadata } from "@/lib/seo-utils";
import { SamplesClient } from "./SamplesClient";

export const metadata: Metadata = generatePageMetadata("/samples", {
  title: "Order Frame, Mat & Acrylic Samples | Free Shipping | Custom Frame Sizes",
  description:
    "Order samples before you buy. Get 4-inch frame moulding pieces ($5) and 2x2-inch mat board or acrylic samples ($3). Free shipping on all sample orders. See colors, textures, and finishes in person.",
  keywords: [
    "picture frame samples",
    "mat board samples",
    "acrylic samples",
    "frame moulding samples",
    "custom framing samples",
    "free shipping samples",
  ],
});

export default function SamplesPage() {
  return <SamplesClient />;
}
