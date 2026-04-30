/**
 * Structured data — b-shadow-box-frames-original/client/src/pages/CurrencyFrames.tsx Helmet scripts
 */

export const currencyProductSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Currency Display Frames",
  description:
    "Professional shadowbox frames for currency collections with archival double matting, White on Black mat configuration, framer's grade acrylic glazing, and optional brass nameplates. Available in Compact (14×12), Standard (17×13), Large (28×16), and custom sizes.",
  category: "Numismatic Display Framing",
  sku: "CURRENCY-FRAME-CUSTOM",
  brand: {
    "@type": "Brand",
    name: "ShadowboxFrames",
  },
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    lowPrice: "139",
    highPrice: "299",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "139",
      maxPrice: "299",
      priceCurrency: "USD",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "89",
    bestRating: "5",
    worstRating: "1",
  },
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Frame Depth",
      value: "Shadowbox depth for currency presentation",
    },
    {
      "@type": "PropertyValue",
      name: "Matting",
      value: "Acid-free double mat (White on Black)",
    },
    {
      "@type": "PropertyValue",
      name: "Backing Options",
      value: "Black, White, Light Gray, Off White",
    },
    {
      "@type": "PropertyValue",
      name: "Glazing",
      value: "Framer's grade acrylic (regular or non-glare)",
    },
    {
      "@type": "PropertyValue",
      name: "Available Sizes",
      value: "Compact (14×12), Standard (17×13), Large (28×16), Custom",
    },
    {
      "@type": "PropertyValue",
      name: "Made in USA",
      value: "Handcrafted to order",
    },
  ],
};

export const currencyFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What frame size do I need for my currency collection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose based on your collection size. Compact (14×12 inches) fits small currency sets or single bills. Standard (17×13 inches) holds medium collections or multiple bills. Large (28×16 inches) fits extensive collections or commemorative currency. Need a different size? Use our custom sizing option.",
      },
    },
    {
      "@type": "Question",
      name: "Why use a shadowbox frame for currency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shadowbox frames provide depth between your currency and the acrylic glazing. This prevents bills from touching the glass and allows for dimensional displays. The depth also creates an elegant presentation effect.",
      },
    },
    {
      "@type": "Question",
      name: "What backing colors are available for currency frames?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer four backing options: Black (most popular for contrast), White, Light Gray, and Off White. Black backing makes currency stand out with maximum visual impact.",
      },
    },
    {
      "@type": "Question",
      name: "Are your currency frames acid-free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We use acid-free mat board and backing materials that won't damage your currency over time. Our framer's grade acrylic glazing provides UV protection to prevent fading.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add a brass nameplate to my currency frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Our optional brass nameplates let you add up to three lines of custom text. Ideal for noting the currency type, year, or any commemorative information.",
      },
    },
    {
      "@type": "Question",
      name: "How are currency frames made?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each currency frame is handcrafted to order in our professional frame shop. We use archival materials and framer's grade acrylic to ensure your collection is protected for a lifetime.",
      },
    },
  ],
};
