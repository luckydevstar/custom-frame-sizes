#!/usr/bin/env node
/**
 * Copy store-a–specific assets from assets/public into store-a_assets:
 * - frames/ (all frame product images by SKU)
 * - assets/ (brand, hero, home, glazing, marketing, etc.) – excludes assets/canvas and assets/stock (use shared_assets/canvas and shared_assets/ticket-frames/insert-images)
 * - Root site files (robots.txt, sitemap.xml, site.webmanifest, etc.)
 *
 * Does not move or delete; leaves assets/public unchanged.
 * Run from repo root: node custom-frame-sizes/scripts/populate-store-a-assets.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const publicDir = path.join(repoRoot, "assets", "public");
const storeADir = path.join(repoRoot, "store-a_assets");

if (!fs.existsSync(publicDir)) {
  console.error("Not found:", publicDir);
  process.exit(1);
}

/**
 * Copy rules: source path under public → destination path under store-a_assets.
 * Full directory copies (recursive). Optional exclude: array of subfolder names to skip.
 */
const COPY_RULES = [
  // Frame product images by SKU (~2–3GB)
  { from: "frames", to: "frames" },
  // Marketing and site assets (exclude canvas + stock – use shared_assets for those)
  { from: "assets", to: "assets", exclude: ["canvas", "stock"] },
];

/**
 * Root-level site files to copy into store-a_assets root.
 */
const ROOT_FILES = [
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
  "recommendation-preview.html",
  "test-iframe-handshake.html",
];

// Ensure store-a_assets exists
fs.mkdirSync(storeADir, { recursive: true });

let copied = 0;

for (const rule of COPY_RULES) {
  const src = path.join(publicDir, rule.from);
  const dest = path.join(storeADir, rule.to);

  if (!fs.existsSync(src)) {
    console.warn("Skip (missing):", rule.from);
    continue;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (rule.exclude && rule.exclude.length > 0) {
    // Remove excluded subfolders from dest so re-runs don't leave stale copies
    for (const ex of rule.exclude) {
      const removePath = path.join(dest, ex);
      if (fs.existsSync(removePath)) fs.rmSync(removePath, { recursive: true });
    }
    const excludeSet = new Set(rule.exclude);
    fs.cpSync(src, dest, {
      recursive: true,
      force: true,
      filter: (source) => {
        const rel = path.relative(src, source);
        const first = rel.split(path.sep)[0];
        return !excludeSet.has(first);
      },
    });
  } else {
    fs.cpSync(src, dest, { recursive: true, force: true });
  }

  const count = countFiles(dest);
  console.log(rule.from, "→", rule.to, "(" + count + " files)");
  copied += count;
}

for (const name of ROOT_FILES) {
  const src = path.join(publicDir, name);
  const dest = path.join(storeADir, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(name, "→", name);
    copied += 1;
  }
}

function countFiles(dir) {
  let n = 0;
  if (!fs.existsSync(dir)) return 0;
  const stat = fs.statSync(dir);
  if (stat.isFile()) return 1;
  for (const name of fs.readdirSync(dir)) {
    n += countFiles(path.join(dir, name));
  }
  return n;
}

console.log("Done. store-a_assets populated from assets/public.");
