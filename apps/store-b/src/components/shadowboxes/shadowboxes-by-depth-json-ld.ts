/**
 * FAQ JSON-LD for /shadowboxes/depth — origina-store-b ShadowboxesByDepth.tsx (Helmet script)
 */

export function buildShadowboxesByDepthFaqJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What depth shadowbox frame do I need?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on what you are framing. Flat items like medals and photos fit in standard depth (0.875 inch). Folded jerseys and dried flowers need deep profile frames (1.25 to 2.5 inches). Helmets, sculptures, and oversized keepsakes need our Ultra Deep frames at 3.5 inches.",
        },
      },
      {
        "@type": "Question",
        name: "What is the deepest shadowbox frame available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our Ultra Deep shadowbox frames offer 3.5 inches of usable interior depth. They are available in matte black and bright white. This is enough room for full-size helmets, thick sculptures, championship belts, and oversized dried bouquets.",
        },
      },
      {
        "@type": "Question",
        name: "How do I measure the depth I need for my item?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Measure the thickest part of your item from back to front. Add about a quarter inch of clearance so the item does not press against the acrylic. That total is the minimum usable depth you need. Our frame listings show exact usable depth for every option.",
        },
      },
    ],
  };
}
