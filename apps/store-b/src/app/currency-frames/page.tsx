import type { Metadata } from "next";

import { CurrencyFramesPageContent } from "@/components/currency-frames/currency-frames-page-content";
import { currencyFaqSchema, currencyProductSchema } from "@/config/currency-frames-seo-data";

const pageUrl = "https://www.shadowboxframes.com/currency-frames";

/** b-shadow-box-frames-original/client/src/pages/CurrencyFrames.tsx */
export const metadata: Metadata = {
  title: "Currency Display Frames | Custom Shadowbox Frames for Paper Money",
  description:
    "Design custom currency display frames with shadowbox depth for your collection. Frame paper money with archival double matting, framer's grade acrylic, and optional brass nameplates. Available in preset and custom sizes.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Currency Display Frames | Custom Shadowbox Frames for Paper Money",
    description:
      "Professional currency display frames with shadowbox depth, archival matting, and framer's grade acrylic glazing. Designed for paper money displays and currency collections.",
    type: "website",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency Display Frames | Custom Shadowbox Frames for Paper Money",
    description:
      "Shadowbox currency frames—archival double matting and framer's grade acrylic for paper money displays.",
  },
};

export default function CurrencyFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(currencyProductSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(currencyFaqSchema) }} />
      <CurrencyFramesPageContent />
    </>
  );
}
