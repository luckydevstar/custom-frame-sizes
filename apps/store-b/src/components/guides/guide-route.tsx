import { notFound } from "next/navigation";

import { getPageContent } from "@/lib/get-page-content";

import { GuidePageContent } from "./guide-page-content";

export function GuideRoute({ slug }: { slug: string }) {
  const page = getPageContent(slug);
  if (!page) {
    notFound();
  }

  return (
    <GuidePageContent
      title={page.title}
      description={page.description}
      hero={page.hero}
      markdown={page.content}
    />
  );
}
