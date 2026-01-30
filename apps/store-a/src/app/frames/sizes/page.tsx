import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Browse Frames by Size | CustomFrameSizes.com",
  description: "Find picture frames by size. Coming soon.",
};

export default function FramesSizesPage() {
  return (
    <ComingSoonPlaceholder
      title="Browse by Size"
      description="Find frames by your artwork size. This page is under construction."
    />
  );
}
