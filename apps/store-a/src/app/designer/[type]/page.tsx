import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  FrameDesigner,
  JerseyFrameDesigner,
  PuzzleFrameDesigner,
  ComicBookFrameDesigner,
  PlaybillFrameDesigner,
  CanvasFrameDesigner,
  ShadowboxDesigner,
} from "@framecraft/ui";
import { brandConfig } from "../../../brand.config";

// Map designer types to their components and metadata
const DESIGNER_CONFIG = {
  frame: {
    component: FrameDesigner,
    title: "Custom Frame Designer - Design Your Perfect Frame",
    description:
      "Design custom picture frames with our interactive designer. Choose your size, frame style, mat colors, and glazing options. See instant pricing and preview your design in real-time.",
  },
  jersey: {
    component: JerseyFrameDesigner,
    title: "Custom Jersey Display Frames | Professional Sports Memorabilia Shadowbox Framing",
    description:
      "Professional jersey display frames with 2-inch depth, team-specific triple mat colors, optional brass plaque engraving, and framer's grade acrylic. Designed for NHL, NBA, MLB, NFL jerseys and concert memorabilia.",
  },
  puzzle: {
    component: PuzzleFrameDesigner,
    title: "Jigsaw Puzzle Frames - Custom Sizes & Professional Preservation",
    description:
      "Professional jigsaw puzzle frames for 100-2000 pieces. Custom sizes for standard, panoramic, square, and round puzzles. Shadowbox depth, puzzle glue sheets, circular mat cutouts.",
  },
  comic: {
    component: ComicBookFrameDesigner,
    title: "Custom Comic Book Frames | Display & Protect Your Collection",
    description:
      "Frame your comic book collection with custom shadowbox frames. Perfect for raw comics (Golden, Silver, Bronze, Modern Age) and graded slabs (CGC, PGX, CBCS).",
  },
  "comic-book": {
    component: ComicBookFrameDesigner,
    title: "Custom Comic Book Frames | Display & Protect Your Collection",
    description:
      "Frame your comic book collection with custom shadowbox frames. Perfect for raw comics (Golden, Silver, Bronze, Modern Age) and graded slabs (CGC, PGX, CBCS).",
  },
  playbill: {
    component: PlaybillFrameDesigner,
    title: "Custom Playbill Frames | Broadway Program Display Frames",
    description:
      'Display Broadway programs and theater playbills in perfectly-sized frames. Standard 5.5x8.5" sizing with acid-free mats and professional-grade construction.',
  },
  canvas: {
    component: CanvasFrameDesigner,
    title: "Canvas Float Frames | Gallery-Wrap Canvas Display Frames",
    description:
      "Professional canvas float frames for gallery-wrap canvases. Choose from multiple frame styles and finishes to complement your artwork.",
  },
  shadowbox: {
    component: ShadowboxDesigner,
    title: "Custom Shadowbox Frames | Deep Display Frames for 3D Items",
    description:
      "Custom shadowbox frames with adjustable depth for displaying 3D items, memorabilia, and keepsakes. Professional construction with archival materials.",
  },
} as const;

type DesignerType = keyof typeof DESIGNER_CONFIG;

interface DesignerPageProps {
  params: Promise<{ type: string }>;
}

// Helper to normalize designer type (handles variations like "comic-book" -> "comic")
function normalizeDesignerType(type: string): DesignerType | null {
  const lower = type.toLowerCase();
  // Handle variations
  if (lower === "comic-book" || lower === "comicbook") {
    return "comic";
  }
  // Check if the type exists in DESIGNER_CONFIG
  if (lower in DESIGNER_CONFIG) {
    return lower as DesignerType;
  }
  return null;
}

// Generate metadata for each designer type
export async function generateMetadata({ params }: DesignerPageProps): Promise<Metadata> {
  const { type } = await params;
  const normalizedType = normalizeDesignerType(type);
  const config = normalizedType ? DESIGNER_CONFIG[normalizedType] : null;

  if (!config) {
    return {
      title: "Designer Not Found",
    };
  }

  return {
    title: `${config.title} | ${brandConfig.name}`,
    description: config.description,
    openGraph: {
      title: config.title,
      description: config.description,
      type: "website",
    },
  };
}

export default async function SpecialtyDesignerPage({ params }: DesignerPageProps) {
  const { type } = await params;
  const normalizedType = normalizeDesignerType(type);
  const config = normalizedType ? DESIGNER_CONFIG[normalizedType] : null;

  // Return 404 if designer type doesn't exist
  if (!config) {
    notFound();
  }

  const DesignerComponent = config.component;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            {config.title.split("|")[0].trim()}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>
      </section>

      {/* Designer Section */}
      <section id="designer" className="container mx-auto px-4 py-8 md:py-12">
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
          <DesignerComponent />
        </Suspense>
      </section>
    </div>
  );
}

// Generate static params for known designer types (optional, for better performance)
export async function generateStaticParams() {
  return Object.keys(DESIGNER_CONFIG).map((type) => ({
    type,
  }));
}
