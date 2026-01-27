"use client";

import Link from "next/link";
import {
  ArrowRight,
  Frame,
  Box,
  Palette,
  Ruler,
  GraduationCap,
  Disc3,
  Disc,
  Puzzle,
  Shirt,
  Award,
  Square,
  Shield,
  Package,
  Layers,
  Book,
  CreditCard,
  HelpCircle,
  Info,
  Phone,
  Mail,
  PenLine,
  Newspaper,
  Theater,
  Ticket,
  Flower2,
  FileText,
  LayoutGrid,
  Scissors,
  Baby,
  Heart,
  Banknote,
  Circle,
  Film,
  SprayCan,
} from "lucide-react";
import { PostageStampIcon } from "../icons/PostageStampIcon";
import { Button } from "../ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { useStoreConfig } from "@framecraft/core";

interface MobileNavigationProps {
  onNavigate?: () => void;
}

export function MobileNavigation({ onNavigate }: MobileNavigationProps) {
  const storeConfig = useStoreConfig();

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const phone = (storeConfig.metadata?.contactPhone as string) || undefined;
  const email = (storeConfig.metadata?.contactEmail as string) || undefined;

  return (
    <nav className="flex flex-col h-full pb-6" aria-label="Mobile navigation">
      {/* Hero CTA - Prominent at Top */}
      <div className="px-4 pt-2 pb-4">
        <Button
          variant="default"
          size="lg"
          className="w-full h-12"
          asChild
          onClick={handleNavigate}
          data-testid="button-mobile-cta-start-designing"
        >
          <Link href="/picture-frames">
            <span>Start Designing</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      <div className="border-t" />

      {/* Main Navigation - Clean Accordions */}
      <Accordion type="multiple" className="flex-1 px-4 pt-4" defaultValue={["shop"]}>
        {/* Shop Section */}
        <AccordionItem value="shop" className="border-0">
          <AccordionTrigger
            className="py-3 hover:no-underline text-base font-bold"
            data-testid="accordion-mobile-shop"
          >
            Shop Products
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-1">
              {/* Picture Frames Section */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-11 text-sm font-semibold pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/picture-frames" data-testid="link-mobile-picture-frames">
                    <Frame className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span>All Picture Frames</span>
                  </Link>
                </Button>

                {/* Picture Frame Browse Options */}
                <div className="ml-7 space-y-1 border-l-2 border-muted pl-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-sm pl-0"
                    asChild
                    onClick={handleNavigate}
                  >
                    <Link href="/frames/colors" data-testid="link-mobile-frames-by-color">
                      <Palette className="h-3.5 w-3.5 mr-2.5 text-muted-foreground" />
                      Browse by Color
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-sm pl-0"
                    asChild
                    onClick={handleNavigate}
                  >
                    <Link href="/frames/sizes" data-testid="link-mobile-frames-by-size">
                      <Ruler className="h-3.5 w-3.5 mr-2.5 text-muted-foreground" />
                      Browse by Size
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-sm pl-0"
                    asChild
                    onClick={handleNavigate}
                  >
                    <Link href="/frames/styles" data-testid="link-mobile-frames-by-style">
                      <LayoutGrid className="h-3.5 w-3.5 mr-2.5 text-muted-foreground" />
                      Browse by Style
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="border-t my-3" />

              {/* Shadowboxes Section */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-11 text-sm font-semibold pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/shadowbox/designer" data-testid="link-mobile-shadowboxes">
                    <Box className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span>All Shadowboxes</span>
                  </Link>
                </Button>

                {/* Shadowbox Browse Option */}
                <div className="ml-7 space-y-1 border-l-2 border-muted pl-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-sm pl-0"
                    asChild
                    onClick={handleNavigate}
                  >
                    <Link href="/shadowboxes/colors" data-testid="link-mobile-shadowboxes-by-color">
                      <Palette className="h-3.5 w-3.5 mr-2.5 text-muted-foreground" />
                      Browse by Color
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="border-t my-3" />

              {/* Specialty Frames - Alphabetized */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground px-0 py-2">
                  SPECIALTY FRAMES
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/cd-frames" data-testid="link-mobile-cd-frames">
                    <Disc className="h-4 w-4 mr-3 text-muted-foreground" />
                    CD Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/certificate-frames" data-testid="link-mobile-certificate-frames">
                    <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                    Certificate Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/comic-book-frames" data-testid="link-mobile-comic-frames">
                    <Book className="h-4 w-4 mr-3 text-muted-foreground" />
                    Comic Book Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/diploma-certificate-frames" data-testid="link-mobile-diploma-frames">
                    <GraduationCap className="h-4 w-4 mr-3 text-muted-foreground" />
                    Diploma Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/card-frames" data-testid="link-mobile-card-frames">
                    <CreditCard className="h-4 w-4 mr-3 text-muted-foreground" />
                    Graded Card Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/magazine-frames" data-testid="link-mobile-magazine-frames">
                    <Book className="h-4 w-4 mr-3 text-muted-foreground" />
                    Magazine Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/movie-poster-frames" data-testid="link-mobile-movie-poster-frames">
                    <Film className="h-4 w-4 mr-3 text-muted-foreground" />
                    Movie Poster Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/specialty/needlework" data-testid="link-mobile-needlework-frames">
                    <Scissors className="h-4 w-4 mr-3 text-muted-foreground" />
                    Needlework Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/newspaper-frames" data-testid="link-mobile-newspaper-frames">
                    <Newspaper className="h-4 w-4 mr-3 text-muted-foreground" />
                    Newspaper Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/collage-frames" data-testid="link-mobile-collage-frames">
                    <LayoutGrid className="h-4 w-4 mr-3 text-muted-foreground" />
                    Photo Collage Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/playbill-frames" data-testid="link-mobile-playbill-frames">
                    <Theater className="h-4 w-4 mr-3 text-muted-foreground" />
                    Playbill Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/puzzle-frames" data-testid="link-mobile-puzzle-frames">
                    <Puzzle className="h-4 w-4 mr-3 text-muted-foreground" />
                    Puzzle Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/record-album-frames" data-testid="link-mobile-record-frames">
                    <Disc3 className="h-4 w-4 mr-3 text-muted-foreground" />
                    Record Album Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/signature-frames" data-testid="link-mobile-signature-frames">
                    <PenLine className="h-4 w-4 mr-3 text-muted-foreground" />
                    Signature Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/sonogram-frames" data-testid="link-mobile-sonogram-frames">
                    <Baby className="h-4 w-4 mr-3 text-muted-foreground" />
                    Sonogram Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/ticket-frames" data-testid="link-mobile-ticket-frames">
                    <Ticket className="h-4 w-4 mr-3 text-muted-foreground" />
                    Ticket Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link
                    href="/wedding-invitation-frames"
                    data-testid="link-mobile-wedding-invitation-frames"
                  >
                    <Heart className="h-4 w-4 mr-3 text-muted-foreground" />
                    Wedding Invitation Frames
                  </Link>
                </Button>
              </div>

              <div className="border-t my-3" />

              {/* Specialty Shadowboxes - Matching Desktop Structure */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground px-0 py-2">
                  SPECIALTY SHADOWBOXES
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/bouquet-frames" data-testid="link-mobile-bouquet-frames">
                    <Flower2 className="h-4 w-4 mr-3 text-muted-foreground" />
                    Bouquet Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/currency-frames" data-testid="link-mobile-currency-frames">
                    <Banknote className="h-4 w-4 mr-3 text-muted-foreground" />
                    Currency Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link
                    href="/hockey-puck-frame-designer"
                    data-testid="link-mobile-hockey-puck-frames"
                  >
                    <Circle className="h-4 w-4 mr-3 text-muted-foreground" />
                    Hockey Puck Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/jersey-frames" data-testid="link-mobile-jersey-frames">
                    <Shirt className="h-4 w-4 mr-3 text-muted-foreground" />
                    Jersey Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/military-frames" data-testid="link-mobile-military-frames">
                    <Award className="h-4 w-4 mr-3 text-muted-foreground" />
                    Military Frames
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/stamp-frames" data-testid="link-mobile-stamp-frames">
                    <PostageStampIcon className="h-4 w-4 mr-3 text-muted-foreground" />
                    Stamp Frames
                  </Link>
                </Button>
              </div>

              <div className="border-t my-3" />

              {/* Components */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground px-0 py-2">
                  COMPONENTS
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/mat-designer" data-testid="link-mobile-mat-board">
                    <Square className="h-4 w-4 mr-3 text-muted-foreground" />
                    Mat Board
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/components/acrylic" data-testid="link-mobile-acrylic">
                    <Layers className="h-4 w-4 mr-3 text-muted-foreground" />
                    Acrylic
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/components/foam-board" data-testid="link-mobile-foam-board">
                    <Layers className="h-4 w-4 mr-3 text-muted-foreground" />
                    Foam Board
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link
                    href="/components/security-hardware-kit"
                    data-testid="link-mobile-security-hardware"
                  >
                    <Shield className="h-4 w-4 mr-3 text-muted-foreground" />
                    Security Hardware
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/components/cleat-hangers" data-testid="link-mobile-cleat-hangers">
                    <Package className="h-4 w-4 mr-3 text-muted-foreground" />
                    Cleat Hangers
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link
                    href="/components/brass-nameplates"
                    data-testid="link-mobile-brass-nameplates"
                  >
                    <Award className="h-4 w-4 mr-3 text-muted-foreground" />
                    Brass Nameplates
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link
                    href="/components/acrylic-cleaner"
                    data-testid="link-mobile-acrylic-cleaner"
                  >
                    <SprayCan className="h-4 w-4 mr-3 text-muted-foreground" />
                    Acrylic Cleaner
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm pl-0"
                  asChild
                  onClick={handleNavigate}
                >
                  <Link href="/samples" data-testid="link-mobile-order-samples">
                    <Palette className="h-4 w-4 mr-3 text-muted-foreground" />
                    Order Samples
                  </Link>
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Support Section */}
        <AccordionItem value="support" className="border-0">
          <AccordionTrigger
            className="py-3 hover:no-underline text-base font-bold"
            data-testid="accordion-mobile-support"
          >
            Help & Info
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-11 text-sm pl-0"
                asChild
                onClick={handleNavigate}
              >
                <Link href="/learn" data-testid="link-mobile-learn">
                  <HelpCircle className="h-4 w-4 mr-3 text-muted-foreground" />
                  Learn & Resources
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-11 text-sm pl-0"
                asChild
                onClick={handleNavigate}
              >
                <Link href="/contact" data-testid="link-mobile-contact">
                  <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                  Contact Us
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-11 text-sm pl-0"
                asChild
                onClick={handleNavigate}
              >
                <Link href="/business" data-testid="link-mobile-business">
                  <Info className="h-4 w-4 mr-3 text-muted-foreground" />
                  Business Services
                </Link>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Quick Contact at Bottom */}
      {(phone || email) && (
        <div className="border-t mt-auto pt-4 px-4">
          <div className="text-xs text-muted-foreground space-y-2">
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{phone}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{email}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
