/**
 * Store-A SEO utility shim.
 *
 * The original `seo-utils.ts` defined `generatePageMetadata(pathname, opts)` and
 * `getCanonicalUrl(pathname, domain?)`. This module now delegates to the shared
 * `@framecraft/seo` helpers bound to this app's `brandConfig`. The exported
 * signatures are preserved so existing page modules keep compiling unchanged.
 */

import {
  generatePageMetadata as sharedGeneratePageMetadata,
  type OpenGraphType,
} from "@framecraft/seo";

import { brandConfig } from "../brand.config";
import { seo } from "./seo";

import type { Metadata } from "next";

/**
 * Resolve a canonical URL for `pathname`. The optional `domain` argument exists
 * only for backward compatibility — for the active store, callers should rely
 * on the brand-derived origin.
 */
export function getCanonicalUrl(pathname: string, domain?: string): string {
  if (domain) {
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const normalized = path === "/" ? "/" : path.replace(/\/+$/, "");
    return `${domain.replace(/\/+$/, "")}${normalized}`;
  }
  return seo.canonical(pathname);
}

/**
 * Generate page metadata. The legacy `domain` option is accepted but ignored
 * unless explicitly different from the brand origin (in which case we still
 * route through `@framecraft/seo` so canonicals stay brand-derived).
 */
export function generatePageMetadata(
  pathname: string,
  options: {
    title: string;
    description: string;
    ogType?: OpenGraphType;
    keywords?: string[];
    /** @deprecated Set `seo.canonicalUrl` on the brand config instead. */
    domain?: string;
    ogImage?: string;
    twitterImage?: string;
    robots?: Metadata["robots"];
  },
): Metadata {
  return sharedGeneratePageMetadata(brandConfig, pathname, {
    title: options.title,
    description: options.description,
    ogType: options.ogType,
    keywords: options.keywords,
    ogImage: options.ogImage,
    twitterImage: options.twitterImage,
    robots: options.robots,
  });
}
