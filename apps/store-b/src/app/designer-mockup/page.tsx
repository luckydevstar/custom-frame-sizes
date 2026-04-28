import type { Metadata } from "next";

import { DesignerMockupPageContent } from "@/components/designer/designer-mockup-page-content";

/** Internal mockup — no legacy Helmet; keep out of search */
export const metadata: Metadata = {
  title: "Frame Designer Mockup",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignerMockupPage() {
  return <DesignerMockupPageContent />;
}
