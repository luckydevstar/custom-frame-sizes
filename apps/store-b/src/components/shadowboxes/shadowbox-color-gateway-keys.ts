/** origina-store-b shadowbox color gateway URLs: /shadowboxes/{slug}-shadowbox-frames */

export const SHADOWBOX_COLOR_GATEWAY_SEGMENTS = [
  "black-shadowbox-frames",
  "white-shadowbox-frames",
  "brown-shadowbox-frames",
  "silver-shadowbox-frames",
  "gold-shadowbox-frames",
  "blue-shadowbox-frames",
  "natural-shadowbox-frames",
] as const;

export type ShadowboxColorGatewaySegment = (typeof SHADOWBOX_COLOR_GATEWAY_SEGMENTS)[number];

export type ShadowboxGatewayColorName =
  | "Black"
  | "White"
  | "Brown"
  | "Silver"
  | "Gold"
  | "Blue"
  | "Natural";

export const GATEWAY_SEGMENT_TO_COLOR_NAME: Record<ShadowboxColorGatewaySegment, ShadowboxGatewayColorName> = {
  "black-shadowbox-frames": "Black",
  "white-shadowbox-frames": "White",
  "brown-shadowbox-frames": "Brown",
  "silver-shadowbox-frames": "Silver",
  "gold-shadowbox-frames": "Gold",
  "blue-shadowbox-frames": "Blue",
  "natural-shadowbox-frames": "Natural",
};

export function shadowboxGatewaySegmentToColorName(
  segment: string
): ShadowboxGatewayColorName | undefined {
  return GATEWAY_SEGMENT_TO_COLOR_NAME[segment as ShadowboxColorGatewaySegment];
}

export function normalizeOriginaPopularHref(href: string): string {
  if (href === "/specialty/record-album-frames") return "/record-album-frames";
  return href;
}
