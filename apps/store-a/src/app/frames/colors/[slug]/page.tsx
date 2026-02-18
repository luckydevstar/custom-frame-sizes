import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, Badge } from "@framecraft/ui";
import { FrameDesigner } from "@framecraft/ui";
import {
  COLOR_METADATA,
  getColorHeroImage,
  getColorGalleryImages,
  getFramesByColor,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import { brandConfig } from "../../../../brand.config";
import type { FrameStyle } from "@framecraft/types";

// Next.js 14: params is a plain object; Next.js 15: params is a Promise
type ColorDetailPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

// Ensure params are always read from the request (avoids static-generation issues)
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return Object.values(COLOR_METADATA).map((data) => ({ slug: data.slug }));
}

// Helper to get corner image for a frame (store-a CDN)
function getCornerImage(frame: FrameStyle) {
  const cornerImage = frame.alternateImages?.find((img) => img.type === "corner");
  if (cornerImage) {
    const localPath = cornerImage.url.startsWith("/") ? cornerImage.url.slice(1) : cornerImage.url;
    return {
      url: getStoreBaseAssetUrl(localPath),
      alt: cornerImage.alt,
    };
  }
  const localPath = (frame.thumbnail ?? "").startsWith("/")
    ? (frame?.thumbnail ?? "").slice(1)
    : frame.thumbnail;
  return {
    url: getStoreBaseAssetUrl(localPath ?? ""),
    alt: `${frame.name} Frame corner detail`,
  };
}

const SIMILAR_COLORS_COUNT = 3;

/** Get exactly SIMILAR_COLORS_COUNT complementary colors (only from COLOR_METADATA). */
function getComplementaryColors(
  colorName: string
): Array<{
  colorName: string;
  displayName: string;
  slug: string;
  hex: string;
  description: string;
  designStyle: string;
  bestFor: string[];
}> {
  const relatedMap: Record<string, string[]> = {
    Black: ["White", "Gray", "Silver"],
    White: ["Black", "Gray", "Natural"],
    Brown: ["Natural", "Espresso", "Gold"],
    Gold: ["Brown", "Silver", "Natural"],
    Silver: ["Gray", "Black", "White"],
    Natural: ["Brown", "White", "Espresso"],
    Gray: ["Black", "White", "Silver"],
    Espresso: ["Brown", "Natural", "Gold"],
  };

  const related = relatedMap[colorName] ?? ["Black", "White", "Natural"];
  const availableInMeta = new Set(Object.keys(COLOR_METADATA));

  type ColorEntry = {
    colorName: string;
    displayName: string;
    slug: string;
    hex: string;
    description: string;
    designStyle: string;
    bestFor: string[];
  };
  const fromRelated: ColorEntry[] = related
    .filter((name) => availableInMeta.has(name) && name !== colorName)
    .map((name) => {
      const data = COLOR_METADATA[name as keyof typeof COLOR_METADATA];
      if (!data) return null;
      return { colorName: name, ...data };
    })
    .filter((c): c is ColorEntry => c !== null)
    .slice(0, SIMILAR_COLORS_COUNT);

  if (fromRelated.length >= SIMILAR_COLORS_COUNT) {
    return fromRelated;
  }

  const rest: ColorEntry[] = (Object.keys(COLOR_METADATA) as (keyof typeof COLOR_METADATA)[])
    .filter((name) => name !== colorName && !fromRelated.some((c) => c.colorName === name))
    .slice(0, SIMILAR_COLORS_COUNT - fromRelated.length)
    .map((name) => ({ colorName: name, ...COLOR_METADATA[name] }) as ColorEntry);

  return [...fromRelated, ...rest].slice(0, SIMILAR_COLORS_COUNT);
}

function findColorBySlug(slug: string | undefined) {
  const normalized = (slug ?? "").toLowerCase().trim();
  if (!normalized) return null;
  return (
    Object.entries(COLOR_METADATA).find(([_, data]) => data.slug.toLowerCase() === normalized) ??
    null
  );
}

export async function generateMetadata({ params }: ColorDetailPageProps): Promise<Metadata> {
  const resolved =
    typeof (params as Promise<{ slug: string }>).then === "function"
      ? await (params as Promise<{ slug: string }>)
      : (params as { slug: string });
  const slug = typeof resolved?.slug === "string" ? resolved.slug : "";
  const entry = findColorBySlug(slug);

  if (!entry) {
    return {
      title: "Color Not Found",
    };
  }

  const [, colorData] = entry;

  return {
    title: `${colorData.displayName} Frames - Custom Sizes | ${brandConfig.name}`,
    description: `Shop ${colorData.displayName.toLowerCase()} picture frames in custom sizes 4×4 to 48×72 inches. ${colorData.description} Expert craftsmanship with instant pricing.`,
    openGraph: {
      title: `${colorData.displayName} Picture Frames - Custom Sizes`,
      description: colorData.description,
      type: "website",
    },
  };
}

export default async function ColorDetailPage({ params }: ColorDetailPageProps) {
  const resolved =
    typeof (params as Promise<{ slug: string }>).then === "function"
      ? await (params as Promise<{ slug: string }>)
      : (params as { slug: string });
  const slug = typeof resolved?.slug === "string" ? resolved.slug : "";
  const entry = findColorBySlug(slug);

  if (!entry) {
    notFound();
  }

  const [colorName, colorData] = entry;
  const colorFrames = getFramesByColor(colorName);
  const featuredFrame =
    colorFrames.length > 0
      ? colorFrames.reduce((prev, current) =>
          (current.pricePerInch || 0) > (prev.pricePerInch || 0) ? current : prev
        )
      : null;
  const heroImage = getColorHeroImage(colorName);
  const galleryImages = getColorGalleryImages(colorName);
  const complementaryColors = getComplementaryColors(colorName);

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: brandConfig.seo?.canonicalUrl || "https://customframesizes.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Frames by Color",
        item: `${brandConfig.seo?.canonicalUrl || "https://customframesizes.com"}/frames/colors`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${colorData.displayName} Frames`,
        item: `${brandConfig.seo?.canonicalUrl || "https://customframesizes.com"}/frames/colors/${colorData.slug}`,
      },
    ],
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do ${colorData.displayName.toLowerCase()} frames work with any type of artwork?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${colorData.displayName} frames accommodate diverse artwork types including ${colorData.bestFor.slice(0, 2).join(", ")}, and ${colorData.bestFor[2] || "decorative prints"}. ${colorData.displayName === "Black" ? "Black frames create universal contrast suitable for both color and monochrome artwork." : colorData.displayName === "White" ? "White frames work particularly well with contemporary art, color photography, and bright modern compositions." : colorData.displayName + " frames work best with artwork sharing complementary color relationships."}`,
        },
      },
      {
        "@type": "Question",
        name: `What mat colors pair best with ${colorData.displayName.toLowerCase()} frames?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${colorData.displayName === "Black" ? "White, cream, and light gray mat boards create classic high-contrast pairings with black frames." : colorData.displayName === "White" ? "White mat boards create seamless monochromatic presentations, while colored mats add subtle variation." : colorData.displayName === "Gold" ? "Cream, ivory, and warm beige mat boards harmonize with gold finishes." : "Neutral mat boards (white, cream, gray) provide versatile foundations."}`,
        },
      },
      {
        "@type": "Question",
        name: `What sizes are available in ${colorData.displayName.toLowerCase()} picture frames?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Our ${colorData.displayName.toLowerCase()} picture frames are available in any custom size from 4×4 inches to 48×72 inches with 1/16 inch precision. Standard popular sizes include 8×10, 11×14, 16×20, 18×24, 24×36, and 30×40 inches.`,
        },
      },
    ],
  };

  // Product Schema
  const productSchema = featuredFrame
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${featuredFrame.name} - ${colorData.displayName} Picture Frame`,
        description: `${featuredFrame.shortDescription || featuredFrame.name} in ${colorData.displayName.toLowerCase()} finish. Custom sizes 4×4 to 48×72 inches.`,
        image: getCornerImage(featuredFrame).url,
        brand: {
          "@type": "Brand",
          name: brandConfig.name,
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: ((featuredFrame.pricePerInch || 0) * 20).toFixed(2),
          highPrice: ((featuredFrame.pricePerInch || 0) * 200).toFixed(2),
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Breadcrumb */}
              <div className="mb-6">
                <Button variant="ghost" size="sm" asChild data-testid="button-back-to-colors">
                  <Link href="/frames/colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All Frame Colors
                  </Link>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full border-2 border-border"
                      style={{ backgroundColor: colorData.hex }}
                      aria-label={`${colorData.displayName} color swatch`}
                    />
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {colorData.displayName} Picture Frames
                    </h1>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">{colorData.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" data-testid="badge-design-style">
                      {colorData.designStyle}
                    </Badge>
                    <Badge variant="outline" data-testid="badge-frame-count">
                      {colorFrames.length}{" "}
                      {colorFrames.length === 1 ? "Frame Style" : "Frame Styles"}
                    </Badge>
                  </div>
                </div>

                {heroImage && (
                  <div className="rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroImage.url}
                      alt={`${colorData.displayName} picture frames displayed in ${colorData.designStyle.toLowerCase()} interior`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Sizes */}
        <section className="container mx-auto px-4 py-8 border-b">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Popular {colorData.displayName} Frame Sizes</h2>
            <div className="flex flex-wrap gap-2">
              {["8x10", "11x14", "16x20", "18x24", "20x24", "24x36", "30x40"].map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  size="sm"
                  asChild
                  data-testid={`button-size-${size}`}
                >
                  <Link href={`/frames/sizes/${size}`}>
                    {size.replace("x", "×")}&quot; {colorData.displayName}
                  </Link>
                </Button>
              ))}
              <Button variant="ghost" size="sm" asChild data-testid="button-all-sizes">
                <Link href="/frames/sizes">All Sizes →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* All Frames Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {colorFrames.length > 0 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  All {colorData.displayName} Frames
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {colorFrames.map((frame) => (
                    <Link
                      key={frame.id}
                      href={`/picture-frames?frame=${frame.id}`}
                      data-testid={`card-frame-${frame.id}`}
                      className="block"
                    >
                      <Card className="hover-elevate active-elevate-2 overflow-hidden h-full cursor-pointer">
                        <div className="aspect-square bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getCornerImage(frame).url}
                            alt={`${frame.name} ${colorData.displayName.toLowerCase()} frame`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold mb-1">{frame.name} Frame</h3>
                          {frame.shortDescription && (
                            <p className="text-xs text-muted-foreground/80 italic mb-2">
                              {frame.shortDescription}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mb-3">
                            {frame.mouldingWidth}&quot; width
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Customize Frame
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Interactive Frame Designer */}
        <section className="container mx-auto px-4 py-12 border-t bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Design Your {colorData.displayName} Frame
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Try our interactive designer to customize your {colorData.displayName.toLowerCase()}{" "}
                frame with precise dimensions, mat boards, and glass options. See real-time pricing
                and visualization.
              </p>
            </div>
            <div data-designer-anchor>
              <Suspense
                fallback={
                  <div className="min-h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading designer...</p>
                    </div>
                  </div>
                }
              >
                <FrameDesigner defaultFrameId={featuredFrame?.id} embedded />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Lifestyle Gallery */}
        {galleryImages.length > 0 && (
          <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {galleryImages.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEO Content */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-5xl mx-auto space-y-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Why {colorData.displayName} Frames Work
              </h2>
              <p className="text-muted-foreground mb-4">
                {colorData.displayName} frames create {colorData.designStyle.toLowerCase()}{" "}
                aesthetics that work particularly well with{" "}
                {colorData.bestFor.slice(0, 2).join(" and ")}. This collection includes{" "}
                {colorFrames.length} {colorData.displayName.toLowerCase()} frame{" "}
                {colorFrames.length === 1 ? "style" : "styles"} in various widths and profiles.
              </p>
              <p className="text-muted-foreground">
                {colorData.description} Choose from our selection to find the perfect frame for your
                artwork and interior design style.
              </p>
            </div>

            {/* What Makes These Frames Different */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                What Makes These Frames Different
              </h2>
              {colorData.displayName === "Natural" && (
                <>
                  <p className="text-muted-foreground mb-4">
                    Real wood grain shows through. Oak has wide, pronounced grain lines—you&apos;ll
                    see texture and variation from piece to piece. Maple stays smooth and consistent
                    with tight grain. Walnut brings deep chocolate tones with subtle striping.
                  </p>
                  <p className="text-muted-foreground">
                    The finish is clear or lightly stained to preserve actual wood character.
                    You&apos;re getting real oak or maple, not MDF with a photo-printed wood
                    pattern. That means natural variation—no two frames look identical, and
                    that&apos;s the point.
                  </p>
                </>
              )}
              {(colorData.displayName === "Gold" || colorData.displayName === "Silver") && (
                <>
                  <p className="text-muted-foreground mb-4">
                    Metallic finishes are tricky. Cheap versions look like spray paint—flat,
                    lifeless, obviously fake. Quality metallic finishes use multi-layer application
                    that creates depth and catches light like actual metal.
                  </p>
                  <p className="text-muted-foreground">
                    {colorData.displayName === "Gold"
                      ? "Gold reflects warm yellow tones that shift as you move around the room. Traditional gold leaf creates the richest finish, while champagne gold stays more subtle."
                      : "Silver stays cool and crisp—think polished aluminum, not warm brass. The finish reflects light without going full mirror-shine, adding dimension without glare."}
                  </p>
                </>
              )}
              {colorData.displayName === "Black" && (
                <>
                  <p className="text-muted-foreground mb-4">
                    Black sounds simple until you see matte black next to satin black next to glossy
                    black on the same wall. Matte hides imperfections and feels modern. Satin adds
                    subtle sheen without going full-gloss. High-gloss creates that lacquered formal
                    look.
                  </p>
                  <p className="text-muted-foreground">
                    We lean toward satin black. It photographs well, doesn&apos;t show fingerprints,
                    and works in both traditional and modern spaces. Matte can look chalky in
                    certain lights. Gloss shows every smudge.
                  </p>
                </>
              )}
              {colorData.displayName === "White" && (
                <>
                  <p className="text-muted-foreground mb-4">
                    White isn&apos;t just white. Bright white has blue undertones and feels crisp
                    and modern—think gallery walls and contemporary spaces. Cream white leans warm
                    and traditional, complementing older homes and vintage artwork.
                  </p>
                  <p className="text-muted-foreground">
                    Our white frames trend toward true white rather than off-white. They stay
                    neutral, work with more artwork types, and don&apos;t look dingy next to pure
                    white mats.
                  </p>
                </>
              )}
              {!["Natural", "Gold", "Silver", "Black", "White"].includes(colorData.displayName) && (
                <>
                  <p className="text-muted-foreground mb-4">
                    {colorData.displayName} frames get their color from multi-coat finishing that
                    builds even coverage. Cheaper frames show wood grain bleeding through the paint
                    or have thin spots at the mitered corners where they&apos;re joined.
                  </p>
                  <p className="text-muted-foreground">
                    Quality finishing means consistent color from every angle. The frame should look
                    the same whether you&apos;re viewing it straight-on or from the side, without
                    lighter or darker patches.
                  </p>
                </>
              )}
              {colorFrames.length > 0 && (
                <p className="text-muted-foreground mt-4">
                  Frame depth matters for function, not aesthetics. Standard{" "}
                  {Math.min(...colorFrames.map((f) => f.usableDepth)).toFixed(3)}&quot; depth
                  handles prints with a single mat. Need double mats or thick watercolor paper?
                  You&apos;ll want more depth. Canvas prints or framed jerseys? The{" "}
                  {Math.max(...colorFrames.map((f) => f.usableDepth)).toFixed(3)}&quot; option gives
                  you room.
                </p>
              )}
            </div>

            {/* How to Use {color} Frames */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                How to Use {colorData.displayName} Frames
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Gallery Walls</h3>
                  <p className="text-muted-foreground">
                    {colorData.displayName === "Black" || colorData.displayName === "White"
                      ? `All-${colorData.displayName.toLowerCase()} gallery walls look intentional, not accidental. Mix narrow and wide frames freely—the matching color ties everything together. The art gets all the attention while the frames fade into a cohesive grid.`
                      : colorData.displayName === "Gold"
                        ? "Use gold sparingly on gallery walls—maybe one statement piece surrounded by simpler frames, or gold accent frames mixed with black. An entire wall of gold frames feels like overkill unless you&apos;re recreating a palace."
                        : colorFrames.length > 0
                          ? `Same-color gallery walls work best when you vary the frame widths. All thin frames look sparse, all thick frames feel heavy. Mix ${Math.min(...colorFrames.map((f) => f.mouldingWidth)).toFixed(3)}" and ${Math.max(...colorFrames.map((f) => f.mouldingWidth)).toFixed(3)}" widths to create rhythm without chaos.`
                          : `Same-color gallery walls work best when you vary the frame widths. Mix narrow and wide profiles to create rhythm without chaos.`}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mixing Colors</h3>
                  <p className="text-muted-foreground">
                    {colorData.displayName} pairs well with{" "}
                    {complementaryColors.map((c) => c.displayName.toLowerCase()).join(" and ")}{" "}
                    frames.{" "}
                    {colorData.displayName === "Black"
                      ? "Black anchors mixed-color arrangements—use it for your largest pieces, then add pops of gold or natural wood for smaller frames."
                      : colorData.displayName === "White"
                        ? "White softens bolder frame colors. Try white for your matted prints and natural wood for canvas pieces, or alternate white and black in a checkerboard pattern."
                        : colorData.displayName === "Natural"
                          ? "Natural wood mixes beautifully with white or black. Wood-framed landscapes next to black-framed photography creates texture contrast that feels organic, not forced."
                          : `Mix deliberately—alternate colors in a pattern (checkerboard works), group similar tones together, or create gradients from light to dark across a long wall.`}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mat Combinations</h3>
                  <p className="text-muted-foreground">
                    {colorData.displayName === "Black"
                      ? "White mats with black frames create that classic museum look—crisp, professional, always works. Cream mats warm it up slightly. Colored mats can work but tread carefully; black frames are strong enough that bold mat colors compete rather than complement."
                      : colorData.displayName === "White"
                        ? "White-on-white (white mat, white frame) makes the art float. Colored mats with white frames work great—navy blue mat with white frame for coastal prints, sage green for botanicals, blush pink for feminine spaces."
                        : colorData.displayName === "Gold"
                          ? "Cream and ivory mats harmonize with gold without competing. White mats create stronger contrast if you want the gold to stand out more. Avoid colored mats with gold—too much visual noise."
                          : colorData.displayName === "Natural" ||
                              colorData.displayName === "Brown" ||
                              colorData.displayName === "Espresso"
                            ? 'Off-white and cream mats complement wood tones naturally. Pure white creates more contrast if that&apos;s your goal. Mat width should balance frame width—thin frames need 2-3" mats, wider frames can handle 3-4".'
                            : `Neutral mats (white, cream, light gray) work with ${colorData.displayName.toLowerCase()} frames without fighting for attention. Size your mat proportionally—2-3" mats for narrow frames, 3-4" for wider mouldings.`}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Room Placement</h3>
                  <p className="text-muted-foreground">
                    {colorData.displayName === "Natural" ||
                    colorData.displayName === "Brown" ||
                    colorData.displayName === "Espresso"
                      ? "Match your wood tones to existing furniture or deliberately contrast them. Oak frames with walnut shelves creates layered warmth. Mixing light and dark woods prevents monotony."
                      : colorData.displayName === "Silver" || colorData.displayName === "Gray"
                        ? "Silver and gray frames echo modern fixtures—think stainless appliances, brushed nickel hardware, chrome faucets. They work naturally in kitchens, bathrooms, and contemporary spaces with metal accents."
                        : colorData.displayName === "Black"
                          ? "Black frames work everywhere but shine against light walls. On dark walls they can disappear unless you add dramatic lighting or go bold with white mats for contrast."
                          : colorData.displayName === "White"
                            ? "White frames on white walls create that gallery effect where frames become invisible. On colored walls (navy, sage, charcoal) white frames create breathing room around artwork."
                            : `Look at your room&apos;s existing colors before committing. ${colorData.displayName} frames should complement what's already there—your wall color, furniture, and the art itself.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Comparison Table */}
        <section className="container mx-auto px-4 py-12 border-t bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              {colorData.displayName} vs. Other Frame Colors
            </h2>
            <div className="bg-background rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-semibold">Frame Color</th>
                    <th className="text-left p-4 font-semibold">Best For</th>
                    <th className="text-left p-4 font-semibold">Design Style</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-primary/5">
                    <td className="p-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-border"
                          style={{ backgroundColor: colorData.hex }}
                          aria-hidden
                        />
                        {colorData.displayName}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{colorData.bestFor.slice(0, 2).join(", ")}</td>
                    <td className="p-4 text-sm">{colorData.designStyle}</td>
                  </tr>
                  {complementaryColors.map((color) => (
                    <tr key={color.slug} className="border-b">
                      <td className="p-4">
                        <Link
                          href={`/frames/colors/${color.slug}`}
                          className="flex items-center gap-2 hover:underline"
                        >
                          <div
                            className="w-6 h-6 rounded-full border-2 border-border"
                            style={{ backgroundColor: color.hex }}
                            aria-hidden
                          />
                          {color.displayName}
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {color.bestFor.slice(0, 2).join(", ")}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{color.designStyle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {colorData.displayName === "Black"
                ? "Black frames work with almost anything. The others have more specific use cases."
                : colorData.displayName === "White"
                  ? "White frames create breathing room. Use them when you want a softer, lighter feel than black."
                  : colorData.displayName === "Gold"
                    ? "Gold makes a statement. Use it selectively where you want formality and presence."
                    : colorData.displayName === "Natural"
                      ? "Natural wood adds warmth that painted frames can't match. Good for spaces with existing wood furniture."
                      : `${colorData.displayName} works best for ${(colorData.bestFor[0] ?? "artwork").toLowerCase()} where its ${colorData.designStyle.toLowerCase()} style fits naturally.`}
            </p>
          </div>
        </section>

        {/* Explore Similar Colors - always 3 items */}
        {complementaryColors.length > 0 && (
          <section className="container mx-auto px-4 py-12 border-t">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Explore Similar Colors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {complementaryColors.map((color) => (
                  <Link key={color.slug} href={`/frames/colors/${color.slug}`}>
                    <Card className="hover-elevate active-elevate-2 cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-border"
                            style={{ backgroundColor: color.hex }}
                            aria-label={`${color.displayName} color swatch`}
                          />
                          <h3 className="text-lg font-bold">{color.displayName} Frames</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {color.description}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          View {color.displayName} Frames
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/frames/colors">View All Frame Colors</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
