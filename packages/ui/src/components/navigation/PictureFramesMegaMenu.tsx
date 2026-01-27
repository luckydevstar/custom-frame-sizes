"use client";

import Link from "next/link";
import {
  Palette,
  Ruler,
  Grid3x3,
  GraduationCap,
  Disc3,
  Disc,
  Puzzle,
  ArrowRight,
  BookOpen,
  CreditCard,
  PenLine,
  Theater,
  Newspaper,
  Book,
  FileCheck2,
  Ticket,
  Scissors,
  Baby,
  Heart,
  Film,
} from "lucide-react";

export function PictureFramesMegaMenu() {
  const browseOptions = [
    { label: "Browse by Color", href: "/frames/colors", icon: Palette },
    { label: "Browse by Size", href: "/frames/sizes", icon: Ruler },
    { label: "Browse by Style", href: "/frames/styles", icon: Grid3x3 },
  ];

  const specialtyFrames = [
    { label: "CD Frames", href: "/cd-frames", icon: Disc },
    { label: "Certificate Frames", href: "/certificate-frames", icon: FileCheck2 },
    { label: "Comic Book Frames", href: "/comic-book-frames", icon: BookOpen },
    {
      label: "Diploma Frames",
      href: "/diploma-certificate-frames",
      icon: GraduationCap,
    },
    { label: "Graded Card Frames", href: "/card-frames", icon: CreditCard },
    { label: "Magazine Frames", href: "/magazine-frames", icon: Book },
    { label: "Movie Poster Frames", href: "/movie-poster-frames", icon: Film },
    {
      label: "Needlework Frames",
      href: "/specialty/needlework",
      icon: Scissors,
    },
    { label: "Newspaper Frames", href: "/newspaper-frames", icon: Newspaper },
    {
      label: "Photo Collage Frames",
      href: "/collage-frames",
      icon: Grid3x3,
    },
    { label: "Playbill Frames", href: "/playbill-frames", icon: Theater },
    { label: "Puzzle Frames", href: "/puzzle-frames", icon: Puzzle },
    {
      label: "Record Album Frames",
      href: "/specialty/record-album-frames",
      icon: Disc3,
    },
    { label: "Signature Frames", href: "/signature-frames", icon: PenLine },
    { label: "Sonogram Frames", href: "/sonogram-frames", icon: Baby },
    { label: "Ticket Frames", href: "/ticket-frames", icon: Ticket },
    {
      label: "Wedding Invitation Frames",
      href: "/wedding-invitation-frames",
      icon: Heart,
    },
  ];

  const midpoint = Math.ceil(specialtyFrames.length / 2);
  const leftColumn = specialtyFrames.slice(0, midpoint);
  const rightColumn = specialtyFrames.slice(midpoint);

  return (
    <div className="p-8 min-w-[820px]" data-testid="megamenu-picture-frames-content">
      <div className="flex gap-12">
        {/* Left: Browse Options */}
        <div>
          <Link href="/picture-frames" data-testid="link-megamenu-view-all-picture-frames">
            <div className="flex items-center justify-between px-4 py-3 mb-5 rounded-md bg-primary/5 border border-primary/20 hover-elevate active-elevate-2">
              <div>
                <div className="font-semibold text-sm text-primary">View All Picture Frames</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Browse our complete collection
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 ml-4" />
            </div>
          </Link>

          <h3 className="font-semibold text-sm text-muted-foreground mb-4 px-3">Browse By</h3>
          <div className="space-y-1">
            {browseOptions.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`link-megamenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover-elevate active-elevate-2">
                    <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Specialty Frames in 2 Sub-Columns */}
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-muted-foreground mb-4 px-3">
            Specialty Frames
          </h3>
          <div className="grid grid-cols-2 gap-x-8">
            <div className="space-y-1">
              {leftColumn.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-testid={`link-megamenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover-elevate active-elevate-2">
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm whitespace-nowrap">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="space-y-1">
              {rightColumn.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-testid={`link-megamenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover-elevate active-elevate-2">
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm whitespace-nowrap">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
