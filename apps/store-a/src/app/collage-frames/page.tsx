import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Photo Collage Frames | Multi-Photo Display | CustomFrameSizes.com",
  description: "Custom frames for photo collages and multi-opening displays. Coming soon.",
};

export default function CollageFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Photo Collage Frames"
      description="Custom frames for photo collages and multi-opening displays. This page is under construction."
    />
  );
}
