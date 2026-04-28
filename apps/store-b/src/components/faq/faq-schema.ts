/** origina-store-b/client/src/pages/GenericPage.tsx FAQPage faqSchema (embedded JSON-LD mainEntity). */

export const faqJsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I order a custom frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use our frame designer to create your frame. Upload your image, enter your sizes, pick your frame style, mat, and glazing. See a live preview with instant pricing. Add to cart when ready. We make your frame to your exact specs.",
      },
    },
    {
      "@type": "Question",
      name: "Can I order custom sizes that aren't standard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Custom sizes are our specialty. Enter any size you need - like 13.5 x 19.25 inches or any other size. We can make almost any size.",
      },
    },
    {
      "@type": "Question",
      name: "What types of glazing do you provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer three glazing options: Standard Glass for clear, low-cost protection; Framer's Grade Acrylic which is professional-grade, lightweight, and shatter-resistant with UV protection; and Premium Non-Glare which reduces reflections.",
      },
    },
    {
      "@type": "Question",
      name: "What is mat board and do I need it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mat board is the border between your artwork and frame. It adds space, draws focus to your image, and keeps artwork from touching the glass. While optional, matting makes most frames look better.",
      },
    },
    {
      "@type": "Question",
      name: "How is pricing calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Price depends on frame size, style, mat setup, and glazing type. Our designer shows live pricing as you build your frame. You always know the cost before ordering.",
      },
    },
    {
      "@type": "Question",
      name: "What are your shipping options?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shipping rates are calculated at checkout based on frame size and destination. Every order includes insured delivery and engineered packaging. Faster shipping is available at checkout.",
      },
    },
    {
      "@type": "Question",
      name: "What is your return policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer a 30-day satisfaction guarantee. Not happy with your frame? Contact us within 30 days for a return, exchange, or refund. Frames must be unused and in original packaging.",
      },
    },
    {
      "@type": "Question",
      name: "What if my frame arrives damaged?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Check your package right away. If damaged, take photos of the box and frame. Contact us within 48 hours. We send a free replacement with prepaid return shipping.",
      },
    },
    {
      "@type": "Question",
      name: "What warranty do you offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide a lifetime craftsmanship guarantee covering defects, construction issues, and our measurement errors. Materials are covered for 2-5 years depending on type.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to receive my frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Custom frames are made to order. Production takes 5-7 business days, plus shipping (3-5 business days). Faster options are available at checkout.",
      },
    },
    {
      "@type": "Question",
      name: "Do you ship internationally?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We currently ship within the United States. Contact us at support@shadowboxframes.com about shipping to other countries.",
      },
    },
    {
      "@type": "Question",
      name: "How are frames packaged?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We pack frames carefully. Each frame is wrapped in protective materials, put in a fitted box with corner guards, and marked FRAGILE. Your frame arrives ready to hang.",
      },
    },
  ],
} as const;
