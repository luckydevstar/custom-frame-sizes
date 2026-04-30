import type { Metadata } from "next";

import { NewspaperFramesPageContent } from "@/components/newspaper-frames/newspaper-frames-page-content";

const pageUrl = "https://www.shadowboxframes.com/newspaper-frames";

const faqItems = [
  {
    question: "What size frame do I need for a newspaper?",
    answer:
      'Most newspapers are 11" x 22" (tabloid) or 15" x 22.75" (broadsheet). Add 2-3 inches to each side for mat borders. Our designer helps you find the right size.',
  },
  {
    question: "How deep should a newspaper frame be?",
    answer:
      "Use a shadowbox frame with 1-1.5 inches of depth. This keeps your newspaper away from the glass and allows room for archival backing.",
  },
  {
    question: "Will my newspaper yellow or fade over time?",
    answer:
      "Good framing slows aging. Framer's grade acrylic blocks harmful light. Archival mats and backing help keep paper in better shape longer.",
  },
  {
    question: "Can I frame two newspapers together?",
    answer:
      "Yes. Our double layout puts two newspapers side by side in one frame. Great for before-and-after stories or milestone events.",
  },
  {
    question: "Should newspapers be matted?",
    answer:
      "Yes. Mats add space between the paper and acrylic. They also protect the edges. A 2-3 inch border is standard.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

/** b-shadow-box-frames-original/client/src/pages/specialty/NewspaperFrames.tsx — Seo */
export const metadata: Metadata = {
  title: "Newspaper Frames | Custom Sizes for Any Clipping",
  description:
    "Frame newspapers in custom sizes. Shadowbox frames protect headlines, birth announcements, and historic front pages. Archival mats, framer's grade acrylic, and professional mounting included.",
  keywords: [
    "newspaper frames",
    "custom newspaper framing",
    "shadowbox newspaper frames",
    "frame newspaper clipping",
    "birth announcement frame",
    "historic headline frame",
    "sports championship frame",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Newspaper Frames | Custom Sizes for Any Clipping",
    description:
      "Shadowbox frames for newspapers—archival mats, framer's grade acrylic, custom sizes.",
    type: "website",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Newspaper Frames | Custom Sizes for Any Clipping",
    description:
      "Frame newspaper clippings with shadowbox depth, archival materials, and custom sizing.",
  },
};

export default function NewspaperFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <NewspaperFramesPageContent />
    </>
  );
}
