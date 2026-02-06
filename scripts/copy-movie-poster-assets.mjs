#!/usr/bin/env node
/**
 * Copy movie-poster assets from original source into shared_assets/movie-poster
 * with standardized names (poster-01..17.png, lifestyle_1..31.jpg).
 *
 * Source: assets/attached_assets (or set MOVIE_POSTER_SOURCE env to another path).
 * Run from repo root: node custom-frame-sizes/scripts/copy-movie-poster-assets.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const defaultSource = path.join(repoRoot, "assets", "attached_assets");
const sourceDir = process.env.MOVIE_POSTER_SOURCE || defaultSource;

const sharedRoot = path.resolve(__dirname, "..", "assets_to_use", "shared_assets");
const insertImagesDir = path.join(sharedRoot, "movie-poster", "insert-images");
const lifestyleDir = path.join(sharedRoot, "movie-poster", "lifestyle");

/**
 * Original filenames from CustomFrameSizes-CODE/client/src/components/specialty/MoviePosterFrameDesigner.tsx
 * Order matches SAMPLE_MOVIE_POSTERS (index 0 = poster-01.png, etc.)
 */
const POSTER_SOURCES = [
  "ChatGPT_Image_Dec_17,_2025,_05_21_26_AM_1765996823478.png",
  "ChatGPT_Image_Dec_17,_2025,_05_24_33_AM_1765996823478.png",
  "ChatGPT_Image_Dec_17,_2025,_05_26_05_AM_1765996823478.png",
  "ChatGPT_Image_Dec_17,_2025,_05_33_21_AM_1765996823477.png",
  "ChatGPT_Image_Dec_17,_2025,_05_34_49_AM_1765996823477.png",
  "ChatGPT_Image_Dec_17,_2025,_05_37_58_AM_1765996823476.png",
  "ChatGPT_Image_Dec_17,_2025,_05_39_11_AM_1765996823476.png",
  "ChatGPT_Image_Dec_17,_2025,_05_40_19_AM_1765996823475.png",
  "ChatGPT_Image_Dec_17,_2025,_05_42_58_AM_1765996823482.png",
  "ChatGPT_Image_Dec_17,_2025,_05_44_34_AM_1765996823481.png",
  "ChatGPT_Image_Dec_17,_2025,_05_46_10_AM_1765996823481.png",
  "ChatGPT_Image_Dec_17,_2025,_05_47_39_AM_1765996823481.png",
  "ChatGPT_Image_Dec_17,_2025,_05_49_21_AM_1765996823480.png",
  "ChatGPT_Image_Dec_17,_2025,_05_50_48_AM_1765996823480.png",
  "ChatGPT_Image_Dec_17,_2025,_05_52_55_AM_1765996823480.png",
  "ChatGPT_Image_Dec_17,_2025,_06_01_06_AM_1765996823479.png",
  "ChatGPT_Image_Dec_17,_2025,_06_03_02_AM_1765996823479.png",
];

/**
 * Original lifestyle filenames (order 1..31 from MoviePosterFrameDesigner imports).
 */
const LIFESTYLE_SOURCES = [
  "Movie_Poster_Lifestyle_(1)_1765996892733.jpg",
  "Movie_Poster_Lifestyle_(2)_1765996965775.jpg",
  "Movie_Poster_Lifestyle_(3)_1765996892737.jpg",
  "Movie_Poster_Lifestyle_(4)_1765996892735.jpg",
  "Movie_Poster_Lifestyle_(5)_1765996965779.jpg",
  "Movie_Poster_Lifestyle_(6)_1765996965777.jpg",
  "Movie_Poster_Lifestyle_(7)_1765996965778.jpg",
  "Movie_Poster_Lifestyle_(8)_1765996965776.jpg",
  "Movie_Poster_Lifestyle_(9)_1765996892738.jpg",
  "Movie_Poster_Lifestyle_(10)_1765996892740.jpg",
  "Movie_Poster_Lifestyle_(11)_1765996892736.jpg",
  "Movie_Poster_Lifestyle_(12)_1765996965776.jpg",
  "Movie_Poster_Lifestyle_(13)_1765996892740.jpg",
  "Movie_Poster_Lifestyle_(14)_1765996965778.jpg",
  "Movie_Poster_Lifestyle_(15)_1765996892741.jpg",
  "Movie_Poster_Lifestyle_(16)_1765996892739.jpg",
  "Movie_Poster_Lifestyle_(17)_1765996892741.jpg",
  "Movie_Poster_Lifestyle_(18)_1765996965777.jpg",
  "Movie_Poster_Lifestyle_(19)_1765996892737.jpg",
  "Movie_Poster_Lifestyle_(20)_1765996965776.jpg",
  "Movie_Poster_Lifestyle_(21)_1765996965775.jpg",
  "Movie_Poster_Lifestyle_(22)_1765996892738.jpg",
  "Movie_Poster_Lifestyle_(23)_1765996892736.jpg",
  "Movie_Poster_Lifestyle_(24)_1765996892732.jpg",
  "Movie_Poster_Lifestyle_(25)_1765996965779.jpg",
  "Movie_Poster_Lifestyle_(26)_1765996892740.jpg",
  "Movie_Poster_Lifestyle_(27)_1765996892739.jpg",
  "Movie_Poster_Lifestyle_(28)_1765996892735.jpg",
  "Movie_Poster_Lifestyle_(29)_1765996892734.jpg",
  "Movie_Poster_Lifestyle_(30)_1765996892734.jpg",
  "Movie_Poster_Lifestyle_(31)_1765996892733.jpg",
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
  console.log("Movie poster assets copy");
  console.log("  Source:", sourceDir);
  console.log("  Insert images ->", insertImagesDir);
  console.log("  Lifestyle      ->", lifestyleDir);

  if (!fs.existsSync(sourceDir)) {
    console.error("Source directory not found:", sourceDir);
    console.error("  Set MOVIE_POSTER_SOURCE if files are elsewhere (e.g. CustomFrameSizes-CODE/client/src/assets).");
    process.exit(1);
  }

  let copied = 0;

  console.log("\nPoster insert images:");
  for (let i = 0; i < POSTER_SOURCES.length; i++) {
    const destName = `poster-${String(i + 1).padStart(2, "0")}.png`;
    const srcPath = path.join(sourceDir, POSTER_SOURCES[i]);
    const destPath = path.join(insertImagesDir, destName);
    if (copyFile(srcPath, destPath)) copied++;
  }

  console.log("\nLifestyle images:");
  for (let i = 0; i < LIFESTYLE_SOURCES.length; i++) {
    const destName = `lifestyle_${i + 1}.jpg`;
    const srcPath = path.join(sourceDir, LIFESTYLE_SOURCES[i]);
    const destPath = path.join(lifestyleDir, destName);
    if (copyFile(srcPath, destPath)) copied++;
  }

  console.log("\nDone. Copied", copied, "files.");
}

main();
