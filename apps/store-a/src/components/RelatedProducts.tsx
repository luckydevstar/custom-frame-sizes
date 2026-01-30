"use client";

import Link from "next/link";
import {
  ArrowRight,
  Frame,
  Award,
  Layers,
  Heart,
  Flower2,
  PenTool,
  Image,
  Ticket,
  Music,
  Newspaper,
  BookOpen,
  Star,
  Gamepad2,
  Baby,
  GraduationCap,
  Shirt,
  Grid3x3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@framecraft/ui";

export interface RelatedProduct {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  testId?: string;
}

const PRODUCT_CATALOG: Record<string, RelatedProduct> = {
  "picture-frames": {
    href: "/picture-frames",
    icon: Frame,
    title: "Custom Picture Frames",
    subtitle: "Any size you need",
  },
  "certificate-frames": {
    href: "/certificate-frames",
    icon: Award,
    title: "Certificate Frames",
    subtitle: "Diplomas & documents",
  },
  "collage-frames": {
    href: "/collage-frames",
    icon: Layers,
    title: "Collage Frames",
    subtitle: "Multi-photo displays",
  },
  "wedding-invitation": {
    href: "/wedding-invitation-frames",
    icon: Heart,
    title: "Wedding Invitation Frames",
    subtitle: "Preserve your invitation",
  },
  "preserved-bouquet": {
    href: "/bouquet-frames",
    icon: Flower2,
    title: "Preserved Bouquet Frames",
    subtitle: "Display dried flowers",
  },
  "signature-frames": {
    href: "/signature-frames",
    icon: PenTool,
    title: "Signature Frames",
    subtitle: "Autographs & memorabilia",
  },
  "photo-frames": {
    href: "/picture-frames",
    icon: Image,
    title: "Photo Frames",
    subtitle: "For your photos",
  },
  "ticket-frames": {
    href: "/ticket-frames",
    icon: Ticket,
    title: "Ticket Stub Frames",
    subtitle: "Concert & event tickets",
  },
  "playbill-frames": {
    href: "/playbill-frames",
    icon: Music,
    title: "Playbill Frames",
    subtitle: "Broadway programs",
  },
  "newspaper-frames": {
    href: "/newspaper-frames",
    icon: Newspaper,
    title: "Newspaper Frames",
    subtitle: "Historic headlines",
  },
  "magazine-frames": {
    href: "/magazine-frames",
    icon: BookOpen,
    title: "Magazine Frames",
    subtitle: "Magazine covers",
  },
  "comic-frames": {
    href: "/comic-book-frames",
    icon: Star,
    title: "Comic Book Frames",
    subtitle: "Comics & graphic novels",
  },
  "puzzle-frames": {
    href: "/puzzle-frames",
    icon: Gamepad2,
    title: "Puzzle Frames",
    subtitle: "Completed puzzles",
  },
  "sonogram-frames": {
    href: "/sonogram-frames",
    icon: Baby,
    title: "Sonogram Frames",
    subtitle: "Ultrasound keepsakes",
  },
  "diploma-frames": {
    href: "/diploma-certificate-frames",
    icon: GraduationCap,
    title: "Diploma Frames",
    subtitle: "Graduation diplomas",
  },
  "jersey-frames": {
    href: "/jersey-frames",
    icon: Shirt,
    title: "Jersey Frames",
    subtitle: "Sports jerseys",
  },
  "mat-boards": {
    href: "/picture-frames",
    icon: Grid3x3,
    title: "Custom Mat Boards",
    subtitle: "Matting only",
  },
};

interface RelatedProductsProps {
  productKeys: string[];
  title?: string;
  columns?: 2 | 3 | 4 | 5;
}

export function RelatedProducts({
  productKeys,
  title = "Related Products",
  columns = 3,
}: RelatedProductsProps) {
  const products = productKeys
    .map((key) => ({ ...PRODUCT_CATALOG[key], key }))
    .filter((p) => p.href);

  if (products.length === 0) return null;

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
    5: "md:grid-cols-3 lg:grid-cols-5",
  }[columns];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
        <div className={`grid grid-cols-1 ${gridCols} gap-4 max-w-5xl mx-auto`}>
          {products.map((product) => (
            <Link key={product.key} href={product.href}>
              <Card
                className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full"
                data-testid={product.testId ?? `related-${product.key}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <product.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm leading-tight">{product.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{product.subtitle}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
