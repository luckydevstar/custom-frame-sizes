# Asset Paths and CDN Wiring

**Purpose:** Map which paths are used by which designer and frame class, and how the app and CDN buckets align. Use this when wiring store-a (or other stores) and when uploading to Cloudflare R2 / any CDN.

---

## 1. Do we need to update frames.json?

**No.** The paths in `packages/data/src/frames.json` stay as they are:

- **Frame images:** `thumbnail`, `dimensionalDiagram`, and `alternateImages[].url` use paths like `/frames/8446/corner_a.jpg`, `/frames/8446/profile_a.jpg`, `/frames/8446/lifestyle_1.jpg`, etc.
- The app turns these into CDN URLs at **runtime** via `getSharedAssetUrl(path)` (after stripping the leading `/`). So `frames.json` only stores **relative paths**; it does not need to know about folder structure or bucket names.
- As long as the **shared** CDN bucket (or local dev server) serves files under the path `frames/{SKU}/...`, no change to `frames.json` is required.

---

## 2. Path → designer / frame class (for app and CDN)

### 2.1 Shared bucket (NEXT_PUBLIC_CDN_SHARED_URL)

Served by `getSharedAssetUrl(path)`. Used for frames, mats, and all designer insert/lifestyle that is shared across stores.

| Path prefix                                                                                                                  | Source folder                             | Purpose                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **frames/**                                                                                                                  | store-a_assets/frames (or shared copy)    | Frame product images by SKU (corner, profile, top/bottom/left/right, lifestyle, dimensions). Same paths as in frames.json. |
| **mats/**                                                                                                                    | shared_assets/mats                        | Mat board textures/swatches.                                                                                               |
| **canvas/images/**                                                                                                           | shared_assets/canvas/images               | Canvas frame class product images (e.g. 10117-corner-a.jpg).                                                               |
| **canvas/lifestyle/**                                                                                                        | shared_assets/canvas/lifestyle            | Canvas lifestyle photos.                                                                                                   |
| **magazine/insert-images/**                                                                                                  | shared_assets/magazine/insert-images      | Magazine designer insert images.                                                                                           |
| **magazine/lifestyle/**                                                                                                      | shared_assets/magazine/lifestyle          | Magazine lifestyle.                                                                                                        |
| **comic/insert-images/**                                                                                                     | shared_assets/comic/insert-images         | Comic designer inserts (modern/, slabbed/).                                                                                |
| **comic/lifestyle/**                                                                                                         | shared_assets/comic/lifestyle             | Comic lifestyle.                                                                                                           |
| **playbill/insert-images/**, **playbill/lifestyle/**                                                                         | shared_assets/playbill                    | Playbill inserts + tickets, lifestyle.                                                                                     |
| **newspaper/insert-images/**, **newspaper/lifestyle/**                                                                       | shared_assets/newspaper                   | Newspaper designer.                                                                                                        |
| **collage/insert-images/**, **collage/lifestyle/**                                                                           | shared_assets/collage                     | Collage / school-days.                                                                                                     |
| **card-frames/insert-images/**, **card-frames/lifestyle/**                                                                   | shared_assets/card-frames                 | Card frames (graded, etc.).                                                                                                |
| **diploma/insert-images/**, **diploma/lifestyle/**                                                                           | shared_assets/diploma                     | Diploma / certificate.                                                                                                     |
| **cd/insert-images/**, **cd/lifestyle/**                                                                                     | shared_assets/cd                          | CD designer.                                                                                                               |
| **ticket-frames/insert-images/**                                                                                             | shared_assets/ticket-frames/insert-images | Ticket insert images (stock).                                                                                              |
| **invitation-frames/**, **needlework/**, **signature-frames/**, **record-album/**, **puzzle/**, **sonogram/**, **military/** | shared_assets/{designer}                  | Other designers (insert-images + lifestyle).                                                                               |
| **blog/**                                                                                                                    | shared_assets/blog                        | Blog images.                                                                                                               |
| **components/**                                                                                                              | shared_assets/components                  | Shared UI assets.                                                                                                          |
| **stock/photo_inserts/**, **stock/canvas_paintings/**                                                                        | shared_assets/stock                       | Picture-frame and canvas placeholder images (from attached_assets migration).                                              |

### 2.2 Store-a bucket (NEXT_PUBLIC_CDN_STORE_A_URL)

Served by `getStoreAssetUrl(path)`. Used for store-a–specific marketing and site assets.

| Path prefix                                                                            | Source folder                 | Purpose                                            |
| -------------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------- |
| **assets/brand/**                                                                      | store-a_assets/assets/brand   | Logos, wordmarks.                                  |
| **assets/hero/**                                                                       | store-a_assets/assets/hero    | Hero videos (e.g. .mp4).                           |
| **assets/home/**                                                                       | store-a_assets/assets/home    | Education, how-it-works, inspiration, value-props. |
| **assets/glazing/**                                                                    | store-a_assets/assets/glazing | Glazing option images.                             |
| **assets/frames/**                                                                     | store-a_assets/assets/frames  | Marketing frame style images.                      |
| **assets/og-image.jpg**, **assets/canvas-dims-\*.png**, **assets/plywood-texture.png** | store-a_assets/assets         | Root-level assets.                                 |

Canvas and ticket-inserts are **not** in store-a_assets; they live in shared_assets (see above).

### 2.3 Frame class (from xlsx) – reference only

Used for logic/configuration, not for path changes:

- **picture** → Frame images under `frames/{SKU}/` (same as today).
- **shadowbox-full**, **shadowbox-subset** → Same `frames/{SKU}/` layout.
- **canvas** → Product images in shared_assets/canvas/images; lifestyle in shared_assets/canvas/lifestyle.

---

## 3. How to populate the CDN buckets

1. **Shared bucket**
   - Upload contents of **shared_assets** so that folder names become path prefixes (e.g. `shared_assets/magazine` → `magazine/` at CDN root).
   - Also upload **store-a_assets/frames** so that `frames/` exists at the shared CDN root (same paths as in frames.json).
   - Result: one shared bucket with `frames/`, `mats/`, `canvas/`, `magazine/`, `comic/`, etc.

2. **Store-a bucket**
   - Upload **store-a_assets/assets** so that `assets/` is at the store-a CDN root (brand, hero, home, glazing, frames, etc.).
   - Do **not** upload store-a_assets/assets/canvas or assets/stock; those are in shared_assets.

3. **Environment variables (store-a app)**
   - `NEXT_PUBLIC_CDN_SHARED_URL` = base URL of the shared bucket (no trailing slash).
   - `NEXT_PUBLIC_CDN_STORE_A_URL` = base URL of the store-a bucket (no trailing slash).
   - See `.env.local.example` in apps/store-a.

---

## 4. Local development (assets_to_use)

Assets live under **custom-frame-sizes/assets_to_use**:

- **assets_to_use/shared_assets/** – designer insert/lifestyle, mats, canvas, blog, components, etc.
- **assets_to_use/store-a_assets/** – frames (by SKU) and marketing assets (assets/brand, hero, home, glazing, etc.).

When `NEXT_PUBLIC_CDN_SHARED_URL` and `NEXT_PUBLIC_CDN_STORE_A_URL` are **empty**:

- The app uses relative URLs (e.g. `/frames/8446/corner_a.jpg`, `/assets/hero/...`).
- Next.js **rewrites** send those requests to **GET /api/asset?path=...**, which streams files from `assets_to_use`.
- **Run from monorepo root** (custom-frame-sizes): `assets_to_use` is resolved as `process.cwd()/assets_to_use`.
- If you run only from **apps/store-a**, `assets_to_use` is resolved as `../../assets_to_use`.
- Override with **LOCAL_ASSETS_ROOT** in `.env.local` (full path to `assets_to_use`) if needed.

---

## 5. Migrating from attached_assets

If you have the legacy **assets/attached_assets** folder (e.g. `stock_images/`, `specialty/`), run:

```bash
node scripts/populate-from-attached-assets.mjs
```

This copies (without deleting) into **assets_to_use/shared_assets**:

- `stock_images/photo_inserts` → `stock/photo_inserts`
- `stock_images/canvas_paintings` → `stock/canvas_paintings`
- `stock_images/puzzle_inserts` → `puzzle/insert-images`
- `stock_images/sonogram_inserts` → `sonogram/insert-images`
- `specialty/ticket_frame_lifestyle` → `ticket-frames/lifestyle`
- `specialty/invitation_frame_lifestyle` → `invitation-frames/lifestyle`

If `assets/attached_assets` does not exist, the script does nothing. All app code now uses **shared_assets** paths (e.g. `card-frames/lifestyle/`, `playbill/lifestyle/`, `diploma/insert-images/`) via `getSharedAssetUrl()`; no code references `attached_assets` directly.

---

## 6. Summary

- **frames.json:** No change; it keeps relative paths like `/frames/{SKU}/...`. The app resolves them with `getSharedAssetUrl`.
- **Shared bucket:** shared_assets + frames (from store-a_assets or a copy).
- **Store-a bucket:** store-a_assets/assets only (no canvas, no stock).
- **Canvas images:** Served from shared bucket at `canvas/images/{filename}`; `getCanvasImageUrl()` in core is aligned with this.
