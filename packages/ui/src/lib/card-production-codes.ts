/**
 * Production CARD-xxx codes — layout → code maps per format (Amazon reference).
 * Not sequential: e.g. pack slab CARD-027 is 2x1, not 1x3.
 */

/** PSA graded (3" × 5.25") — CARD-001 … CARD-012 */
const CARD_CODE_PSA: Record<string, string> = {
  "1x1": "CARD-001",
  "1x2": "CARD-002",
  "2x1": "CARD-003",
  "1x3": "CARD-004",
  "3x1": "CARD-005",
  "2x2": "CARD-006",
  "2x3": "CARD-007",
  "2x4": "CARD-008",
  "3x3": "CARD-009",
  "3x4": "CARD-010",
  "4x4": "CARD-011",
  "4x5": "CARD-012",
};

/** SGC / CGC / BGS — CARD-013 … CARD-024 */
const CARD_CODE_SGC: Record<string, string> = {
  "1x1": "CARD-013",
  "1x2": "CARD-014",
  "2x1": "CARD-015",
  "1x3": "CARD-016",
  "3x1": "CARD-017",
  "2x2": "CARD-018",
  "2x3": "CARD-019",
  "2x4": "CARD-020",
  "3x3": "CARD-021",
  "3x4": "CARD-022",
  "4x4": "CARD-023",
  "4x5": "CARD-024",
};

/** PSA Pack Slab (4.4" × 7.4") — CARD-025 … CARD-036 */
const CARD_CODE_PACK_SLAB: Record<string, string> = {
  "1x1": "CARD-025",
  "1x2": "CARD-026",
  "2x1": "CARD-027",
  "1x3": "CARD-028",
  "3x1": "CARD-029",
  "2x2": "CARD-030",
  "2x3": "CARD-031",
  "2x4": "CARD-032",
  "3x3": "CARD-033",
  "3x4": "CARD-034",
  "4x4": "CARD-035",
  "4x5": "CARD-036",
};

/** Canonical layout order shared across the three 12-code families */
export const CARD_PRODUCTION_LAYOUT_SEQUENCE: readonly string[] = [
  "1x1",
  "1x2",
  "2x1",
  "1x3",
  "3x1",
  "2x2",
  "2x3",
  "2x4",
  "3x3",
  "3x4",
  "4x4",
  "4x5",
];

export function getCardProductionCode(formatId: string, layoutId: string): string | undefined {
  if (!layoutId) return undefined;
  const map =
    formatId === "psa"
      ? CARD_CODE_PSA
      : formatId === "sgc-cgc-bgs"
        ? CARD_CODE_SGC
        : formatId === "psa-pack-slabs"
          ? CARD_CODE_PACK_SLAB
          : undefined;
  if (!map) return undefined;
  return map[layoutId];
}
