"use client";

/* eslint-disable react/no-unescaped-entities -- long-form copy from b-shadow-box-frames-original DiplomaCertificateFrames.tsx */

import { Button } from "@framecraft/ui";
import { Award, Layers, Ruler, Shield, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback } from "react";

import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const DiplomaFrameDesignerDynamic = dynamic(
  () => import("@framecraft/ui").then((m) => ({ default: m.DiplomaFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center bg-background border rounded-lg">
        <p className="text-muted-foreground">Loading designer…</p>
      </div>
    ),
  },
);

/** b-shadow-box-frames-original/client/src/pages/DiplomaCertificateFrames.tsx */
export function DiplomaCertificateFramesPageContent() {
  useScrollToTop();

  const scrollToDesigner = useCallback(() => {
    const designerElement = document.getElementById("design-tool");
    if (designerElement) {
      designerElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Protect Your Achievement
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4" data-testid="text-hero-title">
            Diploma & Certificate Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Premium framing for your lifetime achievements. Custom sizing for diplomas, certificates, licenses, and
            professional awards with framer&apos;s grade acrylic and archival materials.
          </p>

          <Button size="lg" onClick={scrollToDesigner} data-testid="button-design-frame" className="rounded-full">
            Design Your Frame
          </Button>
        </div>
      </section>

      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="benefit-uv-glazing">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Framer&apos;s Grade Acrylic</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Used by Pro Framers
              </p>
            </div>

            <div className="text-center" data-testid="benefit-institution-sizing">
              <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Institution Sizing</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Presets for all formats
              </p>
            </div>

            <div className="text-center" data-testid="benefit-conservation-mats">
              <Layers className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Frame Shop Quality</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                To protect your items
              </p>
            </div>

            <div className="text-center" data-testid="benefit-handcrafted">
              <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Handcrafted to Order</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Made in our frame shop
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-8 md:pb-12">
        <div id="design-tool" className="scroll-mt-20" data-testid="designer-section">
          <DiplomaFrameDesignerDynamic />
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" data-testid="heading-archival-protection">
            Archival Protection for Your Achievements
          </h2>
          <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
            <p>
              Professional diploma preservation requires premium materials engineered to prevent the degradation that
              destroys improperly framed documents within decades. UV-filtering acrylic glazing blocks 99% of ultraviolet
              radiation, the primary cause of ink fading and paper yellowing, extending your diploma&apos;s display life from
              years to centuries. Standard picture frame glass offers zero UV protection, allowing harmful wavelengths to
              gradually break down paper fibers and fade printed text through photochemical reactions accelerated by office
              fluorescent lighting and window exposure.
            </p>
            <p>
              Archival mat boards form the foundation of document preservation. Wood-pulp mats from craft stores contain
              lignin that releases acids over time, causing the characteristic brown discoloration and brittleness visible on
              improperly stored historical documents. Our archival mats use purified cotton or alpha-cellulose that remains
              chemically neutral for over 100 years, creating a protective barrier between your diploma and environmental
              contaminants. The mat board itself acts as a spacer preventing direct contact between paper and glazing,
              allowing air circulation that prevents moisture accumulation and mold growth in humid climates.
            </p>
            <p>
              Archival framing extends beyond materials to mounting methodology. Diplomas must never be permanently adhered
              with glue, tape, or heat-mount tissue, these create stress points that tear paper as it naturally expands and
              contracts with humidity changes. Professional framers use corner pockets or linen tape hinges attached only to
              the document&apos;s top edge, allowing the diploma to float freely within the mat opening. This mounting technique,
              combined with archival backing boards that resist warping and provide rigid support, ensures your achievement
              remains pristine through decades of display in home or office environments.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" data-testid="heading-institution-sizing">
              Perfect Sizing for Any Institution
            </h2>
            <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
              <p>
                Diploma dimensions vary significantly across institutions, time periods, and document types, requiring
                flexible sizing systems that accommodate both standard formats and custom dimensions. US Letter size
                (8.5×11 inches) dominates high school diplomas, general certificates of achievement, and continuing education
                credentials issued by American institutions. This format typically frames within an 11×14 inch opening,
                providing 1.25-inch mat borders that create visual separation while maintaining compact wall display
                dimensions suitable for home offices and personal spaces.
              </p>
              <p>
                College and university diplomas follow distinct sizing conventions. Modern Bachelor&apos;s and Master&apos;s
                degrees from U.S. institutions predominantly use 11×14 inch document dimensions, fitting professionally within
                14×17 inch or 16×20 inch frame openings depending on desired mat border width. Graduate institutions and
                professional schools sometimes employ larger 14×17 inch formats for PhD diplomas and medical degrees, requiring
                18×24 inch or 20×24 inch frames to accommodate proper mat spacing. Professional licenses issued by state
                medical boards, bar associations, and trade certification bodies typically measure 8×10 inches, framing
                elegantly in 10×12 inch or 11×14 inch openings for wall display in professional practice environments.
              </p>
              <p>
                International diploma formats require different dimensional specifications. European and global universities
                predominantly use ISO 216 paper sizes: A4 format (8 1/4 × 11 3/4 inches) for standard degrees and A3 format
                (11 3/4 × 16 1/2 inches) for formal graduation documents. Our sizing system accommodates these international
                standards plus custom dimensions for historical diplomas, specialty certifications, and institutional awards
                with non-standard proportions. The designer automatically calculates recommended frame dimensions based on
                document size, enforcing minimum mat borders for professional appearance while allowing customization of
                mat width from conservative 1.5-inch borders to formal 4-inch borders suitable for executive office display.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" data-testid="heading-professional-presentation">
            Professional Presentation
          </h2>
          <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
            <p>
              Double mat configurations elevate diploma presentation from standard framing to executive-quality display
              through layered depth and subtle color contrast. The outer mat typically measures 2-3 inches wide in neutral
              off-white or cream tones, while a thin inner mat (revealing just 1/4 inch) introduces accent color coordinated
              with institutional branding, navy for university diplomas, burgundy for legal certifications, or black for
              modern professional credentials. This layering creates dimensional depth visible from viewing angles, adding
              formality appropriate for law offices, medical practices, and corporate executive spaces where credentials
              communicate professional authority.
            </p>
            <p>
              Graduation tassels and honors cords require specialized accommodation within diploma frames. Standard flat
              frames compress tassels against glazing, crushing decorative fibers and creating pressure points that damage both
              tassel and document over time. Our shadowbox frame options provide 0.75 to 1.5 inches of depth, allowing
              tassels to hang freely within the frame cavity without touching protective glazing. Increased mat border widths
              (3-4 inches) create designated space for tassel placement beside the diploma, while seal-safe mounting ensures
              raised university emblems and embossed honors medallions remain completely untouched by mounting materials that
              could flatten or damage dimensional elements.
            </p>
            <p>
              Document stability requires engineering beyond visible aesthetics. Anti-curl backing boards prevent diploma
              warping caused by humidity fluctuations in climate-variable regions. Diplomas printed on parchment paper or
              heavy card stock naturally curl when one side absorbs more moisture than the other, a phenomenon accelerated in
              bathrooms, basements, or rooms with inconsistent heating. Rigid backing materials stabilize the document while
              corner-pocket mounting allows natural paper expansion without creating stress tears at attachment points.
              Security hanging hardware appropriate for valuable documents includes D-rings rated for frame weight plus 50%
              safety margin, wire systems that distribute load across two mounting points, and optional security brackets for
              high-value credentials in public office spaces where theft prevention is a concern.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" data-testid="heading-tech-specs">
              Technical Specifications
            </h2>
            <p className="text-muted-foreground mb-6">
              Standard diploma and certificate sizes with recommended frame opening dimensions for professional presentation
              with proper mat borders.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-card rounded-lg overflow-hidden" data-testid="table-specs">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3 md:p-4 font-semibold">Document Type</th>
                    <th className="text-left p-3 md:p-4 font-semibold">Standard Size</th>
                    <th className="text-left p-3 md:p-4 font-semibold">Recommended Frame Opening</th>
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
                    <td className="p-3 md:p-4">8 1/4&quot; × 11 3/4&quot;</td>
                    <td className="p-3 md:p-4">11&quot; × 14&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" data-testid="heading-faq">
            Questions we hear most
          </h2>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4 md:p-6" data-testid="faq-seals-tassels">
              <h3 className="font-semibold text-lg mb-2">Can you frame diplomas with honors seals and tassels?</h3>
              <p className="text-muted-foreground">
                Yes, our diploma frames accommodate documents with raised seals, ribbons, and tassels through proper mat spacing
                and shadowbox depth options. Standard diploma frames include 2-3 inches of mat border around the document,
                providing clearance for raised university seals, embossed emblems, and honors medallions without contact or
                compression. For diplomas with attached tassels or graduation cords, our designer offers increased mat border
                widths (up to 4 inches) and optional shadowbox frames with depths ranging from 0.75 to 1.5 inches.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 md:p-6" data-testid="faq-uv-glass">
              <h3 className="font-semibold text-lg mb-2">What type of glass protects diplomas from UV damage?</h3>
              <p className="text-muted-foreground">
                Premium UV-filtering acrylic glazing blocks 99% of ultraviolet light while maintaining optical clarity,
                preventing diploma ink fading and paper yellowing over decades of display. Standard picture frame glass offers
                no UV protection, allowing harmful ultraviolet radiation to gradually degrade diploma paper fibers, fade printed
                text, and yellow parchment backgrounds through photochemical breakdown. Our UV-filtering acrylic incorporates
                UV-absorbing compounds that filter wavelengths below 400 nanometers, the spectrum responsible for most fading and
                deterioration.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 md:p-6" data-testid="faq-standard-sizes">
              <h3 className="font-semibold text-lg mb-2">Do you offer standard college diploma frame sizes?</h3>
              <p className="text-muted-foreground">
                Yes, our designer includes preset sizing for all standard diploma formats: US Letter (8.5×11 inches) for high
                school diplomas and general certificates, College/University format (11×14 inches) for Bachelor&apos;s and
                Master&apos;s degrees from most U.S. institutions, Professional License size (8×10 inches) for medical, legal,
                and trade board certifications, and international formats including A4 (8 1/4 × 11 3/4 inches) and A3 (11 3/4 × 16 1/2
                inches) for European and global universities.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 md:p-6" data-testid="faq-preservation">
              <h3 className="font-semibold text-lg mb-2">How should I preserve my certificate for decades?</h3>
              <p className="text-muted-foreground">
                Professional certificate preservation requires archival materials, UV-filtering glazing, climate-controlled display
                conditions, and proper mounting techniques that prevent document stress and chemical degradation. The foundation
                begins with archival mat board and backing materials that remain chemically neutral for centuries. UV-filtering
                acrylic glazing blocks 99% of ultraviolet light that causes ink fading and paper deterioration. Mounting should use
                corner pockets or photo corners, never permanent adhesives, allowing the document to expand naturally with
                humidity changes.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 md:p-6" data-testid="faq-mat-colors">
              <h3 className="font-semibold text-lg mb-2">What mat colors work best with professional documents?</h3>
              <p className="text-muted-foreground">
                Traditional mat colors for professional documents include off-white, cream, warm white, black, navy, and burgundy,
                selections that complement formal document design while providing visual separation without distracting from text
                content. Off-white and cream mats are the most versatile choices, offering subtle warmth that prevents stark
                contrast against aged parchment papers while maintaining professional formality. Black mats create dramatic contrast
                suitable for modern certificates, while navy blue complements university diplomas and burgundy adds richness for
                legal certifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="heading-final-cta">
              Ready to Frame Your Achievement?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Design your custom diploma frame with our interactive tool. Get instant pricing, real-time preview, and premium
              protection for your lifetime achievements.
            </p>
            <Button size="lg" onClick={scrollToDesigner} data-testid="button-start-designing" className="rounded-full">
              Start Designing Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
