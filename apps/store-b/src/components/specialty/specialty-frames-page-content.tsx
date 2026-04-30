"use client";

/**
 * origina-store-b/client/src/pages/SpecialtyFrames.tsx +
 * origina-store-b/client/src/components/home/SpecialtyDesignersShowcase.tsx (AllDesignersGrid).
 */

import {
  getCurrencyLifestyleImages,
  getInvitationLifestyleImages,
  getJerseyLifestyleImages,
  getPuckLifestyleImages,
  getPuzzleLifestyleImages,
  getSharedAssetUrl,
  getStampLifestyleImageByNumber,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  Baby,
  BookMarked,
  BookOpen,
  Box,
  CreditCard,
  Disc3,
  DollarSign,
  FileText,
  Film,
  Flower2,
  Frame,
  Gem,
  GraduationCap,
  Heart,
  LayoutGrid,
  Music,
  Newspaper,
  Paintbrush,
  PenTool,
  Puzzle as PuzzleIcon,
  Scissors,
  Shirt,
  Stamp,
  Theater,
  Ticket,
  Trophy,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@framecraft/ui/components/ui/button";

interface SpecialtyDesignerRow {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  features?: string[];
  image: string;
  imageAlt: string;
  category?: "memorabilia" | "collectibles" | "personal" | "display";
}

const jerseyThumb = (): string =>
  getJerseyLifestyleImages()[0]?.url ?? getStoreBaseAssetUrl("frames/10727/10727_jersey_lifestyle_01.jpg");

const ALL_SPECIALTY_DESIGNERS: SpecialtyDesignerRow[] = [
  {
    id: "jersey",
    name: "Jersey Shadowbox Designer",
    tagline: "Display Your Team Pride",
    description:
      "Deep shadowbox frames built to showcase sports jerseys with professional mounting.",
    href: "/jersey-frames",
    icon: Shirt,
    features: ["Multiple depths available", "Jersey mounting included", "Team color mats"],
    image: jerseyThumb(),
    imageAlt: "Framed sports jersey displayed in home office",
    category: "memorabilia",
  },
  {
    id: "diploma",
    name: "Diploma Frame Designer",
    tagline: "Honor Your Achievement",
    description:
      "Elegant frames sized for diplomas and degrees with archival matting to protect your credentials.",
    href: "/diploma-certificate-frames",
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
    description: "Frames for CGC slabs, raw comics, and graphic novels with archival backing.",
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
    image: getSharedAssetUrl("movie-poster/lifestyle/Movie_Poster_Lifestyle_(1)_1765996892733.jpg"),
    imageAlt: "Movie poster framed in home theater room",
    category: "memorabilia",
  },
  {
    id: "military",
    name: "Military Shadowbox Designer",
    tagline: "Honor Their Service",
    description:
      "Deep shadowbox frames for medals, flags, and military memorabilia with branch-specific colors.",
    href: "/military-frames",
    icon: Award,
    features: ["Medal mounting", "Flag display", "Branch colors"],
    image: getStoreBaseAssetUrl("military/lifestyle/lifestyle_01.jpg"),
    imageAlt: "Military shadowbox with medals and flag",
    category: "memorabilia",
  },
  {
    id: "playbill",
    name: "Playbill Frame Designer",
    tagline: "Preserve the Magic",
    description:
      "Frames sized for Broadway Playbills with options to include ticket stubs and show memorabilia.",
    href: "/playbill-frames",
    icon: Theater,
    features: ["Standard Playbill size", "Ticket stub slots", "Double mat options"],
    image: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-1.jpg"),
    imageAlt: "Broadway Playbill framed on wall",
    category: "memorabilia",
  },
  {
    id: "stamp",
    name: "Stamp Frame Designer",
    tagline: "Showcase Your Collection",
    description:
      "Display frames for postage stamps with layouts for singles, blocks, and first day covers.",
    href: "/stamp-frames",
    icon: Stamp,
    features: [
      "Multiple stamp layouts",
      "Archival mounting",
      "Compatible with standard archival stamp mounts used by collectors",
    ],
    image: getStampLifestyleImageByNumber(1).url,
    imageAlt: "Framed stamp collection display",
    category: "collectibles",
  },
  {
    id: "currency",
    name: "Currency Frame Designer",
    tagline: "Display Your Bills",
    description: "Frames for paper currency, coins, and numismatic collections with archival backing.",
    href: "/currency-frames",
    icon: DollarSign,
    features: [
      "Bill & coin layouts",
      "Archival backing",
      "Compatible with standard archival currency holders used by collectors",
    ],
    image: getCurrencyLifestyleImages()[0]?.url ?? "",
    imageAlt: "Collector displaying framed international currency collection",
    category: "collectibles",
  },
  {
    id: "needlework",
    name: "Needlework Frame Designer",
    tagline: "Frame Your Craft",
    description:
      "Specialized frames for cross-stitch, embroidery, and textile art with proper depth and stretching.",
    href: "/needlework-frames",
    icon: Scissors,
    features: ["Fabric stretching", "Shadowbox depth", "Archival mounting"],
    image: getSharedAssetUrl("needlework/insert-images/preview-inserts/needlework-insert-01.jpg"),
    imageAlt: "Framed cross-stitch embroidery artwork",
    category: "personal",
  },
  {
    id: "cd",
    name: "CD Frame Designer",
    tagline: "Display Your Albums",
    description: "Frames for CD jewel cases and album artwork with easy-access design.",
    href: "/cd-frames",
    icon: Music,
    features: ["Fits CD cases", "Album art display", "Wall-ready mount"],
    image: getSharedAssetUrl("cd/lifestyle/cd-frame-lifestyle-10.jpg"),
    imageAlt: "Framed CD album collection",
    category: "collectibles",
  },
  {
    id: "newspaper",
    name: "Newspaper Frame Designer",
    tagline: "Preserve Headlines",
    description:
      "Frames for full newspaper pages and clippings with archival materials to prevent yellowing.",
    href: "/newspaper-frames",
    icon: Newspaper,
    features: ["Full page & clipping sizes", "Archival backing", "Non-glare acrylic"],
    image: getSharedAssetUrl("newspaper/lifestyle/lifestyle_10.jpg"),
    imageAlt: "Framed historic newspaper front page",
    category: "memorabilia",
  },
  {
    id: "magazine",
    name: "Magazine Frame Designer",
    tagline: "Frame the Cover",
    description: "Frames for magazine covers and full issues in standard publication sizes.",
    href: "/magazine-frames",
    icon: BookMarked,
    features: ["Standard magazine sizes", "Cover display", "Full issue depth"],
    image: getSharedAssetUrl("magazine/lifestyle/lifestyle_10.jpg"),
    imageAlt: "Framed magazine cover display",
    category: "memorabilia",
  },
  {
    id: "sonogram",
    name: "Sonogram Frame Designer",
    tagline: "First Memories",
    description: "Keepsake frames for ultrasound photos with space for name and date details.",
    href: "/sonogram-frames",
    icon: Baby,
    features: ["Standard sonogram size", "Name & date space", "Keepsake quality"],
    image: getSharedAssetUrl("sonogram/lifestyle/lifestyle_01.jpg"),
    imageAlt: "Framed baby sonogram keepsake",
    category: "personal",
  },
  {
    id: "wedding",
    name: "Wedding Invitation Frame Designer",
    tagline: "Remember the Day",
    description:
      "Elegant frames for wedding invitations, programs, and ceremony memorabilia.",
    href: "/wedding-invitation-frames",
    icon: Heart,
    features: ["Invitation layouts", "Multiple items", "Elegant finishes"],
    image:
      getInvitationLifestyleImages()[2]?.url ??
      getSharedAssetUrl("invitation-frames/lifestyle/invitation_03.jpeg"),
    imageAlt: "Couple holding framed wedding invitation display",
    category: "personal",
  },
  {
    id: "canvas-float",
    name: "Canvas Float Frame Designer",
    tagline: "Gallery-Style Display",
    description:
      "Float frames that create a gap between your canvas and the frame for a modern gallery look.",
    href: "/canvas-frames",
    icon: Frame,
    features: ['1/4" to 1/2" gap', "Gallery-style mount", "Multiple depths"],
    image: getSharedAssetUrl("canvas/lifestyle/lifestyle_10.jpg"),
    imageAlt: "Canvas artwork in float frame",
    category: "display",
  },
  {
    id: "shadowbox",
    name: "Shadowbox Designer",
    tagline: "Display 3D Objects",
    description:
      "Deep frames for memorabilia, keepsakes, and dimensional objects up to 3 inches deep.",
    href: "/shadowbox",
    icon: Box,
    features: ["Multiple depths", "Object mounting", "Custom layouts"],
    image: getStoreBaseAssetUrl("frames/10775/lifestyle-guitar-pick-collection.jpg"),
    imageAlt: "Shadowbox displaying keepsakes and memorabilia",
    category: "display",
  },
  {
    id: "certificate",
    name: "Certificate Frame Designer",
    tagline: "Frame Your Accomplishments",
    description:
      "Professional frames for certificates, awards, and recognition documents with elegant finishes.",
    href: "/certificate-frames",
    icon: FileText,
    features: ["Standard certificate sizes", "Archival matting", "Professional finishes"],
    image: getSharedAssetUrl("diploma/lifestyle/Diploma_Frame_Lifestyle (10).png"),
    imageAlt: "Framed certificate on office wall",
    category: "personal",
  },
  {
    id: "graded-card",
    name: "Graded Card Frame Designer",
    tagline: "Showcase Your Cards",
    description:
      "Frames designed for PSA, BGS, and SGC graded cards with secure mounting for your collection.",
    href: "/graded-card-frames",
    icon: CreditCard,
    features: ["PSA/BGS/SGC compatible", "Single & multi-card layouts", "Secure display"],
    image: getSharedAssetUrl("card-frames/lifestyle/lifestyle_10.jpg"),
    imageAlt: "Framed graded sports cards collection",
    category: "collectibles",
  },
  {
    id: "puck",
    name: "Puck Frame Designer",
    tagline: "Display Your Hockey Memorabilia",
    description:
      "Shadowbox frames built for signed pucks and hockey collectibles with secure mounting.",
    href: "/hockey-puck-frame-designer",
    icon: Trophy,
    features: ["Puck mounting included", "Signature display", "Team color mats"],
    image:
      getPuckLifestyleImages()[0]?.url ?? getSharedAssetUrl("puck/lifestyle/puck-lifestyle-1.jpg"),
    imageAlt: "Framed hockey puck display",
    category: "memorabilia",
  },
  {
    id: "puzzle",
    name: "Puzzle Frame Designer",
    tagline: "Preserve Your Puzzle",
    description:
      "Custom frames sized for completed jigsaw puzzles with secure mounting to keep pieces in place.",
    href: "/puzzle-frames",
    icon: PuzzleIcon,
    features: ["Custom puzzle sizes", "Secure mounting", "No-glue option"],
    image: getPuzzleLifestyleImages()[9]?.url ?? getSharedAssetUrl("puzzle/lifestyle/PuzzleFrame_Lifestyle (10).png"),
    imageAlt: "Framed completed jigsaw puzzle",
    category: "display",
  },
  {
    id: "ticket-stub",
    name: "Ticket Stub Frame Designer",
    tagline: "Remember the Event",
    description: "Compact frames for concert tickets, sports tickets, and event memorabilia.",
    href: "/ticket-frames",
    icon: Ticket,
    features: ["Single & multi-ticket layouts", "Event details space", "Archival backing"],
    image: getSharedAssetUrl("ticket-frames/lifestyle/ticket_frame_lifestyle_(16)_1766009757683.jpeg"),
    imageAlt: "Man holding framed vintage concert ticket",
    category: "memorabilia",
  },
  {
    id: "preserved-bouquet",
    name: "Preserved Bouquet Frame Designer",
    tagline: "Keep the Flowers Forever",
    description:
      "Deep shadowbox frames for wedding bouquets, dried flowers, and pressed botanical displays.",
    href: "/bouquet-frames",
    icon: Flower2,
    features: ["Deep shadowbox depth", "Flower mounting", "Premium preservation"],
    image: getStoreBaseAssetUrl("frames/10774/lifestyle-preserved-flowers-display.jpg"),
    imageAlt: "Framed preserved wedding bouquet",
    category: "personal",
  },
  {
    id: "signature",
    name: "Signature Frame Designer",
    tagline: "Display Autographs with Style",
    description:
      "Frames for signed photos, autographed items, and celebrity memorabilia with archival backing.",
    href: "/signature-frames",
    icon: PenTool,
    features: ["Photo & item layouts", "Nameplate options", "Archival matting"],
    image: getSharedAssetUrl(
      "signature-frames/lifestyle/Signature_Frame_Lifestyle (1)_1763780813534.jpeg",
    ),
    imageAlt: "Framed autographed photo display",
    category: "memorabilia",
  },
  {
    id: "diamond-painting",
    name: "Diamond Painting Frame Designer",
    tagline: "Protect Your Sparkle",
    description:
      "Custom frames for finished diamond paintings with proper depth for bead texture and UV-filtering acrylic.",
    href: "/specialty/diamond-painting",
    icon: Gem,
    features: ["All kit sizes", "UV-filtering acrylic", "Archival matting"],
    image: getSharedAssetUrl("diamond-painting-inserts/dp-insert-01.png"),
    imageAlt: "Framed diamond painting artwork",
    category: "personal",
  },
  {
    id: "paint-by-number",
    name: "Paint by Number Frame Designer",
    tagline: "Frame Your Finished Canvas",
    description:
      "Custom frames for paint by number canvases. Standard kit sizes from 8x10 to 24x36 with archival matting.",
    href: "/specialty/paint-by-number",
    icon: Paintbrush,
    features: ["Standard kit sizes", "UV-filtering acrylic", "Ready to hang"],
    image: getSharedAssetUrl("paint-by-number-inserts/pbn-insert-01.png"),
    imageAlt: "Framed paint by number canvas artwork",
    category: "personal",
  },
  {
    id: "latch-hook",
    name: "Latch Hook Frame Designer",
    tagline: "Display Your Textile Art",
    description:
      "Frames for latch hook rugs, punch needle art, and rug hooking with adequate depth for thick textiles.",
    href: "/specialty/latch-hook",
    icon: Scissors,
    features: ["Depth for thick pile", "46 mat colors", "Heavy-duty hardware"],
    image: getSharedAssetUrl("latch-hook-inserts/lh-insert-01.png"),
    imageAlt: "Framed latch hook textile artwork",
    category: "personal",
  },
];

export function SpecialtyFramesPageContent() {
  const designers = ALL_SPECIALTY_DESIGNERS;

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="font-serif text-4xl sm:text-5xl font-semibold mb-4"
              data-testid="text-specialty-page-heading"
            >
              Specialty Frame Designers
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              25 tools built for specific items. Pick the one that matches what you&apos;re framing.
              Each designer has the right frame depth, mat options, and mounting hardware ready to go.
            </p>
            <p className="text-base text-muted-foreground">
              Frame jerseys, diplomas, vinyl records, comic books, onesheet movie posters, military medals,
              Playbills, stamps, currency, graded cards, puzzles, ticket stubs, preserved bouquets, and more.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12" data-testid="section-specialty-designers-grid">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2
              className="font-serif text-3xl font-semibold mb-2"
              data-testid="text-specialty-all-heading"
            >
              Specialty Display Frames
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Purpose-built frame designers for specific items. Each tool is pre-configured with the right
              depth, mat options, and sizing for what you&apos;re displaying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {designers.map((designer) => (
              <div
                key={designer.id}
                className="group bg-card rounded-lg border overflow-hidden hover-elevate"
                data-testid={`specialty-card-${designer.id}`}
              >
                <div className="grid grid-cols-1">
                  <div className="relative aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={designer.image}
                      alt={designer.imageAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden pointer-events-none" />
                  </div>

                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <designer.icon className="h-5 w-5 text-primary shrink-0" />
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
                      {designer.description ? (
                        <p className="text-sm text-muted-foreground mb-4">{designer.description}</p>
                      ) : null}

                      {designer.features?.length ? (
                        <ul className="space-y-1 mb-4">
                          {designer.features.map((feature, index) => (
                            <li
                              key={index}
                              className="text-xs text-muted-foreground flex items-center gap-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    <Link href={designer.href}>
                      <Button
                        variant="outline"
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

          <div className="text-center mt-6 max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each specialty designer at ShadowboxFrames.com is built for specific items. Choose the right
              tool for jerseys, diplomas, certificates, vinyl records, comic books, onesheet movie posters,
              military memorabilia, Playbills, stamps, currency, needlework, CDs, newspapers, magazines,
              sonograms, wedding invitations, canvas art, shadowbox displays, graded cards, hockey pucks,
              puzzles, ticket stubs, preserved bouquets, and autographed items.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold mb-6 text-center">
              Why Use a Specialty Designer?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Right Dimensions</h3>
                <p className="text-sm text-muted-foreground">
                  Sizes are set for you. No measuring needed for items like Playbills, vinyl records, or CGC
                  slabs.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Proper Depth</h3>
                <p className="text-sm text-muted-foreground">
                  Shadowbox depths match your item. Jerseys need 2-3 inches. Medals need 1-2 inches. It&apos;s
                  figured out for you.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Archival Materials</h3>
                <p className="text-sm text-muted-foreground">
                  Framer&apos;s grade acrylic and archival backing protect your items from fading and damage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold mb-6 text-center">Common Questions</h2>
            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold mb-2">Can I frame something not on this list?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. Our main Picture Frame Designer handles any size artwork or photo. Specialty designers
                  just make it faster for common items.
                </p>
              </div>
              <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold mb-2">Do specialty frames cost more?</h3>
                <p className="text-sm text-muted-foreground">
                  No. Pricing is based on frame size and materials, not the designer you use. A 24×36 frame
                  costs the same whether you order from the poster or picture frame designer.
                </p>
              </div>
              <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold mb-2">How do I know which designer to use?</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the one that matches your item. Jersey? Use the Jersey designer. Comic book? Use the
                  Comic designer. Each one has the right options ready.
                </p>
              </div>
              <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold mb-2">What materials do specialty frames use?</h3>
                <p className="text-sm text-muted-foreground">
                  All specialty frames use archival matting, framer&apos;s grade acrylic, and
                  professional-grade backing to protect your items from fading and damage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
