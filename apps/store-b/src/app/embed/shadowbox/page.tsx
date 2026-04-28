import type { Metadata } from "next";

import { ShadowboxEmbedPageContent } from "@/components/shadowbox/shadowbox-embed-page-content";

/** origina-store-b/client/src/pages/ShadowboxEmbed.tsx — Seo noindex */
export const metadata: Metadata = {
  title: "Shadowbox Designer (embed)",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbedShadowboxPage() {
  return <ShadowboxEmbedPageContent />;
}
