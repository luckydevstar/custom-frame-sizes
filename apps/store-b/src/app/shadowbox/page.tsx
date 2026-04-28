import type { Metadata } from "next";

import { ShadowboxHubPageContent } from "@/components/shadowbox/shadowbox-hub-page-content";

/** origina-store-b/client/src/pages/Shadowbox.tsx — Seo */
export const metadata: Metadata = {
  title: "Custom Shadow Box Frames | Any Size & Depth",
  description:
    "Design a custom shadow box frame in any size and depth. Choose your moulding, mat, and glazing with real-time pricing.",
  alternates: {
    canonical: "https://www.shadowboxframes.com/shadowbox",
  },
  keywords:
    "custom shadowbox frames, deep shadowbox, shadowbox display, jersey frame, medal display, 3D picture frames, memorabilia frames, shadow box custom size",
};

export default function ShadowboxHubPage() {
  return <ShadowboxHubPageContent />;
}
