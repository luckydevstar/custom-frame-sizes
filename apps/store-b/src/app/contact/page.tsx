import type { Metadata } from "next";

import { ContactPageContent } from "@/components/contact/contact-page-content";

/** origina-store-b/client/src/pages/ContactPage.tsx — <Seo title description schema /> */
export const metadata: Metadata = {
  title: "Contact Us | Get in Touch",
  description:
    "Reach our shadow box framing team by phone, email, or contact form. We respond within one business day.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
