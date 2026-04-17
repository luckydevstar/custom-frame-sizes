import { generatePageMetadata } from "@/lib/seo-utils";

import { AcrylicCleanerClient } from "./AcrylicCleanerClient";

import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata("/components/acrylic-cleaner", {
  title: "Acrylic Cleaner & Polish – Safe for Frame Glazing | Custom Frame Sizes",
  description:
    "Professional acrylic cleaner for picture frame glazing. Anti-static, streak-free formula safe for framer's grade acrylic. Resists fingerprints and dust. 8oz bottle – $9.95.",
});

export default function AcrylicCleanerPage() {
  return <AcrylicCleanerClient />;
}
