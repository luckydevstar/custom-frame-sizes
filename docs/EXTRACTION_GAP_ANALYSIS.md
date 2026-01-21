# Extraction Gap Analysis

## Overview

This document identifies what needs to be extracted from the original codebase (`CustomFrameSizes-CODE`) to complete Phase 1 extraction work for the monorepo migration.

## Status: Critical Items Missing for Store A Launch

### ✅ Already Extracted

- Basic frame designer components (FrameDesigner, ShadowboxDesigner, JerseyDesigner, etc.)
- Basic UI components (Shadcn/ui components)
- Core services (products, pricing, validation)
- Basic Shopify integration (Storefront API, Admin API)
- Core hooks (useIsMobile, useMobileViewToggle, useIntersectionVisible)
- Dimensions utility

### ❌ Missing - Critical for Store A

#### 1. Utilities (`@framecraft/core/utils`)

- [ ] `geometry.ts` - Mat designer geometry calculations (CRITICAL)
- [ ] `shadowbox-utils.ts` - Shadowbox serialization/pricing utilities
- [ ] `exportPreview.ts` - Frame preview export (high-res PNG generation)
- [ ] `arModelGenerator.ts` - AR model generation (Three.js)
- [ ] `generateTicketSVG.ts` - Deprecated but may be referenced

#### 2. Hooks (`@framecraft/core/hooks`)

- [ ] `useHeroImage.ts` - Hero image selection and preloading
- [ ] `useImageRegistry.ts` - Image registry management
- [ ] `useIntelligentPreviewSizing.ts` - Preview size calculations
- [ ] `useParallax.ts` - Parallax scroll effects
- [ ] `usePrintFrame.ts` - Print frame functionality
- [ ] `useRotatingImages.ts` - Rotating image carousel
- [ ] `useRotatingTestimonial.ts` - Rotating testimonials
- [ ] `useScrollAnimation.ts` - Scroll-triggered animations
- [ ] `use-scroll-to-top.tsx` - Scroll restoration
- [ ] `use-toast.ts` - Toast notifications (may stay in UI package)

#### 3. Lib Utilities (`@framecraft/core/lib`)

- [ ] `geometry.ts` - Geometry calculations for mat designer
- [ ] `markdown.ts` - Markdown parsing utilities
- [ ] `schemas.ts` - JSON-LD schema generation
- [ ] `queryClient.ts` - TanStack Query client setup
- [ ] `colorGatewayImages.ts` - Color gateway image utilities
- [ ] `content-loader.ts` - Content loading utilities
- [ ] `holidayCalculator.ts` - Holiday/seasonal calculations
- [ ] `nameplate-positioning.ts` - Nameplate positioning utilities
- [ ] `seasonalCollections.ts` - Seasonal collection utilities
- [ ] `shadowboxColorImages.ts` - Shadowbox color image utilities
- [ ] `stockImages.ts` - Stock image utilities
- [ ] `styleGatewayImages.ts` - Style gateway image utilities
- [ ] `utils.ts` - General utilities (cn function, etc.)

#### 4. Specialty Utilities (`@framecraft/core/lib/specialty`)

These are critical for specialty designers to work:

- [ ] All files in `lib/specialty/` directory (42+ files)
  - cardFormats.ts, cardLayouts.ts
  - cdLayouts.ts
  - certificateSizes.ts
  - collageInserts.ts, collageLayouts.ts, collageMath.ts
  - comicCoverSelection.ts, comicFormats.ts, comicLayouts.ts
  - currencyLayouts.ts
  - diplomaSizes.ts
  - jerseyLayouts.ts, jerseyMatPaths.ts, jerseyTeams.ts
  - magazineLayouts.ts, magazineSizes.ts
  - matGeometry.ts, matTiling.ts
  - militaryBranches.ts, militaryLayouts.ts
  - needleworkInserts.ts
  - newspaperInserts.ts, newspaperLayouts.ts
  - playbillLayouts.ts
  - puckInserts.ts, puckLayouts.ts
  - puzzleSizes.ts
  - recordAlbumLayouts.ts
  - schoolDaysInserts.ts
  - signatureAnimations.ts
  - sonogramLayouts.ts
  - stampLayouts.ts
  - svgPathGenerator.ts
  - ticketStubLayouts.ts
  - weddingInvitationLayouts.ts
  - useCollagePricing.ts, useComicPricing.ts, useMagazinePricing.ts, usePlaybillPricing.ts

#### 5. Additional Specialty Designers (`@framecraft/ui/components/specialty`)

Currently only 7 designers extracted, but original has 20+:

- [x] FrameDesigner
- [x] ShadowboxDesigner
- [x] JerseyFrameDesigner
- [x] CanvasFrameDesigner
- [x] PuzzleFrameDesigner
- [x] ComicBookFrameDesigner
- [x] PlaybillFrameDesigner
- [ ] CardFrameDesigner
- [ ] RecordAlbumDesigner
- [ ] SignatureFrameDesigner
- [ ] SonogramFrameDesigner
- [ ] TicketStubFrameDesigner
- [ ] StampFrameDesigner
- [ ] BouquetFrameDesigner
- [ ] CollageFrameDesigner
- [ ] CertificateFrameDesigner
- [ ] CurrencyFrameDesigner
- [ ] DiplomaFrameDesigner
- [ ] MilitaryFrameDesigner
- [ ] MoviePosterFrameDesigner
- [ ] NeedleworkFrameDesigner
- [ ] NewspaperFrameDesigner
- [ ] PuckFrameDesigner
- [ ] WeddingInvitationFrameDesigner

#### 6. Supporting Components (`@framecraft/ui/components`)

- [ ] `Hero.tsx` - Hero section component
- [ ] `ImageGallery.tsx` - Image gallery component
- [ ] `ImageEditor.tsx` - Image editing component
- [ ] `ObjectUploader.tsx` - Object upload component
- [ ] `PhotoUploadOptions.tsx` - Photo upload options
- [ ] `RecommendationCarousel.tsx` - Recommendation carousel
- [ ] `RotatingImage.tsx` - Rotating image component
- [ ] `FrameCard.tsx` - Frame card component
- [ ] `FramePreview.tsx` - Frame preview component
- [ ] `FrameDetailCarousel.tsx` - Frame detail carousel
- [ ] `GalleryCard.tsx` - Gallery card component
- [ ] `AchievementCard.tsx` - Achievement card component
- [ ] `TestimonialCarousel.tsx` - Testimonial carousel
- [ ] `ErrorBoundary.tsx` - Error boundary component
- [ ] `Logo.tsx` - Logo component
- [ ] `MatPreviewOverlay.tsx` - Mat preview overlay
- [ ] `SizeInputCard.tsx` - Size input card
- [ ] `BrassNameplateDesigner.tsx` and related - Brass nameplate components

#### 7. Constants and Data (`@framecraft/data` or `@framecraft/config`)

- [ ] All constants from `constants/` directory
- [ ] Testimonials, blog posts, and other data files

#### 8. Features (`@framecraft/core/features`)

- [ ] Mat designer feature code
- [ ] Print size calculator feature code

## Priority for Store A Launch

### P0 - Must Have (Blocks Store A)

1. ✅ FrameDesigner component (done)
2. ✅ Basic Shopify integration (done)
3. ⚠️ Geometry utilities (CRITICAL - needed for mat designer)
4. ⚠️ Core hooks (useIntelligentPreviewSizing, etc.)
5. ⚠️ Specialty utilities for active specialty designers

### P1 - Should Have (Needed for Full Functionality)

1. Export preview utilities
2. Image registry hooks
3. Hero image hooks
4. Additional layout components

### P2 - Nice to Have (Can Extract Later)

1. Additional specialty designers
2. AR model generation
3. Advanced animation hooks

## Extraction Plan

### Phase 1: Critical Utilities (Do First)

1. Extract `geometry.ts` to `@framecraft/core/utils/geometry.ts`
2. Extract `shadowbox-utils.ts` to `@framecraft/core/utils/shadowbox-utils.ts`
3. Extract specialty utilities needed by active designers

### Phase 2: Critical Hooks

1. Extract `useIntelligentPreviewSizing.ts`
2. Extract other hooks used by FrameDesigner

### Phase 3: Supporting Utilities

1. Extract markdown, schemas, queryClient utilities
2. Extract image-related utilities

### Phase 4: Additional Components

1. Extract layout components (Hero, ImageGallery, etc.)
2. Extract additional specialty designers as needed

## Action Items

- [ ] Extract geometry.ts utility (CRITICAL)
- [ ] Extract shadowbox-utils.ts utility
- [ ] Extract useIntelligentPreviewSizing hook
- [ ] Extract specialty utilities for active designers
- [ ] Update package exports
- [ ] Test Store A with extracted utilities

## Notes

- Some utilities (like exportPreview) may depend on app-specific code (matTiling) - may need to stay in app or be refactored
- Toast hook depends on UI components - evaluate if it should stay in UI package
- Some specialty designers may not be needed for initial Store A launch
