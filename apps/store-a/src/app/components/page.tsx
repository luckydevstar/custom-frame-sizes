import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  SquareStack,
  Layers,
  Shield,
  Lock,
  ChevronRight,
  CheckCircle2,
  PackageOpen,
  Percent,
  Sparkles,
} from "lucide-react";
import { Card } from "@framecraft/ui";
import { Button } from "@framecraft/ui";

export const metadata: Metadata = {
  title: "Professional Framing Components & Supplies | Custom Frame Sizes",
  description:
    "Shop professional framing materials including custom-cut acrylic glazing, foam board backing, and hardware supplies. Industry-grade quality with bulk pricing for frame shops and DIY professionals.",
  openGraph: {
    title: "Professional Framing Components & Supplies",
    description:
      "Industry-grade framing materials: acrylic glazing, foam board, security hardware, cleat hangers, brass nameplates, and acrylic cleaner.",
    type: "website",
  },
};

const categories = [
  {
    title: "Acrylic Sheets",
    description:
      "Custom-cut acrylic glazing in regular and non-glare finishes. Popular sizes like 11x14, 8x10, 24x36, 16x20, and 18x24 available with instant pricing.",
    href: "/components/acrylic",
    icon: Layers,
    image: "/images/blog/botanical-frame-hero.png",
    imageAlt:
      "Professional acrylic sheet glazing for custom picture frames with crystal-clear transparency",
    features: ["Regular & Non-Glare", "Custom Sizes", "Bulk Packs Available"],
  },
  {
    title: "Foam Board",
    description:
      "Professional mounting boards in white, black, and self-adhesive options. Popular sizes like 24x36, 8x10, 13x19, 11x17, and 12x18 for photo mounting and frame backing.",
    href: "/components/foam-board",
    icon: SquareStack,
    image: "/images/blog/botanical-frame-hero.png",
    imageAlt:
      "White foam board mounting material for professional picture framing and artwork backing",
    features: ["Multiple Colors", "Self-Adhesive Option", "Wholesale Pricing"],
  },
  {
    title: "Security Hardware Kit",
    description:
      "Museum-grade anti-theft hanging system with T-screws and locking brackets. Prevents unauthorized removal in galleries, hotels, and commercial spaces.",
    href: "/components/security-hardware-kit",
    icon: Lock,
    image: "/images/blog/botanical-frame-hero.png",
    imageAlt:
      "Professional security hardware kit with tamper-proof T-screws, wall brackets, and security wrench",
    features: ["Tamper-Proof T-Screws", "Museum-Grade Security", "Complete Kit - $8.95"],
  },
  {
    title: '12" Cleat Hangers',
    description:
      "Heavy-duty French cleat hanging system for large and oversized frames. Rock-solid interlocking design with perfect leveling every time.",
    href: "/components/cleat-hangers",
    icon: Shield,
    image: "/images/blog/botanical-frame-hero.png",
    imageAlt: "12-inch heavy-duty metal French cleat bar hanging system for large picture frames",
    features: ["Heavy-Duty Support", "Perfect Leveling", "Professional Grade"],
  },
  {
    title: "Brass Nameplates",
    description:
      'Custom laser-engraved brass nameplates in any size from 1.5" to 12". Four finishes, five fonts, and decorative icons for personalized plaques.',
    href: "/components/brass-nameplates",
    icon: Sparkles,
    image: "/images/blog/botanical-frame-hero.png",
    imageAlt: "Custom laser-engraved brass nameplate with personalized text",
    features: ['Custom Sizes 1.5"-12"', "4 Finish Options", "Decorative Icons"],
  },
  {
    title: "Acrylic Cleaner",
    description:
      "Professional-grade cleaner for acrylic glazing. Anti-static formula resists dust and fingerprints. Safe for all acrylic surfaces.",
    href: "/components/acrylic-cleaner",
    icon: Shield,
    image: "/images/blog/botanical-frame-hero.png",
    imageAlt: "NOVUS acrylic cleaner and polish bottle for picture frame glazing",
    features: ["Safe for Acrylic", "Anti-Static Formula", "8oz Bottle - $9.95"],
  },
];

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6">
              Professional Framing Components
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6">
              Industry-grade materials for professional frame shops and serious DIY framers. Custom
              sizes, bulk pricing, and same-day cutting available.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base">Cut to Size</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base">Bulk Discounts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base">Pro Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Components Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.href} href={category.href} className="block h-full">
                <Card className="p-0 overflow-hidden hover-elevate transition-all h-full flex flex-col cursor-pointer">
                  <div className="aspect-[16/9] overflow-hidden bg-muted relative">
                    <Image
                      src={category.image}
                      alt={category.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-2">{category.title}</h2>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex-1">
                      <ul className="space-y-2 mb-4 sm:mb-6">
                        {category.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      className="w-full"
                      data-testid={`button-${category.href.split("/").pop()}`}
                    >
                      Shop {category.title}
                    </Button>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* What We Offer - SEO Rich Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 border-t bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
            Complete Framing Materials for Every Project
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-center mb-8 sm:mb-12">
            Whether you&apos;re running a professional frame shop or creating custom frames at home,
            our components deliver the quality and precision you need. From UV-protective acrylic
            glazing to archival foam board and professional-grade hanging hardware, every material
            is selected for durability and performance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <PackageOpen className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Custom Sizing</h3>
              <p className="text-sm text-muted-foreground">
                Precision-cut to your exact specifications. No standard sizes—every piece tailored
                to your project.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Professional Quality</h3>
              <p className="text-sm text-muted-foreground">
                Industry-standard materials trusted by frame shops nationwide for archival
                preservation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Percent className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Volume Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Save up to 40% with bulk packs. Perfect for professional framers and high-volume
                projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Built for Professionals & Enthusiasts
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Our framing components serve frame shops, galleries, photographers, artists, and DIY
            framers who demand professional results. All materials meet archival standards for
            long-term preservation.
          </p>
        </div>
      </section>
    </div>
  );
}
