import type { Metadata } from "next";

import { AboutPageContent } from "@/components/about/about-page-content";

/** origina-store-b/client/src/pages/AboutPage.tsx — <Seo title description schema /> */
export const metadata: Metadata = {
  title: "About Us | Precision Custom Framing",
  description:
    "Meet the workshop behind ShadowboxFrames.com. We build custom shadow box frames by hand in our US facility, one order at a time.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
