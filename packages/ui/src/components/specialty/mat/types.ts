/**
 * Mat Configurator type definitions (aligned with CustomFrameSizes-CODE)
 */

export type MatShape = "rect" | "oval";

export type CornerStyle = "square" | "rounded";

export interface MatOpening {
  id: string;
  shape: MatShape;
  xIn: number;
  yIn: number;
  wIn?: number;
  hIn?: number;
  cornerStyle?: CornerStyle;
}

export interface MatLayer {
  color: string;
  openings: MatOpening[];
}

export interface MatConfig {
  overallWIn: number;
  overallHIn: number;
  singleOrDouble: "single" | "double";
  topMat: MatLayer;
  bottomMat?: MatLayer;
  standardOverlap: boolean;
  matRevealWidth: number;
  quantity: number;
  vGroove?: { enabled: boolean; offsetIn: number };
  backingKit?: { enabled: boolean };
  showBorders?: boolean;
  /** Frame bundle: selected frame style id or null for mat only */
  selectedFrameId?: string | null;
  /** Glass/acrylic type id; default 'standard' when frame selected */
  selectedGlassId?: string | null;
  /** Hanging hardware: standard (free) or security (+$8.95) */
  hardware?: "standard" | "security";
}
