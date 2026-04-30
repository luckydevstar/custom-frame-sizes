"use client";

/** origina-store-b/client/src/pages/TicketFrames.tsx */
import { TicketStubFrameDesigner } from "@framecraft/ui";
import { Ticket, Shield, Grid3x3, Camera, Music, LayoutGrid } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@framecraft/ui/components/ui/button";

export function TicketFramesPageContent() {
  const scrollToDesigner = useCallback(() => {
    const designerElement = document.getElementById("design-tool");
    if (designerElement) {
      designerElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Ticket className="w-3 h-3" aria-hidden="true" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Ticket Stub Display Frames
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4" data-testid="text-hero-title">
            Ticket Stub Display Frames
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Custom frames for concert tickets, sports stubs, and event memorabilia. Single and multi-ticket layouts
            with acid-free matting.
          </p>

          <Button size="lg" onClick={scrollToDesigner} data-testid="button-design-frame" className="rounded-full">
            Design Your Frame
          </Button>
        </div>
      </section>

      {/* Benefit Bar */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="benefit-creative-layouts">
              <Grid3x3 className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" aria-hidden="true" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">6 Layout Options</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Single to 6-ticket grids
              </p>
            </div>

            <div className="text-center" data-testid="benefit-professional-grade">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" aria-hidden="true" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Professional Materials</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Framer&apos;s grade acrylic
              </p>
            </div>

            <div className="text-center" data-testid="benefit-photo-upload">
              <Camera className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" aria-hidden="true" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Photo Printing</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Upload concert photos
              </p>
            </div>

            <div className="text-center" data-testid="benefit-custom-sizing">
              <Music className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" aria-hidden="true" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">2&quot; × 5&quot; Tickets</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Standard ticket size
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Designer Embed */}
      <section className="container mx-auto px-4 pb-8 md:pb-12">
        <div id="design-tool" className="scroll-mt-20" data-testid="designer-section">
          <TicketStubFrameDesigner embedded />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" data-testid="heading-features">
            Built for ticket collectors
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border bg-card" data-testid="feature-creative-layouts">
              <Grid3x3 className="w-8 h-8 mb-3 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">6 Creative Layouts</h3>
              <p className="text-muted-foreground">
                Display 1 to 6 tickets in one frame. Pick layouts for concert trios, festival timelines, VIP
                passes, or pair tickets with posters and photos.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card" data-testid="feature-professional-materials">
              <Shield className="w-8 h-8 mb-3 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Professional-Grade Materials</h3>
              <p className="text-muted-foreground">
                Framer&apos;s grade acrylic blocks harmful light to prevent fading. Archival mats protect against
                yellowing for decades of display.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card" data-testid="feature-archival-protection">
              <LayoutGrid className="w-8 h-8 mb-3 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Archival Protection</h3>
              <p className="text-muted-foreground">
                Precision mat cutting gives perfect alignment and spacing. Corner pocket mounting holds tickets safely
                without adhesives.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card" data-testid="feature-ticket-sizing">
              <Music className="w-8 h-8 mb-3 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Standard 2&quot; × 5&quot; Tickets</h3>
              <p className="text-muted-foreground">
                Openings sized for 2&quot; × 5&quot; tickets, the most common size for concerts, sports, and events.
                All layouts fit standard mat board sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" data-testid="heading-use-cases">
            Suited to Every Collection
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border bg-card" data-testid="use-case-concert-collections">
              <h3 className="text-lg font-semibold mb-2">Concert Collections</h3>
              <p className="text-muted-foreground mb-3">
                Display your favorite artist&apos;s tour dates or festival lineups. Grid layouts hold up to 6 tickets for
                your best music memories.
              </p>
              <p className="text-sm text-muted-foreground">Recommended: 6-Ticket Grid or Trio Layout</p>
            </div>

            <div className="p-6 rounded-lg border bg-card" data-testid="use-case-sports-memorabilia">
              <h3 className="text-lg font-semibold mb-2">Sports Memorabilia</h3>
              <p className="text-muted-foreground mb-3">
                Frame playoff game tickets, World Series stubs, or season highlights. Combine tickets with game photos
                for championship memories that last a lifetime.
              </p>
              <p className="text-sm text-muted-foreground">Recommended: Photo Collection or VIP Experience</p>
            </div>

            <div className="p-6 rounded-lg border bg-card" data-testid="use-case-festival-timeline">
              <h3 className="text-lg font-semibold mb-2">Festival Timeline</h3>
              <p className="text-muted-foreground mb-3">
                Showcase multi-day festival tickets in chronological order. Ideal for Coachella, Bonnaroo, or any
                music festival experience you want to remember forever.
              </p>
              <p className="text-sm text-muted-foreground">
                Recommended: Festival Timeline (40×10&quot; horizontal)
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card" data-testid="use-case-vip-experience">
              <h3 className="text-lg font-semibold mb-2">VIP Experience Display</h3>
              <p className="text-muted-foreground mb-3">
                Preserve backstage passes, meet-and-greet photos, and premium tickets together. Dedicated layout
                combines VIP credentials with concert memories in one frame.
              </p>
              <p className="text-sm text-muted-foreground">Recommended: VIP Experience or Memorabilia Display</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" data-testid="heading-faq">
            Ticket display questions
          </h2>
          <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-card" data-testid="faq-ticket-size">
              <h3 className="text-lg font-semibold mb-2">What size tickets do these frames fit?</h3>
              <p className="text-muted-foreground">
                Our frames are sized for standard 2&quot; × 5&quot; tickets. This fits most concert tickets, sports stubs,
                and event passes. All openings are precision-cut for a clean look.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card" data-testid="faq-how-many-tickets">
              <h3 className="text-lg font-semibold mb-2">How many tickets can I frame together?</h3>
              <p className="text-muted-foreground">
                Our frames hold 1 to 6 tickets. Pick from 6 layouts: single ticket, pairs, trios, or grids up to 6 tickets.
                Some layouts pair tickets with photos or posters.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card" data-testid="faq-concert-posters">
              <h3 className="text-lg font-semibold mb-2">Can I include concert posters with my tickets?</h3>
              <p className="text-muted-foreground">
                Yes! Our combo layouts pair posters with ticket stubs in one frame. The Concert Poster + Tickets layout
                fits an 18×24&quot; poster with four tickets below. The Mini Poster + Tickets layout fits an 11×17&quot;
                poster with two tickets.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card" data-testid="faq-protect-from-fading">
              <h3 className="text-lg font-semibold mb-2">What materials protect tickets from fading?</h3>
              <p className="text-muted-foreground">
                We use framer&apos;s grade acrylic that blocks harmful light to stop fading. Archival mat boards prevent
                yellowing. Corner pocket mounting holds tickets safely without adhesives touching the print.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
