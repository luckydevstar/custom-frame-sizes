import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Currency Frames | Bill & Coin Display | CustomFrameSizes.com",
  description: "Custom frames for currency and collectible bills. Coming soon.",
};

export default function CurrencyFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Currency Frames"
      description="Custom frames for currency and collectible bills. This page is under construction."
    />
  );
}
