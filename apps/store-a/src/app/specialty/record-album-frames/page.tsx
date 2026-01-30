import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Record Album Frames | Vinyl Record Display | CustomFrameSizes.com",
  description: "Custom frames for vinyl records and album art. Coming soon.",
};

export default function RecordAlbumFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Record Album Frames"
      description="Custom frames for vinyl records and album art. This page is under construction."
    />
  );
}
