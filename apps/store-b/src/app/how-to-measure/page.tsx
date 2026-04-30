import type { Metadata } from "next";

import { GuideRoute } from "@/components/guides/guide-route";
import { buildGuideMetadata } from "@/lib/get-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata("how-to-measure");
}

export default function HowToMeasureGuidePage() {
  return <GuideRoute slug="how-to-measure" />;
}
