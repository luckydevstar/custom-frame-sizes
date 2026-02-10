import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";

interface BrassNameplatePreviewProps {
  config: BrassNameplateConfig;
  scale?: number; // Multiplier for display size (default: 1)
  className?: string;
}

// Font mapping to CSS font families
const FONT_FAMILIES: Record<string, string> = {
  georgia: 'Georgia, "Times New Roman", serif',
  arial: "Arial, Helvetica, sans-serif",
  "trajan-pro": '"Cinzel", "Times New Roman", serif',
  "dancing-script": '"Dancing Script", cursive',
  "courier-new": '"Courier New", Courier, monospace',
};

// Color mapping with metallic gradients
const COLOR_MAP: Record<
  string,
  {
    plaque: string;
    text: string;
    metallic?: boolean;
    metallicText?: boolean;
    metallicSilver?: boolean;
  }
> = {
  "brass-black": { plaque: "#B8860B", text: "#000000", metallic: true },
  "black-gold": { plaque: "#1A1A1A", text: "#FFD700", metallicText: true },
  "black-silver": { plaque: "#1A1A1A", text: "#C0C0C0", metallicText: true },
  "silver-black": { plaque: "#C0C0C0", text: "#000000", metallicSilver: true },
};

export function BrassNameplatePreview({
  config,
  scale = 1,
  className = "",
}: BrassNameplatePreviewProps) {
  // Convert inches to pixels at 150 DPI for preview
  const DPI = 150;
  const pxWidth = BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH * DPI;
  const pxHeight = BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT * DPI;

  // Apply scale for display
  const displayWidth = pxWidth * scale;
  const displayHeight = pxHeight * scale;

  // Text area dimensions
  const textAreaWidth = BRASS_NAMEPLATE_SPECS.TEXT_AREA_WIDTH * DPI;

  // Font sizes in pixels (pt to px conversion: pt * DPI / 72)
  const line1FontSize = (BRASS_NAMEPLATE_SPECS.LINE1_FONT_SIZE_PT * DPI) / 72;
  const line2FontSize = (BRASS_NAMEPLATE_SPECS.LINE2_FONT_SIZE_PT * DPI) / 72;
  const line3FontSize = (BRASS_NAMEPLATE_SPECS.LINE3_FONT_SIZE_PT * DPI) / 72;

  // Line spacing
  const lineSpacing = BRASS_NAMEPLATE_SPECS.LINE_SPACING_INCHES * DPI;

  // Colors
  const colors = COLOR_MAP[config.color] || COLOR_MAP["brass-black"];
  if (!colors) return null;
  const fontFamily = FONT_FAMILIES[config.font] || FONT_FAMILIES["georgia"];

  // US Flag dimensions (if enabled) - larger size
  const flagHeight = 0.5 * DPI; // 0.5 inches (increased from 0.25)
  const flagWidth = flagHeight * 1.9; // 1.9:1 aspect ratio
  const flagGap = 0.08 * DPI; // Tight gap between flag and text (0.08 inches)

  // Calculate centering for flag + text composition
  let flagX: number;
  let textX: number;

  if (config.includeFlag) {
    // Use a narrower effective text width for tighter composition
    // This treats flag + text as a compact visual unit
    const effectiveTextWidth = textAreaWidth * 0.6; // Tighter text area
    const compositionWidth = flagWidth + flagGap + effectiveTextWidth;
    const compositionStartX = (pxWidth - compositionWidth) / 2;
    flagX = compositionStartX;
    textX = compositionStartX + flagWidth + flagGap + effectiveTextWidth / 2;
  } else {
    flagX = 0; // Not used when flag disabled
    textX = pxWidth / 2; // Center text
  }

  const flagY = (pxHeight - flagHeight) / 2; // Vertically centered
  const textAnchor = "middle";

  // Calculate vertical centering for text
  // Total height of text block (from top of line 1 to bottom of line 3)
  const textBlockHeight = lineSpacing * 2 + line3FontSize; // Two line spacings + height of last line
  const startY = (pxHeight - textBlockHeight) / 2 + line1FontSize; // Center and account for baseline

  // Placeholder text
  const line1Text = config.line1 || "HEADLINE TEXT";
  const line2Text = config.line2 || "Line 2 text here";
  const line3Text = config.line3 || "Line 3 text here";

  return (
    <svg
      width={displayWidth}
      height={displayHeight}
      viewBox={`0 0 ${pxWidth} ${pxHeight}`}
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      {/* Plaque background with metallic gradient */}
      <defs>
        {colors.metallic ? (
          // Metallic brass gradient with highlights and shadows
          <linearGradient id="plaqueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
            <stop offset="15%" stopColor="#F0E68C" stopOpacity="1" />
            <stop offset="30%" stopColor="#B8860B" stopOpacity="1" />
            <stop offset="50%" stopColor="#DAA520" stopOpacity="1" />
            <stop offset="70%" stopColor="#B8860B" stopOpacity="1" />
            <stop offset="85%" stopColor="#8B7355" stopOpacity="1" />
            <stop offset="100%" stopColor="#B8860B" stopOpacity="1" />
          </linearGradient>
        ) : colors.metallicSilver ? (
          // Metallic silver gradient with highlights and shadows
          <linearGradient id="plaqueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8E8E8" stopOpacity="1" />
            <stop offset="15%" stopColor="#F5F5F5" stopOpacity="1" />
            <stop offset="30%" stopColor="#C0C0C0" stopOpacity="1" />
            <stop offset="50%" stopColor="#D8D8D8" stopOpacity="1" />
            <stop offset="70%" stopColor="#B8B8B8" stopOpacity="1" />
            <stop offset="85%" stopColor="#909090" stopOpacity="1" />
            <stop offset="100%" stopColor="#C0C0C0" stopOpacity="1" />
          </linearGradient>
        ) : (
          // Flat gradient for non-metallic finishes
          <linearGradient id="plaqueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.plaque} stopOpacity="1" />
            <stop offset="50%" stopColor={colors.plaque} stopOpacity="0.95" />
            <stop offset="100%" stopColor={colors.plaque} stopOpacity="1" />
          </linearGradient>
        )}

        {/* Metallic text gradients */}
        {colors.metallicText && config.color === "black-gold" && (
          // Gold text gradient (matches brass)
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
            <stop offset="25%" stopColor="#F0E68C" stopOpacity="1" />
            <stop offset="50%" stopColor="#B8860B" stopOpacity="1" />
            <stop offset="75%" stopColor="#DAA520" stopOpacity="1" />
            <stop offset="100%" stopColor="#B8860B" stopOpacity="1" />
          </linearGradient>
        )}

        {colors.metallicText && config.color === "black-silver" && (
          // Silver text gradient (similar to brass but silver tones)
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C0C0C0" stopOpacity="1" />
            <stop offset="25%" stopColor="#E8E8E8" stopOpacity="1" />
            <stop offset="50%" stopColor="#A8A8A8" stopOpacity="1" />
            <stop offset="75%" stopColor="#D0D0D0" stopOpacity="1" />
            <stop offset="100%" stopColor="#A8A8A8" stopOpacity="1" />
          </linearGradient>
        )}

        {/* Radial highlight for metallic sheen (brass) */}
        {colors.metallic && (
          <radialGradient id="metallicSheen" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#FFFACD" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#FFD700" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
          </radialGradient>
        )}

        {/* Radial highlight for metallic sheen (silver) */}
        {colors.metallicSilver && (
          <radialGradient id="metallicSheen" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#E8E8E8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#C0C0C0" stopOpacity="0" />
          </radialGradient>
        )}

        {/* Subtle shadow for depth */}
        <filter id="plaqueShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Plaque rectangle with rounded corners and light gray outside stroke */}
      <rect
        x="0"
        y="0"
        width={pxWidth}
        height={pxHeight}
        rx="8"
        ry="8"
        fill="url(#plaqueGradient)"
        stroke="#eeeeee"
        strokeWidth={0.125 * DPI}
        filter="url(#plaqueShadow)"
      />

      {/* Metallic sheen overlay for brass or silver */}
      {(colors.metallic || colors.metallicSilver) && (
        <rect
          x="0"
          y="0"
          width={pxWidth}
          height={pxHeight}
          rx="8"
          ry="8"
          fill="url(#metallicSheen)"
          pointerEvents="none"
        />
      )}

      {/* US Flag (if enabled) - engraved elements only */}
      {config.includeFlag && (
        <g>
          {/* Flag border */}
          <rect
            x={flagX}
            y={flagY}
            width={flagWidth}
            height={flagHeight}
            fill="none"
            stroke={colors.metallicText ? "url(#textGradient)" : colors.text}
            strokeWidth="2"
          />

          {/* 13 stripes - draw all 7 dark stripes (engraved) */}
          {[0, 2, 4, 6, 8, 10, 12].map((i) => (
            <rect
              key={`stripe-${i}`}
              x={flagX}
              y={flagY + (i * flagHeight) / 13}
              width={flagWidth}
              height={flagHeight / 13}
              fill={colors.metallicText ? "url(#textGradient)" : colors.text}
            />
          ))}

          {/* Stars (50 total in 9 rows: alternating 6/5 pattern) - engraved in same color */}
          {Array.from({ length: 9 }).flatMap((_, row) => {
            const starsInRow = row % 2 === 0 ? 6 : 5; // Alternating 6 and 5 stars
            return Array.from({ length: starsInRow }).map((_, col) => {
              const starSize = flagHeight / 26; // Larger star size
              const cantonWidth = flagWidth * 0.4;
              const cantonHeight = (flagHeight * 7) / 13;

              // Calculate positioning for alternating pattern
              const starX = flagX + (col + 0.5 + (row % 2 === 0 ? 0 : 0.5)) * (cantonWidth / 6);
              const starY = flagY + (row + 0.5) * (cantonHeight / 9);

              return (
                <circle
                  key={`star-${row}-${col}`}
                  cx={starX}
                  cy={starY}
                  r={starSize}
                  fill={colors.metallicText ? "url(#textGradient)" : colors.text}
                />
              );
            });
          })}
        </g>
      )}

      {/* Engraved text - Line 1 (Headline, Bold) */}
      <text
        x={textX}
        y={startY}
        fill={colors.metallicText ? "url(#textGradient)" : colors.text}
        fontFamily={fontFamily}
        fontSize={line1FontSize}
        fontWeight="bold"
        textAnchor={textAnchor}
        dominantBaseline="alphabetic"
      >
        {line1Text}
      </text>

      {/* Engraved text - Line 2 */}
      <text
        x={textX}
        y={startY + lineSpacing}
        fill={colors.metallicText ? "url(#textGradient)" : colors.text}
        fontFamily={fontFamily}
        fontSize={line2FontSize}
        fontWeight="normal"
        textAnchor={textAnchor}
        dominantBaseline="alphabetic"
      >
        {line2Text}
      </text>

      {/* Engraved text - Line 3 */}
      <text
        x={textX}
        y={startY + lineSpacing * 2}
        fill={colors.metallicText ? "url(#textGradient)" : colors.text}
        fontFamily={fontFamily}
        fontSize={line3FontSize}
        fontWeight="normal"
        textAnchor={textAnchor}
        dominantBaseline="alphabetic"
      >
        {line3Text}
      </text>
    </svg>
  );
}
