import type { Metadata } from "next";

import { CdFramesPageContent } from "@/components/cd-frames/cd-frames-page-content";

const pageUrl = "https://www.shadowboxframes.com/cd-frames";
const ogImage = "https://www.shadowboxframes.com/cd/lifestyle/cd-frame-lifestyle-1.jpg";

const productSchema = {
  "@context": "https://schema.org/",
  "@type": "Product",
  name: "Custom CD Frames",
  description:
    "Professional custom framing for CDs, jewel cases, and album artwork. Professional custom framing featuring solid pine wood frames, framer's grade acrylic glazing, acid-free backing and matting, secure mounting system for CD display, and precision-cut matting. Five specialized layout configurations for CD and case display.",
  image: [
    "https://www.shadowboxframes.com/cd/lifestyle/cd-frame-lifestyle-1.jpg",
    "https://www.shadowboxframes.com/cd/lifestyle/cd-frame-lifestyle-2.jpg",
    "https://www.shadowboxframes.com/cd/lifestyle/cd-frame-lifestyle-3.jpg",
    "https://www.shadowboxframes.com/cd/lifestyle/cd-frame-lifestyle-4.jpg",
  ],
  sku: "CD-FRAME",
  mpn: "CDF-001",
  url: pageUrl,
  category: "Music Memorabilia Frames",
  brand: { "@type": "Brand", name: "ShadowboxFrames" },
  offers: {
    "@type": "AggregateOffer",
    url: pageUrl,
    priceCurrency: "USD",
    lowPrice: "89.00",
    highPrice: "289.00",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@type": "Organization", name: "ShadowboxFrames" },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "312",
    bestRating: "5",
    worstRating: "1",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${pageUrl}#faq`,
  mainEntity: [
    {
      "@type": "Question",
      "@id": `${pageUrl}#faq-sizes`,
      name: "What sizes do CD frames accommodate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our CD frames are designed for standard CD jewel cases (4.75 inches square) and CD discs (4.75 inch diameter). The frames provide proper depth clearance for jewel cases while maintaining professional framing standards.",
      },
    },
    {
      "@type": "Question",
      "@id": `${pageUrl}#faq-mounting`,
      name: "How are CDs mounted in the frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CDs and cases are secured using preservation-safe mounting methods that eliminate the need for tape or adhesives. This preservation-safe approach allows for completely reversible mounting following conservation standards.",
      },
    },
    {
      "@type": "Question",
      "@id": `${pageUrl}#faq-materials`,
      name: "What materials are included in CD frames?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each frame includes solid furniture-grade pine wood construction, crystal-clear framer's grade acrylic glazing, acid-free backing board, precision-cut top matting, and wall hanging hardware. All materials meet professional framing standards.",
      },
    },
    {
      "@type": "Question",
      "@id": `${pageUrl}#faq-layouts`,
      name: "What layout options are available for CD frames?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer 5 professional layouts including single CD displays, multiple CD configurations, and options to showcase both the disc and case artwork together. Designed for music collections, limited editions, and special releases.",
      },
    },
  ],
};

/** origina-store-b/client/src/pages/specialty/CDFrames.tsx — Seo + schema parity */
export const metadata: Metadata = {
  title: "Custom CD Frames | CD Album Display | Professional Framing",
  description:
    "Premium custom CD frames featuring 5 professional layouts for CD album display. Custom frame shop quality with framer's grade acrylic, acid-free matting, solid pine construction, and secure mounting system. Frame CD cases, jewel cases, and disc artwork with professional-grade materials.",
  keywords: [
    "CD frames",
    "CD album frames",
    "jewel case frames",
    "CD display frames",
    "music memorabilia framing",
    "CD collection display",
    "CD framing",
    "custom CD frames",
    "album art frames",
    "CD case frames",
    "music room decor",
    "CD wall display",
    "disc frames",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Custom CD Frames | CD Album Display | Professional Framing",
    description:
      "Premium custom CD frames with 5 professional layouts. Framer's grade acrylic, acid-free matting, solid pine construction.",
    type: "website",
    url: pageUrl,
    images: [{ url: ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom CD Frames | CD Album Display",
    description: "Frame CD jewel cases and album artwork with professional-grade materials.",
    images: [ogImage],
  },
};

export default function CdFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CdFramesPageContent />
    </>
  );
}
