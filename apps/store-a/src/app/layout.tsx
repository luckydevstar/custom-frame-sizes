import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@framecraft/core";
import { brandConfig } from "../brand.config";

const inter = Inter({ subsets: ["latin"] });

// Get SEO metadata from brand config
const seoConfig = brandConfig.seo;

export const metadata: Metadata = {
  title: seoConfig.title,
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  openGraph: {
    title: seoConfig.title,
    description: seoConfig.description,
    images: seoConfig.ogImage ? [seoConfig.ogImage] : [],
    url: seoConfig.canonicalUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.title,
    description: seoConfig.description,
    images: seoConfig.twitterImage ? [seoConfig.twitterImage] : [],
  },
  alternates: {
    canonical: seoConfig.canonicalUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StoreProvider config={brandConfig}>{children}</StoreProvider>
      </body>
    </html>
  );
}
