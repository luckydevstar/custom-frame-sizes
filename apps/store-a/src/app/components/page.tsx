import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@framecraft/ui";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

import { generateMetadata, getCanonicalUrl } from "@/lib/seo";

const accessoryLinks = [
  {
    href: "/components/acrylic",
    title: "Custom-cut acrylic",
    description:
      "Regular and non-glare acrylic sheets cut to your exact size for glazing and DIY projects.",
  },
  {
    href: "/components/foam-board",
    title: "Foam board",
    description: "Rigid backing and mounting boards for framing and displays.",
  },
  {
    href: "/components/security-hardware-kit",
    title: "Security hardware kit",
    description: "Tamper-resistant hanging hardware for high-traffic or public installations.",
  },
  {
    href: "/components/cleat-hangers",
    title: "Cleat hangers",
    description: "French cleat and similar systems for heavy or wide frames.",
  },
  {
    href: "/components/brass-nameplates",
    title: "Brass nameplates",
    description: "Laser-engraved brass, silver, and black nameplates for diplomas and awards.",
  },
  {
    href: "/components/acrylic-cleaner",
    title: "Acrylic cleaner",
    description: "NOVUS and other care products safe for framer-grade acrylic.",
  },
] as const;

export const metadata: Metadata = generateMetadata({
  title: "Framing Components & Accessories | CustomFrameSizes.com",
  description:
    "Shop professional framing supplies: custom acrylic, foam board, security hardware, cleat hangers, brass nameplates, and acrylic-safe cleaners.",
  canonical: getCanonicalUrl("/components"),
  ogTitle: "Framing components & accessories",
  ogDescription:
    "Acrylic glazing, backing, hardware, nameplates, and cleaners—everything beyond the frame itself.",
});

export default function ComponentsHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Package className="h-5 w-5" />
          <span className="text-sm font-medium">Shop</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Framing components & accessories</h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
          Professional-grade supplies that pair with our custom frames: glazing, backing, hardware,
          nameplates, and care products. Each product has its own page with sizes, pricing, and
          details.
        </p>

        <ul className="grid gap-4 sm:grid-cols-2">
          {accessoryLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block h-full group">
                <Card className="h-full transition-colors hover:border-primary/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm font-medium text-primary">View product →</span>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-muted-foreground">
          Need a full custom frame? Start with the{" "}
          <Link href="/designer" className="text-primary underline hover:no-underline">
            picture frame designer
          </Link>{" "}
          or browse{" "}
          <Link href="/picture-frames" className="text-primary underline hover:no-underline">
            picture frames
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
