#!/usr/bin/env node
/**
 * Copy all designer insert/lifestyle assets from assets/public into shared_assets.
 * Does not move or delete; leaves assets/public unchanged.
 * Run from repo root: node custom-frame-sizes/scripts/populate-shared-assets.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const publicDir = path.join(repoRoot, "assets", "public");
const sharedDir = path.join(repoRoot, "shared_assets");

if (!fs.existsSync(publicDir)) {
  console.error("Not found:", publicDir);
  process.exit(1);
}

/**
 * Copy rules: source path under public → destination path under shared_assets.
 * For dirs: contents of source are copied into dest (dest is the folder that will contain them).
 * For files: source file is copied to dest path (dest is full path to file).
 */
const COPY_RULES = [
  // lifestyle/ by designer
  { from: "lifestyle/canvas", to: "canvas/lifestyle" },
  { from: "lifestyle/collage", to: "collage/lifestyle" },
  { from: "lifestyle/graded-card", to: "card-frames/lifestyle" },
  { from: "lifestyle/magazine", to: "magazine/lifestyle" },
  { from: "lifestyle/newspaper", to: "newspaper/lifestyle" },
  { from: "lifestyle/playbill", to: "playbill/lifestyle" },
  // images/ → designer insert-images or lifestyle
  { from: "images/card-inserts", to: "card-frames/insert-images/card-inserts" },
  { from: "images/collage-inserts", to: "collage/insert-images/collage-inserts" },
  { from: "images/newspaper-inserts", to: "newspaper/insert-images/newspaper-inserts" },
  { from: "images/needlework", to: "needlework/insert-images" },
  { from: "images/record-album-lifestyle", to: "record-album/lifestyle" },
  { from: "images/signature-frame-lifestyle", to: "signature-frames/lifestyle" },
  { from: "images/blog", to: "blog" },
  // comic: inserts (modern, slabbed) + lifestyle + root file
  { from: "comic/inserts", to: "comic/insert-images" },
  { from: "comic/lifestyle", to: "comic/lifestyle" },
  { from: "comic/whats-included.jpg", to: "comic/insert-images/whats-included.jpg" },
  // magazine
  { from: "magazine/inserts", to: "magazine/insert-images" },
  // diploma
  { from: "diploma/inserts", to: "diploma/insert-images" },
  { from: "diploma/lifestyle", to: "diploma/lifestyle" },
  // playbill: inserts + tickets
  { from: "playbill/inserts", to: "playbill/insert-images/inserts" },
  { from: "playbill/tickets", to: "playbill/insert-images/tickets" },
  // collage: school-days + images/collage-inserts already above
  { from: "collage/school-days-inserts", to: "collage/insert-images/school-days-inserts" },
  // military, cd, puzzle, sonogram
  { from: "military/lifestyle", to: "military/lifestyle" },
  { from: "cd/lifestyle", to: "cd/lifestyle" },
  { from: "puzzle-frames/lifestyle", to: "puzzle/lifestyle" },
  { from: "sonogram/lifestyle", to: "sonogram/lifestyle" },
  // backup card inserts
  { from: "backup-card-inserts-other-grading", to: "card-frames/insert-images/backup-card-inserts-other-grading" },
  // assets/ subfolders
  { from: "assets/canvas", to: "canvas/images" },
  { from: "assets/stock/ticket-inserts", to: "ticket-frames/insert-images" },
  // misc shared
  { from: "components", to: "components" },
  { from: "mats", to: "mats" },
];

/**
 * Copy contents of src (file or dir) into dest path.
 * - If src is a file: copy to dest (dest is full path to file).
 * - If src is a dir: create dest dir and copy every item inside src into dest.
 */
function copyInto(src, dest) {
  if (!fs.existsSync(src)) return 0;
  const stat = fs.statSync(src);
  if (stat.isFile()) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    return 1;
  }
  // Directory: copy each child into dest/
  fs.mkdirSync(dest, { recursive: true });
  let n = 0;
  for (const name of fs.readdirSync(src)) {
    const srcPath = path.join(src, name);
    const destPath = path.join(dest, name);
    if (fs.statSync(srcPath).isDirectory()) {
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
    n++;
  }
  return n;
}

let totalItems = 0;
const copied = [];

for (const rule of COPY_RULES) {
  const src = path.join(publicDir, rule.from);
  const dest = path.join(sharedDir, rule.to);

  if (!fs.existsSync(src)) {
    console.warn("Skip (missing):", rule.from);
    continue;
  }

  const n = copyInto(src, dest);
  copied.push(`${rule.from} → ${rule.to}${n > 0 ? ` (${n} items)` : ""}`);
  totalItems += n;
}

console.log("Copied", copied.length, "rules:");
copied.forEach((c) => console.log("  ", c));
console.log("Done. shared_assets populated from assets/public.");
