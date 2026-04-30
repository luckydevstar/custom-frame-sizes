/**
 * Compare frames.json image paths to z-assets/public/frames on disk.
 * Run: node scripts/audit-frame-assets.mjs
 */
import fs from "fs";
import path from "path";

const Z_ASSETS_FRAMES = path.resolve("..", "z-assets", "public", "frames");
const JSON_FILES = [
  path.resolve("apps", "store-a", "src", "data", "frames.json"),
  path.resolve("apps", "store-b", "src", "data", "frames.json"),
];

function collectRefs(frames) {
  const refs = new Map();
  const add = (sku, u) => {
    if (!u || typeof u !== "string" || !u.startsWith("/frames/")) return;
    const rest = u.slice("/frames/".length);
    const idx = rest.indexOf("/");
    if (idx === -1) return;
    const folder = rest.slice(0, idx);
    const file = rest.slice(idx + 1);
    if (!refs.has(folder)) refs.set(folder, new Set());
    refs.get(folder).add(file);
  };
  for (const f of frames) {
    const sku = String(f.sku ?? "");
    add(sku, f.thumbnail);
    add(sku, f.dimensionalDiagram);
    for (const im of f.alternateImages ?? []) add(sku, im.url);
  }
  return refs;
}

function auditFile(jsonPath) {
  const frames = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const refs = collectRefs(frames);
  const missing = [];
  let ok = 0;

  for (const [folder, files] of refs) {
    const dir = path.join(Z_ASSETS_FRAMES, folder);
    if (!fs.existsSync(dir)) {
      missing.push({ folder, file: "", reason: "no_dir" });
      continue;
    }
    const ondisk = new Set(fs.readdirSync(dir));
    for (const file of files) {
      if (ondisk.has(file)) {
        ok++;
        continue;
      }
      const lower = file.toLowerCase();
      const ci = [...ondisk].find((x) => x.toLowerCase() === lower);
      if (ci) {
        ok++;
        continue;
      }
      missing.push({ folder, file });
    }
  }

  return { ok, missing, jsonPath };
}

function main() {
  console.log("Asset root:", Z_ASSETS_FRAMES);

  for (const jsonPath of JSON_FILES) {
    if (!fs.existsSync(jsonPath)) {
      console.warn("Skip:", jsonPath);
      continue;
    }
    const { ok, missing, jsonPath: jp } = auditFile(jsonPath);
    console.log("\n===", path.relative(process.cwd(), jp), "===");
    console.log("OK:", ok, "Missing:", missing.length);

    const noDir = missing.filter((m) => m.reason === "no_dir");
    if (noDir.length) {
      const skus = [...new Set(noDir.map((m) => m.folder))];
      console.log("SKUs with no asset folder:", skus.join(", "));
    }

    const byFile = {};
    for (const m of missing) {
      if (!m.file) continue;
      byFile[m.file] = (byFile[m.file] || 0) + 1;
    }
    if (Object.keys(byFile).length) {
      console.log(
        "Sample missing files:",
        Object.entries(byFile)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([f, n]) => `${n}× ${f}`)
          .join("; "),
      );
    }
  }
}

main();
