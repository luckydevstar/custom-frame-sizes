import type { Metadata } from "next";

import { SpecialtyFramesPageContent } from "@/components/specialty/specialty-frames-page-content";

const pageUrl = "https://www.shadowboxframes.com/specialty-frames";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I frame something not on this list?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our main Picture Frame Designer handles any size artwork or photo. Specialty designers just make it faster for common items.",
      },
    },
    {
      "@type": "Question",
      name: "Do specialty frames cost more?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Pricing is based on frame size and materials, not the designer you use. A 24×36 frame costs the same whether you order from the poster or picture frame designer.",
      },
    },
    {
      "@type": "Question",
      name: "How do I know which designer to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose the one that matches your item. Jersey? Use the Jersey designer. Comic book? Use the Comic designer. Each one has the right options pre-selected.",
      },
    },
    {
      "@type": "Question",
      name: "What materials do specialty frames use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All specialty frames use archival matting, framer's grade acrylic, and professional-grade backing to protect your items from fading and damage.",
      },
    },
  ],
};

/** original-store-b SpecialtyFrames Seo + Helmet parity */
export const metadata: Metadata = {
  title: "25+ Specialty Frame Designers | ShadowboxFrames",
  description:
    "Design custom frames for jerseys, diplomas, vinyl records, comic books, onesheet movie posters, military medals, Playbills, stamps, currency, graded cards, puzzles, ticket stubs, preserved bouquets, and more. Professional-grade frames with archival materials.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "25+ Specialty Frame Designers | ShadowboxFrames",
    description:
      "Design custom frames for jerseys, diplomas, vinyl records, comic books, onesheet movie posters, military medals, Playbills, and more. Professional-grade frames with archival materials.",
    type: "website",
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "25+ Specialty Frame Designers | ShadowboxFrames",
    description:
      "Design custom frames for jerseys, diplomas, vinyl records, comic books, onesheet movie posters, military medals, Playbills, and more.",
  },
};

export default function SpecialtyFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <SpecialtyFramesPageContent />
    </>
  );
}
