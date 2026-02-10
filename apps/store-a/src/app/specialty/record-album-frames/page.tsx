import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Sparkles, Shield, Package, Disc3, Award, CheckCircle2, AlertCircle } from "lucide-react";
import { RecordAlbumDesigner, Card, Button, Separator } from "@framecraft/ui";
import { getSharedAssetUrl, getRecordAlbumLifestyleImageUrl } from "@framecraft/core";
import { ScrollToDesignerButton } from "./scroll-button";
import { RecordAlbumLifestyleSection } from "./RecordAlbumLifestyleSection";
import type { GalleryImage } from "@framecraft/ui";

export const metadata: Metadata = {
  title:
    "Custom Record Album Frames | Vinyl LP Display | Professional Framing | Custom Frame Sizes",
  description:
    "Premium custom record album frames featuring 3 professional layouts for vinyl LP display. Professional-grade protection with framer's grade acrylic, archival matting, solid pine construction, and archival nylon mounting system.",
  openGraph: {
    title: "Custom Record Album Frames | Vinyl LP Display",
    description:
      "Professional custom framing for vinyl records and album covers. 3 specialized layouts with solid pine frames, framer's grade acrylic, archival matting, and archival mounting system.",
    type: "website",
  },
};

const CAROUSEL_INDICES = [1, 2, 3, 4, 5, 6, 7, 8];
const BREAKUP_INDICES = [9, 10, 11, 12];

const carouselImages: GalleryImage[] = CAROUSEL_INDICES.map((i) => ({
  url: getSharedAssetUrl(getRecordAlbumLifestyleImageUrl(i)),
  alt: `Custom record album frame displaying vinyl LP in professionally styled interior setting ${i}`,
  type: "lifestyle",
}));

const breakupUrls = BREAKUP_INDICES.map((i) =>
  getSharedAssetUrl(getRecordAlbumLifestyleImageUrl(i))
);

export default function RecordAlbumFramesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium">Preserve Your Vinyl</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            Custom Record Album Frames
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto">
            Display and protect vinyl LPs with custom shadowbox frames. Three specialized layouts
            for album covers, vinyl discs, and gatefold albums. Solid pine construction with UV
            protection, archival matting, and archival nylon mounting for reversible preservation.
          </p>
          <ScrollToDesignerButton />
        </div>
      </section>

      {/* Benefit Bar */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">UV Protection</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Prevents fading
              </p>
            </div>
            <div className="text-center">
              <Package className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Shadowbox Depth</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Fits vinyl thickness
              </p>
            </div>
            <div className="text-center">
              <Disc3 className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Multiple Layouts</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                3 display options
              </p>
            </div>
            <div className="text-center">
              <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Secure Mounting</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Nylon set screw
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="design-tool"
        className="pt-4 md:pt-6 pb-8 bg-background scroll-mt-20"
        data-testid="designer-section"
      >
        <div className="container mx-auto px-4">
          <Suspense
            fallback={
              <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading designer...</p>
              </div>
            }
          >
            <RecordAlbumDesigner layoutType="vinyl" />
          </Suspense>
        </div>
      </section>

      <Separator />

      {/* What's Included */}
      <section className="py-12 md:py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                What&apos;s Included with Every Record Album Frame
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional-grade components and archival materials for long-term vinyl
                preservation
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Solid Pine Wood Frame</h3>
                    <p className="text-muted-foreground">
                      Crafted from real, furniture-grade pine for lasting strength and a clean,
                      gallery-ready presentation. Premium wood construction provides superior
                      durability and structural integrity for vinyl record display.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Archival Backing Board</h3>
                    <p className="text-muted-foreground">
                      Protects your record and artwork from long-term discoloration or damage caused
                      by acidic materials. Professional-grade backing meets archival standards for
                      permanent preservation.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <Disc3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Archival Nesting Board with Nylon Mounting System
                    </h3>
                    <p className="text-muted-foreground">
                      Precision-cut slightly larger than a vinyl sleeve and LP, the nesting board
                      allows both to seat comfortably in the frame. Includes archival nylon LP
                      anchoring screw and nut—safe for your record&apos;s surface, eliminating the
                      need for tape or adhesives. Completely reversible mounting.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Precision-Cut Top Matting</h3>
                    <p className="text-muted-foreground">
                      Custom-cut for perfect alignment and a professional finish worthy of museum
                      display. Computer-controlled cutting ensures accurate circular openings for
                      vinyl records with ±0.1mm tolerance.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Framer&apos;s Grade Acrylic Glazing
                    </h3>
                    <p className="text-muted-foreground">
                      Crystal-clear acrylic protects your record and artwork while blocking 99% of
                      harmful UV radiation, preventing fading and deterioration. Shatterproof
                      alternative to glass blocks dust and handling wear without breakage risk.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Wall Hanging Hardware (Unattached)
                    </h3>
                    <p className="text-muted-foreground">
                      Professional-grade hanging hardware is included but left unattached—so
                      you&apos;re free to display your piece in any orientation that fits your space
                      and style. Rated for secure mounting of framed vinyl records.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Lifestyle carousel (client) */}
      <RecordAlbumLifestyleSection images={carouselImages} />

      <Separator />

      {/* Designer intro & expert content */}
      <section className="py-8 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Design Your Custom Record Album Frame
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose from three professional layout configurations, premium shadowbox frames, and
                professional-grade matting for gallery-worthy vinyl displays
              </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-6">
                Why Vinyl Records Require Specialized Framing
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Framing vinyl records and album covers presents unique challenges that standard
                picture frames cannot address. Professional record framing requires specialized
                knowledge of conservation techniques, material science, and structural engineering
                to safely display these musical artifacts while preserving their condition and
                value.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">
                Why Vinyl and Album Covers Need Protection
              </h3>
              <p>
                Vinyl records can warp when they get too hot. Keep them away from sunny windows and
                heat vents.
              </p>
              <p>
                Album covers turn yellow and become brittle over time. This happens faster when
                exposed to sunlight, dampness, or polluted air. Proper framing slows down this aging
                process.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">
                How UV Protection Prevents Fading
              </h3>
              <p>
                Sunlight contains invisible UV rays that fade colors and damage paper. Regular glass
                does not block these harmful rays.
              </p>
              <p>
                Our framer&apos;s grade acrylic stops 99% of damaging UV light. Your record covers
                stay bright and colorful for years to come. The protection is built into the acrylic
                and will last as long as the frame.
              </p>

              <div className="my-8 relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={breakupUrls[0]}
                  alt="Custom framed vinyl record album displayed in modern interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>

              <h3 className="text-2xl font-semibold mt-8 mb-4">
                Archival Materials Keep Your Records Safe
              </h3>
              <p>
                Cheap mat boards contain acids that cause brown stains over time. These marks can
                ruin album covers. Archival means the materials will not damage what they touch.
              </p>
              <p>
                We use cotton-based mat boards that pass strict industry tests. These are the same
                materials libraries use to store rare books and photos for decades.
              </p>

              <div className="bg-card border border-border rounded-lg p-6 my-8">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Professional Framing Standards</h4>
                    <p className="text-sm text-muted-foreground mb-0">
                      All materials used in our record frames meet professional framing standards
                      for long-term preservation of collectibles and memorabilia.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mt-8 mb-4">
                Built Strong to Stay on Your Wall
              </h3>
              <p>
                Framed vinyl records are heavier than photos. A complete frame can weigh over 5
                pounds. Cheap frames and weak hooks cannot hold this weight safely.
              </p>
              <p>
                Our frames have reinforced corners that will not pull apart. We include
                professional-grade hanging hardware rated for heavy loads. Your frame stays secure
                on the wall.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Extra Depth for Thick Records</h3>
              <p>
                Vinyl records are thicker than photos or posters. Regular picture frames are too
                shallow. The record would press against the glass and get damaged.
              </p>
              <p>
                Our shadowbox frames have extra depth. The record floats safely inside without
                touching the front or back of the frame.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Perfect Fit for Standard LPs</h3>
              <p>
                Album covers are 12.25 inches square. Records are 12 inches across. Each layout is
                sized to fit these standard measurements.
              </p>
              <p>
                We use computer-controlled cutting for precise round openings. The mat reveals your
                record label while hiding the blank outer edge. Every cut is exact.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">
                Mounting That Will Not Damage Your Records
              </h3>
              <p>
                Tape and glue can ruin records forever. Reversible mounting means you can remove
                your record without any damage.
              </p>
              <p>
                We secure records with nylon screws through the center hole. No sticky stuff touches
                your vinyl. You can take it out and play it anytime you want, then put it back in
                the frame.
              </p>

              <div className="my-8 relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={breakupUrls[1]}
                  alt="Professional vinyl record framing showcasing professional-grade materials"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Common Framing Mistakes to Avoid</h3>
              <div className="space-y-4 my-6">
                <Card className="bg-destructive/5 border-destructive/20">
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      Direct Contact with Glazing
                    </h4>
                    <p className="text-sm text-muted-foreground mb-0">
                      Vinyl records must never contact glazing directly. Temperature fluctuations
                      cause condensation on glass surfaces, creating moisture that can damage labels
                      and promote mold growth. Maintain minimum 3mm spacing using spacers or deep
                      rabbet frames.
                    </p>
                  </div>
                </Card>
                <Card className="bg-destructive/5 border-destructive/20">
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      Pressure-Sensitive Adhesives
                    </h4>
                    <p className="text-sm text-muted-foreground mb-0">
                      Duct tape, masking tape, and scotch tape contain synthetic adhesives that
                      yellow, embrittle, and stain over time. These adhesives are nearly impossible
                      to remove without damaging the record or cover. Use only archival mounting
                      methods.
                    </p>
                  </div>
                </Card>
                <Card className="bg-destructive/5 border-destructive/20">
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      Humidity and Temperature Extremes
                    </h4>
                    <p className="text-sm text-muted-foreground mb-0">
                      Display frames away from heating vents, radiators, and humid environments like
                      bathrooms and basements. Ideal conditions: 18-21°C (65-70°F) with 45-55%
                      relative humidity. Fluctuations exceeding ±10% RH cause dimensional changes in
                      paper and vinyl.
                    </p>
                  </div>
                </Card>
                <Card className="bg-destructive/5 border-destructive/20">
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      Inadequate Hanging Hardware
                    </h4>
                    <p className="text-sm text-muted-foreground mb-0">
                      Using undersized picture hooks or adhesive hangers risks catastrophic failure.
                      For frames over 3 pounds, use two-point hanging with wall anchors rated to 50+
                      pounds. Large horizontal formats require security hardware to prevent tilting
                      and rotation.
                    </p>
                  </div>
                </Card>
              </div>

              <div className="my-8 relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={breakupUrls[2]}
                  alt="Vinyl LP record frame installation in curated music collection"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>

              <h3 className="text-2xl font-semibold mt-8 mb-4">
                Layout Recommendations by Album Type
              </h3>
              <h4 className="text-xl font-semibold mt-6 mb-3">Single Album Display (Cover Only)</h4>
              <p>
                Ideal for iconic album artwork that stands alone as visual art: The Beatles&apos;
                Sgt. Pepper&apos;s, Pink Floyd&apos;s Dark Side of the Moon, or contemporary
                releases with elaborate cover designs. This configuration emphasizes the graphic
                design and photography without the visual weight of the vinyl record itself.
              </p>
              <h4 className="text-xl font-semibold mt-6 mb-3">Single Record with Cover</h4>
              <p>
                The most popular configuration for first pressings, colored vinyl variants, and
                albums with significant historical value. The dual-opening layout provides visual
                balance while showcasing both the cover art and the record label design.
                Particularly effective for labels with distinctive graphics: Motown, Blue Note jazz,
                or independent punk labels.
              </p>
              <h4 className="text-xl font-semibold mt-6 mb-3">
                Picture Disc Display (Record Only)
              </h4>
              <p>
                Picture discs require specialized handling due to their unique construction. Unlike
                standard black vinyl, picture discs sandwich printed images between thin vinyl
                layers, making them more susceptible to warping. Single-record display without the
                cover allows the picture disc artwork to be the focal point, ideal for limited
                edition releases and collectible variants.
              </p>
              <h4 className="text-xl font-semibold mt-6 mb-3">
                Gatefold Albums (Double with Cover)
              </h4>
              <p>
                Gatefold album packages, common in progressive rock and concept albums, often
                contain elaborate interior artwork and lyric sheets. The three-opening configuration
                accommodates the cover and both vinyl discs, creating an impressive 38-inch wide
                display suitable for large wall spaces and music rooms.
              </p>
              <h4 className="text-xl font-semibold mt-6 mb-3">Split Releases and Variant Sets</h4>
              <p>
                Split EP releases featuring two artists or color variant sets benefit from the
                double-record configuration without cover. This layout emphasizes the contrast
                between different colored vinyl pressings or showcases the dual-label aesthetic of
                split releases, popular in underground and independent music scenes.
              </p>

              <div className="my-8 relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={breakupUrls[3]}
                  alt="Custom record album frames enhancing home decor and music appreciation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>

              <p className="text-lg font-medium mt-8">
                Professional record album framing represents the intersection of preservation best
                practices, structural engineering, and aesthetic presentation. By adhering to
                professional framing standards and utilizing archival materials, we ensure your
                vinyl collection remains pristine for generations while creating stunning visual
                displays worthy of your musical treasures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Frame Your Vinyl Collection?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Design your custom record frame with our interactive configurator. Choose your layout,
            upload your album cover, and see real-time pricing.
          </p>
          <Button asChild size="lg" variant="secondary" data-testid="button-cta-design">
            <Link href="#design-tool" className="inline-flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Designing Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
