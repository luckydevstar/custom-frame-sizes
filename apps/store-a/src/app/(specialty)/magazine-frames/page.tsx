import type { Metadata } from "next";
import { MagazineFramesContent } from "./magazine-frames-content";

const baseUrl = "https://customframesizes.com";
const pageUrl = `${baseUrl}/magazine-frames`;

export const metadata: Metadata = {
  title:
    "Magazine Frames | Custom Shadowbox Frames for Collectible Magazines | CustomFrameSizes.com",
  description:
    "Custom magazine frames with shadowbox depth for collectible magazines. Framer's grade acrylic, archival matting, and multiple layouts. Frame vintage magazines from TIME, Life, Vogue, Rolling Stone, National Geographic, and more.",
  keywords:
    "magazine frames, shadowbox magazine frame, vintage magazine frame, collectible magazine display, magazine cover frame, custom magazine frame, Life magazine frame, Vogue frame, Rolling Stone frame, National Geographic frame, TIME magazine frame, magazine preservation frame",
  openGraph: {
    title: "Custom Magazine Frames - Shadowbox Frames for Collectible Magazines",
    description:
      "Professional shadowbox frames for collectible magazines. Framer's grade acrylic and archival matting for all magazine sizes.",
    type: "website",
    url: pageUrl,
  },
  alternates: { canonical: pageUrl },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the most common magazine sizes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Magazine sizes vary by publication. Common sizes: TIME and People (8×10.5"), Sports Illustrated (8.5×11"), Vogue (8.875×11"), Life Magazine (10.5×14"), National Geographic (6.875×10"). Our frames fit all sizes.',
      },
    },
    {
      "@type": "Question",
      name: "Can I frame multiple magazines together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We have layouts for 2-6 magazines in one frame. Great for themed collections or series.",
      },
    },
    {
      "@type": "Question",
      name: "What type of frame do I need for magazines?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Magazines need shadowbox frames. The extra depth keeps paper away from the acrylic. All frames use framer's grade acrylic and archival matting.",
      },
    },
    {
      "@type": "Question",
      name: "How do I preserve vintage magazines from fading?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use framer's grade acrylic and archival mat board. Our shadowbox frames keep magazines safe from light damage and yellowing.",
      },
    },
  ],
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Magazine Frames",
  description:
    "Professional shadowbox frames for collectible magazines. Custom sizes with framer's grade acrylic, archival matting, and multiple layouts for all magazine dimensions.",
  brand: { "@type": "Brand", name: "Custom Frame Sizes" },
  offers: {
    "@type": "AggregateOffer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
  },
  category: "Picture Frames",
  itemCondition: "https://schema.org/NewCondition",
};

export default function MagazineFramesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <MagazineFramesContent />
    </>
  );
}
