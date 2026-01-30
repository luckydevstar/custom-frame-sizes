import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Sparkles, Shield, Ruler, Layers, Award } from "lucide-react";
import { brandConfig } from "../../brand.config";
import { ScrollToDesignerButton } from "./scroll-button";

const CertificateFrameDesigner = dynamic(
  () => import("@framecraft/ui").then((mod) => ({ default: mod.CertificateFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading designer...</p>
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Certificate Frames – Professional Custom Sizing | Custom Frame Sizes",
  description:
    "Design professional-grade certificate frames with framer's grade acrylic. Perfect for professional licenses, awards, and credentials. Custom sizing for any certificate.",
  keywords:
    "certificate frames, professional license frames, award frames, corporate certificate framing, archival framing, custom certificate sizing, UV protection, archival materials, office credentials",
  openGraph: {
    title: "Certificate Frames – Professional Custom Sizing",
    description:
      "Professional-grade archival framing for professional credentials, licenses, and corporate awards. Custom sizing with framer's grade acrylic.",
    url: "/certificate-frames",
    type: "website",
    images: ["/assets/certificate-frames-og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certificate Frames – Professional Custom Sizing",
    description:
      "Professional-grade archival framing for professional credentials and corporate awards.",
    images: ["/assets/certificate-frames-og.jpg"],
  },
  alternates: { canonical: "/certificate-frames" },
};

export default function CertificateFramesPage() {
  const pageUrl = `${brandConfig.seo?.canonicalUrl || ""}/certificate-frames`;
  const ogImage = `${brandConfig.seo?.canonicalUrl || ""}/assets/certificate-frames-og.jpg`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: brandConfig.seo?.canonicalUrl || "" },
      { "@type": "ListItem", position: 2, name: "Certificate Frames", item: pageUrl },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Custom Certificate Frames",
    description:
      "Professional-grade custom frames for certificates, licenses, and awards. Made with framer's grade acrylic and archival materials. Custom sizes from 4×4 to 48×72 inches.",
    image: ogImage,
    brand: { "@type": "Brand", name: brandConfig.name },
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
    provider: { "@type": "Organization", name: brandConfig.name },
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-medium" data-testid="text-badge">
                Frame Any Certificate Size
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
              data-testid="text-hero-title"
            >
              Certificate Frames
            </h1>
            <p
              className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
              data-testid="text-hero-subtitle"
            >
              Frame professional licenses, degrees, corporate awards, and credentials in any size.
              We use archival materials and framer&apos;s grade acrylic so your achievements stay
              protected for life.
            </p>
            <ScrollToDesignerButton />
          </div>
        </section>

        {/* Benefit Bar */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center" data-testid="benefit-uv-glazing">
                <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Framer&apos;s Grade Acrylic
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Used by Pro Framers
                </p>
              </div>
              <div className="text-center" data-testid="benefit-custom-sizing">
                <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Custom Sizing</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Any format or dimension
                </p>
              </div>
              <div className="text-center" data-testid="benefit-mat-options">
                <Layers className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Frame Shop Quality
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  To protect your items
                </p>
              </div>
              <div className="text-center" data-testid="benefit-handcrafted">
                <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Handcrafted to Order
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Made in our frame shop
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Designer Embed */}
        <section className="container mx-auto px-4 pb-8 md:pb-12">
          <div id="design-tool" className="scroll-mt-20" data-testid="designer-section">
            <CertificateFrameDesigner />
          </div>
        </section>

        {/* What We Frame Section */}
        <section className="py-16 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">What You Can Frame</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">Professional Licenses</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Medical licenses and board certifications</li>
                    <li>• Law bar admissions and attorney licenses</li>
                    <li>• Nursing, dental, and healthcare credentials</li>
                    <li>• Real estate, CPA, and trade licenses</li>
                  </ul>
                </div>
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">Corporate Recognition</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Employee of the month and year awards</li>
                    <li>• Sales achievement and performance awards</li>
                    <li>• Years of service and retirement recognition</li>
                    <li>• Training completion certificates</li>
                  </ul>
                </div>
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">Educational Credentials</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Teaching certificates and licenses</li>
                    <li>• Professional development certifications</li>
                    <li>• Industry certifications (IT, project management)</li>
                    <li>• Continuing education credits</li>
                  </ul>
                </div>
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">Government &amp; Military</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Notary commissions and official appointments</li>
                    <li>• Government service awards</li>
                    <li>• Security clearance documents</li>
                    <li>• Military commendations and certificates</li>
                  </ul>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Enter any certificate size. We build frames to fit your exact dimensions.
              </p>
            </div>
          </div>
        </section>

        {/* Why Frame Your Certificates Section */}
        <section className="py-16 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why Frame Your Certificates</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Long-Term Protection
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Office lights and sunlight fade ink over time. Framer&apos;s grade acrylic
                    blocks 99% of harmful UV rays. Your certificate looks new for decades.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We use archival mat board that won&apos;t damage paper. No yellowing or brown
                    spots like cheap frames cause.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Professional Presentation
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    A framed license shows clients you take your profession seriously. It builds
                    trust before you say a word.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Add a brass nameplate with your name, title, or the date you earned your
                    credential. Makes a strong impression in any office.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Questions Section */}
        <section className="py-16 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Common Questions</h2>
              <div className="space-y-6">
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">What size frame do I need for my license?</h3>
                  <p className="text-sm text-muted-foreground">
                    Most professional licenses are 8×10 inches. Enter your exact size in our
                    designer. It calculates the frame size you need based on your mat border choice.
                  </p>
                </div>
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">
                    My certificate is an odd size. Can you frame it?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Yes. We build every frame to order. Enter any size down to a fraction of an
                    inch. International A4 formats, oversized awards, and custom documents all work.
                  </p>
                </div>
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">Which frame color works best for offices?</h3>
                  <p className="text-sm text-muted-foreground">
                    Black and dark wood frames look professional in most settings. They work well
                    with white or cream mats. Silver frames fit modern offices and medical
                    facilities.
                  </p>
                </div>
                <div className="bg-background p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">Should I use a single or double mat?</h3>
                  <p className="text-sm text-muted-foreground">
                    Double mats add depth and a formal look. They work great for law offices,
                    medical practices, and executive spaces. Single mats are clean and simple for
                    any setting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
