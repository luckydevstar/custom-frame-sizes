import type { Metadata } from "next";

import { ShadowboxHubPageContent } from "@/components/shadowbox/shadowbox-hub-page-content";

/**
 * Legacy App.tsx maps `/shadowbox/designer` to the same `Shadowbox` page component as `/shadowbox`.
 * Canonical remains `/shadowbox` (origina-store-b Shadowbox.tsx Seo).
 */
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

export default function ShadowboxDesignerAliasPage() {
  return <ShadowboxHubPageContent />;
}
