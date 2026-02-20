/**
 * Military Frame Branch Data
 * U.S. Military branches with mat colors (inspired by official branch colors).
 *
 * Data source: militaryBranches.csv from original repo
 * Structure: Branch → Top Mat, Bottom Mat, Backing (Suede)
 */

export interface MilitaryMatOption {
  sku: string;
  hex: string;
  name: string;
  swatchFile?: string;
}

export interface MilitaryBranch {
  id: string;
  name: string;
  displayName: string;
  topMat: MilitaryMatOption;
  bottomMat: MilitaryMatOption;
  backing: MilitaryMatOption;
}

// Suede mat SKU to swatch file mapping (mats.json swatch convention)
const SUEDE_SWATCH_MAP: Record<string, string> = {
  VB9125: "29.jpg", // White Suede
  VB9142: "30.jpg", // Black Suede
  VB9141: "31.jpg", // Dark Gray Suede
  VB9140: "32.jpg", // Light Gray Suede
  VB9137: "33.jpg", // Beige Suede
  VB9134: "34.jpg", // Dark Red Suede
  VB9135: "35.jpg", // Red Suede
  VB9129: "36.jpg", // Green Suede
  VB9133: "37.jpg", // Navy Blue Suede
  VB9124: "38.jpg", // Blue Suede
};

// Embedded branch data (from militaryBranches.csv)
const MILITARY_BRANCHES_DATA: Omit<MilitaryBranch, "id">[] = [
  {
    name: "Army",
    displayName: "U.S. Army",
    topMat: { sku: "VB524", hex: "#203731", name: "Army Green", swatchFile: undefined },
    bottomMat: { sku: "VB577", hex: "#FFB612", name: "Classic Gold", swatchFile: undefined },
    backing: { sku: "VB9137", hex: "#4B5320", name: "Beige Suede", swatchFile: "33.jpg" },
  },
  {
    name: "Navy",
    displayName: "U.S. Navy",
    topMat: { sku: "VB131", hex: "#00205B", name: "Navy Blue", swatchFile: undefined },
    bottomMat: { sku: "VB472", hex: "#C4CED4", name: "Silver", swatchFile: undefined },
    backing: { sku: "VB9133", hex: "#041E42", name: "Navy Blue Suede", swatchFile: "37.jpg" },
  },
  {
    name: "Air Force",
    displayName: "U.S. Air Force",
    topMat: { sku: "CB544", hex: "#0033A0", name: "Cobalt Blue", swatchFile: undefined },
    bottomMat: { sku: "VB577", hex: "#FFD100", name: "Gold Accent", swatchFile: undefined },
    backing: { sku: "VB9141", hex: "#8A8D8F", name: "Dark Gray Suede", swatchFile: "31.jpg" },
  },
  {
    name: "Marine Corps",
    displayName: "U.S. Marine Corps",
    topMat: { sku: "VB459", hex: "#BA0000", name: "Marine Red", swatchFile: undefined },
    bottomMat: { sku: "VB577", hex: "#FFD700", name: "Gold", swatchFile: undefined },
    backing: { sku: "VB9142", hex: "#000000", name: "Black Suede", swatchFile: "30.jpg" },
  },
  {
    name: "Coast Guard",
    displayName: "U.S. Coast Guard",
    topMat: { sku: "CB544", hex: "#003366", name: "Flag Blue", swatchFile: undefined },
    bottomMat: { sku: "VB459", hex: "#CE1126", name: "Red", swatchFile: undefined },
    backing: { sku: "VB9140", hex: "#FFFFFF", name: "Light Gray Suede", swatchFile: "32.jpg" },
  },
  {
    name: "Space Force",
    displayName: "U.S. Space Force",
    topMat: { sku: "VB131", hex: "#001628", name: "Deep Navy", swatchFile: undefined },
    bottomMat: { sku: "VB472", hex: "#C4CED4", name: "Silver", swatchFile: undefined },
    backing: { sku: "VB9141", hex: "#8A8D8F", name: "Dark Gray Suede", swatchFile: "31.jpg" },
  },
];

function buildBranches(): MilitaryBranch[] {
  return MILITARY_BRANCHES_DATA.map((b) => ({
    ...b,
    id: b.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    backing: {
      ...b.backing,
      swatchFile: SUEDE_SWATCH_MAP[b.backing.sku] ?? b.backing.swatchFile,
    },
  }));
}

export const MILITARY_BRANCHES = buildBranches();

export function getMilitaryBranchById(id: string): MilitaryBranch | undefined {
  return MILITARY_BRANCHES.find((b) => b.id === id);
}

export function getAllMilitaryBranches(): MilitaryBranch[] {
  return MILITARY_BRANCHES;
}
