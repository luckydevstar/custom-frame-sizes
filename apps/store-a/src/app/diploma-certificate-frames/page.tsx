import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Sparkles, Shield, Ruler, Layers, Award } from "lucide-react";
import { brandConfig } from "../../brand.config";
import { ScrollToDesignerButton } from "./scroll-button";

const DiplomaFrameDesigner = dynamic(
  () => import("@framecraft/ui").then((mod) => ({ default: mod.DiplomaFrameDesigner })),
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
  title: "Diploma & Certificate Frames – Archival Custom Sizing | Custom Frame Sizes",
  description:
    "Design museum-grade diploma frames with archival UV glazing and custom sizing for any institution. Protect your achievements for life. Free design tool.",
  keywords:
    "diploma frames, certificate frames, college diploma frame, professional license frame, archival framing, UV protection glass, custom diploma sizing, museum quality framing, graduation diploma frame, university diploma frame",
  openGraph: {
    title: "Diploma & Certificate Frames – Archival Custom Sizing",
    description:
      "Design museum-grade diploma frames with archival UV glazing and custom sizing for any institution. Protect your achievements for life. Free design tool.",
    url: "/diploma-certificate-frames",
    type: "website",
    images: ["/assets/diploma-frames-og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diploma & Certificate Frames – Archival Custom Sizing",
    description:
      "Design museum-grade diploma frames with archival UV glazing and custom sizing for any institution. Protect your achievements for life.",
    images: ["/assets/diploma-frames-og.jpg"],
  },
  alternates: { canonical: "/diploma-certificate-frames" },
};

export default function DiplomaCertificateFramesPage() {
  const _pageUrl = `${brandConfig.seo?.canonicalUrl || ""}/diploma-certificate-frames`;
  const _ogImage = `${brandConfig.seo?.canonicalUrl || ""}/assets/diploma-frames-og.jpg`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Custom Diploma and Certificate Framing",
    provider: { "@type": "Organization", name: brandConfig.name },
    areaServed: "US",
    description:
      "Custom framing for diplomas, certificates, licenses, and awards with archival materials",
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
          text: "Yes, our diploma frames accommodate documents with raised seals, ribbons, and tassels through proper mat spacing and shadowbox depth options. Standard diploma frames include 2-3 inches of mat border around the document, providing clearance for raised university seals, embossed emblems, and honors medallions without contact or compression. For diplomas with attached tassels or graduation cords, our designer offers increased mat border widths (up to 4 inches) and optional shadowbox frames with depths ranging from 0.75 to 1.5 inches. This spacing ensures tassels hang freely within the frame cavity without touching the protective glazing, preventing fiber crushing or color transfer. The mat board itself serves as a spacer between the diploma and glass, while acid-free mounting techniques secure the document without adhesives touching the paper surface. Seal-safe mounting is critical for document preservation—our frames use corner pockets or photo corners that hold the diploma edges, allowing the paper to expand and contract naturally with humidity changes while keeping raised seals completely untouched by mounting materials.",
        },
      },
      {
        "@type": "Question",
        name: "What type of glass protects diplomas from UV damage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Museum-grade UV-filtering acrylic glazing blocks 99% of ultraviolet light while maintaining optical clarity, preventing diploma ink fading and paper yellowing over decades of display. Standard picture frame glass offers no UV protection, allowing harmful ultraviolet radiation to gradually degrade diploma paper fibers, fade printed text, and yellow parchment backgrounds through photochemical breakdown. Our UV-filtering acrylic (also called conservation clear or museum acrylic) incorporates UV-absorbing compounds that filter wavelengths below 400 nanometers—the spectrum responsible for most fading and deterioration. This protection is permanent and built into the acrylic material, not a surface coating that can scratch or degrade. Beyond UV filtration, acrylic glazing offers practical advantages over traditional glass: it weighs 50% less (reducing frame stress and shipping costs), resists shattering for safety in homes with children, and can be cleaned without streaking using microfiber cloths. For diplomas displayed in direct sunlight or bright office lighting, UV-filtering glazing extends document lifespan from decades to centuries by eliminating the primary cause of archival degradation. This protection is especially critical for older diplomas printed with less stable inks or printed on wood-pulp paper stocks that yellow rapidly under UV exposure.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer standard college diploma frame sizes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our designer includes preset sizing for all standard diploma formats: US Letter (8.5×11 inches) for high school diplomas and general certificates, College/University format (11×14 inches) for Bachelor's and Master's degrees from most U.S. institutions, Professional License size (8×10 inches) for medical, legal, and trade board certifications, and international formats including A4 (8.27×11.69 inches) and A3 (11.69×16.54 inches) for European and global universities. These presets automatically calculate recommended frame opening dimensions with proper mat borders—for example, an 8.5×11 inch diploma pairs with an 11×14 inch frame opening (providing 1.25-inch mat borders on all sides), while an 11×14 inch college diploma fits within a 14×17 inch or 16×20 inch frame depending on desired mat width. The sizing system accounts for document orientation (portrait vs. landscape), mat border width preferences (ranging from 1.5 to 4 inches), and double mat configurations that add layered depth for formal presentation. For diplomas with non-standard dimensions—common with older institutions, international universities, or specialty certifications—our custom sizing tool accepts any width and height input, automatically calculating proper frame dimensions while enforcing minimum mat borders for professional appearance and document protection.",
        },
      },
      {
        "@type": "Question",
        name: "How should I preserve my certificate for decades?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Professional certificate preservation requires archival-grade materials, UV-filtering glazing, climate-controlled display conditions, and proper mounting techniques that prevent document stress and chemical degradation. The foundation of long-term preservation begins with acid-free mat board and backing materials—wood-pulp based mats contain lignin that releases acids over time, causing paper yellowing and fiber breakdown, while conservation-grade mats use purified cotton or alpha-cellulose that remains chemically neutral for centuries. UV-filtering acrylic glazing blocks 99% of ultraviolet light that causes ink fading and paper deterioration, essential for certificates displayed in offices with fluorescent lighting or near windows. Mounting methodology is equally critical: certificates should never be permanently adhered with glue, tape, or dry-mount tissue, as these create stress points and prevent natural paper expansion with humidity changes. Instead, use corner pockets, photo corners, or linen tape hinges on the back edge only, allowing the document to float freely within the mat opening. Environmental factors significantly impact longevity—display certificates in climate-controlled spaces away from direct sunlight, heating vents, or high-humidity areas like bathrooms. Temperature fluctuations and moisture cause paper warping, mold growth, and adhesive failure. Properly framed certificates in stable environments using archival materials can remain pristine for 100+ years, while certificates mounted with standard craft materials in variable conditions may show visible degradation within 5-10 years.",
        },
      },
      {
        "@type": "Question",
        name: "What mat colors work best with professional documents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Traditional mat colors for professional documents include off-white, cream, warm white, black, navy, and burgundy—selections that complement formal document design while providing visual separation from wall colors without distracting from text content. Off-white and cream mats (sometimes called antique white or natural white) are the most versatile choices for diplomas and certificates, offering subtle warmth that prevents stark contrast against aged parchment papers while maintaining professional formality. These neutral tones work universally with any wall color and match the historical aesthetic of traditional academic documents. Black mats create dramatic contrast suitable for modern certificates with bold graphics or contemporary office environments, though black can overwhelm certificates with light backgrounds or delicate typography. For school and corporate colors, navy blue mats complement university diplomas while maintaining professional gravitas, and burgundy or forest green mats add richness appropriate for legal certifications or executive awards. Double mat configurations allow layered color—a common professional combination pairs a wide off-white outer mat with a thin accent mat in navy, black, or institutional colors, creating depth without overwhelming the document. Avoid bright colors, patterns, or highly saturated mats that compete with document text for visual attention. The mat's purpose in professional framing is to enhance readability and provide archival protection, not to serve as decorative emphasis. When selecting mats, consider the document's paper color, text ink color, institutional seal colors, and the display environment's wall tones to ensure the frame presents the certificate with appropriate formality and long-term aesthetic coherence.",
        },
      },
    ],
  };

  return (
    <>
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
                Protect Your Achievement
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
              data-testid="text-hero-title"
            >
              Diploma &amp; Certificate Frames
            </h1>
            <p
              className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
              data-testid="text-hero-subtitle"
            >
              Professional-grade archival framing for your lifetime achievements. Custom sizing for
              diplomas, certificates, licenses, and professional awards with framer&apos;s grade
              acrylic and archival materials.
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
              <div className="text-center" data-testid="benefit-institution-sizing">
                <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Institution Sizing
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Presets for all formats
                </p>
              </div>
              <div className="text-center" data-testid="benefit-conservation-mats">
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
            <DiplomaFrameDesigner />
          </div>
        </section>

        {/* Archival Protection */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
              data-testid="heading-archival-protection"
            >
              Archival Protection for Your Achievements
            </h2>
            <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
              <p>
                Professional diploma preservation requires professional-grade materials engineered
                to prevent the degradation that destroys improperly framed documents within decades.
                UV-filtering acrylic glazing blocks 99% of ultraviolet radiation—the primary cause
                of ink fading and paper yellowing—extending your diploma&apos;s display life from
                years to centuries. Standard picture frame glass offers zero UV protection, allowing
                harmful wavelengths to gradually break down paper fibers and fade printed text
                through photochemical reactions accelerated by office fluorescent lighting and
                window exposure.
              </p>
              <p>
                Acid-free mat boards form the foundation of document preservation. Wood-pulp mats
                from craft stores contain lignin that releases acids over time, causing the
                characteristic brown discoloration and brittleness visible on improperly stored
                historical documents. Our conservation-grade mats use purified cotton or
                alpha-cellulose that remains chemically neutral for over 100 years, creating a
                protective barrier between your diploma and environmental contaminants. The mat
                board itself acts as a spacer preventing direct contact between paper and glazing,
                allowing air circulation that prevents moisture accumulation and mold growth in
                humid climates.
              </p>
              <p>
                Professional-grade framing extends beyond materials to mounting methodology.
                Diplomas must never be permanently adhered with glue, tape, or heat-mount
                tissue—these create stress points that tear paper as it naturally expands and
                contracts with humidity changes. Professional framers use corner pockets or linen
                tape hinges attached only to the document&apos;s top edge, allowing the diploma to
                float freely within the mat opening. This mounting technique, combined with
                acid-free backing boards that resist warping and provide rigid support, ensures your
                achievement remains pristine through decades of display in home or office
                environments.
              </p>
            </div>
          </div>
        </section>

        {/* Perfect Sizing */}
        <section className="bg-muted/50 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
                data-testid="heading-institution-sizing"
              >
                Perfect Sizing for Any Institution
              </h2>
              <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
                <p>
                  Diploma dimensions vary significantly across institutions, time periods, and
                  document types, requiring flexible sizing systems that accommodate both standard
                  formats and custom dimensions. US Letter size (8.5×11 inches) dominates high
                  school diplomas, general certificates of achievement, and continuing education
                  credentials issued by American institutions. This format typically frames within
                  an 11×14 inch opening, providing 1.25-inch mat borders that create visual
                  separation while maintaining compact wall display dimensions suitable for home
                  offices and personal spaces.
                </p>
                <p>
                  College and university diplomas follow distinct sizing conventions. Modern
                  Bachelor&apos;s and Master&apos;s degrees from U.S. institutions predominantly use
                  11×14 inch document dimensions, fitting professionally within 14×17 inch or 16×20
                  inch frame openings depending on desired mat border width. Graduate institutions
                  and professional schools sometimes employ larger 14×17 inch formats for PhD
                  diplomas and medical degrees, requiring 18×24 inch or 20×24 inch frames to
                  accommodate proper mat spacing. Professional licenses issued by state medical
                  boards, bar associations, and trade certification bodies typically measure 8×10
                  inches, framing elegantly in 10×12 inch or 11×14 inch openings for wall display in
                  professional practice environments.
                </p>
                <p>
                  International diploma formats require different dimensional specifications.
                  European and global universities predominantly use ISO 216 paper sizes: A4 format
                  (8.27×11.69 inches) for standard degrees and A3 format (11.69×16.54 inches) for
                  formal graduation documents. Our sizing system accommodates these international
                  standards plus custom dimensions for historical diplomas, specialty
                  certifications, and institutional awards with non-standard proportions. The
                  designer automatically calculates recommended frame dimensions based on document
                  size, enforcing minimum mat borders for professional appearance while allowing
                  customization of mat width from conservative 1.5-inch borders to formal 4-inch
                  borders suitable for executive office display.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Presentation */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
              data-testid="heading-professional-presentation"
            >
              Professional Presentation
            </h2>
            <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
              <p>
                Double mat configurations elevate diploma presentation from standard framing to
                executive-quality display through layered depth and subtle color contrast. The outer
                mat typically measures 2-3 inches wide in neutral off-white or cream tones, while a
                thin inner mat (revealing just 1/4 inch) introduces accent color coordinated with
                institutional branding—navy for university diplomas, burgundy for legal
                certifications, or black for modern professional credentials. This layering creates
                dimensional depth visible from viewing angles, adding formality appropriate for law
                offices, medical practices, and corporate executive spaces where credentials
                communicate professional authority.
              </p>
              <p>
                Graduation tassels and honors cords require specialized accommodation within diploma
                frames. Standard flat frames compress tassels against glazing, crushing decorative
                fibers and creating pressure points that damage both tassel and document over time.
                Our shadowbox frame options provide 0.75 to 1.5 inches of depth, allowing tassels to
                hang freely within the frame cavity without touching protective glazing. Increased
                mat border widths (3-4 inches) create designated space for tassel placement beside
                the diploma, while seal-safe mounting ensures raised university emblems and embossed
                honors medallions remain completely untouched by mounting materials that could
                flatten or damage dimensional elements.
              </p>
              <p>
                Document stability requires engineering beyond visible aesthetics. Anti-curl backing
                boards prevent diploma warping caused by humidity fluctuations in climate-variable
                regions. Diplomas printed on parchment paper or heavy card stock naturally curl when
                one side absorbs more moisture than the other—a phenomenon accelerated in bathrooms,
                basements, or rooms with inconsistent heating. Rigid backing materials stabilize the
                document while corner-pocket mounting allows natural paper expansion without
                creating stress tears at attachment points. Security hanging hardware appropriate
                for valuable documents includes D-rings rated for frame weight plus 50% safety
                margin, wire systems that distribute load across two mounting points, and optional
                security brackets for high-value credentials in public office spaces where theft
                prevention is a concern.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Specifications Table */}
        <section className="bg-muted/50 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
                data-testid="heading-tech-specs"
              >
                Technical Specifications
              </h2>
              <p className="text-muted-foreground mb-6">
                Standard diploma and certificate sizes with recommended frame opening dimensions for
                professional presentation with proper mat borders.
              </p>
              <div className="overflow-x-auto">
                <table
                  className="w-full border-collapse bg-card rounded-lg overflow-hidden"
                  data-testid="table-specs"
                >
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3 md:p-4 font-semibold">Document Type</th>
                      <th className="text-left p-3 md:p-4 font-semibold">Standard Size</th>
                      <th className="text-left p-3 md:p-4 font-semibold">
                        Recommended Frame Opening
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 md:p-4">US Letter Certificate</td>
                      <td className="p-3 md:p-4">8.5&quot; × 11&quot;</td>
                      <td className="p-3 md:p-4">11&quot; × 14&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 md:p-4">High School Diploma</td>
                      <td className="p-3 md:p-4">8.5&quot; × 11&quot;</td>
                      <td className="p-3 md:p-4">11&quot; × 14&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 md:p-4">College Diploma (Modern)</td>
                      <td className="p-3 md:p-4">11&quot; × 14&quot;</td>
                      <td className="p-3 md:p-4">14&quot; × 17&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 md:p-4">Professional License</td>
                      <td className="p-3 md:p-4">8&quot; × 10&quot;</td>
                      <td className="p-3 md:p-4">10&quot; × 12&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 md:p-4">Corporate Award</td>
                      <td className="p-3 md:p-4">11&quot; × 14&quot;</td>
                      <td className="p-3 md:p-4">14&quot; × 17&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 md:p-4">International (A4)</td>
                      <td className="p-3 md:p-4">8.27&quot; × 11.69&quot;</td>
                      <td className="p-3 md:p-4">11&quot; × 14&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" data-testid="heading-faq">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div
                className="bg-card border border-border rounded-lg p-4 md:p-6"
                data-testid="faq-seals-tassels"
              >
                <h3 className="font-semibold text-lg mb-2">
                  Can you frame diplomas with honors seals and tassels?
                </h3>
                <p className="text-muted-foreground">
                  Yes, our diploma frames accommodate documents with raised seals, ribbons, and
                  tassels through proper mat spacing and shadowbox depth options. Standard diploma
                  frames include 2-3 inches of mat border around the document, providing clearance
                  for raised university seals, embossed emblems, and honors medallions without
                  contact or compression. For diplomas with attached tassels or graduation cords,
                  our designer offers increased mat border widths (up to 4 inches) and optional
                  shadowbox frames with depths ranging from 0.75 to 1.5 inches.
                </p>
              </div>
              <div
                className="bg-card border border-border rounded-lg p-4 md:p-6"
                data-testid="faq-uv-glass"
              >
                <h3 className="font-semibold text-lg mb-2">
                  What type of glass protects diplomas from UV damage?
                </h3>
                <p className="text-muted-foreground">
                  Museum-grade UV-filtering acrylic glazing blocks 99% of ultraviolet light while
                  maintaining optical clarity, preventing diploma ink fading and paper yellowing
                  over decades of display. Standard picture frame glass offers no UV protection,
                  allowing harmful ultraviolet radiation to gradually degrade diploma paper fibers,
                  fade printed text, and yellow parchment backgrounds through photochemical
                  breakdown. Our UV-filtering acrylic incorporates UV-absorbing compounds that
                  filter wavelengths below 400 nanometers—the spectrum responsible for most fading
                  and deterioration.
                </p>
              </div>
              <div
                className="bg-card border border-border rounded-lg p-4 md:p-6"
                data-testid="faq-standard-sizes"
              >
                <h3 className="font-semibold text-lg mb-2">
                  Do you offer standard college diploma frame sizes?
                </h3>
                <p className="text-muted-foreground">
                  Yes, our designer includes preset sizing for all standard diploma formats: US
                  Letter (8.5×11 inches) for high school diplomas and general certificates,
                  College/University format (11×14 inches) for Bachelor&apos;s and Master&apos;s
                  degrees from most U.S. institutions, Professional License size (8×10 inches) for
                  medical, legal, and trade board certifications, and international formats
                  including A4 (8.27×11.69 inches) and A3 (11.69×16.54 inches) for European and
                  global universities.
                </p>
              </div>
              <div
                className="bg-card border border-border rounded-lg p-4 md:p-6"
                data-testid="faq-preservation"
              >
                <h3 className="font-semibold text-lg mb-2">
                  How should I preserve my certificate for decades?
                </h3>
                <p className="text-muted-foreground">
                  Professional certificate preservation requires archival-grade materials,
                  UV-filtering glazing, climate-controlled display conditions, and proper mounting
                  techniques that prevent document stress and chemical degradation. The foundation
                  begins with acid-free mat board and backing materials that remain chemically
                  neutral for centuries. UV-filtering acrylic glazing blocks 99% of ultraviolet
                  light that causes ink fading and paper deterioration. Mounting should use corner
                  pockets or photo corners, never permanent adhesives, allowing the document to
                  expand naturally with humidity changes.
                </p>
              </div>
              <div
                className="bg-card border border-border rounded-lg p-4 md:p-6"
                data-testid="faq-mat-colors"
              >
                <h3 className="font-semibold text-lg mb-2">
                  What mat colors work best with professional documents?
                </h3>
                <p className="text-muted-foreground">
                  Traditional mat colors for professional documents include off-white, cream, warm
                  white, black, navy, and burgundy—selections that complement formal document design
                  while providing visual separation without distracting from text content. Off-white
                  and cream mats are the most versatile choices, offering subtle warmth that
                  prevents stark contrast against aged parchment papers while maintaining
                  professional formality. Black mats create dramatic contrast suitable for modern
                  certificates, while navy blue complements university diplomas and burgundy adds
                  richness for legal certifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="heading-final-cta">
                Ready to Frame Your Achievement?
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Design your custom diploma frame with our interactive tool. Get instant pricing,
                real-time preview, and professional-grade archival protection for your lifetime
                achievements.
              </p>
              <ScrollToDesignerButton />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
