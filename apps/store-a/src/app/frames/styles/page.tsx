import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Browse Frames by Style | CustomFrameSizes.com",
  description: "Find picture frames by style. Coming soon.",
};

export default function FramesStylesPage() {
  return (
    <ComingSoonPlaceholder
      title="Browse by Style"
      description="Find frames by style and finish. This page is under construction."
    />
  );
}
