# Current Image Loading Architecture

## Overview

This document describes how images/assets are currently loaded in the application. Most components use **hardcoded paths** that serve from Next.js `/public` directory, with some components using API routes.

## Image Loading Patterns

### 1. **Hardcoded Public Paths** (Most Common)

Components directly reference paths starting with `/` which are served from Next.js `public/` directory:

#### Examples:

**ColorSwatches Component** (`packages/ui/src/components/ui/ColorSwatches.tsx`):

```typescript
const swatchImagePath = `/mats/swatches/${color.lineNumber}.jpg${cacheBuster}`;
// Used in: backgroundImage: `url(${swatchImagePath})`
```

**Logo Component** (`packages/ui/src/components/brand/Logo.tsx`):

```typescript
const defaultLight = "/assets/brand/logo-blue.png";
const defaultDark = "/assets/brand/logo-dark.png";
// Used in: <Image src={logoSrc} ... />
```

**CanvasFramesShowcase** (`packages/ui/src/components/home/CanvasFramesShowcase.tsx`):

```typescript
image: "/assets/canvas/10117-lifestyle-a.jpg";
// Used in: <img src={canvas.image} ... />
```

**ShadowboxDesigner** (`packages/ui/src/components/specialty/ShadowboxDesigner.tsx`):

```typescript
const PLYWOOD_TEXTURE_URL = "/assets/plywood-texture.png";
// Used in: backgroundImage: `url(${PLYWOOD_TEXTURE_URL})`
```

### 2. **API Route Pattern** (For Frame Photos)

Multiple designer components fetch frame photos via an API route:

**Components using this pattern:**

- `FrameDesigner.tsx`
- `ShadowboxDesigner.tsx`
- `JerseyFrameDesigner.tsx`
- `CanvasFrameDesigner.tsx`
- `ComicBookFrameDesigner.tsx`
- `PuzzleFrameDesigner.tsx`
- `PlaybillFrameDesigner.tsx`
- `FramePreview.tsx`

**Pattern:**

```typescript
const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
if (response.ok) {
  const photoSet = await response.json();
  // photoSet contains: { cornerUrl, topUrl, bottomUrl, leftUrl, rightUrl, profileUrl, lifestyleUrl }
  setFramePhotos(photoSet);
}
```

**Note:** The API route `/api/frames/[sku]/photos/route.ts` **does not currently exist** in `apps/store-a/src/app/api/`. This route needs to be created or the components need to be updated.

### 3. **Hero Images**

Hero component receives image data as props with `src` property:

```typescript
interface HeroImage {
  src: string; // Full URL or path
  alt: string;
  mediaType: "image" | "video";
  // ...
}
```

## Current Asset Structure (Expected)

Based on hardcoded paths, the application expects this structure in `/public`:

```
public/
├── assets/
│   ├── brand/
│   │   ├── logo-blue.png
│   │   └── logo-dark.png
│   ├── canvas/
│   │   ├── 10117-lifestyle-a.jpg
│   │   ├── 10764-lifestyle-a.jpg
│   │   ├── 10694-lifestyle-a.jpg
│   │   └── 11345-lifestyle-a.jpg
│   └── plywood-texture.png
├── mats/
│   └── swatches/
│       ├── 1.jpg
│       ├── 2.jpg
│       └── ... (by lineNumber)
└── frames/
    └── [sku]/
        ├── corner.jpg
        ├── top.jpg
        ├── bottom.jpg
        ├── left.jpg
        ├── right.jpg
        ├── profile.jpg
        └── lifestyle.jpg
```

## Issues with Current Approach

1. **No CDN Support**: All images are served from Next.js `/public` directory
2. **Hardcoded Paths**: Difficult to switch between local and CDN
3. **Missing API Route**: Frame photo API route doesn't exist
4. **No Centralized URL Generation**: Each component constructs paths differently

## Migration Path to CDN

To support CDN (Cloudflare R2), components need to:

1. **Replace hardcoded paths** with helper functions:
   - `getSharedAssetUrl()` for frames, mats
   - `getStoreAssetUrl()` for assets/ directory
   - `getFrameImageUrl()` for frame photos
   - `getMatImageUrl()` for mat images

2. **Create the API route** `/api/frames/[sku]/photos/route.ts` that uses CDN helpers

3. **Update all components** to use helper functions instead of hardcoded paths

## Components That Need Updates

### High Priority (Used on Homepage):

- ✅ `ColorSwatches.tsx` - Already imports `getSharedAssetUrl` but uses hardcoded path
- `Logo.tsx` - Uses hardcoded `/assets/brand/` paths
- `CanvasFramesShowcase.tsx` - Uses hardcoded `/assets/canvas/` paths

### Medium Priority (Designer Components):

- `ShadowboxDesigner.tsx` - Uses hardcoded `/assets/plywood-texture.png`
- All frame designer components - Need API route or direct CDN URLs

### Low Priority (Other Components):

- Hero images (if they use local paths)
- Other showcase components

## Next Steps

1. **Create API route** for frame photos that uses CDN helpers
2. **Update ColorSwatches** to use `getSharedAssetUrl()` instead of hardcoded path
3. **Update Logo component** to use `getBrandAssetUrl()`
4. **Update CanvasFramesShowcase** to use `getCanvasImageUrl()`
5. **Update ShadowboxDesigner** to use `getStoreAssetUrl()`
6. **Test with CDN URLs** to ensure all images load correctly
