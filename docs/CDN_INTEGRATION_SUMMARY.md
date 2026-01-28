# CDN Integration Summary

## Overview

The codebase has been updated to use Cloudflare R2 CDN for all static assets. Assets are split into two buckets:

- **cfs-shared-assets**: Shared assets (frames/, mats/, comic/, diploma/, etc.)
- **cfs-store-a-assets**: Store-specific assets (assets/ directory)

## Environment Variables Required

Add these to your `.env.local` or Vercel environment variables:

```bash
# Required: CDN URLs for each bucket
NEXT_PUBLIC_CDN_SHARED_URL=https://cfs-shared-assets.yourdomain.com
NEXT_PUBLIC_CDN_STORE_A_URL=https://cfs-store-a-assets.yourdomain.com

# Optional: Bucket names (defaults shown)
NEXT_PUBLIC_CDN_SHARED_BUCKET=cfs-shared-assets
NEXT_PUBLIC_CDN_STORE_BUCKET=cfs-store-a-assets
```

## What Was Updated

### 1. Asset URL Helpers (`packages/core/src/utils/asset-urls.ts`)

- ✅ `getSharedAssetUrl()` - For frames, mats, comic, diploma, etc.
- ✅ `getStoreAssetUrl()` - For assets/ directory (brand, hero, canvas, etc.)
- ✅ `getFrameImageUrl()` - Frame images
- ✅ `getMatImageUrl()` - Mat board images
- ✅ `getHeroAssetUrl()` - Hero videos
- ✅ `getCanvasImageUrl()` - Canvas lifestyle images
- ✅ `getBrandAssetUrl()` - Brand logos

### 2. API Routes

- ✅ `/api/frames/[sku]/photos` - Returns CDN URLs for frame photos

### 3. Components Updated

- ✅ `Logo` - Uses `getBrandAssetUrl()` for logos
- ✅ `CanvasFramesShowcase` - Uses `getCanvasImageUrl()` for canvas images
- ✅ `ColorSwatches` - Uses `getSharedAssetUrl()` for mat swatches
- ✅ `ShadowboxDesigner` - Uses `getStoreAssetUrl()` for plywood texture

### 4. Utilities Updated

- ✅ `mat-tiling.ts` - Uses `getSharedAssetUrl()` for mat textures
- ✅ `mat-catalog.ts` - Uses `getSharedAssetUrl()` for mat swatches

## How It Works

### Automatic Fallback

If CDN URLs are not configured, all helpers fall back to local paths:

- `/frames/8576/corner.jpg` (served from Next.js `/public`)
- `/assets/hero/collage-wall-1.mp4` (served from Next.js `/public`)

This allows local development without CDN setup.

### URL Generation

```typescript
// Frame images (from cfs-shared-assets)
getFrameImageUrl("8576", "corner");
// → "https://cfs-shared-assets.yourdomain.com/frames/8576/corner.jpg"

// Hero videos (from cfs-store-a-assets)
getHeroAssetUrl("collage-wall-1.mp4");
// → "https://cfs-store-a-assets.yourdomain.com/assets/hero/collage-wall-1.mp4"

// Canvas images (from cfs-store-a-assets)
getCanvasImageUrl("10117-lifestyle-a.jpg");
// → "https://cfs-store-a-assets.yourdomain.com/assets/canvas/10117-lifestyle-a.jpg"
```

## Testing

1. Set environment variables
2. Restart dev server
3. Check browser Network tab - images should load from CDN
4. Verify images display correctly

## Next Steps

1. ✅ Set environment variables in Vercel
2. ✅ Test CDN URLs work correctly
3. ✅ Verify all images load from CDN
4. ✅ Remove local assets from `/public` (optional, for build size optimization)

## Troubleshooting

### Images Not Loading

- Check CORS settings on R2 buckets
- Verify CDN URLs are correct
- Ensure buckets are publicly accessible
- Check file paths match bucket structure

### CORS Errors

Add CORS configuration to R2 buckets:

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
