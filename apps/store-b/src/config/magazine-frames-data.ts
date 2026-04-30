/**
 * Shared copy/schema data for magazine frames — mirrors
 * b-shadow-box-frames-original/client/src/pages/specialty/MagazineFrames.tsx
 */

export function getMagazineSizeFormatId(sizeString: string): string {
  const sizeMap: Record<string, string> = {
    "5 1/2 × 7 1/2": "compact-55x75",
    "7 × 10": "compact-7x10",
    "8 × 10 1/2": "standard-8x105",
    "8 × 11": "standard-8x11",
    "8 1/4 × 11": "standard-825x11",
    "8 1/2 × 11": "standard-letter",
    "8 3/4 × 11": "standard-875x11",
    "9 × 11": "standard-9x11",
    "10 × 10 1/2": "large-10x105",
    "10 × 12": "large-10x12",
    "10 × 14": "large-10x14",
    "10 1/2 × 12": "large-105x12",
    "10 1/2 × 14": "large-105x14",
    "11 × 14": "large-11x14",
  };
  return sizeMap[sizeString] || "standard-letter";
}

export const MAGAZINE_SIZE_ROWS = [
  { magazine: "Allure Frame", size: "8 × 10 1/2" },
  { magazine: "Architectural Digest Frame", size: "8 1/2 × 11" },
  { magazine: "Better Homes and Gardens Frame", size: "8 × 10 1/2" },
  { magazine: "Bon Appetit Frame", size: "8 × 11" },
  { magazine: "Colliers Frame (historic)", size: "10 1/2 × 14" },
  { magazine: "Cosmopolitan Frame", size: "8 × 11" },
  { magazine: "Ebony Frame", size: "10 1/2 × 14" },
  { magazine: "Elle Magazine Frame", size: "9 × 11" },
  { magazine: "Entertainment Weekly Frame", size: "8 × 10 1/2" },
  { magazine: "Entrepreneur Frame", size: "10 × 10 1/2" },
  { magazine: "Esquire Magazine Frame", size: "8 1/2 × 11" },
  { magazine: "Fast Company Frame", size: "8 3/4 × 11" },
  { magazine: "Forbes Magazine Frame", size: "8 × 10 1/2" },
  { magazine: "Fortune Frame", size: "10 × 10 1/2" },
  { magazine: "GQ Magazine Frame", size: "8 × 11" },
  { magazine: "Glamour Frame", size: "8 × 11" },
  { magazine: "Good Housekeeping Frame", size: "8 × 11" },
  { magazine: "Harper's Bazaar Frame", size: "9 × 11" },
  { magazine: "Interview Magazine Frame", size: "10 × 12" },
  { magazine: "Jet Frame (historic)", size: "5 1/2 × 7 1/2" },
  { magazine: "Life Magazine Frame", size: "10 1/2 × 14" },
  { magazine: "MAD Magazine Frame", size: "8 × 10 1/2" },
  { magazine: "Marie Claire Frame", size: "9 × 11" },
  { magazine: "Men's Health Frame", size: "8 × 10 1/2" },
  { magazine: "National Geographic Frame", size: "7 × 10" },
  { magazine: "Newsweek Magazine Frame", size: "8 × 10 1/2" },
  { magazine: "Nintendo Power Frame", size: "8 × 10 1/2" },
  { magazine: "People Magazine Frame", size: "8 × 10 1/2" },
  { magazine: "Playboy Frame", size: "8 1/2 × 11" },
  { magazine: "Reader's Digest Frame", size: "5 1/2 × 7 1/2" },
  { magazine: "Rolling Stone Frame (1980s-2008+)", size: "10 × 12" },
  { magazine: "Rolling Stone Frame (2008-2018)", size: "8 × 11" },
  { magazine: "Saturday Evening Post Frame", size: "10 × 12" },
  { magazine: "Scientific American Frame", size: "8 × 10 1/2" },
  { magazine: "Smithsonian Frame", size: "8 × 10 1/2" },
  { magazine: "Sports Illustrated Frame", size: "8 × 10 1/2" },
  { magazine: "The Atlantic Frame", size: "8 × 10 1/2" },
  { magazine: "The Economist Frame", size: "8 × 10 1/2" },
  { magazine: "The New Yorker Frame", size: "8 × 10 1/2" },
  { magazine: "TIME Magazine Frame", size: "8 × 10 1/2" },
  { magazine: "TV Guide Frame (classic)", size: "5 1/2 × 7 1/2" },
  { magazine: "Town & Country Frame", size: "9 × 11" },
  { magazine: "Vanity Fair Frame", size: "8 3/4 × 11" },
  { magazine: "Vogue Magazine Frame", size: "8 3/4 × 11" },
  { magazine: "W Magazine Frame", size: "10 × 14" },
  { magazine: "Weekly World News Frame", size: "11 × 14" },
  { magazine: "Wired Magazine Frame", size: "8 × 11" },
] as const;

export const MAGAZINE_FAQS = [
  {
    question: "What are the most common magazine sizes?",
    answer:
      'Magazine sizes vary by publication. Common sizes: TIME and People (8×10.5"), Sports Illustrated (8.5×11"), Vogue (8.875×11"), Life Magazine (10.5×14"), National Geographic (6.875×10"). Our frames fit all sizes.',
  },
  {
    question: "Can I frame multiple magazines together?",
    answer: "Yes. We have layouts for 2-6 magazines in one frame. Great for themed collections or series.",
  },
  {
    question: "What type of frame do I need for magazines?",
    answer:
      "Magazines need shadowbox frames. The extra depth keeps paper away from the acrylic. All frames use framer's grade acrylic and archival matting.",
  },
  {
    question: "How do I preserve vintage magazines from fading?",
    answer:
      "Use framer's grade acrylic and archival mat board. Our shadowbox frames keep magazines safe from light damage and yellowing.",
  },
  {
    question: "Do frames include protection from fading?",
    answer:
      "Yes. All frames use framer's grade acrylic that blocks harmful light. Pick standard or non-glare.",
  },
  {
    question: "Can I add an engraved plaque?",
    answer: "Yes. Add a brass plaque with the issue date, publication name, or a message. Great for gifts.",
  },
  {
    question: "Will framing protect the value of collectible magazines?",
    answer:
      "Yes. Proper framing with archival materials helps preserve condition and value. Our frames prevent damage, fading, and wear.",
  },
  {
    question: "What size frame do I need for Rolling Stone magazine?",
    answer: 'Current issues: 8×11". Classic issues from earlier decades: 10.5×12". Our designer fits both sizes.',
  },
  {
    question: "Can I frame magazines with thick spines or special covers?",
    answer: "Yes. Shadowbox frames have room for thick bindings, embossed covers, and special packaging.",
  },
] as const;

export const magazineFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MAGAZINE_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export const magazineProductSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Magazine Frames",
  description:
    "Professional shadowbox frames for collectible magazines. Custom sizes with framer's grade acrylic, archival matting, and multiple layouts for all magazine dimensions.",
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
