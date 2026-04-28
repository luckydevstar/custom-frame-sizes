import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShadowboxStandardFramePageContent } from "@/components/shadowbox/shadowbox-standard-frame-page-content";
import { ShadowboxUltraDeepFramePageContent } from "@/components/shadowbox/shadowbox-ultra-deep-frame-page-content";
import registryJson from "@/components/shadowbox/shadowbox-standard-registry.json";

import type { ShadowboxStandardPageCopy } from "@/components/shadowbox/shadowbox-standard-types";
import { getFrameSlug, getFrameStyles } from "@framecraft/core";

import { getShadowboxFrameIdBySlug } from "@/lib/shadowbox-slug";

const SITE = "https://www.shadowboxframes.com";

type StandardRegistry = Record<string, ShadowboxStandardPageCopy>;
const standardRegistry = registryJson as unknown as StandardRegistry;

/** Every catalog shadowbox frame slug for SSG parity with legacy routes. */
export function generateStaticParams() {
  return getFrameStyles()
    .filter((f) => f.category === "shadowbox")
    .map((f) => ({ slug: getFrameSlug(f.id) }));
}

export function generateMetadata(props: {
  params: { slug: string };
}): Metadata {
  const { slug } = props.params;
  const frameId = getShadowboxFrameIdBySlug(slug);
  if (!frameId) return {};

  if (frameId === "ultra-deep-matte-black") {
    return {
      title: 'Ultra Deep Black Shadowbox Frame | 3.5" Depth | ShadowboxFrames.com',
      description:
        "Our deepest shadowbox frame, 3.5 inches of usable depth in matte black. Nearly twice as deep as standard deep shadowboxes. Frame helmets, thick memorabilia, sculptures, and oversized keepsakes. Custom sizes with instant pricing.",
      alternates: { canonical: `${SITE}/shadowbox/${slug}` },
      keywords:
        "ultra deep shadowbox frame, 3.5 inch deep shadow box, extra deep black shadowbox, deep display case, helmet shadowbox frame, thick memorabilia frame, oversized keepsake frame, sculpture display frame, custom deep shadowbox, matte black deep frame",
    };
  }
  if (frameId === "ultra-deep-bright-white") {
    return {
      title: 'Ultra Deep White Shadowbox Frame | 3.5" Depth | ShadowboxFrames.com',
      description:
        "Our deepest shadowbox frame, 3.5 inches of usable depth in bright white. Nearly twice as deep as standard deep shadowboxes. Frame helmets, thick memorabilia, sculptures, and oversized keepsakes. Custom sizes with instant pricing.",
      alternates: { canonical: `${SITE}/shadowbox/${slug}` },
      keywords:
        "ultra deep shadowbox frame, 3.5 inch deep shadow box, extra deep white shadowbox, deep display case, helmet shadowbox frame, thick memorabilia frame, oversized keepsake frame, sculpture display frame, custom deep shadowbox, white deep frame",
    };
  }

  const copy = standardRegistry[frameId];
  if (!copy?.meta?.title) return {};

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: `${SITE}/shadowbox/${slug}`,
    },
    openGraph: {
      url: `${SITE}/shadowbox/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default function ShadowboxSlugPage(props: { params: { slug: string } }) {
  const { slug } = props.params;
  const frameId = getShadowboxFrameIdBySlug(slug);
  if (!frameId) notFound();

  if (frameId === "ultra-deep-matte-black") {
    return <ShadowboxUltraDeepFramePageContent variant="black" />;
  }
  if (frameId === "ultra-deep-bright-white") {
    return <ShadowboxUltraDeepFramePageContent variant="white" />;
  }

  const copy = standardRegistry[frameId];
  if (!copy) notFound();

  return <ShadowboxStandardFramePageContent frameId={frameId} />;
}
