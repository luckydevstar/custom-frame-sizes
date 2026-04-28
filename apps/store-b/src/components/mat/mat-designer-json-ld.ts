/**
 * Product + FAQ JSON-LD for /mat-designer.
 * Mirrors origina-store-b/client/src/pages/MatDesigner.tsx script blocks.
 */

export function buildMatDesignerJsonLd(): Record<string, unknown> {
  const priceValidUntil = new Date();
  priceValidUntil.setDate(priceValidUntil.getDate() + 30);
  const priceValidUntilStr = priceValidUntil.toISOString().split("T")[0];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Custom Mat Board - Single Opening Design",
    description:
      "Professional custom mat board cutting service with 50 mat colors, rectangle and oval opening shapes, single or double mat configurations, and V-groove decorative detail. Options for rounded corners and protective backing. Precision 1/8-inch measurements for professional picture framing. Backing boards included, bulk pricing available.",
    brand: {
      "@type": "Brand",
      name: "ShadowboxFrames",
    },
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
      { "@type": "PropertyValue", name: "Opening Shapes", value: "Rectangle, oval" },
      { "@type": "PropertyValue", name: "Precision", value: "1/8 inch increments" },
      { "@type": "PropertyValue", name: "Mat Types", value: "Single or Double Mat" },
      { "@type": "PropertyValue", name: "V-Groove", value: "Available for decorative detail" },
      { "@type": "PropertyValue", name: "Backing Boards", value: "Included with every mat" },
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
          text: "Yes, we offer volume pricing on orders of 10 or more mats. This suits photographers, artists, galleries, and framers who need multiple mats. Bulk orders maintain the same quality and precision cutting while providing better pricing for larger quantities.",
        },
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [productSchema, faqSchema],
  };
}
