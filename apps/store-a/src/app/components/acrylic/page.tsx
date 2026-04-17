import { generatePageMetadata } from "@/lib/seo-utils";

import { AcrylicClient } from "./AcrylicClient";

import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata("/components/acrylic", {
  title: "Custom-Cut Acrylic Sheets | Professional Glazing | Custom Frame Sizes",
  description:
    "Custom-cut acrylic glazing sheets in regular and non-glare finishes. Popular sizes like 11x14, 8x10, 24x36, 16x20, and 18x24. Professional quality with bulk pricing for frame shops and DIY professionals.",
});

export default function AcrylicPage() {
  return <AcrylicClient />;
}
