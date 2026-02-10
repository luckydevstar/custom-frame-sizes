# Asset source: Local vs Cloudflare R2

You can serve images and assets either from **local** (Next.js public / API rewrites) or from **Cloudflare R2** (two public buckets). Same directory structure in both; switch by environment variables only.

## Where to configure

**File:** `apps/store-a/.env.local` (create from `apps/store-a/.env.local.example`)

No code changes are required. The app uses `getSharedAssetUrl()` and `getStoreAssetUrl()` from `@framecraft/core`; they read the env vars below and return either CDN URLs or local paths.

---

## Option 1: Local assets

Assets are served from the app (e.g. `/api/asset` rewrites or Next.js `public/`).

**Setup:** Leave the two CDN URLs **unset or empty** in `apps/store-a/.env.local`:

```bash
# Omit these, or set to empty:
# NEXT_PUBLIC_CDN_SHARED_URL=
# NEXT_PUBLIC_CDN_STORE_A_URL=
```

---

## Option 2: Cloudflare R2 assets

Assets are served from two R2 public buckets (same directory structure as local).

**Setup:** Set these in `apps/store-a/.env.local`:

```bash
# Shared assets (frames, mats, comic, diploma, canvas, playbill, etc.)
NEXT_PUBLIC_CDN_SHARED_URL=https://pub-69a10dc9071244a289ce236ece9aba93.r2.dev

# Store-A assets (assets/ directory: brand, plywood texture, hero, etc.)
NEXT_PUBLIC_CDN_STORE_A_URL=https://pub-90cb5b0e26db4cc1b1ece8a4852edfc8.r2.dev
```

- **Shared bucket** → `NEXT_PUBLIC_CDN_SHARED_URL`  
  Paths like: `frames/8576/corner.jpg`, `mats/swatches/1.jpg`, `playbill/lifestyle/...`, `canvas/images/...`, etc.

- **Store-A bucket** → `NEXT_PUBLIC_CDN_STORE_A_URL`  
  Paths under `assets/`: e.g. `assets/plywood-texture.png`, `assets/brand/logo-blue.png`.

**R2 key structure:** The code expects object keys **without** a `shared_assets/` or `store-a_assets/` prefix. Upload the _contents_ of each folder so that the shared bucket has keys like `frames/8446/lifestyle_1.jpg`, `mats/swatches/1.jpg`, and the store-a bucket has keys like `assets/plywood-texture.png`, `assets/brand/logo-blue.png`. If you uploaded with a parent folder (e.g. keys are `shared_assets/frames/...`), either re-upload without that prefix or add the prefix to your bucket and use the same path in the app (see [ASSET_PATHS_AND_CDN.md](./ASSET_PATHS_AND_CDN.md)).

After changing `.env.local`, restart the dev server or rebuild so `NEXT_PUBLIC_*` values are picked up.

---

## Summary

| Mode  | `NEXT_PUBLIC_CDN_SHARED_URL`                          | `NEXT_PUBLIC_CDN_STORE_A_URL`                         |
| ----- | ----------------------------------------------------- | ----------------------------------------------------- |
| Local | unset / empty                                         | unset / empty                                         |
| R2    | `https://pub-69a10dc9071244a289ce236ece9aba93.r2.dev` | `https://pub-90cb5b0e26db4cc1b1ece8a4852edfc8.r2.dev` |

See also: [CDN_SIMPLE_SETUP.md](./CDN_SIMPLE_SETUP.md), [ASSET_PATHS_AND_CDN.md](./ASSET_PATHS_AND_CDN.md).
