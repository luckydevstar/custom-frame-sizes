import type { Metadata } from "next";

import { LearnPageContent } from "@/components/learn/learn-page-content";

/** b-shadow-box-frames-original LearnPage.tsx — <Seo title description schema /> */
export const metadata: Metadata = {
  title: "Shadow Box Guides & Inspiration",
  description:
    "Guides and resources for shadow box framing: how to choose depth, which items to display, and how to care for your frame.",
};

export default function LearnPage() {
  return <LearnPageContent />;
}
