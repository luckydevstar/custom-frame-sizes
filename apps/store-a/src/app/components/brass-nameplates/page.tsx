import type { Metadata } from "next";
import { BrassNameplatesClient } from "./BrassNameplatesClient";

export const metadata: Metadata = {
  title: "Custom Brass Nameplates - Laser Engraved Plaques | Custom Frame Sizes",
  description:
    "Order custom brass nameplates in any size from 1.5 to 12 inches. Laser-engraved with your text, choice of fonts, and decorative icons. Brass, silver, or black finishes.",
  keywords:
    "brass nameplate, custom nameplate, engraved plaque, brass plaque, personalized nameplate, laser engraved",
  openGraph: {
    title: "Custom Brass Nameplates - Laser Engraved Plaques",
    description:
      "Order custom brass nameplates in any size from 1.5 to 12 inches. Laser-engraved with your text and decorative icons.",
    type: "website",
    url: "https://customframesizes.com/components/brass-nameplates",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Brass Nameplates - Laser Engraved Plaques",
    description: "Order custom brass nameplates in any size from 1.5 to 12 inches.",
  },
};

export default function BrassNameplatesPage() {
  return <BrassNameplatesClient />;
}
