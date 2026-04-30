import {
  MAGAZINE_REFERENCES,
  MAGAZINE_SIZES,
  formatMagazineNameForSEO,
  type MagazineReference,
  type MagazineSize,
} from "@framecraft/core";
import { Badge } from "@framecraft/ui/components/ui/badge";
import { Button } from "@framecraft/ui/components/ui/button";
import { Card } from "@framecraft/ui/components/ui/card";
import { ArrowRight, BookOpen, ExternalLink, Ruler, Star } from "lucide-react";
import Link from "next/link";

type MagazineSizeWithRefs = MagazineSize & { magazines: MagazineReference[] };

function buildMagazinesBySize(): MagazineSizeWithRefs[] {
  return MAGAZINE_SIZES.map((size) => ({
    ...size,
    magazines: MAGAZINE_REFERENCES.filter((mag) => mag.sizeId === size.id),
  }));
}

function circulationSuffix(
  variant: "compact" | "standard" | "large",
  magazines: MagazineReference[],
): string | null {
  const firstMag = magazines[0];
  if (!firstMag?.circulation) return null;
  if (variant === "standard") return ` ${firstMag.name} ${firstMag.circulation}.`;
  return ` ${firstMag.name} has ${firstMag.circulation}.`;
}

function MagazineCategorySection({
  title,
  intro,
  sizes,
  variant,
}: {
  title: string;
  intro: string;
  sizes: MagazineSizeWithRefs[];
  variant: "compact" | "standard" | "large";
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-6">{intro}</p>

      {sizes.map((size) => {
        const topMagazines = size.magazines.filter((m) => m.category === "current").slice(0, 3);
        const magazineNames = topMagazines.map((m) => m.name).join(", ");
        const circ = circulationSuffix(variant, size.magazines);

        return (
          <div key={size.id} className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  {size.width} × {size.height} inch Magazine Frame Size
                  {size.id === "standard-8x105" && (
                    <Badge variant="default" className="ml-2">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                </h3>
                {size.magazines.length > 0 && (
                  <p className="text-base mt-2 leading-relaxed">
                    The {size.width}×{size.height} inch magazine size is used by{" "}
                    {magazineNames || "various publications"}.{circ ?? ""}{" "}
                    {variant === "compact"
                      ? `This compact format measures exactly ${size.width} inches wide by ${size.height} inches tall.`
                      : variant === "standard"
                        ? `This standard format measures exactly ${size.width} inches wide by ${size.height} inches tall.`
                        : `This large format measures exactly ${size.width} inches wide by ${size.height} inches tall.`}
                    {size.id === "standard-8x105" &&
                      " This is the most popular magazine size in the United States."}
                    {size.id === "large-105x14" &&
                      " This is the classic Life Magazine size, known for stunning photojournalism displays."}
                  </p>
                )}
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link href={`/magazine-frames?format=${size.id}`}>Frame This Size</Link>
              </Button>
            </div>

            {size.magazines.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-semibold">Magazine Name</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {size.magazines.map((mag, idx) => (
                      <tr key={`${mag.name}-${idx}`} className="border-t">
                        <td className="p-3 font-medium">{formatMagazineNameForSEO(mag.name)}</td>
                        <td className="p-3">
                          {mag.category === "current" ? (
                            <Badge variant="default">Currently Published</Badge>
                          ) : (
                            <Badge variant="secondary">Historical</Badge>
                          )}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {mag.circulation || mag.era || mag.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

/** b-shadow-box-frames-original/client/src/pages/MagazineSizesGuide.tsx */
export function MagazineSizesGuidePageContent() {
  const magazinesBySize = buildMagazinesBySize();
  const compactSizes = magazinesBySize.filter((s) => s.category === "compact");
  const standardSizes = magazinesBySize.filter((s) => s.category === "standard");
  const largeSizes = magazinesBySize.filter((s) => s.category === "large");

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="container max-w-5xl mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Magazine Frame Sizes Guide</h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Find the exact frame size for any magazine. This guide shows dimensions for TIME, Vogue, National
              Geographic, Rolling Stone, Life Magazine, and 30+ popular magazines.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" data-testid="button-start-framing">
                <Link href="/magazine-frames" className="inline-flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Framing Your Magazine
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-all-designers">
                <Link href="/">Browse All Frame Designers</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Size Lookup</h2>
          <p className="text-muted-foreground mb-6">The most common magazine sizes and which magazines use them.</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">TIME Magazine</h3>
              <p className="text-2xl font-bold text-primary mb-1">8 × 10½ inches</p>
              <p className="text-sm text-muted-foreground mb-3">Also fits: People, Entertainment Weekly</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/magazine-frames?format=standard-8x105" className="inline-flex items-center justify-center">
                  Frame This Size
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">National Geographic</h3>
              <p className="text-2xl font-bold text-primary mb-1">7 × 10 inches</p>
              <p className="text-sm text-muted-foreground mb-3">Also fits: The Atlantic</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/magazine-frames?format=compact-7x10" className="inline-flex items-center justify-center">
                  Frame This Size
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Vogue</h3>
              <p className="text-2xl font-bold text-primary mb-1">8¾ × 11 inches</p>
              <p className="text-sm text-muted-foreground mb-3">High fashion format</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/magazine-frames?format=standard-875x11" className="inline-flex items-center justify-center">
                  Frame This Size
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Rolling Stone</h3>
              <p className="text-2xl font-bold text-primary mb-1">10 × 12 inches</p>
              <p className="text-sm text-muted-foreground mb-3">
                Classic and current format (1980s-2008, 2018-present)
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/magazine-frames?format=large-10x12" className="inline-flex items-center justify-center">
                  Frame This Size
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Life Magazine</h3>
              <p className="text-2xl font-bold text-primary mb-1">10½ × 14 inches</p>
              <p className="text-sm text-muted-foreground mb-3">Classic large format (1936-1972)</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/magazine-frames?format=large-105x14" className="inline-flex items-center justify-center">
                  Frame This Size
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Harper&apos;s Bazaar</h3>
              <p className="text-2xl font-bold text-primary mb-1">9 × 11 inches</p>
              <p className="text-sm text-muted-foreground mb-3">Also fits: Elle, Marie Claire, Town & Country</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/magazine-frames?format=standard-9x11" className="inline-flex items-center justify-center">
                  Frame This Size
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </Card>
          </div>
        </section>

        <MagazineCategorySection
          title="Compact Magazine Sizes"
          variant="compact"
          intro="Small format magazines fit easily in bags and are often collected for their compact size. These dimensions are well suited to displaying vintage digest-sized publications and modern compact formats."
          sizes={compactSizes}
        />

        <MagazineCategorySection
          title="Standard Magazine Sizes"
          variant="standard"
          intro='The most common magazine formats used by major weekly and monthly publications. These are the standard sizes most people think of when they picture a magazine. Standard formats range from 8×10.5 inches to 9×11 inches.'
          sizes={standardSizes}
        />

        <MagazineCategorySection
          title="Large Format Magazine Sizes"
          variant="large"
          intro="Premium oversized magazines used for high fashion, photography, and collectible publications. Large format magazines range from 9×12 inches to 10.5×14 inches. These larger formats create stunning wall displays and showcase photography beautifully."
          sizes={largeSizes}
        />

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Magazine Size Facts</h2>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Most Popular Magazine Size</h3>
              <p className="text-muted-foreground">
                The 8×10.5 inch format is the most popular magazine size in the United States. TIME magazine, People
                magazine, and Entertainment Weekly all use this exact size.
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">National Geographic Size History</h3>
              <p className="text-muted-foreground">
                National Geographic has used the 7×10 inch format since 1888. This compact size makes it ideal for
                collecting and displaying. As of 2024, National Geographic has 1.65 million subscribers worldwide.
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Vogue Magazine Format Change</h3>
              <p className="text-muted-foreground">
                Vogue magazine increased its trim size from 8×10.875 inches to 9×10.875 inches in March 2016. This size
                change was designed to compete with other high fashion magazines and improve advertising appeal.
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Rolling Stone Size Changes</h3>
              <p className="text-muted-foreground">
                Rolling Stone magazine has changed sizes multiple times. From 1980-2008, it was 10×12 inches. From
                2008-2018, it was 8×11 inches. In July 2018, Rolling Stone returned to its classic 10×12 inch large format.
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Life Magazine Peak Circulation</h3>
              <p className="text-muted-foreground">
                Life Magazine reached peak circulation of 8.5 million copies in 1969. The magazine used a large 10.5×14
                inch format suited to photojournalism. Life published weekly from 1936 to 1972.
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Common Questions About Magazine Frame Sizes</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What size frame do I need for TIME magazine?</h3>
              <p className="text-muted-foreground mb-2">
                TIME magazine measures 8 inches wide by 10.5 inches tall. You need an 8×10.5 inch frame size. This is the
                most popular magazine size and also fits People magazine and Entertainment Weekly.
              </p>
              <Link href="/magazine-frames?format=standard-8x105" className="text-sm text-primary hover:underline inline-flex items-center">
                Frame TIME magazine size →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What size is National Geographic magazine?</h3>
              <p className="text-muted-foreground mb-2">
                National Geographic magazine is 7 inches wide by 10 inches tall. This compact format has been used since the
                magazine launched and makes it well suited to collecting. The Atlantic magazine also uses this same 7×10 inch
                size.
              </p>
              <Link href="/magazine-frames?format=compact-7x10" className="text-sm text-primary hover:underline inline-flex items-center">
                Frame National Geographic size →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What size frame for Vogue magazine?</h3>
              <p className="text-muted-foreground mb-2">
                Vogue magazine measures 8.75 inches wide by 11 inches tall. This is slightly larger than standard letter
                size and requires an 8.75×11 inch frame. Vogue increased to this size in 2016 to compete with other high
                fashion magazines.
              </p>
              <Link href="/magazine-frames?format=standard-875x11" className="text-sm text-primary hover:underline inline-flex items-center">
                Frame Vogue magazine size →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What size is Rolling Stone magazine?</h3>
              <p className="text-muted-foreground mb-2">
                Rolling Stone currently measures 10.5 inches wide by 12 inches tall. This large format was used from
                1980-2008 and returned in July 2018. From 2008-2018, Rolling Stone used a smaller 8×11 inch format. Check
                your issue date to determine the correct size.
              </p>
              <Link href="/magazine-frames?format=large-105x12" className="text-sm text-primary hover:underline inline-flex items-center">
                Frame Rolling Stone size →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What size frame for Life Magazine?</h3>
              <p className="text-muted-foreground mb-2">
                Life Magazine uses a large 10.5 inch by 14 inch format. This oversized format was designed for the iconic
                photojournalism Life was known for. Life Magazine published weekly from 1936 to 1972. Look Magazine also used
                this same 10.5×14 inch size.
              </p>
              <Link href="/magazine-frames?format=large-105x14" className="text-sm text-primary hover:underline inline-flex items-center">
                Frame Life Magazine size →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I frame multiple magazines together?</h3>
              <p className="text-muted-foreground mb-2">
                Yes. Our magazine frame designer lets you frame 1 to 30 magazines in a single frame. You can create grids,
                rows, or collages of your magazine collection. Popular layouts include 2-side-by-side, 3-horizontal, 4-quad,
                6-grid, 9-grid, and more.
              </p>
              <Link href="/magazine-frames" className="text-sm text-primary hover:underline inline-flex items-center">
                Design multi-magazine frame →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Do magazine sizes vary by country?</h3>
              <p className="text-muted-foreground">
                Yes. US magazines use inches while international editions often use metric sizes. The dimensions listed on
                this page are for US editions. If you have an international edition, measure your magazine to find the
                closest size.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How do I measure my magazine for framing?</h3>
              <p className="text-muted-foreground">
                Measure the magazine width and height in inches. Width is measured left to right. Height is measured top to
                bottom. Round to the nearest quarter inch. Most magazines match one of the standard sizes listed on this
                page.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center py-12 px-4 bg-muted/30 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Frame Your Magazine?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Use our interactive designer to create a custom frame for your magazine collection. Choose your size, layout,
            frame style, and mat colors in real-time.
          </p>
          <Button asChild size="lg" data-testid="button-cta-designer">
            <Link href="/magazine-frames" className="inline-flex items-center">
              Start Designing Your Magazine Frame
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
