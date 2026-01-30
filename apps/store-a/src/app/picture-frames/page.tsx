import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Picture Frames | Custom Sizes | CustomFrameSizes.com",
  description: "Browse custom picture frames in any size. Coming soon.",
};

export default function PictureFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Picture Frames"
      description="Browse our full collection of custom picture frames. This page is under construction."
    />
  );
}
