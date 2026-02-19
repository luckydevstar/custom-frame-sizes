/**
 * Generic Hockey Puck Inserts
 *
 * Professional-looking team logos that are completely original
 * and do not infringe on any intellectual property.
 */

export interface PuckInsert {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  svgContent: string;
}

const createPuckSvg = (
  _primaryColor: string,
  _secondaryColor: string,
  _accentColor: string,
  logoContent: string
): string => {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <defs>
        <radialGradient id="puckGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#3d3d3d"/>
          <stop offset="50%" stop-color="#1a1a1a"/>
          <stop offset="100%" stop-color="#0d0d0d"/>
        </radialGradient>
        <radialGradient id="gloss" cx="35%" cy="25%" r="50%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
        <filter id="innerShadow">
          <feOffset dx="0" dy="2"/>
          <feGaussianBlur stdDeviation="3"/>
          <feComposite operator="out" in="SourceGraphic"/>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/>
          <feBlend in2="SourceGraphic" mode="normal"/>
        </filter>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#puckGradient)" stroke="#0a0a0a" stroke-width="2"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      ${logoContent}
      <circle cx="100" cy="100" r="98" fill="url(#gloss)"/>
    </svg>
  `;
};

const thunderLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#1e3a5f" stroke="#ffd700" stroke-width="4"/>
    <path d="M-5,-45 L25,-45 L5,-5 L25,-5 L-20,45 L-5,5 L-25,5 Z" fill="#ffd700" stroke="#fff" stroke-width="1"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="11" font-weight="bold" fill="#ffd700">THUNDER</text>
  </g>
`;

const blazeLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#8b0000" stroke="#ff4500" stroke-width="4"/>
    <path d="M0,-40 Q20,-20 10,0 Q25,15 0,40 Q-25,15 -10,0 Q-20,-20 0,-40" fill="#ff4500" stroke="#ffd700" stroke-width="2"/>
    <path d="M0,-25 Q10,-12 5,0 Q12,8 0,25 Q-12,8 -5,0 Q-10,-12 0,-25" fill="#ffd700"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="12" font-weight="bold" fill="#ff4500">BLAZE</text>
  </g>
`;

const frostLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#0a2463" stroke="#87ceeb" stroke-width="4"/>
    <path d="M0,-45 L0,45 M-35,-20 L35,20 M-35,20 L35,-20" stroke="#87ceeb" stroke-width="6" stroke-linecap="round"/>
    <circle r="12" fill="#fff" stroke="#87ceeb" stroke-width="2"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="12" font-weight="bold" fill="#87ceeb">FROST</text>
  </g>
`;

const stormLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#2c3e50" stroke="#00bcd4" stroke-width="4"/>
    <path d="M-30,-30 Q0,-50 30,-25 Q10,-10 25,10 Q-5,-5 -15,25 Q-25,0 -30,-30" fill="#00bcd4" stroke="#fff" stroke-width="1"/>
    <circle cx="-5" cy="-5" r="8" fill="#fff"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="12" font-weight="bold" fill="#00bcd4">STORM</text>
  </g>
`;

const phantomLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#1a1a2e" stroke="#9b59b6" stroke-width="4"/>
    <path d="M-25,-35 Q0,-45 25,-35 L30,-5 Q25,20 20,35 L10,35 L5,15 L0,35 L-5,15 L-10,35 L-20,35 Q-25,20 -30,-5 Z" fill="#9b59b6" stroke="#e8daef" stroke-width="1"/>
    <ellipse cx="-10" cy="-15" rx="6" ry="8" fill="#fff"/><ellipse cx="10" cy="-15" rx="6" ry="8" fill="#fff"/>
    <circle cx="-10" cy="-15" r="3" fill="#1a1a2e"/><circle cx="10" cy="-15" r="3" fill="#1a1a2e"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="10" font-weight="bold" fill="#9b59b6">PHANTOM</text>
  </g>
`;

const viperLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#1b4332" stroke="#40916c" stroke-width="4"/>
    <path d="M0,-40 Q-30,-30 -35,0 Q-30,30 0,35 Q30,30 35,0 Q30,-30 0,-40" fill="#40916c" stroke="#95d5b2" stroke-width="2"/>
    <path d="M0,-20 L-8,0 L0,25 L8,0 Z" fill="#1b4332"/>
    <circle cx="-12" cy="-8" r="5" fill="#ffd700"/><circle cx="12" cy="-8" r="5" fill="#ffd700"/>
    <ellipse cx="-12" cy="-8" rx="2" ry="4" fill="#1b4332"/><ellipse cx="12" cy="-8" rx="2" ry="4" fill="#1b4332"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="12" font-weight="bold" fill="#40916c">VIPER</text>
  </g>
`;

const titanLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#212529" stroke="#adb5bd" stroke-width="4"/>
    <path d="M-30,-30 L-20,-40 L20,-40 L30,-30 L30,20 L20,35 L-20,35 L-30,20 Z" fill="#495057" stroke="#adb5bd" stroke-width="2"/>
    <path d="M-15,-25 L0,-35 L15,-25 L15,15 L0,25 L-15,15 Z" fill="#adb5bd"/>
    <path d="M-5,-15 L0,-20 L5,-15 L5,5 L0,10 L-5,5 Z" fill="#212529"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="12" font-weight="bold" fill="#adb5bd">TITAN</text>
  </g>
`;

const raptorLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#2d132c" stroke="#c9184a" stroke-width="4"/>
    <path d="M0,-45 L-25,-10 L-40,15 L-20,10 L-30,35 L0,15 L30,35 L20,10 L40,15 L25,-10 Z" fill="#c9184a" stroke="#ff758f" stroke-width="1"/>
    <circle cx="0" cy="-20" r="8" fill="#fff"/><circle cx="0" cy="-20" r="4" fill="#2d132c"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="11" font-weight="bold" fill="#c9184a">RAPTOR</text>
  </g>
`;

const wolfpackLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#343a40" stroke="#e63946" stroke-width="4"/>
    <path d="M0,-40 L-20,-15 L-35,10 L-25,5 L-30,35 L-10,15 L0,35 L10,15 L30,35 L25,5 L35,10 L20,-15 Z" fill="#e63946" stroke="#f1faee" stroke-width="1"/>
    <ellipse cx="-8" cy="-5" rx="4" ry="6" fill="#f1faee"/><ellipse cx="8" cy="-5" rx="4" ry="6" fill="#f1faee"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="9" font-weight="bold" fill="#e63946">WOLFPACK</text>
  </g>
`;

const avalancheLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#023047" stroke="#8ecae6" stroke-width="4"/>
    <path d="M0,-40 L-30,25 L-15,25 L-20,35 L0,10 L20,35 L15,25 L30,25 Z" fill="#8ecae6" stroke="#fff" stroke-width="1"/>
    <path d="M0,-25 L-15,15 L0,0 L15,15 Z" fill="#023047"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="8" font-weight="bold" fill="#8ecae6">AVALANCHE</text>
  </g>
`;

const scorpionLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#3d0c02" stroke="#d4a373" stroke-width="4"/>
    <ellipse cx="0" cy="5" rx="25" ry="18" fill="#d4a373"/>
    <path d="M25,5 Q45,0 50,-25 Q45,-35 35,-30 L30,-20" fill="none" stroke="#d4a373" stroke-width="6" stroke-linecap="round"/>
    <circle cx="38" cy="-28" r="4" fill="#e63946"/>
    <path d="M-25,5 Q-30,15 -35,25 M-20,8 Q-22,18 -25,28 M-15,10 Q-15,20 -12,30 M25,5 Q30,15 35,25 M20,8 Q22,18 25,28 M15,10 Q15,20 12,30" stroke="#d4a373" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="-8" cy="-2" r="3" fill="#3d0c02"/><circle cx="8" cy="-2" r="3" fill="#3d0c02"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="9" font-weight="bold" fill="#d4a373">SCORPION</text>
  </g>
`;

const falconLogo = `
  <g transform="translate(100,100)">
    <circle r="65" fill="#14213d" stroke="#fca311" stroke-width="4"/>
    <path d="M0,-35 L-35,15 L-25,10 L-40,35 L0,10 L40,35 L25,10 L35,15 Z" fill="#fca311" stroke="#fff" stroke-width="1"/>
    <path d="M0,-20 L-15,5 L0,0 L15,5 Z" fill="#14213d"/>
    <path d="M-3,-8 L0,-15 L3,-8 L0,0 Z" fill="#e63946"/>
    <text y="58" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="11" font-weight="bold" fill="#fca311">FALCON</text>
  </g>
`;

export const PUCK_INSERTS: PuckInsert[] = [
  {
    id: "thunder",
    name: "Thunder",
    primaryColor: "#1e3a5f",
    secondaryColor: "#ffd700",
    accentColor: "#fff",
    svgContent: createPuckSvg("#1e3a5f", "#ffd700", "#fff", thunderLogo),
  },
  {
    id: "blaze",
    name: "Blaze",
    primaryColor: "#8b0000",
    secondaryColor: "#ff4500",
    accentColor: "#ffd700",
    svgContent: createPuckSvg("#8b0000", "#ff4500", "#ffd700", blazeLogo),
  },
  {
    id: "frost",
    name: "Frost",
    primaryColor: "#0a2463",
    secondaryColor: "#87ceeb",
    accentColor: "#fff",
    svgContent: createPuckSvg("#0a2463", "#87ceeb", "#fff", frostLogo),
  },
  {
    id: "storm",
    name: "Storm",
    primaryColor: "#2c3e50",
    secondaryColor: "#00bcd4",
    accentColor: "#fff",
    svgContent: createPuckSvg("#2c3e50", "#00bcd4", "#fff", stormLogo),
  },
  {
    id: "phantom",
    name: "Phantom",
    primaryColor: "#1a1a2e",
    secondaryColor: "#9b59b6",
    accentColor: "#e8daef",
    svgContent: createPuckSvg("#1a1a2e", "#9b59b6", "#e8daef", phantomLogo),
  },
  {
    id: "viper",
    name: "Viper",
    primaryColor: "#1b4332",
    secondaryColor: "#40916c",
    accentColor: "#95d5b2",
    svgContent: createPuckSvg("#1b4332", "#40916c", "#95d5b2", viperLogo),
  },
  {
    id: "titan",
    name: "Titan",
    primaryColor: "#212529",
    secondaryColor: "#adb5bd",
    accentColor: "#495057",
    svgContent: createPuckSvg("#212529", "#adb5bd", "#495057", titanLogo),
  },
  {
    id: "raptor",
    name: "Raptor",
    primaryColor: "#2d132c",
    secondaryColor: "#c9184a",
    accentColor: "#ff758f",
    svgContent: createPuckSvg("#2d132c", "#c9184a", "#ff758f", raptorLogo),
  },
  {
    id: "wolfpack",
    name: "Wolfpack",
    primaryColor: "#343a40",
    secondaryColor: "#e63946",
    accentColor: "#f1faee",
    svgContent: createPuckSvg("#343a40", "#e63946", "#f1faee", wolfpackLogo),
  },
  {
    id: "avalanche",
    name: "Avalanche",
    primaryColor: "#023047",
    secondaryColor: "#8ecae6",
    accentColor: "#fff",
    svgContent: createPuckSvg("#023047", "#8ecae6", "#fff", avalancheLogo),
  },
  {
    id: "scorpion",
    name: "Scorpion",
    primaryColor: "#3d0c02",
    secondaryColor: "#d4a373",
    accentColor: "#e63946",
    svgContent: createPuckSvg("#3d0c02", "#d4a373", "#e63946", scorpionLogo),
  },
  {
    id: "falcon",
    name: "Falcon",
    primaryColor: "#14213d",
    secondaryColor: "#fca311",
    accentColor: "#fff",
    svgContent: createPuckSvg("#14213d", "#fca311", "#fff", falconLogo),
  },
];

export function getPuckInsert(id: string): PuckInsert | undefined {
  return PUCK_INSERTS.find((p) => p.id === id);
}

export function getRandomPuckInsert(): PuckInsert {
  const randomIndex = Math.floor(Math.random() * PUCK_INSERTS.length);
  return PUCK_INSERTS[randomIndex]!;
}

export function getRandomPuckInserts(count: number): PuckInsert[] {
  const shuffled = [...PUCK_INSERTS].sort(() => Math.random() - 0.5);
  const result: PuckInsert[] = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length]!);
  }
  return result;
}

export function createPuckDataUrl(insert: PuckInsert): string {
  const encoded = encodeURIComponent(insert.svgContent);
  return `data:image/svg+xml,${encoded}`;
}
