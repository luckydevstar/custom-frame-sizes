# Cloudflare R2 CDN Setup Guide

## Overview

Static assets are served from two Cloudflare R2 buckets:

- **cfs-shared-assets**: Shared assets (frames/, mats/, comic/, diploma/, etc.)
- **cfs-store-a-assets**: Store-specific assets (assets/ directory)

## Environment Variables

### Required Environment Variables

Add these to your `.env.local` file (or Vercel environment variables):

```bash
# Option 1: Separate URLs for each bucket (Recommended)
NEXT_PUBLIC_CDN_SHARED_URL=https://cfs-shared-assets.yourdomain.com
NEXT_PUBLIC_CDN_STORE_A_URL=https://cfs-store-a-assets.yourdomain.com

# OR Option 2: Single base URL (Alternative)
# NEXT_PUBLIC_CDN_BASE_URL=https://cdn.yourdomain.com
```

### Getting Your CDN URLs

#### Option A: Custom Domain (Recommended)

1. Go to Cloudflare Dashboard → R2 → Your Bucket
2. Click "Connect Domain"
3. Add your custom domain (e.g., `cfs-shared-assets.yourdomain.com`)
4. Use that URL as `NEXT_PUBLIC_CDN_SHARED_URL`

#### Option B: R2 Public URL

1. Go to Cloudflare Dashboard → R2 → Your Bucket
2. Click "Settings" → "Public Access"
3. Enable public access
4. Copy the public URL (e.g., `https://pub-xxxxx.r2.dev`)
5. Use that URL as your CDN URL

### Example Configuration

```bash
# For cfs-shared-assets bucket
NEXT_PUBLIC_CDN_SHARED_URL=https://pub-abc123.r2.dev

# For cfs-store-a-assets bucket
NEXT_PUBLIC_CDN_STORE_A_URL=https://pub-xyz789.r2.dev
```

## Bucket Structure

### cfs-shared-assets

```
cfs-shared-assets/
├── frames/
│   ├── 8576/
│   │   ├── top.jpg
│   │   ├── bottom.jpg
│   │   ├── corner.jpg
│   │   └── ...
│   └── ...
├── mats/
│   ├── 1.jpg
│   └── ...
├── comic/
├── diploma/
├── military/
└── puzzle-frames/
```

### cfs-store-a-assets

```
cfs-store-a-assets/
└── assets/
    ├── brand/
    │   ├── logo.png
    │   └── ...
    ├── hero/
    │   ├── collage-wall-1.mp4
    │   └── ...
    ├── canvas/
    │   ├── 10117-lifestyle-a.jpg
    │   └── ...
    └── images/
```

## How It Works

The codebase uses helper functions from `@framecraft/core` to generate CDN URLs:

```typescript
import {
  getFrameImageUrl,
  getMatImageUrl,
  getHeroAssetUrl,
  getCanvasImageUrl,
  getBrandAssetUrl,
} from "@framecraft/core";

// Frame images (from cfs-shared-assets)
const cornerUrl = getFrameImageUrl("8576", "corner");
// Returns: "https://cfs-shared-assets.yourdomain.com/frames/8576/corner.jpg"

// Hero videos (from cfs-store-a-assets)
const heroVideo = getHeroAssetUrl("collage-wall-1.mp4");
// Returns: "https://cfs-store-a-assets.yourdomain.com/assets/hero/collage-wall-1.mp4"

// Canvas images (from cfs-store-a-assets)
const canvasImage = getCanvasImageUrl("10117-lifestyle-a.jpg");
// Returns: "https://cfs-store-a-assets.yourdomain.com/assets/canvas/10117-lifestyle-a.jpg"
```

## Fallback Behavior

If CDN URLs are not configured, the helpers fall back to local paths:

- `/frames/8576/corner.jpg` (served from Next.js `/public`)
- `/assets/hero/collage-wall-1.mp4` (served from Next.js `/public`)

This allows local development without CDN setup.

## Testing

1. Set environment variables
2. Restart dev server
3. Check browser network tab - images should load from CDN URLs
4. Verify images display correctly

## Troubleshooting

### Images Not Loading

1. **Check CORS settings**: Ensure R2 buckets allow CORS from your domain
2. **Verify URLs**: Check that CDN URLs are correct in environment variables
3. **Check bucket permissions**: Ensure buckets are publicly accessible
4. **Verify file paths**: Ensure files exist in buckets with correct paths

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

### 404 Errors

- Verify files were uploaded correctly
- Check file paths match what's in the code
- Ensure bucket names match environment variables
