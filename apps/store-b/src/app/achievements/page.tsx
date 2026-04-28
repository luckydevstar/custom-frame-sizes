import type { Metadata } from "next";

import { AchievementsPageContent } from "@/components/achievements/achievements-page-content";

/** origina-store-b/client/src/pages/Achievements.tsx — Seo noindex */
export const metadata: Metadata = {
  title: "Achievements",
  description: "Track your custom framing design achievements and milestones.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function AchievementsPage() {
  return <AchievementsPageContent />;
}
