"use client";

/* eslint-disable react/no-unescaped-entities -- legacy copy from b-shadow-box-frames-original CertificateFrames.tsx */

import { Button } from "@framecraft/ui";
import { Award, Layers, Ruler, Shield, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback } from "react";

import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const CertificateFrameDesignerDynamic = dynamic(
  () => import("@framecraft/ui").then((m) => ({ default: m.CertificateFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center bg-background border rounded-lg">
        <p className="text-muted-foreground">Loading designer…</p>
      </div>
    ),
  },
);

/** b-shadow-box-frames-original/client/src/pages/CertificateFrames.tsx */
export function CertificateFramesPageContent() {
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
              Certificate Frames
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4" data-testid="text-hero-title">
            Custom Certificate Display Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Custom frames for certificates, awards, and credentials. Acid-free matting and all standard certificate sizes
            available.
          </p>

          <Button
            size="lg"
            onClick={scrollToDesigner}
            data-testid="button-design-certificate-frame"
            className="rounded-full"
          >
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

            <div className="text-center" data-testid="benefit-custom-sizing">
              <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Custom Sizing</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Any format or dimension
              </p>
            </div>

            <div className="text-center" data-testid="benefit-mat-options">
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
          <CertificateFrameDesignerDynamic />
        </div>
      </section>

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
                <h3 className="font-semibold text-lg mb-3">Government & Military</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Notary commissions and official appointments</li>
                  <li>• Government service awards</li>
                  <li>• Security clearance documents</li>
                  <li>• Military commendations and certificates</li>
                </ul>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">Enter any certificate size. We build frames to fit.</p>
          </div>
        </div>
      </section>

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
                  Office lights and sunlight fade ink over time. Framer&apos;s grade acrylic blocks 99% of harmful UV rays. Your
                  certificate looks new for decades.
                </p>
                <p className="text-sm text-muted-foreground">
                  We use archival mat board that won&apos;t damage paper. No yellowing or brown spots like cheap frames cause.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Professional Presentation
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  A framed license shows clients you take your profession seriously. It builds trust before you say a word.
                </p>
                <p className="text-sm text-muted-foreground">
                  Add a brass nameplate with your name, title, or the date you earned your credential. Makes a strong
                  impression in any office.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Common Questions</h2>

            <div className="space-y-6">
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold mb-2">What size frame do I need for my license?</h3>
                <p className="text-sm text-muted-foreground">
                  Most professional licenses are 8×10 inches. Enter your exact size in our designer. It calculates the frame
                  size you need based on your mat border choice.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold mb-2">My certificate is an odd size. Can you frame it?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. We build every frame to order. Enter any size down to a fraction of an inch. International A4 formats,
                  oversized awards, and custom documents all work.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold mb-2">Which frame color works best for offices?</h3>
                <p className="text-sm text-muted-foreground">
                  Black and dark wood frames look professional in most settings. They work well with white or cream mats.
                  Silver frames fit modern offices and medical facilities.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold mb-2">Should I use a single or double mat?</h3>
                <p className="text-sm text-muted-foreground">
                  Double mats add depth and a formal look. They work great for law offices, medical practices, and executive
                  spaces. Single mats are clean and simple for any setting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
