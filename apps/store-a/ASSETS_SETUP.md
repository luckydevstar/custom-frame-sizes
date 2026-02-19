# Store A Assets Setup Guide

This guide explains how to set up brand assets for Store A.

## Current Status

✅ **Directory Structure Created**

- `public/assets/brand/` - Brand assets directory
- `public/logos/` - Alternative logo location

✅ **Placeholder Logos Created**

- `logo-blue.svg` - Simple SVG placeholder for light mode
- `logo-dark.svg` - Simple SVG placeholder for dark mode
- `cfs-mark.svg` - Simple icon mark placeholder

⚠️ **Production Assets Needed**

- Replace SVG placeholders with actual brand logos (PNG or high-quality SVG)
- OG images need to be created for social media sharing
- See below for details

## Understanding Asset Architecture

### Original Repo Asset System

The original `CustomFrameSizes-CODE` repository uses a dual asset system:

1. **Vite Bundled Assets** (`@assets` alias → `attached_assets/` directory)
   - Images imported via `import.meta.glob('@assets/...')`
   - Bundled into JavaScript at build time
   - Used for stock images, specialty images, etc.
   - **Note**: The `attached_assets/` directory is not in the repo (likely gitignored)

2. **Static Public Assets** (`/assets/...` paths → `public/assets/` directory)
   - Served directly from the public folder
   - Used for logos, favicons, OG images
   - Referenced as `/assets/brand/logo-blue.png`

### Next.js Asset System (Store A)

For Next.js, we use a simpler approach:

- All static assets go in `public/` folder
- Referenced with paths starting with `/` (e.g., `/assets/brand/logo.svg`)
- No build-time bundling needed for static assets
- SVG files work well for logos (scalable, small file size)

## Required Assets

### 1. Logo Files

**Current**: SVG placeholders are in place and working.

**For Production**: Replace with actual brand logos:

- **logo-blue.png** or **logo-blue.svg** (Light mode logo)
  - Recommended size: 300x80px
  - Format: PNG with transparent background OR high-quality SVG
  - Used for: Light theme header

- **logo-dark.png** or **logo-dark.svg** (Dark mode logo)
  - Recommended size: 300x80px
  - Format: PNG with transparent background OR high-quality SVG
  - Used for: Dark theme header

- **cfs-mark.svg** (Logo mark/icon)
  - Recommended size: Scalable SVG (32x32px minimum)
  - Used for: Favicon, small displays, app icons

### 2. Social Media Images

Create the following images for social media sharing:

- **og-image.jpg** (Open Graph image)
  - Recommended size: 1200x630px
  - Format: JPG (optimized)
  - Used for: Facebook, LinkedIn sharing
  - Place in: `public/assets/brand/og-image.jpg`

- **twitter-image.jpg** (Twitter card image)
  - Recommended size: 1200x675px
  - Format: JPG (optimized)
  - Used for: Twitter sharing
  - Place in: `public/assets/brand/twitter-image.jpg`

## Copying from Original Repo

### Important Discovery

After investigation, the original repo:

- References logo files at `/assets/brand/logo-blue.png` but **these files don't exist**
- Uses `@assets` alias for bundled images (from `attached_assets/` directory)
- The `attached_assets/` directory is not in the repo (likely gitignored or not committed)
- Logo files may have been intended but never added, or are served from a CDN in production

### If Assets Exist Elsewhere

If you have access to the actual logo files:

```bash
# Copy logo files to Store A
cp path/to/logo-blue.png apps/store-a/public/assets/brand/logo-blue.png
cp path/to/logo-dark.png apps/store-a/public/assets/brand/logo-dark.png
cp path/to/cfs-mark.svg apps/store-a/public/assets/brand/cfs-mark.svg

# Then update brand.config.ts to use PNG instead of SVG:
# logo: { src: "/assets/brand/logo-blue.png", ... }
```

## Configuration

The logo path is configured in `src/brand.config.ts`:

```typescript
theme: {
  logo: {
    src: "/assets/brand/logo-blue.svg", // Currently using SVG placeholder
    alt: "Store A Logo",
    width: "150px",
    height: "40px",
  },
}
```

## Validation

The validation schema accepts:

- ✅ Absolute URLs (https://example.com/logo.png)
- ✅ Relative paths starting with `/` (/assets/brand/logo.png)
- ✅ Logo is optional (can be `null` or `undefined`)

## Frame images (corner, profile, lifestyle)

Designer pages (jersey, certificate, etc.) request frame images like `/frames/10727/10727_corner_a.jpg` and `/frames/10727/10727-pro-a.jpg`. Those URLs are rewritten to `/api/asset/frames/10727/...`, which serves from **`assets_to_use/store-a_assets/frames/<sku>/`** when not using the store-a CDN.

To fix 404s for frame 10727 (and 10728, 10729, etc.):

1. **Local dev (no CDN)**  
   Create `assets_to_use/store-a_assets/frames/10727/` and add the image files.  
   Use the **normalized** filenames (underscore `corner_a` → hyphen `corner-a` in file): e.g. **`10727_corner-a.jpg`**, **`10727-pro-a.jpg`**.  
   The API route will also try `10727_corner_a.jpg` if `10727_corner-a.jpg` is missing.

2. **Production (CDN)**  
   Upload the same files to your **store-a** R2 bucket under `frames/10727/` (e.g. `frames/10727/10727_corner-a.jpg`).  
   Set `NEXT_PUBLIC_CDN_STORE_A_URL` so the app uses the CDN for these paths.

Jersey (and other) **lifestyle** images are now in the **shared** bucket under `jersey/lifestyle/`, `puck/lifestyle/`, etc. Use the upload scripts in `useful-scripts` (e.g. `r2:upload-jersey-lifestyle`) for those.

## Next Steps

1. **For Development**: ✅ SVG placeholders are working - no action needed
2. **For Production**:
   - Design or obtain proper brand logos
   - Replace SVG placeholders with actual logos
   - Create OG images for social media
3. **For Testing**: The app works with placeholder logos - ready for development

## Notes

- SVG logos are preferred for scalability and small file size
- PNG logos should have transparent backgrounds
- OG images should be high quality but optimized for file size
- All assets in `public/` are served statically by Next.js
- No build-time processing needed for static assets

## Asset Locations Summary

```
apps/store-a/
├── public/
│   └── assets/
│       └── brand/
│           ├── logo-blue.svg      ✅ (placeholder)
│           ├── logo-dark.svg      ✅ (placeholder)
│           ├── cfs-mark.svg       ✅ (placeholder)
│           ├── og-image.jpg       ⚠️ (needed for production)
│           └── twitter-image.jpg  ⚠️ (needed for production)
└── src/
    └── brand.config.ts            ✅ (configured to use SVG placeholders)
```
