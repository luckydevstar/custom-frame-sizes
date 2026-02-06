#!/usr/bin/env node
/**
 * Standardize frame image filenames under assets/public/frames/{SKU}/:
 * - corner.jpg → corner_a.jpg, profile.jpg → profile_a.jpg
 * - corner-a.jpg → corner_a.jpg, corner-b.jpg → corner_b.jpg, corner-c.jpg → corner_c.jpg
 * - profile-a.jpg → profile_a.jpg, profile-b.jpg → profile_b.jpg, profile-c.jpg → profile_c.jpg
 *
 * Run from repo root (us_CustomFrame): node custom-frame-sizes/scripts/standardize-frame-assets.mjs
 * Or from custom-frame-sizes: node scripts/standardize-frame-assets.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// assets/public/frames is at workspace root (us_CustomFrame)
const repoRoot = path.resolve(__dirname, "../..");
const framesDir = path.join(repoRoot, "assets", "public", "frames");

const RENAMES = [
  ["corner.jpg", "corner_a.jpg"],
  ["profile.jpg", "profile_a.jpg"],
  ["corner-a.jpg", "corner_a.jpg"],
  ["corner-b.jpg", "corner_b.jpg"],
  ["corner-c.jpg", "corner_c.jpg"],
  ["profile-a.jpg", "profile_a.jpg"],
  ["profile-b.jpg", "profile_b.jpg"],
  ["profile-c.jpg", "profile_c.jpg"],
];

if (!fs.existsSync(framesDir)) {
  console.error("Frames dir not found:", framesDir);
  process.exit(1);
}

const skuDirs = fs.readdirSync(framesDir, { withFileTypes: true }).filter((d) => d.isDirectory());
let totalRenamed = 0;

for (const dir of skuDirs) {
  const skuPath = path.join(framesDir, dir.name);
  for (const [from, to] of RENAMES) {
    const fromPath = path.join(skuPath, from);
    const toPath = path.join(skuPath, to);
    if (fs.existsSync(fromPath)) {
      if (fs.existsSync(toPath)) {
        console.warn(`Skip ${dir.name}/${from}: ${to} already exists`);
        continue;
      }
      fs.renameSync(fromPath, toPath);
      console.log(`${dir.name}: ${from} → ${to}`);
      totalRenamed++;
    }
  }
}

console.log("Done. Total renames:", totalRenamed);
