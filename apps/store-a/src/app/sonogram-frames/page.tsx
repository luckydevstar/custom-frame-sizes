import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Sonogram Frames | Ultrasound Display | CustomFrameSizes.com",
  description: "Custom frames for sonograms and ultrasound prints. Coming soon.",
};

export default function SonogramFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Sonogram Frames"
      description="Custom frames for sonograms and ultrasound prints. This page is under construction."
    />
  );
}
