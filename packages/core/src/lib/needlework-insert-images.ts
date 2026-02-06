/**
 * Needlework insert image paths for designer preview.
 * Files live in shared_assets/needlework/insert-images/preview-inserts/ (needlework-insert-01.jpg … 39).
 * Use with getSharedAssetUrl to build full URLs.
 */

const PREVIEW_INSERT_COUNT = 39;
const BASE_PATH = "needlework/insert-images/preview-inserts";

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Relative paths for all preview inserts (needlework-insert-01.jpg … needlework-insert-39.jpg). */
export function getNeedleworkInsertPaths(): string[] {
  const paths: string[] = [];
  for (let i = 1; i <= PREVIEW_INSERT_COUNT; i++) {
    paths.push(`${BASE_PATH}/needlework-insert-${pad(i)}.jpg`);
  }
  return paths;
}

/** One random or seeded insert path (relative). */
export function getRandomNeedleworkInsertPath(seed?: string | number): string {
  const paths = getNeedleworkInsertPaths();
  if (paths.length === 0) return "";
  const index =
    seed !== undefined
      ? (typeof seed === "string"
          ? seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
          : seed) % paths.length
      : Math.floor(Math.random() * paths.length);
  return paths[Math.abs(index) % paths.length] ?? paths[0]!;
}
