import type { Metadata } from "next";

import { GuideRoute } from "@/components/guides/guide-route";
import { buildGuideMetadata } from "@/lib/get-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata("care-instructions");
}

export default function CareInstructionsGuidePage() {
  return <GuideRoute slug="care-instructions" />;
}
