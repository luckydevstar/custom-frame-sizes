#!/usr/bin/env node
/**
 * Copy assets from assets/attached_assets into assets_to_use/shared_assets.
 * Use this when you have the original attached_assets folder (e.g. from the legacy app).
 *
 * Mapping:
 *   attached_assets/stock_images/photo_inserts    → shared_assets/stock/photo_inserts
 *   attached_assets/stock_images/canvas_paintings → shared_assets/stock/canvas_paintings
 *   attached_assets/stock_images/puzzle_inserts   → shared_assets/puzzle/insert-images
 *   attached_assets/stock_images/sonogram_inserts → shared_assets/sonogram/insert-images
 *   attached_assets/specialty/ticket_frame_lifestyle   → shared_assets/ticket-frames/lifestyle
 *   attached_assets/specialty/invitation_frame_lifestyle → shared_assets/invitation-frames/lifestyle
 *   attached_assets/image_1766069659840.png → shared_assets/diploma/tassel.png (diploma designer tassel)
 *
 * Does not move or delete; leaves attached_assets unchanged.
 * Run from repo root: node scripts/populate-from-attached-assets.mjs
 *
 * If assets/attached_assets does not exist, the script exits successfully (no-op).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Script lives in custom-frame-sizes/scripts/; assets/attached_assets is at workspace root (parent of custom-frame-sizes)
const monorepoRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(monorepoRoot, "..");
const attachedDir = path.join(workspaceRoot, "assets", "attached_assets");
const sharedDir = path.join(monorepoRoot, "assets_to_use", "shared_assets");

const COPY_RULES = [
  { from: "stock_images/photo_inserts", to: "stock/photo_inserts" },
  { from: "stock_images/canvas_paintings", to: "stock/canvas_paintings" },
  { from: "stock_images/puzzle_inserts", to: "puzzle/insert-images" },
  { from: "stock_images/sonogram_inserts", to: "sonogram/insert-images" },
  { from: "specialty/ticket_frame_lifestyle", to: "ticket-frames/lifestyle" },
  { from: "specialty/invitation_frame_lifestyle", to: "invitation-frames/lifestyle" },
];

// Single files: attached_assets path → shared_assets path
const FILE_COPY_RULES = [
  { from: "image_1766069659840.png", to: "diploma/tassel.png" },
];

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return 0;
  const stat = fs.statSync(src);
  if (!stat.isDirectory()) return 0;
  fs.mkdirSync(dest, { recursive: true });
  let n = 0;
  for (const name of fs.readdirSync(src)) {
    const srcPath = path.join(src, name);
    const destPath = path.join(dest, name);
    if (fs.statSync(srcPath).isDirectory()) {
      n += copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      n++;
    }
  }
  return n;
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) return 0;
  if (!fs.statSync(src).isFile()) return 0;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return 1;
}

if (!fs.existsSync(attachedDir)) {
  console.log("assets/attached_assets not found; skipping attached_assets migration.");
  process.exit(0);
}

if (!fs.existsSync(path.join(monorepoRoot, "assets_to_use"))) {
  fs.mkdirSync(path.join(monorepoRoot, "assets_to_use"), { recursive: true });
}
if (!fs.existsSync(sharedDir)) {
  fs.mkdirSync(sharedDir, { recursive: true });
}

let total = 0;
for (const rule of COPY_RULES) {
  const src = path.join(attachedDir, rule.from);
  const dest = path.join(sharedDir, rule.to);
  const n = copyDir(src, dest);
  if (n > 0) {
    console.log(`${rule.from} → ${rule.to} (${n} items)`);
    total += n;
  }
}
for (const rule of FILE_COPY_RULES) {
  const src = path.join(attachedDir, rule.from);
  const dest = path.join(sharedDir, rule.to);
  const n = copyFile(src, dest);
  if (n > 0) {
    console.log(`${rule.from} → ${rule.to}`);
    total += n;
  }
}

console.log("Done. Total items copied from attached_assets:", total);
