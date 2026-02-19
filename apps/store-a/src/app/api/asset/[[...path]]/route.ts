import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

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
    // Fallback: Cloudflare/store may use underscore (10727_corner_a.jpg) while we request hyphen (10727_corner-a.jpg), or vice versa. Try both.
    if (firstSegment === "frames" && pathSegments.length >= 2) {
      const fileName = pathSegments[pathSegments.length - 1] ?? "";
      const dir = path.join(root, baseDir, ...pathSegments.slice(0, -1));
      const tryFile = (name: string): string | null => {
        const candidate = path.join(dir, name);
        const resolved = path.resolve(candidate);
        if (!resolved.startsWith(resolvedBase)) return null;
        try {
          return fs.statSync(resolved).isFile() ? resolved : null;
        } catch {
          return null;
        }
      };
      // Underscore → hyphen (e.g. 10727_corner_a.jpg → 10727_corner-a.jpg)
      const toHyphen = fileName
        .replace(/_corner_a\./i, "_corner-a.")
        .replace(/_corner_b\./i, "_corner-b.")
        .replace(/_corner_c\./i, "_corner-c.")
        .replace(/_profile_a\./i, "_profile-a.")
        .replace(/_profile_b\./i, "_profile-b.")
        .replace(/_profile_c\./i, "_profile-c.");
      // Hyphen → underscore (e.g. 10727_corner-a.jpg → 10727_corner_a.jpg) — Cloudflare often has underscores
      const toUnderscore = fileName
        .replace(/_corner-a\./i, "_corner_a.")
        .replace(/_corner-b\./i, "_corner_b.")
        .replace(/_corner-c\./i, "_corner_c.")
        .replace(/_profile-a\./i, "_profile_a.")
        .replace(/_profile-b\./i, "_profile_b.")
        .replace(/_profile-c\./i, "_profile_c.");
      // Profile in Cloudflare may be 10727-pro-a.jpg (hyphen after SKU); try that when 10727_pro-a.jpg requested
      const toProHyphen = fileName.replace(/^(\d+)_pro-/, "$1-pro-");
      const attempted = [toHyphen, toUnderscore, toProHyphen].filter((n) => n !== fileName);
      for (const altName of attempted) {
        const found = tryFile(altName);
        if (found) {
          resolvedPath = found;
          break;
        }
      }
    }
    if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";

  const nodeStream = fs.createReadStream(resolvedPath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
  return new NextResponse(webStream, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
