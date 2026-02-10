"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, Shirt, GraduationCap, LayoutGrid, Disc3, BookOpen, Film } from "lucide-react";
import { useState, useEffect } from "react";
import { getSharedAssetUrl, getStoreBaseAssetUrl } from "@framecraft/core";
import type { LucideIcon } from "lucide-react";

interface SpecialtyDesigner {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  icon: LucideIcon;
  features: string[];
  image: string;
  imageAlt: string;
  category?: "memorabilia" | "collectibles" | "personal" | "display";
}

const SPECIALTY_DESIGNERS: SpecialtyDesigner[] = [
  {
    id: "jersey",
    name: "Jersey Frame Designer",
    tagline: "Display Your Team Pride",
    description:
      "Deep shadowbox frames built to showcase sports jerseys with professional mounting.",
    href: "/jersey-frames",
    icon: Shirt,
    features: ["Multiple depths available", "Jersey mounting included", "Team color mats"],
    image: getStoreBaseAssetUrl("frames/10727/10727_jersey_lifestyle_01.jpg"),
    imageAlt: "Framed sports jersey displayed in home office",
    category: "memorabilia",
  },
  {
    id: "diploma",
    name: "Diploma Frame Designer",
    tagline: "Honor Your Achievement",
    description:
      "Elegant frames sized for diplomas and degrees with archival matting to protect your credentials.",
    href: "/diploma-frames",
    icon: GraduationCap,
    features: ["University seal cutouts", "Double mat options", "Gold & silver accents"],
    image: getSharedAssetUrl("signature-frames/lifestyle/graduates-friends-diplomas.jpg"),
    imageAlt: "Young graduates holding framed diplomas",
    category: "personal",
  },
  {
    id: "collage",
    name: "Collage Frame Designer",
    tagline: "Tell Your Story",
    description:
      "Multi-opening frames for showcasing photo collections, family memories, and milestone moments.",
    href: "/collage-frames",
    icon: LayoutGrid,
    features: ["Multiple layouts", "Mixed photo sizes", "Custom openings"],
    image: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-1.jpg"),
    imageAlt: "Family photo collage frame on living room wall",
    category: "personal",
  },
  {
    id: "record",
    name: "Record Album Frame Designer",
    tagline: "Frame Your Vinyl",
    description:
      'Frames designed for 12" vinyl records and album covers with easy-access design for swapping.',
    href: "/record-album-frames",
    icon: Disc3,
    features: ['Fits 12" vinyl', "Easy record swap", "Wall-ready display"],
    image: getSharedAssetUrl("record-album/lifestyle/Record_Frame_Lifestyle (10).png"),
    imageAlt: "Vinyl record album displayed in black frame",
    category: "collectibles",
  },
  {
    id: "comic",
    name: "Comic Book Frame Designer",
    tagline: "Protect Your Collection",
    description:
      "Precision frames for CGC slabs, raw comics, and graphic novels with archival protection.",
    href: "/comic-book-frames",
    icon: BookOpen,
    features: ["CGC slab compatible", "Archival backing", "Multiple sizes"],
    image: getSharedAssetUrl("comic/lifestyle/ComicFrame_Lifestyle (35).png"),
    imageAlt: "Framed comic book collection on display",
    category: "collectibles",
  },
  {
    id: "movie-poster",
    name: "Movie Poster Frame Designer",
    tagline: "Cinema at Home",
    description:
      "Frames for onesheet movie posters in standard and custom sizes with non-glare options.",
    href: "/movie-poster-frames",
    icon: Film,
    features: ["27×40 onesheet size", "Non-glare acrylic", "Theater-style display"],
    image: getSharedAssetUrl("record-album/lifestyle/Record_Frame_Lifestyle (1).png"),
    imageAlt: "Movie poster framed in home theater room",
    category: "memorabilia",
  },
];

interface SpecialtyDesignersShowcaseProps {
  showAll?: boolean;
}

export function SpecialtyDesignersShowcase({ showAll = false }: SpecialtyDesignersShowcaseProps) {
  const [displayDesigners, setDisplayDesigners] = useState<SpecialtyDesigner[]>([]);

  useEffect(() => {
    if (showAll) {
      setDisplayDesigners(SPECIALTY_DESIGNERS);
    } else {
      const shuffled = [...SPECIALTY_DESIGNERS].sort(() => Math.random() - 0.5);
      setDisplayDesigners(shuffled.slice(0, 2));
    }
  }, [showAll]);

  if (displayDesigners.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-12" data-testid="section-specialty-designers">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2
            className="font-serif text-3xl font-semibold mb-2"
            data-testid="text-specialty-heading"
          >
            Specialty Frame Designers
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Purpose-built tools for framing sports memorabilia, collectibles, and cherished
            keepsakes
          </p>
        </div>

        <div
          className={`grid grid-cols-1 ${showAll ? "md:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-2"} gap-6 max-w-6xl mx-auto`}
        >
          {displayDesigners.map((designer) => (
            <div
              key={designer.id}
              className="group bg-card rounded-lg border overflow-hidden transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-1"
              data-testid={`specialty-card-${designer.id}`}
            >
              <div className={`grid grid-cols-1 ${showAll ? "" : "sm:grid-cols-2"}`}>
                <div className="relative aspect-[4/3]">
                  <img
                    src={designer.image}
                    alt={designer.imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden" />
                </div>

                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <designer.icon className="h-5 w-5 text-primary" />
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">
                        {designer.tagline}
                      </span>
                    </div>
                    <h3
                      className="font-serif text-xl font-semibold mb-2"
                      data-testid={`text-specialty-name-${designer.id}`}
                    >
                      {designer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{designer.description}</p>

                    <ul className="space-y-1 mb-4">
                      {designer.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-xs text-muted-foreground flex items-center gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={designer.href}>
                    <Button
                      size="sm"
                      className="w-full"
                      data-testid={`button-specialty-${designer.id}`}
                    >
                      Start Designing
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showAll && (
          <div className="text-center mt-8">
            <Link href="/specialty-frames">
              <Button variant="outline" size="lg" data-testid="button-view-all-specialty">
                Explore All Specialty Designers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        <div className="text-center mt-6 max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {showAll
              ? "Each specialty designer is built for specific items. Choose the right tool for jerseys, diplomas, certificates, vinyl records, comic books, onesheet movie posters, military memorabilia, Playbills, stamps, currency, needlework, CDs, newspapers, magazines, sonograms, wedding invitations, canvas art, shadowbox displays, graded cards, hockey pucks, puzzles, ticket stubs, preserved bouquets, and autographed items."
              : "Each specialty designer is built for specific items—jerseys, diplomas, records, comics, onesheet movie posters, and military memorabilia. Get the right frame depth, mat options, and mounting for your collection."}
          </p>
        </div>
      </div>
    </section>
  );
}

export { SPECIALTY_DESIGNERS };
