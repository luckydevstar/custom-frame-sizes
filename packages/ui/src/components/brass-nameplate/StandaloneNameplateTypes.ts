export const STANDALONE_NAMEPLATE_SPECS = {
  MIN_WIDTH: 1.5,
  MAX_WIDTH: 12,
  MIN_HEIGHT: 1.5,
  MAX_HEIGHT: 12,
  BORDER_INSET: 0.25,
  MIN_PRICE: 29,
  MAX_PRICE: 129,
  SETUP_FEE: 18,
  RATE_PER_SQ_INCH: 2.25,
  MIN_FONT_SIZE: 8,
  MAX_FONT_SIZE: 72,
  DEFAULT_FONT_SIZE: 24,
  INITIAL_LINES: 2,
  MAX_VISIBLE_LINES: 6,
  MIN_LINE_SPACING: 0.8,
  MAX_LINE_SPACING: 2.0,
  DEFAULT_LINE_SPACING: 1.2,
} as const;

export const FONT_OPTIONS = [
  { id: "georgia", name: "Georgia", family: 'Georgia, "Times New Roman", serif' },
  { id: "arial", name: "Arial", family: "Arial, Helvetica, sans-serif" },
  { id: "trajan-pro", name: "Cinzel", family: '"Cinzel", "Times New Roman", serif' },
  { id: "dancing-script", name: "Dancing Script", family: '"Dancing Script", cursive' },
  { id: "courier-new", name: "Courier New", family: '"Courier New", Courier, monospace' },
] as const;

export type ColorId = "brass-black" | "silver-black" | "black-gold" | "black-silver";

export interface ColorOption {
  id: ColorId;
  name: string;
  shortName: string;
  plaqueColor: string;
  textColor: string;
  metallic?: boolean;
  metallicSilver?: boolean;
  metallicText?: boolean;
}

export const COLOR_OPTIONS: ColorOption[] = [
  {
    id: "brass-black",
    name: "Brass with Black Text",
    shortName: "Brass",
    plaqueColor:
      "linear-gradient(135deg, #D4AF37 0%, #F0E68C 25%, #B8860B 50%, #DAA520 75%, #B8860B 100%)",
    textColor: "#000000",
    metallic: true,
  },
  {
    id: "silver-black",
    name: "Silver with Black Text",
    shortName: "Silver",
    plaqueColor:
      "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 25%, #A8A8A8 50%, #D0D0D0 75%, #A8A8A8 100%)",
    textColor: "#000000",
    metallicSilver: true,
  },
  {
    id: "black-gold",
    name: "Black with Gold Text",
    shortName: "Black/Gold",
    plaqueColor: "#1A1A1A",
    textColor:
      "linear-gradient(135deg, #D4AF37 0%, #F0E68C 25%, #B8860B 50%, #DAA520 75%, #B8860B 100%)",
    metallicText: true,
  },
  {
    id: "black-silver",
    name: "Black with Silver Text",
    shortName: "Black/Silver",
    plaqueColor: "#1A1A1A",
    textColor:
      "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 25%, #A8A8A8 50%, #D0D0D0 75%, #A8A8A8 100%)",
    metallicText: true,
  },
];

export type FontId = (typeof FONT_OPTIONS)[number]["id"];
export type Alignment = "left" | "center" | "right";

export interface TextLine {
  id: string;
  text: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
}

export interface StandaloneNameplateConfig {
  width: number;
  height: number;
  color: ColorId;
  font: FontId;
  alignment: Alignment;
  lineSpacing: number;
  lines: TextLine[];
}

export function calculateUsableSpace(
  width: number,
  height: number
): { width: number; height: number } {
  const usableWidth = Math.max(0, width - STANDALONE_NAMEPLATE_SPECS.BORDER_INSET * 2);
  const usableHeight = Math.max(0, height - STANDALONE_NAMEPLATE_SPECS.BORDER_INSET * 2);
  return { width: usableWidth, height: usableHeight };
}

export function calculatePrice(width: number, height: number): number {
  const {
    MIN_PRICE,
    MAX_PRICE,
    SETUP_FEE,
    RATE_PER_SQ_INCH,
    MIN_WIDTH,
    MIN_HEIGHT,
    MAX_WIDTH,
    MAX_HEIGHT,
  } = STANDALONE_NAMEPLATE_SPECS;

  const clampedWidth = Math.max(MIN_WIDTH, Math.min(width, MAX_WIDTH));
  const clampedHeight = Math.max(MIN_HEIGHT, Math.min(height, MAX_HEIGHT));

  const area = clampedWidth * clampedHeight;
  const calculatedPrice = SETUP_FEE + RATE_PER_SQ_INCH * area;

  const finalPrice = Math.min(MAX_PRICE, Math.max(MIN_PRICE, calculatedPrice));

  return Math.round(finalPrice * 100) / 100;
}

export function createDefaultLine(id: string, isFirst: boolean = false): TextLine {
  return {
    id,
    text: "",
    fontSize: isFirst ? 28 : STANDALONE_NAMEPLATE_SPECS.DEFAULT_FONT_SIZE,
    bold: isFirst,
    italic: false,
  };
}

export function getDefaultConfig(): StandaloneNameplateConfig {
  return {
    width: 4,
    height: 1.5,
    color: "brass-black",
    font: "georgia",
    alignment: "center",
    lineSpacing: STANDALONE_NAMEPLATE_SPECS.DEFAULT_LINE_SPACING,
    lines: [createDefaultLine("line-1", true), createDefaultLine("line-2", false)],
  };
}

export function estimateTextWidth(
  text: string,
  fontSize: number,
  fontFamily: string,
  bold: boolean = false,
  italic: boolean = false
): number {
  if (typeof document === "undefined") return text.length * fontSize * 0.5;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return text.length * fontSize * 0.5;

  const fontStyle = italic ? "italic " : "";
  const fontWeight = bold ? "bold " : "";
  context.font = `${fontStyle}${fontWeight}${fontSize}pt ${fontFamily}`;
  return context.measureText(text).width;
}

export function checkTextOverflow(
  lines: TextLine[],
  usableWidth: number,
  usableHeight: number,
  fontFamily: string,
  lineSpacing: number = 1.2
): { hasOverflow: boolean; overflowingLines: string[] } {
  const DPI = 72;
  const usableWidthPx = usableWidth * DPI;
  const usableHeightPx = usableHeight * DPI;

  const overflowingLines: string[] = [];
  let totalHeight = 0;

  for (const line of lines) {
    if (!line.text.trim()) continue;

    const lineHeight = line.fontSize * lineSpacing;
    totalHeight += lineHeight;

    const textWidth = estimateTextWidth(
      line.text,
      line.fontSize,
      fontFamily,
      line.bold,
      line.italic
    );
    if (textWidth > usableWidthPx) {
      overflowingLines.push(line.id);
    }
  }

  const hasVerticalOverflow = totalHeight > usableHeightPx;
  const hasHorizontalOverflow = overflowingLines.length > 0;

  return {
    hasOverflow: hasVerticalOverflow || hasHorizontalOverflow,
    overflowingLines,
  };
}

export function configToUrlParams(config: StandaloneNameplateConfig): string {
  const params = new URLSearchParams();
  params.set("w", config.width.toString());
  params.set("h", config.height.toString());
  params.set("c", config.color);
  params.set("f", config.font);
  params.set("a", config.alignment);
  params.set("ls", config.lineSpacing.toString());

  const linesData = config.lines
    .map(
      (line) =>
        `${encodeURIComponent(line.text)}|${line.fontSize}|${line.bold ? "1" : "0"}|${line.italic ? "1" : "0"}`
    )
    .join("~");
  params.set("lines", linesData);

  return params.toString();
}

export function urlParamsToConfig(search: string): Partial<StandaloneNameplateConfig> | null {
  try {
    const params = new URLSearchParams(search);
    const config: Partial<StandaloneNameplateConfig> = {};

    const w = params.get("w");
    const h = params.get("h");
    const c = params.get("c");
    const f = params.get("f");
    const a = params.get("a");
    const ls = params.get("ls");
    const linesData = params.get("lines");

    if (w) config.width = parseFloat(w);
    if (h) config.height = parseFloat(h);
    if (c && ["brass-black", "silver-black", "black-gold", "black-silver"].includes(c)) {
      config.color = c as ColorId;
    }
    if (f && FONT_OPTIONS.some((opt) => opt.id === f)) {
      config.font = f as FontId;
    }
    if (a && ["left", "center", "right"].includes(a)) {
      config.alignment = a as Alignment;
    }
    if (ls) config.lineSpacing = parseFloat(ls);

    if (linesData) {
      const lines: TextLine[] = linesData.split("~").map((lineStr, index) => {
        const [text, fontSize, bold, italic] = lineStr.split("|");
        return {
          id: `line-${index + 1}`,
          text: decodeURIComponent(text || ""),
          fontSize: parseInt(fontSize) || STANDALONE_NAMEPLATE_SPECS.DEFAULT_FONT_SIZE,
          bold: bold === "1",
          italic: italic === "1",
        };
      });
      if (lines.length > 0) config.lines = lines;
    }

    return Object.keys(config).length > 0 ? config : null;
  } catch {
    return null;
  }
}
