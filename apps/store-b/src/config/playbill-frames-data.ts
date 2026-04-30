import { PLAYBILL_DIMENSIONS, TICKET_DIMENSIONS } from "@framecraft/core";

/**
 * FAQ + JSON-LD aligned with b-shadow-box-frames-original PlaybillFrames.tsx
 * (answers use live dimensions from core).
 */
export const PLAYBILL_FAQS = [
  {
    question: "What size are playbills?",
    answer: `Playbills are ${PLAYBILL_DIMENSIONS.width}" × ${PLAYBILL_DIMENSIONS.height}" (tall format). Our frames fit this size with proper mat borders.`,
  },
  {
    question: "What size are ticket stubs?",
    answer: `Ticket stubs are about ${TICKET_DIMENSIONS.width}" × ${TICKET_DIMENSIONS.height}" (wide format). Our layouts have openings sized just for tickets.`,
  },
  {
    question: "Can I frame multiple playbills together?",
    answer:
      "Yes. We have layouts for 1-12 playbills in one frame. Pick side-by-side, stacked, or grid styles.",
  },
  {
    question: "What type of frame do I need?",
    answer:
      "Playbills need shadowbox frames. The extra depth keeps the paper away from the acrylic to prevent damage.",
  },
  {
    question: "Can I add an engraved plaque?",
    answer:
      "Yes. Add a brass plaque with the show name, date, or a custom message. Great for gifts.",
  },
  {
    question: "Do frames protect against fading?",
    answer:
      "Yes. All frames use framer's grade acrylic that blocks light damage. Pick standard or non-glare.",
  },
  {
    question: "How do I keep playbills from yellowing?",
    answer:
      "Use our shadowbox frames with acid-free mat board. The deep frame keeps paper safe from moisture and light.",
  },
  {
    question: "Can I frame playbills with ticket stubs?",
    answer:
      "Yes. Many layouts have openings for both. Show the whole theater memory in one frame.",
  },
] as const;

export const playbillFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PLAYBILL_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export const playbillProductSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Playbill Frames",
  description:
    "Professional shadowbox frames for theater playbills and ticket stubs. Custom sizes with framer's grade acrylic and acid-free matting.",
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
