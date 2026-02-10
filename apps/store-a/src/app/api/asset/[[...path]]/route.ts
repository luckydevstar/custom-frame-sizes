import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/asset/frames/8446/corner_a.jpg (path in URL via rewrites)
 * Serves files from custom-frame-sizes/assets_to_use (shared_assets + store-a_assets).
 */

const ASSETS_TO_USE = "assets_to_use";
const SHARED = "shared_assets";
const STORE_A = "store-a_assets";

const STORE_A_PREFIXES = ["frames", "assets"];

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain",
  ".html": "text/html",
};

function getAssetsRoot(): string {
  const fromEnv = process.env.LOCAL_ASSETS_ROOT;
  if (fromEnv) return path.resolve(fromEnv);
  const cwd = process.cwd();
  const fromRoot = path.join(cwd, ASSETS_TO_USE);
  if (fs.existsSync(fromRoot)) return fromRoot;
  return path.resolve(cwd, "../../", ASSETS_TO_USE);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const pathSegments = (await params).path;
  if (!pathSegments || pathSegments.length === 0) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const cleanPath = pathSegments.join("/").replace(/\\/g, "/");
  if (cleanPath.includes("..") || path.isAbsolute(cleanPath)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const root = getAssetsRoot();
  const firstSegment = pathSegments[0] ?? "";
  const isStoreA = STORE_A_PREFIXES.includes(firstSegment);
  const baseDir = isStoreA ? STORE_A : SHARED;
  const filePath = path.join(root, baseDir, ...pathSegments);

  const basePath = path.join(root, baseDir);
  const resolvedFilePath = path.resolve(filePath);
  const resolvedBase = path.resolve(basePath);
  if (!resolvedFilePath.startsWith(resolvedBase)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  let resolvedPath = resolvedFilePath;
  try {
    const stat = fs.statSync(resolvedPath);
    if (!stat.isFile()) {
      return NextResponse.json({ error: "Not a file" }, { status: 404 });
    }
  } catch {
    // Fallback: some frame files use hyphen (corner-a) but frames.json uses underscore (corner_a)
    if (firstSegment === "frames" && pathSegments.length >= 2) {
      const fileName = pathSegments[pathSegments.length - 1] ?? "";
      const altName = fileName
        .replace(/_corner_a\./i, "_corner-a.")
        .replace(/_corner_b\./i, "_corner-b.")
        .replace(/_corner_c\./i, "_corner-c.");
      if (altName !== fileName) {
        const fallbackPath = path.join(root, baseDir, ...pathSegments.slice(0, -1), altName);
        const resolvedFallback = path.resolve(fallbackPath);
        if (resolvedFallback.startsWith(resolvedBase)) {
          try {
            const stat = fs.statSync(resolvedFallback);
            if (stat.isFile()) resolvedPath = resolvedFallback;
          } catch {
            /* ignore */
          }
        }
      }
    }
    if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";

  const stream = fs.createReadStream(resolvedPath);
  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
