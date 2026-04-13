import type { Metadata } from "next";

import { generatePageMetadata } from "@/lib/seo-utils";

import { BusinessContent } from "./BusinessContent";

export const metadata: Metadata = generatePageMetadata("/business", {
  title: "Business & Wholesale Custom Framing Solutions | Custom Frame Sizes",
  description:
    "Scalable custom framing for businesses. Exact sizes, consistent results, bulk orders, reorders, and time-sensitive programs. Volume pricing available.",
});

export default function BusinessPage() {
  return <BusinessContent />;
}
