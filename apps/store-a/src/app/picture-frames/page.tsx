import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Award, ArrowRight, Sparkles, Ruler, CheckCircle2 } from "lucide-react";
import { Button } from "@framecraft/ui";
import { getFrameStyles, getStoreBaseAssetUrl } from "@framecraft/core";

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

function getCornerOrThumbUrl(frame: {
  alternateImages?: { type: string; url: string }[];
  thumbnail?: string | null;
}) {
  const corner = frame.alternateImages?.find((img) => img.type === "corner");
  if (corner) {
    const path = corner.url.startsWith("/") ? corner.url.slice(1) : corner.url;
    return getStoreBaseAssetUrl(path);
  }
  if (frame.thumbnail) {
    const path = frame.thumbnail.startsWith("/") ? frame.thumbnail.slice(1) : frame.thumbnail;
    return getStoreBaseAssetUrl(path);
  }
  return null;
}

export default function PictureFramesPage() {
  const allFrames = getFrameStyles();
  const pictureFrames = allFrames.filter((f) => f.category === "picture");
  const featuredFrames = pictureFrames.filter((f) => f.featured);
  const standardFrames = pictureFrames.filter((f) => !f.featured);
  const displayFrames = [...standardFrames, ...featuredFrames];
  const signatureFrames = featuredFrames.length <= 3 ? featuredFrames : featuredFrames.slice(0, 3);

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

      {/* Key features bar (matches original KeyFeaturesBar) */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            <div className="text-center" data-testid="feature-custom-size">
              <Ruler className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Custom Sizes</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Built to Fit Your Exact Art
              </p>
            </div>
            <div className="text-center" data-testid="feature-handcrafted">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Handcrafted</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                Skilled Artisans Build Every Frame
              </p>
            </div>
            <div className="text-center" data-testid="feature-professional-grade">
              <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">
                Frame Shop Quality
              </p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                To Protect Your Items
              </p>
            </div>
            <div className="text-center" data-testid="feature-instant-pricing">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-primary" />
              <p className="text-[0.7rem] md:text-sm font-medium leading-tight">Instant Pricing</p>
              <p className="text-[0.65rem] md:text-xs text-muted-foreground mt-0.5 leading-tight">
                See Your Cost as You Customize
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Collection (featured frames) */}
      {signatureFrames.length > 0 && (
        <section className="container mx-auto px-4 py-12 md:py-16 border-t">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2
                className="text-3xl md:text-4xl font-bold"
                data-testid="heading-signature-collection"
              >
                Signature Collection
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {signatureFrames.map((frame) => {
                const imgSrc = getCornerOrThumbUrl(frame);
                return (
                  <Link
                    key={frame.id}
                    href={`/designer?frame=${frame.id}`}
                    className="group relative overflow-hidden rounded-lg border-2 border-primary/20 bg-gradient-to-br from-card to-muted/20 hover:border-primary/40 transition-all cursor-pointer block"
                    data-testid={`featured-frame-${frame.id}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={
                            frame.alternateImages?.find((i) => i.type === "corner")?.alt ??
                            `${frame.name} frame`
                          }
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2">{frame.name} Frame</h3>
                      {frame.featuredDescription && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {frame.featuredDescription}
                        </p>
                      )}
                      <Button className="w-full" size="default">
                        Design Your Frame
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Browse All Frame Styles */}
      {displayFrames.length > 0 && (
        <section className="container mx-auto px-4 py-8 md:py-12 border-t">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-all-frames">
                Browse All Frame Styles
              </h2>
              <p className="text-muted-foreground">
                Choose from our complete collection of custom picture frames
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayFrames.map((frame) => {
                const imgSrc = getCornerOrThumbUrl(frame);
                return (
                  <Link
                    key={frame.id}
                    href={`/designer?frame=${frame.id}`}
                    className="group relative overflow-hidden rounded-lg border bg-card hover:border-primary/30 transition-all cursor-pointer block"
                    data-testid={`frame-${frame.id}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/20">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={
                            frame.alternateImages?.find((i) => i.type === "corner")?.alt ??
                            `${frame.name} frame`
                          }
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors mb-1">
                        {frame.name} Frame
                      </h3>
                      {frame.shortDescription && (
                        <p
                          className="text-xs text-muted-foreground/80 italic"
                          data-testid="text-frame-short-description"
                        >
                          {frame.shortDescription}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Button asChild size="lg">
                <Link href="/designer">Start Designing</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Why Custom Picture Frames Matter (2-col with image) */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Why Custom Picture Frames Matter
              </h2>
              <p className="text-muted-foreground mb-4">
                Custom frames are built to the exact size of your art, so you never have to trim or
                force a piece into a standard size. You choose the frame style, depth, mat options,
                and glazing, and we build it to 1/16-inch precision.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Quick benefits:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Any size from 4×4&quot; to 48×72&quot;</li>
                  <li>Multiple depths for prints, canvas, and 3D pieces</li>
                  <li>Archival backing and mat options for long-term preservation</li>
                  <li>Made-to-order frames built in the USA</li>
                </ul>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
              <Image
                src={getStoreBaseAssetUrl("frames/8446/lifestyle_2.jpg")}
                alt="Custom framed photography displayed in coordinated gallery wall layout"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Where Custom Frames Work Best + Key Specs + lifestyle image */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Where Custom Frames Work Best</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Fine art &amp; photography</strong> – Exact
                  sizing for unique dimensions and gallery-style presentation.
                </p>
                <p>
                  <strong className="text-foreground">Home décor</strong> – Family photos, posters,
                  kids&apos; art, and prints that don&apos;t fit standard store frames.
                </p>
                <p>
                  <strong className="text-foreground">Professional / office</strong> – Diplomas,
                  certifications, branded art, and statement pieces in lobbies or conference rooms.
                </p>
                <p>
                  <strong className="text-foreground">Collectors</strong> – Vintage posters, maps,
                  limited editions, and keepsakes.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Specs</h3>
              <div className="space-y-2 text-muted-foreground">
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong className="text-foreground">Size range:</strong> 4×4&quot; up to
                    48×72&quot;
                  </li>
                  <li>
                    <strong className="text-foreground">Frame widths:</strong> Slim modern
                    (0.5–1.0&quot;), mid-range (1.0–1.75&quot;), bold gallery (2.0–3.0&quot;)
                  </li>
                  <li>
                    <strong className="text-foreground">Depth options:</strong> Standard for prints,
                    deep for canvas and layered mats, extra-deep shadowbox options
                  </li>
                  <li>
                    <strong className="text-foreground">Materials:</strong> Kiln-dried wood,
                    conservation backing, UV-protective glazing options
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden max-w-3xl mx-auto aspect-[16/10]">
            <Image
              src={getStoreBaseAssetUrl("frames/8446/lifestyle_7.jpg")}
              alt="Contemporary gallery wall featuring multiple custom frames"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        </div>
      </section>

      {/* FAQ with sidebar images (matches original layout) */}
      <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Custom Picture Frame Questions
          </h2>
          <div className="grid md:grid-cols-[1fr,320px] gap-8 items-start">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What sizes can I order?</h3>
                <p className="text-muted-foreground">
                  Any size from 4×4&quot; to 48×72&quot;, cut to your exact dimensions with
                  1/16-inch precision.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I choose frame width?</h3>
                <p className="text-muted-foreground">
                  Small pieces (under 11×14&quot;) usually look best with 0.75–1.5&quot; profiles.
                  Medium pieces (16×20&quot;–24×30&quot;) pair well with 1.5–2.5&quot;. Large pieces
                  (30×40&quot;+) need 2.0–3.0&quot; widths to feel balanced.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How much do custom frames cost?</h3>
                <p className="text-muted-foreground">
                  Price depends on size, frame style, and options like UV glazing. Our designer
                  shows instant pricing as you change size and moulding, so you can compare styles
                  before you order.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  What&apos;s the difference between standard and conservation framing?
                </h3>
                <p className="text-muted-foreground">
                  Standard framing is great for temporary or decorative pieces. Conservation framing
                  uses archival mats and backing with UV glazing to protect valuable or
                  irreplaceable artwork for decades.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Can custom frames handle canvas or 3D items?
                </h3>
                <p className="text-muted-foreground">
                  Yes. Deep and shadowbox profiles are built for thicker canvases, layered mats,
                  jerseys, medals, and other dimensional pieces.
                </p>
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-6 sticky top-4">
              <div className="relative rounded-lg overflow-hidden aspect-[3/4] w-full">
                <Image
                  src={getStoreBaseAssetUrl("frames/8446/lifestyle_3.jpg")}
                  alt="Personal presentation of custom framed photograph demonstrating professional quality and craftsmanship"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
              <div className="relative rounded-lg overflow-hidden aspect-[3/4] w-full">
                <Image
                  src={getStoreBaseAssetUrl("frames/8446/lifestyle_4.jpg")}
                  alt="Custom frame detail and finish"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
              <div className="relative rounded-lg overflow-hidden aspect-[3/4] w-full">
                <Image
                  src={getStoreBaseAssetUrl("frames/8446/lifestyle_5.jpg")}
                  alt="Gallery wall with custom frames"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
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
