"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  CheckCircle2,
  Music,
  Award,
  Package,
  Shield,
  AlertCircle,
  Disc3,
} from "lucide-react";
import { Button, Card, CardContent, Separator } from "@framecraft/ui";
import { getCDLifestyleImageUrl } from "@framecraft/core";
import { ScrollToDesignerButton } from "./scroll-button";
import { CdFrameDesignerSection } from "./cd-frame-designer-section";

// Deterministic breakup photos so server and client render the same (avoids hydration mismatch)
const BREAKUP_PHOTOS = [
  getCDLifestyleImageUrl(1),
  getCDLifestyleImageUrl(2),
  getCDLifestyleImageUrl(3),
  getCDLifestyleImageUrl(4),
];

export function CdFramesContent() {
  const breakupPhotos = BREAKUP_PHOTOS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Preserve Your Music
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            data-testid="text-hero-title"
          >
            Custom CD Frames
          </h1>
          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Show off your favorite CDs on any wall. Choose from different layouts for CD cases and
            discs. Each frame is built to last and keeps your collection safe from sunlight and
            dust.
          </p>
          <ScrollToDesignerButton />
        </div>
      </section>

      {/* Benefit Bar */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="benefit-handcrafted">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Handcrafted</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Skilled artisans
              </p>
            </div>
            <div className="text-center" data-testid="benefit-precision-fit">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Precision Fit</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                4.75&quot; standard CDs
              </p>
            </div>
            <div className="text-center" data-testid="benefit-multiple-layouts">
              <Music className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Multiple Layouts</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                3 Display Options
              </p>
            </div>
            <div className="text-center" data-testid="benefit-archive-quality">
              <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Archive Quality</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Archival materials
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Designer */}
      <CdFrameDesignerSection />

      <Separator />

      {/* What's Included */}
      <section className="py-12 md:py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                What&apos;s Included with Every CD Frame
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to display and protect your CDs for years to come
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Solid Pine Wood Frame</h3>
                      <p className="text-muted-foreground">
                        Made from real pine wood, just like furniture. Strong and sturdy. Looks
                        great on any wall and lasts for years.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Archival Backing Board</h3>
                      <p className="text-muted-foreground">
                        Special backing that won&apos;t turn your CD artwork yellow over time. Keeps
                        colors bright and paper safe for many years.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Disc3 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Secure Mounting System</h3>
                      <p className="text-muted-foreground">
                        No sticky tape or glue needed. Special clips hold your CDs safely in place.
                        You can take them out anytime without damage.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Precision-Cut Matting</h3>
                      <p className="text-muted-foreground">
                        Each mat opening is cut to fit your CDs exactly. Clean edges and perfect
                        circles make your display look professional.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Framer&apos;s Grade Acrylic Front
                      </h3>
                      <p className="text-muted-foreground">
                        Crystal-clear front that blocks harmful sunlight. Your CD artwork won&apos;t
                        fade over time. Safer than glass because it won&apos;t shatter if bumped.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Wall Hanging Hardware</h3>
                      <p className="text-muted-foreground">
                        Strong hangers included with every frame. We leave them unattached so you
                        can hang your frame any direction you like. Holds your CD frame safely on
                        any wall.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Designer Introduction & Expert Content */}
      <section className="py-8 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Design Your CD Frame</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Pick your layout, frame style, and mat colors. See your design come together in real
                time.
              </p>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-6">Why CDs Need Special Frames</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Regular picture frames don&apos;t work well for CDs. CDs stick out more than flat
                art. They also need protection from sunlight and humidity. Our frames are built just
                for CDs.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Protecting Your CDs</h3>
              <p>
                CDs are tough, but sunlight and heat can damage them over time. The printed artwork
                on CD cases can fade too. Our frames keep your CDs safe from these problems.
              </p>
              <p>
                The paper inserts in CD cases need extra care. Sunlight makes ink fade. Damp air can
                make paper bend. Good framing blocks these problems and keeps everything looking
                great.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Sun Protection</h3>
              <p>
                Sunlight fades colors over time. Regular glass lets most of the sun&apos;s harmful
                rays through. That&apos;s bad for your CD artwork.
              </p>
              <p>
                Our clear front blocks almost all harmful sun rays. Your CDs stay protected while
                still looking clear. This protection lasts forever.
              </p>

              <div className="my-8 rounded-lg overflow-hidden relative aspect-[4/3] w-full">
                <Image
                  src={breakupPhotos[0]}
                  alt="Framed CD album with jewel case and disc mounted on living room wall near music collection"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Archival Matting</h3>
              <p>
                Cheap mat board can damage your CDs over time. The acids in regular mat board leave
                yellow marks on artwork. We use archival mat board that won&apos;t harm your
                collection.
              </p>
              <p>
                Our mat boards are made from cotton with no harmful chemicals. They&apos;re safe for
                your CDs and keep them looking great.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Built to Last</h3>
              <p>
                CDs are lightweight, so the finished frame is easy to hang. We include professional
                hanging hardware with every frame. It&apos;s rated for secure, long-term display.
              </p>
              <p>
                Our frames have reinforced corners for extra strength. The hanging hardware attaches
                firmly to the frame sides. Your CD frame will hang securely on any wall.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Shadowbox Depth</h3>
              <p>
                Regular picture frames are too shallow for CDs. CD cases are about half an inch
                thick. You need a frame with enough depth to hold everything safely.
              </p>
              <p>
                Our shadowbox frames have plenty of room inside. The CD never touches the front.
                This prevents scratches and keeps your disc in perfect shape.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Perfect Cuts Every Time</h3>
              <p>
                CD cases are 4.75 inches square. The discs are 4.75 inches wide with a hole in the
                middle. Cutting perfect circles in mat board is hard to do by hand.
              </p>
              <p>
                We use special cutting machines for perfect results. Every opening is cut to fit
                exactly. Your CD looks great every time.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Safe Mounting</h3>
              <p>
                We never use permanent glue or tape on your CDs. Everything can be removed safely if
                you ever want your disc back. This is the same approach museums use for valuable
                items.
              </p>
              <p>
                Your CDs stay in place without sticky tape touching them. We use special clips that
                hold everything safely. If you ever want your disc back, it comes out easily with no
                damage.
              </p>

              <div className="my-8 rounded-lg overflow-hidden relative aspect-[4/3] w-full">
                <Image
                  src={breakupPhotos[1]}
                  alt="Close-up of custom CD frame showing archival mat board and framer's grade acrylic glazing"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Framing Mistakes to Avoid</h3>
              <div className="space-y-4 my-6">
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      Touching the Glass
                    </h4>
                    <p className="text-sm text-muted-foreground mb-0">
                      CDs should never touch the front glass. When temperatures change, water drops
                      can form on glass. This moisture can damage your CD artwork. Our shadowbox
                      frames keep your disc away from the glass.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      Using Tape or Glue
                    </h4>
                    <p className="text-sm text-muted-foreground mb-0">
                      Regular tape and glue turn yellow over time. They also become sticky and hard
                      to remove. Tape can leave permanent marks on your CD case. We use special
                      mounting clips instead.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      Hot or Damp Places
                    </h4>
                    <p className="text-sm text-muted-foreground mb-0">
                      Keep your framed CDs away from heaters and damp rooms. Bathrooms and basements
                      can cause damage. Choose a wall with steady room temperature for best results.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      Weak Hangers
                    </h4>
                    <p className="text-sm text-muted-foreground mb-0">
                      Small hooks and sticky hangers can fail over time. Your frame could fall off
                      the wall. We include strong hanging hardware that holds your CD frame safely
                      in place.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="my-8 rounded-lg overflow-hidden relative aspect-[4/3] w-full">
                <Image
                  src={breakupPhotos[2]}
                  alt="Multiple CD frames arranged on music room wall showing artist collection display"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Which Layout Should You Choose?</h3>
              <h4 className="text-xl font-semibold mt-6 mb-3">Case Only</h4>
              <p>
                Great for albums with amazing cover art. The CD case becomes the star of the show.
                Pick this when you love the front cover design.
              </p>
              <h4 className="text-xl font-semibold mt-6 mb-3">CD with Case</h4>
              <p>
                Our most popular choice. You see both the cover art and the disc together. Perfect
                for signed CDs, first editions, or special releases.
              </p>
              <h4 className="text-xl font-semibold mt-6 mb-3">Disc Only</h4>
              <p>
                Some CDs have beautiful disc artwork. This layout lets the disc be the focus. Great
                for picture discs and collector editions with special disc printing.
              </p>
              <h4 className="text-xl font-semibold mt-6 mb-3">Multi-Disc Sets</h4>
              <p>
                Box sets and special editions often have more than one disc. This layout shows the
                case plus all the discs at once. Great for complete album experiences.
              </p>
              <h4 className="text-xl font-semibold mt-6 mb-3">Artist Collections</h4>
              <p>
                Frame several CDs from the same artist or music style. They look great together on
                your wall. Perfect for showing off your favorite bands.
              </p>

              <div className="my-8 rounded-lg overflow-hidden relative aspect-[4/3] w-full">
                <Image
                  src={breakupPhotos[3]}
                  alt="CD frame with shadowbox depth displaying both jewel case artwork and disc in home office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>

              <p className="text-lg font-medium mt-8">
                Good CD framing protects your music collection for years to come. We use the same
                safe materials that museums use. Your CDs stay protected while looking great on any
                wall.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Frame Your CD Collection?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Pick your layout, choose your frame style, and see your price right away. It only takes
            a few minutes to design a frame you&apos;ll love.
          </p>
          <Button asChild size="lg" variant="secondary" data-testid="button-cta-design">
            <Link href="/designer">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Designing Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
