import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Hockey Puck Frame Designer | Custom Puck Display | CustomFrameSizes.com",
  description: "Custom frames for hockey pucks and sports memorabilia. Coming soon.",
};

export default function HockeyPuckFrameDesignerPage() {
  return (
    <ComingSoonPlaceholder
      title="Hockey Puck Frame Designer"
      description="Custom frames for hockey pucks and sports memorabilia. This page is under construction."
    />
  );
}
