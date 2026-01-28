# Simple CDN Setup Guide

## Overview

The application now uses a simple two-bucket CDN system:

- **Shared Assets**: Frames, mats, comic, diploma, etc. → `NEXT_PUBLIC_CDN_SHARED_URL`
- **Store-A Assets**: Only the `assets/` directory → `NEXT_PUBLIC_CDN_STORE_A_URL`

## Environment Variables

Add these to your `.env.local` file in `apps/store-a/`:

```bash
# Shared Assets CDN URL (frames, mats, comic, etc.)
NEXT_PUBLIC_CDN_SHARED_URL=https://pub-d2f459227a6d44cab26325fa3d6ea821.r2.dev

# Store-A Assets CDN URL (assets/ directory only)
NEXT_PUBLIC_CDN_STORE_A_URL=https://pub-e7bceef7c942453b92d35da77e807c44.r2.dev
```

## How It Works

### URL Generation

The helper functions automatically prepend the CDN URL to paths:

**Shared Assets:**

- `getSharedAssetUrl("frames/8576/corner.jpg")` → `https://pub-d2f459227a6d44cab26325fa3d6ea821.r2.dev/frames/8576/corner.jpg`
- `getSharedAssetUrl("mats/swatches/1.jpg")` → `https://pub-d2f459227a6d44cab26325fa3d6ea821.r2.dev/mats/swatches/1.jpg`
- `getSharedAssetUrl("comic/inserts/golden-silver-bronze/ActionComics_1.jpg")` → `https://pub-d2f459227a6d44cab26325fa3d6ea821.r2.dev/comic/inserts/golden-silver-bronze/ActionComics_1.jpg`

**Store-A Assets:**

- `getStoreAssetUrl("plywood-texture.png")` → `https://pub-e7bceef7c942453b92d35da77e807c44.r2.dev/assets/plywood-texture.png`
- `getBrandAssetUrl("logo-blue.png")` → `https://pub-e7bceef7c942453b92d35da77e807c44.r2.dev/assets/brand/logo-blue.png`
- `getCanvasImageUrl("10117-lifestyle-a.jpg")` → `https://pub-e7bceef7c942453b92d35da77e807c44.r2.dev/assets/canvas/10117-lifestyle-a.jpg`

### Fallback Behavior

If environment variables are not set, the helpers fall back to local paths:

- `/frames/8576/corner.jpg` (served from Next.js `/public`)
- `/assets/plywood-texture.png` (served from Next.js `/public`)

This allows local development without CDN setup.

## Updated Components

The following components now use CDN URLs:

1. ✅ **ColorSwatches** - Mat swatch images
2. ✅ **Logo** - Brand logos (light/dark mode)
3. ✅ **CanvasFramesShowcase** - Canvas lifestyle images
4. ✅ **ShadowboxDesigner** - Plywood texture
5. ✅ **API Route** - Frame photos (`/api/frames/[sku]/photos`)

## API Route

The frame photos API route has been created at:

- `apps/store-a/src/app/api/frames/[sku]/photos/route.ts`

This route:

- Reads frame photos from local filesystem or JSON data
- Returns CDN URLs if environment variables are set
- Falls back to local paths if CDN is not configured

## Testing

1. Set environment variables in `.env.local`
2. Restart your dev server
3. Check browser Network tab - images should load from CDN URLs
4. Verify images display correctly

## Troubleshooting

### Images Still Loading from Local Paths

- Check that `.env.local` exists in `apps/store-a/` directory
- Verify environment variables start with `NEXT_PUBLIC_`
- Restart dev server after changing environment variables
- Check browser console for any errors

### 404 Errors on CDN URLs

- Verify the R2 bucket URLs are correct
- Check that files exist in R2 buckets with correct paths
- Ensure R2 buckets have public access enabled
- Check CORS settings on R2 buckets

### CORS Errors

Add CORS configuration to your R2 buckets:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```
