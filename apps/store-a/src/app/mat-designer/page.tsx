import type { Metadata } from "next";
import { Suspense } from "react";
import { MatDesignerClient } from "./MatDesignerClient";
import { brandConfig } from "../../brand.config";

const baseUrl = brandConfig.seo?.canonicalUrl ?? "https://customframesizes.com";

const priceValidUntil = new Date();
priceValidUntil.setDate(priceValidUntil.getDate() + 30);
const priceValidUntilStr = priceValidUntil.toISOString().split("T")[0];

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Mat Board - Single Opening Design",
  description:
    "Professional custom mat board cutting service with 46 mat colors, opening shapes including rectangle, oval, circle, arch, heart, star, diamond, and hexagon, single or double mat configurations, and V-groove decorative detail. Precision 1/8-inch measurements for professional picture framing. Backing boards included, bulk pricing available.",
  brand: { "@type": "Brand", name: brandConfig.name },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: 3.46,
    highPrice: 85.87,
    priceValidUntil: priceValidUntilStr,
    offerCount: 92,
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "287",
  },
  material: "Professional mat board",
  additionalProperty: [
    { "@type": "PropertyValue", name: "Color Options", value: "46" },
    {
      "@type": "PropertyValue",
      name: "Opening Shapes",
      value: "Rectangle, oval, circle, arch, heart, star, diamond, hexagon",
    },
    {
      "@type": "PropertyValue",
      name: "Precision",
      value: "1/8 inch increments",
    },
    {
      "@type": "PropertyValue",
      name: "Mat Types",
      value: "Single or Double Mat",
    },
    {
      "@type": "PropertyValue",
      name: "V-Groove",
      value: "Available for decorative detail",
    },
    {
      "@type": "PropertyValue",
      name: "Backing Boards",
      value: "Included with every mat",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a double mat in picture framing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A double mat combines two mat board layers. The bottom mat shows as a thin reveal border (typically 1/8 to 1/4 inch) around the opening. This creates depth and visual interest while protecting your artwork with extra spacing between the art and glass. Double mats are standard in professional framing.",
      },
    },
    {
      "@type": "Question",
      name: "What is V-groove mat board cutting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "V-groove is a decorative mat cutting technique that creates an elegant, precise groove in the mat surface. The groove appears as a subtle channel outside the mat opening, adding visual interest and a professional gallery look without requiring a double mat. V-groove creates dimension and draws the eye to your artwork.",
      },
    },
    {
      "@type": "Question",
      name: "Do custom mats come with backing boards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, every custom mat includes a backing board at no extra charge. Backing boards provide structural support behind your artwork and help keep everything flat and secure in the frame. We also offer clear self-seal bags (mat show kits) for protecting and presenting your mats professionally.",
      },
    },
    {
      "@type": "Question",
      name: "Is bulk pricing available for custom mat orders?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer volume pricing on orders of 10 or more mats. This is perfect for photographers, artists, galleries, and framers who need multiple mats. Bulk orders maintain the same quality and precision cutting while providing better pricing for larger quantities.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
    {
      "@type": "ListItem",
      position: 2,
      name: "Mat Designer",
      item: `${baseUrl}/mat-designer`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Custom Mat Board Designer - Single Opening Design in Any Size | Custom Frame Sizes",
  description:
    "Design custom picture mats with our professional mat cutting tool. Create single or double mats with V-groove decorative detail, 46 mat colors, and various opening shapes. Precision 1/8-inch measurements, backing boards included, bulk pricing available. Perfect for professional framers, photographers, and artists.",
  keywords:
    "custom mat board, picture mat cutting, double mat, oval mat, v-groove mat, museum mat, photo mat, custom matting, mat board cutter, professional picture matting, backing boards, bulk mat pricing",
  openGraph: {
    title: "Custom Mat Board Designer - Single Opening Design | Custom Frame Sizes",
    description:
      "Professional mat board designer with 46 mat colors, V-groove decorative detail, single/double mat options. Backing boards included, bulk pricing available. Precision cutting to 1/8-inch for professional framing.",
    type: "website",
    url: `${baseUrl}/mat-designer`,
  },
  alternates: { canonical: `${baseUrl}/mat-designer` },
};

export default function MatDesignerPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={null}>
        <MatDesignerClient />
      </Suspense>
    </>
  );
}
