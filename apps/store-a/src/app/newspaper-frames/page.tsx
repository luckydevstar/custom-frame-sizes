import type { Metadata } from "next";
import { Suspense } from "react";
import { NewspaperFramesContent } from "./newspaper-frames-content";

const baseUrl = "https://customframesizes.com";
const pageUrl = `${baseUrl}/newspaper-frames`;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What size frame do I need for a newspaper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Most newspapers are 11" x 22" (tabloid) or 15" x 22.75" (broadsheet). Add 2-3 inches to each side for mat borders. Our designer helps you find the right size.',
      },
    },
    {
      "@type": "Question",
      name: "How deep should a newspaper frame be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use a shadowbox frame with 1-1.5 inches of depth. This keeps your newspaper away from the glass and allows room for archival backing.",
      },
    },
    {
      "@type": "Question",
      name: "Will my newspaper yellow or fade over time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Good framing slows aging. Framer's grade acrylic blocks harmful light. Archival mats and backing help keep paper in better shape longer.",
      },
    },
    {
      "@type": "Question",
      name: "Can I frame two newspapers together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our double layout puts two newspapers side by side in one frame. Great for before-and-after stories or milestone events.",
      },
    },
    {
      "@type": "Question",
      name: "Should newspapers be matted?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Mats add space between the paper and acrylic. They also protect the edges. A 2-3 inch border is standard.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Newspaper Frames | Custom Sizes for Any Clipping | CustomFrameSizes.com",
  description:
    "Frame newspapers in custom sizes. Shadowbox frames protect headlines, birth announcements, and historic front pages. Archival mats, framer's grade acrylic, and professional mounting included.",
  keywords:
    "newspaper frames, custom newspaper framing, shadowbox newspaper frames, frame newspaper clipping, birth announcement frame, historic headline frame, sports championship frame",
  openGraph: {
    title: "Newspaper Frames | Custom Sizes for Any Clipping",
    description:
      "Frame newspapers in custom sizes. Shadowbox frames protect headlines, birth announcements, and historic front pages.",
    type: "website",
    url: pageUrl,
  },
  alternates: { canonical: pageUrl },
};

function NewspaperFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-muted/20">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function NewspaperFramesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Suspense fallback={<NewspaperFallback />}>
        <NewspaperFramesContent />
      </Suspense>
    </>
  );
}
