"use client";

/**
 * Shadowbox color gateway PDP — origina-store-b/client/src/pages/shadowboxes/*ShadowboxFrames.tsx
 */

import {
  getFrameStyles,
  getShadowboxColorHeroImage,
  isUsingShadowboxPlaceholderImages,
  resolveFramePhotoUrl,
  SHADOWBOX_COLOR_METADATA,
} from "@framecraft/core";
import { Badge, Button, Card, CardContent } from "@framecraft/ui";
import type { AlternateImage, FrameStyle } from "@framecraft/types";
import {
  Anchor,
  ArrowLeft,
  Award,
  BookOpen,
  Box,
  Clock,
  Crown,
  Disc3,
  GraduationCap,
  Heart,
  Home,
  Image as LucideImageIcon,
  Package,
  Palette,
  Ruler,
  Shield,
  Shirt,
  Trees,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";

import { normalizeOriginaPopularHref, type ShadowboxGatewayColorName } from "./shadowbox-color-gateway-keys";
import { buildShadowboxColorGatewayFaqJsonLd } from "./shadowbox-color-gateway-faq-json-ld";
import { buildShadowboxColorGatewayProductJsonLd } from "./shadowbox-color-gateway-product-json-ld";
import type { GatewayVignetteIconId } from "./shadowbox-color-gateway-registry";
import {
  SHADOWBOX_GATEWAY_DESIGN_CTA_LABEL,
  SHADOWBOX_GATEWAY_FINAL_CTA,
  SHADOWBOX_GATEWAY_POPULAR_APPS,
  SHADOWBOX_GATEWAY_POPULAR_SECTION_BG,
  SHADOWBOX_GATEWAY_RELATED,
  SHADOWBOX_GATEWAY_TECH_SPECS,
  SHADOWBOX_GATEWAY_ULTRA_DEEP,
  SHADOWBOX_GATEWAY_VIGNETTES,
  SHADOWBOX_GATEWAY_VIGNETTE_SECTION_TITLE,
} from "./shadowbox-color-gateway-registry";

const VIGNETTE_ICONS: Record<GatewayVignetteIconId, LucideIcon> = {
  shirt: Shirt,
  disc3: Disc3,
  award: Award,
  image: LucideImageIcon,
  heart: Heart,
  clock: Clock,
  bookOpen: BookOpen,
  trophy: Trophy,
  crown: Crown,
  anchor: Anchor,
  graduationCap: GraduationCap,
  trees: Trees,
  home: Home,
};

function getCornerImage(frame: FrameStyle): AlternateImage | { url: string; alt: string } {
  const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
  return (
    cornerImage || {
      url: frame.thumbnail || "",
      alt: `${frame.name} shadowbox corner detail`,
    }
  );
}

export function ShadowboxColorGatewayPageContent({
  colorName,
}: {
  colorName: ShadowboxGatewayColorName;
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const colorMeta = SHADOWBOX_COLOR_METADATA[colorName]!;

  const frames = useMemo(() => getFrameStyles() as FrameStyle[], []);

  const shadowboxFrames = useMemo(() => {
    const searchColor = colorName === "Blue" ? "barn blue" : colorName.toLowerCase();
    return frames.filter((f) => f.category === "shadowbox" && f.colorName?.toLowerCase() === searchColor);
  }, [colorName, frames]);

  const featuredFrame = useMemo(() => {
    if (shadowboxFrames.length === 0) return null;
    return shadowboxFrames.reduce((prev, current) =>
      current.pricePerInch > prev.pricePerInch ? current : prev
    );
  }, [shadowboxFrames]);

  const otherFrames = useMemo(() => {
    return shadowboxFrames.filter((f) => f.id !== featuredFrame?.id);
  }, [shadowboxFrames, featuredFrame]);

  const depthOptions = useMemo(() => {
    const depths = shadowboxFrames.map((f) => f.usableDepth).filter((d): d is number => d !== undefined);
    if (depths.length === 0) return null;
    return {
      min: Math.min(...depths),
      max: Math.max(...depths),
      count: new Set(depths).size,
    };
  }, [shadowboxFrames]);

  const widthOptions = useMemo(() => {
    const widths = shadowboxFrames.map((f) => f.mouldingWidth).filter((w): w is number => w !== undefined);
    return new Set(widths).size;
  }, [shadowboxFrames]);

  const heroImage = useMemo(() => getShadowboxColorHeroImage(colorName, frames), [colorName, frames]);

  const usingPlaceholders = useMemo(
    () => isUsingShadowboxPlaceholderImages(colorName, frames),
    [colorName, frames]
  );

  const complementaryColors = useMemo(() => {
    const related = SHADOWBOX_GATEWAY_RELATED[colorName];
    return related
      .map((name) => SHADOWBOX_COLOR_METADATA[name])
      .filter(
        (row): row is NonNullable<(typeof SHADOWBOX_COLOR_METADATA)[ShadowboxGatewayColorName]> =>
          row != null
      );
  }, [colorName]);

  const faqSchema = useMemo(
    () => buildShadowboxColorGatewayFaqJsonLd(colorName, colorMeta.slug),
    [colorName, colorMeta.slug]
  );

  const productSchema = useMemo(
    () => buildShadowboxColorGatewayProductJsonLd(colorName, frames),
    [colorName, frames]
  );

  const ultra = SHADOWBOX_GATEWAY_ULTRA_DEEP[colorName];
  const vignetteTitle =
    SHADOWBOX_GATEWAY_VIGNETTE_SECTION_TITLE[colorName] ?? "Display Ideas by Category";
  const popularSectionBg = SHADOWBOX_GATEWAY_POPULAR_SECTION_BG[colorName] ?? "bg-muted/30";
  const tech = SHADOWBOX_GATEWAY_TECH_SPECS[colorName];
  const finalCta = SHADOWBOX_GATEWAY_FINAL_CTA[colorName];
  const vignettes = SHADOWBOX_GATEWAY_VIGNETTES[colorName];
  const popularApps = SHADOWBOX_GATEWAY_POPULAR_APPS[colorName];

  /** unused but parity with origina (hero alt / placeholder banners) */
  void usingPlaceholders;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {productSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      ) : null}

      <div className="min-h-screen">
        <section className="relative bg-gradient-to-br from-background to-muted py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Button variant="ghost" className="mb-6" asChild data-testid="button-back-to-colors">
              <Link href="/shadowboxes/colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shadowbox Colors
              </Link>
            </Button>

            <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-border"
                    style={{ backgroundColor: colorMeta.hex }}
                    data-testid="color-swatch"
                  />
                  <div>
                    <Badge className="mb-2" data-testid="badge-design-style">
                      {colorMeta.designStyle}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold">{colorMeta.displayName} Shadowbox Frames</h1>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground mb-6">{colorMeta.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" data-testid="badge-frame-count">
                    <Package className="w-3 h-3 mr-1" />
                    {shadowboxFrames.length} Frame{shadowboxFrames.length !== 1 ? "s" : ""}
                  </Badge>
                  {depthOptions ? (
                    <Badge variant="secondary" data-testid="badge-depth-options">
                      <Box className="w-3 h-3 mr-1" />
                      {depthOptions.count} Depth Option{depthOptions.count !== 1 ? "s" : ""}
                    </Badge>
                  ) : null}
                  <Badge variant="secondary" data-testid="badge-width-options">
                    <Ruler className="w-3 h-3 mr-1" />
                    {widthOptions} Width{widthOptions !== 1 ? "s" : ""}
                  </Badge>
                </div>

                <Button size="lg" asChild data-testid="button-design-shadowbox">
                  <Link href="/shadowbox">{SHADOWBOX_GATEWAY_DESIGN_CTA_LABEL[colorName]}</Link>
                </Button>
              </div>

              <div className="relative">
                <img
                  src={heroImage.url}
                  alt={heroImage.alt}
                  className="rounded-lg shadow-lg w-full"
                  data-testid="hero-image"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Quick Facts</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{shadowboxFrames.length}</div>
                    <div className="text-sm text-muted-foreground">Frame Options</div>
                  </CardContent>
                </Card>
                {depthOptions ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {depthOptions.min}&quot; - {depthOptions.max}&quot;
                      </div>
                      <div className="text-sm text-muted-foreground">Depth Range</div>
                    </CardContent>
                  </Card>
                ) : null}
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{widthOptions}</div>
                    <div className="text-sm text-muted-foreground">Width Options</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">Wood</div>
                    <div className="text-sm text-muted-foreground">Material</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {ultra ? (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-1">
                        <Badge className="mb-2">Our Deepest Frame</Badge>
                        <h3 className="text-xl font-bold mb-2" data-testid="text-ultra-deep-callout-title">
                          Need More Depth?
                        </h3>
                        <p className="text-muted-foreground mb-4" data-testid="text-ultra-deep-callout-desc">
                          {ultra.description}
                        </p>
                        <Button asChild data-testid="button-ultra-deep-callout">
                          <Link href={ultra.href}>{ultra.ctaLabel}</Link>
                        </Button>
                      </div>
                      <div className="w-full md:w-48 flex-shrink-0">
                        <div className="flex items-end gap-1 justify-center">
                          <div className="flex flex-col items-center">
                            <span className="text-[0.6rem] text-muted-foreground mb-1">Standard</span>
                            <div className="w-8 bg-muted-foreground/20 rounded-t" style={{ height: "20px" }} />
                            <span className="text-[0.6rem] text-muted-foreground mt-1">0.875&quot;</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[0.6rem] text-muted-foreground mb-1">Deep</span>
                            <div className="w-8 bg-muted-foreground/40 rounded-t" style={{ height: "40px" }} />
                            <span className="text-[0.6rem] text-muted-foreground mt-1">2&quot;</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[0.6rem] font-semibold text-primary mb-1">Ultra Deep</span>
                            <div className="w-8 bg-primary rounded-t" style={{ height: "70px" }} />
                            <span className="text-[0.6rem] font-semibold text-primary mt-1">3.5&quot;</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        ) : null}

        <section className={`py-12 ${popularSectionBg}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Popular Applications</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {popularApps.map((app) => (
                  <Button key={app.label + app.href} variant="outline" asChild>
                    <Link href={normalizeOriginaPopularHref(app.href)}>{app.label}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {shadowboxFrames.length > 0 ? (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Our {colorName} Shadowbox Frames</h2>

                {featuredFrame ? (
                  <Card className="mb-12">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                          <img
                            src={resolveFramePhotoUrl(getCornerImage(featuredFrame).url)}
                            alt={getCornerImage(featuredFrame).alt}
                            className="rounded-lg w-full"
                            data-testid="featured-frame-image"
                          />
                        </div>
                        <div>
                          <Badge className="mb-2">Featured</Badge>
                          <h3 className="text-2xl font-bold mb-3">{featuredFrame.name}</h3>
                          <p className="text-muted-foreground mb-6">{featuredFrame.shortDescription}</p>

                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Moulding Width</span>
                              <span className="font-semibold">{featuredFrame.mouldingWidth}&quot;</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Usable Depth</span>
                              <span className="font-semibold">{featuredFrame.usableDepth}&quot;</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Material</span>
                              <span className="font-semibold">{featuredFrame.material}</span>
                            </div>
                          </div>

                          <Button size="lg" asChild data-testid="button-customize-featured">
                            <Link href={`/shadowbox?frame=${featuredFrame.id}`}>Customize This Shadowbox</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                {otherFrames.length > 0 ? (
                  <>
                    <h3 className="text-2xl font-bold mb-6">All {colorName} Shadowboxes</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {otherFrames.map((frame) => {
                        const cornerImg = getCornerImage(frame);
                        return (
                          <Card key={frame.id}>
                            <CardContent className="pt-6">
                              <img
                                src={resolveFramePhotoUrl(cornerImg.url)}
                                alt={cornerImg.alt}
                                className="rounded-lg w-full mb-4"
                                data-testid={`frame-image-${frame.id}`}
                              />
                              <h4 className="font-semibold mb-2">{frame.name}</h4>
                              <div className="text-sm text-muted-foreground mb-4">
                                <div>Width: {frame.mouldingWidth}&quot;</div>
                                <div>Depth: {frame.usableDepth}&quot;</div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="w-full"
                                data-testid={`button-customize-${frame.id}`}
                              >
                                <Link href={`/shadowbox?frame=${frame.id}`}>Customize Shadowbox</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">{vignetteTitle}</h2>

              <div className="space-y-12">
                {vignettes.map((v) => {
                  const Icon = VIGNETTE_ICONS[v.icon];
                  return (
                    <Card key={v.title}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <Icon className="w-16 h-16 text-primary flex-shrink-0" />
                          <div>
                            <h3 className="text-2xl font-semibold mb-3">{v.title}</h3>
                            <p className="text-muted-foreground mb-4">{v.body}</p>
                            <p className="text-sm text-muted-foreground">{v.popularFor}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Technical Specifications</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <Box className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{tech.depth.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{tech.depth.intro}</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {tech.depth.bullets.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Shield className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{tech.uv.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{tech.uv.intro}</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {tech.uv.bullets.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <Palette className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{tech.materials.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{tech.materials.intro}</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {tech.materials.bullets.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {complementaryColors.length > 0 ? (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Also Explore These Shadowbox Colors</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {complementaryColors.map((color) => (
                      <Card key={color.slug} className="hover-elevate">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-border"
                              style={{ backgroundColor: color.hex }}
                            />
                            <h3 className="font-semibold text-lg">{color.displayName}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{color.description.split(".")[0]}.</p>
                          <Button variant="outline" size="sm" asChild className="w-full" data-testid={`link-color-${color.slug}`}>
                            <Link href={`/shadowboxes/${color.slug}-shadowbox-frames`}>
                              View {color.displayName} Shadowboxes
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{finalCta.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">{finalCta.description}</p>
              <Button size="lg" variant="default" asChild data-testid="button-final-cta">
                <Link href="/shadowbox">Start Designing Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
