import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Needlework Frames | Custom Cross-Stitch & Embroidery Display | CustomFrameSizes.com",
  description: "Custom frames for needlework, cross-stitch, and embroidery. Coming soon.",
};

export default function NeedleworkFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Needlework Frames"
      description="Custom frames for needlework, cross-stitch, and embroidery. This page is under construction."
    />
  );
}
