import type { Metadata } from "next";

import { GuideRoute } from "@/components/guides/guide-route";
import { buildGuideMetadata } from "@/lib/get-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata("returns-exchanges");
}

export default function ReturnsExchangesPage() {
  return <GuideRoute slug="returns-exchanges" />;
}
