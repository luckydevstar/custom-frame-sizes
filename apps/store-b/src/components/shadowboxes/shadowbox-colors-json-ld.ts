/**
 * Structured data for /shadowboxes/colors — origina-store-b ShadowboxColors.tsx Helmet scripts
 */

export function buildShadowboxColorsFaqJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://www.shadowboxframes.com/shadowboxes/colors#faq",
    mainEntity: [
      {
        "@type": "Question",
        "@id": "https://www.shadowboxframes.com/shadowboxes/colors#faq-best-color-jerseys",
        name: "What frame color works best for a sports jersey shadow box?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on the jersey. Many customers match the frame to one of the team's colors -- a black frame for a dark jersey, or a walnut or cherry frame for warmer-colored uniforms. When in doubt, classic black is always a safe and sharp-looking choice.",
        },
      },
      {
        "@type": "Question",
        "@id": "https://www.shadowboxframes.com/shadowboxes/colors#faq-team-vs-decor",
        name: "Do the frame colors look the same in person as online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We work hard to photograph and display our finishes accurately. That said, monitor settings can shift colors slightly. Our product images are taken in natural light to give you the most honest representation of each finish.",
        },
      },
      {
        "@type": "Question",
        "@id": "https://www.shadowboxframes.com/shadowboxes/colors#faq-dark-vs-light-protection",
        name: "Can I match a shadow box frame to my existing decor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Browsing by color is the best way to coordinate your shadow box with your wall color, furniture, and other frames in the room. If you're creating a grouping of frames, sticking to the same finish family (all wood tones or all blacks, for example) creates a cohesive look.",
        },
      },
      {
        "@type": "Question",
        "@id": "https://www.shadowboxframes.com/shadowboxes/colors#faq-mix-colors",
        name: "Do you offer natural unfinished wood frames?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We carry several natural wood-tone options that showcase the grain and warmth of real wood. These are finished with a clear protective coat to prevent damage, while keeping that natural, organic look.",
        },
      },
    ],
  };
}

export type ShadowboxColorsListItem = {
  displayName: string;
  slug: string;
  description: string;
};

export function buildShadowboxColorsCollectionJsonLd(
  orderedColors: ShadowboxColorsListItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.shadowboxframes.com/shadowboxes/colors",
    name: "Shadowbox Frames by Color",
    description:
      "Browse custom shadowbox frames by color: black, white, brown, silver, gold, blue, and natural finishes. Deep-profile frames for memorabilia, jerseys, medals, and three-dimensional collectibles.",
    url: "https://www.shadowboxframes.com/shadowboxes/colors",
    inLanguage: "en-US",
    about: {
      "@type": "Thing",
      name: "Shadowbox Frames",
      description:
        "Deep-profile display frames designed to preserve and showcase three-dimensional memorabilia and collectibles",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Shadowbox Frame Colors",
      numberOfItems: orderedColors.length,
      itemListElement: orderedColors.map((color, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${color.displayName} Shadowbox Frames`,
        url: `https://www.shadowboxframes.com/shadowboxes/${color.slug}-shadowbox-frames`,
        description: color.description,
      })),
    },
  };
}
