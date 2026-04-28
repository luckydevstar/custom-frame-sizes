/**
 * Combined Product + FAQ JSON-LD for /shadowbox hub.
 * Mirrors origina-store-b/client/src/pages/Shadowbox.tsx schema graph.
 */

export function buildShadowboxHubJsonLd(): Record<string, unknown> {
  const priceValidUntil = new Date();
  priceValidUntil.setDate(priceValidUntil.getDate() + 30);
  const priceValidUntilStr = priceValidUntil.toISOString().split("T")[0];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Custom Shadowbox Frames - Deep Display Frames for 3D Objects",
    description:
      "Professional custom shadowbox frames in multiple styles and depths from 0.875\" to 3.5\". Custom sizing from 4×4 to 32×40 inches for memorabilia, jerseys, medals, helmets, and 3D objects with professional-grade materials.",
    brand: {
      "@type": "Brand",
      name: "ShadowboxFrames.com",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "55.00",
      highPrice: "165.00",
      priceValidUntil: priceValidUntilStr,
      offerCount: 12,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "287",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Frame Styles", value: "6" },
      { "@type": "PropertyValue", name: "Depth Options", value: "4 tiers (0.875\" to 3.5\")" },
      { "@type": "PropertyValue", name: "Size Range", value: "4×4 to 32×40 inches" },
      { "@type": "PropertyValue", name: "Usable Depth", value: "0.875-1.25 inches" },
      { "@type": "PropertyValue", name: "Mat Board Options", value: "Available" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a shadow box frame?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It's a frame with depth. Where a regular picture frame holds something flat against backing, a shadow box has interior space, anywhere from just under an inch to 3.5 inches deep, so three-dimensional objects can sit inside without touching the front glazing. That depth is what makes them right for medals, folded jerseys, dried flowers, collectible displays, helmets, and anything else that has physical thickness. The acrylic front protects the contents from dust and handling while keeping everything visible.",
        },
      },
      {
        "@type": "Question",
        name: "How much depth do I need for my items?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Measure the thickest item you plan to display from front to back, then add at least a quarter inch of clearance so nothing presses against the acrylic. For flat items like pinned medals or mounted coins, standard depth at 0.875 inches is usually enough. Folded fabric, thick documents, or stacked objects typically need 1 to 1.5 inches. Full jerseys and bulky memorabilia call for 1.25 to 2.5 inches. For championship belts, helmets, and thick sculptures, the 3.5-inch ultra-deep frame gives you the most room.",
        },
      },
      {
        "@type": "Question",
        name: "What items work best in shadow box frames?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Anything with physical thickness that you'd rather see on a wall than store in a box. The most common displays we build frames for: jerseys and sports equipment, military medal arrangements, dried wedding bouquets, coin and pin collections, framed concert memorabilia, baby keepsakes like hospital bracelets and first shoes, vintage object collections, and mixed-media arrangements that combine flat photos with dimensional items. If it doesn't lay flat in a standard frame, it belongs in a shadow box.",
        },
      },
      {
        "@type": "Question",
        name: "How much do custom shadow box frames cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pricing depends on the frame size, which moulding you choose, the depth, and whether you add matting or upgrade to non-glare acrylic. Smaller shadow boxes start in the $50 range and scale up with size and options. The fastest way to get an exact price is to use the designer at the top of this page, it updates in real time as you change dimensions, frame style, and add-ons. No hidden fees, no surprises at checkout.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between a shadow box and a regular frame?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Depth. A standard picture frame holds flat items, prints, photos, documents, pressed close to the glazing with almost no space between. A shadow box adds interior depth, ranging from 0.875 inches up to 3.5 inches depending on the frame, so three-dimensional objects can sit inside the frame without being compressed. Shadow boxes also default to acrylic rather than glass, which matters at larger sizes where glass would be dangerously heavy and fragile during shipping.",
        },
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [productSchema, faqSchema],
  };
}
