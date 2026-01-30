import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Newspaper Frames | Custom Newspaper Display | CustomFrameSizes.com",
  description: "Custom frames for newspapers and clippings. Coming soon.",
};

export default function NewspaperFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Newspaper Frames"
      description="Custom frames for newspapers and clippings. This page is under construction."
    />
  );
}
