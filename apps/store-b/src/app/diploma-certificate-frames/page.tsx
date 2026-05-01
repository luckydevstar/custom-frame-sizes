import type { Metadata } from "next";

import { DiplomaCertificateFramesPageContent } from "@/components/diploma-certificate-frames/diploma-certificate-frames-page-content";

const pageUrl = "https://www.shadowboxframes.com/diploma-certificate-frames";
const ogImage = "https://www.shadowboxframes.com/assets/diploma-frames-og.jpg";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Custom Diploma and Certificate Framing",
  provider: {
    "@type": "Organization",
    name: "ShadowboxFrames",
  },
  areaServed: "US",
  description: "Custom framing for diplomas, certificates, licenses, and awards with archival materials",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can you frame diplomas with honors seals and tassels?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Yes, our diploma frames accommodate documents with raised seals, ribbons, and tassels through proper mat spacing and shadowbox depth options. Standard diploma frames include 2-3 inches of mat border around the document, providing clearance for raised university seals, embossed emblems, and honors medallions without contact or compression. For diplomas with attached tassels or graduation cords, our designer offers increased mat border widths (up to 4 inches) and optional shadowbox frames with depths ranging from 0.75 to 1.5 inches. This spacing ensures tassels hang freely within the frame cavity without touching the protective glazing, preventing fiber crushing or color transfer. The mat board itself serves as a spacer between the diploma and glass, while acid-free mounting techniques secure the document without adhesives touching the paper surface. Seal-safe mounting is critical for document preservation, our frames use corner pockets or photo corners that hold the diploma edges, allowing the paper to expand and contract naturally with humidity changes while keeping raised seals completely untouched by mounting materials.',
      },
    },
    {
      "@type": "Question",
      name: "What type of glass protects diplomas from UV damage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Premium UV-filtering acrylic glazing blocks 99% of ultraviolet light while maintaining optical clarity, preventing diploma ink fading and paper yellowing over decades of display. Standard picture frame glass offers no UV protection, allowing harmful ultraviolet radiation to gradually degrade diploma paper fibers, fade printed text, and yellow parchment backgrounds through photochemical breakdown. Our UV-filtering acrylic (also called conservation clear or premium acrylic) incorporates UV-absorbing compounds that filter wavelengths below 400 nanometers, the spectrum responsible for most fading and deterioration. This protection is permanent and built into the acrylic material, not a surface coating that can scratch or degrade. Beyond UV filtration, acrylic glazing offers practical advantages over traditional glass: it weighs 50% less (reducing frame stress and shipping costs), resists shattering for safety in homes with children, and can be cleaned without streaking using microfiber cloths. For diplomas displayed in direct sunlight or bright office lighting, UV-filtering glazing extends document lifespan from decades to centuries by eliminating the primary cause of archival degradation. This protection is especially critical for older diplomas printed with less stable inks or printed on wood-pulp paper stocks that yellow rapidly under UV exposure.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer standard college diploma frame sizes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our designer includes preset sizing for all standard diploma formats: US Letter (8.5×11 inches) for high school diplomas and general certificates, College/University format (11×14 inches) for Bachelor's and Master's degrees from most U.S. institutions, Professional License size (8×10 inches) for medical, legal, and trade board certifications, and international formats including A4 (8 1/4 × 11 3/4 inches) and A3 (11 3/4 × 16 1/2 inches) for European and global universities. These presets automatically calculate recommended frame opening dimensions with proper mat borders, for example, an 8.5×11 inch diploma pairs with an 11×14 inch frame opening (providing 1.25-inch mat borders on all sides), while an 11×14 inch college diploma fits within a 14×17 inch or 16×20 inch frame depending on desired mat width. The sizing system accounts for document orientation (portrait vs. landscape), mat border width preferences (ranging from 1.5 to 4 inches), and double mat configurations that add layered depth for formal presentation. For diplomas with non-standard dimensions, common with older institutions, international universities, or specialty certifications, our custom sizing tool accepts any width and height input, automatically calculating proper frame dimensions while enforcing minimum mat borders for professional appearance and document protection.",
      },
    },
    {
      "@type": "Question",
      name: "How should I preserve my certificate for decades?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Professional certificate preservation requires archival materials, UV-filtering glazing, climate-controlled display conditions, and proper mounting techniques that prevent document stress and chemical degradation. The foundation of long-term preservation begins with acid-free mat board and backing materials, wood-pulp based mats contain lignin that releases acids over time, causing paper yellowing and fiber breakdown, while acid-free mats use purified cotton or alpha-cellulose that remains chemically neutral for centuries. UV-filtering acrylic glazing blocks 99% of ultraviolet light that causes ink fading and paper deterioration, essential for certificates displayed in offices with fluorescent lighting or near windows. Mounting methodology is equally critical: certificates should never be permanently adhered with glue, tape, or dry-mount tissue, as these create stress points and prevent natural paper expansion with humidity changes. Instead, use corner pockets, photo corners, or linen tape hinges on the back edge only, allowing the document to float freely within the mat opening. Environmental factors significantly impact longevity, display certificates in climate-controlled spaces away from direct sunlight, heating vents, or high-humidity areas like bathrooms. Temperature fluctuations and moisture cause paper warping, mold growth, and adhesive failure. Properly framed certificates in stable environments using acid-free materials can remain pristine for 100+ years, while certificates mounted with standard craft materials in variable conditions may show visible degradation within 5-10 years.",
      },
    },
    {
      "@type": "Question",
      name: "What mat colors work best with professional documents?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Traditional mat colors for professional documents include off-white, cream, warm white, black, navy, and burgundy, selections that complement formal document design while providing visual separation from wall colors without distracting from text content. Off-white and cream mats (sometimes called antique white or natural white) are the most versatile choices for diplomas and certificates, offering subtle warmth that prevents stark contrast against aged parchment papers while maintaining professional formality. These neutral tones work universally with any wall color and match the historical aesthetic of traditional academic documents. Black mats create dramatic contrast suitable for modern certificates with bold graphics or contemporary office environments, though black can overwhelm certificates with light backgrounds or delicate typography. For school and corporate colors, navy blue mats complement university diplomas while maintaining professional gravitas, and burgundy or forest green mats add richness appropriate for legal certifications or executive awards. Double mat configurations allow layered color, a common professional combination pairs a wide off-white outer mat with a thin accent mat in navy, black, or institutional colors, creating depth without overwhelming the document. Avoid bright colors, patterns, or highly saturated mats that compete with document text for visual attention. The mat's purpose in professional framing is to enhance readability and provide acid-free protection, not to serve as decorative emphasis. When selecting mats, consider the document's paper color, text ink color, institutional seal colors, and the display environment's wall tones to ensure the frame presents the certificate with appropriate formality and long-term aesthetic coherence.",
      },
    },
  ],
};

/** b-shadow-box-frames-original/client/src/pages/DiplomaCertificateFrames.tsx */
export const metadata: Metadata = {
  title: "Diploma & Certificate Frames | Professional Custom Sizing | ShadowboxFrames",
  description:
    "Design premium diploma frames with UV-protective glazing and custom sizing for any institution. Protect your achievements for life. Free design tool.",
  keywords: [
    "diploma frames",
    "certificate frames",
    "college diploma frame",
    "professional license frame",
    "archival framing",
    "UV protection glass",
    "custom diploma sizing",
    "professional quality framing",
    "graduation diploma frame",
    "university diploma frame",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Diploma & Certificate Frames | Professional Custom Sizing",
    description:
      "Design premium diploma frames with UV-protective glazing and custom sizing for any institution. Protect your achievements for life. Free design tool.",
    type: "website",
    url: pageUrl,
    images: [{ url: ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diploma & Certificate Frames | Professional Custom Sizing",
    description:
      "Design premium diploma frames with UV-protective glazing and custom sizing for any institution. Protect your achievements for life.",
    images: [ogImage],
  },
};

export default function DiplomaCertificateFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <DiplomaCertificateFramesPageContent />
    </>
  );
}
