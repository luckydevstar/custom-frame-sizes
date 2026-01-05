# Component Audit & Extraction Plan

**Ticket**: P1-009  
**Date**: 2025-01-XX  
**Purpose**: Comprehensive audit of existing components in `CustomFrameSizes-CODE/client/src/components/` to plan extraction into shared packages.

---

## Executive Summary

This document catalogs all components found in the existing codebase and provides a categorization and extraction strategy for moving them into the monorepo's shared packages. The goal is to identify:

1. Components that should be extracted to `@framecraft/ui`
2. Components that should remain store-specific (in apps)
3. Components that need refactoring before extraction
4. Dependencies between components
5. Extraction priorities

---

## Component Inventory

### 1. UI Primitive Components (`components/ui/`)

**Total Count**: ~70 components  
**Category**: Shadcn/ui base components + custom UI primitives  
**Extraction Target**: `@framecraft/ui/src/components/ui/`

#### Shadcn/ui Base Components (Standard)

- `accordion.tsx` - Accordion/collapsible content
- `alert.tsx` - Alert messages
- `alert-dialog.tsx` - Alert dialogs
- `aspect-ratio.tsx` - Aspect ratio container
- `avatar.tsx` - Avatar component
- `badge.tsx` - Badge/label component
- `breadcrumb.tsx` - Breadcrumb navigation
- `button.tsx` - Button component (foundation component)
- `calendar.tsx` - Date picker calendar
- `card.tsx` - Card container
- `carousel.tsx` - Carousel/slider
- `chart.tsx` - Chart components
- `checkbox.tsx` - Checkbox input
- `collapsible.tsx` - Collapsible content
- `command.tsx` - Command palette
- `context-menu.tsx` - Context menu
- `dialog.tsx` - Modal dialog
- `drawer.tsx` - Drawer/side panel
- `dropdown-menu.tsx` - Dropdown menu
- `form.tsx` - Form wrapper
- `hover-card.tsx` - Hover card
- `input.tsx` - Text input
- `input-otp.tsx` - OTP input
- `label.tsx` - Form label
- `menubar.tsx` - Menu bar
- `navigation-menu.tsx` - Navigation menu
- `pagination.tsx` - Pagination controls
- `popover.tsx` - Popover
- `progress.tsx` - Progress bar
- `radio-group.tsx` - Radio button group
- `resizable.tsx` - Resizable panels
- `scroll-area.tsx` - Scrollable area
- `select.tsx` - Select dropdown
- `separator.tsx` - Separator line
- `sheet.tsx` - Sheet/side panel
- `sidebar.tsx` - Sidebar component
- `skeleton.tsx` - Loading skeleton
- `slider.tsx` - Range slider
- `switch.tsx` - Toggle switch
- `table.tsx` - Data table
- `tabs.tsx` - Tab navigation
- `textarea.tsx` - Textarea input
- `toast.tsx` - Toast notification
- `toaster.tsx` - Toast container
- `toggle.tsx` - Toggle button
- `toggle-group.tsx` - Toggle group
- `tooltip.tsx` - Tooltip

#### Custom UI Components (Frame-Specific)

- `ColorSwatches.tsx` - Color swatch selector
- `frame-spinner.tsx` - Custom spinner
- `help-tooltip.tsx` - Help tooltip
- `MobilePriceBar.tsx` - Mobile price display bar
- `PriceBox.tsx` - Price breakdown display
- `quantity-selector.tsx` - Quantity input selector
- `skeleton-loader.tsx` - Skeleton loader wrapper
- `SwingOut.tsx` - Swing-out animation component

**Extraction Strategy**:

- **Priority**: HIGH
- All Shadcn/ui components should be moved as-is
- Custom UI components should be moved with dependencies
- Ensure proper exports in barrel file

**Dependencies**:

- `button.tsx` is imported by: `pagination.tsx`, `carousel.tsx`, `sidebar.tsx`
- `card.tsx` is imported by: `skeleton-loader.tsx`
- `dialog.tsx` is imported by: `command.tsx`
- `label.tsx` is imported by: `form.tsx`
- `select.tsx` is imported by: `quantity-selector.tsx`
- `input.tsx` is imported by: `quantity-selector.tsx`, `sidebar.tsx`
- `separator.tsx` is imported by: `sidebar.tsx`
- `skeleton.tsx` is imported by: `skeleton-loader.tsx`, `sidebar.tsx`

---

### 2. Layout Components

**Total Count**: 7 components  
**Category**: Site structure components  
**Extraction Target**: `@framecraft/ui/src/components/layout/`

- `Header.tsx` - Site header/navigation
- `Footer.tsx` - Site footer
- `Logo.tsx` - Logo component
- `ThemeProvider.tsx` - Theme context provider
- `ThemeToggle.tsx` - Dark/light mode toggle

#### Navigation Components (`components/navigation/`)

- `MegaMenu.tsx` - Mega menu container
- `MobileNavigation.tsx` - Mobile navigation menu
- `PictureFramesMegaMenu.tsx` - Picture frames mega menu
- `ShadowboxMegaMenu.tsx` - Shadowbox mega menu
- `ComponentsMegaMenu.tsx` - Components mega menu
- `DesignToolsMegaMenu.tsx` - Design tools mega menu
- `ProductsMegaMenu.tsx` - Products mega menu
- `ResourcesMegaMenu.tsx` - Resources mega menu
- `SearchBar.tsx` - Search bar component

**Extraction Strategy**:

- **Priority**: HIGH
- Header/Footer need refactoring to accept configuration via props (extract brand-specific logic)
- Navigation components depend on routing (wouter) - may need abstraction
- ThemeProvider should be shared

**Dependencies**:

- Header imports: Logo, ThemeToggle, all MegaMenu components, SearchBar, MobileNavigation
- Header uses: `@/config/header.config` (needs to be configurable)
- Footer uses: `@shared/brand.config` and `footer-links.json` (needs configuration injection)

**Breaking Changes Required**:

- Header/Footer need props-based configuration instead of direct imports
- Navigation components need routing abstraction layer

---

### 3. Core Designer Components

**Total Count**: 3 major components  
**Category**: Main business logic components  
**Extraction Target**: `@framecraft/ui/src/components/specialty/` (or core package)

- `FrameDesigner.tsx` - Main frame designer (LARGE - ~3000+ lines)
- `CanvasFrameDesigner.tsx` - Canvas float frame designer
- `ShadowboxDesigner.tsx` - Shadowbox designer

**Extraction Strategy**:

- **Priority**: HIGH (core functionality)
- These are complex components with many dependencies
- May need refactoring to separate business logic from UI
- Consider extracting logic to `@framecraft/core` and keeping UI in `@framecraft/ui`

**Dependencies**:

- FrameDesigner imports: Many UI components, services (products, pricing, shopify), hooks, utilities, types
- Uses: PhotoUploadOptions, RecommendationCarousel, ARViewer, BrassNameplateSection, HangingHardwareSection
- Uses: Configuration serialization logic
- Uses: Pricing calculations, validation utilities

**Breaking Changes Required**:

- Extract pricing logic to core package
- Extract configuration serialization to core package
- Make services injectable via props or context
- Extract image upload logic to separate component/service

---

### 4. Specialty Designer Components

**Total Count**: ~70+ components in `components/specialty/`  
**Category**: Specialty frame designers and supporting components  
**Extraction Target**: `@framecraft/ui/src/components/specialty/`

#### Specialty Frame Designers

- `BouquetFrameDesigner.tsx` - Bouquet frames
- `CardFrameDesigner.tsx` - Graded card frames
- `CertificateFrameDesigner.tsx` - Certificate frames
- `CollageFrameDesigner.tsx` - Photo collage frames
- `ComicBookFrameDesigner.tsx` - Comic book frames
- `CurrencyFrameDesigner.tsx` - Currency display frames
- `DiplomaFrameDesigner.tsx` - Diploma frames
- `JerseyFrameDesigner.tsx` - Jersey frames
- `MagazineFrameDesigner.tsx` - Magazine frames
- `MilitaryFrameDesigner.tsx` - Military memorabilia frames
- `MoviePosterFrameDesigner.tsx` - Movie poster frames
- `NeedleworkFrameDesigner.tsx` - Needlework frames
- `NewspaperFrameDesigner.tsx` - Newspaper frames
- `PlaybillFrameDesigner.tsx` - Playbill frames
- `PuckFrameDesigner.tsx` - Hockey puck frames
- `PuzzleFrameDesigner.tsx` - Puzzle frames
- `RecordAlbumDesigner.tsx` - Record album frames
- `SignatureFrameDesigner.tsx` - Signature frames
- `SonogramFrameDesigner.tsx` - Sonogram frames
- `StampFrameDesigner.tsx` - Postage stamp frames
- `TicketStubFrameDesigner.tsx` - Ticket stub frames
- `WeddingInvitationFrameDesigner.tsx` - Wedding invitation frames

#### Specialty Preview Components

- `CardPreviewCanvas.tsx`
- `CollagePreviewCanvas.tsx`
- `ComicPreviewCanvas.tsx`
- `CurrencyPreviewCanvas.tsx`
- `JerseyPreviewCanvas.tsx`
- `MagazinePreviewCanvas.tsx`
- `MilitaryPreviewCanvas.tsx`
- `PlaybillPreview.tsx`
- `PuckPreviewCanvas.tsx`
- `RecordAlbumPreview.tsx`
- `StampPreviewCanvas.tsx`
- `TicketStubPreview.tsx`
- `WeddingInvitationPreviewCanvas.tsx`

#### Specialty Lifestyle Carousels

- `CardLifestyleCarousel.tsx`
- `CanvasLifestyleCarousel.tsx`
- `CDLifestyleCarousel.tsx`
- `CollageLifestyleCarousel.tsx`
- `ComicLifestyleCarousel.tsx`
- `DiplomaLifestyleCarousel.tsx`
- `GradedCardLifestyleCarousel.tsx`
- `InvitationLifestyleCarousel.tsx`
- `JerseyLifestyleCarousel.tsx`
- `MagazineLifestyleCarousel.tsx`
- `MatLifestyleCarousel.tsx`
- `MilitaryLifestyleCarousel.tsx`
- `NeedleworkLifestyleCarousel.tsx`
- `NewspaperLifestyleCarousel.tsx`
- `PlaybillLifestyleCarousel.tsx`
- `PuzzleLifestyleCarousel.tsx`
- `PuckLifestyleCarousel.tsx`
- `SignatureLifestyleCarousel.tsx`
- `SonogramLifestyleCarousel.tsx`
- `TicketStubLifestyleCarousel.tsx`

#### Specialty Layout Galleries

- `CardLayoutGallery.tsx`
- `CollageLayoutGallery.tsx`
- `ComicLayoutGallery.tsx`
- `MagazineLayoutGallery.tsx`
- `NewspaperLayoutGallery.tsx`
- `PlaybillLayoutGallery.tsx`
- `TicketStubLayoutGallery.tsx`

#### Specialty Shared Components (`specialty/shared/`)

- `BaseLifestyleCarousel.tsx` - Base carousel component
- `BottomWeightedMatting.tsx` - Bottom-weighted matting component
- `HangingHardwareSection.tsx` - Hanging hardware selector
- `useCarouselScroll.ts` - Carousel scroll hook

#### Specialty Supporting Components

- `MatColorSelector.tsx` - Mat color selector
- `MatLifestyleCarousel.tsx` - Mat lifestyle images
- `MatStackPreview.tsx` - Mat stack preview
- `MatSwatch.tsx` - Mat color swatch
- `RecordAlbumCartSummary.tsx` - Record album cart summary
- `SimplifiedRecordAlbumCartSummary.tsx` - Simplified version
- `SignatureAnimations.tsx` - Signature animations

**Extraction Strategy**:

- **Priority**: HIGH
- All specialty designers should be extracted to shared package
- Many share common patterns - consider base classes or composition
- Preview components are tightly coupled to designers
- Shared components should be extracted first

**Dependencies**:

- All specialty designers depend on UI components
- Many depend on FrameDesigner patterns/logic
- Preview components depend on designer state/config
- Shared components are used across multiple designers

---

### 5. Brass Nameplate Components (`components/brass-nameplate/`)

**Total Count**: 7 components  
**Category**: Brass nameplate specialty components  
**Extraction Target**: `@framecraft/ui/src/components/specialty/brass-nameplate/`

- `BrassNameplateDesigner.tsx` - Main designer
- `BrassNameplateOrderModule.tsx` - Order module
- `BrassNameplatePlaceholder.tsx` - Placeholder component
- `BrassNameplatePreview.tsx` - Preview component
- `BrassNameplateSection.tsx` - Section wrapper
- `StandaloneNameplatePreview.tsx` - Standalone preview
- `StandaloneNameplateTypes.ts` - Types file
- `index.ts` - Barrel export

**Extraction Strategy**:

- **Priority**: MEDIUM
- Keep as a cohesive group
- Extract with types

---

### 6. Home/Page-Specific Components (`components/home/`)

**Total Count**: 13 components  
**Category**: Home page showcase components  
**Extraction Target**: Evaluate - may stay in apps or become optional marketing components

- `CanvasFramesShowcase.tsx` - Canvas frames showcase
- `ComponentsShowcase.tsx` - Components showcase
- `EducationTeasers.tsx` - Education teasers
- `FaqMini.tsx` - Mini FAQ
- `FrameStylesShowcase.tsx` - Frame styles showcase
- `GlazingShowcase.tsx` - Glazing showcase
- `HowItWorks.tsx` - How it works section
- `InspirationGallery.tsx` - Inspiration gallery
- `MatDesignerShowcase.tsx` - Mat designer showcase
- `PrintAndFrameService.tsx` - Print & frame service
- `ProcessGallery.tsx` - Process gallery
- `SeoTextBlock.tsx` - SEO text block
- `ShadowboxShowcase.tsx` - Shadowbox showcase
- `SpecialtyDesignersShowcase.tsx` - Specialty designers showcase
- `TrustBar.tsx` - Trust bar
- `ValueProps.tsx` - Value propositions

**Extraction Strategy**:

- **Priority**: LOW (evaluate per store)
- These are marketing/homepage-specific
- May want to keep in individual apps for customization
- Could be moved to `@framecraft/ui/src/components/marketing/` as optional components
- Consider making them configurable via props

**Decision**: Move to `@framecraft/ui/src/components/marketing/` but make them highly configurable

---

### 7. Marketing Components (`components/marketing/`)

**Total Count**: 2 components  
**Category**: Marketing/recommendation components  
**Extraction Target**: `@framecraft/ui/src/components/marketing/`

- `KeyFeaturesBar.tsx` - Key features bar
- `RelatedProducts.tsx` - Related products carousel

**Extraction Strategy**:

- **Priority**: MEDIUM
- Extract to marketing components section
- Make data-driven via props

---

### 8. Utility/Supporting Components

**Total Count**: ~15 components  
**Category**: Utility and supporting components  
**Extraction Target**: Various packages based on functionality

#### Error Handling

- `ErrorBoundary.tsx` - React error boundary
  - **Target**: `@framecraft/ui/src/components/error/`

#### Image/Media Components

- `ARViewer.tsx` - AR viewer component
  - **Target**: `@framecraft/ui/src/components/media/`
- `ImageEditor.tsx` - Image editor
  - **Target**: `@framecraft/ui/src/components/media/`
- `ImageGallery.tsx` - Image gallery
  - **Target**: `@framecraft/ui/src/components/media/`
- `PhotoUploadOptions.tsx` - Photo upload options
  - **Target**: `@framecraft/ui/src/components/media/`
- `RotatingImage.tsx` - Rotating image component
  - **Target**: `@framecraft/ui/src/components/media/`

#### Display Components

- `FrameCard.tsx` - Frame card display
  - **Target**: `@framecraft/ui/src/components/display/`
- `FrameCornerSwatch.tsx` - Frame corner swatch
  - **Target**: `@framecraft/ui/src/components/display/`
- `FrameDetailCarousel.tsx` - Frame detail carousel
  - **Target**: `@framecraft/ui/src/components/display/`
- `FramePreview.tsx` - Frame preview
  - **Target**: `@framecraft/ui/src/components/display/`
- `FrameProfileDiagram.tsx` - Frame profile diagram
  - **Target**: `@framecraft/ui/src/components/display/`
- `GalleryCard.tsx` - Gallery card
  - **Target**: `@framecraft/ui/src/components/display/`
- `SizeInputCard.tsx` - Size input card
  - **Target**: `@framecraft/ui/src/components/display/`

#### Recommendation/Content Components

- `RecommendationCarousel.tsx` - Recommendation carousel
  - **Target**: `@framecraft/ui/src/components/marketing/`
- `TestimonialCarousel.tsx` - Testimonial carousel
  - **Target**: `@framecraft/ui/src/components/marketing/`

#### Trust/Verification Components

- `TrustBadges.tsx` - Trust badges
  - **Target**: `@framecraft/ui/src/components/marketing/`
- `TrustBox.tsx` - Trust box
  - **Target**: `@framecraft/ui/src/components/marketing/`

#### Achievement/Gamification Components

- `AchievementCard.tsx` - Achievement card
  - **Target**: `@framecraft/ui/src/components/gamification/` (or keep in apps if store-specific)
- `AchievementToast.tsx` - Achievement toast
  - **Target**: `@framecraft/ui/src/components/gamification/`

#### Modal/Dialog Components

- `TermsOfServiceModal.tsx` - Terms of service modal
  - **Target**: `@framecraft/ui/src/components/modals/`

#### Content Components

- `MarkdownPage.tsx` - Markdown page renderer
  - **Target**: `@framecraft/ui/src/components/content/`
- `Seo.tsx` - SEO metadata component
  - **Target**: `@framecraft/ui/src/components/seo/`

#### Hero Components

- `Hero.tsx` - Hero banner component
  - **Target**: `@framecraft/ui/src/components/layout/` or `marketing/`

#### Overlay Components

- `MatPreviewOverlay.tsx` - Mat preview overlay
  - **Target**: `@framecraft/ui/src/components/overlay/`

#### Upload Components

- `ObjectUploader.tsx` - Object/file uploader
  - **Target**: `@framecraft/ui/src/components/media/`

#### Icon Components (`components/icons/`)

- `CurrencyIcon.tsx` - Currency icon
  - **Target**: `@framecraft/ui/src/components/icons/`
- `PostageStampIcon.tsx` - Postage stamp icon
  - **Target**: `@framecraft/ui/src/components/icons/`

**Extraction Strategy**:

- **Priority**: MEDIUM
- Group by functionality
- Evaluate if all are needed in shared package

---

## Dependency Mapping

### Component Dependency Graph

```
UI Primitives (button, card, etc.)
    ↓
Custom UI Components (PriceBox, QuantitySelector, etc.)
    ↓
Layout Components (Header, Footer)
    ↓
Core Designers (FrameDesigner, CanvasFrameDesigner, ShadowboxDesigner)
    ↓
Specialty Designers (all specialty frame designers)
    ↓
Page Components (Home, Gallery, etc.) - STAY IN APPS
```

### Key Dependencies

1. **Header/Footer** depend on:
   - UI components (Button, Sheet, etc.)
   - Navigation components (all MegaMenu components)
   - Config files (header.config, brand.config)
   - Routing (wouter)

2. **FrameDesigner** depends on:
   - Many UI components
   - Services (products, pricing, shopify)
   - Utilities (dimensions, export)
   - Hooks (useToast, useIsMobile, etc.)
   - Types (FrameStyle, MatColor, etc.)
   - PhotoUploadOptions
   - RecommendationCarousel
   - ARViewer
   - BrassNameplateSection
   - HangingHardwareSection

3. **Specialty Designers** depend on:
   - UI components
   - Shared specialty components (BaseLifestyleCarousel, etc.)
   - Preview components
   - Layout galleries
   - Lifestyle carousels

---

## Extraction Plan & Priorities

### Phase 1: Foundation (High Priority)

1. **Extract UI Primitives** (P1-011)
   - All Shadcn/ui components
   - Custom UI components (ColorSwatches, PriceBox, etc.)
   - Estimated effort: 6 hours

2. **Create UI Package Structure** (P1-010)
   - Set up package structure
   - Configure TypeScript
   - Set up barrel exports
   - Estimated effort: 3 hours

3. **Extract Layout Components** (P1-012, P1-013)
   - Header/Footer (with refactoring for configurability)
   - Navigation components
   - Logo, ThemeProvider, ThemeToggle
   - Estimated effort: 8 hours total

### Phase 2: Core Functionality (High Priority)

4. **Extract Core Designers** (P1-014, P1-015, P1-016)
   - FrameDesigner (needs refactoring)
   - CanvasFrameDesigner
   - ShadowboxDesigner
   - Estimated effort: 12 hours total

5. **Extract Specialty Designers** (P1-017)
   - All specialty frame designers
   - Preview components
   - Layout galleries
   - Lifestyle carousels
   - Estimated effort: 16 hours

6. **Extract Specialty Shared Components** (P1-018)
   - BaseLifestyleCarousel
   - HangingHardwareSection
   - BottomWeightedMatting
   - Estimated effort: 4 hours

### Phase 3: Supporting Components (Medium Priority)

7. **Extract Brass Nameplate Components** (P1-019)
   - All brass nameplate components
   - Estimated effort: 4 hours

8. **Extract Utility Components** (P1-020, P1-021)
   - ErrorBoundary
   - Media components (ARViewer, ImageEditor, etc.)
   - Display components (FrameCard, FramePreview, etc.)
   - Estimated effort: 8 hours

9. **Extract Marketing Components** (P1-022)
   - Home showcase components
   - Marketing components
   - Recommendation/Testimonial carousels
   - Estimated effort: 6 hours

### Phase 4: Content Components (Low Priority)

10. **Extract Content Components** (P1-023)
    - MarkdownPage
    - Seo component
    - Estimated effort: 2 hours

---

## Breaking Changes & Refactoring Required

### High Priority Refactoring

1. **Header/Footer Configuration**
   - Current: Direct imports from config files
   - Required: Props-based configuration
   - Impact: Medium (used in all pages)

2. **FrameDesigner Service Dependencies**
   - Current: Direct imports of services
   - Required: Dependency injection or context
   - Impact: High (core component)

3. **Routing Abstraction**
   - Current: Direct wouter usage
   - Required: Abstraction layer or props-based routing
   - Impact: Medium (navigation components)

4. **Brand Configuration**
   - Current: Direct imports from brand.config
   - Required: Context or props-based configuration
   - Impact: High (many components)

### Medium Priority Refactoring

5. **Image Upload Logic**
   - Extract to separate service/component
   - Make upload provider configurable

6. **Pricing Calculation**
   - Extract to @framecraft/core
   - Make pricing engine injectable

7. **Configuration Serialization**
   - Extract to @framecraft/core
   - Make format configurable

---

## Package Organization Strategy

### @framecraft/ui Package Structure

```
packages/ui/src/
├── components/
│   ├── ui/              # Shadcn/ui + custom UI primitives
│   ├── layout/          # Header, Footer, Navigation, Logo, Theme
│   ├── specialty/       # All specialty designers + previews
│   │   ├── brass-nameplate/
│   │   └── shared/
│   ├── marketing/       # Marketing/showcase components
│   ├── media/           # Image/media components
│   ├── display/         # Display/card components
│   ├── modals/          # Modal components
│   ├── content/         # Content rendering components
│   ├── seo/             # SEO components
│   ├── overlay/         # Overlay components
│   ├── icons/           # Custom icon components
│   ├── error/           # Error handling components
│   └── gamification/    # Achievement/gamification (optional)
├── hooks/               # Shared hooks (if any)
├── utils/               # UI utilities (if any)
└── index.ts             # Barrel exports
```

---

## Extraction Recommendations

### Do Extract (High Priority)

- ✅ All UI primitive components
- ✅ Layout components (with refactoring)
- ✅ Core designers (FrameDesigner, etc.)
- ✅ All specialty designers
- ✅ Specialty shared components
- ✅ Brass nameplate components
- ✅ Utility components (ErrorBoundary, media, display)

### Conditionally Extract (Medium Priority)

- ⚠️ Marketing/home components (make highly configurable)
- ⚠️ Achievement components (evaluate if store-specific)
- ⚠️ Content components (may be store-specific)

### Don't Extract (Keep in Apps)

- ❌ Page components (Home, Gallery, etc.)
- ❌ Store-specific business logic
- ❌ Store-specific routes/routing config

---

## Next Steps

1. ✅ Complete this audit document
2. ⏭️ Create @framecraft/ui package structure (P1-010)
3. ⏭️ Extract UI primitives (P1-011)
4. ⏭️ Extract layout components (P1-012, P1-013)
5. ⏭️ Extract core designers (P1-014, P1-015, P1-016)
6. ⏭️ Extract specialty designers (P1-017)
7. ⏭️ Extract remaining components (P1-018 through P1-023)

---

## Notes

- This audit is based on exploration of `CustomFrameSizes-CODE/client/src/components/`
- Some components may have additional dependencies not listed here
- Refactoring effort may be higher than estimated for complex components
- Consider incremental extraction to minimize breaking changes
- Test thoroughly after each extraction phase

---

**Document Status**: ✅ Complete  
**Last Updated**: 2025-01-XX  
**Next Review**: After P1-010 completion
