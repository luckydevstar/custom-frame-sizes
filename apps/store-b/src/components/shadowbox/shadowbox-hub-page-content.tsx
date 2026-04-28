"use client";

import { getFrameSlug, getFrameStyles, getStoreBaseAssetUrl, resolveFramePhotoUrl } from "@framecraft/core";
import { Button } from "@framecraft/ui/components/ui/button";
import { ShadowboxDesigner } from "@framecraft/ui";
import type { FrameStyle } from "@framecraft/types";
import { ArrowRight, Box, Heart, Medal, Shield, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TrustBadge } from "@/components/home/trust-badge";
import { KeyFeaturesBar } from "@/components/marketing/key-features-bar";

import { buildShadowboxHubJsonLd } from "./shadowbox-hub-json-ld";

/** Marketing fields from frames.json (published @framecraft/types may lag workspace). */
type ShadowboxListingFrame = FrameStyle & {
  displayName?: string;
  brandSubtitle?: string;
};

function lifestyle(path: string) {
  return getStoreBaseAssetUrl(path.replace(/^\//, ""));
}

function cornerSrc(frame: ShadowboxListingFrame) {
  const corner = frame.alternateImages?.find((img) => img.type === "corner");
  return corner?.url ? resolveFramePhotoUrl(corner.url) : "";
}

/** origina-store-b/client/src/pages/Shadowbox.tsx */
export function ShadowboxHubPageContent() {
  const router = useRouter();
  const [clientReady, setClientReady] = useState(false);
  useEffect(() => {
    setClientReady(true);
  }, []);

  const allShadowboxFrames = useMemo(
    () =>
      getFrameStyles().filter((frame) => frame.category === "shadowbox") as ShadowboxListingFrame[],
    []
  );

  const displayFrames = allShadowboxFrames;

  const rotatedFeaturedFrames = useMemo(() => {
    if (allShadowboxFrames.length <= 3) return allShadowboxFrames;
    if (!clientReady) return allShadowboxFrames.slice(0, 3);
    const shuffled = [...allShadowboxFrames];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = shuffled[i];
      const b = shuffled[j];
      if (a !== undefined && b !== undefined) {
        shuffled[i] = b;
        shuffled[j] = a;
      }
    }
    return shuffled.slice(0, 3);
  }, [allShadowboxFrames, clientReady]);

  const hubJsonLd = buildShadowboxHubJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubJsonLd) }} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Box className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Where Your Memories Find Their Frame</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight" data-testid="heading-hero">
              Custom Shadow Box Frames
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Every object tells a story. A folded flag, a pair of tiny shoes, a dried bouquet from the happiest day of your life. Our handcrafted shadow box frames give those stories a home -- beautifully built, deeply personal, and made to last.
            </p>
          </div>
        </section>

        <KeyFeaturesBar />

        {allShadowboxFrames.length > 0 ? (
          <section className="container mx-auto px-4 py-12 md:py-16 border-t">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">A Curated Collection for Every Story</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold" data-testid="heading-signature-collection">
                  More Than a Frame, A Memory Keeper
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {rotatedFeaturedFrames.map((frame) => {
                  const corner = cornerSrc(frame);
                  return (
                    <div
                      key={frame.id}
                      role="button"
                      tabIndex={0}
                      className="group relative overflow-hidden rounded-lg border-2 border-primary/20 bg-gradient-to-br from-card to-muted/20 hover-elevate active-elevate-2 transition-all cursor-pointer"
                      onClick={() => router.push(`/shadowbox/${getFrameSlug(frame.id)}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/shadowbox/${getFrameSlug(frame.id)}`);
                        }
                      }}
                      data-testid={`featured-frame-${frame.id}`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20">
                        {corner ? (
                          <img
                            src={corner}
                            alt={frame.alternateImages?.find((i) => i.type === "corner")?.alt ?? `${frame.name} shadow box frame corner detail`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Box className="w-16 h-16 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-1">{frame.displayName ?? frame.name}</h3>
                        {frame.brandSubtitle ? (
                          <p className="text-xs text-muted-foreground italic mb-2">{frame.brandSubtitle}</p>
                        ) : null}
                        {frame.featuredDescription ? (
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                            {frame.featuredDescription}
                          </p>
                        ) : null}

                        <Button
                          type="button"
                          className="w-full"
                          data-testid={`design-${frame.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/shadowbox/${getFrameSlug(frame.id)}`);
                          }}
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
              <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="heading-all-shadowboxes">
                A Curated Collection for Every Story
              </h2>
              <p className="text-muted-foreground">
                No two memories are alike, so no two shadow boxes should be either. Our boutique collection spans everything from deep-profile frames for bulky keepsakes to sleek, shallow displays for pressed flowers and flat memorabilia.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayFrames.map((frame) => {
                const corner = cornerSrc(frame);
                return (
                  <div
                    key={frame.id}
                    role="button"
                    tabIndex={0}
                    className="group relative overflow-hidden rounded-lg border bg-card hover-elevate active-elevate-2 transition-all cursor-pointer"
                    onClick={() => router.push(`/shadowbox/${getFrameSlug(frame.id)}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/shadowbox/${getFrameSlug(frame.id)}`);
                      }
                    }}
                    data-testid={`shadowbox-${frame.id}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/20">
                      {corner ? (
                        <img
                          src={corner}
                          alt={frame.alternateImages?.find((i) => i.type === "corner")?.alt ?? `${frame.name} shadow box frame corner detail`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: `${frame.color}20` }}
                        >
                          <div className="w-20 h-20 rounded-full border-8 opacity-30" style={{ borderColor: frame.color }} />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors mb-0.5">
                        {frame.displayName ?? frame.name}
                      </h3>
                      {frame.brandSubtitle ? (
                        <p className="text-xs text-muted-foreground italic mb-1">{frame.brandSubtitle}</p>
                      ) : null}
                      {frame.usableDepth !== undefined ? (
                        <p className="text-xs font-medium text-primary">{frame.usableDepth}&quot; depth</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 border-t" data-designer-anchor>
          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Custom Shadow Box Designer</h2>
            <p className="text-muted-foreground">Design your perfect shadow box frame with real-time pricing</p>
          </div>
          <ShadowboxDesigner />
          <TrustBadge variant="inline" />
        </div>

        <section className="container mx-auto px-4 py-12 border-t" data-testid="section-use-cases">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="text-use-cases-title">
                What People Put in Shadow Box Frames
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-lg border bg-card hover-elevate" data-testid="card-use-case-1">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Sports & Athletics</h3>
                <p className="text-sm text-muted-foreground">
                  Game-worn jerseys, race medals mounted with bibs, signed baseballs on small stands, championship rings, team photos layered behind dimensional objects. Deep and ultra-deep frames recommended.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card hover-elevate" data-testid="card-use-case-2">
                <Medal className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Military & Service</h3>
                <p className="text-sm text-muted-foreground">
                  Medals arranged in precedence order, challenge coin collections, rank insignia, unit patches, dog tags, folded flag accents, service photos. Standard or medium depth handles most military displays.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card hover-elevate" data-testid="card-use-case-3">
                <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Collections & Hobbies</h3>
                <p className="text-sm text-muted-foreground">
                  Pinned insect specimens, coin sets, vintage key arrangements, enamel pin boards, trading card displays, concert ticket archives, and any curated collection that deserves to be on the wall instead of in a drawer.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card hover-elevate" data-testid="card-use-case-4">
                <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Weddings & Milestones</h3>
                <p className="text-sm text-muted-foreground">
                  Dried bouquet preservation, invitation suites mounted with fabric swatches, cake toppers, ceremony programs, and anniversary displays. Deep or extra-deep frames for thick floral arrangements.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Handcrafted with Intention</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                  <p>
                    Every shadow box we offer is built with real craftsmanship. We source quality mouldings, cut clean corners, and assemble frames that feel solid in your hands. No flimsy, mass-produced shortcuts, just honest, well-made frames from a team that genuinely cares about what goes inside them. Because when someone trusts us with their most meaningful possessions, we take that seriously.
                  </p>
                  <p>
                    Every shadow box begins with a conversation. You tell us what you want to frame, and we guide you through depth, backing color, mat selection, and frame profile. Our craftspeople then cut, assemble, and finish your shadow box by hand in our workshop. The result is a one-of-a-kind piece that holds your story with care.
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src={lifestyle("frames/8446/lifestyle_2.jpg")}
                  alt="Handcrafted shadow box frame with layered memorabilia display"
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
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shadow Box Depth Options and What Fits Inside</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">What People Put in Shadow Box Frames</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Sports & Athletics:</strong> Game-worn jerseys, race medals mounted with bibs, signed baseballs on small stands, championship rings, team photos layered behind dimensional objects. Deep and ultra-deep frames recommended.
                  </p>
                  <p>
                    <strong className="text-foreground">Military & Service:</strong> Medals arranged in precedence order, challenge coin collections, rank insignia, unit patches, dog tags, folded flag accents, service photos. Standard or medium depth handles most military displays.
                  </p>
                  <p>
                    <strong className="text-foreground">Weddings & Milestones:</strong> Dried bouquet preservation, invitation suites mounted with fabric swatches, cake toppers, ceremony programs, and anniversary displays. Deep or extra-deep frames for thick floral arrangements.
                  </p>
                  <p>
                    <strong className="text-foreground">Collections & Hobbies:</strong> Pinned insect specimens, coin sets, vintage key arrangements, enamel pin boards, trading card displays, concert ticket archives, and any curated collection that deserves to be on the wall instead of in a drawer.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Depth Options:</strong> Standard Depth, 0.875 inches. Handles flat-to-moderate items: pinned medals, mounted coins, ticket stub arrangements, pressed flowers, and small dimensional objects. The most popular depth for single-item displays. Medium Depth, 1 to 1.5 inches. Room for folded fabric swatches, thick certificate displays, stacked coin sets, or arrangements that layer a photo behind a dimensional object. Deep Profile, 1.25 to 2.5 inches. Built for jerseys, bulky sports memorabilia, deep floral preservation, and multi-item shadow boxes where objects sit at different planes. Ultra Deep, 3.5 inches. Our deepest frame, 40% more depth than our next-deepest option. Maximum interior space for full helmets, thick sculptures, championship belts, oversized dried bouquets, and anything else that won&apos;t fit in a standard or deep frame.
                  </p>
                  <p>
                    <strong className="text-foreground">Size Range:</strong> Sizes start at 4×4 inches and go up to 48×72 inches. Every frame is cut to 1/8-inch precision, we don&apos;t round to the nearest standard size. Square, rectangular, panoramic, and oversized configurations are all available. If your item doesn&apos;t fit a standard dimension, that&apos;s exactly why we exist.
                  </p>
                  <p>
                    <strong className="text-foreground">Moulding Profiles:</strong> Moulding widths range from 0.75 inches (slim, minimal, the frame almost disappears) to 1.25 inches (wide, architectural, the frame becomes part of the presentation). Finishes include matte black, bright white, honey oak, rustic walnut, coastal whitewash, barn wood textures, charcoal satin, natural maple, and brushed metallic in silver, gold, and bronze.
                  </p>
                  <p>
                    <strong className="text-foreground">Material Standards:</strong> All shadow box frames use solid wood mouldings, acid-free backing, and framer&apos;s grade acrylic glazing as standard. Non-glare acrylic is available for displays in bright rooms or opposite windows. Mat board options include single and double matting in a range of colors, all acid-free. Every frame is hand-assembled and inspected before it ships.
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto mb-12">
              <h3 className="text-xl font-semibold mb-6 text-center">Shadowbox Depth Comparison</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-full max-w-[80px] mx-auto mb-2">
                    <div className="bg-muted-foreground/15 rounded-t-md mx-auto" style={{ width: "60px", height: "22px" }} />
                  </div>
                  <span className="text-sm font-semibold">Standard</span>
                  <span className="text-lg font-bold text-foreground">0.875&quot;</span>
                  <span className="text-xs text-muted-foreground mt-1">Medals, coins, flat items</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-full max-w-[80px] mx-auto mb-2">
                    <div className="bg-muted-foreground/25 rounded-t-md mx-auto" style={{ width: "60px", height: "38px" }} />
                  </div>
                  <span className="text-sm font-semibold">Medium</span>
                  <span className="text-lg font-bold text-foreground">1-1.5&quot;</span>
                  <span className="text-xs text-muted-foreground mt-1">Fabric, stacked coins, documents</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-full max-w-[80px] mx-auto mb-2">
                    <div className="bg-muted-foreground/35 rounded-t-md mx-auto" style={{ width: "60px", height: "56px" }} />
                  </div>
                  <span className="text-sm font-semibold">Deep</span>
                  <span className="text-lg font-bold text-foreground">1.25-2.5&quot;</span>
                  <span className="text-xs text-muted-foreground mt-1">Jerseys, bulky memorabilia</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-full max-w-[80px] mx-auto mb-2">
                    <div className="bg-primary rounded-t-md mx-auto" style={{ width: "60px", height: "88px" }} />
                  </div>
                  <span className="text-sm font-bold text-primary">Ultra Deep</span>
                  <span className="text-lg font-bold text-primary">3.5&quot;</span>
                  <span className="text-xs text-muted-foreground mt-1">Helmets, sculptures, belts</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Ultra Deep is our newest and deepest option, 3.5 inches of interior depth for items no other frame can hold.
              </p>
              <div className="flex justify-center gap-3 mt-4 flex-wrap">
                <Button size="sm" asChild data-testid="button-depth-compare-black">
                  <Link href="/shadowbox/ultra-deep-black-shadow-box-frame">Ultra Deep Black</Link>
                </Button>
                <Button size="sm" variant="outline" asChild data-testid="button-depth-compare-white">
                  <Link href="/shadowbox/ultra-deep-white-shadow-box-frame">Ultra Deep White</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden max-w-3xl mx-auto">
              <img
                src={lifestyle("frames/8446/lifestyle_7.jpg")}
                alt="Custom shadow box frames displaying dimensional memorabilia in professional gallery arrangement"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Custom Shadow Box Frame Questions</h2>

            <div className="grid md:grid-cols-[1fr,320px] gap-8 items-start">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What is a shadow box frame?</h3>
                  <p className="text-muted-foreground">
                    It&apos;s a frame with depth. Where a regular picture frame holds something flat against backing, a shadow box has interior space, anywhere from just under an inch to 3.5 inches deep, so three-dimensional objects can sit inside without touching the front glazing. That depth is what makes them right for medals, folded jerseys, dried flowers, collectible displays, helmets, and anything else that has physical thickness. The acrylic front protects the contents from dust and handling while keeping everything visible.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">How much depth do I need for my items?</h3>
                  <p className="text-muted-foreground">
                    Measure the thickest item you plan to display from front to back, then add at least a quarter inch of clearance so nothing presses against the acrylic. For flat items like pinned medals or mounted coins, standard depth at 0.875 inches is usually enough. Folded fabric, thick documents, or stacked objects typically need 1 to 1.5 inches. Full jerseys and bulky memorabilia call for 1.25 to 2.5 inches. For championship belts, helmets, and thick sculptures, the 3.5-inch ultra-deep frame gives you the most room.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">What items work best in shadow box frames?</h3>
                  <p className="text-muted-foreground">
                    Anything with physical thickness that you&apos;d rather see on a wall than store in a box. The most common displays we build frames for: jerseys and sports equipment, military medal arrangements, dried wedding bouquets, coin and pin collections, framed concert memorabilia, baby keepsakes like hospital bracelets and first shoes, vintage object collections, and mixed-media arrangements that combine flat photos with dimensional items. If it doesn&apos;t lay flat in a standard frame, it belongs in a shadow box.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">How much do custom shadow box frames cost?</h3>
                  <p className="text-muted-foreground">
                    Pricing depends on the frame size, which moulding you choose, the depth, and whether you add matting or upgrade to non-glare acrylic. Smaller shadow boxes start in the $50 range and scale up with size and options. The fastest way to get an exact price is to use the designer at the top of this page, it updates in real time as you change dimensions, frame style, and add-ons. No hidden fees, no surprises at checkout.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">What&apos;s the difference between a shadow box and a regular frame?</h3>
                  <p className="text-muted-foreground">
                    Depth. A standard picture frame holds flat items, prints, photos, documents, pressed close to the glazing with almost no space between. A shadow box adds interior depth, ranging from 0.875 inches up to 3.5 inches depending on the frame, so three-dimensional objects can sit inside the frame without being compressed. Shadow boxes also default to acrylic rather than glass, which matters at larger sizes where glass would be dangerously heavy and fragile during shipping.
                  </p>
                </div>
              </div>

              <div className="hidden md:flex flex-col gap-6 sticky top-4">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={lifestyle("frames/8446/lifestyle_3.jpg")}
                    alt="Professional shadow box frame presentation showing professional-grade craftsmanship"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={lifestyle("frames/8446/lifestyle_4.jpg")}
                    alt="Custom shadow box frames in modern interior displaying dimensional memorabilia"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={lifestyle("frames/8446/lifestyle_5.jpg")}
                    alt="Detail view of shadow box frame corner highlighting precision construction"
                    className="w-full h-full object-cover"
                    loading="lazy"
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
                Learn More About Shadow Box Framing
              </h2>
              <p className="text-muted-foreground">
                Explore our comprehensive guides for professional shadow box techniques and expert advice
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/resources/conservation-framing-standards" data-testid="link-conservation-standards" className="block">
                <div className="p-5 rounded-lg border bg-card hover-elevate active-elevate-2 transition-all cursor-pointer h-full">
                  <Shield className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Conservation Standards</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional-grade materials and archival techniques for long-term preservation
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
