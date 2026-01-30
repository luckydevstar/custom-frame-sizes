import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Military Frames | Shadowbox Display | CustomFrameSizes.com",
  description: "Custom shadowbox frames for military memorabilia and medals. Coming soon.",
};

export default function MilitaryFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Military Frames"
      description="Custom shadowbox frames for military memorabilia and medals. This page is under construction."
    />
  );
}
