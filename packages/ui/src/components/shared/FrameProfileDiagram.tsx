interface FrameProfileDiagramProps {
  mouldingWidth?: string;
  faceHeight?: string;
  rabbetDepth?: string;
}

export function FrameProfileDiagram({
  mouldingWidth = '1 1/4"',
  faceHeight = '7/8"',
  rabbetDepth = '3/8"',
}: FrameProfileDiagramProps) {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-auto" style={{ maxWidth: "280px" }}>
      {/* Frame profile outline */}
      <path
        d="M 80 40 L 80 30 L 90 30 Q 100 30 105 35 Q 108 38 110 42 Q 112 46 115 48 Q 120 52 128 54 Q 135 56 145 56 L 155 56 Q 165 56 172 58 Q 178 60 183 65 Q 186 68 188 73 L 190 80 L 190 120 L 188 127 Q 186 132 183 135 Q 178 140 172 142 Q 165 144 155 144 L 145 144 Q 135 144 128 146 Q 120 148 115 152 Q 112 154 110 158 Q 108 162 105 165 Q 100 170 90 170 L 80 170 L 80 160 L 90 160 Q 95 160 98 157 Q 100 155 102 152 L 102 48 Q 100 45 98 43 Q 95 40 90 40 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-foreground"
      />

      {/* Left vertical dimension line (Face Height - 7/8") */}
      <line
        x1="50"
        y1="40"
        x2="50"
        y2="160"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-foreground"
      />
      <line
        x1="45"
        y1="40"
        x2="55"
        y2="40"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-foreground"
      />
      <line
        x1="45"
        y1="160"
        x2="55"
        y2="160"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-foreground"
      />

      {/* Left arrow heads */}
      <path d="M 50 40 L 47 47 L 53 47 Z" fill="currentColor" className="text-foreground" />
      <path d="M 50 160 L 47 153 L 53 153 Z" fill="currentColor" className="text-foreground" />

      {/* Right vertical dimension line (Rabbet Depth - 3/8") */}
      <line
        x1="220"
        y1="80"
        x2="220"
        y2="144"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-foreground"
      />
      <line
        x1="215"
        y1="80"
        x2="225"
        y2="80"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-foreground"
      />
      <line
        x1="215"
        y1="144"
        x2="225"
        y2="144"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-foreground"
      />

      {/* Right arrow heads */}
      <path d="M 220 80 L 217 87 L 223 87 Z" fill="currentColor" className="text-foreground" />
      <path d="M 220 144 L 217 137 L 223 137 Z" fill="currentColor" className="text-foreground" />

      {/* Bottom horizontal dimension line (Moulding Width - 1 1/4") */}
      <line
        x1="80"
        y1="185"
        x2="190"
        y2="185"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-foreground"
      />
      <line
        x1="80"
        y1="180"
        x2="80"
        y2="190"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-foreground"
      />
      <line
        x1="190"
        y1="180"
        x2="190"
        y2="190"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-foreground"
      />

      {/* Bottom arrow heads */}
      <path d="M 80 185 L 87 182 L 87 188 Z" fill="currentColor" className="text-foreground" />
      <path d="M 190 185 L 183 182 L 183 188 Z" fill="currentColor" className="text-foreground" />

      {/* Text labels using site font (Montserrat) */}
      <text
        x="30"
        y="105"
        textAnchor="middle"
        className="fill-foreground font-sans font-semibold"
        style={{ fontSize: "22px" }}
      >
        {faceHeight}
      </text>

      <text
        x="250"
        y="115"
        textAnchor="middle"
        className="fill-foreground font-sans font-semibold"
        style={{ fontSize: "22px" }}
      >
        {rabbetDepth}
      </text>

      <text
        x="135"
        y="200"
        textAnchor="middle"
        className="fill-foreground font-sans font-semibold"
        style={{ fontSize: "22px" }}
      >
        {mouldingWidth}
      </text>
    </svg>
  );
}
