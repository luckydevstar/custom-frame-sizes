import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Stamp Frames | Philately Display | CustomFrameSizes.com",
  description: "Custom frames for stamp collections and philately. Coming soon.",
};

export default function StampFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Stamp Frames"
      description="Custom frames for stamp collections and philately. This page is under construction."
    />
  );
}
