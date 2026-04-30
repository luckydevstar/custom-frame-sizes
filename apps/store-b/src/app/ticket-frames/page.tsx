import type { Metadata } from "next";

import { TicketFramesPageContent } from "@/components/ticket-frames/ticket-frames-page-content";

const pageUrl = "https://www.shadowboxframes.com/ticket-frames";
const ogImage = "https://www.shadowboxframes.com/assets/ticket-frames-og.jpg";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Custom Ticket Stub Framing",
  provider: {
    "@type": "Organization",
    name: "ShadowboxFrames",
  },
  areaServed: "US",
  description:
    "Custom framing for concert tickets, sports stubs, and event memorabilia with multi-opening layouts and archival materials",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What size tickets do these frames fit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Our frames are sized for standard 2" x 5" tickets. This fits most concert tickets, sports stubs, and event passes. All openings are precision-cut for a clean look.',
      },
    },
    {
      "@type": "Question",
      name: "How many tickets can I frame together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our frames hold 1 to 6 tickets. Pick from 6 layouts: single ticket, pairs, trios, or grids up to 6 tickets. Some layouts pair tickets with photos or posters.",
      },
    },
    {
      "@type": "Question",
      name: "Can I include concert posters with my tickets?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Yes! Our combo layouts pair posters with ticket stubs in one frame. The Concert Poster + Tickets layout fits an 18×24" poster with four tickets below. The Mini Poster + Tickets layout fits an 11×17" poster with two tickets.',
      },
    },
    {
      "@type": "Question",
      name: "What materials protect tickets from fading?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We use framer's grade acrylic that blocks harmful light to stop fading. Archival mat boards prevent yellowing. Corner pocket mounting holds tickets safely without adhesives touching the print.",
      },
    },
  ],
};

/** origina-store-b TicketFrames.tsx Helmet + JSON-LD */
export const metadata: Metadata = {
  title: "Ticket Frames | Concert & Event Memorabilia Display | ShadowboxFrames",
  description:
    'Frame your 2" x 5" concert tickets, sports stubs, and event passes. Choose from 6 multi-opening layouts. Framer\'s grade acrylic and archival mats protect your memories.',
  keywords: [
    "ticket frames",
    "concert ticket frame",
    "sports ticket display",
    "event memorabilia frame",
    "ticket stub frame",
    "festival ticket frame",
    "multi-opening ticket frame",
    "concert collection display",
    "ticket preservation",
    "custom ticket frame",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Ticket Frames | Concert & Event Memorabilia Display",
    description:
      'Frame your 2" x 5" concert tickets, sports stubs, and event passes. Choose from 6 multi-opening layouts.',
    type: "website",
    url: pageUrl,
    images: [{ url: ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ticket Frames | Concert & Event Memorabilia Display",
    description:
      'Frame your 2" x 5" concert tickets, sports stubs, and event passes. Choose from 6 multi-opening layouts.',
    images: [ogImage],
  },
};

export default function TicketFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <TicketFramesPageContent />
    </>
  );
}
