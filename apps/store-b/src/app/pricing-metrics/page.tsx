import type { Metadata } from "next";

import { PricingMetricsPageContent } from "@/components/pricing/pricing-metrics-page-content";

/** Internal tool — disallow in robots.txt */
export const metadata: Metadata = {
  title: "Pricing metrics",
  robots: { index: false, follow: false },
};

export default function PricingMetricsPage() {
  return <PricingMetricsPageContent />;
}
