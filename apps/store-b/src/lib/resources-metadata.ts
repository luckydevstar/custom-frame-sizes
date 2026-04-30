import type { Metadata } from "next";

import { brandConfig } from "../brand.config";

import type { ResourceArticleSlug } from "./resource-article-loaders";
import { env } from "./env";

/** Public origin; mirrors `brand.config` seo base. */
export const resourceSiteOrigin = (
  env.siteOrigin ?? `https://${env.shopify.storeDomain ?? "www.shadowboxframes.com"}`
).replace(/\/$/, "");

function absAsset(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return `${resourceSiteOrigin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

const defaultOgAbsolute = brandConfig.seo.ogImage;

function toKeywords(csv: string): string[] {
  return csv
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);
}

function resourceArticle(fields: {
  path: `/resources/${string}`;
  title: string;
  description: string;
  keywords?: string;
  /** Absolute OG / Twitter image */
  ogImage?: string;
  openGraphTitle?: string;
}): Metadata {
  const canonical = `${resourceSiteOrigin}${fields.path}`;
  const resolvedImage = fields.ogImage ?? defaultOgAbsolute;
  const ogTitle = fields.openGraphTitle ?? fields.title;
  const ogImages = resolvedImage ? [resolvedImage] : [];

  return {
    title: fields.title,
    description: fields.description,
    ...(fields.keywords ? { keywords: toKeywords(fields.keywords) } : {}),
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: ogTitle,
      description: fields.description,
      ...(ogImages.length ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: fields.description,
      ...(ogImages.length ? { images: ogImages } : {}),
    },
  };
}

export const resourcesHubMetadata: Metadata = {
  title: "Picture Framing Resources & Guides | ShadowboxFrames.com",
  description:
    "Professional picture framing resources, guides, and tutorials. Learn conservation standards, mat color selection, multi-opening layouts, mounting techniques, and specialized framing applications from industry experts.",
  keywords: toKeywords(
    "picture framing guides, mat board tutorials, conservation framing, custom framing resources, professional framing techniques, mat cutting guides, picture framing education",
  ),
  alternates: {
    canonical: `${resourceSiteOrigin}/resources`,
  },
  openGraph: {
    type: "website",
    url: `${resourceSiteOrigin}/resources`,
    title: "Picture Framing Resources & Guides | ShadowboxFrames.com",
    description:
      "Professional picture framing resources, guides, and tutorials. Learn conservation standards, mat color selection, multi-opening layouts, mounting techniques, and specialized framing applications from industry experts.",
    images: [absAsset("/og-resources.jpg")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Picture Framing Resources & Guides | ShadowboxFrames.com",
    description:
      "Professional picture framing resources, guides, and tutorials. Learn conservation standards, mat color selection, multi-opening layouts, mounting techniques, and specialized framing applications from industry experts.",
    images: [absAsset("/og-resources.jpg")],
  },
};

export const RESOURCE_ARTICLE_METADATA = {
  "baby-first-year-frames": resourceArticle({
    path: "/resources/baby-first-year-frames",
    title: "Baby's First Year Memory Frame Ideas - Monthly Milestone Displays | ShadowboxFrames",
    description:
      "Professional guide to framing baby's first year photos. Learn monthly milestone layouts, birth announcement displays, growth chart integration, twin configurations, archival preservation, and creative gift ideas for new parents and grandparents.",
    keywords:
      "baby first year frame, monthly milestone photos, baby memory frame, newborn photo display, first year collage, baby photo gifts, monthly baby pictures, growth chart frame, twin baby frames",
    ogImage: absAsset("/og-baby-frames.jpg"),
    openGraphTitle:
      "Baby's First Year Memory Frame Ideas - Monthly Milestone Displays | ShadowboxFrames",
  }),
  "border-width-proportions": resourceArticle({
    path: "/resources/border-width-proportions",
    title: "Mat Border Width & Proportions Guide - Professional Framing Formulas | ShadowboxFrames.com",
    description:
      "Master mat border width calculations with professional proportion formulas. Learn rule of thirds, weighted bottom borders, proportional scaling for different artwork sizes, and border width examples for 8x10, 11x14, 16x20, 24x36 artwork.",
    keywords:
      "mat border width, border proportions, rule of thirds, weighted bottom border, mat sizing formula, border calculations, picture frame proportions, mat border examples, professional matting standards",
    ogImage: absAsset("/og-border-proportions.jpg"),
  }),
  "common-mat-cutting-mistakes": resourceArticle({
    path: "/resources/common-mat-cutting-mistakes",
    title:
      "Common Mat Cutting Mistakes - Professional Framing Error Prevention | ShadowboxFrames",
    description:
      "Avoid costly mat cutting mistakes with professional error prevention techniques. Learn proper overlap calculations, spacing requirements, grain direction, bevel angles, border proportions, and quality control for perfect mat cutting every time.",
    keywords:
      "mat cutting mistakes, mat cutting errors, mat board overlap, mat opening size, multi-opening spacing, mat grain direction, bevel angle, border proportions, mat cutting quality control, framing errors",
    ogImage: absAsset("/og-mat-cutting-mistakes.jpg"),
  }),
  "conservation-framing-standards": resourceArticle({
    path: "/resources/conservation-framing-standards",
    title:
      "Conservation Framing Standards Guide - Archival Picture Framing | ShadowboxFrames.com",
    description:
      "Complete guide to conservation framing standards, archival materials, and professional-grade preservation. Learn archival construction, lignin-free materials, PAT testing, pH buffering, and professional archival framing techniques for artwork protection.",
    keywords:
      "conservation framing, archival framing, professional framing, archival mat board, lignin-free materials, PAT testing, pH buffering, archival preservation, professional framing standards, conservation materials",
    ogImage: absAsset("/og-conservation-framing.jpg"),
  }),
  "how-to-measure-artwork-for-framing": resourceArticle({
    path: "/resources/how-to-measure-artwork-for-framing",
    title:
      "How to Measure Artwork for Custom Framing - Complete Measurement Guide | ShadowboxFrames",
    description:
      "Complete step-by-step guide to measuring artwork for custom picture framing. Learn professional measurement techniques for prints, canvas, textiles, mat border calculations, and frame dimension formulas with specific examples.",
    keywords:
      "how to measure for picture frame, measure artwork for framing, custom frame measurements, mat border width, frame size calculator, picture frame dimensions, artwork measurement guide",
    ogImage: defaultOgAbsolute,
    openGraphTitle:
      "How to Measure Artwork for Custom Framing - Complete Measurement Guide",
  }),
  "mat-board-vs-mounting-board": resourceArticle({
    path: "/resources/mat-board-vs-mounting-board",
    title:
      "Mat Board vs Mounting Board - Material Differences Explained | ShadowboxFrames",
    description:
      "Understand the critical differences between mat board and mounting board in picture framing. Learn construction materials, thickness comparisons, proper applications, when to use each type, and how they work together in professional framing.",
    keywords:
      "mat board, mounting board, foam board, backing board, mat vs mounting, frame backing, matting materials, mounting materials, picture frame construction, framing materials",
    ogImage: absAsset("/og-mat-vs-mounting.jpg"),
  }),
  "mat-color-selection-guide": resourceArticle({
    path: "/resources/mat-color-selection-guide",
    title:
      "Mat Board Color Selection Guide - Professional Framing Color Theory | ShadowboxFrames.com",
    description:
      "Master mat board color selection with professional color theory for picture framing. Learn neutral whites, dark mats, complementary strategies, double mat combinations, undertones, and avoid common color selection mistakes.",
    keywords:
      "mat board colors, mat color selection, picture frame matting colors, white mat board, black mat board, double mat colors, color theory framing, mat undertones, frame color matching",
    ogImage: absAsset("/og-mat-colors.jpg"),
  }),
  "multi-opening-layout-engineering": resourceArticle({
    path: "/resources/multi-opening-layout-engineering",
    title:
      "Multi-Opening Mat Layout Engineering - Collage Frame Design Principles | ShadowboxFrames.com",
    description:
      "Master multi-opening mat layout design with professional engineering principles. Learn grid layouts, hierarchical compositions, visual weight distribution, rule of thirds, symmetry, negative space, and structural spacing for collage frames.",
    keywords:
      "multi-opening layout, collage frame design, multi-aperture mat, multi-photo layout, grid layout framing, hierarchical composition, visual weight balance, rule of thirds framing, mat spacing requirements",
    ogImage: absAsset("/og-multi-opening-layout.jpg"),
  }),
  "poster-frame-sizes-guide": resourceArticle({
    path: "/resources/poster-frame-sizes-guide",
    title:
      "Poster Frame Sizes Guide - Movie & Concert Poster Framing | ShadowboxFrames",
    description:
      "Complete guide to poster framing including movie one-sheets (27×40), concert posters (18×24), and commercial prints. Learn standard dimensions, UV protection requirements, preservation techniques, and custom sizing for vintage posters.",
    keywords:
      "poster frame sizes, movie poster dimensions, concert poster framing, 24x36 poster frame, 27x40 frame, one-sheet poster, vintage poster framing, UV protective glass, poster preservation",
    ogImage: absAsset("/og-poster-framing.jpg"),
  }),
  "professional-mounting-techniques": resourceArticle({
    path: "/resources/professional-mounting-techniques",
    title:
      "Professional Mounting Techniques for Picture Framing | ShadowboxFrames.com",
    description:
      "Master professional artwork mounting techniques including hinge mounting with wheat starch paste, photo corners, float mounting, and reversible conservation methods. Complete guide to T-hinges, V-hinges, and archival mounting standards.",
    keywords:
      "hinge mounting, photo corners, wheat starch paste, conservation mounting, reversible mounting, T-hinge, V-hinge, float mounting, archival mounting techniques, artwork mounting",
    ogImage: absAsset("/og-mounting-techniques.jpg"),
  }),
  "school-picture-frames": resourceArticle({
    path: "/resources/school-picture-frames",
    title:
      "School Picture Frame Layout Guide - K-12 Photo Display Ideas | ShadowboxFrames",
    description:
      "Complete guide to framing school pictures from kindergarten through 12th grade. Learn yearly timeline layouts, graduation photo displays, mat color recommendations, creative layout variations, and archival preservation for K-12 photography collections.",
    keywords:
      "school picture frames, K-12 photo display, graduation photo frame, school pictures layout, yearly timeline frame, school photo collage, picture day frames, elementary school photos, high school graduation",
    ogImage: absAsset("/og-school-pictures.jpg"),
    openGraphTitle:
      "School Picture Frame Layout Guide - K-12 Photo Display Ideas | ShadowboxFrames",
  }),
  "standard-vs-custom-frame-sizes": resourceArticle({
    path: "/resources/standard-vs-custom-frame-sizes",
    title:
      "Standard vs. ShadowboxFrames - Complete Reference Guide | ShadowboxFrames",
    description:
      "Complete reference guide comparing standard picture frame sizes with custom framing options. Includes comprehensive size charts, ISO A-series standards, professional use cases, and manufacturing capabilities from 4×4 to 48×72 inches.",
    keywords:
      "standard picture frame sizes, custom frame sizes, frame size chart, ISO A-series, poster frame dimensions, photo frame sizes, picture frame dimensions, custom framing guide",
    ogImage: absAsset("/og-frame-sizes.jpg"),
  }),
  "sports-team-framing": resourceArticle({
    path: "/resources/sports-team-framing",
    title:
      "Sports Team Photography Framing Guide - Team Photo Display Ideas | ShadowboxFrames",
    description:
      "Complete guide to framing sports team photography. Learn team photo layouts with individual players, season highlights, championship displays, action shot collages, jersey number integration, and end-of-season gift ideas.",
    keywords:
      "sports team frames, team photo display, sports photography framing, team picture layout, championship frame, season highlights, sports collage, team photo gifts, jersey number frames",
    ogImage: absAsset("/og-sports-framing.jpg"),
    openGraphTitle:
      "Sports Team Photography Framing Guide - Team Photo Display Ideas | ShadowboxFrames",
  }),
} satisfies Record<ResourceArticleSlug, Metadata>;
