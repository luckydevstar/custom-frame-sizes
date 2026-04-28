"use client";

import {
  getFrameSlug,
  getFrameStyleById,
  getFrameStyles,
  getStoreBaseAssetUrl,
  resolveFramePhotoUrl,
} from "@framecraft/core";
import { ArrowRight, Award, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TrustBadge } from "@/components/home/trust-badge";
import { KeyFeaturesBar } from "@/components/marketing/key-features-bar";

import { Button } from "@framecraft/ui/components/ui/button";

import type { FrameStyle } from "@framecraft/types";

function lifestyle(path: string) {
  return getStoreBaseAssetUrl(path.replace(/^\//, ""));
}

function cornerSrc(frame: FrameStyle) {
  const corner = frame.alternateImages?.find((img) => img.type === "corner");
  return corner?.url ? resolveFramePhotoUrl(corner.url) : "";
}

/** JSON-LD Product graph — offerCount from live catalog (origina-store-b PictureFrames.tsx) */
function buildPictureFramesSchema(frameCount: number) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Picture Frames from Our Shadow Box Workshop",
        description:
          "Handcrafted picture frames in solid wood. Custom-sized from 4×4 to 48×72 inches with single or double mat configurations, standard or non-glare glazing, and a wide range of moulding profiles.",
        brand: { "@type": "Brand", name: "ShadowboxFrames.com" },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "25.00",
          highPrice: "200.00",
          offerCount: frameCount,
          availability: "https://schema.org/InStock",
        },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Material", value: "Solid Wood" },
          { "@type": "PropertyValue", name: "Size Range", value: "4×4 to 48×72 inches" },
          { "@type": "PropertyValue", name: "Mat Options", value: "Single and Double Mat" },
        ],
      },
    ],
  };
}

/** origina-store-b/client/src/pages/PictureFrames.tsx */
export function PictureFramesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const frameParam = searchParams.get("frame");

  const [clientReady, setClientReady] = useState(false);
  useEffect(() => {
    setClientReady(true);
  }, []);

  const allFrames = useMemo(() => getFrameStyles(), []);
  const featuredFrames = useMemo(() => allFrames.filter((frame) => frame.featured), [allFrames]);
  const standardFrames = useMemo(() => allFrames.filter((frame) => !frame.featured), [allFrames]);
  const displayFrames = useMemo(() => [...standardFrames, ...featuredFrames], [standardFrames, featuredFrames]);

  const rotatedFeaturedFrames = useMemo(() => {
    if (featuredFrames.length <= 3) return featuredFrames;
    if (!clientReady) return featuredFrames.slice(0, 3);
    const shuffled = [...featuredFrames];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled.slice(0, 3);
  }, [featuredFrames, clientReady]);

  useEffect(() => {
    if (frameParam && getFrameStyleById(frameParam)) {
      const slug = getFrameSlug(frameParam);
      router.replace(`/frames/${slug}`);
    }
  }, [frameParam, router]);

  const pictureFramesSchema = buildPictureFramesSchema(allFrames.length);

  if (frameParam && getFrameStyleById(frameParam)) {
    return null;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pictureFramesSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Quality Framing from a Shadow Box Specialist</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight" data-testid="heading-hero">
              Picture Frames from Our Shadow Box Workshop
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              We built our reputation on shadow boxes, but great framing is great framing. Our picture frames bring the same artisanal attention to detail, quality mouldings, and genuine craftsmanship that our shadow box customers know and trust. Because every photo, print, and piece of art deserves a frame that does it justice.
            </p>

            <div className="flex justify-center mt-4">
              <Button size="lg" onClick={() => router.push("/designer")} className="px-8" data-testid="button-browse-all">
                Browse All Frames
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <KeyFeaturesBar />

        {featuredFrames.length > 0 ? (
          <section className="container mx-auto px-4 py-12 md:py-16 border-t">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold" data-testid="heading-signature-collection">
                  Workshop favorites
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {rotatedFeaturedFrames.map((frame) => {
                  const cornerUrl = cornerSrc(frame);
                  return (
                    <div
                      key={frame.id}
                      role="button"
                      tabIndex={0}
                      className="group relative overflow-hidden rounded-lg border-2 border-primary/20 bg-gradient-to-br from-card to-muted/20 hover-elevate active-elevate-2 transition-all cursor-pointer"
                      onClick={() => router.push(`/frames/${getFrameSlug(frame.id)}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/frames/${getFrameSlug(frame.id)}`);
                        }
                      }}
                      data-testid={`featured-frame-${frame.id}`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20">
                        {cornerUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cornerUrl}
                            alt={
                              frame.alternateImages?.find((img) => img.type === "corner")?.alt ||
                              `${frame.name} picture frame corner detail`
                            }
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="w-16 h-16 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2">{frame.name} Frame</h3>
                        {frame.featuredDescription ? (
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{frame.featuredDescription}</p>
                        ) : null}

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/frames/${getFrameSlug(frame.id)}`);
                          }}
                          className="w-full"
                          data-testid={`design-${frame.id}`}
                        >
                          Design Your Frame
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        <section className="container mx-auto px-4 py-8 md:py-12 border-t">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-all-frames">
                See every moulding option
              </h2>
              <p className="text-muted-foreground">Choose from our complete collection of picture frames</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayFrames.map((frame) => {
                const cornerUrl = cornerSrc(frame);
                return (
                  <div
                    key={frame.id}
                    role="button"
                    tabIndex={0}
                    className="group relative overflow-hidden rounded-lg border bg-card hover-elevate active-elevate-2 transition-all cursor-pointer"
                    onClick={() => router.push(`/frames/${getFrameSlug(frame.id)}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/frames/${getFrameSlug(frame.id)}`);
                      }
                    }}
                    data-testid={`frame-${frame.id}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/20">
                      {cornerUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cornerUrl}
                          alt={
                            frame.alternateImages?.find((img) => img.type === "corner")?.alt ||
                            `${frame.name} picture frame corner detail`
                          }
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${frame.color}20` }}>
                          <div className="w-20 h-20 rounded-full border-8 opacity-30" style={{ borderColor: frame.color }} />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors mb-1">
                        {frame.name} Frame
                      </h3>
                      {frame.shortDescription ? (
                        <p className="text-xs text-muted-foreground/80 italic" data-testid="text-frame-short-description">
                          {frame.shortDescription}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Framing with a Specialist&apos;s Touch</h2>
                <p className="text-muted-foreground mb-4">
                  Most framing companies try to be everything to everyone. We took the opposite approach, we became specialists first. That deep understanding of materials, construction, and display is baked into every picture frame we make. You&apos;ll notice it in the clean corner joins, the solid feel of the moulding, and the way the finished frame just looks right on your wall.
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Quick benefits:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Quality mouldings in wood and composite, slim modern to wide traditional</li>
                    <li>Single and double mat configurations in a wide palette of colors</li>
                    <li>Standard glass, non-glare glass, and lightweight acrylic glazing options</li>
                    <li>Ready to hang, every frame ships with backing, glazing, and hardware</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lifestyle("frames/8446/lifestyle_2.jpg")}
                  alt="Gallery wall with coordinated custom picture frames"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">From Snapshots to Statements</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Fine art & photography</strong> | Whether you&apos;re framing a favorite family photo, a limited-edition print, or a child&apos;s artwork you can&apos;t bear to part with, our picture frames are built to present it beautifully.
                  </p>
                  <p>
                    <strong className="text-foreground">Home décor</strong> | Family photos, posters, kids&apos; art, and prints that don&apos;t fit standard store frames.
                  </p>
                  <p>
                    <strong className="text-foreground">Professional / office</strong> | Diplomas, certifications, branded art, and statement pieces in lobbies or conference rooms.
                  </p>
                  <p>
                    <strong className="text-foreground">Collectors</strong> | Vintage posters, maps, limited editions, and keepsakes.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Key Specs</h3>
                <div className="space-y-2 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <strong className="text-foreground">Size range:</strong> 4×4&quot; up to 48×72&quot;
                    </li>
                    <li>
                      <strong className="text-foreground">Frame widths:</strong> Slim modern (0.5-1.0&quot;), mid-range (1.0-1.75&quot;), bold gallery (2.0-3.0&quot;)
                    </li>
                    <li>
                      <strong className="text-foreground">Depth options:</strong> Standard for prints, deep for canvas and layered mats, extra-deep shadowbox options
                    </li>
                    <li>
                      <strong className="text-foreground">Materials:</strong> Kiln-dried wood, conservation backing, UV-protective glazing options
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden max-w-3xl mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lifestyle("frames/8446/lifestyle_7.jpg")}
                alt="Gallery wall with multiple custom picture frames in home setting"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Custom Picture Frame Questions</h2>

            <div className="grid md:grid-cols-[1fr,320px] gap-8 items-start">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">I thought ShadowboxFrames.com only sold shadow boxes?</h3>
                  <p className="text-muted-foreground">
                    Shadow boxes are our specialty, they&apos;re what we&apos;re known for and what we love most. But we also offer a carefully selected range of traditional picture frames. We apply the same craftsmanship and quality standards to every frame, whether it&apos;s 3 inches deep or a quarter inch.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Should I add a mat to my picture frame?</h3>
                  <p className="text-muted-foreground">
                    A mat adds visual breathing room between your image and the frame, which often makes the artwork or photo feel more intentional and finished. It&apos;s especially helpful for smaller prints. That said, some images, particularly large prints and canvases, look great without one. It comes down to the look you prefer.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">What&apos;s the difference between glass and acrylic glazing?</h3>
                  <p className="text-muted-foreground">
                    Glass offers excellent clarity and scratch resistance but is heavier and breakable. Acrylic is lightweight, shatter-resistant, and a great choice for larger frames or homes with kids and pets. Both are available with UV-protective coatings.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">What&apos;s the difference between standard and conservation framing?</h3>
                  <p className="text-muted-foreground">
                    Standard framing is great for temporary or decorative pieces. Conservation framing uses archival mats and backing with UV glazing to protect valuable or irreplaceable artwork for decades.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Can custom frames handle canvas or 3D items?</h3>
                  <p className="text-muted-foreground">
                    Yes. Deep and shadowbox profiles are built for thicker canvases, layered mats, jerseys, medals, and other dimensional pieces.
                  </p>
                </div>
              </div>

              <div className="hidden md:flex flex-col gap-6 sticky top-4">
                <div className="rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lifestyle("frames/8446/lifestyle_3.jpg")}
                    alt="Custom framed photograph with matting in living room"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lifestyle("frames/8446/lifestyle_4.jpg")}
                    alt="Gallery wall with custom frames in modern home setting"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lifestyle("frames/8446/lifestyle_5.jpg")}
                    alt="Close-up of custom frame corner joint and matted artwork"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-learn-more">
                Learn More About Custom Framing
              </h2>
              <p className="text-muted-foreground">
                Explore our comprehensive guides for professional framing techniques and expert advice
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/resources/conservation-framing-standards" data-testid="link-conservation-standards">
                <div className="p-5 rounded-lg border bg-card hover-elevate active-elevate-2 transition-all cursor-pointer h-full">
                  <p className="font-semibold text-base mb-2">Conservation Framing Standards</p>
                  <p className="text-sm text-muted-foreground">Professional-grade preservation techniques and archival materials</p>
                </div>
              </Link>
              <Link href="/resources/mat-color-selection-guide" data-testid="link-mat-color-guide">
                <div className="p-5 rounded-lg border bg-card hover-elevate active-elevate-2 transition-all cursor-pointer h-full">
                  <p className="font-semibold text-base mb-2">Mat Color Selection Guide</p>
                  <p className="text-sm text-muted-foreground">Expert tips for pairing mat colors with different frame styles</p>
                </div>
              </Link>
              <Link href="/resources/professional-mounting-techniques" data-testid="link-mounting-techniques">
                <div className="p-5 rounded-lg border bg-card hover-elevate active-elevate-2 transition-all cursor-pointer h-full">
                  <p className="font-semibold text-base mb-2">Professional Mounting Techniques</p>
                  <p className="text-sm text-muted-foreground">Safe methods for securing artwork without causing damage</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20 border-t">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-final-cta">
              Build your shadow box
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Browse our complete collection and start designing with our interactive frame designer
            </p>
            <Button size="lg" onClick={() => router.push("/designer")} className="text-lg px-10 h-14" data-testid="button-final-cta">
              Start Designing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <TrustBadge />
          </div>
        </section>
      </div>
    </>
  );
}
