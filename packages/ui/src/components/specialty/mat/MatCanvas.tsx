/**
 * Mat Canvas – SVG preview from config (aligned with original behavior)
 */

import type { MatConfig } from "./types";
import { getMatByName } from "@framecraft/config";

const OVERLAP_PER_SIDE = 0.25;

/** SVG path for rect with rounded corners (radius in inches) for use in clip/hole */
function roundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const [x0, y0] = [x, y];
  const [x1, y1] = [x + w, y + h];
  const rad = Math.min(r, w / 2, h / 2);
  return `M ${x0 + rad} ${y0} H ${x1 - rad} q ${rad} 0 ${rad} ${rad} V ${y1 - rad} q 0 ${rad} ${-rad} ${rad} H ${x0 + rad} q ${-rad} 0 ${-rad} ${-rad} V ${y0 + rad} q 0 ${-rad} ${rad} ${-rad} Z`;
}

function getMatHex(colorName: string): string {
  return getMatByName(colorName)?.hexColor ?? "#f5f5f0";
}

interface MatCanvasProps {
  config: MatConfig;
}

export function MatCanvas({ config }: MatCanvasProps) {
  const margin = Math.max(config.overallWIn, config.overallHIn) * 0.08;
  const viewBox = {
    x: -margin,
    y: -margin,
    w: config.overallWIn + margin * 2,
    h: config.overallHIn + margin * 2,
  };
  const vb = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;

  const topHex = getMatHex(config.topMat.color);
  const bottomHex = config.bottomMat ? getMatHex(config.bottomMat.color) : "#f0f2f4";

  const isDouble = config.singleOrDouble === "double" && config.bottomMat;
  const topOpenings = config.topMat.openings;

  const sizeAdjust =
    config.standardOverlap && isDouble
      ? -OVERLAP_PER_SIDE
      : config.standardOverlap
        ? -OVERLAP_PER_SIDE
        : 0;

  return (
    <svg
      viewBox={vb}
      className="h-full w-full rounded-md bg-muted/30"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Bottom mat (full rect) when double */}
      {isDouble && (
        <rect
          x={0}
          y={0}
          width={config.overallWIn}
          height={config.overallHIn}
          fill={bottomHex}
          stroke="var(--border)"
          strokeWidth={0.02}
        />
      )}

      {/* Top mat with opening(s) – single path with holes via evenodd */}
      {topOpenings.map((opening) => {
        const w = (opening.wIn ?? 0) + sizeAdjust * 2;
        const h = (opening.hIn ?? 0) + sizeAdjust * 2;
        const x = opening.xIn - sizeAdjust;
        const y = opening.yIn - sizeAdjust;

        return (
          <g key={opening.id}>
            <path
              fill={topHex}
              fillRule="evenodd"
              stroke="var(--border)"
              strokeWidth={0.02}
              d={
                opening.shape === "oval"
                  ? `M 0 0 H ${config.overallWIn} V ${config.overallHIn} H 0 Z M ${x + w / 2} ${y + h / 2} m ${-w / 2} 0 a ${w / 2} ${h / 2} 0 1 1 ${w} 0 a ${w / 2} ${h / 2} 0 1 1 ${-w} 0 Z`
                  : `M 0 0 H ${config.overallWIn} V ${config.overallHIn} H 0 Z ${opening.cornerStyle === "rounded" ? roundedRectPath(x, y, w, h, 0.25) : `M ${x} ${y} h ${w} v ${h} h ${-w} v ${-h} Z`}`
              }
            />
            {/* V-Groove (decorative) */}
            {config.vGroove?.enabled &&
              config.vGroove.offsetIn &&
              (opening.shape === "oval" ? (
                <ellipse
                  cx={x + w / 2}
                  cy={y + h / 2}
                  rx={w / 2 + config.vGroove.offsetIn}
                  ry={h / 2 + config.vGroove.offsetIn}
                  fill="none"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth={0.08}
                  strokeDasharray="0.15 0.1"
                />
              ) : (
                <rect
                  x={x - config.vGroove.offsetIn}
                  y={y - config.vGroove.offsetIn}
                  width={w + config.vGroove.offsetIn * 2}
                  height={h + config.vGroove.offsetIn * 2}
                  fill="none"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth={0.08}
                  strokeDasharray="0.15 0.1"
                />
              ))}
            {/* Opening (artwork) fill */}
            {opening.shape === "oval" ? (
              <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill="#1a1a1a" />
            ) : opening.cornerStyle === "rounded" ? (
              <rect x={x} y={y} width={w} height={h} rx={0.25} ry={0.25} fill="#1a1a1a" />
            ) : (
              <rect x={x} y={y} width={w} height={h} fill="#1a1a1a" />
            )}
          </g>
        );
      })}
    </svg>
  );
}
