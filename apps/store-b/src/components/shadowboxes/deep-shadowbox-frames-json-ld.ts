/**
 * FAQ JSON-LD for /shadowbox/deep-shadowbox-frames — origina DeepShadowboxFrames.tsx
 */

export function buildDeepShadowboxFramesFaqJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the deepest shadowbox frame available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: 'Our Ultra Deep shadowbox frames offer 3.5 inches of usable depth, our deepest option by far. They come in matte black and bright white, with 1.25-inch solid wood moulding.',
        },
      },
      {
        "@type": "Question",
        name: "How do I choose the right depth for my shadow box?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Measure the thickest item you want to display from front to back, then add at least a quarter inch of clearance so nothing presses against the acrylic. Standard depth (0.875 inches) works for flat items like medals and coins. Medium (1 to 1.5 inches) fits folded fabric and stacked objects. Deep (1.25 to 2 inches) handles jerseys and bulky memorabilia. Ultra Deep (3.5 inches) fits helmets, sculptures, and championship belts.",
        },
      },
      {
        "@type": "Question",
        name: "What items need a deep shadow box frame?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Items that are thicker than about 1 inch typically need a deep or ultra deep frame. Common examples include folded jerseys, game balls, military helmets, dried flower bouquets, combat boots, thick sculptures, championship belts, and multi-layer memorabilia displays.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a deep shadow box in a custom size?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All of our shadowbox frames, including deep and ultra deep options, are available in custom sizes from 4×4 inches up to 48×72 inches, cut to 1/8-inch precision.",
        },
      },
    ],
  };
}
