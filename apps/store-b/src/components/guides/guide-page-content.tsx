"use client";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { useEffect } from "react";

const markdownComponents: Components = {
  a: ({ ...props }) => <a {...props} className="text-primary hover:underline" />,
  h1: ({ ...props }) => <h2 {...props} className="scroll-mt-20" />,
  h2: ({ ...props }) => <h2 {...props} className="scroll-mt-20" />,
  h3: ({ ...props }) => <h3 {...props} className="scroll-mt-20" />,
};

/** b-shadow-box-frames-original GenericPage.tsx — prose, optional hero <img>, markdown body; WebPage JSON-LD */
export function GuidePageContent({
  title,
  description,
  hero,
  markdown,
}: {
  title: string;
  description: string;
  hero?: string;
  markdown: string;
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {hero ? (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={hero}
              alt={title}
              className="w-full h-64 object-cover object-top"
              data-testid="img-hero"
            />
          </div>
        ) : null}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 data-testid="text-page-title">{title}</h1>
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </>
  );
}
