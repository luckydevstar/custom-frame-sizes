import { useMemo } from "react";
import type { StandaloneNameplateConfig } from "./StandaloneNameplateTypes";
import {
  STANDALONE_NAMEPLATE_SPECS,
  FONT_OPTIONS,
  COLOR_OPTIONS,
} from "./StandaloneNameplateTypes";

interface StandaloneNameplatePreviewProps {
  config: StandaloneNameplateConfig;
  scale?: number;
  className?: string;
  showBorder?: boolean;
}

export function StandaloneNameplatePreview({
  config,
  scale = 1,
  className = "",
  showBorder = true,
}: StandaloneNameplatePreviewProps) {
  const DPI = 72;

  const pxWidth = config.width * DPI;
  const pxHeight = config.height * DPI;

  const displayWidth = pxWidth * scale;
  const displayHeight = pxHeight * scale;

  const borderInset = STANDALONE_NAMEPLATE_SPECS.BORDER_INSET * DPI;

  const colorOption = COLOR_OPTIONS.find((c) => c.id === config.color) || COLOR_OPTIONS[0];
  const fontOption = FONT_OPTIONS.find((f) => f.id === config.font) || FONT_OPTIONS[0];

  const textAnchor =
    config.alignment === "left" ? "start" : config.alignment === "right" ? "end" : "middle";
  const textX =
    config.alignment === "left"
      ? borderInset
      : config.alignment === "right"
        ? pxWidth - borderInset
        : pxWidth / 2;

  const lineSpacing = config.lineSpacing || STANDALONE_NAMEPLATE_SPECS.DEFAULT_LINE_SPACING;

  const { linesWithY } = useMemo(() => {
    const activeLines = config.lines.filter((line) => line.text.trim());
    if (activeLines.length === 0) {
      return { linesWithY: [], totalContentHeight: 0 };
    }

    let totalHeight = 0;
    const lineHeights: number[] = [];

    for (const line of activeLines) {
      const lineHeight = line.fontSize * lineSpacing;
      lineHeights.push(lineHeight);
      totalHeight += lineHeight;
    }

    const startY = (pxHeight - totalHeight) / 2;
    let currentY = startY;

    const result = activeLines.map((line, index) => {
      const lineHeight = lineHeights[index];
      if (lineHeight === undefined) return { ...line, y: currentY };
      const y = currentY + lineHeight * 0.75;
      currentY += lineHeight;
      return { ...line, y };
    });

    return { linesWithY: result, totalContentHeight: totalHeight };
  }, [config.lines, pxHeight, lineSpacing]);

  const gradientId = useMemo(
    () => `plaque-gradient-${Math.random().toString(36).substr(2, 9)}`,
    []
  );
  const textGradientId = useMemo(
    () => `text-gradient-${Math.random().toString(36).substr(2, 9)}`,
    []
  );
  const sheenId = useMemo(() => `sheen-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <svg
      width={displayWidth}
      height={displayHeight}
      viewBox={`0 0 ${pxWidth} ${pxHeight}`}
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
      data-testid="nameplate-preview-svg"
    >
      <defs>
        {colorOption.metallic ? (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="15%" stopColor="#F0E68C" />
            <stop offset="30%" stopColor="#B8860B" />
            <stop offset="50%" stopColor="#DAA520" />
            <stop offset="70%" stopColor="#B8860B" />
            <stop offset="85%" stopColor="#8B7355" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        ) : colorOption.metallicSilver ? (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8E8E8" />
            <stop offset="15%" stopColor="#F5F5F5" />
            <stop offset="30%" stopColor="#C0C0C0" />
            <stop offset="50%" stopColor="#D8D8D8" />
            <stop offset="70%" stopColor="#B8B8B8" />
            <stop offset="85%" stopColor="#909090" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </linearGradient>
        ) : (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorOption.plaqueColor as string} />
            <stop offset="50%" stopColor={colorOption.plaqueColor as string} />
            <stop offset="100%" stopColor={colorOption.plaqueColor as string} />
          </linearGradient>
        )}

        {colorOption.metallicText && config.color === "black-gold" && (
          <linearGradient id={textGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="25%" stopColor="#F0E68C" />
            <stop offset="50%" stopColor="#B8860B" />
            <stop offset="75%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        )}

        {colorOption.metallicText && config.color === "black-silver" && (
          <linearGradient id={textGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C0C0C0" />
            <stop offset="25%" stopColor="#E8E8E8" />
            <stop offset="50%" stopColor="#A8A8A8" />
            <stop offset="75%" stopColor="#D0D0D0" />
            <stop offset="100%" stopColor="#A8A8A8" />
          </linearGradient>
        )}

        {(colorOption.metallic || colorOption.metallicSilver) && (
          <radialGradient id={sheenId} cx="50%" cy="30%">
            <stop
              offset="0%"
              stopColor={colorOption.metallic ? "#FFFACD" : "#FFFFFF"}
              stopOpacity="0.3"
            />
            <stop
              offset="40%"
              stopColor={colorOption.metallic ? "#FFD700" : "#E8E8E8"}
              stopOpacity="0.1"
            />
            <stop
              offset="100%"
              stopColor={colorOption.metallic ? "#B8860B" : "#C0C0C0"}
              stopOpacity="0"
            />
          </radialGradient>
        )}

        <filter id="plaqueShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="0" dy="1" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.15" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        x="0"
        y="0"
        width={pxWidth}
        height={pxHeight}
        rx="6"
        ry="6"
        fill={
          colorOption.metallic || colorOption.metallicSilver
            ? `url(#${gradientId})`
            : (colorOption.plaqueColor as string)
        }
        stroke={showBorder ? "#eeeeee" : "none"}
        strokeWidth={showBorder ? 2 : 0}
        filter="url(#plaqueShadow)"
      />

      {(colorOption.metallic || colorOption.metallicSilver) && (
        <rect
          x="0"
          y="0"
          width={pxWidth}
          height={pxHeight}
          rx="6"
          ry="6"
          fill={`url(#${sheenId})`}
          pointerEvents="none"
        />
      )}

      {showBorder && (
        <rect
          x={borderInset}
          y={borderInset}
          width={pxWidth - borderInset * 2}
          height={pxHeight - borderInset * 2}
          rx="2"
          ry="2"
          fill="none"
          stroke={
            colorOption.metallicText ? `url(#${textGradientId})` : (colorOption.textColor as string)
          }
          strokeWidth="1"
          strokeDasharray="4,2"
          opacity="0.3"
        />
      )}

      {linesWithY.map((line) => (
        <text
          key={line.id}
          x={textX}
          y={line.y}
          fill={
            colorOption.metallicText ? `url(#${textGradientId})` : (colorOption.textColor as string)
          }
          fontFamily={fontOption.family}
          fontSize={line.fontSize}
          fontWeight={line.bold ? "bold" : "normal"}
          fontStyle={line.italic ? "italic" : "normal"}
          textAnchor={textAnchor}
          dominantBaseline="alphabetic"
        >
          {line.text || (line.id === "line-1" ? "Your Text Here" : "")}
        </text>
      ))}

      {linesWithY.length === 0 && (
        <text
          x={pxWidth / 2}
          y={pxHeight / 2 + 8}
          fill={
            colorOption.metallicText ? `url(#${textGradientId})` : (colorOption.textColor as string)
          }
          fontFamily={fontOption.family}
          fontSize={24}
          fontWeight="normal"
          textAnchor="middle"
          dominantBaseline="middle"
          opacity="0.5"
        >
          Enter your text
        </text>
      )}
    </svg>
  );
}
