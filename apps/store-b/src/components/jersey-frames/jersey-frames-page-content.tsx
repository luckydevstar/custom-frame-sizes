"use client";

import { getStoreBaseAssetUrl } from "@framecraft/core";
import {
  ArrowDown,
  Award,
  CheckCircle,
  Layers,
  Ruler,
  Shield,
  Shirt,
} from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

import { RelatedProducts } from "@/components/marketing/related-products";
import { JerseyFrameDesigner, JerseyLifestyleCarousel } from "@framecraft/ui";
import { Badge } from "@framecraft/ui/components/ui/badge";
import { Button } from "@framecraft/ui/components/ui/button";
import { Card, CardContent } from "@framecraft/ui/components/ui/card";

import { jerseyFaqJsonLd, jerseyProductJsonLd } from "./jersey-frames-json-ld";

function storeAsset(relPath: string) {
  return getStoreBaseAssetUrl(relPath.replace(/^\//, ""));
}

/** origina-store-b/client/src/pages/JerseyFrames.tsx */
export function JerseyFramesPageContent() {
  const scrollToDesigner = useCallback(() => {
    const designerSection = document.getElementById("jersey-designer");
    if (designerSection) {
      designerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jerseyProductJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jerseyFaqJsonLd) }} />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
              <Shirt className="w-3 h-3" />
              <span className="text-xs font-medium" data-testid="text-badge">
                Give Your Jersey the Display It Earned
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4" data-testid="text-hero-title">
              Custom Jersey Shadow Box Frames
            </h1>

            <p
              className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
              data-testid="text-hero-subtitle"
            >
              That jersey isn&apos;t just fabric and stitching. It&apos;s the roar of the crowd, the last-second play, the autograph you waited two hours for. Our jersey shadow boxes come with a professional mounting kit included,
              stiffener board, pre-threaded sewing needles, and everything you need to get pro results at home.
            </p>

            <Button size="lg" onClick={scrollToDesigner} data-testid="button-design-now" className="rounded-full">
              Design Your Frame
            </Button>
          </div>
        </section>

        {/* Benefit Bar */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
              <div className="text-center" data-testid="benefit-uv-glazing">
                <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Jersey-Ready Depth</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Deep Frames with 2-3 Inch Interior
                </p>
              </div>

              <div className="text-center" data-testid="benefit-custom-sizing">
                <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Pinnable Backing</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Position Your Jersey Exactly Right
                </p>
              </div>

              <div className="text-center" data-testid="benefit-mat-options">
                <Layers className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Large Format Sizes</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Show the Full Name and Number
                </p>
              </div>

              <div className="text-center" data-testid="benefit-handcrafted">
                <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
                <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Easy-Open Design</p>
                <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                  Arrange and Rearrange with Ease
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Designer Section */}
        <section id="jersey-designer" className="container mx-auto px-4 pb-8 md:pb-12">
          <div className="scroll-mt-20" data-testid="designer-section">
            <JerseyFrameDesigner embedded />
          </div>
        </section>

        {/* Lifestyle Gallery Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Jersey Frame Gallery</h2>
              <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
                See how collectors display NHL, NBA, MLB, and NFL jerseys in our handcrafted shadow boxes.
              </p>
              <JerseyLifestyleCarousel />
            </div>
          </div>
        </section>

        {/* Full-Width Lifestyle Image */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-lg border bg-card overflow-hidden" data-testid="jersey-lifestyle-feature-1">
                <div className="aspect-[3/2] md:aspect-[3/2] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={storeAsset("frames/10728/10728_jersey_lifestyle_04.jpg")}
                    alt="Autographed Dallas Cowboys jersey frame in extra deep white shadowbox with 2 inch capacity, displaying signed #8 AIKMAN NFL jersey with navy and silver triple matting in elegant living room"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-white text-lg md:text-xl font-semibold max-w-3xl">
                      Custom team color mats make your signed jerseys and championship gear look amazing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Jersey Framing Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Every Jersey Has a Story</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-6">
                  Maybe it&apos;s the jersey your kid wore in their championship game. Maybe it&apos;s a signed piece from your all-time favorite player. Maybe it&apos;s the shirt you wore when your team finally won it all.
                  Whatever the story, that jersey deserves more than a hanger in a closet. Our jersey shadow boxes are built specifically for this, deep enough to hold a properly folded jersey, wide enough to show the name and number, and finished with the kind of quality that makes the whole display feel like the real deal.
                </p>

                <h3 className="text-2xl font-semibold mb-4 mt-8">More Than a Frame, A Complete Mounting Solution</h3>
                <p className="text-muted-foreground mb-4">
                  Most jersey frames ship empty and leave you to figure out the rest. Ours come with everything you need to mount your jersey like a pro, no trips to a frame shop, no guessing.
                </p>
                <p className="text-muted-foreground mb-4">
                  Every frame includes an extra mat board sheet that works as a stiffener for your jersey. Lay your jersey on it, trace the outline, cut it out, and slide the stiffener inside. That gives your jersey a clean, structured shape on the wall,
                  no sagging, no bunching.
                </p>
                <p className="text-muted-foreground mb-6">
                  Then use the included pre-threaded sewing kit to tack your stiffened jersey to the backing board. A few simple stitches is all it takes. The kit comes with needles already threaded and a thimble, so even if you&apos;ve never sewn anything in
                  your life, you&apos;ll have it done in minutes.
                </p>

                <div className="not-prose mb-8">
                  <div className="rounded-lg overflow-hidden border shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={storeAsset("jersey/mounting-kit-steps.png")}
                      alt="Professional jersey mounting kit steps: mounting kit with mat board insert and pre-threaded needles, tracing your jersey outline, cutting along the traced line, stitching jersey to backing board, and finished framed jersey display"
                      className="w-full h-auto"
                      loading="lazy"
                      data-testid="img-jersey-mounting-steps"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Built for the Way Jerseys Are Displayed</h3>
                <p className="text-muted-foreground mb-6">
                  A jersey display has unique needs. The frame needs depth, usually 2 to 3 inches, to hold the folded fabric without crushing it. The backing needs to be pin-friendly so you can position the jersey exactly how you want. And the whole thing needs
                  to open easily, because you&apos;ll probably adjust the layout a few times before it&apos;s perfect. We&apos;ve thought through all of this. Our jersey shadow boxes are built around how people actually display jerseys, not as an afterthought.
                </p>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Add the Details That Matter</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6 not-prose" data-testid="jersey-lifestyle-feature-2">
                  <div className="rounded-lg border bg-card overflow-hidden">
                    <div className="aspect-[4/5] relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={storeAsset("frames/10727/10727_jersey_lifestyle_11.jpg")}
                        alt="Deep matte black jersey display frame with navy blue and red team color triple matting showcasing autographed baseball jersey with certificate of authenticity in minimalist living room"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-xl font-semibold mb-4">Triple Mat Benefits</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Pick your top mat, bottom mat, and backing color</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>165+ team colors plus black and white options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Archival mats keep colors bright for years</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  A jersey shadow box is at its best when it tells the full story. Pin a ticket stub next to the jersey. Add a photo from game day. Include a team patch or a small nameplate with the date and occasion. Our shadow boxes give you the space
                  and the flexibility to build a display that&apos;s truly yours, not just a framed shirt, but a complete memory.
                </p>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Protection From Fading</h3>
                <p className="text-muted-foreground mb-6">
                  Sunlight fades jersey colors over time. Our frames use framer&apos;s grade acrylic that blocks 99% of UV rays. This keeps your jersey looking bright for years. The 2-inch depth also keeps the fabric away from the acrylic surface.
                </p>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Add a Brass Plaque</h3>
                <p className="text-muted-foreground mb-6">
                  Add a brass plaque with custom text. Great for player names, jersey numbers, game dates, or special messages. Plaques are mounted on the mat so they don&apos;t cover your jersey.
                </p>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Standard and Oversize Frames</h3>
                <p className="text-muted-foreground mb-6">
                  Standard frames fit most jerseys up to 32x40 inches. Larger jerseys or wider mat borders need oversize frames. Our designer shows you the price for your exact size.
                </p>

                <h3 className="text-2xl font-semibold mb-4 mt-8">What Can You Frame?</h3>
                <p className="text-muted-foreground mb-6">
                  Our frames work for sports jerseys (NHL, NBA, MLB, NFL), concert tour jerseys, high school and college jerseys, and personal memorabilia. Add a brass plaque to mark special dates or achievements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ultra Deep Cross-Sell */}
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1">
                      <Badge className="mb-2">Our Deepest Frame</Badge>
                      <h3 className="text-lg font-bold mb-2" data-testid="text-jersey-ultra-deep-title">
                        Need Extra Room for Thick Jerseys?
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3" data-testid="text-jersey-ultra-deep-desc">
                        Our Ultra Deep frames offer 3.5 inches of depth, our deepest option by far. Perfect for heavy game-worn jerseys, layered displays with equipment, or stacking a jersey with photos and a nameplate at different planes.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" asChild data-testid="button-ultra-deep-black-jersey">
                          <Link href="/shadowbox/ultra-deep-black-shadow-box-frame">Ultra Deep Black</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild data-testid="button-ultra-deep-white-jersey">
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
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Questions we hear most</h2>

              <div className="space-y-6">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-3">How should I fold my jersey for a shadow box?</h3>
                  <p className="text-muted-foreground">
                    Most people fold the jersey so the name and number on the back are visible, with the sleeves tucked behind. Some prefer to show the front with the logo and crest. There&apos;s no wrong answer, it depends on what part of the jersey matters
                    most to you. Our pinnable backing makes it easy to try different layouts.
                  </p>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-3">Will a shadow box protect a signed jersey?</h3>
                  <p className="text-muted-foreground">
                    Yes. Once enclosed in a shadow box with UV-protective glazing, your signed jersey is shielded from dust, handling, and the UV light that can cause ink and fabric to fade over time. It&apos;s one of the best ways to preserve an autographed jersey.
                  </p>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-3">Can I add other items alongside the jersey?</h3>
                  <p className="text-muted-foreground">
                    Absolutely, and we encourage it. Ticket stubs, event photos, team patches, trading cards, and small nameplates all work beautifully alongside a jersey. The extra context turns a framed jersey into a complete story.
                  </p>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-3">What size shadow box do I need for a jersey?</h3>
                  <p className="text-muted-foreground">
                    For most adult jerseys, a 32&quot; x 40&quot; or 34&quot; x 42&quot; shadow box works well. Youth jerseys can often fit in a 28&quot; x 34&quot; frame. The right size depends on how you fold the jersey and whether you&apos;re including additional items in the
                    display.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Design Your Jersey Shadow Box?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Give your jersey the display it earned. Design your custom jersey shadow box and see instant pricing.
              </p>
              <Button size="lg" className="text-lg" onClick={scrollToDesigner} data-testid="button-design-cta-final">
                <ArrowDown className="w-5 h-5 mr-2" />
                Start Designing Now
              </Button>
            </div>
          </div>
        </section>

        <RelatedProducts productKeys={["signature-frames", "ticket-frames", "comic-frames", "picture-frames"]} columns={4} />
      </div>
    </>
  );
}
