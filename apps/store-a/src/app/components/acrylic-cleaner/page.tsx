import type { Metadata } from "next";
import { AcrylicCleanerClient } from "./AcrylicCleanerClient";

export const metadata: Metadata = {
  title: "Acrylic Cleaner & Polish – Safe for Frame Glazing | Custom Frame Sizes",
  description:
    "Professional acrylic cleaner for picture frame glazing. Anti-static, streak-free formula safe for framer's grade acrylic. Resists fingerprints and dust. 8oz bottle – $9.95.",
  openGraph: {
    title: "Acrylic Cleaner & Polish – Safe for Frame Glazing",
    description:
      "Professional acrylic cleaner for picture frame glazing. Anti-static, streak-free formula. 8oz bottle – $9.95.",
    type: "website",
  },
};

export default function AcrylicCleanerPage() {
  return <AcrylicCleanerClient />;
}
