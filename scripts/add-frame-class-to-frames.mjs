#!/usr/bin/env node
/**
 * Add frameClass to each frame in packages/data/src/frames.json using frame-class map.
 * Run from repo root or custom-frame-sizes: node scripts/add-frame-class-to-frames.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PICTURE_SKUS = new Set([
  "206", "6301", "6711", "8446", "8575", "8576", "8694", "8744", "8745", "8750", "8752",
  "8837", "8838", "8981", "8989", "9135", "9160", "9163", "9667", "9885", "9932", "9935",
  "10485", "10569", "10570", "10587", "10588", "10618", "10712", "10713", "10714", "10783",
  "10827", "10828", "10829", "10832", "10833", "10928", "11153", "11239",
]);
const SHADOWBOX_SUBSET_SKUS = new Set(["10727", "10728", "10729"]);
const SHADOWBOX_FULL_SKUS = new Set([
  "8693", "8990", "9448", "9785", "9959", "10474", "10475", "10478", "10479",
  "10772", "10774", "10775", "10776", "10779", "10781", "10897", "10960",
  "84154", "84159", "84161", "84162",
]);
const CANVAS_SKUS = new Set([
  "10104", "10105", "10117", "10426", "10427", "10428", "10494", "10495",
  "10564", "10565", "10627", "10694", "10764", "10765", "10766", "10767",
  "11345", "11351",
]);

function getFrameClass(sku) {
  if (SHADOWBOX_SUBSET_SKUS.has(sku)) return "shadowbox-subset";
  if (CANVAS_SKUS.has(sku)) return "canvas";
  if (SHADOWBOX_FULL_SKUS.has(sku)) return "shadowbox-full";
  return "picture";
}

const framesPath = path.resolve(__dirname, "../packages/data/src/frames.json");
const frames = JSON.parse(fs.readFileSync(framesPath, "utf8"));

for (const frame of frames) {
  const sku = frame.sku;
  if (!sku) continue;
  frame.frameClass = getFrameClass(sku);
}

fs.writeFileSync(framesPath, JSON.stringify(frames, null, 2) + "\n", "utf8");
console.log("Added frameClass to", frames.length, "frames.");
