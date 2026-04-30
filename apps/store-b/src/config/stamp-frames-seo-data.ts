/**
 * Structured data — b-shadow-box-frames-original/client/src/pages/StampFrames.tsx Helmet scripts
 */

export const stampProductSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Stamp Display Frames",
  description:
    "Professional shadowbox frames for stamp collections with archival double matting, White on Black mat configuration, professional-grade acrylic glazing, and optional brass nameplates. Available in Compact (14×12), Standard (17×13), Large (28×16), and custom sizes.",
  category: "Philatelic Display Framing",
  sku: "STAMP-FRAME-CUSTOM",
  brand: {
    "@type": "Brand",
    name: "ShadowboxFrames",
  },
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
    lowPrice: "89",
    highPrice: "249",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "89",
      maxPrice: "249",
      priceCurrency: "USD",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "156",
    bestRating: "5",
    worstRating: "1",
  },
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Frame Depth",
      value: "Shadowbox depth for stamp presentation",
    },
    {
      "@type": "PropertyValue",
      name: "Matting",
      value: "Archival double mat (White on Black)",
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

export const stampFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What frame size do I need for my stamp collection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose based on your collection size. Compact (14×12 inches) fits small stamp sets or single sheets. Standard (17×13 inches) holds medium collections or stamp blocks. Large (28×16 inches) fits extensive collections or commemorative sheets. Need a different size? Use our custom sizing option.",
      },
    },
    {
      "@type": "Question",
      name: "Why use a shadowbox frame for stamps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shadowbox frames provide depth between your stamps and the acrylic glazing. This prevents stamps from touching the glass and allows for dimensional displays. The depth also creates an elegant presentation effect.",
      },
    },
    {
      "@type": "Question",
      name: "What backing colors are available for stamp frames?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer four backing options: Black (most popular for contrast), White, Light Gray, and Off White. Black backing makes stamps stand out with maximum visual impact.",
      },
    },
    {
      "@type": "Question",
      name: "What is the White on Black mat configuration?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our stamp frames use a double mat system with a white top mat and black bottom mat. The white inner border frames your stamps while the black mat adds depth and contrast. Both mats are archival for preservation.",
      },
    },
    {
      "@type": "Question",
      name: "Should I choose regular or non-glare acrylic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Regular acrylic is crystal clear and shows stamps with maximum clarity. Non-glare acrylic reduces reflections if your frame will hang opposite windows or lights. Both are framer's grade acrylic.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add a brass nameplate to my stamp frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Add a custom brass nameplate with up to three lines of text. Ideal for collection names, dates, or descriptions. Choose from multiple font styles and finishes.",
      },
    },
  ],
};
