import type { Metadata } from "next";

import { GuideRoute } from "@/components/guides/guide-route";
import { buildGuideMetadata } from "@/lib/get-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata("gallery-wall-guide");
}

export default function GalleryWallGuidePage() {
  return <GuideRoute slug="gallery-wall-guide" />;
}
