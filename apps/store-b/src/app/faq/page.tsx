import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import type { Metadata } from "next";

import { FaqPageContent } from "@/components/faq/faq-page-content";

/** origina-store-b FAQPage — <Seo /> title, description, canonicalUrl, keywords */
export const metadata: Metadata = {
  title: "Questions we hear most | Custom Frames",
  description:
    "Answers to common questions about custom shadow box frames: sizing, depth options, materials, shipping, and our satisfaction guarantee.",
  alternates: {
    canonical: "https://www.shadowboxframes.com/faq",
  },
  keywords:
    "custom frame FAQ, picture frame questions, custom framing help, frame ordering guide, mat board questions, frame shipping, frame warranty",
};

export default function FaqPage() {
  const fullPath = path.join(process.cwd(), "content/pages/faq.md");
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const title = typeof data.title === "string" ? data.title : "";

  return <FaqPageContent title={title} markdown={content} />;
}
