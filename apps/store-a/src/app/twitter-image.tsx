import { ImageResponse } from "next/og";

import { brandConfig } from "../brand.config";

/**
 * Twitter card art reuses the same composition as the Open Graph card so both
 * platforms get a brand-driven preview without owning a static asset.
 *
 * Inlined (rather than re-exported from `opengraph-image.tsx`) because Next.js
 * needs the `runtime` declaration to be a literal string export per file.
 */

export const runtime = "edge";

export const alt = brandConfig.seo.title;

export const size = { width: 1200, height: 630 } as const;

export const contentType = "image/png";

export default function TwitterImage(): ImageResponse {
  const primary = brandConfig.theme?.brandColors?.primary ?? "#0F7CFF";
  const tagline = brandConfig.branding?.tagline ?? brandConfig.seo.title;
  const valueProp = brandConfig.branding?.valueProposition ?? brandConfig.seo.description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: `linear-gradient(135deg, ${primary} 0%, #ffffff 70%)`,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#ffffff",
            fontSize: "32px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          <span
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "999px",
              background: "#ffffff",
            }}
          />
          {brandConfig.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "880px" }}>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#0a0a0a",
              letterSpacing: "-0.025em",
            }}
          >
            {tagline}
          </div>
          <div style={{ fontSize: "28px", color: "rgba(10,10,10,0.7)", lineHeight: 1.35 }}>
            {valueProp}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            color: "rgba(10,10,10,0.6)",
            fontSize: "22px",
          }}
        >
          {(brandConfig.seo.canonicalUrl ?? `https://${brandConfig.domain}`).replace(
            /^https?:\/\//,
            "",
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
