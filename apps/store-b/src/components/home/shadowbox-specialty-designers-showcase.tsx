"use client";

import { getSharedAssetUrl, getStoreBaseAssetUrl, getStoreAssetUrl } from "@framecraft/core";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@framecraft/ui/components/ui/button";

/**
 * origina-store-b/client/src/components/home/SpecialtyDesignersShowcase.tsx
 * Featured grid only (showAll=false) — six cards, not the generic @framecraft/ui shuffle.
 */

interface FeaturedDesigner {
  id: string;
  name: string;
  tagline: string;
  href: string;
  image: string;
  imageAlt: string;
}

function featuredDesigners(): FeaturedDesigner[] {
  return [
    {
      id: "jersey",
      name: "Jersey Shadow Boxes",
      tagline: "Game-worn, signed, or retired jerseys",
      href: "/jersey-frames",
      image: getStoreBaseAssetUrl("frames/10727/10727_jersey_lifestyle_01.jpg"),
      imageAlt: "Framed sports jersey displayed in shadow box frame",
    },
    {
      id: "military",
      name: "Military Shadow Boxes",
      tagline: "Retirement, service, and memorial displays",
      href: "/military-frames",
      image: getStoreBaseAssetUrl("military/lifestyle/lifestyle_01.jpg"),
      imageAlt: "Military shadow box with medals and flag",
    },
    {
      id: "bouquet",
      name: "Bouquet Shadow Boxes",
      tagline: "Preserved wedding flowers and dried botanicals",
      href: "/bouquet-frames",
      image: getStoreBaseAssetUrl("frames/10774/lifestyle-preserved-flowers-display.jpg"),
      imageAlt: "Preserved wedding bouquet in shadow box frame",
    },
    {
      id: "challenge-coin",
      name: "Challenge Coin Displays",
      tagline: "Military, law enforcement, and corporate coins",
      href: "/challenge-coin-frames",
      image: getStoreAssetUrl("challenge-coin/lifestyle/challenge_coin_lifestyle_01.jpg"),
      imageAlt: "Challenge coins displayed in custom shadow box frame",
    },
    {
      id: "ticket",
      name: "Memorabilia & Ticket Frames",
      tagline: "Concert stubs, sports tickets, and event keepsakes",
      href: "/ticket-frames",
      image: getSharedAssetUrl("ticket-frames/lifestyle/ticket_frame_lifestyle_(16)_1766009757683.jpeg"),
      imageAlt: "Framed concert ticket stubs and event memorabilia",
    },
    {
      id: "collage",
      name: "Photo Collage Shadow Boxes",
      tagline: "Multiple photos in one display",
      href: "/collage-frames",
      image: getSharedAssetUrl("collage/lifestyle/collage-lifestyle-1.jpg"),
      imageAlt: "Photo collage shadow box frame on living room wall",
    },
  ];
}

export function ShadowboxSpecialtyDesignersShowcase() {
  const designers = featuredDesigners();

  return (
    <section className="py-10 sm:py-12" data-testid="section-specialty-designers">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2
            className="font-serif text-3xl font-semibold mb-2"
            data-testid="text-specialty-heading"
          >
            Shadow Boxes Built for What You&apos;re Framing
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Each designer is pre-configured with the right depth, mat options, and mounting for your
            specific item.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {designers.map((designer) => (
            <Link key={designer.id} href={designer.href}>
              <div
                className="group bg-card rounded-lg border overflow-hidden hover-elevate h-full flex flex-col cursor-pointer"
                data-testid={`specialty-card-${designer.id}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={designer.image}
                    alt={designer.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3
                      className="font-serif text-lg font-semibold text-white mb-0.5"
                      data-testid={`text-specialty-name-${designer.id}`}
                    >
                      {designer.name}
                    </h3>
                    <p className="text-sm text-white/80">{designer.tagline}</p>
                  </div>
                </div>

                <div className="p-4 mt-auto">
                  <Button variant="outline" size="sm" className="w-full" data-testid={`button-specialty-${designer.id}`}>
                    Start Designing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/specialty-frames">
            <Button variant="outline" size="lg" data-testid="button-view-all-specialty">
              Explore All Specialty Frames
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
