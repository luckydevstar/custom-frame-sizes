# Migration Next Steps

**Purpose:** Ordered checklist for migrating remaining specialty frames pages, browse-by pages (color ✓, size, style), and canvas/shadowbox pages. Use with [PAGE_MIGRATION_PROCESS.md](./PAGE_MIGRATION_PROCESS.md) for each page.

---

## Current status (summary)

| Area                  | Status                                                                                                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Browse by color**   | ✅ Done – `frames/colors`, `frames/colors/[slug]`                                                                                                                                                                                                     |
| **Canvas**            | ✅ Done – `canvas-frames` (CanvasFrameDesigner, hero, features)                                                                                                                                                                                       |
| **Shadowbox main**    | ✅ Done – `shadowbox-frames` (ShadowboxDesigner), `shadowbox` → redirect                                                                                                                                                                              |
| **Specialty (full)**  | card-frames, cd-frames, certificate-frames, comic-book-frames, diploma-certificate-frames, jersey-frames, playbill-frames, magazine-frames, newspaper-frames, movie-poster-frames, puzzle-frames, specialty/needlework, specialty/record-album-frames |
| **Placeholder pages** | Listed below in Phase 1 and 2                                                                                                                                                                                                                         |

---

## Phase 1: Remaining specialty frames pages

Migrate from placeholder (ComingSoonPlaceholder) to full pages with designer, hero, SEO, and content. Original references: `CustomFrameSizes-CODE/client/src/pages/` and `specialty/`.

| Route                         | Original reference                      | Designer in @framecraft/ui           | Notes                                                        |
| ----------------------------- | --------------------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| `/picture-frames`             | `PictureFrames.tsx`                     | FrameDesigner                        | Main picture frame hub; links to designer and frame grid.    |
| `/signature-frames`           | `SignatureFrames.tsx`                   | (signature designer if exists)       | Check for SignatureFrameDesigner or reuse shadowbox/picture. |
| `/collage-frames`             | `specialty/CollageFrames.tsx`           | CollageFrameDesigner                 | Collage/school-days designer.                                |
| `/sonogram-frames`            | `specialty/SonogramFrames.tsx`          | SonogramFrameDesigner                | Sonogram designer.                                           |
| `/ticket-frames`              | `TicketFrames.tsx`                      | TicketFrameDesigner                  | Ticket insert designer.                                      |
| `/wedding-invitation-frames`  | `specialty/WeddingInvitationFrames.tsx` | WeddingInvitationDesigner or similar | Invitation designer.                                         |
| `/stamp-frames`               | `StampFrames.tsx`                       | StampFrameDesigner or placeholder    | May be simpler landing.                                      |
| `/military-frames`            | `MilitaryFrames.tsx`                    | MilitaryFrameDesigner or shadowbox   | Military memorabilia.                                        |
| `/hockey-puck-frame-designer` | `HockeyPuckFrames.tsx`                  | HockeyPuckDesigner if exists         | Niche designer.                                              |
| `/currency-frames`            | (if exists in original)                 | —                                    | Landing + CTA to designer.                                   |
| `/bouquet-frames`             | `BouquetFrames.tsx`                     | —                                    | Likely landing.                                              |

**Process per page:** Follow [PAGE_MIGRATION_PROCESS.md](./PAGE_MIGRATION_PROCESS.md): scan original → migrate to `apps/store-a/src/app/<route>/page.tsx` (and optional `*-content.tsx`) → metadata, dynamic designer import, scroll-to-designer, JSON-LD, `getSharedAssetUrl` for images.

---

## Phase 2: Browse-by pages (size, style)

### 2.1 Browse by style

- **Current:** `frames/styles` – ComingSoonPlaceholder.
- **Target:** Listing of styles (Modern, Rustic, Classic, Gallery, etc.) with card grid and links to style detail.
- **Data in core:** `@framecraft/core` – `STYLE_METADATA`, `getFramesForStyle`, `getStyleGatewayImage` (or equivalent) in `packages/core/src/lib/style-gateway-images.ts`.
- **Original:** `FramesByStyle.tsx`, `FramesByStyleDetail.tsx`.
- **Routes to add/update:**
  - `frames/styles/page.tsx` – list all styles with image, count, link to `frames/styles/[slug]`.
  - `frames/styles/[slug]/page.tsx` – single style page with frame grid and designer CTA (mirror pattern of `frames/colors/[slug]`).

### 2.2 Browse by size

- **Current:** `frames/sizes` – ComingSoonPlaceholder.
- **Target:** List common artwork sizes (e.g. 4×6, 5×7, 8×10, 11×14, 16×20, 18×24) with CTAs to designer or picture-frames with size pre-filled.
- **Original:** `FramesBySize.tsx`.
- **Data:** No dedicated size gateway in core; define a small list of common sizes and link to `/designer` or `/picture-frames` with query params (e.g. `?width=8&height=10`).
- **Routes:** `frames/sizes/page.tsx` only (or add `frames/sizes/[slug]` for each size if desired).

---

## Phase 3: Canvas & shadowbox pages

### 3.1 Canvas

- **Current:** `canvas-frames` is already a full page with CanvasFrameDesigner.
- **Optional:** Add canvas “by style” or “by size” listing pages if they exist in the original app; otherwise Phase 3 canvas is done.

### 3.2 Shadowbox

- **Current:** `shadowbox-frames` (main designer), `shadowbox` (redirect). No shadowbox-by-color hub yet.
- **Original:** `shadowboxes/ShadowboxColors.tsx`, `BlackShadowboxFrames.tsx`, `WhiteShadowboxFrames.tsx`, etc.
- **Data in core:** `packages/core/src/lib/shadowbox-color-images.ts` – `SHADOWBOX_COLOR_METADATA`, `getShadowboxColorHubImage`, `getShadowboxColorCounts`, `getShadowboxColorLifestyleImages`, etc.
- **Routes to add:**
  - `shadowbox-frames/colors/page.tsx` – list shadowbox colors (Black, White, Brown, etc.) with hub image and count, link to `shadowbox-frames/colors/[slug]`.
  - `shadowbox-frames/colors/[slug]/page.tsx` – shadowbox color detail page with frame grid, lifestyle images, FAQ, designer CTA (mirror `frames/colors/[slug]` pattern; use shadowbox-specific metadata and images).

---

## Suggested order of work

1. **Phase 1 (specialty)** – Pick high-traffic or high-priority specialty pages first (e.g. picture-frames, signature-frames, collage-frames, ticket-frames, sonogram-frames, military-frames, then wedding-invitation, stamp, hockey-puck, currency, bouquet).
2. **Phase 2 (browse-by)** – Implement `frames/styles` and `frames/styles/[slug]`, then `frames/sizes`.
3. **Phase 3 (shadowbox)** – Add `shadowbox-frames/colors` and `shadowbox-frames/colors/[slug]`.

---

## References

- **Page migration process:** [PAGE_MIGRATION_PROCESS.md](./PAGE_MIGRATION_PROCESS.md)
- **Asset paths / CDN:** [ASSET_PATHS_AND_CDN.md](./ASSET_PATHS_AND_CDN.md)
- **Original app pages:** `CustomFrameSizes-CODE/client/src/pages/` and `specialty/`
- **Core style gateway:** `packages/core/src/lib/style-gateway-images.ts`
- **Core shadowbox colors:** `packages/core/src/lib/shadowbox-color-images.ts`
- **Core color gateway (already used):** `packages/core/src/lib/color-gateway-images.ts` (frames/colors)
- **Existing browse-by-color example:** `apps/store-a/src/app/frames/colors/page.tsx`, `frames/colors/[slug]/page.tsx`
