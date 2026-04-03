import { Button } from "@framecraft/ui";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "We couldn't find that page on CustomFrameSizes.com. Check the URL or return to the home page to design custom frames.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Page not found",
    description:
      "We couldn't find that page. Return to CustomFrameSizes.com to browse custom picture frames and designers.",
    type: "website",
    siteName: "CustomFrameSizes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Page not found",
    description: "We couldn't find that page on CustomFrameSizes.com.",
  },
};

export default function NotFound() {
  return (
    <div className="container mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <FileQuestion className="mb-6 h-16 w-16 text-muted-foreground" aria-hidden />
      <h1 className="mb-3 font-serif text-3xl font-bold text-foreground">Page not found</h1>
      <p className="mb-8 text-muted-foreground">
        We couldn&apos;t find that page. It may have been moved, or the link may be out of date.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/picture-frames">Shop picture frames</Link>
        </Button>
      </div>
    </div>
  );
}
