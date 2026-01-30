/**
 * Magazine Reference Data
 *
 * Data about popular magazines for tooltips and reference.
 */

export interface MagazineReference {
  name: string;
  sizeId: string;
  dimensions: string;
  circulation?: string;
  description?: string;
  era?: string;
  category: "current" | "historical" | "specialty";
}

export const MAGAZINE_REFERENCES: MagazineReference[] = [
  {
    name: "Reader's Digest",
    sizeId: "compact-55x75",
    dimensions: "5½×7½ inches",
    circulation: "Classic compact format",
    category: "current",
    description: "Iconic digest-sized magazine",
  },
  {
    name: "TV Guide",
    sizeId: "compact-55x75",
    dimensions: "5½×7½ inches",
    category: "historical",
    era: "Classic digest format 1953-2005",
    description: "Collectible television listings magazine",
  },
  {
    name: "Jet",
    sizeId: "compact-55x75",
    dimensions: "5½×7½ inches",
    category: "historical",
    description: "African American news and culture weekly",
  },
  {
    name: "National Geographic",
    sizeId: "compact-7x10",
    dimensions: "7×10 inches",
    circulation: "1.65M subscribers (2024)",
    category: "current",
    description: "Iconic yellow-bordered exploration magazine",
  },
  {
    name: "People",
    sizeId: "standard-8x105",
    dimensions: "8×10½ inches",
    circulation: "High-circulation weekly",
    category: "current",
    description: "Celebrity news and human interest",
  },
  {
    name: "TIME",
    sizeId: "standard-8x105",
    dimensions: "8×10½ inches",
    circulation: "Iconic news magazine",
    category: "current",
    description: "The red-bordered news magazine",
  },
  {
    name: "Entertainment Weekly",
    sizeId: "standard-8x105",
    dimensions: "8×10½ inches",
    category: "historical",
    era: "Print edition 1990-2022",
    description: "Entertainment and pop culture",
  },
  {
    name: "Sports Illustrated",
    sizeId: "standard-8x105",
    dimensions: "8×10½ inches",
    category: "current",
    description: "Sports journalism and photography",
  },
  {
    name: "Rolling Stone",
    sizeId: "standard-8x11",
    dimensions: "8×11 inches",
    category: "historical",
    era: "2008-2018 format",
    description: "Music and culture magazine",
  },
  {
    name: "Vogue",
    sizeId: "standard-875x11",
    dimensions: "8¾×11 inches",
    circulation: "180K+ (UK edition 2024)",
    category: "current",
    description: "Fashion industry bible",
  },
  {
    name: "Life Magazine",
    sizeId: "large-105x14",
    dimensions: "10½×14 inches",
    circulation: "Peak: 8.5M (1969)",
    category: "historical",
    era: "Weekly 1936-1972",
    description: "Iconic photojournalism magazine",
  },
];

export function getMagazinesForSize(sizeId: string): MagazineReference[] {
  return MAGAZINE_REFERENCES.filter((mag) => mag.sizeId === sizeId);
}

export function getAllMagazineNames(): string[] {
  return MAGAZINE_REFERENCES.map((mag) => mag.name).sort();
}

export function getMagazinesForTooltip(sizeId: string): { magazines: string[]; hasMore: boolean } {
  const allMagazines = getMagazinesForSize(sizeId);
  if (allMagazines.length === 0) {
    return { magazines: ["Custom size for various magazines"], hasMore: false };
  }
  const current = allMagazines.filter((m) => m.category === "current");
  const historical = allMagazines.filter((m) => m.category === "historical");
  const sortedMagazines = [...current, ...historical];
  return { magazines: sortedMagazines.map((m) => m.name), hasMore: false };
}

export function formatSizeTooltip(sizeId: string): string {
  const magazines = getMagazinesForSize(sizeId);
  if (magazines.length === 0) return "Custom size for various magazines";
  const current = magazines.filter((m) => m.category === "current");
  const historical = magazines.filter((m) => m.category === "historical");
  const examples = current.length > 0 ? current : historical;
  const topThree = examples.slice(0, 3).map((m) => m.name);
  let tooltip = `Example magazines: ${topThree.join(", ")}`;
  if (examples.length > 3) tooltip += `, +${examples.length - 3} more`;
  return tooltip;
}

export function formatMagazineNameForSEO(name: string): string {
  if (name.toLowerCase().includes("frame")) return name;
  const shortNames = [
    "GQ",
    "TIME",
    "Elle",
    "Vogue",
    "Allure",
    "Wired",
    "Forbes",
    "Maxim",
    "FHM",
    "SPIN",
    "Jet",
  ];
  if (shortNames.includes(name)) return `${name} Magazine Frame`;
  if (name.toLowerCase().includes("magazine")) return `${name} Frame`;
  return `${name} Frame`;
}
