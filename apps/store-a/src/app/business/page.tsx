import type { Metadata } from "next";
import { BusinessContent } from "./BusinessContent";

export const metadata: Metadata = {
  title: "Business & Wholesale Custom Framing Solutions | Custom Frame Sizes",
  description:
    "Scalable custom framing for businesses. Exact sizes, consistent results, bulk orders, reorders, and time-sensitive programs. Volume pricing available.",
  openGraph: {
    title: "Business & Wholesale Custom Framing Solutions | Custom Frame Sizes",
    description:
      "Scalable custom framing for businesses. Exact sizes, consistent results, bulk orders, and volume pricing.",
    type: "website",
  },
};

export default function BusinessPage() {
  return <BusinessContent />;
}
