/** origina-store-b/client/src/pages/MilitaryFrames.tsx — Helmet JSON-LD blocks */

export const militaryProductJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Military Shadowbox Frames",
  description:
    "Professional shadowbox frames for military memorabilia with branch-specific color schemes (Army, Navy, Air Force, Marine Corps, Coast Guard, Space Force), premium suede backing, 2-inch usable depth, and archival mounting. Designed for medals, ribbons, patches, flags, and photos.",
  category: "Military Memorabilia Framing",
  sku: "MILITARY-FRAME-CUSTOM",
  brand: {
    "@type": "Brand",
    name: "ShadowboxFrames",
  },
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    lowPrice: "129",
    highPrice: "299",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "129",
      maxPrice: "299",
      priceCurrency: "USD",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "312",
    bestRating: "5",
    worstRating: "1",
  },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Frame Depth", value: "2 inches usable depth" },
    { "@type": "PropertyValue", name: "Backing Material", value: "Premium suede in branch colors" },
    { "@type": "PropertyValue", name: "Mat Configuration", value: "Triple mat system with branch-specific colors" },
    {
      "@type": "PropertyValue",
      name: "Military Branches",
      value: "Army, Navy, Air Force, Marine Corps, Coast Guard, Space Force",
    },
    { "@type": "PropertyValue", name: "Available Sizes", value: "11×14, 16×20, 20×32 inches" },
    { "@type": "PropertyValue", name: "Production Time", value: "7-10 business days" },
    { "@type": "PropertyValue", name: "Warranty", value: "Lifetime craftsmanship guarantee" },
  ],
};

export const militaryFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What items typically go in a military shadow box?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common items include medals and ribbons, rank insignia, unit patches, challenge coins, a tri-folded flag, a brass nameplate, branch seals or crests, and sometimes a service photo. The beauty of a shadow box is that you can include whatever pieces are most meaningful to the service member.",
      },
    },
    {
      "@type": "Question",
      name: "Can your shadow boxes hold a tri-folded flag?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our deep-profile military shadow boxes are sized and built to accommodate a standard tri-folded American flag, either as the centerpiece or alongside other memorabilia.",
      },
    },
    {
      "@type": "Question",
      name: "Is a military shadow box a good retirement gift?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's one of the most traditional and appreciated retirement gifts in the military. A shadow box that displays a service member's career highlights is a deeply personal tribute that they'll display with pride for the rest of their life.",
      },
    },
    {
      "@type": "Question",
      name: "How do I mount heavy challenge coins in the shadow box?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our fabric-wrapped, pinnable backing holds challenge coins securely. For especially heavy coins, we recommend using small display easels or coin holders pinned to the backing, which keeps them visible and prevents any shifting over time.",
      },
    },
  ],
};
