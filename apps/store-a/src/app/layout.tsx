import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@framecraft/core";
import { brandConfig } from "../brand.config";
import { QueryProvider } from "../components/providers/query-provider";
import { CartHydration } from "./components/CartHydration";
import { Header, Footer } from "@framecraft/ui/components/layout";
import { TooltipProvider } from "@framecraft/ui";
import { Toaster } from "@framecraft/ui/components/ui/toaster";

// Body font - loaded with key weights only
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

// Heading font - loaded with key weights only
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
  variable: "--font-playfair",
});

// Accent font - loaded with key weights only
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  variable: "--font-montserrat",
});

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
      <body className={`${inter.className} ${playfair.variable} ${montserrat.variable}`}>
        <QueryProvider>
          <StoreProvider config={brandConfig}>
            <CartHydration />
            <TooltipProvider>
              <div className="flex min-h-screen flex-col">
                <a href="#main-content" className="sr-only sr-only:focus">
                  Skip to main content
                </a>
                <Header />
                <main id="main-content" className="flex-1">
                  {children}
                </main>
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
