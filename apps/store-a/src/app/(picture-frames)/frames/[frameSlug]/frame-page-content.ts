/**
 * Frame detail page dynamic content.
 * Source: CustomFrameSizes-CODE hand-written pages (LightOakFrame, MuseumBronze, etc.)
 * and generate-frame-pages.ts derivation logic.
 */

import type { FrameStyle } from "@framecraft/types";

export interface KeyFeature {
  title: string;
  subtitle: string;
  testId: string;
}

export interface SpecRow {
  label: string;
  value: string;
  testId: string;
}

export interface PerfectForItem {
  title: string;
  description: string;
  testId: string;
}

export interface FramePageContent {
  heroBadgeText: string;
  designHeading: string;
  designBody: string;
  keyFeatures: KeyFeature[];
  specSubtitle: string;
  specs: SpecRow[];
  perfectForSubtitle: string;
  perfectFor: PerfectForItem[];
  finalCtaHeading: string;
  finalCtaSubtext: string;
}

/** Per-frame overrides from original hand-written pages (exact migration). */
const OVERRIDES: Partial<Record<string, Omit<FramePageContent, "heroBadgeText">>> = {
  "light-oak": {
    designHeading: "Warm Oak Simplicity with Natural Grain Beauty",
    designBody:
      "Our Light Oak frame delivers warm natural wood character with its honey-toned finish and visible wood grain. The clean 0.75\" simple block profile creates versatile contemporary lines while natural oak texture adds organic warmth—perfect for family photos, everyday prints, casual photography, and warm contemporary interiors. Precision-milled from premium hardwood with natural oak finish and protective clear coat, each frame brings approachable charm to personal memories, vacation photos, children's artwork, and everyday home décor.",
    keyFeatures: [
      {
        title: "Natural Wood Grain",
        subtitle: "Organic Texture Adds Warmth and Character",
        testId: "benefit-natural-grain",
      },
      {
        title: "Honey-Toned Oak",
        subtitle: "Golden Finish Brings Inviting Warmth",
        testId: "benefit-honey-tones",
      },
      {
        title: "Versatile Casual",
        subtitle: "Works Beautifully in Any Room",
        testId: "benefit-versatile-casual",
      },
      {
        title: "Warm Character",
        subtitle: "Friendly Style Welcomes Family and Friends",
        testId: "benefit-warm-character",
      },
    ],
    specSubtitle: "Honey-toned oak with natural wood grain texture",
    specs: [
      { label: "Material", value: "Premium Hardwood", testId: "spec-material" },
      { label: "Finish", value: "Honey-Toned Oak with Natural Grain", testId: "spec-finish" },
      { label: "Face Width", value: '0.75"', testId: "spec-width" },
      { label: "Rabbet Depth", value: '0.5"', testId: "spec-depth" },
      { label: "Profile Style", value: "Simple Block Design", testId: "spec-profile" },
      { label: "Glazing Options", value: "Glass or Acrylic", testId: "spec-glazing" },
      { label: "Minimum Size", value: '4" × 4"', testId: "spec-size-min" },
      { label: "Cut Precision", value: '±1/16"', testId: "spec-precision" },
    ],
    perfectForSubtitle: "Ideal applications for Light Oak frames",
    perfectFor: [
      {
        title: "Family Photos",
        description: "Warm oak finish enhances personal memories and cherished family moments",
        testId: "use-case-family-photos",
      },
      {
        title: "Everyday Prints",
        description: "Natural grain texture complements casual photography and vacation snapshots",
        testId: "use-case-everyday-prints",
      },
      {
        title: "Warm Contemporary Interiors",
        description: "Honey tones blend beautifully with modern farmhouse and Scandinavian décor",
        testId: "use-case-warm-interiors",
      },
      {
        title: "Casual Gallery Walls",
        description: "Versatile profile works perfectly for mixed collections and relaxed displays",
        testId: "use-case-casual-displays",
      },
    ],
    finalCtaHeading: "Ready to Frame Your Memories?",
    finalCtaSubtext: "Design your custom Light Oak frame with instant pricing and fast delivery",
  },
  "museum-bronze": {
    designHeading: "Ornate Elegance, Professional Grade",
    designBody:
      'Our Museum Bronze frame brings classical European elegance to any artwork with its intricate hand-finished ornamental detailing and rich gold-bronze finish. The substantial 1.25" moulding width creates impressive depth—perfect for fine art, family portraits, diplomas, and heirloom pieces. Each frame features multi-layer metallic coating with raised relief details hand-applied by skilled artisans, delivering authentic professional-grade craftsmanship for traditional and formal presentations.',
    keyFeatures: [
      {
        title: "Warm Bronze Elegance",
        subtitle: "Rich Metallic Tones Elevate Any Art",
        testId: "benefit-bronze-elegance",
      },
      {
        title: "Traditional Craftsmanship",
        subtitle: "Hand-Finished Details Show Quality Care",
        testId: "benefit-traditional-craft",
      },
      {
        title: "Timeless Sophistication",
        subtitle: "Classic Design Never Goes Out of Style",
        testId: "benefit-timeless-sophistication",
      },
      {
        title: "Rich Depth",
        subtitle: "Layered Finish Creates Dimensional Beauty",
        testId: "benefit-rich-depth",
      },
    ],
    specSubtitle: "Hand-finished ornamental craftsmanship with professional-grade materials",
    specs: [
      { label: "Material", value: "Premium Hardwood", testId: "spec-material" },
      { label: "Finish", value: "Gold & Bronze Metallic", testId: "spec-finish" },
      { label: "Face Width", value: '1.25"', testId: "spec-width" },
      { label: "Rabbet Depth", value: '0.5"', testId: "spec-depth" },
      { label: "Profile Style", value: "Ornate Stepped", testId: "spec-profile" },
      { label: "Detailing", value: "Hand-Applied Relief", testId: "spec-detail" },
      { label: "Minimum Size", value: '4" × 4"', testId: "spec-size-min" },
      { label: "Cut Precision", value: '±1/16"', testId: "spec-precision" },
    ],
    perfectForSubtitle: "Ideal applications for Museum Bronze frames",
    perfectFor: [
      {
        title: "Fine Art & Limited Edition Prints",
        description: "Gallery-worthy presentation for paintings, watercolors, and giclée prints",
        testId: "use-case-fine-art",
      },
      {
        title: "Family Portraits & Wedding Photos",
        description: "Transform cherished memories into heirloom-quality displays",
        testId: "use-case-portraits",
      },
      {
        title: "Diplomas & Certificates",
        description: "Professional presentation for achievements and credentials",
        testId: "use-case-diplomas",
      },
      {
        title: "Historical Documents & Memorabilia",
        description: "Preserve vintage maps, letters, and collectibles with archival materials",
        testId: "use-case-historical",
      },
    ],
    finalCtaHeading: "Ready to Frame Your Art?",
    finalCtaSubtext:
      "Design your custom Museum Bronze frame with instant pricing and fast delivery",
  },
};

/** Hero badge text per frame (from original hero sections). */
const HERO_BADGE: Partial<Record<string, string>> = {
  "light-oak": "Warm Natural Wood Accent",
};

/** generatePerfectFor logic from CustomFrameSizes-CODE scripts/generate-frame-pages.ts */
function generatePerfectFor(frame: FrameStyle): PerfectForItem[] {
  const n = frame.name.toLowerCase();
  if (n.includes("museum") || n.includes("bronze") || n.includes("gold")) {
    return [
      {
        title: "Fine Art & Oil Paintings",
        description: "Museum-quality presentation for valuable artwork and original pieces",
        testId: "use-case-fine-art",
      },
      {
        title: "Family Portraits & Heirlooms",
        description: "Ornate detailing brings gravitas to treasured family photographs",
        testId: "use-case-portraits",
      },
      {
        title: "Diplomas & Certificates",
        description: "Prestigious frames for academic and professional achievements",
        testId: "use-case-diplomas",
      },
      {
        title: "Traditional Interiors",
        description: "Classic, formal, and traditional decorating styles",
        testId: "use-case-traditional",
      },
    ];
  }
  if (n.includes("black")) {
    return [
      {
        title: "Photography & Digital Art",
        description: "Enhanced contrast and color saturation for printed images",
        testId: "use-case-photography",
      },
      {
        title: "Modern Abstract & Minimalist Art",
        description: "Clean boundaries without decorative distractions",
        testId: "use-case-modern-art",
      },
      {
        title: "Gallery Walls & Collections",
        description: "Unified appearance creates cohesion across diverse artwork",
        testId: "use-case-gallery",
      },
      {
        title: "Professional Environments",
        description: "Offices, studios, and commercial spaces seeking modern elegance",
        testId: "use-case-professional",
      },
    ];
  }
  if (n.includes("white")) {
    return [
      {
        title: "Family Photos & Memories",
        description: "Bright white finish enhances colors and creates cheerful displays",
        testId: "use-case-family-photos",
      },
      {
        title: "Certificates & Diplomas",
        description: "Professional presentation for academic and business achievements",
        testId: "use-case-certificates",
      },
      {
        title: "Contemporary Artwork",
        description: "Clean backdrop allows vibrant art to take center stage",
        testId: "use-case-contemporary",
      },
      {
        title: "Light & Bright Interiors",
        description: "Coastal, Scandinavian, and modern farmhouse décor styles",
        testId: "use-case-interiors",
      },
    ];
  }
  if (n.includes("pink")) {
    return [
      {
        title: "Nursery & Baby Rooms",
        description: "Cheerful pink finish creates warm, welcoming atmosphere for little ones",
        testId: "use-case-nursery",
      },
      {
        title: "Children's Artwork & Photos",
        description: "Vibrant color celebrates creativity and family memories",
        testId: "use-case-children",
      },
      {
        title: "Teen Rooms & Dorm Spaces",
        description: "Modern pink appeals to style-conscious young adults",
        testId: "use-case-teen",
      },
      {
        title: "Contemporary Pop Art",
        description: "Bold pink frame complements vibrant modern artwork",
        testId: "use-case-pop-art",
      },
    ];
  }
  if (n.includes("silver")) {
    return [
      {
        title: "Black & White Photography",
        description: "Metallic silver enhances monochrome imagery with sophisticated appeal",
        testId: "use-case-bw-photo",
      },
      {
        title: "Contemporary Modern Art",
        description: "Sleek metallic finish complements bold abstract and minimalist works",
        testId: "use-case-modern-art",
      },
      {
        title: "Professional Certificates",
        description: "Polished metallic appearance for business and academic achievements",
        testId: "use-case-certificates",
      },
      {
        title: "Sophisticated Interiors",
        description: "Modern, industrial, and transitional design styles",
        testId: "use-case-interiors",
      },
    ];
  }
  return [
    {
      title: "Photography & Artwork",
      description: "Versatile framing for printed images and art",
      testId: "use-case-photography",
    },
    {
      title: "Family Photos",
      description: "Perfect presentation for treasured memories",
      testId: "use-case-family-photos",
    },
    {
      title: "Certificates & Documents",
      description: "Professional display for important papers",
      testId: "use-case-certificates",
    },
    {
      title: "Contemporary Spaces",
      description: "Complements modern interior design",
      testId: "use-case-contemporary",
    },
  ];
}

/** Default key features when no override (from original KeyFeaturesBar DEFAULT_FEATURES). */
const DEFAULT_KEY_FEATURES: KeyFeature[] = [
  { title: "Custom Sizes", subtitle: "Built to Fit Your Exact Art", testId: "feature-custom-size" },
  {
    title: "Handcrafted",
    subtitle: "Skilled Artisans Build Every Frame",
    testId: "feature-handcrafted",
  },
  {
    title: "Frame Shop Quality",
    subtitle: "To Protect Your Items",
    testId: "feature-professional-grade",
  },
  {
    title: "Instant Pricing",
    subtitle: "See Your Cost as You Customize",
    testId: "feature-instant-pricing",
  },
];

export function getFramePageContent(frame: FrameStyle): FramePageContent {
  const override = OVERRIDES[frame.id];
  const heroBadgeText = HERO_BADGE[frame.id] ?? "Premium Quality";
  const designHeading = override?.designHeading ?? "Design & Craftsmanship";
  const designBody =
    override?.designBody ?? (frame.featuredDescription || frame.shortDescription || "");
  const keyFeatures = override?.keyFeatures ?? DEFAULT_KEY_FEATURES;
  const specSubtitle = override?.specSubtitle ?? "Designed with precision craftsmanship";
  const specs = override?.specs ?? [
    { label: "Material", value: "Premium Hardwood", testId: "spec-material" },
    { label: "Finish", value: frame.name + " finish", testId: "spec-finish" },
    { label: "Face Width", value: `${frame.mouldingWidth}"`, testId: "spec-width" },
    { label: "Rabbet Depth", value: `${frame.usableDepth}"`, testId: "spec-depth" },
    { label: "Profile Style", value: "Custom profile", testId: "spec-profile" },
    { label: "Glazing Options", value: "Glass or Acrylic", testId: "spec-glazing" },
    { label: "Minimum Size", value: '4" × 4"', testId: "spec-size-min" },
    { label: "Cut Precision", value: '±1/16"', testId: "spec-precision" },
  ];
  const perfectForSubtitle =
    override?.perfectForSubtitle ?? `Ideal applications for ${frame.name} frames`;
  const perfectFor = override?.perfectFor ?? generatePerfectFor(frame);
  const finalCtaHeading = override?.finalCtaHeading ?? "Ready to Frame Your Memories?";
  const finalCtaSubtext =
    override?.finalCtaSubtext ??
    `Design your custom ${frame.name} frame with instant pricing and fast delivery`;

  return {
    heroBadgeText,
    designHeading,
    designBody,
    keyFeatures,
    specSubtitle,
    specs,
    perfectForSubtitle,
    perfectFor,
    finalCtaHeading,
    finalCtaSubtext,
  };
}
