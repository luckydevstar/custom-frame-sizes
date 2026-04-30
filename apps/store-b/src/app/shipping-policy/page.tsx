import type { Metadata } from "next";

import { GuideRoute } from "@/components/guides/guide-route";
import { buildGuideMetadata } from "@/lib/get-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata("shipping-policy");
}

export default function ShippingPolicyPage() {
  return <GuideRoute slug="shipping-policy" />;
}
