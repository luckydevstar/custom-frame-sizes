import type { Metadata } from "next";

import { GuideRoute } from "@/components/guides/guide-route";
import { buildGuideMetadata } from "@/lib/get-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata("mat-board-guide");
}

export default function MatBoardGuidePage() {
  return <GuideRoute slug="mat-board-guide" />;
}
