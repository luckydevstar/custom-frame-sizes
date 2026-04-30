import type { Metadata } from "next";

import { BusinessQuotePageContent } from "@/components/business/business-quote-page-content";

/** b-shadow-box-frames-original /business/quote */
export const metadata: Metadata = {
  title: "Request a Quote - Business Services",
  description:
    "Request a custom quote for your business framing project. Trade pricing and volume discounts available.",
};

export default function BusinessQuotePage() {
  return <BusinessQuotePageContent />;
}
