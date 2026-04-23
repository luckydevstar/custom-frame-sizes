import type { Metadata } from "next";

import { HomePageContent } from "./home-page-content";

/** Matches b-shadow-box-frames-original Home.tsx <Seo /> defaults */
export const metadata: Metadata = {
  title: "Handcrafted Shadow Box Frames",
  description:
    "Handcrafted shadow box frames built for what matters most. Design your custom shadowbox with real-time pricing and premium materials.",
  keywords: [
    "custom shadowbox frames",
    "shadowbox frames",
    "shadow box frames",
    "custom display frames",
    "jersey frames",
    "military shadowbox",
    "memorabilia frames",
    "deep frames",
    "mat boards",
  ],
};

export default function Home() {
  return <HomePageContent />;
}
