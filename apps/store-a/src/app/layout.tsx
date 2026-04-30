import "./globals.css";
import { StoreProvider } from "@framecraft/core";
import { buildPreconnectLinks } from "@framecraft/seo";
import { TooltipProvider } from "@framecraft/ui";
import { Header, Footer } from "@framecraft/ui/components/layout";
import { Toaster } from "@framecraft/ui/components/ui/toaster";
import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import Script from "next/script";

import { brandConfig } from "../brand.config";
import { QueryProvider } from "../components/providers/query-provider";
import { ThemeScript } from "../components/providers/theme-script";

import { CartHydration } from "./components/CartHydration";

import type { Metadata } from "next";

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

// Resolve a single absolute base URL for `metadata` so Next can derive absolute
// og/twitter image URLs from per-page relative `og-image` files.
const METADATA_BASE = new URL(
  seoConfig.canonicalUrl ?? `https://${brandConfig.domain}`,
);

export const metadata: Metadata = {
  metadataBase: METADATA_BASE,
  title: seoConfig.title,
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
  },
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
};

// GTM container is sourced from the brand config first; the env var is a deploy-time
// override, and the legacy literal is a last-ditch fallback so existing dev envs keep working.
const GTM_CONTAINER_ID =
  brandConfig.metadata?.gtmId ?? process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-WNC3937K";

// Preconnect hosts for LCP improvement (shared defaults + store-a-specific R2/CDN).
const PRECONNECT_TARGETS = buildPreconnectLinks([
  { href: "https://cdn.shopify.com" },
  { href: "https://customframesizes.r2.dev", crossOrigin: true },
]);

// HTML lang is derived from brand metadata (BCP-47 `xx_YY` → `xx-YY`).
const HTML_LANG = (brandConfig.metadata?.locale ?? "en_US").replace("_", "-");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG} className={playfair.variable} suppressHydrationWarning>
      <head>
        {PRECONNECT_TARGETS.map((target) => (
          <link
            key={target.href}
            rel="preconnect"
            href={target.href}
            {...(target.crossOrigin ? { crossOrigin: "anonymous" } : {})}
          />
        ))}
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
        </Script>
        <ThemeScript />
      </head>
      <body className={`${inter.className} ${montserrat.variable}`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
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
