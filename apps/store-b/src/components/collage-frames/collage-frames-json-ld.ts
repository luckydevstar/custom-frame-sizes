/** FAQ copy + FAQPage JSON-LD — origina-store-b CollageFrames */

export const collageFaqItems = [
  {
    question: "What is a collage frame?",
    answer:
      "A collage frame is a multi photo frame with multiple openings cut into one mat board. Each opening holds a separate photo, letting you display 2 to 12 or more photos in one piece. Collage frames are also called multi opening frames.",
  },
  {
    question: "What is a multi opening mat?",
    answer:
      "A multi opening mat is a mat board with multiple cutouts to hold several photos in one frame. The mat separates and highlights each photo while creating a unified gallery look. Our multi opening mats are precision-cut for standard photo sizes from 4×4 to 16×20 inches.",
  },
  {
    question: "What photo sizes work with collage frames?",
    answer:
      "Our collage frames accommodate standard photo sizes: 4×4, 4×6, 5×7, 8×10, 11×14, and 16×20 inches. Each layout is designed for a specific photo size, though many layouts work with multiple sizes. The designer shows your exact frame dimensions based on your photo size selection.",
  },
  {
    question: "Can I mix portrait and landscape photos?",
    answer:
      "Yes! Many of our multi-opening layouts include both portrait and landscape openings. This lets you mix photo orientations in the same frame. Check the Mixed Orientation category for layouts designed specifically for this purpose.",
  },
  {
    question: "How do I choose the right collage layout?",
    answer:
      "Consider how many photos you want to display and their orientations. Simple grids work well for uniform photos. Gallery layouts feature one large photo with smaller surrounding images. Creative layouts offer circles, ovals, and hearts for unique displays.",
  },
  {
    question: "Can I add text or a nameplate?",
    answer:
      "Yes! Add an optional brass engraved nameplate to any collage frame. This works well for family names, wedding dates, baby names, or graduation years. The nameplate appears below the mat openings.",
  },
  {
    question: "What mat colors are available?",
    answer:
      "Choose from 50+ mat colors including whites, creams, blacks, and accent colors. You can also select a double mat with a reveal color for added depth. Premium options include suede and linen textures.",
  },
  {
    question: "Do multi opening frames include light protection?",
    answer:
      "Yes! All multi photo frames include framer's grade acrylic glazing. This blocks harmful light that causes photos to fade. Upgrade to non-glare acrylic to reduce reflections in bright rooms.",
  },
];

export const collageFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: collageFaqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export const collageProductJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Collage Frames",
  description:
    "Multi photo frames for displaying 2-25 photos in custom layouts. Choose from 20+ professional arrangements with archival matting and framer's grade acrylic for family photos, weddings, and milestone memories.",
  brand: {
    "@type": "Brand",
    name: "ShadowboxFrames",
  },
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
  },
  category: "Picture Frames",
  itemCondition: "https://schema.org/NewCondition",
};
