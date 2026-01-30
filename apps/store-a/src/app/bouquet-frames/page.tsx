import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Bouquet Frames | Preserved Flower Shadowbox | CustomFrameSizes.com",
  description: "Custom shadowbox frames for preserved bouquets and wedding flowers. Coming soon.",
};

export default function BouquetFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Bouquet Frames"
      description="Custom shadowbox frames for preserved bouquets and wedding flowers. This page is under construction."
    />
  );
}
