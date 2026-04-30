import type { Metadata } from "next";

import { GuideRoute } from "@/components/guides/guide-route";
import { buildGuideMetadata } from "@/lib/get-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata("privacy-policy");
}

export default function PrivacyPolicyPage() {
  return <GuideRoute slug="privacy-policy" />;
}
