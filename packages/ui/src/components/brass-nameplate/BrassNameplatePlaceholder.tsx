import type { BrassNameplateConfig } from "@framecraft/types";

interface BrassNameplatePlaceholderProps {
  config: BrassNameplateConfig;
  /**
   * Width in pixels for the placeholder
   * The aspect ratio (4.5:1.5 = 3:1) will be maintained
   */
  width?: number;
  className?: string;
}

// Color mapping (same as preview)
const COLOR_MAP: Record<string, { plaque: string }> = {
  "brass-black": { plaque: "#B8860B" },
  "black-gold": { plaque: "#1A1A1A" },
  "black-silver": { plaque: "#1A1A1A" },
};

/**
 * Small placeholder representation of brass nameplate for frame previews
 *
 * This shows where the nameplate will be positioned in the frame without
 * rendering actual text (which would be too small to read at frame scale).
 *
 * Use this in frame preview components when brass nameplate is enabled.
 */
export function BrassNameplatePlaceholder({
  config,
  width = 90,
  className = "",
}: BrassNameplatePlaceholderProps) {
  // Maintain 3:1 aspect ratio (4.5" : 1.5")
  const height = width / 3;

  const colors = COLOR_MAP[config.color] || COLOR_MAP["brass-black"];
  if (!colors) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 90 30"
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <defs>
        {/* Subtle gradient for realism */}
        <linearGradient id="placeholderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.plaque} stopOpacity="1" />
          <stop offset="50%" stopColor={colors.plaque} stopOpacity="0.95" />
          <stop offset="100%" stopColor={colors.plaque} stopOpacity="1" />
        </linearGradient>

        {/* Shadow */}
        <filter id="placeholderShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
          <feOffset dx="0" dy="1" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Plaque rectangle */}
      <rect
        x="1"
        y="1"
        width="88"
        height="28"
        rx="2"
        ry="2"
        fill="url(#placeholderGradient)"
        stroke="#000"
        strokeWidth="0.5"
        strokeOpacity="0.2"
        filter="url(#placeholderShadow)"
      />

      {/* Indicate text lines with subtle marks */}
      <g opacity="0.3">
        <line x1="15" y1="10" x2="75" y2="10" stroke="#000" strokeWidth="1" strokeLinecap="round" />
        <line
          x1="20"
          y1="15"
          x2="70"
          y2="15"
          stroke="#000"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="20"
          x2="70"
          y2="20"
          stroke="#000"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
