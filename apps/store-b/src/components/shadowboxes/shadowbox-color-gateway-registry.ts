/**
 * Copy and section structure — origina-store-b/client/src/pages/shadowboxes/*ShadowboxFrames.tsx
 */

import type { ShadowboxGatewayColorName } from "./shadowbox-color-gateway-keys";

/** Complementary color names (linked at bottom) */
export const SHADOWBOX_GATEWAY_RELATED: Record<
  ShadowboxGatewayColorName,
  ShadowboxGatewayColorName[]
> = {
  Black: ["White", "Silver", "Brown"],
  White: ["Black", "Natural", "Brown"],
  Brown: ["Natural", "Gold", "Black"],
  Silver: ["Black", "White", "Gold"],
  Gold: ["Brown", "Silver", "Black"],
  Blue: ["Silver", "White", "Black"],
  Natural: ["Brown", "White", "Gold"],
};

export const SHADOWBOX_GATEWAY_DESIGN_CTA_LABEL: Record<ShadowboxGatewayColorName, string> = {
  Black: "Design Your Black Shadowbox",
  White: "Design Your White Shadowbox",
  Brown: "Design Your Brown Shadowbox",
  Silver: "Design Your Silver Shadowbox",
  Gold: "Design Your Gold Shadowbox",
  Blue: "Design Your Blue Shadowbox",
  Natural: "Design Your Natural Shadowbox",
};

/** Only Black & White include the Ultra Deep callout in origina */
export const SHADOWBOX_GATEWAY_ULTRA_DEEP: Partial<
  Record<
    ShadowboxGatewayColorName,
    {
      description: string;
      href: string;
      ctaLabel: string;
    }
  >
> = {
    Black: {
      description:
        "Our Ultra Deep black shadowbox holds items up to 3.5 inches thick, significantly deeper than any other frame we offer. Built for helmets, thick sculptures, championship belts, and oversized keepsakes.",
      href: "/shadowbox/ultra-deep-black-shadow-box-frame",
      ctaLabel: "See Ultra Deep Black",
    },
    White: {
      description:
        "Our Ultra Deep white shadowbox holds items up to 3.5 inches thick, significantly deeper than any other frame we offer. Perfect for gallery-style displays of thick keepsakes, bouquets, and oversized collectibles.",
      href: "/shadowbox/ultra-deep-white-shadow-box-frame",
      ctaLabel: "See Ultra Deep White",
    },
    Brown: undefined,
    Silver: undefined,
    Gold: undefined,
    Blue: undefined,
    Natural: undefined,
};

/** Section title for vignettes strip */
export const SHADOWBOX_GATEWAY_VIGNETTE_SECTION_TITLE: Partial<
  Record<ShadowboxGatewayColorName, "Display Ideas by Category" | "Built to Showcase Every Memory">
> = {
  Black: "Display Ideas by Category",
  White: "Display Ideas by Category",
  Brown: "Display Ideas by Category",
  Silver: "Display Ideas by Category",
  Gold: "Display Ideas by Category",
  Blue: "Built to Showcase Every Memory",
  Natural: "Built to Showcase Every Memory",
};

export const SHADOWBOX_GATEWAY_POPULAR_SECTION_BG: Partial<
  Record<ShadowboxGatewayColorName, "bg-background" | "bg-muted/30">
> = {
  Black: "bg-background",
  White: "bg-background",
  Brown: "bg-muted/30",
  Silver: "bg-muted/30",
  Gold: "bg-muted/30",
  Blue: "bg-muted/30",
  Natural: "bg-muted/30",
};

export interface PopularAppLink {
  label: string;
  href: string;
}

export const SHADOWBOX_GATEWAY_POPULAR_APPS: Record<ShadowboxGatewayColorName, PopularAppLink[]> = {
  Black: [
    { label: "Sports Jerseys", href: "/jersey-frames" },
    { label: "Military Medals", href: "/military-frames" },
    { label: "Vinyl Records", href: "/specialty/record-album-frames" },
    { label: "Collectibles", href: "/shadowbox" },
    { label: "Awards & Honors", href: "/shadowbox" },
  ],
  White: [
    { label: "Artwork & Photos", href: "/shadowbox" },
    { label: "Signed Memorabilia", href: "/shadowbox" },
    { label: "Vinyl Records", href: "/specialty/record-album-frames" },
    { label: "Wedding Keepsakes", href: "/shadowbox" },
    { label: "Family Treasures", href: "/shadowbox" },
  ],
  Brown: [
    { label: "Vintage Collectibles", href: "/shadowbox" },
    { label: "Classic Records", href: "/specialty/record-album-frames" },
    { label: "Family Heirlooms", href: "/shadowbox" },
    { label: "Historic Photos", href: "/shadowbox" },
    { label: "Rustic Décor", href: "/shadowbox" },
  ],
  Silver: [
    { label: "Athletic Medals", href: "/military-frames" },
    { label: "Corporate Awards", href: "/shadowbox" },
    { label: "Trophy Displays", href: "/shadowbox" },
    { label: "Achievement Certificates", href: "/shadowbox" },
    { label: "Modern Collectibles", href: "/shadowbox" },
    { label: "Records & Albums", href: "/specialty/record-album-frames" },
  ],
  Gold: [
    { label: "Championship Jerseys", href: "/jersey-frames" },
    { label: "Military Medals", href: "/military-frames" },
    { label: "Championship Rings", href: "/shadowbox" },
    { label: "Gold Records", href: "/specialty/record-album-frames" },
    { label: "Lifetime Honors", href: "/shadowbox" },
    { label: "Prestigious Awards", href: "/shadowbox" },
  ],
  Blue: [
    { label: "Nautical Memorabilia", href: "/shadowbox" },
    { label: "School Jerseys", href: "/jersey-frames" },
    { label: "Graduation Items", href: "/shadowbox" },
    { label: "Team Displays", href: "/shadowbox" },
    { label: "Coastal Collections", href: "/shadowbox" },
    { label: "Music Memorabilia", href: "/specialty/record-album-frames" },
  ],
  Natural: [
    { label: "Vintage Memorabilia", href: "/shadowbox" },
    { label: "Nature Collections", href: "/shadowbox" },
    { label: "Family Heirlooms", href: "/shadowbox" },
    { label: "Folk Music", href: "/specialty/record-album-frames" },
    { label: "Rustic Displays", href: "/shadowbox" },
    { label: "Pressed Botanicals", href: "/shadowbox" },
  ],
};

/** Lucide icon name for vignette row (resolved in page content) */
export type GatewayVignetteIconId =
  | "shirt"
  | "disc3"
  | "award"
  | "image"
  | "heart"
  | "clock"
  | "bookOpen"
  | "trophy"
  | "crown"
  | "anchor"
  | "graduationCap"
  | "trees"
  | "home";

export interface GatewayVignette {
  icon: GatewayVignetteIconId;
  title: string;
  body: string;
  popularFor: string;
}

export const SHADOWBOX_GATEWAY_VIGNETTES: Record<ShadowboxGatewayColorName, GatewayVignette[]> = {
  Black: [
    {
      icon: "shirt",
      title: "Sports Memorabilia",
      body: "Black frames create striking contrast that makes team jerseys pop. The professional look complements athletic memorabilia, from signed game-worn jerseys to championship gear. Deep profiles accommodate folded uniforms, and black borders direct attention to team colors and player numbers without distraction.",
      popularFor:
        "Popular for: Signed jerseys, game-worn uniforms, championship team gear, sports autographs",
    },
    {
      icon: "disc3",
      title: "Music & Entertainment",
      body: "Showcase vinyl records, signed album covers, and concert memorabilia in sleek black frames. The neutral finish highlights colorful album artwork while the shadowbox depth protects valuable records from dust and damage. Create a sophisticated music gallery wall that celebrates your collection.",
      popularFor: "Popular for: Vinyl LP records, signed album covers, concert tickets, backstage passes",
    },
    {
      icon: "award",
      title: "Awards & Achievements",
      body: "Military medals, corporate awards, and achievement certificates deserve elegant presentation. Black shadowboxes provide formal, dignified display for career milestones and service honors. Multi-depth compartments organize medals, ribbons, and documentation with professional sophistication.",
      popularFor: "Popular for: Military medals, challenge coins, corporate awards, service ribbons",
    },
  ],
  White: [
    {
      icon: "image",
      title: "Fine Art & Photography",
      body: "White shadowbox frames create the perfect gallery presentation for prints, watercolors, and photographs. The bright finish provides a clean border that enhances artwork without competing for attention. Depth accommodates textured papers, canvas wraps, and matted pieces creating professional-grade displays.",
      popularFor:
        "Popular for: Photography prints, watercolor art, canvas pieces, limited edition prints",
    },
    {
      icon: "disc3",
      title: "Music Memorabilia",
      body: "Display colorful album covers and music collectibles in crisp white frames that make artwork pop. The bright white moulding and light-reflecting interior amplify colorful album artwork into gallery-caliber wall displays. The shadowbox depth protects vinyl records while the white finish complements any décor style from traditional to contemporary.",
      popularFor: "Popular for: Vinyl records, album art, concert posters, music autographs",
    },
    {
      icon: "heart",
      title: "Family Treasures",
      body: "Preserve wedding invitations, baby announcements, and family heirlooms in elegant white shadowboxes. The clean finish creates a light, welcoming display for nurseries, family rooms, and entryways. Combine photos with 3D keepsakes like baby shoes, wedding favors, or pressed flowers for personalized memory displays.",
      popularFor: "Popular for: Wedding memories, baby keepsakes, family heirlooms, vintage letters",
    },
  ],
  Brown: [
    {
      icon: "clock",
      title: "Vintage Sports Memorabilia",
      body: "Brown wood frames add classic character to vintage baseball cards, retro jerseys, and historical sports moments. The warm tones complement aged photographs and sepia-toned memories, creating nostalgic displays that honor sports history and heritage with timeless elegance.",
      popularFor:
        "Popular for: Vintage baseball cards, retro jerseys, historical sports photos, classic memorabilia",
    },
    {
      icon: "disc3",
      title: "Music Heritage",
      body: "Showcase classic rock albums, jazz records, and country music collectibles in warm brown frames that evoke the golden era of vinyl. Natural wood tones create authentic music-hall atmosphere, with usable depths ranging from standard to extra-deep for accommodating 12-inch LP sleeves and thick gatefold packaging.",
      popularFor:
        "Popular for: Classic vinyl records, vintage album covers, country music memorabilia, folk collectibles",
    },
    {
      icon: "bookOpen",
      title: "Family Heirlooms",
      body: "Preserve generational treasures like antique pocket watches, vintage letters, and ancestral photographs. Brown shadowboxes create dignified displays that honor family history with traditional elegance. The warm finish pairs beautifully with aged documents and historic artifacts.",
      popularFor:
        "Popular for: Antique pocket watches, vintage letters, historical documents, family photographs",
    },
  ],
  Silver: [
    {
      icon: "award",
      title: "Athletic Medals & Championships",
      body: "Silver frames naturally complement athletic medals, marathon finishers, and competition achievements. The metallic finish coordinates with medal ribbons and creates cohesive displays for multiple medals. The brushed metallic finish pairs directly with Olympic-style medals, marathon finisher hardware, and triathlon collections where the frame tone matches the award itself.",
      popularFor: "Popular for: Marathon medals, Olympic achievements, athletic championships, race bibs",
    },
    {
      icon: "trophy",
      title: "Corporate Awards & Recognition",
      body: "Showcase employee achievement awards, sales milestones, and business certifications in professional silver frames. The modern metallic finish complements corporate environments and creates sophisticated displays for executive offices, reception areas, and conference rooms. Each frame ships with archival-quality backing board and hardware rated for wall-mounted display up to 25 lbs.",
      popularFor:
        "Popular for: Employee awards, sales achievements, professional certifications, business milestones",
    },
    {
      icon: "disc3",
      title: "Music & Modern Collectibles",
      body: "Display contemporary music memorabilia, platinum records, and modern collectibles in sleek silver frames. The metallic finish creates gallery-quality presentation for signed photographs, concert tickets, and entertainment achievements. The cool-toned metallic moulding pairs with monochrome album artwork and modern entertainment memorabilia without visual competition.",
      popularFor: "Popular for: Platinum records, signed photos, concert memorabilia, modern collectibles",
    },
  ],
  Gold: [
    {
      icon: "trophy",
      title: "Championship Sports Memorabilia",
      body: 'Gold frames provide championship-worthy presentation for Super Bowl jerseys, World Series memorabilia, and Olympic gold medals. The luxurious finish enhances the prestige of victory and creates trophy room displays that honor athletic excellence. The 2.5" to 3.5" usable depth accommodates championship rings mounted on holders, signed game balls, and multi-item team achievement collections.',
      popularFor:
        "Popular for: Championship jerseys, Olympic gold medals, Super Bowl memorabilia, championship rings",
    },
    {
      icon: "disc3",
      title: "Gold Record & Music Awards",
      body: "Showcase certified gold records, platinum albums, and Grammy awards in matching gold frames. The coordinated metallic finish creates cohesive displays for recording studios, music venues, and artist collections. The gold-toned wood moulding and acid-free backing protect displayed items while the warm metallic finish unifies multi-piece arrangements.",
      popularFor: "Popular for: Gold records, Grammy awards, platinum albums, RIAA certifications",
    },
    {
      icon: "crown",
      title: "Military & Prestigious Honors",
      body: "Display high military medals, lifetime achievement awards, and hall of fame honors in elegant gold frames. The formal finish creates distinguished presentations for executive offices and home libraries. Retirement shadowbox layouts accommodate medals, rank insignia, service ribbons, and career documentation within the solid wood construction and acid-free backing.",
      popularFor:
        "Popular for: Military medals, lifetime achievements, hall of fame honors, distinguished service awards",
    },
  ],
  Blue: [
    {
      icon: "anchor",
      title: "Nautical & Coastal Memorabilia",
      body: "Blue frames naturally complement maritime collections, beach memories, and coastal décor. The ocean-toned moulding pairs well with ship models, navigation instruments, vintage postcards from seaside vacations, and naval service honors. The ocean-inspired color enhances nautical themes and creates authentic coastal presentations for beach houses and maritime enthusiasts.",
      popularFor:
        "Popular for: Ship models, nautical instruments, beach vacation memories, naval service medals",
    },
    {
      icon: "graduationCap",
      title: "School Colors & Team Spirit",
      body: "Match your alma mater or favorite team's colors with blue shadowbox frames. Ideal for displaying school jerseys, varsity letters, graduation memorabilia, and team achievements. Blue complements many university colors, from Duke to UCLA, Kentucky to North Carolina, creating spirited displays that honor academic and athletic accomplishments.",
      popularFor: "Popular for: School jerseys, varsity letters, graduation items, university memorabilia",
    },
    {
      icon: "disc3",
      title: "Music & Statement Pieces",
      body: "Create bold, contemporary displays for rock albums, blues records, and concert memorabilia. Blue frames add unexpected flair to music collections and pop culture items, making statement displays in modern interiors where traditional black or brown feels too conventional. The bold blue finish highlights personality and turns memorabilia into conversation pieces.",
      popularFor: "Popular for: Blues albums, rock memorabilia, concert posters, music festival collectibles",
    },
  ],
  Natural: [
    {
      icon: "trees",
      title: "Nature & Outdoor Memories",
      body: "Natural wood frames beautifully showcase hiking achievements, camping memorabilia, and outdoor adventure collections. The organic finish complements nature photography, pressed flowers, and wilderness maps. The visible grain pattern enhances trail markers, national park stamps, mountain summit records, and botanical specimens with authentic rustic character.",
      popularFor: "Popular for: Nature photography, hiking memorabilia, pressed botanicals, outdoor adventures",
    },
    {
      icon: "disc3",
      title: "Folk & Acoustic Music",
      body: "Display folk music collections, acoustic albums, and singer-songwriter memorabilia in frames that match the organic, authentic aesthetic. Natural wood complements vintage country records, bluegrass collections, and indie folk art. The warm finish creates gallery walls that resonate with music lovers seeking earthy, artistic presentations.",
      popularFor: "Popular for: Folk albums, acoustic music art, country records, singer-songwriter items",
    },
    {
      icon: "home",
      title: "Home & Family Treasures",
      body: "Natural frames work with any home décor, modern, traditional, farmhouse, or Scandinavian. The clear-coated hardwood finish complements family recipes, handwritten letters, children's artwork, and home blessing signs. The neutral wood tone adapts to changing décor styles over the years, creating timeless family heirloom displays.",
      popularFor:
        "Popular for: Family recipes, handwritten letters, children's art, vintage heirlooms",
    },
  ],
};

export interface TechSpecCard {
  title: string;
  intro: string;
  bullets: [string, string, string];
}

export interface GatewayTechSpecs {
  depth: TechSpecCard;
  uv: TechSpecCard;
  materials: TechSpecCard;
}

export const SHADOWBOX_GATEWAY_TECH_SPECS: Record<ShadowboxGatewayColorName, GatewayTechSpecs> = {
  Black: {
    depth: {
      title: "Depth Options",
      intro: 'Available in multiple depths from 0.875" to 3.5" for flat items, jerseys, or complex displays',
      bullets: ["• Standard: Medals, photos, documents", "• Deep: Jerseys, thick items, records", "• Extra Deep: Multi-layer displays"],
    },
    uv: {
      title: "UV Protection",
      intro: "Premium acrylic with 99% UV filtering preserves fabric colors and prevents fading",
      bullets: ["• Blocks harmful UV rays", "• Prevents jersey fading", "• Crystal-clear viewing"],
    },
    materials: {
      title: "Frame Materials",
      intro: "Premium hardwood with rich black finishes for professional, modern appearance",
      bullets: ["• Solid wood construction", "• Matte or satin finishes", "• Professional quality"],
    },
  },
  White: {
    depth: {
      title: "Depth Options",
      intro: "Available in multiple depths for flat artwork, dimensional pieces, or complex layered displays",
      bullets: ["• Standard: Photos, flat art, documents", "• Deep: Canvas, thick frames, records", "• Extra Deep: Multi-layer displays"],
    },
    uv: {
      title: "UV Protection",
      intro: "Premium acrylic with 99% UV filtering preserves artwork colors and prevents paper yellowing",
      bullets: ["• Blocks harmful UV rays", "• Prevents photo fading", "• Crystal-clear viewing"],
    },
    materials: {
      title: "Frame Materials",
      intro: "Premium hardwood with bright white or soft cream finishes for a clean, modern look",
      bullets: ["• Solid wood construction", "• Smooth matte finish", "• Multiple white tones available"],
    },
  },
  Brown: {
    depth: {
      title: "Depth Options",
      intro: "Multiple depth options accommodate flat collectibles, thick vintage items, and layered family displays",
      bullets: ["• Standard: Cards, photos, documents", "• Deep: Records, thick books, watches", "• Extra Deep: Multi-layer heritage displays"],
    },
    uv: {
      title: "UV Protection",
      intro: "Premium acrylic preserves vintage photographs, documents, and fabric from harmful UV degradation",
      bullets: ["• Prevents photo yellowing", "• Protects aged documents", "• Preserves fabric colors"],
    },
    materials: {
      title: "Frame Materials",
      intro: "Real hardwood construction in rich walnut, warm oak, and honey finishes for authentic character",
      bullets: ["• Solid wood profiles", "• Natural grain patterns", "• Multiple brown tones"],
    },
  },
  Silver: {
    depth: {
      title: "Depth Options",
      intro: "Multiple depth options from shallow to deep for medals, awards, and complex displays",
      bullets: ["• Standard: Medals, certificates, photos", "• Deep: Awards, trophies, thick items", "• Extra Deep: Multi-layer displays"],
    },
    uv: {
      title: "UV Protection",
      intro: "Premium acrylic with 99% UV filtering preserves memorabilia and prevents fading",
      bullets: ["• Blocks harmful UV rays", "• Prevents ribbon fading", "• Crystal-clear viewing"],
    },
    materials: {
      title: "Frame Materials",
      intro: "Premium wood with elegant silver metallic finishes for contemporary, professional appearance",
      bullets: ["• Solid wood construction", "• Metallic silver finishes", "• Tarnish-resistant coating"],
    },
  },
  Gold: {
    depth: {
      title: "Depth Options",
      intro: "Available in multiple depths for medals, jerseys, championship rings, and complex displays",
      bullets: ["• Standard: Medals, records, certificates", "• Deep: Championship jerseys, awards", "• Extra Deep: Rings, multi-layer trophy displays"],
    },
    uv: {
      title: "UV Protection",
      intro: "Premium acrylic with 99% UV filtering preserves fabric, metals, and autographs",
      bullets: ["• Prevents jersey fading", "• Protects autograph ink", "• Maintains medal luster"],
    },
    materials: {
      title: "Frame Materials",
      intro: "Premium wood with luxurious gold finishes from polished to antique styles",
      bullets: ["• Polished or antique gold", "• Solid wood construction", "• Professional-grade finishes"],
    },
  },
  Blue: {
    depth: {
      title: "Depth Options",
      intro: "Multiple depth options for flat items, jerseys, ship models, and coastal displays",
      bullets: ["• Standard: Photos, letters, pins", "• Deep: Jerseys, nautical items", "• Extra Deep: Ship models, large collectibles"],
    },
    uv: {
      title: "UV Protection",
      intro: "Premium acrylic with 99% UV filtering prevents fading of fabrics and photos",
      bullets: ["• Prevents color fading", "• Protects jersey fabrics", "• Preserves photographs"],
    },
    materials: {
      title: "Frame Materials",
      intro: "Solid wood with blue finishes from navy to coastal shades, matte or distressed options",
      bullets: ["• Navy, royal, or coastal blue", "• Solid wood construction", "• Contemporary matte finishes"],
    },
  },
  Natural: {
    depth: {
      title: "Depth Options",
      intro: "Multiple depths for pressed flowers, thick textiles, records, and layered nature displays",
      bullets: ["• Standard: Pressed botanicals, photos", "• Deep: Thick textiles, records", "• Extra Deep: Multi-layer natural displays"],
    },
    uv: {
      title: "UV Protection",
      intro: "Premium acrylic with 99% UV filtering protects natural materials and photographs",
      bullets: ["• Preserves pressed flowers", "• Prevents photo fading", "• Protects natural fibers"],
    },
    materials: {
      title: "Frame Materials",
      intro: "Real hardwood with clear finishes showcasing natural grain from light maple to medium oak",
      bullets: ["• Visible wood grain patterns", "• Eco-friendly hardwoods", "• Clear protective finish"],
    },
  },
};

export const SHADOWBOX_GATEWAY_FINAL_CTA: Record<
  ShadowboxGatewayColorName,
  { title: string; description: string }
> = {
  Black: {
    title: "Create Your Black Shadowbox Frame",
    description:
      "Design a custom black shadowbox frame with the perfect depth for your memorabilia. Choose from multiple depth options, add professional-grade UV protection, and create a professional display worthy of your treasured items.",
  },
  White: {
    title: "Create Your White Shadowbox Frame",
    description:
      "Design a custom white shadowbox frame with the perfect depth for your artwork or keepsakes. Choose from multiple depth options, add professional-grade UV protection, and create a gallery-worthy display.",
  },
  Brown: {
    title: "Create Your Brown Shadowbox Frame",
    description:
      "Design a custom brown shadowbox frame that brings warmth and character to your vintage treasures. Choose from rich walnut to honey oak finishes, select the perfect depth, and create displays that honor your heritage.",
  },
  Silver: {
    title: "Create Your Silver Shadowbox Frame",
    description:
      "Design a custom silver shadowbox frame with elegant metallic sophistication. Choose from multiple depth options, add professional-grade UV protection, and create a contemporary display that celebrates your achievements with modern style.",
  },
  Gold: {
    title: "Create Your Gold Shadowbox Frame",
    description:
      "Design a custom gold shadowbox frame worthy of your championship achievements and prestigious honors. Choose from polished or antique gold finishes with premium UV protection for lasting preservation of your most valued memorabilia.",
  },
  Blue: {
    title: "Create Your Blue Shadowbox Frame",
    description:
      "Design a custom blue shadowbox frame that makes a distinctive statement. Solid wood construction with navy, coastal, or royal blue finishes and UV-protective acrylic ensures lasting preservation for nautical themes, school spirit, and unique collections.",
  },
  Natural: {
    title: "Create Your Natural Wood Shadowbox",
    description:
      "Design a custom natural wood shadowbox frame that celebrates organic beauty and authentic grain patterns. Solid hardwood construction with clear protective coating preserves vintage memorabilia, nature collections, and rustic displays with professional-grade UV protection.",
  },
};
