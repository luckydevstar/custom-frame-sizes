"use client";

import { Film, Sparkles } from "lucide-react";
import { Button } from "@framecraft/ui";
import { MoviePosterFrameDesigner } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";

export function MoviePosterFramesContent() {
  const scrollToDesigner = () => {
    const el = document.getElementById("design-tool");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border mb-3">
            <Film className="w-3 h-3" />
            <span className="text-xs font-medium" data-testid="text-badge">
              Professional Movie Poster Framing
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            data-testid="heading-movie-poster-frames"
          >
            Custom Onesheet Movie Poster Frames
          </h1>
          <p
            className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Frame your favorite movie posters with professional-grade custom frames. All standard
            onesheet poster sizes with archival matting and framer&apos;s grade acrylic glazing.
          </p>
          <Button
            onClick={scrollToDesigner}
            size="lg"
            className="gap-2 rounded-full"
            data-testid="button-design-your-frame"
          >
            Design Your Frame
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section
        id="design-tool"
        className="scroll-mt-20 container mx-auto px-4 py-12 md:py-16"
        data-testid="designer-section"
      >
        <MoviePosterFrameDesigner />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">About Onesheet Movie Poster Framing</h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="leading-relaxed">
              Onesheet movie posters are the most common size for theatrical posters in the United
              States. The standard US Onesheet measures 27&quot; × 40&quot; and has been the
              industry standard since the 1980s. Earlier vintage onesheet posters measured 27&quot;
              × 41&quot; and are still found in many collections.
            </p>
            <h3 className="text-lg font-medium text-foreground">Popular Onesheet Poster Sizes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg" data-testid="info-card-us-standard">
                <h4 className="font-medium text-foreground">
                  US Onesheet - Standard (27×40&quot;)
                </h4>
                <p className="text-sm mt-1">
                  The current standard for American theatrical movie posters since the 1980s.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg" data-testid="info-card-us-vintage">
                <h4 className="font-medium text-foreground">US Onesheet - Vintage (27×41&quot;)</h4>
                <p className="text-sm mt-1">
                  Classic pre-1985 American movie posters with the extra inch of height.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg" data-testid="info-card-british-quad">
                <h4 className="font-medium text-foreground">British Quad (27×39&quot;)</h4>
                <p className="text-sm mt-1">
                  Landscape format posters popular in the UK cinema market.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg" data-testid="info-card-half-sheet">
                <h4 className="font-medium text-foreground">Half Sheet (22×28&quot;)</h4>
                <p className="text-sm mt-1">
                  Smaller format posters, often used for lobby displays.
                </p>
              </div>
            </div>
            <h3 className="text-lg font-medium text-foreground mt-6">
              Professional-Grade Framing Materials
            </h3>
            <p className="leading-relaxed">
              Every onesheet poster frame includes archival mat board that protects your poster from
              damage over time. Our framer&apos;s grade acrylic glazing provides clear visibility
              while shielding your poster from light exposure. All frames are hand-assembled by
              professional framers.
            </p>
            <h3 className="text-lg font-medium text-foreground mt-6">Brass Nameplate Option</h3>
            <p className="leading-relaxed">
              Add a custom engraved brass nameplate to your movie poster frame for a professional
              gallery look. Include the film title, year, director, or any text you choose.
              Nameplates are mounted on the mat board below the poster opening.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Why Frame Your Movie Posters?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-background rounded-lg border" data-testid="info-card-protect">
              <h3 className="font-medium mb-2">Protect Your Collection</h3>
              <p className="text-sm text-muted-foreground">
                Posters fade and tear over time. A good frame keeps them safe from dust, moisture,
                and light damage. Your collection stays in great shape for years.
              </p>
            </div>
            <div className="p-5 bg-background rounded-lg border" data-testid="info-card-display">
              <h3 className="font-medium mb-2">Display With Style</h3>
              <p className="text-sm text-muted-foreground">
                A framed poster looks much better than a rolled one. It becomes real wall art that
                shows off your love of film.
              </p>
            </div>
            <div className="p-5 bg-background rounded-lg border" data-testid="info-card-value">
              <h3 className="font-medium mb-2">Preserve Value</h3>
              <p className="text-sm text-muted-foreground">
                Original movie posters can be valuable. Proper framing with archival materials helps
                maintain their condition and worth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Where to Display Movie Poster Frames</h2>
          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              Movie poster frames work great in many rooms. Here are some popular spots:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-foreground">Home Theater</strong> – Create a real cinema
                feel with framed posters on the walls.
              </li>
              <li>
                <strong className="text-foreground">Game Room</strong> – Mix movie posters with
                other wall art for a fun space.
              </li>
              <li>
                <strong className="text-foreground">Office</strong> – Add personality to your
                workspace with your favorite films.
              </li>
              <li>
                <strong className="text-foreground">Hallway Gallery</strong> – Line up several
                posters for a dramatic gallery wall.
              </li>
              <li>
                <strong className="text-foreground">Bedroom</strong> – Show off films that mean
                something to you.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 border-t bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Common Questions</h2>
          <div className="space-y-6">
            <div data-testid="faq-item-size">
              <h3 className="font-medium mb-2">What size frame do I need for a movie poster?</h3>
              <p className="text-sm text-muted-foreground">
                Most modern movie posters are 27&quot; × 40&quot; (US Onesheet). Older posters from
                before 1985 are usually 27&quot; × 41&quot;. We have preset sizes for both, plus
                custom sizing for any other dimensions.
              </p>
            </div>
            <div data-testid="faq-item-rolled">
              <h3 className="font-medium mb-2">Can I frame a rolled poster?</h3>
              <p className="text-sm text-muted-foreground">
                Yes. Rolled posters work fine in our frames. The frame backing and glazing help keep
                the poster flat over time.
              </p>
            </div>
            <div data-testid="faq-item-matting">
              <h3 className="font-medium mb-2">Should I add matting to my movie poster frame?</h3>
              <p className="text-sm text-muted-foreground">
                Matting is optional. Some collectors prefer a clean look without matting. Others
                like the added border that matting provides. Either way looks great.
              </p>
            </div>
            <div data-testid="faq-item-glass">
              <h3 className="font-medium mb-2">Why use acrylic instead of glass?</h3>
              <p className="text-sm text-muted-foreground">
                At large sizes like 27&quot; × 40&quot;, glass gets very heavy and can break.
                Framer&apos;s grade acrylic is lighter, safer, and just as clear. It also offers
                better protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts
        productKeys={["comic-frames", "playbill-frames", "picture-frames", "certificate-frames"]}
        columns={4}
      />
    </div>
  );
}
