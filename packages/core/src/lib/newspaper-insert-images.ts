/**
 * Newspaper insert image paths for designer preview.
 * Files: shared_assets/newspaper/insert-images/newspaper-inserts/newspaper-insert-01.jpg … 39.jpg.
 * Use with getSharedAssetUrl to build full URLs.
 */

const INSERT_COUNT = 39;
const BASE_PATH = "newspaper/insert-images/newspaper-inserts";

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Relative paths for all newspaper inserts. */
export function getNewspaperInsertPaths(): string[] {
  const paths: string[] = [];
  for (let i = 1; i <= INSERT_COUNT; i++) {
    paths.push(`${BASE_PATH}/newspaper-insert-${pad(i)}.jpg`);
  }
  return paths;
}

/** One random or seeded insert path (relative). */
export function getRandomNewspaperInsertPath(seed?: string | number): string {
  const paths = getNewspaperInsertPaths();
  if (paths.length === 0) return "";
  const index =
    seed !== undefined
      ? (typeof seed === "string"
          ? seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
          : seed) % paths.length
      : Math.floor(Math.random() * paths.length);
  return paths[Math.abs(index) % paths.length] ?? paths[0]!;
}

/** Multiple unique random insert paths (no duplicates). */
export function getUniqueRandomNewspaperInsertPaths(count: number): string[] {
  const paths = getNewspaperInsertPaths();
  const maxCount = Math.min(count, paths.length);
  const shuffled = [...paths];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = shuffled[i]!;
    const b = shuffled[j]!;
    shuffled[i] = b;
    shuffled[j] = a;
  }
  return shuffled.slice(0, maxCount);
}
