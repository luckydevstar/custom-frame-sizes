import type { Metadata } from "next";

import { GuideRoute } from "@/components/guides/guide-route";
import { buildGuideMetadata } from "@/lib/get-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata("glazing-guide");
}

export default function GlazingGuidePage() {
  return <GuideRoute slug="glazing-guide" />;
}
