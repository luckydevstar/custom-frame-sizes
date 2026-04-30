import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  RESOURCE_ARTICLE_LOADERS,
  RESOURCE_ARTICLE_SLUGS,
  type ResourceArticleSlug,
} from "@/lib/resource-article-loaders";
import { RESOURCE_ARTICLE_METADATA } from "@/lib/resources-metadata";

type PageProps = { params: { slug: string } };

function isResourceArticleSlug(slug: string): slug is ResourceArticleSlug {
  return Object.prototype.hasOwnProperty.call(RESOURCE_ARTICLE_LOADERS, slug);
}

export function generateStaticParams(): Array<{ slug: ResourceArticleSlug }> {
  return RESOURCE_ARTICLE_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isResourceArticleSlug(params.slug)) {
    return {};
  }

  return RESOURCE_ARTICLE_METADATA[params.slug];
}

export default async function ResourceArticlePage({ params }: PageProps) {
  if (!isResourceArticleSlug(params.slug)) {
    notFound();
  }

  const load = RESOURCE_ARTICLE_LOADERS[params.slug];
  const { default: ArticleContent } = await load();
  return <ArticleContent />;
}
