"use client";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { useEffect } from "react";

import { faqJsonLdSchema } from "./faq-schema";

const markdownComponents: Components = {
  a: ({ ...props }) => <a {...props} className="text-primary hover:underline" />,
  h1: ({ ...props }) => <h2 {...props} className="scroll-mt-20" />,
  h2: ({ ...props }) => <h2 {...props} className="scroll-mt-20" />,
  h3: ({ ...props }) => <h3 {...props} className="scroll-mt-20" />,
};

/** origina-store-b/client/src/pages/GenericPage.tsx export function FAQPage — markdown + layout */
export function FaqPageContent({ title, markdown }: { title: string; markdown: string }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLdSchema) }}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
