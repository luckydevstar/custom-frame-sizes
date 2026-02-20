import type { Metadata } from "next";
import { AcrylicClient } from "./AcrylicClient";

export const metadata: Metadata = {
  title: "Custom-Cut Acrylic Sheets | Professional Glazing | Custom Frame Sizes",
  description:
    "Custom-cut acrylic glazing sheets in regular and non-glare finishes. Popular sizes like 11x14, 8x10, 24x36, 16x20, and 18x24. Professional quality with bulk pricing for frame shops and DIY professionals.",
};

export default function AcrylicPage() {
  return <AcrylicClient />;
}
