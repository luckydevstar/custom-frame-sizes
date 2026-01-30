import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "CD Frames | Custom CD Display Frames | CustomFrameSizes.com",
  description: "Custom frames for CD displays. Coming soon.",
};

export default function CdFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="CD Frames"
      description="Custom frames for displaying CDs and album art. This page is under construction."
    />
  );
}
