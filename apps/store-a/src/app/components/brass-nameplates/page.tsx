import { generatePageMetadata } from "@/lib/seo-utils";

import { BrassNameplatesClient } from "./BrassNameplatesClient";

import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata("/components/brass-nameplates", {
  title: "Custom Brass Nameplates - Laser Engraved Plaques | Custom Frame Sizes",
  description:
    "Order custom brass nameplates in any size from 1.5 to 12 inches. Laser-engraved with your text, choice of fonts, and decorative icons. Brass, silver, or black finishes.",
  keywords: [
    "brass nameplate",
    "custom nameplate",
    "engraved plaque",
    "brass plaque",
    "personalized nameplate",
    "laser engraved",
  ],
});

export default function BrassNameplatesPage() {
  return <BrassNameplatesClient />;
}
