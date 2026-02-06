import type { Metadata } from "next";
import Link from "next/link";
import { Award, ArrowRight, Sparkles } from "lucide-react";
import { Button, Card, CardContent } from "@framecraft/ui";
import { getFrameStyles } from "@framecraft/core";

export const metadata: Metadata = {
  title: "Custom Picture Frames - Professional Grade & Ornate Designs | CustomFrameSizes.com",
  description:
    "Browse our collection of custom picture frames in professional-grade finishes. Ornate gold frames, classic wood mouldings, and modern designs. Any size from 4×4 to 48×72 inches with precision 1/16 inch accuracy. Expert craftsmanship with instant pricing.",
  openGraph: {
    title: "Custom Picture Frames - Professional Grade Framing",
    description:
      "Premium custom picture frames for art, photos, diplomas, and heirlooms. Professional-grade materials, expert craftsmanship, any custom size with instant pricing.",
    type: "website",
    url: "/picture-frames",
  },
  keywords:
    "custom picture frames, museum frames, ornate frames, gold picture frames, wood frames, custom framing, picture frame gallery, fine art frames, photo frames",
  alternates: { canonical: "/picture-frames" },
};

export default function PictureFramesPage() {
  const allFrames = getFrameStyles();
  const pictureFrames = allFrames.filter((f) => f.category === "picture");
  const displayFrames = pictureFrames.slice(0, 12);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Professional-Grade Custom Framing
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
            data-testid="heading-hero"
          >
            Picture Frames in Custom Sizes
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
            Transform your artwork, photos, and treasured pieces with picture frames built to your
            exact dimensions and crafted to professional-grade standards.
          </p>
          <div className="flex justify-center mt-4">
            <Button asChild size="lg" className="px-8" data-testid="button-browse-all">
              <Link href="/designer">
                Browse All Frames
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefit Bar */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Any Size</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                4×4&quot; to 48×72&quot;
              </p>
            </div>
            <div className="text-center">
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                1/16&quot; Precision
              </p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Exact dimensions
              </p>
            </div>
            <div className="text-center">
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Instant Pricing</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                In the designer
              </p>
            </div>
            <div className="text-center">
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Made in USA</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Expert craftsmanship
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Frames Grid */}
      {displayFrames.length > 0 && (
        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-all-frames">
                Browse Frame Styles
              </h2>
              <p className="text-muted-foreground">
                Choose from our collection of custom picture frames
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayFrames.map((frame) => (
                <Link key={frame.id} href={`/designer?frame=${frame.id}`}>
                  <Card
                    className="h-full hover:border-primary/30 transition-all cursor-pointer"
                    data-testid={`frame-${frame.id}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/20">
                      {frame.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element -- dynamic frame thumbnails from API
                        <img
                          src={
                            frame.thumbnail.startsWith("/")
                              ? `/api/asset/${frame.thumbnail.slice(1)}`
                              : frame.thumbnail
                          }
                          alt={`${frame.name} frame`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base">{frame.name} Frame</h3>
                      {frame.shortDescription && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {frame.shortDescription}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild size="lg">
                <Link href="/designer">Start Designing</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Why Custom Frames Matter */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Custom Picture Frames Matter</h2>
          <p className="text-muted-foreground mb-4">
            Custom frames are built to the exact size of your art, so you never have to trim or
            force a piece into a standard size. You choose the frame style, depth, mat options, and
            glazing, and we build it to 1/16-inch precision.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>Any size from 4×4&quot; to 48×72&quot;</li>
            <li>Multiple depths for prints, canvas, and 3D pieces</li>
            <li>Archival backing and mat options for long-term preservation</li>
            <li>Made-to-order frames built in the USA</li>
          </ul>
        </div>
      </section>

      {/* Where Custom Frames Work Best */}
      <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Where Custom Frames Work Best</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Fine art &amp; photography</strong> – Exact
                sizing for unique dimensions and gallery-style presentation.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong className="text-foreground">Home décor</strong> – Family photos, posters,
                kids&apos; art, and prints that don&apos;t fit standard store frames.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong className="text-foreground">Professional / office</strong> – Diplomas,
                certifications, branded art, and statement pieces.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong className="text-foreground">Collectors</strong> – Vintage posters, maps,
                limited editions, and keepsakes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Specs</h3>
              <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  <strong className="text-foreground">Size range:</strong> 4×4&quot; up to
                  48×72&quot;
                </li>
                <li>
                  <strong className="text-foreground">Frame widths:</strong> Slim to bold gallery
                </li>
                <li>
                  <strong className="text-foreground">Depth options:</strong> Standard, deep,
                  shadowbox
                </li>
                <li>
                  <strong className="text-foreground">Materials:</strong> Kiln-dried wood,
                  conservation backing, UV glazing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Custom Picture Frame Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What sizes can I order?</h3>
              <p className="text-muted-foreground">
                Any size from 4×4&quot; to 48×72&quot;, cut to your exact dimensions with 1/16-inch
                precision.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I choose frame width?</h3>
              <p className="text-muted-foreground">
                Small pieces usually look best with 0.75–1.5&quot; profiles. Medium pieces pair well
                with 1.5–2.5&quot;. Large pieces need 2.0–3.0&quot; widths.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How much do custom frames cost?</h3>
              <p className="text-muted-foreground">
                Price depends on size, frame style, and options. Our designer shows instant pricing
                as you change size and moulding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can custom frames handle canvas or 3D items?</h3>
              <p className="text-muted-foreground">
                Yes. Deep and shadowbox profiles are built for thicker canvases, layered mats,
                jerseys, medals, and other dimensional pieces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-final-cta">
            Ready to Create Your Perfect Frame?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Browse our complete collection and start designing with our interactive frame designer
          </p>
          <Button asChild size="lg" className="text-lg px-10 h-14" data-testid="button-final-cta">
            <Link href="/designer">
              Start Designing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No account required • Instant pricing • Professional-grade materials
          </p>
        </div>
      </section>
    </div>
  );
}
