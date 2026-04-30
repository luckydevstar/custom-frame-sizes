import type { Metadata } from "next";

import { CertificateFramesPageContent } from "@/components/certificate-frames/certificate-frames-page-content";

const pageUrl = "https://www.shadowboxframes.com/certificate-frames";
const ogImage = "https://www.shadowboxframes.com/assets/certificate-frames-og.jpg";

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom Certificate Frames",
  description:
    "Professional-grade custom frames for certificates, licenses, and awards. Made with framer's grade acrylic and archival materials. Custom sizes from 4×4 to 48×72 inches.",
  image: ogImage,
  brand: {
    "@type": "Brand",
    name: "ShadowboxFrames",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "59.00",
    highPrice: "299.00",
    availability: "https://schema.org/InStock",
    url: pageUrl,
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Custom Certificate and Professional License Framing",
  provider: {
    "@type": "Organization",
    name: "ShadowboxFrames",
  },
  areaServed: "US",
  description:
    "Custom framing for certificates, professional licenses, awards, and corporate recognition with archival materials",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What size frame do I need for a professional license?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most professional licenses measure 8×10 inches. This includes medical, legal, and trade certifications. With a 2-inch mat border, you need an 11×14 inch frame opening. Our designer has presets for standard license sizes. It figures out the right frame size for you. Medical licenses, bar admissions, and nursing certifications usually use the 8×10 inch format. They can be portrait or landscape. For office walls, use framer's grade acrylic to stop fading from lights. Add archival mat board that lasts for decades. Some licenses are larger (10×12 or 11×8.5 inches). Our tool works with any size down to a fraction of an inch.",
      },
    },
    {
      "@type": "Question",
      name: "Can you frame corporate awards and achievement certificates?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we frame all types of corporate awards. This includes letter-size employee awards and large presentation certificates. Standard corporate awards use US Letter (8.5×11 inches) or large format (11×14 inches). Our designer has presets for both sizes in portrait and landscape. For formal awards, try double mats with matching colors like navy/cream, black/gold, or burgundy/white. These add depth and look great with company colors. Sales awards, years-of-service certificates, and board resolutions all benefit from archival framing. Your awards will stay bright for decades. Add a brass plaque with custom engraving for dates, names, or company milestones.",
      },
    },
    {
      "@type": "Question",
      name: "How do I preserve my certification for decades?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You need three things to keep your certificate safe: framer's grade acrylic, archival materials, and safe mounting. Framer's grade acrylic blocks 99% of harmful UV light. This stops ink fading and paper yellowing from office lights. Use archival mat board made from cotton. Stay away from wood-pulp mats that break down paper over time. Mount certificates using archival corners that let paper expand naturally. Never use tape or glue that can damage paper. Keep framed certificates away from direct sunlight and heating vents. Climate-controlled offices work best. With archival framing, your certificates can last 100+ years.",
      },
    },
    {
      "@type": "Question",
      name: "What frame styles work best for office certificate display?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Offices look best with clean frame styles in neutral colors. Black wood frames (matte or satin) work great for law firms, medical offices, and corporate settings. Pair them with white or cream matting for a classic look. Black metal frames with thin profiles work well in tech companies and startups. For traditional offices like law firms or government buildings, try dark wood frames in walnut or mahogany. Silver or brushed nickel frames fit well in medical facilities. Frame width matters too. Narrow profiles (0.5-0.75 inches) suit smaller licenses. Wider frames (1-2 inches) add more presence to large awards. Skip fancy gold frames unless they match your office style. The frame should make your certificate look great without taking over.",
      },
    },
    {
      "@type": "Question",
      name: "Do standard certificate frames fit international documents?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "International certificates often use A4 paper size (8.27×11.69 inches). This is different from US Letter (8.5×11 inches). Standard US frames won't fit without gaps or trimming. Our designer has A4 presets in portrait and landscape. It figures out the right frame size with proper mat borders for you. European universities and global certifications often use A4 or A3 (11.69×16.54 inches) formats. Our custom sizing tool works with any measurement down to a fraction of an inch. We can frame certificates from any country. Use archival framing to protect international documents. Different paper and ink types may react differently to light and humidity.",
      },
    },
  ],
};

/** b-shadow-box-frames-original/client/src/pages/CertificateFrames.tsx */
export const metadata: Metadata = {
  title: "Certificate Frames | Professional Custom Sizing | ShadowboxFrames",
  description:
    "Design professional-grade certificate frames with framer's grade acrylic. Sized for professional licenses, awards, and credentials. Custom sizing for any certificate.",
  keywords: [
    "certificate frames",
    "professional license frames",
    "award frames",
    "corporate certificate framing",
    "archival framing",
    "custom certificate sizing",
    "UV protection",
    "archival materials",
    "office credentials",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Certificate Frames | Professional Custom Sizing",
    description:
      "Professional-grade archival framing for professional credentials, licenses, and corporate awards. Custom sizing with framer's grade acrylic.",
    type: "website",
    url: pageUrl,
    images: [{ url: ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certificate Frames | Professional Custom Sizing",
    description: "Professional-grade archival framing for professional credentials and corporate awards.",
    images: [ogImage],
  },
};

export default function CertificateFramesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CertificateFramesPageContent />
    </>
  );
}
