import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Diploma Frames | Custom Diploma & Certificate Framing | CustomFrameSizes.com",
  description: "Custom frames for diplomas and certificates. Coming soon.",
};

export default function DiplomaCertificateFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Diploma Frames"
      description="Custom frames for diplomas and certificates. This page is under construction."
    />
  );
}
