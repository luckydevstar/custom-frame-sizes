import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Ruler, Frame } from "lucide-react";
import { Button, Card, CardContent } from "@framecraft/ui";
import { getStoreBaseAssetUrl } from "@framecraft/core";
import { brandConfig } from "../../../brand.config";
import mostPopularSizes from "./frame-sizes.json";
import allAvailableSizes from "./frame-sizes-remaining.json";

/** Most Popular = first 30 sizes; All Available = remaining 70 sizes (different data). */
const topSizes = mostPopularSizes;
const remainingSizes = allAvailableSizes;

type FrameSizeEntry = {
  size: string;
  width: number;
  height: number;
  primaryUseCase?: string;
};

export const metadata: Metadata = {
  title: `Picture Frames by Size - Custom Dimensions | ${brandConfig.name}`,
  description:
    "Shop 100+ custom picture frame sizes from 4×4 to 48×72 inches. Standard sizes (8×10, 16×20, 24×36) and hard-to-find dimensions. Made-to-order with instant pricing.",
  keywords:
    "custom frame sizes, picture frame dimensions, 8x10 frame, 16x20 frame, 24x36 frame, custom size frames, frame size chart",
  openGraph: {
    title: "Picture Frames by Size - Custom Dimensions",
    description:
      "Shop custom frames by size: standard dimensions like 8×10 and 16×20, plus hard-to-find custom sizes. Precision-made to your exact specifications.",
    type: "website",
    url: "/frames/sizes",
  },
  alternates: { canonical: "/frames/sizes" },
};

export default function FramesBySizePage() {
  const baseUrl = brandConfig.seo?.canonicalUrl || "https://customframesizes.com";
  const canonicalFramesSizes = `${baseUrl}/frames/sizes`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Frames by Size", item: canonicalFramesSizes },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What's the most popular picture frame size?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 24×36 inch format represents our highest-volume frame size, accommodating standard poster prints, large photography, and oversized art reproductions. For smaller artwork, the 8×10 and 16×20 sizes remain perennially popular for family photos, professional portraits, and gallery walls.",
        },
      },
      {
        "@type": "Question",
        name: "Do you make custom sizes not listed here?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we manufacture any rectangular frame dimension from 4×4 inches minimum to 48×72 inches maximum in 1/16 inch increments. Use our custom frame designer to specify exact dimensions and receive instant pricing for any size combination.",
        },
      },
      {
        "@type": "Question",
        name: "How do I know what size frame to order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Measure your artwork dimensions (width × height), then add your desired mat border width to all four sides. For example, a 16×20 print with 3-inch mat borders requires a 22×26 frame (16+3+3 by 20+3+3). Our interactive designer includes measurement guides and size calculators to simplify this process.",
        },
      },
      {
        "@type": "Question",
        name: "Are larger frame sizes more expensive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Frame pricing calculates by total frame perimeter (width + width + height + height), with proportional increases for larger dimensions. Our per-inch pricing remains consistent across all sizes—you pay fairly for the actual frame length manufactured regardless of dimension.",
        },
      },
      {
        "@type": "Question",
        name: "Can I frame artwork larger than 48×72 inches?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our current manufacturing capabilities accommodate frames up to 48×72 inches. Artwork exceeding these dimensions requires consultation for specialized oversize framing solutions. Contact our framing specialists for large-scale artwork requiring dimensions beyond our standard manufacturing range.",
        },
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Picture Frames by Size",
    description:
      "Browse 100+ custom picture frame sizes from 4×4 to 48×72 inches. Standard sizes like 8×10, 16×20, and 24×36, plus hard-to-find custom dimensions.",
    url: canonicalFramesSizes,
    inLanguage: "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section with lifestyle image on the right (original layout) */}
        <section className="relative bg-gradient-to-b from-muted/30 to-background py-8 md:py-16 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <Ruler className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
                    <h1
                      className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                      data-testid="heading-hero"
                    >
                      Picture Frames by Size
                    </h1>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
                    Browse our complete collection of 100+ custom picture frame sizes organized by
                    dimensions. From popular standard sizes like 8×10 and 24×36 to hard-to-find
                    custom measurements.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <Button
                      size="lg"
                      asChild
                      className="min-h-12"
                      data-testid="button-hero-start-designing"
                    >
                      <Link href="/picture-frames">
                        <Frame className="w-4 h-4 mr-2" />
                        Start Designing
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="min-h-12"
                      data-testid="button-hero-view-all"
                    >
                      <Link href="#all-sizes">View All 100 Sizes</Link>
                    </Button>
                  </div>
                </div>
                <div className="relative hidden md:block aspect-[4/3] min-w-[320px]">
                  <Image
                    src={getStoreBaseAssetUrl("frames/10828/lifestyle_22.png")}
                    alt="Man arranging dynamic gallery wall of distressed white picture frames in multiple sizes featuring large abstract expressionist paintings, pressed fern botanicals, and geometric prints on light gray wall"
                    fill
                    className="rounded-lg shadow-xl object-cover"
                    sizes="(max-width: 768px) 0px, 50vw"
                    priority
                    data-testid="img-hero-lifestyle"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Most Popular Frame Sizes - from original (top 30) */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">
                Most Popular Frame Sizes
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Choose from our most-requested dimensions, including standard poster sizes, square
                formats, and popular photo frame sizes.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {topSizes.map((size: FrameSizeEntry) => {
                const sizeLabel = `${size.width}×${size.height}`;
                return (
                  <Link
                    key={size.size}
                    href={`/designer?width=${size.width}&height=${size.height}`}
                    data-testid={`card-size-${size.size}`}
                  >
                    <Card className="hover-elevate active-elevate-2 h-full cursor-pointer">
                      <CardContent className="p-2 md:p-4">
                        <div className="text-center">
                          <div className="mb-2">
                            <div className="text-lg md:text-2xl font-bold text-primary">
                              {sizeLabel} Frames
                            </div>
                          </div>
                          {size.primaryUseCase && (
                            <p className="hidden md:block text-xs text-muted-foreground line-clamp-2 mb-3">
                              {size.primaryUseCase}
                            </p>
                          )}
                          <span
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-xs font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground w-full min-h-11"
                            data-testid={`button-view-${size.size}`}
                          >
                            View Frames
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEO Content - Why Frame Size Precision, Standard vs Custom, How to Measure, etc. */}
        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-12">
              {/* Why Frame Size Precision Matters */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Why Frame Size Precision Matters in Custom Framing
                </h2>
                <p className="text-muted-foreground mb-4">
                  Frame dimensions directly impact artwork presentation quality, with even minor
                  measurement discrepancies causing visible gaps, artwork buckling, or improper
                  mounting. Professional framers measure artwork precisely—to the 1/16 inch—before
                  ordering custom frames, understanding that retail &quot;standard&quot; sizes often
                  vary slightly between manufacturers. Custom-sized frames guarantee exact fits for
                  non-standard artwork, vintage prints, commercial posters, and specialty items that
                  don&apos;t conform to conventional picture frame dimensions. Standard frame sizes
                  (8×10, 11×14, 16×20, 18×24) dominate retail markets because they accommodate
                  mass-produced prints, photo lab output, and pre-cut mat boards. However, original
                  artwork, vintage posters, album covers, textiles, and memorabilia frequently
                  require custom measurements. Custom Frame Sizes specializes in precision
                  manufacturing for both standard dimensions and hard-to-find custom sizes,
                  eliminating the compromise of oversized frames with excessive mat borders.
                </p>
                <Button variant="outline" size="sm" className="mt-2 min-h-11" asChild>
                  <Link href="/learn" data-testid="button-learn-conservation-standards">
                    Learn More: Professional Framing Standards
                  </Link>
                </Button>
              </div>

              {/* Lifestyle break 1 */}
              <div className="my-8 relative aspect-[16/10] max-w-3xl mx-auto">
                <Image
                  src={getStoreBaseAssetUrl("frames/10829/lifestyle_14.png")}
                  alt="Woman on wooden step stool arranging eclectic gallery wall of textured blue picture frames featuring bold magenta pink abstract expressionist painting, misty forest landscape, geometric galaxy prints, teal mushroom botanicals, and line art portraits above walnut mid-century console with mustard yellow armchair demonstrating modern boho wall styling"
                  fill
                  className="rounded-lg object-cover shadow-lg"
                  sizes="(max-width: 768px) 100vw, 672px"
                  data-testid="img-lifestyle-break-1"
                />
              </div>

              {/* Standard vs Custom Sizes */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Standard Frame Sizes vs. Custom Dimensions
                </h2>
                <p className="text-muted-foreground mb-4">
                  Industry-standard frame sizes developed around photographic print dimensions and
                  paper manufacturing standards. The 8×10 format matches traditional portrait
                  photography and became ubiquitous in residential framing. The 16×20 size
                  accommodates standard poster prints and larger photography. Square formats (12×12,
                  20×20) gained popularity with Instagram-era photography and vinyl record album
                  displays. Understanding standard size categories helps identify pre-cut mat
                  availability and potential cost savings for conventional artwork. Custom
                  dimensions become necessary when artwork doesn&apos;t conform to standard
                  measurements, when preserving original print dimensions matters (vintage posters,
                  limited editions), or when specific mat border widths require non-standard frame
                  sizing. Original paintings on canvas, handmade textiles, antique documents,
                  architectural drawings, and international print formats frequently demand
                  custom-sized frames. Custom Frame Sizes manufactures any rectangular dimension
                  from 4×4 to 48×72 inches with the same precision craftsmanship as standard sizes.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button variant="outline" size="sm" className="min-h-11" asChild>
                    <Link href="/frame-size-chart" data-testid="button-learn-size-guide">
                      Learn More: Complete Size Guide
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="min-h-11" asChild>
                    <Link href="/frame-size-chart" data-testid="button-learn-poster-sizes">
                      Poster Size Reference
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Lifestyle break 2 */}
              <div className="my-8 relative aspect-[16/10] max-w-3xl mx-auto">
                <Image
                  src={getStoreBaseAssetUrl("frames/10829/lifestyle_23.png")}
                  alt="Man on credenza adjusting coastal ocean gallery wall of distressed blue picture frames featuring large seascape triptych centerpiece with rolling waves surrounded by geometric line art, constellation star maps, and minimalist abstract prints in bright modern living room demonstrating serene nautical wall styling"
                  fill
                  className="rounded-lg object-cover shadow-lg"
                  sizes="(max-width: 768px) 100vw, 672px"
                  data-testid="img-lifestyle-break-2"
                />
              </div>

              {/* How to Measure */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  How to Measure Artwork for Custom Frame Sizing
                </h2>
                <p className="text-muted-foreground mb-4">
                  Use a metal ruler or measuring tape to determine artwork dimensions at the widest
                  points, measuring to the nearest 1/16 inch for precision results. For prints on
                  paper, measure the visible image area, not including paper borders or deckled
                  edges. For stretched canvas, measure the exact canvas dimensions including wrapped
                  edges. For irregular artwork, measure the maximum width and height to determine
                  minimum frame size required. Professional framing standards suggest 2.5 to 3.5
                  inch mat borders for most artwork, with proportionally wider borders for larger
                  pieces. Smaller artwork (under 11×14) works well with 2 to 2.5 inch borders.
                  Medium artwork (11×14 to 18×24) benefits from 2.5 to 3 inch borders. Add your
                  desired mat border width to all four sides of the artwork measurement to calculate
                  total frame size. Our interactive designer includes measurement guides and size
                  visualization tools to preview total framed dimensions before ordering.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button variant="outline" size="sm" className="min-h-11" asChild>
                    <Link href="/how-to-measure" data-testid="button-learn-measurement-guide">
                      Learn More: Complete Measurement Guide
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="min-h-11" asChild>
                    <Link href="/mat-board-guide" data-testid="button-learn-mat-borders">
                      Mat Border Calculator
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Lifestyle break 3 */}
              <div className="my-8 relative aspect-[16/10] max-w-3xl mx-auto">
                <Image
                  src={getStoreBaseAssetUrl("frames/10829/lifestyle_22.png")}
                  alt="Woman standing on wooden stool arranging large asymmetric gallery wall of coastal blue picture frames featuring minimalist line art portrait, ocean seascape triptych, bold magenta pink abstract expressionist painting, misty forest landscape, vintage galaxy astrophotography, botanical fern, and geometric prints above walnut media console demonstrating professional salon-style wall design"
                  fill
                  className="rounded-lg object-cover shadow-lg"
                  sizes="(max-width: 768px) 100vw, 672px"
                  data-testid="img-lifestyle-break-3"
                />
              </div>

              {/* Popular Frame Size Categories */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Popular Frame Size Categories and Applications
                </h2>
                <p className="text-muted-foreground mb-4">
                  Different artwork types require specific size categories optimized for their
                  presentation needs. Standard photo sizes (4×6, 5×7, 8×10) serve traditional
                  portrait photography, family photos, and professional headshots with widespread
                  pre-cut mat availability and economical framing options due to high-volume
                  manufacturing. Poster dimensions (18×24, 24×36, 27×40) accommodate commercial
                  printing formats, movie one-sheets, concert posters, and art reproductions. The
                  24×36 size represents the most popular poster dimension for residential framing.
                  Square formats (12×12, 20×20, 24×24) excel for vinyl record album displays,
                  Instagram prints, abstract art, and modern photography. The 12×12 format precisely
                  accommodates LP album covers and jackets. Panoramic dimensions (10×30, 12×36,
                  16×48) showcase landscape photography, cityscape panoramas, and horizontal artwork
                  requiring dramatic width-to-height ratios, typically requiring custom
                  manufacturing since few retailers stock panoramic frame inventory.
                </p>
                <Button variant="outline" size="sm" className="mt-2 min-h-11" asChild>
                  <Link href="/frame-size-chart" data-testid="button-learn-size-categories">
                    Learn More: Size Category Guide
                  </Link>
                </Button>
              </div>

              {/* Frame Size Comparison Guide table */}
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
                  Frame Size Comparison Guide
                </h2>
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left p-2 md:p-3 font-semibold text-sm md:text-base">
                          Category
                        </th>
                        <th className="text-left p-2 md:p-3 font-semibold text-sm md:text-base">
                          Size Range
                        </th>
                        <th className="text-left p-2 md:p-3 font-semibold text-sm md:text-base">
                          Popular Sizes
                        </th>
                        <th className="text-left p-2 md:p-3 font-semibold text-sm md:text-base">
                          Best For
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-2 md:p-3">
                          <strong className="text-sm md:text-base">Small Frames</strong>
                        </td>
                        <td className="p-2 md:p-3 text-muted-foreground text-xs md:text-sm">
                          4×4 to 8×10
                        </td>
                        <td className="p-2 md:p-3">
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            <Link href="/designer?width=4&height=6">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                4×6
                              </span>
                            </Link>
                            <Link href="/designer?width=5&height=7">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                5×7
                              </span>
                            </Link>
                            <Link href="/designer?width=8&height=10">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                8×10
                              </span>
                            </Link>
                          </div>
                        </td>
                        <td className="p-2 md:p-3 text-muted-foreground text-xs md:text-sm">
                          Photos, certificates
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-2 md:p-3">
                          <strong className="text-sm md:text-base">Medium Frames</strong>
                        </td>
                        <td className="p-2 md:p-3 text-muted-foreground text-xs md:text-sm">
                          11×14 to 20×24
                        </td>
                        <td className="p-2 md:p-3">
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            <Link href="/designer?width=11&height=14">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                11×14
                              </span>
                            </Link>
                            <Link href="/designer?width=16&height=20">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                16×20
                              </span>
                            </Link>
                            <Link href="/designer?width=18&height=24">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                18×24
                              </span>
                            </Link>
                          </div>
                        </td>
                        <td className="p-2 md:p-3 text-muted-foreground text-xs md:text-sm">
                          Art prints, posters
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-2 md:p-3">
                          <strong className="text-sm md:text-base">Large Frames</strong>
                        </td>
                        <td className="p-2 md:p-3 text-muted-foreground text-xs md:text-sm">
                          24×36 to 48×72
                        </td>
                        <td className="p-2 md:p-3">
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            <Link href="/designer?width=24&height=36">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                24×36
                              </span>
                            </Link>
                            <Link href="/designer?width=30&height=40">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                30×40
                              </span>
                            </Link>
                            <Link href="/designer?width=36&height=48">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                36×48
                              </span>
                            </Link>
                          </div>
                        </td>
                        <td className="p-2 md:p-3 text-muted-foreground text-xs md:text-sm">
                          Statement art, posters
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-2 md:p-3">
                          <strong className="text-sm md:text-base">Square Frames</strong>
                        </td>
                        <td className="p-2 md:p-3 text-muted-foreground text-xs md:text-sm">
                          4×4 to 30×30
                        </td>
                        <td className="p-2 md:p-3">
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            <Link href="/designer?width=12&height=12">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                12×12
                              </span>
                            </Link>
                            <Link href="/designer?width=20&height=20">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                20×20
                              </span>
                            </Link>
                            <Link href="/designer?width=24&height=24">
                              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] md:text-xs font-medium text-secondary-foreground">
                                24×24
                              </span>
                            </Link>
                          </div>
                        </td>
                        <td className="p-2 md:p-3 text-muted-foreground text-xs md:text-sm">
                          Album covers, Instagram
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2 md:hidden">
                  Scroll horizontally to view all columns
                </p>
              </div>

              {/* Lifestyle images grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={getStoreBaseAssetUrl("frames/10828/lifestyle_20.png")}
                    alt="Sophisticated gallery wall of textured white picture frames featuring wide landscape triptych of misty forest lake reflection surrounded by pressed fern botanicals and family photographs under modern chandelier"
                    fill
                    className="rounded-lg object-cover shadow-md"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-testid="img-lifestyle-gallery"
                  />
                </div>
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={getStoreBaseAssetUrl("frames/8446/lifestyle_4.jpg")}
                    alt="Wide Black frames in curated gallery wall displaying geometric prints and landscape photography in modern interior with navy sofa demonstrating multiple frame size combinations"
                    fill
                    className="rounded-lg object-cover shadow-md"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-testid="img-lifestyle-mix"
                  />
                </div>
              </div>

              {/* FAQ intro */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Frequently Asked Questions About Frame Sizes
                </h2>
                <p className="text-muted-foreground mb-6">
                  Common questions about frame sizing, measurements, and custom dimensions. The
                  24×36 inch format represents our highest-volume frame size for posters and large
                  photography. We manufacture any rectangular dimension from 4×4 to 48×72 inches in
                  1/16 inch increments with instant pricing. Frame costs calculate by total
                  perimeter—our per-inch pricing remains consistent across all sizes. For
                  measurement help, our interactive designer includes guides and calculators to
                  determine exact frame dimensions based on artwork size and mat border preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* All Available Frame Sizes - remaining from data (or same 30 if only 30 in data) */}
        <section
          id="all-sizes"
          className="container mx-auto px-4 py-8 md:py-16 border-t bg-muted/10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                All Available Frame Sizes
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
                Complete catalog of precision-manufactured frame sizes from 4×4 to 48×72 inches.
                Click any size to open the designer. Need a dimension not listed? Our designer
                supports any size in 1/16&quot; increments.
              </p>
            </div>
            <div className="mb-8 md:mb-12 hidden md:block relative aspect-[16/10] max-w-4xl mx-auto">
              <Image
                src={getStoreBaseAssetUrl("frames/10828/lifestyle_16.png")}
                alt="Curated gallery wall of textured white picture frames in multiple sizes featuring large abstract expressionist painting surrounded by vintage travel poster, mushroom illustration, and pressed fern botanicals on sage green wall"
                fill
                className="rounded-lg object-cover shadow-xl"
                sizes="896px"
                data-testid="img-lifestyle-all-sizes"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
              {remainingSizes.length > 0
                ? remainingSizes.map((size: FrameSizeEntry) => (
                    <Link
                      key={size.size}
                      href={`/designer?width=${size.width}&height=${size.height}`}
                      data-testid={`card-size-all-${size.size}`}
                    >
                      <Card className="hover-elevate active-elevate-2 h-full cursor-pointer">
                        <CardContent className="p-2 md:p-4">
                          <div className="text-center">
                            <div className="text-sm md:text-base font-bold text-primary mb-3">
                              {size.width}×{size.height} Frames
                            </div>
                            <span
                              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-xs font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground w-full min-h-11"
                              data-testid={`button-view-all-${size.size}`}
                            >
                              View
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                : null}
            </div>
            {remainingSizes.length === 0 && (
              <p className="text-center text-muted-foreground mt-6">
                All popular sizes are shown above. Use the designer for any other dimension from
                4×4&quot; to 48×72&quot; in 1/16&quot; increments.
              </p>
            )}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={getStoreBaseAssetUrl("frames/10828/lifestyle_15.png")}
                  alt="Woman arranging colorful children's artwork in distressed white picture frames creating playful gallery wall display above console with houseplants"
                  fill
                  className="rounded-lg object-cover shadow-md"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  data-testid="img-lifestyle-children"
                />
              </div>
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={getStoreBaseAssetUrl("frames/10828/lifestyle_18.png")}
                  alt="Man adjusting eclectic gallery wall of textured white picture frames above mid-century modern walnut media console in Scandinavian contemporary living room"
                  fill
                  className="rounded-lg object-cover shadow-md"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  data-testid="img-lifestyle-eclectic"
                />
              </div>
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={getStoreBaseAssetUrl("frames/8446/lifestyle_2.jpg")}
                  alt="Wide Black custom frames in dynamic gallery wall arrangement featuring bicycle photography in various sizes demonstrating versatile multi-size framing combinations"
                  fill
                  className="rounded-lg object-cover shadow-md"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  data-testid="img-lifestyle-dynamic"
                />
              </div>
            </div>
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-6">
                Don&apos;t see the exact size you need? We manufacture custom frames in any
                rectangular dimension from 4×4 to 48×72 inches in 1/16 inch increments.
              </p>
              <Button size="lg" asChild data-testid="button-custom-size">
                <Link href="/picture-frames">
                  <Ruler className="w-4 h-4 mr-2" />
                  Create Custom Size
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <section className="container mx-auto px-4 py-8 md:py-12 border-t bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Browse Frames by Color or Style
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Not sure on size yet? Explore our frames by finish color or style.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="lg" asChild data-testid="button-browse-by-color">
                <Link href="/frames/colors">Frames by Color</Link>
              </Button>
              <Button variant="outline" size="lg" asChild data-testid="button-browse-by-style">
                <Link href="/frames/styles">Frames by Style</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Design Your Custom Frame?
            </h2>
            <p className="text-muted-foreground mb-6">
              Use our interactive frame designer to visualize your artwork in any size, customize
              mat borders, and get instant pricing for your exact dimensions.
            </p>
            <Button size="lg" asChild data-testid="button-start-designing">
              <Link href="/picture-frames">Start Designing</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
