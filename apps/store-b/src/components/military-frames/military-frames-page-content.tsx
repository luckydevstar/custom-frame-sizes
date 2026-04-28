"use client";

import { getStoreBaseAssetUrl } from "@framecraft/core";
import { Award, ArrowDown, Clock, CheckCircle, Shield } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback } from "react";

import { RelatedProducts } from "@/components/marketing/related-products";

import { militaryFaqJsonLd, militaryProductJsonLd } from "./military-frames-json-ld";

import { Badge } from "@framecraft/ui/components/ui/badge";
import { Button } from "@framecraft/ui/components/ui/button";
import { Card, CardContent } from "@framecraft/ui/components/ui/card";

import { MilitaryLifestyleCarousel } from "@framecraft/ui";

function storeAsset(relPath: string) {
  return getStoreBaseAssetUrl(relPath.replace(/^\//, ""));
}

const MilitaryFrameDesigner = dynamic(
  () => import("@framecraft/ui").then((m) => ({ default: m.MilitaryFrameDesigner })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[480px] flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading designer…</p>
        </div>
      </div>
    ),
  }
);

/** origina-store-b/client/src/pages/MilitaryFrames.tsx */
export function MilitaryFramesPageContent() {
  const scrollToDesigner = useCallback(() => {
    const designerSection = document.getElementById("military-designer");
    if (designerSection) {
      designerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(militaryProductJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(militaryFaqJsonLd) }} />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-background to-muted py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4" data-testid="badge-category">
                <Award className="w-3 h-3 mr-1" />
                A Tribute Built to Last
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Military Shadow Box Frames
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Years of service. Missions completed. Sacrifices made. A military shadow box isn&apos;t just a display,
                it&apos;s a tribute. Our handcrafted military shadow boxes are built to honor that service with the weight
                and dignity it deserves, giving medals, flags, patches, and insignia a permanent, respected place on your
                wall.
              </p>

              <Button size="lg" className="text-lg" onClick={scrollToDesigner} data-testid="button-design-now">
                <ArrowDown className="w-5 h-5 mr-2" />
                Design Your Frame
              </Button>
            </div>
          </div>
        </section>

        {/* Designer Section */}
        <section id="military-designer" className="py-8 scroll-mt-20">
          <MilitaryFrameDesigner embedded />
        </section>

        {/* Lifestyle Gallery Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">Real Military Display Examples</h2>
              <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
                See how veterans display their medals, ribbons, patches, flags, and photos in our handcrafted shadow
                boxes.
              </p>
              <MilitaryLifestyleCarousel />
            </div>
          </div>
        </section>

        {/* Trust & Quality Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Why Service Members Choose ShadowboxFrames.com
              </h2>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Flag-Ready Depth</h3>
                  <p className="text-muted-foreground">
                    Deep-profile shadow boxes built to hold a tri-folded American flag alongside medals, coins, and
                    insignia.
                  </p>
                </div>

                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Clock className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Medal Mounting</h3>
                  <p className="text-muted-foreground">
                    Pinnable, fabric-wrapped backing designed to hold heavy medals, ribbons, and challenge coins firmly in
                    place.
                  </p>
                </div>

                <div className="bg-card rounded-lg border p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Dignified Finishes</h3>
                  <p className="text-muted-foreground">
                    Rich wood tones and classic black finishes chosen to reflect the gravity and pride of military
                    service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Honoring Service, One Frame at a Time</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-6">
                  There&apos;s a tradition behind the military shadow box that goes back generations. When a service
                  member retires or transitions, their career is gathered together, the medals, the rank insignia, the unit
                  patches, the challenge coins, and displayed in a single, meaningful frame. It&apos;s a summary of a
                  life&apos;s work, and it deserves to be built with the same discipline and care that defined the
                  service itself. That&apos;s the standard we hold ourselves to with every military shadow box we build.
                </p>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Built for the Weight of the Moment</h3>
                <p className="text-muted-foreground mb-6">
                  Military items aren&apos;t light, literally or figuratively. Challenge coins are heavy. Folded flags are
                  thick. Medals have pins and ribbons that need to be mounted carefully. Our military shadow boxes are
                  engineered for all of this: deep enough for a tri-folded flag, sturdy enough to hold a full rack of
                  medals, and finished with the kind of quality that reflects the seriousness of what&apos;s inside.
                  These are frames built for weight, in every sense of the word.
                </p>

                <div className="my-8 rounded-lg overflow-hidden">
                  <img
                    src={storeAsset("frames/8446/lifestyle_1.jpg")}
                    alt="Military shadowbox displaying medals, ribbons, and patches with premium suede backing"
                    className="w-full h-auto"
                  />
                </div>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Tell the Full Story</h3>
                <p className="text-muted-foreground mb-6">
                  The best military shadow boxes don&apos;t just hold medals, they tell the story of a career. A brass
                  nameplate with rank, name, and years of service. A unit crest next to campaign ribbons. A photo from
                  deployment beside a folded flag. Our shadow boxes give you the depth and flexibility to arrange every
                  piece exactly how you want, creating a display that captures not just what was earned, but what it all
                  meant.
                </p>

                <div className="my-8 rounded-lg overflow-hidden">
                  <img
                    src={storeAsset("frames/8446/lifestyle_2.jpg")}
                    alt="Branch-specific military display with coordinated mat colors and service memorabilia"
                    className="w-full h-auto"
                  />
                </div>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Premium Suede Backing, Not Felt</h3>
                <p className="text-muted-foreground mb-6">
                  Instead of cardboard or cheap felt, the interior backing is display-grade suede in your branch color.
                  Suede grips pins securely so medals, ribbons, and insignia stay exactly where you place them, no adhesive,
                  no damage. The shadowbox depth fits full-size medals without pressing them against the acrylic.
                </p>

                <div className="my-8 rounded-lg overflow-hidden border shadow-sm">
                  <img
                    src={storeAsset("military/honor-display-features.png")}
                    alt="Military shadowbox features: premium suede backing, pinnable surface for medals ribbons and insignia with no adhesive needed, shadowbox depth for full-size medals, and complete honor display"
                    className="w-full h-auto"
                    loading="lazy"
                    data-testid="img-military-honor-features"
                  />
                </div>

                <div className="my-8 rounded-lg overflow-hidden">
                  <img
                    src={storeAsset("frames/8446/lifestyle_4.jpg")}
                    alt="Premium suede backing in military shadowbox frame with medals and ribbons"
                    className="w-full h-auto"
                  />
                </div>

                <Card className="my-8">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex-1">
                        <Badge className="mb-2">Our Deepest Frame</Badge>
                        <h3 className="text-lg font-bold mb-2" data-testid="text-military-ultra-deep-title">
                          Displaying Larger Items?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3" data-testid="text-military-ultra-deep-desc">
                          Our Ultra Deep frames offer 3.5 inches of depth, our deepest option by far. Perfect for helmets,
                          thick folded flags, stacked challenge coin displays, or any bulky military memorabilia.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" asChild data-testid="button-ultra-deep-black-military">
                            <Link href="/shadowbox/ultra-deep-black-shadow-box-frame">Ultra Deep Black</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild data-testid="button-ultra-deep-white-military">
                            <Link href="/shadowbox/ultra-deep-white-shadow-box-frame">Ultra Deep White</Link>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-end gap-1">
                        <div className="flex flex-col items-center">
                          <span className="text-[0.6rem] text-muted-foreground mb-1">Standard</span>
                          <div className="w-6 bg-muted-foreground/20 rounded-t" style={{ height: "16px" }} />
                          <span className="text-[0.55rem] text-muted-foreground mt-0.5">0.875&quot;</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[0.6rem] text-muted-foreground mb-1">Deep</span>
                          <div className="w-6 bg-muted-foreground/40 rounded-t" style={{ height: "32px" }} />
                          <span className="text-[0.55rem] text-muted-foreground mt-0.5">2&quot;</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[0.6rem] font-semibold text-primary mb-1">Ultra</span>
                          <div className="w-6 bg-primary rounded-t" style={{ height: "56px" }} />
                          <span className="text-[0.55rem] font-semibold text-primary mt-0.5">3.5&quot;</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Three Sizes for Different Displays</h3>
                <p className="text-muted-foreground mb-4">
                  Compact (11×14 inches) fits ribbons and small medal sets. Standard (16×20 inches) holds multiple
                  medals, ribbons, patches, and photos. Large (20×32 inches) fits folded flags, complete medal sets, and
                  large photo collections.
                </p>

                <div className="my-8 grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={storeAsset("frames/8446/lifestyle_5.jpg")}
                      alt="Compact military shadowbox with ribbons and medals"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={storeAsset("frames/8446/lifestyle_6.jpg")}
                      alt="Large military shadowbox displaying folded flag with medals and photos"
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Mounting Tips</h3>
                <p className="text-muted-foreground mb-6">
                  Pin medals directly through the suede backing. Avoid adhesives, they damage metal finishes and ribbon
                  fabric. Pins let you rearrange or remove items without harm. For photos, use acid-free corner mounts.
                </p>

                <div className="my-8 rounded-lg overflow-hidden">
                  <img
                    src={storeAsset("frames/8446/lifestyle_7.jpg")}
                    alt="Professional archival mounting of military medals and photos in shadowbox"
                    className="w-full h-auto"
                  />
                </div>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Keeping Your Display Looking Good</h3>
                <p className="text-muted-foreground mb-4">
                  Keep your shadowbox away from direct sun and damp areas. UV glass helps protect ribbons from fading.
                  Clean the glass once a year with a soft cloth.
                </p>

                <div className="my-8 rounded-lg overflow-hidden">
                  <img
                    src={storeAsset("frames/8446/lifestyle_8.jpg")}
                    alt="Well-maintained military shadowbox display with preserved medals and memorabilia"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Military-Inspired Mat Color Palettes */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Branch-Specific Color Options</h2>
              <p className="text-center text-muted-foreground mb-8">
                Each service branch has coordinating colors to match your medals and ribbons.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-3">Army</h3>
                  <p className="text-muted-foreground text-sm">Army Green, Black, and Gold colors match Army heritage.</p>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-3">Navy</h3>
                  <p className="text-muted-foreground text-sm">Navy Blue, Gold, and White colors for naval tradition.</p>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-3">Air Force</h3>
                  <p className="text-muted-foreground text-sm">Air Force Blue, Silver, and White for aviation service.</p>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-3">Marine Corps</h3>
                  <p className="text-muted-foreground text-sm">Scarlet, Gold, and Forest Green for Marine tradition.</p>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-3">Coast Guard</h3>
                  <p className="text-muted-foreground text-sm">Coast Guard Blue, White, and Orange for maritime service.</p>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-3">Space Force</h3>
                  <p className="text-muted-foreground text-sm">
                    Space Force Blue, Silver, and White for space operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <RelatedProducts
          productKeys={["jersey-frames", "signature-frames", "diploma-frames", "picture-frames"]}
          columns={4}
        />
      </div>
    </>
  );
}
