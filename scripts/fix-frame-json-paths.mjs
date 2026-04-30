/**
 * Rewrite /frames/{sku}/... URLs in frames.json to match files in z-assets/public/frames.
 *
 * Run from repo root framecraft-frontends:
 *   node scripts/fix-frame-json-paths.mjs
 *
 * Rules (first match wins):
 * - Exact filename on disk → keep
 * - corner.jpg → corner_a.jpg (when present)
 * - profile.jpg → profile_a.jpg (when present)
 * - corner-a.jpg / profile-a.jpg → corner_a.jpg / profile_a.jpg (hyphen → underscore)
 * - dimensions.jpg ↔ dimensions.png (whichever exists)
 * - lifestyle_N.jpg ↔ lifestyle_N.png; lifestyle-NN.jpg ↔ lifestyle-NN.png
 * - 12345-pro-a.jpg ↔ 12345_pro-a.jpg (SKU-prefixed pro views)
 * - lifestyle_ultra_* ext swap
 *
 * Paths under /frames/{sku}/ with no folder in z-assets are reported; use --strict to fail CI.
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const Z_FRAMES = path.resolve(ROOT, "..", "z-assets", "public", "frames");

const FRAMES_JSON_FILES = [
  path.join(ROOT, "apps", "store-a", "src", "data", "frames.json"),
  path.join(ROOT, "apps", "store-b", "src", "data", "frames.json"),
];

/** @type {Map<string, Set<string>>} */
const dirCache = new Map();

function listDir(sku) {
  if (dirCache.has(sku)) return dirCache.get(sku);
  const d = path.join(Z_FRAMES, sku);
  const set = new Set();
  if (fs.existsSync(d) && fs.statSync(d).isDirectory()) {
    for (const name of fs.readdirSync(d)) set.add(name);
  }
  dirCache.set(sku, set);
  return set;
}

/**
 * @param {Set<string>} onDisk
 * @param {string} file base name only
 */
function resolveFile(onDisk, file) {
  if (onDisk.has(file)) return file;

  const lower = file.toLowerCase();
  const ci = [...onDisk].find((x) => x.toLowerCase() === lower);
  if (ci) return ci;

  // corner.jpg → corner_a.jpg
  if (file === "corner.jpg" && onDisk.has("corner_a.jpg")) return "corner_a.jpg";

  // profile.jpg → profile_a.jpg
  if (file === "profile.jpg" && onDisk.has("profile_a.jpg")) return "profile_a.jpg";

  // corner-a.jpg → corner_a.jpg, profile-b.jpg → profile_b.jpg
  const hyphenCorner = file.match(/^corner-([a-z])\.(jpe?g|png)$/i);
  if (hyphenCorner) {
    const guess = `corner_${hyphenCorner[1].toLowerCase()}.${hyphenCorner[2].toLowerCase() === "jpeg" ? "jpg" : hyphenCorner[2].toLowerCase()}`;
    if (onDisk.has(guess)) return guess;
    const guessJpg = `corner_${hyphenCorner[1].toLowerCase()}.jpg`;
    if (onDisk.has(guessJpg)) return guessJpg;
  }

  const hyphenProfile = file.match(/^profile-([a-z])\.(jpe?g|png)$/i);
  if (hyphenProfile) {
    const ext = hyphenProfile[2].toLowerCase() === "jpeg" ? "jpg" : hyphenProfile[2].toLowerCase();
    const guess = `profile_${hyphenProfile[1].toLowerCase()}.${ext}`;
    if (onDisk.has(guess)) return guess;
    const guessJpg = `profile_${hyphenProfile[1].toLowerCase()}.jpg`;
    if (onDisk.has(guessJpg)) return guessJpg;
  }

  // dimensions.jpg ↔ dimensions.png
  const dimBase = file.match(/^dimensions\.(jpg|jpeg|png)$/i);
  if (dimBase) {
    const alts = ["dimensions.png", "dimensions.jpg", "dimensions.jpeg"];
    for (const a of alts) {
      if (a !== file && onDisk.has(a)) return a;
    }
  }

  // lifestyle_12.jpg ↔ lifestyle_12.png (underscore + index)
  const lifeUnderscore = file.match(/^(lifestyle_\d+)\.(jpe?g|png)$/i);
  if (lifeUnderscore) {
    const base = lifeUnderscore[1];
    for (const ext of ["jpg", "jpeg", "png"]) {
      const candidate = `${base}.${ext}`;
      if (candidate !== file && onDisk.has(candidate)) return candidate;
    }
  }

  // lifestyle-01.jpg ↔ lifestyle-01.png (hyphen + index, zero-padded)
  const lifeHyphen = file.match(/^(lifestyle-\d+)\.(jpe?g|png)$/i);
  if (lifeHyphen) {
    const base = lifeHyphen[1];
    for (const ext of ["jpg", "jpeg", "png"]) {
      const candidate = `${base}.${ext}`;
      if (candidate !== file && onDisk.has(candidate)) return candidate;
    }
  }

  // SKU-prefixed: "12345-pro-a.jpg" on disk may be "12345_pro-a.jpg" or vice versa
  const proHyphen = file.match(/^(\d+)-pro-([a-z])\.(jpe?g|png)$/i);
  if (proHyphen) {
    const underscores = `${proHyphen[1]}_pro-${proHyphen[2].toLowerCase()}.${proHyphen[3].toLowerCase() === "jpeg" ? "jpg" : proHyphen[3].toLowerCase()}`;
    if (onDisk.has(underscores)) return underscores;
  }
  const proUnder = file.match(/^(\d+)_pro-([a-z])\.(jpe?g|png)$/i);
  if (proUnder) {
    const hyphens = `${proUnder[1]}-pro-${proUnder[2].toLowerCase()}.${proUnder[3].toLowerCase() === "jpeg" ? "jpg" : proUnder[3].toLowerCase()}`;
    if (onDisk.has(hyphens)) return hyphens;
  }

  // lifestyle_ultra_01.png ↔ .jpg
  const ultra = file.match(/^(lifestyle_ultra_\d+)\.(jpe?g|png)$/i);
  if (ultra) {
    const base = ultra[1];
    for (const ext of ["png", "jpg", "jpeg"]) {
      const candidate = `${base}.${ext}`;
      if (candidate !== file && onDisk.has(candidate)) return candidate;
    }
  }

  return null;
}

/**
 * @param {string} url "/frames/SKU/file.jpg"
 * @returns {{ next: string | null, sku: string, file: string } | null} null if not a /frames/ path
 */
function fixUrl(url) {
  if (!url || typeof url !== "string" || !url.startsWith("/frames/")) return null;
  const rest = url.slice("/frames/".length);
  const slash = rest.indexOf("/");
  if (slash === -1) return null;
  const sku = rest.slice(0, slash);
  const file = rest.slice(slash + 1);
  if (!sku || !file || file.includes("..")) return null;

  const onDisk = listDir(sku);
  if (onDisk.size === 0) {
    return { next: null, sku, file, warn: "no_asset_dir" };
  }

  const resolved = resolveFile(onDisk, file);
  if (resolved && resolved !== file) {
    return { next: `/frames/${sku}/${resolved}`, sku, file };
  }
  if (resolved) return { next: null, sku, file };

  return { next: null, sku, file, warn: "unresolved" };
}

function walkAndPatch(frames) {
  let changes = 0;
  const unresolved = [];

  for (const frame of frames) {
    const patch = (u) => {
      const r = fixUrl(u);
      if (!r || !r.next) {
        if (r?.warn === "unresolved" || r?.warn === "no_asset_dir") {
          unresolved.push({ sku: r.sku, file: r.file, url: u, warn: r.warn });
        }
        return u;
      }
      changes++;
      return r.next;
    };

    if (frame.thumbnail) frame.thumbnail = patch(frame.thumbnail);
    if (frame.dimensionalDiagram) frame.dimensionalDiagram = patch(frame.dimensionalDiagram);
    for (const im of frame.alternateImages ?? []) {
      if (im.url) im.url = patch(im.url);
    }
  }

  return { changes, unresolved };
}

function main() {
  if (!fs.existsSync(Z_FRAMES)) {
    console.error("Asset root not found:", Z_FRAMES);
    process.exit(1);
  }

  const strict = process.argv.includes("--strict");
  let hadUnresolved = false;

  for (const jsonPath of FRAMES_JSON_FILES) {
    if (!fs.existsSync(jsonPath)) {
      console.warn("Skip (missing):", jsonPath);
      continue;
    }
    const raw = fs.readFileSync(jsonPath, "utf8");
    const frames = JSON.parse(raw);
    const { changes, unresolved } = walkAndPatch(frames);

    if (unresolved.length) {
      hadUnresolved = true;
      console.warn(`\n${unresolved.length} path(s) could not be resolved (add assets or fix manually):`);
      console.warn(jsonPath);
      for (const u of unresolved.slice(0, 30)) console.warn(" ", u);
      if (unresolved.length > 30) console.warn(`  … and ${unresolved.length - 30} more`);
    }

    fs.writeFileSync(jsonPath, JSON.stringify(frames, null, 2) + "\n", "utf8");
    console.log(path.relative(ROOT, jsonPath), "— updated", changes, "URLs");
  }

  if (strict && hadUnresolved) process.exit(1);
}

main();
