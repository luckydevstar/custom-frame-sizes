import "./globals.css";
import { StoreProvider } from "@framecraft/core";
import { buildPreconnectLinks } from "@framecraft/seo";
import { TooltipProvider } from "@framecraft/ui";
import { Footer } from "@framecraft/ui/components/layout";
import { Toaster } from "@framecraft/ui/components/ui/toaster";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";

import { brandConfig } from "../brand.config";
import { shadowboxFooterLinks } from "../config/shadowbox-footer-links";
import { StoreBHeader } from "../components/layout/store-b-header";
import { QueryProvider } from "../components/providers/query-provider";
import { ThemeScript } from "../components/providers/theme-script";

import type { Metadata } from "next";

// Body font - Outfit (modern sans-serif)
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

// Heading font - Cormorant Garamond (elegant serif)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  variable: "--font-serif",
});

// Get SEO metadata from brand config
const seoConfig = brandConfig.seo;

// Single absolute base URL for `metadata` so Next can derive absolute og/twitter
// image URLs from per-page relative og-image files.
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

// Brand config is the source of truth; env var is deploy-time override; literal is fallback.
const GTM_CONTAINER_ID = brandConfig.metadata?.gtmId ?? process.env.NEXT_PUBLIC_GTM_ID;

// Preconnect targets for LCP — shared defaults + store-b R2/CDN.
const PRECONNECT_TARGETS = buildPreconnectLinks([
  { href: "https://assets.shadowboxframes.com", crossOrigin: true },
  { href: "https://shared-assets.customframesizes.com", crossOrigin: true },
]);

const HTML_LANG = (brandConfig.metadata?.locale ?? "en_US").replace("_", "-");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG} className={cormorant.variable} suppressHydrationWarning>
      <head>
        {PRECONNECT_TARGETS.map((target) => (
          <link
            key={target.href}
            rel="preconnect"
            href={target.href}
            {...(target.crossOrigin ? { crossOrigin: "anonymous" } : {})}
          />
        ))}
        {GTM_CONTAINER_ID ? (
          <Script id="google-tag-manager" strategy="beforeInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
          </Script>
        ) : null}
        <ThemeScript />
      </head>
      <body className={outfit.className}>
        {GTM_CONTAINER_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}
        <QueryProvider>
          <StoreProvider config={brandConfig}>
            <TooltipProvider>
              <div className="flex min-h-screen flex-col">
                <a href="#main-content" className="sr-only sr-only:focus">
                  Skip to main content
                </a>
                <StoreBHeader />
                <main id="main-content" className="flex-1">
                  {children}
                </main>
                <Footer
                  links={shadowboxFooterLinks}
                  newsletterDescription="Get shadowbox framing tips and exclusive offers"
                />
                <Toaster />
              </div>
            </TooltipProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
