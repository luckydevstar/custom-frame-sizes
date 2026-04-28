/**
 * Product + FAQ JSON-LD for /bouquet-frames.
 * Mirrors origina-store-b/client/src/pages/BouquetFrames.tsx script blocks.
 */

export function buildBouquetFramesJsonLd(): Record<string, unknown> {
  const priceValidUntil = new Date();
  priceValidUntil.setDate(priceValidUntil.getDate() + 30);
  const priceValidUntilStr = priceValidUntil.toISOString().split("T")[0];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Preserved Bouquet Frames | Wedding Bouquet Framing",
    description:
      "Deep bouquet frames designed specifically for displaying preserved wedding bouquets and bridal flowers. Custom sizing, 2-inch usable depth, framer's grade acrylic glazing, and acid-free backing. Professional-grade preservation for your wedding day memories.",
    brand: {
      "@type": "Brand",
      name: "ShadowboxFrames.com",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "65.00",
      highPrice: "175.00",
      priceValidUntil: priceValidUntilStr,
      offerCount: 3,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "152",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Frame Finishes", value: "3 (White, Black, Walnut)" },
      { "@type": "PropertyValue", name: "Usable Depth", value: "2 inches" },
      { "@type": "PropertyValue", name: "Recommended Size", value: "16×20 to 24×30 inches" },
      { "@type": "PropertyValue", name: "Glazing", value: "Framer's grade acrylic" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How deep of a frame do I need for a preserved bouquet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Preserved wedding bouquets require deep bouquet frames with at least 2 inches of usable depth. Our bouquet frames provide exactly 2 inches of interior space, which accommodates most preserved bridal bouquets including roses, peonies, and mixed arrangements. This depth allows enough clearance between the flowers and glazing to prevent crushing while creating an elegant dimensional display.",
        },
      },
      {
        "@type": "Question",
        name: "What's the best way to preserve my wedding bouquet for framing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The two most effective preservation methods are air drying and silica gel drying. For air drying, hang your bouquet upside down in a cool, dark, dry location for 2-3 weeks. For faster results with better color retention, use silica gel crystals to dry flowers in 5-7 days. Frame your bouquet within 2-4 weeks of drying for optimal color preservation. Avoid direct sunlight during and after drying.",
        },
      },
      {
        "@type": "Question",
        name: "Can I frame a bouquet myself or do I need professional help?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can absolutely frame your preserved bouquet yourself! Our deep bouquet frames come ready to assemble with all mounting hardware included. Simply arrange your dried flowers on the acid-free backing board, secure them gently with pins or adhesive, and close the frame. For complex arrangements or heirloom preservation, some brides prefer professional framing services, but DIY framing is both rewarding and cost-effective.",
        },
      },
      {
        "@type": "Question",
        name: "What frame color works best for preserved wedding flowers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "White frames are the most popular choice for preserved bouquets as they complement traditional wedding aesthetics and make colorful flowers stand out. Black frames create dramatic contrast and work beautifully with white or pastel flowers. Walnut brown frames add warmth and pair well with rustic, garden, or vintage wedding themes. Choose based on your home decor and wedding color palette.",
        },
      },
      {
        "@type": "Question",
        name: "How do I protect my dried bouquet from fading?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Framer's grade acrylic is essential for preventing fading and yellowing of preserved flowers. All our bouquet frames include professional-grade acrylic that helps protect against harmful light while staying crystal-clear. Additionally, display your framed bouquet away from direct sunlight, use acid-free backing materials, and keep temperature and humidity stable in your home.",
        },
      },
      {
        "@type": "Question",
        name: "What size frame do I need for my bridal bouquet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Frame size depends on your bouquet's dimensions and desired mat border. Small bridal bouquets (hand-tied or nosegay style) fit best in 11×14 or 16×20 inch frames. Medium bouquets work well in 20×24 inch frames. Large cascading bouquets or oversized arrangements may require 24×30 or 24×36 inch frames. Round toss bouquets look elegant in square 16×16 or 18×18 frames. Measure your bouquet at its widest points and add 6-8 inches for mat borders.",
        },
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [productSchema, faqSchema],
  };
}
