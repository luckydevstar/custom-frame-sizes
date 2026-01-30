import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Magazine Frames | Custom Magazine Display | CustomFrameSizes.com",
  description: "Custom frames for magazines and periodicals. Coming soon.",
};

export default function MagazineFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Magazine Frames"
      description="Custom frames for magazines and periodicals. This page is under construction."
    />
  );
}
