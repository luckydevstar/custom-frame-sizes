"use client";

import { Sparkles, Shield, Ruler, Layers, Award, Scissors, Maximize } from "lucide-react";
import { Button } from "@framecraft/ui";
import { Card, CardContent } from "@framecraft/ui";
import { NeedleworkFrameDesigner } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";

const SIZE_PRESETS = [
  { w: 8, h: 8, label: '8×8"' },
  { w: 8, h: 10, label: '8×10"' },
  { w: 11, h: 14, label: '11×14"' },
  { w: 12, h: 12, label: '12×12"' },
  { w: 16, h: 20, label: '16×20"' },
  { w: 18, h: 24, label: '18×24"' },
];

export function NeedleworkFramesContent() {
  const scrollToDesigner = () => {
    const el = document.getElementById("design-tool");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="hidden md:block container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Cross Stitch, Embroidery & More
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            data-testid="text-hero-title"
          >
            Needlework Frames
          </h1>
          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Frame your cross stitch, embroidery, or needlepoint. Handmade frames with archival
            materials and framer&apos;s grade acrylic to keep your work looking great.
          </p>
          <Button
            size="lg"
            onClick={scrollToDesigner}
            data-testid="button-design-frame"
            className="rounded-full"
          >
            Design Your Frame
          </Button>
        </div>
      </section>

      <section className="hidden md:block border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="benefit-acrylic">
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
                Any size needlework
              </p>
            </div>
            <div className="text-center" data-testid="benefit-quality">
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

      <section
        id="design-tool"
        className="scroll-mt-20 container mx-auto px-4 py-12 md:py-16"
        data-testid="designer-section"
      >
        <NeedleworkFrameDesigner />
      </section>

      <section className="py-12 md:py-16 bg-muted/20 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Professional Framing for Textile Art
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Quality materials and handmade craftsmanship to protect your needlework
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Framer&apos;s Grade Acrylic</h3>
                      <p className="text-muted-foreground">
                        Our acrylic glazing helps protect thread colors and fabric from light.
                        It&apos;s lighter and safer than glass, making it ideal for larger textile
                        pieces.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Scissors className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Archival Materials</h3>
                      <p className="text-muted-foreground">
                        Our matting and backing won&apos;t yellow or harm your fabric over time.
                        These materials keep your textile art looking fresh for years.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Ruler className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Size Presets</h3>
                      <p className="text-muted-foreground">
                        Popular sizes for cross stitch ready to select. Choose from 8×8&quot;,
                        8×10&quot;, 11×14&quot;, 12×12&quot;, 16×20&quot;, and 18×24&quot; to match
                        common patterns.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Maximize className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Custom Dimensions</h3>
                      <p className="text-muted-foreground">
                        Enter exact sizes for unique pieces. Whether it&apos;s a family sampler or
                        custom embroidery, we build frames to your exact specs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Popular Needlework Sizes</h2>
            <p className="text-muted-foreground mb-8">
              Quick-select common sizes for cross stitch and embroidery
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {SIZE_PRESETS.map((preset) => (
                <Card
                  key={`${preset.w}x${preset.h}`}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={scrollToDesigner}
                  data-testid={`preset-${preset.w}x${preset.h}`}
                >
                  <CardContent className="p-4 text-center">
                    <p className="text-lg font-semibold">{preset.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">inches</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/20 border-t" id="faq">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2" id="faq-sizes">
                    What sizes work best for cross stitch and embroidery?
                  </h3>
                  <p className="text-muted-foreground">
                    We offer preset sizes like 8×8&quot;, 8×10&quot;, 11×14&quot;, 12×12&quot;,
                    16×20&quot;, and 18×24&quot; that fit most patterns. You can also enter custom
                    sizes for unique pieces.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2" id="faq-acrylic">
                    What type of glazing protects needlework?
                  </h3>
                  <p className="text-muted-foreground">
                    We use framer&apos;s grade acrylic. It helps protect thread colors and fabric
                    from light damage. It&apos;s also lighter and safer than glass for larger
                    pieces.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2" id="faq-archival">
                    Why use archival materials for needlework framing?
                  </h3>
                  <p className="text-muted-foreground">
                    Archival matting and backing keep fabric from yellowing over time. These
                    materials don&apos;t harm textiles, so your needlework stays looking fresh for
                    years.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts
        productKeys={[
          "certificate-frames",
          "diploma-frames",
          "picture-frames",
          "wedding-invitation",
        ]}
        columns={4}
      />
    </div>
  );
}
