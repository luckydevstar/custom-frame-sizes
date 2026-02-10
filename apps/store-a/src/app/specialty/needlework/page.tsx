import type { Metadata } from "next";
import { Suspense } from "react";
import { NeedleworkFramesContent } from "./needlework-frames-content";

const baseUrl = "https://customframesizes.com";
const pageUrl = `${baseUrl}/specialty/needlework`;

export const metadata: Metadata = {
  title: "Custom Needlework Frames | Cross Stitch & Embroidery Display | CustomFrameSizes.com",
  description:
    "Custom frames for needlework, cross stitch, and embroidery. Professional framing with framer's grade acrylic and archival materials. Handmade frames built to your exact size.",
  keywords:
    "needlework frames, cross stitch frames, embroidery frames, needlepoint frames, textile framing, fabric art frames, cross stitch display, embroidery display, needlework preservation, custom textile frames",
  openGraph: {
    title: "Custom Needlework Frames | Cross Stitch & Embroidery Display | Custom Frame Sizes",
    description:
      "Custom frames for cross stitch, embroidery, and needlepoint. Professional-grade framing with archival materials and handmade craftsmanship.",
    type: "website",
    url: pageUrl,
  },
  alternates: { canonical: pageUrl },
};

const productSchema = {
  "@context": "https://schema.org/",
  "@type": "Product",
  name: "Custom Needlework Frames",
  description:
    "Custom framing for needlework, cross stitch, embroidery, and needlepoint. Professional-grade framing with framer's grade acrylic and archival materials. Handmade frames to preserve your textile art.",
  sku: "NEEDLEWORK-FRAME",
  mpn: "NWF-001",
  url: pageUrl,
  category: "Textile Art Frames",
  brand: { "@type": "Brand", name: "Custom Frame Sizes" },
  offers: {
    "@type": "AggregateOffer",
    url: pageUrl,
    priceCurrency: "USD",
    lowPrice: "69.00",
    highPrice: "249.00",
    priceValidUntil: "2025-12-31",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@type": "Organization", name: "Custom Frame Sizes" },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "247",
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
      name: "What sizes work best for cross stitch and embroidery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'We offer popular preset sizes including 8×8", 8×10", 11×14", 12×12", 16×20", and 18×24" that fit most cross stitch and embroidery patterns. You can also enter custom sizes for unique pieces.',
      },
    },
    {
      "@type": "Question",
      "@id": `${pageUrl}#faq-acrylic`,
      name: "What type of glazing protects needlework?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We use framer's grade acrylic glazing. This helps protect thread colors and fabric from light damage. It's lighter and safer than glass, which is important for larger textile pieces.",
      },
    },
    {
      "@type": "Question",
      "@id": `${pageUrl}#faq-archival`,
      name: "Why use archival materials for needlework framing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Archival matting and backing keep fabric from yellowing over time. These materials don't contain acids that can harm textiles. Your needlework stays looking fresh for years.",
      },
    },
  ],
};

export default function NeedleworkFramesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center bg-muted/20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <NeedleworkFramesContent />
      </Suspense>
    </>
  );
}
