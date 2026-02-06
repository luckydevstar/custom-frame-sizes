/**
 * Playbill Insert Image Management
 *
 * Provides playbill cover and ticket insert URLs for preview rendering.
 * Uses getSharedAssetUrl; paths match shared_assets/playbill/insert-images/.
 */

import { getSharedAssetUrl } from "../utils/asset-urls";

const PLAYBILL_INSERT_FILES: string[] = [
  "playbill_01_afterlight.jpg",
  "playbill_02_broken_glass.jpg",
  "playbill_03_into_the_void.jpg",
  "playbill_04_city_of_steel.jpg",
  "playbill_05_after_the_siege.jpg",
  "playbill_06_fires_in_the_attic.jpg",
  "playbill_07_nightfall_at_crescent_park.jpg",
  "playbill_08_the_red_masquerade.jpg",
  "playbill_09_king_of_shadows.jpg",
  "playbill_10_the_river_below.jpg",
  "playbill_11_the_cursed_queen.jpg",
  "playbill_12_neon_eclipse.jpg",
  "playbill_13_night_watch.jpg",
  "playbill_14_abstraction.jpg",
  "playbill_15_solaris.jpg",
  "playbill_16_the_grid.jpg",
];

export interface TicketInsert {
  image: string;
  alt: string;
}

const TICKET_PATHS: Array<{ file: string; alt: string }> = [
  { file: "ticket_01.jpeg", alt: "Vintage Broadway ticket stub" },
  { file: "ticket_02.jpeg", alt: "Vintage theater ticket" },
  { file: "ticket_03.jpeg", alt: "Broadway show ticket" },
  { file: "ticket_04.jpeg", alt: "Theater performance ticket" },
  { file: "ticket_05.jpeg", alt: "Vintage admission ticket" },
  { file: "ticket_06.jpeg", alt: "Broadway theater ticket" },
  { file: "ticket_07.jpeg", alt: "Historic show ticket" },
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Get multiple playbill insert URLs for a layout (deterministic when baseSeed provided).
 */
export function getRandomPlaybillInserts(count: number, baseSeed?: string): string[] {
  if (PLAYBILL_INSERT_FILES.length === 0 || count <= 0) return [];
  const results: string[] = [];
  const available = [...PLAYBILL_INSERT_FILES];
  const seed = baseSeed ? simpleHash(baseSeed) : undefined;

  for (let i = 0; i < count; i++) {
    if (available.length === 0) available.push(...PLAYBILL_INSERT_FILES);
    const index =
      seed !== undefined
        ? (seed + i) % available.length
        : Math.floor(Math.random() * available.length);
    const selected = available.splice(index, 1)[0]!;
    results.push(getSharedAssetUrl(`playbill/insert-images/inserts/${selected}`));
  }
  return results;
}

/**
 * Get ticket insert objects (image URL + alt) for a layout.
 */
export function getRandomTicketInserts(count: number, baseSeed?: string): TicketInsert[] {
  if (TICKET_PATHS.length === 0 || count <= 0) return [];
  const results: TicketInsert[] = [];
  const available = TICKET_PATHS.map((t) => ({ ...t }));
  const seed = baseSeed ? simpleHash(baseSeed) : undefined;

  for (let i = 0; i < count; i++) {
    if (available.length === 0) available.push(...TICKET_PATHS.map((t) => ({ ...t })));
    const index =
      seed !== undefined
        ? (seed + i) % available.length
        : Math.floor(Math.random() * available.length);
    const selected = available.splice(index, 1)[0]!;
    results.push({
      image: getSharedAssetUrl(`playbill/insert-images/tickets/${selected.file}`),
      alt: selected.alt,
    });
  }
  return results;
}

/**
 * Create a stable seed from layout/frame/mat for consistent preview inserts.
 */
export function createPlaybillInsertSeed(
  layoutId: string,
  frameId: string,
  matType: string
): string {
  return `${layoutId}-${frameId}-${matType}`;
}
