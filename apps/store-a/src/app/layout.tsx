import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { initializeStoreConfig, getStoreConfig } from "@/lib/config";

// Initialize store configuration
initializeStoreConfig();

const inter = Inter({ subsets: ["latin"] });

// Get SEO metadata from brand config
const storeConfig = getStoreConfig();
const seoConfig = storeConfig?.seo || {
  title: "Store A - Custom Picture Frames",
  description: "Custom picture frames and framing services",
};

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
