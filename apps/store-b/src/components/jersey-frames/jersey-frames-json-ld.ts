/** origina-store-b/client/src/pages/JerseyFrames.tsx — <Helmet> JSON-LD blocks */

export const jerseyProductJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Jersey Display Frames",
  description:
    "Professional shadowbox frames for sports jerseys with team-specific triple mat colors, optional brass plaque engraving, 2-inch usable depth, and framer's grade acrylic. Expert conservation mounting for NHL, NBA, MLB, NFL, and concert jerseys.",
  category: "Sports Memorabilia Framing",
  sku: "JERSEY-FRAME-CUSTOM",
  brand: {
    "@type": "Brand",
    name: "ShadowboxFrames",
  },
  image: [
    "https://www.shadowboxframes.com/frames/10727/10727_jersey_lifestyle_01.jpg",
    "https://www.shadowboxframes.com/frames/10728/10728_jersey_lifestyle_01.jpg",
    "https://www.shadowboxframes.com/frames/10729/10729_jersey_lifestyle_01.jpg",
    "https://www.shadowboxframes.com/frames/10727/10727_jersey_lifestyle_02.jpg",
    "https://www.shadowboxframes.com/frames/10728/10728_jersey_lifestyle_02.jpg",
  ],
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    lowPrice: "149",
    highPrice: "399",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "149",
      maxPrice: "399",
      priceCurrency: "USD",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "487",
    bestRating: "5",
    worstRating: "1",
  },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Frame Depth", value: "2 inches usable depth" },
    { "@type": "PropertyValue", name: "Moulding Width", value: "1 inch" },
    { "@type": "PropertyValue", name: "Mat Configuration", value: "Triple mat system (top mat, bottom mat, backing color)" },
    { "@type": "PropertyValue", name: "Sports Supported", value: "NHL, NBA, MLB, NFL, Concert Jerseys" },
    { "@type": "PropertyValue", name: "Glass Options", value: "Framer's grade acrylic" },
    { "@type": "PropertyValue", name: "Construction", value: "Handcrafted to order in our frame shop" },
  ],
};

export const jerseyFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How should I fold my jersey for a shadow box?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most people fold the jersey so the name and number on the back are visible, with the sleeves tucked behind. Some prefer to show the front with the logo and crest. There's no wrong answer, it depends on what part of the jersey matters most to you. Our pinnable backing makes it easy to try different layouts.",
      },
    },
    {
      "@type": "Question",
      name: "Will a shadow box protect a signed jersey?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Once enclosed in a shadow box with UV-protective glazing, your signed jersey is shielded from dust, handling, and the UV light that can cause ink and fabric to fade over time. It's one of the best ways to preserve an autographed jersey.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add other items alongside the jersey?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely, and we encourage it. Ticket stubs, event photos, team patches, trading cards, and small nameplates all work beautifully alongside a jersey. The extra context turns a framed jersey into a complete story.",
      },
    },
    {
      "@type": "Question",
      name: "What size shadow box do I need for a jersey?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `For most adult jerseys, a 32" x 40" or 34" x 42" shadow box works well. Youth jerseys can often fit in a 28" x 34" frame. The right size depends on how you fold the jersey and whether you're including additional items in the display.`,
      },
    },
  ],
};
