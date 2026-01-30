import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Signature Frames | Autograph Display | CustomFrameSizes.com",
  description: "Custom frames for signed memorabilia and autographs. Coming soon.",
};

export default function SignatureFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Signature Frames"
      description="Custom frames for signed memorabilia and autographs. This page is under construction."
    />
  );
}
