#!/usr/bin/env node
/**
 * Copy needlework lifestyle assets from original source into shared_assets/needlework/lifestyle
 * with standardized names (lifestyle_1.jpeg … lifestyle_31.jpeg).
 *
 * Insert images are already in shared_assets/needlework/insert-images/. This script
 * only copies lifestyle images.
 *
 * Sources tried in order:
 * 1. NEEDLEWORK_SOURCE env (if set), or assets/attached_assets, with original filenames
 *    e.g. Needlework_Lifestyle_(18)_1766016863625.jpeg
 * 2. Fallback: CustomFrameSizes-CODE/client/src/assets/specialty/needlework_frame_lifestyle
 *    with filenames needlework_lifestyle_1.jpeg … needlework_lifestyle_31.jpeg
 *
 * Run from repo root: node custom-frame-sizes/scripts/copy-needlework-assets.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Workspace root (parent of custom-frame-sizes)
const repoRoot = path.resolve(__dirname, "../..");
const defaultSource = path.join(repoRoot, "assets", "attached_assets");
const codeFallbackSource = path.join(
  repoRoot,
  "CustomFrameSizes-CODE",
  "client",
  "src",
  "assets",
  "specialty",
  "needlework_frame_lifestyle"
);

const sharedRoot = path.resolve(__dirname, "..", "assets_to_use", "shared_assets");
const lifestyleDir = path.join(sharedRoot, "needlework", "lifestyle");

const LIFESTYLE_COUNT = 31;

/** Original filenames in attached_assets (e.g. Needlework_Lifestyle_(18)_1766016863625.jpeg) */
const ORIGINAL_FILENAMES = [
  "Needlework_Lifestyle_(1)_1766016863619.jpeg",
  "Needlework_Lifestyle_(2)_1766016863619.jpeg",
  "Needlework_Lifestyle_(3)_1766016863620.jpeg",
  "Needlework_Lifestyle_(4)_1766016863620.jpeg",
  "Needlework_Lifestyle_(5)_1766016863620.jpeg",
  "Needlework_Lifestyle_(6)_1766016863621.jpeg",
  "Needlework_Lifestyle_(7)_1766016863621.jpeg",
  "Needlework_Lifestyle_(8)_1766016863621.jpeg",
  "Needlework_Lifestyle_(9)_1766016863622.jpeg",
  "Needlework_Lifestyle_(10)_1766016863622.jpeg",
  "Needlework_Lifestyle_(11)_1766016863622.jpeg",
  "Needlework_Lifestyle_(12)_1766016863623.jpeg",
  "Needlework_Lifestyle_(13)_1766016863623.jpeg",
  "Needlework_Lifestyle_(14)_1766016863623.jpeg",
  "Needlework_Lifestyle_(15)_1766016863624.jpeg",
  "Needlework_Lifestyle_(16)_1766016863624.jpeg",
  "Needlework_Lifestyle_(17)_1766016863624.jpeg",
  "Needlework_Lifestyle_(18)_1766016863625.jpeg",
  "Needlework_Lifestyle_(19)_1766016863625.jpeg",
  "Needlework_Lifestyle_(20)_1766016863618.jpeg",
  "Needlework_Lifestyle_(21)_1766016892163.jpeg",
  "Needlework_Lifestyle_(22)_1766016892164.jpeg",
  "Needlework_Lifestyle_(23)_1766016892164.jpeg",
  "Needlework_Lifestyle_(24)_1766016892165.jpeg",
  "Needlework_Lifestyle_(25)_1766016892165.jpeg",
  "Needlework_Lifestyle_(26)_1766016892165.jpeg",
  "Needlework_Lifestyle_(27)_1766016892166.jpeg",
  "Needlework_Lifestyle_(28)_1766016892166.jpeg",
  "Needlework_Lifestyle_(29)_1766016892167.jpeg",
  "Needlework_Lifestyle_(30)_1766016892167.jpeg",
  "Needlework_Lifestyle_(31)_1766016892168.jpeg",
];

function copyFile(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) {
    console.warn("  Skip (not found):", path.basename(srcPath));
    return false;
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(srcPath, destPath);
  console.log("  Copied:", path.basename(srcPath), "->", path.basename(destPath));
  return true;
}

function main() {
  const sourceDir = process.env.NEEDLEWORK_SOURCE || defaultSource;

  console.log("Needlework lifestyle assets copy");
  console.log("  Dest  :", lifestyleDir);

  // Try 1: explicit env or attached_assets with original filenames
  let sourceFiles = ORIGINAL_FILENAMES;
  let tryDir = sourceDir;

  if (!fs.existsSync(tryDir)) {
    tryDir = codeFallbackSource;
    sourceFiles = Array.from({ length: LIFESTYLE_COUNT }, (_, i) => `needlework_lifestyle_${i + 1}.jpeg`);
    console.log("  Source: (fallback) CODE needlework_frame_lifestyle");
  } else {
    const firstPath = path.join(tryDir, sourceFiles[0]);
    if (!fs.existsSync(firstPath)) {
      tryDir = codeFallbackSource;
      sourceFiles = Array.from({ length: LIFESTYLE_COUNT }, (_, i) => `needlework_lifestyle_${i + 1}.jpeg`);
      console.log("  Source: (fallback) CODE needlework_frame_lifestyle (originals not in attached_assets)");
    } else {
      console.log("  Source:", tryDir, "(attached_assets / original filenames)");
    }
  }

  if (!fs.existsSync(tryDir)) {
    console.error("Source directory not found:", tryDir);
    console.error("  Put files in assets/attached_assets (Needlework_Lifestyle_(N)_....jpeg) or run from workspace that has CustomFrameSizes-CODE.");
    process.exit(1);
  }

  let copied = 0;
  for (let i = 0; i < LIFESTYLE_COUNT; i++) {
    const destName = `lifestyle_${i + 1}.jpeg`;
    const srcPath = path.join(tryDir, sourceFiles[i]);
    const destPath = path.join(lifestyleDir, destName);
    if (copyFile(srcPath, destPath)) copied++;
  }
  console.log("\nDone. Copied", copied, "lifestyle files.");
}

main();
