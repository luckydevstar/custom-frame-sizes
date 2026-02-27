/**
 * BorderOverlay – blueprint-style dimension lines for mat borders and spacing.
 * Migrated from CustomFrameSizes-CODE client/src/features/mat/BorderOverlay.tsx.
 * Simplified: rect and oval only; highlightMode "all" only.
 */

import type { MatConfig, MatOpening } from "./types";
import { getMatByName } from "@framecraft/config";

interface BorderOverlayProps {
  config: MatConfig;
  highlightMode?: "all" | "violations";
}

interface DimensionLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  text: string;
  orientation: "horizontal" | "vertical";
}

function getRelativeLuminance(hexColor: string): number {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const rs = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gs = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bs = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getRectBorders(opening: MatOpening, overallW: number, overallH: number) {
  const left = opening.xIn;
  const top = opening.yIn;
  const right = overallW - (opening.xIn + (opening.wIn ?? 0));
  const bottom = overallH - (opening.yIn + (opening.hIn ?? 0));
  return { left, top, right, bottom };
}

function getOvalBorders(opening: MatOpening, overallW: number, overallH: number) {
  const wIn = opening.wIn ?? 0;
  const hIn = opening.hIn ?? 0;
  const left = opening.xIn;
  const top = opening.yIn;
  const right = overallW - (opening.xIn + wIn);
  const bottom = overallH - (opening.yIn + hIn);
  return { left, top, right, bottom };
}

export function BorderOverlay({ config, highlightMode = "all" }: BorderOverlayProps) {
  const matHex = getMatByName(config.topMat.color)?.hexColor ?? "#FFFFFF";
  const luminance = getRelativeLuminance(matHex);
  const isLightMat = luminance > 0.5;

  const BORDER_COLOR = isLightMat ? "rgb(29, 78, 216)" : "rgb(96, 165, 250)";
  const SPACING_COLOR = isLightMat ? "rgb(217, 119, 6)" : "rgb(251, 191, 36)";
  const TEXT_STROKE = isLightMat ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.85)";
  const TEXT_SIZE = 0.45;
  const TEXT_OFFSET = 0.18;
  const ARROW_SIZE = 0.15;
  const LINE_WIDTH = 0.05;
  const TEXT_STROKE_WIDTH = 0.035;
  const DASH_PATTERN = "0.1 0.1";

  const dimensionLines: DimensionLine[] = [];
  const openings = config.topMat.openings;
  const W = config.overallWIn;
  const H = config.overallHIn;

  openings.forEach((opening) => {
    const borders =
      opening.shape === "rect" ? getRectBorders(opening, W, H) : getOvalBorders(opening, W, H);
    const openingLeft = opening.xIn;
    const openingTop = opening.yIn;
    const openingRight = opening.xIn + (opening.wIn ?? 0);
    const openingBottom = opening.yIn + (opening.hIn ?? 0);

    if (borders.left > 0) {
      dimensionLines.push({
        x1: 0,
        y1: openingTop + (openingBottom - openingTop) / 2,
        x2: openingLeft,
        y2: openingTop + (openingBottom - openingTop) / 2,
        text: borders.left.toFixed(2) + '"',
        orientation: "horizontal",
      });
    }
    if (borders.top > 0) {
      dimensionLines.push({
        x1: openingLeft + (openingRight - openingLeft) / 2,
        y1: 0,
        x2: openingLeft + (openingRight - openingLeft) / 2,
        y2: openingTop,
        text: borders.top.toFixed(2) + '"',
        orientation: "vertical",
      });
    }
    if (borders.right > 0) {
      dimensionLines.push({
        x1: openingRight,
        y1: openingTop + (openingBottom - openingTop) / 2,
        x2: W,
        y2: openingTop + (openingBottom - openingTop) / 2,
        text: borders.right.toFixed(2) + '"',
        orientation: "horizontal",
      });
    }
    if (borders.bottom > 0) {
      dimensionLines.push({
        x1: openingLeft + (openingRight - openingLeft) / 2,
        y1: openingBottom,
        x2: openingLeft + (openingRight - openingLeft) / 2,
        y2: H,
        text: borders.bottom.toFixed(2) + '"',
        orientation: "vertical",
      });
    }
  });

  // Spacing lines between opening pairs (rect/oval only)
  for (let i = 0; i < openings.length; i++) {
    for (let j = i + 1; j < openings.length; j++) {
      const a = openings[i];
      const b = openings[j];
      if (!a || !b) {
        continue;
      }
      const b1 = {
        left: a.xIn,
        top: a.yIn,
        right: a.xIn + (a.wIn ?? 0),
        bottom: a.yIn + (a.hIn ?? 0),
      };
      const b2 = {
        left: b.xIn,
        top: b.yIn,
        right: b.xIn + (b.wIn ?? 0),
        bottom: b.yIn + (b.hIn ?? 0),
      };
      const verticalOverlap = Math.max(b1.top, b2.top) < Math.min(b1.bottom, b2.bottom);
      if (verticalOverlap && b1.right < b2.left) {
        const spacing = b2.left - b1.right;
        const centerY = (Math.max(b1.top, b2.top) + Math.min(b1.bottom, b2.bottom)) / 2;
        dimensionLines.push({
          x1: b1.right,
          y1: centerY,
          x2: b2.left,
          y2: centerY,
          text: "↔ " + spacing.toFixed(2) + '"',
          orientation: "horizontal",
        });
      } else if (verticalOverlap && b2.right < b1.left) {
        const spacing = b1.left - b2.right;
        const centerY = (Math.max(b1.top, b2.top) + Math.min(b1.bottom, b2.bottom)) / 2;
        dimensionLines.push({
          x1: b2.right,
          y1: centerY,
          x2: b1.left,
          y2: centerY,
          text: "↔ " + spacing.toFixed(2) + '"',
          orientation: "horizontal",
        });
      }
      const horizontalOverlap = Math.max(b1.left, b2.left) < Math.min(b1.right, b2.right);
      if (horizontalOverlap && b1.bottom < b2.top) {
        const spacing = b2.top - b1.bottom;
        const centerX = (Math.max(b1.left, b2.left) + Math.min(b1.right, b2.right)) / 2;
        dimensionLines.push({
          x1: centerX,
          y1: b1.bottom,
          x2: centerX,
          y2: b2.top,
          text: "↕ " + spacing.toFixed(2) + '"',
          orientation: "vertical",
        });
      } else if (horizontalOverlap && b2.bottom < b1.top) {
        const spacing = b1.top - b2.bottom;
        const centerX = (Math.max(b1.left, b2.left) + Math.min(b1.right, b2.right)) / 2;
        dimensionLines.push({
          x1: centerX,
          y1: b2.bottom,
          x2: centerX,
          y2: b1.top,
          text: "↕ " + spacing.toFixed(2) + '"',
          orientation: "vertical",
        });
      }
    }
  }

  if (highlightMode === "violations") return null;

  const drawArrow = (x: number, y: number, angle: number) => {
    const x1 = x + ARROW_SIZE * Math.cos(angle + Math.PI / 6);
    const y1 = y + ARROW_SIZE * Math.sin(angle + Math.PI / 6);
    const x2 = x + ARROW_SIZE * Math.cos(angle - Math.PI / 6);
    const y2 = y + ARROW_SIZE * Math.sin(angle - Math.PI / 6);
    return `M ${x} ${y} L ${x1} ${y1} M ${x} ${y} L ${x2} ${y2}`;
  };

  return (
    <g className="border-overlay">
      {dimensionLines.map((line, index) => {
        const isSpacing = line.text.includes("↔") || line.text.includes("↕");
        const color = isSpacing ? SPACING_COLOR : BORDER_COLOR;
        const textX = (line.x1 + line.x2) / 2;
        const textY = (line.y1 + line.y2) / 2;
        const angle1 = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
        const angle2 = Math.atan2(line.y1 - line.y2, line.x1 - line.x2);
        return (
          <g key={index}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={color}
              strokeWidth={LINE_WIDTH}
              strokeDasharray={DASH_PATTERN}
            />
            <path
              d={drawArrow(line.x1, line.y1, angle1)}
              stroke={color}
              strokeWidth={LINE_WIDTH}
              fill="none"
            />
            <path
              d={drawArrow(line.x2, line.y2, angle2)}
              stroke={color}
              strokeWidth={LINE_WIDTH}
              fill="none"
            />
            <text
              x={textX}
              y={textY + (line.orientation === "horizontal" ? -TEXT_OFFSET : TEXT_OFFSET)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={color}
              fontSize={TEXT_SIZE}
              fontWeight="700"
              fontFamily="system-ui, -apple-system, sans-serif"
              stroke={TEXT_STROKE}
              strokeWidth={TEXT_STROKE_WIDTH}
              paintOrder="stroke"
            >
              {line.text}
            </text>
          </g>
        );
      })}
    </g>
  );
}
