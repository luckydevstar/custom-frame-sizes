import type { Metadata } from "next";
import { Baby, Heart, Shield, Sparkles, Check, Frame, PenTool } from "lucide-react";
import { Card, SonogramFrameDesigner } from "@framecraft/ui";
import { ScrollToDesignerButton } from "./scroll-button";

export const metadata: Metadata = {
  title: "Sonogram Frames - Custom Ultrasound Picture Frames | CustomFrameSizes.com",
  description:
    "Frame your baby's first photo with custom sonogram frames. Display 1-3 ultrasound images with handwritten text. Great for pregnancy keepsakes and nursery decor.",
  keywords:
    "sonogram frame, ultrasound picture frame, baby ultrasound keepsake, pregnancy keepsake frame, baby first photo frame, ultrasound display frame, nursery wall art, baby announcement frame",
  openGraph: {
    title: "Sonogram Frames - Custom Ultrasound Picture Frames",
    description:
      "Frame your baby's first photo with custom sonogram frames. Display 1-3 ultrasound images with handwritten text. Great for pregnancy keepsakes.",
    type: "website",
    url: "/sonogram-frames",
  },
  alternates: { canonical: "/sonogram-frames" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What sizes of ultrasound prints do you frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'We offer preset sizes for the most common ultrasound print dimensions: 6×4", 5×3.5", 4×3", 6×4.5", and 3.5×2.5". These cover standard prints from most clinics and hospitals.',
      },
    },
    {
      "@type": "Question",
      name: "Can I add text to my sonogram frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Yes! Our pen tool lets you add handwritten-style text right on the mat. Pick preset messages like "1st Trimester" or add your own text—baby\'s name, due date, or a sweet note.',
      },
    },
    {
      "@type": "Question",
      name: "How do I protect thermal ultrasound prints?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ultrasound images are often printed on thermal paper that can fade. We recommend our non-glare framer's grade acrylic, which blocks harmful light and helps your print last longer.",
      },
    },
    {
      "@type": "Question",
      name: "Can I display multiple ultrasound images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Pick single, double, or triple layouts to show ultrasounds side by side. Great for showing your pregnancy journey across trimesters or for twin pregnancies.",
      },
    },
    {
      "@type": "Question",
      name: "What mat colors work best for sonograms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Light mats like white, cream, and soft pastels look great with black-and-white ultrasound images. If you use our pen tool, light mats are needed so the handwritten text shows up.",
      },
    },
  ],
};

export default function SonogramFramesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Baby className="w-4 h-4 text-primary" aria-hidden />
              <span className="text-sm font-medium text-primary">Baby Keepsake Frames</span>
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
              data-testid="heading-hero"
            >
              Sonogram &amp; Ultrasound Frames
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Keep your pregnancy journey safe in custom ultrasound frames. Add handwritten text
              like baby&apos;s name, trimester labels, or a sweet note.
            </p>
            <div className="flex justify-center mt-4">
              <ScrollToDesignerButton />
            </div>
          </div>
        </section>

        {/* KeyFeaturesBar - inline benefit strip */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center">
                <PenTool className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                  Handwritten Text
                </p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Baby name, due date
                </p>
              </div>
              <div className="text-center">
                <Heart className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">1-3 Images</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Single to triple layouts
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">UV Protection</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Non-glare acrylic
                </p>
              </div>
              <div className="text-center">
                <Frame className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Standard Sizes</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  6×4, 5×3.5, 4×3, more
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Designer */}
        <section
          id="designer"
          className="container mx-auto px-4 py-12 md:py-16 border-t scroll-mt-20"
          data-testid="designer-section"
        >
          <SonogramFrameDesigner embedded />
        </section>

        {/* Why Choose Our Sonogram Frames */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-why-choose">
                Why Choose Our Sonogram Frames
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Custom frames made to celebrate your pregnancy journey and baby milestones
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <PenTool className="w-6 h-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Handwritten Personalization</h3>
                    <p className="text-sm text-muted-foreground">
                      Add baby&apos;s name, trimester labels, or sweet messages in beautiful
                      handwritten-style fonts
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Heart className="w-6 h-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Multi-Image Layouts</h3>
                    <p className="text-sm text-muted-foreground">
                      Display 1, 2, or 3 ultrasound images side by side to show your pregnancy
                      journey
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                    <p className="text-sm text-muted-foreground">
                      Non-glare acrylic protects thermal paper prints from fading and yellowing
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Archival Mat Board</h3>
                    <p className="text-sm text-muted-foreground">
                      Professional-grade materials keep your precious memories safe for generations
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Check className="w-6 h-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Standard Ultrasound Sizes</h3>
                    <p className="text-sm text-muted-foreground">
                      Pre-configured for common ultrasound print sizes: 6×4, 5×3.5, 4×3, and more
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Frame className="w-6 h-6 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Beautiful Frame Options</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose from classic wood, modern metals, and nursery-friendly finishes
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Perfect For Section */}
        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8" data-testid="heading-perfect-for">
              Perfect For
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground mb-1">First Ultrasound Keepsake</p>
                    <p className="text-sm">
                      Frame your baby&apos;s first photo as a cherished reminder of when you first
                      saw your little one
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Trimester Journey Display</p>
                    <p className="text-sm">
                      Show how baby grew with 1st, 2nd, and 3rd trimester ultrasounds side by side
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Gender Reveal Memento</p>
                    <p className="text-sm">
                      Celebrate the special moment of learning if it&apos;s a boy or girl
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Nursery Wall Decor</p>
                    <p className="text-sm">
                      Add a personal touch to baby&apos;s room with beautifully framed ultrasound
                      art
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground mb-1">Baby Shower Gift</p>
                    <p className="text-sm">
                      Give expecting parents a meaningful keepsake they&apos;ll treasure forever
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Grandparent Gift</p>
                    <p className="text-sm">
                      Share the joy with grandparents-to-be with their grandchild&apos;s first photo
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Twin or Multiples</p>
                    <p className="text-sm">
                      Multi-opening layouts are perfect for displaying images of twins or multiples
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Pregnancy Announcement</p>
                    <p className="text-sm">
                      Create a beautiful announcement piece to share your exciting news
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              data-testid="heading-faq"
            >
              Sonogram Framing Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  What sizes of ultrasound prints do you frame?
                </h3>
                <p className="text-muted-foreground">
                  We offer preset sizes for the most common ultrasound print dimensions: 6×4&quot;,
                  5×3.5&quot;, 4×3&quot;, 6×4.5&quot;, and 3.5×2.5&quot;. These cover standard
                  prints from most clinics and hospitals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I add text to my sonogram frame?</h3>
                <p className="text-muted-foreground">
                  Yes! Our pen tool lets you add handwritten-style text right on the mat. Pick
                  preset messages like &quot;1st Trimester&quot; or add your own text—baby&apos;s
                  name, due date, or a sweet note.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  How do I protect thermal ultrasound prints?
                </h3>
                <p className="text-muted-foreground">
                  Ultrasound images are often printed on thermal paper that can fade. We recommend
                  our non-glare framer&apos;s grade acrylic, which blocks harmful light and helps
                  your print last longer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Can I display multiple ultrasound images?
                </h3>
                <p className="text-muted-foreground">
                  Yes! Pick single, double, or triple layouts to show ultrasounds side by side.
                  Great for showing your pregnancy journey across trimesters or for twin
                  pregnancies.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  What mat colors work best for sonograms?
                </h3>
                <p className="text-muted-foreground">
                  Light mats like white, cream, and soft pastels look great with black-and-white
                  ultrasound images. If you use our pen tool, light mats are needed so the
                  handwritten text shows up.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
