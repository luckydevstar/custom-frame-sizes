/**
 * FAQ JSON-LD for /shadowboxes/styles — origina-store-b ShadowboxesByStyle.tsx
 */

export function buildShadowboxesByStyleFaqJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What shadowbox frame styles are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer five style categories: Classic (solid matte and gloss finishes), Modern (metallic and high-gloss), Rustic and Barnwood (distressed and reclaimed wood), Natural Wood (real grain oak, maple, and walnut), and Statement (wide profile frames for bold displays).",
        },
      },
      {
        "@type": "Question",
        name: "Which shadowbox style is most popular?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Classic matte black and white are our best sellers. They work with any item and any room. For a warmer feel, natural wood tones are the second most popular choice.",
        },
      },
      {
        "@type": "Question",
        name: "Can I mix shadowbox styles on the same wall?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Stick to two styles max and keep the color palette consistent. Classic black and natural wood pair well. Rustic and modern can clash if you are not careful. When in doubt, match the frames and let the contents inside do the talking.",
        },
      },
    ],
  };
}
