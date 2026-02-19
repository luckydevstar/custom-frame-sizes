# Military Frames Page – Migration from Original

**Original (source of truth):** `CustomFrameSizes-CODE/client/src/pages/MilitaryFrames.tsx`  
**Migrated:** `apps/store-a/src/app/military-frames/page.tsx`

## Section order and content (aligned with original)

| #   | Section                                                                                                                   | Status                         |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1   | Hero (Badge, H1, paragraph, Design Your Frame button)                                                                     | Done                           |
| 2   | Designer (`id="military-designer"`)                                                                                       | Done – see Designer note below |
| 3   | Real Military Display Examples (heading + short paragraph + **MilitaryLifestyleCarousel**)                                | Done                           |
| 4   | Why Veterans Trust Custom Frame Sizes (3 cards; first card includes “Our materials meet professional framing standards.”) | Done                           |
| 5   | How Military Shadow Boxes Work (full prose with subsections and inline images)                                            | Done                           |
| 6   | Branch-Specific Color Options (6 branch cards)                                                                            | Done                           |
| 7   | Related Products                                                                                                          | Done                           |

**No** “Final CTA” section before Related Products in the original; none in migrated page.

## Designer

- **Original:** Uses `<MilitaryFrameDesigner embedded />` (branch presets, military layouts, MilitaryPreviewCanvas).
- **Migrated:** Uses `<ShadowboxDesigner embedded initialConfig={MILITARY_INITIAL_CONFIG} />` so the page works with the shared shadowbox designer and military default config (16×20, 2" depth, Army-style green/black mat, suede). A full port of `MilitaryFrameDesigner` can be added later for branch dropdown and military-specific layouts.

## Lifestyle images

- **Original paths:** `/military/lifestyle/lifestyle_01.jpg` … `lifestyle_50.jpg` (50 images).
- **Migrated:** `getMilitaryLifestyleImages()` and `getMilitaryLifestyleImageByNumber(n)` in `@framecraft/core` (lib `military-lifestyle-images.ts`) resolve URLs via `getStoreBaseAssetUrl("military/lifestyle/lifestyle_XX.jpg")` so they work with the store-a CDN or local asset API.
- Ensure the store-a bucket (or local `assets_to_use`) has `military/lifestyle/lifestyle_01.jpg` … `lifestyle_50.jpg` if not using CDN.

## How it works – inline images

The “How Military Shadow Boxes Work” section uses these images (same as original), resolved via `getMilitaryLifestyleImageByNumber`:

- 2-Inch Depth: `lifestyle_12.jpg`
- Branch-Specific Colors: `lifestyle_27.jpg`
- Premium Suede Backing: `lifestyle_08.jpg`
- Three Sizes: `lifestyle_35.jpg`, `lifestyle_42.jpg`
- How to Mount: `lifestyle_18.jpg`
- Keeping Your Display Looking Good: `lifestyle_50.jpg`

## New in migrated repo

- `packages/core/src/lib/military-lifestyle-images.ts` – `getMilitaryLifestyleImages()`, `getMilitaryLifestyleImageByNumber(num)`
- `packages/ui/src/components/specialty/MilitaryLifestyleCarousel.tsx` – uses `BaseLifestyleCarousel` with military images (title “Military Frames in Action”, subtitle from original, no randomize, max 50)
