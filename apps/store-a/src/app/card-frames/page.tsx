import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Graded Card Frames | Sports & Trading Card Display | CustomFrameSizes.com",
  description: "Custom frames for graded sports and trading cards. Coming soon.",
};

export default function CardFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Graded Card Frames"
      description="Custom frames for graded sports and trading cards. This page is under construction."
    />
  );
}
