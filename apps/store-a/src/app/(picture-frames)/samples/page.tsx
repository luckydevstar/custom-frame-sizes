import type { Metadata } from "next";
import { SamplesClient } from "./SamplesClient";

export const metadata: Metadata = {
  title: "Order Frame, Mat & Acrylic Samples | Free Shipping | Custom Frame Sizes",
  description:
    "Order samples before you buy. Get 4-inch frame moulding pieces ($5) and 2x2-inch mat board or acrylic samples ($3). Free shipping on all sample orders. See colors, textures, and finishes in person.",
  keywords:
    "picture frame samples, mat board samples, acrylic samples, frame moulding samples, custom framing samples, free shipping samples",
  openGraph: {
    title: "Order Frame & Mat Samples | Free Shipping | Custom Frame Sizes",
    description:
      "Try before you buy. Order samples of our custom picture frames, mat boards, and acrylic glazing. Free shipping on all sample orders.",
    type: "website",
    url: "https://www.customframesizes.com/samples",
  },
};

export default function SamplesPage() {
  return <SamplesClient />;
}
