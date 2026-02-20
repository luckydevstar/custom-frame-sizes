import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@framecraft/core";
import { brandConfig } from "../brand.config";
import { QueryProvider } from "../components/providers/query-provider";
import { Header, Footer } from "@framecraft/ui/components/layout";
import { TooltipProvider } from "@framecraft/ui";
import { Toaster } from "@framecraft/ui/components/ui/toaster";

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
        <QueryProvider>
          <StoreProvider config={brandConfig}>
            <TooltipProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster />
              </div>
            </TooltipProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
