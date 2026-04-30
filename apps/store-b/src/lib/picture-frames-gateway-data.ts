import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";

import { env } from "./env";
import type {
  LoadedPictureFramesGateway,
  PictureFramesGatewayItem,
  PictureFramesGatewayKind,
} from "./picture-frames-gateway.types";
import { pictureFramesGatewayHeroSrc } from "./picture-frames-gateway.urls";

const siteOrigin = (
  env.siteOrigin ?? `https://${env.shopify.storeDomain ?? "www.shadowboxframes.com"}`
).replace(/\/$/, "");

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
}

export function loadPictureFramesGateway(kind: PictureFramesGatewayKind): LoadedPictureFramesGateway {
  const dir = path.join(process.cwd(), "content/frames");
  switch (kind) {
    case "colors": {
      const raw = readJson(path.join(dir, "colors.json")) as { colors?: unknown };
      const items = sanitizeItems(raw.colors);
      return {
        items,
        title: "Frame Colors",
        description: "Find the perfect color to complement your artwork and décor",
      };
    }
    case "sizes": {
      const raw = readJson(path.join(dir, "sizes.json")) as { sizes?: unknown };
      const items = sanitizeItems(raw.sizes);
      return {
        items,
        title: "Frame Sizes",
        description: "From small desk frames to oversized statement pieces",
      };
    }
    case "styles": {
      const raw = readJson(path.join(dir, "styles.json")) as { styles?: unknown };
      const items = sanitizeItems(raw.styles);
      return {
        items,
        title: "Frame Styles",
        description: "Explore our collection of 24+ frame styles, from classic to contemporary",
      };
    }
  }
}

function sanitizeItems(bundle: unknown): PictureFramesGatewayItem[] {
  if (!Array.isArray(bundle)) return [];
  return bundle.filter(isGatewayItemLike);
}

function isGatewayItemLike(row: unknown): row is PictureFramesGatewayItem {
  if (!row || typeof row !== "object") return false;
  const o = row as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.slug === "string" &&
    typeof o.description === "string"
  );
}

export function findPictureFramesGatewayItem(
  kind: PictureFramesGatewayKind,
  slug: string,
): PictureFramesGatewayItem | undefined {
  return loadPictureFramesGateway(kind).items.find((item) => item.slug === slug);
}

function pageTitle(full: string): string {
  return full.includes("ShadowboxFrames") ? full : `${full} | ShadowboxFrames.com`;
}

export function buildGatewayIndexMetadata(kind: PictureFramesGatewayKind): Metadata {
  const data = loadPictureFramesGateway(kind);
  const head = `${data.title} - Custom Frames`;
  const title = pageTitle(head);
  const canonicalPath = `/frames/${kind}`;
  const canonical = `${siteOrigin}${canonicalPath}`;

  return {
    title,
    description: data.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description: data.description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: data.description,
    },
  };
}

export function buildGatewayDetailMetadata(
  kind: PictureFramesGatewayKind,
  item: PictureFramesGatewayItem,
): Metadata {
  const typeLabel = kind.charAt(0).toUpperCase() + kind.slice(1);
  const head = `${item.name} - ${typeLabel}`;
  const title = pageTitle(head);
  const canonical = `${siteOrigin}/frames/${kind}/${item.slug}`;
  const ogHero = pictureFramesGatewayHeroSrc(item);
  const images = ogHero ? [ogHero] : [];

  return {
    title,
    description: item.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: head,
      description: item.description,
      ...(images.length ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: head,
      description: item.description,
      ...(images.length ? { images } : {}),
    },
  };
}
