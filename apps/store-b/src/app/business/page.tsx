import type { Metadata } from "next";

import { BusinessPageContent } from "@/components/business/business-page-content";

/** b-shadow-box-frames-original Business index — FAQ JSON-LD in client component */
export const metadata: Metadata = {
  title: "Shadow Box Programs for Teams, Traditions, and Milestones",
  description:
    "Wholesale shadow box framing for businesses. Consistent quality, volume pricing, and fast reorders for corporate, military, and event programs.",
};

export default function BusinessPage() {
  return <BusinessPageContent />;
}
