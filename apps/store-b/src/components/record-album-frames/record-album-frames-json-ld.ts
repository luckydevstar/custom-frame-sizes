/** origina-store-b RecordAlbumFrames Seo schema — canonical /record-album-frames */

export const recordAlbumProductJsonLd = {
  "@context": "https://schema.org/",
  "@type": "Product",
  name: "Custom Record Album Frames",
  description:
    "Professional custom framing for vinyl LP records, album covers, and music memorabilia. Professional custom framing featuring solid pine wood frames, framer's grade acrylic glazing, archival backing and matting, archival nylon mounting system for secure record display, and precision-cut matting. Three specialized layout configurations: album cover only, single record with cover, and double records with covers for gatefold albums.",
  image: [
    "https://www.shadowboxframes.com/images/record-album-lifestyle/Record_Frame_Lifestyle (1).png",
    "https://www.shadowboxframes.com/images/record-album-lifestyle/Record_Frame_Lifestyle (2).png",
    "https://www.shadowboxframes.com/images/record-album-lifestyle/Record_Frame_Lifestyle (3).png",
    "https://www.shadowboxframes.com/images/record-album-lifestyle/Record_Frame_Lifestyle (4).png",
  ],
  sku: "RECORD-ALBUM-FRAME",
  mpn: "RAF-001",
  url: "https://www.shadowboxframes.com/record-album-frames",
  category: "Music Memorabilia Frames",
  brand: { "@type": "Brand", name: "ShadowboxFrames" },
  offers: {
    "@type": "AggregateOffer",
    url: "https://www.shadowboxframes.com/record-album-frames",
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

const FAQ_BASE = "https://www.shadowboxframes.com/record-album-frames#faq";

export const recordAlbumFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${FAQ_BASE}`,
  mainEntity: [
    {
      "@type": "Question",
      "@id": `${FAQ_BASE}-sizes`,
      name: "What sizes do record album frames accommodate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our record album frames are designed specifically for standard 12-inch LP vinyl records and album covers, which measure 12.25 inches square. The frames provide proper depth clearance for vinyl thickness while maintaining professional framing standards.",
      },
    },
    {
      "@type": "Question",
      "@id": `${FAQ_BASE}-mounting`,
      name: "How are vinyl records mounted in the frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Records are secured using a nylon mounting system with a nylon LP anchoring screw and nut. This preservation-safe method eliminates the need for tape or adhesives that could damage your vinyl, and allows for completely reversible mounting following conservation standards.",
      },
    },
    {
      "@type": "Question",
      "@id": `${FAQ_BASE}-materials`,
      name: "What materials are included in record album frames?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each frame includes solid furniture-grade pine wood construction, crystal-clear framer's grade acrylic glazing, archival backing board, nesting board with archival nylon mounting system, precision-cut top matting, and wall hanging hardware. All materials meet professional framing standards.",
      },
    },
    {
      "@type": "Question",
      "@id": `${FAQ_BASE}-gatefold`,
      name: "Can I frame gatefold albums or double LPs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our double records with covers layout is specifically designed for gatefold albums and double LP releases. This configuration accommodates the album cover and both vinyl discs in a three-opening layout, creating an impressive display suited to concept albums and special editions.",
      },
    },
  ],
};
