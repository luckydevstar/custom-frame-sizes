# Store A Brand Assets

This directory contains brand assets for Store A including logos, images, and other visual elements.

## Required Assets

To complete the setup, you need to add the following files:

### Logo Files

- **logo-blue.png**: Primary logo for light mode (recommended: 300x80px, transparent background)
- **logo-dark.png**: Logo for dark mode (recommended: 300x80px, transparent background)
- **cfs-mark.svg**: SVG logo mark/icon for favicon and small displays

### Social Media Images

- **og-image.jpg**: Open Graph image for social media sharing (recommended: 1200x630px)
- **twitter-image.jpg**: Twitter card image (recommended: 1200x675px)

## Copying Assets from Original Repo

If you have access to the original CustomFrameSizes-CODE repository, you can copy assets:

```bash
# From the monorepo root
cp -r CustomFrameSizes-CODE/public/assets/brand/* apps/store-a/public/assets/brand/
```

Or manually copy:

- `CustomFrameSizes-CODE/public/assets/brand/logo-blue.png` → `apps/store-a/public/assets/brand/logo-blue.png`
- `CustomFrameSizes-CODE/public/assets/brand/logo-dark.png` → `apps/store-a/public/assets/brand/logo-dark.png`
- `CustomFrameSizes-CODE/public/assets/brand/cfs-mark.svg` → `apps/store-a/public/assets/brand/cfs-mark.svg`

## Temporary Placeholder

For development, you can create simple placeholder images or use text-based logos until the actual assets are available.

## Notes

- All images should be optimized for web (compressed, appropriate format)
- SVG logos are preferred for scalability
- PNG logos should have transparent backgrounds where appropriate
- OG images should be high quality but optimized for file size
