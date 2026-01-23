# Phase 2: Store Launches & Iteration - Updated Tickets

**Created**: January 2026  
**Last Updated**: January 2026  
**Phase**: Phase 2 - Store Launches & Iteration  
**Estimated Duration**: 10-12 weeks  
**Total Estimated Hours**: 400-480 hours

---

## Phase 2 Overview

Phase 2 focuses on **migrating all pages from the original CustomFrameSizes-CODE** into the new monorepo architecture, launching the first production store (Store A), and validating the multi-store architecture. This phase will prove the architecture works in production while preserving all existing functionality and SEO value.

### Key Principles

1. **Preserve All Functionality** - Every page from the original must be migrated
2. **Maintain SEO** - All URLs, meta tags, and structured data preserved
3. **Restructure for Multi-Store** - Use shared packages, but allow per-store customization
4. **Incremental Migration** - Build and test pages incrementally
5. **Next.js App Router** - Migrate from Wouter to Next.js App Router

### Prerequisites from Phase 1

All Phase 1 deliverables are complete:

- ✅ Monorepo infrastructure with Turborepo
- ✅ All shared packages (@framecraft/ui, @framecraft/core, @framecraft/config, @framecraft/types, @framecraft/data)
- ✅ Shopify Storefront API integration (basic)
- ✅ Shopify Admin API integration (apps/api)
- ✅ Multi-store configuration system
- ✅ StoreProvider with direct config passing
- ✅ Database multi-tenancy with siteId
- ✅ Cart state management with Zustand

---

## Section 2.1: First Store Setup (Store A - Complete Migration)

**Goal**: Migrate all pages from CustomFrameSizes-CODE to Store A, maintaining all functionality while using the new architecture.

### Ticket P2-001: Create Store A Application Scaffold ✅

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Status**: ✅ COMPLETE

**Estimated Hours**: 6 hours

**Description**:
Set up the first production store application in the monorepo with Next.js 14+ App Router.

**Tasks**:

- ✅ Create `apps/store-a/` directory with Next.js 14+ App Router
- ✅ Initialize package.json with name `@framecraft/store-a`
- ✅ Install all @framecraft/\* package dependencies
- ✅ Configure TypeScript extending workspace base config
- ✅ Set up Next.js configuration (next.config.js)
- ✅ Configure Tailwind CSS with theme from @framecraft/config
- ✅ Create basic app directory structure (app/, components/, lib/)
- ✅ Set up environment variable loading
- ✅ Create initial layout.tsx with StoreProvider
- ✅ Test development server starts correctly

**Acceptance Criteria**:

- ✅ `apps/store-a/` exists with proper Next.js structure
- ✅ All @framecraft/\* packages installed and importable
- ✅ Development server runs: `npm run dev --filter=@framecraft/store-a`
- ✅ Basic page renders with store-specific styling
- ✅ Environment variables load correctly
- ✅ TypeScript compilation works without errors

**Dependencies**: None (first ticket)

---

### Ticket P2-002: Configure Store A Brand Identity ✅

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Status**: ✅ COMPLETE

**Estimated Hours**: 4 hours

**Description**:
Create the brand configuration file for Store A with all identity elements, theme overrides, and feature flags.

**Tasks**:

- ✅ Create `apps/store-a/src/brand.config.ts`
- ✅ Define brand identity (store name, legal name, URLs)
- ✅ Configure theme colors (primary, secondary, accent)
- ✅ Configure typography (heading font, body font)
- ✅ Set up navigation structure
- ✅ Configure feature flags based on store focus
- ✅ Set up SEO defaults (title, description, OG images)
- ✅ Add Shopify store credentials configuration

**Acceptance Criteria**:

- ✅ `brand.config.ts` follows BrandConfig interface from @framecraft/config
- ✅ Theme colors apply correctly to components
- ✅ Typography renders with specified fonts
- ✅ Feature flags control component visibility
- ✅ SEO defaults render in page metadata
- ✅ Configuration validated at build time

**Dependencies**: P2-001

---

### Ticket P2-003: Set Up Store A Providers and Context ✅

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Status**: ✅ COMPLETE

**Estimated Hours**: 4 hours

**Description**:
Configure all React providers (Store Context, Theme, Query Client, Cart) for Store A.

**Tasks**:

- ✅ Create providers wrapper component
- ✅ Set up StoreProvider with brand config (direct config passing)
- ✅ Configure ThemeProvider with merged theme
- ✅ Set up TanStack Query provider
- ✅ Initialize cart store with store-specific configuration
- ✅ Set up error boundary provider
- ✅ Configure Sentry provider for error tracking

**Acceptance Criteria**:

- ✅ All providers wrap the application correctly
- ✅ Store context accessible throughout app
- ✅ Theme applies to all components
- ✅ TanStack Query works for data fetching
- ✅ Cart store initializes with correct storeId
- ✅ Error boundaries catch and report errors

**Dependencies**: P2-002

---

### Ticket P2-004: Migrate Shared Layout Components (Header & Footer)

**Labels**: `phase-2.1`, `priority-high`, `frontend`

**Estimated Hours**: 8 hours

**Description**:
Migrate Header and Footer components from original codebase to shared packages, then use in Store A.

**Tasks**:

- Review original Header component (`CustomFrameSizes-CODE/client/src/components/Header.tsx`)
- Review original Footer component (`CustomFrameSizes-CODE/client/src/components/Footer.tsx`)
- Extract to `packages/ui/src/components/layout/Header.tsx`
- Extract to `packages/ui/src/components/layout/Footer.tsx`
- Make components store-config aware (use `useStoreConfig()`)
- Update navigation to use config from context
- Update branding/logos to use config from context
- Test responsive behavior
- Add to Store A layout

**Acceptance Criteria**:

- [ ] Header displays store logo and branding from config
- [ ] Navigation items match brand config
- [ ] Footer shows correct store information
- [ ] Mobile navigation works smoothly
- [ ] Cart icon shows correct item count
- [ ] All navigation is accessible (keyboard, screen readers)
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Components work with different store configs

**Files to Create/Modify**:

- `packages/ui/src/components/layout/Header.tsx` (new - migrated)
- `packages/ui/src/components/layout/Footer.tsx` (new - migrated)
- `packages/ui/src/components/layout/MobileNav.tsx` (new - if needed)
- `apps/store-a/app/layout.tsx` (update - add Header/Footer)

**Dependencies**: P2-003

---

### Ticket P2-005: Build Complete Homepage with All Sections

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Estimated Hours**: 16 hours

**Description**:
Migrate the complete homepage from original, including all sections: Hero, FrameDesigner, testimonials, showcases, and more.

**Tasks**:

- Review original Home page (`CustomFrameSizes-CODE/client/src/pages/Home.tsx`)
- Migrate Hero component to `packages/ui/src/components/home/Hero.tsx`
- Migrate TestimonialCarousel to `packages/ui/src/components/home/TestimonialCarousel.tsx`
- Migrate FrameDesigner integration (already in packages/ui)
- Migrate HowItWorks section
- Migrate ValueProps section
- Migrate InspirationGallery section
- Migrate EducationTeasers section
- Migrate FaqMini section
- Migrate SeoTextBlock section
- Migrate FrameStylesShowcase section
- Migrate ShadowboxShowcase section
- Migrate CanvasFramesShowcase section
- Migrate GlazingShowcase section
- Migrate MatDesignerShowcase section
- Migrate SpecialtyDesignersShowcase section
- Migrate PrintAndFrameService section
- Create `apps/store-a/app/page.tsx` with all sections
- Configure home sections via brand config
- Add SEO metadata and structured data
- Test all sections render correctly
- Test responsive design

**Acceptance Criteria**:

- [ ] Homepage loads in < 2 seconds
- [ ] Hero section displays with store branding
- [ ] FrameDesigner embedded and functional
- [ ] All showcase sections display correctly
- [ ] Testimonials rotate (if enabled)
- [ ] All CTAs link to correct pages
- [ ] SEO metadata renders correctly
- [ ] Structured data validates (Schema.org)
- [ ] Page is fully responsive
- [ ] Images are optimized and lazy loaded
- [ ] Feature flags control section visibility

**Files to Create/Modify**:

- `packages/ui/src/components/home/Hero.tsx` (new - migrated)
- `packages/ui/src/components/home/TestimonialCarousel.tsx` (new - migrated)
- `packages/ui/src/components/home/HowItWorks.tsx` (new - migrated)
- `packages/ui/src/components/home/ValueProps.tsx` (new - migrated)
- `packages/ui/src/components/home/InspirationGallery.tsx` (new - migrated)
- `packages/ui/src/components/home/EducationTeasers.tsx` (new - migrated)
- `packages/ui/src/components/home/FaqMini.tsx` (new - migrated)
- `packages/ui/src/components/home/SeoTextBlock.tsx` (new - migrated)
- `packages/ui/src/components/home/FrameStylesShowcase.tsx` (new - migrated)
- `packages/ui/src/components/home/ShadowboxShowcase.tsx` (new - migrated)
- `packages/ui/src/components/home/CanvasFramesShowcase.tsx` (new - migrated)
- `packages/ui/src/components/home/GlazingShowcase.tsx` (new - migrated)
- `packages/ui/src/components/home/MatDesignerShowcase.tsx` (new - migrated)
- `packages/ui/src/components/home/SpecialtyDesignersShowcase.tsx` (new - migrated)
- `packages/ui/src/components/home/PrintAndFrameService.tsx` (new - migrated)
- `apps/store-a/app/page.tsx` (update - complete homepage)

**Dependencies**: P2-004

---

### Ticket P2-006: Migrate Frame Designer Page

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Estimated Hours**: 4 hours

**Description**:
Create dedicated frame designer page route (separate from homepage).

**Tasks**:

- Review original Designer page (`CustomFrameSizes-CODE/client/src/pages/Designer.tsx`)
- Create `apps/store-a/app/designer/page.tsx`
- Import FrameDesigner from `@framecraft/ui`
- Add page metadata and SEO
- Test all frame configuration options
- Test image upload functionality
- Verify pricing calculations are accurate

**Acceptance Criteria**:

- [ ] Frame designer page accessible at `/designer`
- [ ] All frame styles load correctly
- [ ] Mat selection works (single/double)
- [ ] Glass selection works
- [ ] Dimension inputs validate correctly
- [ ] Pricing updates in real-time
- [ ] Image upload works
- [ ] Configuration persists during session

**Files to Create/Modify**:

- `apps/store-a/app/designer/page.tsx` (new)

**Dependencies**: P2-005

---

### Ticket P2-007: Migrate Specialty Designer Pages

**Labels**: `phase-2.1`, `priority-high`, `frontend`

**Estimated Hours**: 12 hours

**Description**:
Migrate all specialty designer pages (Shadowbox, Jersey, Canvas, Puzzle, Comic, Playbill, etc.).

**Tasks**:

- Review all specialty designer pages from original
- Create dynamic route: `apps/store-a/app/designer/[type]/page.tsx`
- Migrate ShadowboxDesigner page
- Migrate JerseyFrames page
- Migrate Canvas page
- Migrate PuzzleFrames page
- Migrate ComicBookFrames page
- Migrate PlaybillFrames page (if exists)
- Migrate other specialty pages
- Connect all designers to cart with proper serialization
- Add navigation items for enabled designers
- Test each designer type

**Acceptance Criteria**:

- [ ] All specialty designers accessible via `/designer/[type]`
- [ ] Only enabled specialty designers are accessible (feature flags)
- [ ] Disabled designers return 404 or redirect
- [ ] Each enabled designer functions correctly
- [ ] Add to cart works for each designer type
- [ ] Configuration serialization is correct per type
- [ ] Navigation shows only enabled designers

**Files to Create/Modify**:

- `apps/store-a/app/designer/[type]/page.tsx` (new - dynamic route)
- `apps/store-a/src/components/designer/SpecialtyDesignerRouter.tsx` (new)

**Dependencies**: P2-006

---

### Ticket P2-008: Migrate Gateway Pages (Frames by Style/Color/Size)

**Labels**: `phase-2.1`, `priority-high`, `frontend`, `seo`

**Estimated Hours**: 10 hours

**Description**:
Migrate SEO-optimized gateway pages for browsing frames by style, color, and size.

**Tasks**:

- Review original gateway pages:
  - `FramesByStyle.tsx` and `FramesByStyleDetail.tsx`
  - `FramesByColor.tsx` and `FramesByColorDetail.tsx`
  - `FramesBySize.tsx` and `FrameSizePage.tsx`
- Create routes:
  - `/frames/styles` - List all frame styles
  - `/frames/styles/[slug]` - Individual style detail
  - `/frames/colors` - List all frame colors
  - `/frames/colors/[slug]` - Individual color detail
  - `/frames/sizes` - List all frame sizes
  - `/frames/sizes/[slug]` - Individual size detail
- Migrate gateway components to `packages/ui`
- Ensure SEO metadata is preserved
- Test all gateway pages render correctly

**Acceptance Criteria**:

- [ ] All gateway pages accessible
- [ ] SEO metadata preserved
- [ ] Structured data included
- [ ] Images load correctly
- [ ] Links to designers work
- [ ] Responsive design works

**Files to Create/Modify**:

- `apps/store-a/app/frames/styles/page.tsx` (new)
- `apps/store-a/app/frames/styles/[slug]/page.tsx` (new)
- `apps/store-a/app/frames/colors/page.tsx` (new)
- `apps/store-a/app/frames/colors/[slug]/page.tsx` (new)
- `apps/store-a/app/frames/sizes/page.tsx` (new)
- `apps/store-a/app/frames/sizes/[slug]/page.tsx` (new)
- `packages/ui/src/components/gateway/` (new - gateway components)

**Dependencies**: P2-005

---

### Ticket P2-009: Migrate Individual Frame Style Pages

**Labels**: `phase-2.1`, `priority-medium`, `frontend`, `seo`

**Estimated Hours**: 16 hours

**Description**:
Migrate all individual frame style pages (ModernBlack, WideBlack, MuseumBronze, etc.) - these are important for SEO.

**Tasks**:

- Review all individual frame pages from original (50+ pages)
- Create dynamic route: `apps/store-a/app/frames/[style-slug]/page.tsx`
- Generate pages from frame data in `@framecraft/data`
- Preserve all SEO metadata
- Preserve structured data
- Test a sample of pages
- Verify all frame pages are accessible

**Note**: Many individual frame pages can be generated programmatically from frame data rather than creating 50+ separate files.

**Acceptance Criteria**:

- [ ] All frame style pages accessible
- [ ] SEO metadata preserved
- [ ] Structured data included
- [ ] Images load correctly
- [ ] "Design in this style" CTA works
- [ ] Responsive design works

**Files to Create/Modify**:

- `apps/store-a/app/frames/[style-slug]/page.tsx` (new - dynamic route)
- `apps/store-a/app/frames/[style-slug]/generateStaticParams.ts` (new - for static generation)

**Dependencies**: P2-008

---

### Ticket P2-010: Migrate Content Pages (About, Contact, Learn, etc.)

**Labels**: `phase-2.1`, `priority-high`, `frontend`

**Estimated Hours**: 8 hours

**Description**:
Migrate all content pages: About, Contact, Learn, Blog, Generic pages (FAQ, policies, etc.).

**Tasks**:

- Review original content pages:
  - `AboutPage.tsx`
  - `ContactPage.tsx`
  - `LearnPage.tsx`
  - `BlogIndexPage.tsx`
  - `BlogPostPage.tsx`
  - `GenericPage.tsx` (for markdown content)
- Create routes:
  - `/about` - About page
  - `/contact` - Contact page
  - `/learn` - Learning hub
  - `/blog` - Blog index
  - `/blog/[slug]` - Individual blog posts
  - `/[slug]` - Generic markdown pages (FAQ, policies, etc.)
- Migrate markdown content from `content/` directory
- Preserve SEO metadata
- Test all content pages

**Acceptance Criteria**:

- [ ] All content pages accessible
- [ ] Markdown content renders correctly
- [ ] SEO metadata preserved
- [ ] Contact form works (if applicable)
- [ ] Blog posts display correctly
- [ ] Generic pages work

**Files to Create/Modify**:

- `apps/store-a/app/about/page.tsx` (new)
- `apps/store-a/app/contact/page.tsx` (new)
- `apps/store-a/app/learn/page.tsx` (new)
- `apps/store-a/app/blog/page.tsx` (new)
- `apps/store-a/app/blog/[slug]/page.tsx` (new)
- `apps/store-a/app/[slug]/page.tsx` (new - generic markdown pages)
- `content/` directory (migrate from original)

**Dependencies**: P2-004

---

### Ticket P2-011: Migrate Resource Pages

**Labels**: `phase-2.1`, `priority-medium`, `frontend`, `seo`

**Estimated Hours**: 6 hours

**Description**:
Migrate all resource/guide pages (how-to-measure, mat-cutting-guide, etc.).

**Tasks**:

- Review original resource pages in `pages/resources/`
- Create route: `apps/store-a/app/resources/[slug]/page.tsx`
- Migrate all resource markdown files
- Preserve SEO metadata
- Test all resource pages

**Acceptance Criteria**:

- [ ] All resource pages accessible
- [ ] Content renders correctly
- [ ] SEO metadata preserved
- [ ] Internal links work

**Files to Create/Modify**:

- `apps/store-a/app/resources/[slug]/page.tsx` (new - dynamic route)
- `content/resources/` (migrate from original)

**Dependencies**: P2-010

---

### Ticket P2-012: Migrate Gallery and Achievements Pages

**Labels**: `phase-2.1`, `priority-medium`, `frontend`

**Estimated Hours**: 4 hours

**Description**:
Migrate Gallery and Achievements pages (if feature flags enabled).

**Tasks**:

- Review original Gallery page
- Review original Achievements page
- Create routes:
  - `/gallery` - Saved designs gallery
  - `/achievements` - Gamification achievements
- Connect to database (when ready)
- Test with feature flags

**Acceptance Criteria**:

- [ ] Gallery page accessible (if enabled)
- [ ] Achievements page accessible (if enabled)
- [ ] Feature flags control visibility
- [ ] Pages work correctly

**Files to Create/Modify**:

- `apps/store-a/app/gallery/page.tsx` (new)
- `apps/store-a/app/achievements/page.tsx` (new)

**Dependencies**: P2-010

---

### Ticket P2-013: Implement Cart Page

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Estimated Hours**: 6 hours

**Description**:
Build the cart page with full cart management functionality.

**Tasks**:

- Create cart page route: `/cart`
- Display cart items with configurations
- Show frame preview images for each item
- Implement quantity update functionality
- Implement item removal functionality
- Show pricing breakdown per item
- Calculate and display cart totals
- Add continue shopping link
- Add proceed to checkout button
- Handle empty cart state
- Implement cart item editing (link back to designer)

**Acceptance Criteria**:

- [ ] Cart page shows all items correctly
- [ ] Configuration details display for each item
- [ ] Quantity changes update pricing
- [ ] Item removal works with confirmation
- [ ] Totals calculate correctly
- [ ] Checkout button works
- [ ] Empty cart shows appropriate message
- [ ] Edit links open designer with correct configuration

**Files to Create/Modify**:

- `apps/store-a/app/cart/page.tsx` (new)
- `packages/ui/src/components/cart/CartItem.tsx` (new)
- `packages/ui/src/components/cart/CartSummary.tsx` (new)
- `packages/ui/src/components/cart/EmptyCart.tsx` (new)

**Dependencies**: P2-006

---

### Ticket P2-014: Implement Checkout Flow

**Labels**: `phase-2.1`, `priority-critical`, `frontend`, `backend`

**Estimated Hours**: 6 hours

**Description**:
Implement the checkout flow that redirects to Shopify checkout.

**Tasks**:

- Create checkout initiation page/component
- Implement checkout API call to `/api/checkout`
- Handle discount code input (optional)
- Collect customer email for cart recovery
- Redirect to Shopify checkout URL
- Implement checkout error handling
- Add checkout abandonment tracking
- Create checkout loading state
- Test full checkout flow end-to-end

**Acceptance Criteria**:

- [ ] Checkout button initiates checkout process
- [ ] Discount codes apply correctly
- [ ] Customer email captured (if provided)
- [ ] Redirect to Shopify checkout works
- [ ] Errors display user-friendly messages
- [ ] Checkout tracking events fire
- [ ] Loading state shows during processing
- [ ] Order completes successfully in Shopify

**Files to Create/Modify**:

- `apps/store-a/src/components/checkout/CheckoutButton.tsx` (new)
- `apps/store-a/src/hooks/use-checkout.ts` (new)
- `apps/store-a/app/checkout/page.tsx` (new - optional intermediate page)

**Dependencies**: P2-013

---

### Ticket P2-015: Set Up Redirects for Legacy URLs

**Labels**: `phase-2.1`, `priority-critical`, `seo`, `infrastructure`

**Estimated Hours**: 4 hours

**Description**:
Implement 301 redirects for all legacy URLs from original site to preserve SEO.

**Tasks**:

- Review all redirects from original App.tsx
- Create redirect map (JSON file)
- Implement redirects in `next.config.js`
- Test all redirects work correctly
- Verify 301 status codes
- Document redirect strategy

**Acceptance Criteria**:

- [ ] All legacy URLs redirect correctly
- [ ] 301 status codes used
- [ ] Redirects preserve query parameters
- [ ] No redirect loops
- [ ] Redirects tested and verified

**Files to Create/Modify**:

- `apps/store-a/next.config.js` (update - add redirects)
- `apps/store-a/lib/redirects.ts` (new - redirect map)

**Dependencies**: P2-009

---

### Ticket P2-016: Create Shopify Store for Store A (Early Setup)

**Labels**: `phase-2.1`, `priority-critical`, `shopify`, `infrastructure`

**Estimated Hours**: 4 hours (Basic setup) + 4 hours (Full configuration) = 8 hours total

**Description**:
Set up the Shopify store account and configure it for headless operation. This should be done EARLY (Week 1) to validate architecture, but full configuration can be done later.

**Phase 1: Basic Setup (Do This First - Week 1)**

- Create Shopify store account (Development or Plus)
- Create private app for API access
- Generate Storefront API access token
- Generate Admin API access token
- Create "Custom Frame" product (placeholder, $0 price)
- Test API tokens work
- Document credentials

**Phase 2: Full Configuration (Can Do Later - Week 5+)**

- Configure store settings (name, address, currency)
- Set up payment gateways (Stripe, PayPal, etc.)
- Configure shipping rates and zones
- Set up tax settings
- Configure checkout customization
- Set up order notification emails
- Document all Shopify configuration

**Acceptance Criteria - Phase 1 (Week 1):**

- [ ] Shopify store created and accessible
- [ ] Storefront API token generated and tested
- [ ] Admin API token generated and tested
- [ ] Custom Frame product created
- [ ] API tokens work (can fetch products)
- [ ] Credentials documented

**Acceptance Criteria - Phase 2 (Week 5+):**

- [ ] Payment gateways configured and tested
- [ ] Shipping rates configured
- [ ] Tax settings configured
- [ ] Checkout customization applied
- [ ] All settings documented

**Deliverables**:

- Shopify store configuration document
- API credentials (stored securely)

**Dependencies**: None (can be done in parallel with UI development)

**Note**: Basic setup (Phase 1) should be done early to validate architecture. Full configuration (Phase 2) can wait until UI is ready for integration testing.

---

### Ticket P2-017: Create Custom Frame Product in Shopify

**Labels**: `phase-2.1`, `priority-critical`, `shopify`

**Estimated Hours**: 2 hours (Basic) + 2 hours (Enhanced) = 4 hours total

**Description**:
Create the custom frame product(s) in Shopify that will be used for all frame orders. Basic product can be created early, enhancements can be added later.

**Phase 1: Basic Product (Week 1)**

- Create "Custom Frame" product
- Create one variant (placeholder)
- Set price to $0.00 (pricing is dynamic)
- Configure inventory settings (do not track)
- Test product appears in Storefront API
- Document variant ID

**Phase 2: Enhanced Product (Week 5+)**

- Add product images (placeholder)
- Write product description and SEO metadata
- Set up product variants for different base price tiers (if needed)
- Configure product to allow custom pricing via line item properties
- Set up product collections (optional)
- Test line item properties work correctly
- Document product configuration

**Acceptance Criteria - Phase 1:**

- [ ] Custom frame product created in Shopify
- [ ] Product accessible via Storefront API
- [ ] Variant ID documented
- [ ] Can fetch product via API

**Acceptance Criteria - Phase 2:**

- [ ] Line item properties work correctly
- [ ] Product can be added to cart with custom price
- [ ] Product appears in checkout correctly
- [ ] Configuration documented

**Files to Create/Modify**:

- Documentation: `docs/shopify/store-a-products.md` (new)

**Dependencies**: P2-016 (Phase 1 can be done with P2-016 Phase 1)

---

### Ticket P2-017.5: Set Up Backend API Structure (Early Setup)

**Labels**: `phase-2.1`, `priority-high`, `backend`, `infrastructure`

**Estimated Hours**: 4 hours

**Description**:
Deploy the backend API structure early (Week 1) with placeholder/mock endpoints. This establishes the architecture and allows UI to connect to API endpoints even before full Shopify integration is ready.

**Tasks**:

- Deploy `apps/api` to Vercel
- Set up basic Vercel project configuration
- Create placeholder endpoints that return mock data:
  - `POST /api/cart` - Returns mock cart
  - `PATCH /api/cart/lines` - Returns mock updated cart
  - `POST /api/checkout` - Returns mock checkout URL
  - `POST /api/orders/files` - Returns mock success
- Set up environment variable structure
- Configure CORS (if needed)
- Test API endpoints are accessible
- Document API structure
- Update UI to use API endpoints (can use mock responses initially)

**Acceptance Criteria**:

- [ ] Backend API deployed to Vercel
- [ ] All placeholder endpoints return mock data
- [ ] API endpoints are accessible
- [ ] Environment variables structure documented
- [ ] UI can connect to API (even with mock data)
- [ ] API structure documented

**Files to Create/Modify**:

- `apps/api/vercel.json` (update)
- `apps/api/src/routes/cart/route.ts` (update - add mock mode)
- `apps/api/src/routes/checkout/route.ts` (update - add mock mode)
- `docs/api/structure.md` (new)

**Dependencies**: None (can be done in parallel with UI development)

**Note**: This establishes the API architecture early. Real Shopify integration can be added later when UI is ready.

---

### Ticket P2-018: Configure Store A Environment Variables

**Labels**: `phase-2.1`, `priority-critical`, `infrastructure`

**Estimated Hours**: 2 hours

**Description**:
Set up all environment variables for Store A in local development and prepare for Vercel deployment.

**Tasks**:

- Create `.env.local` for local development
- Configure Shopify API credentials
- Configure Sentry DSN
- Configure API endpoint URLs
- Set up SITE_ID for multi-tenancy
- Create `.env.production` template
- Document all required environment variables
- Verify all environment variables work correctly

**Acceptance Criteria**:

- [ ] All environment variables configured locally
- [ ] Application runs correctly with env vars
- [ ] Shopify API calls work
- [ ] Sentry integration works
- [ ] Environment variables documented
- [ ] Production template created

**Files to Create/Modify**:

- `apps/store-a/.env.local` (new - git ignored)
- `apps/store-a/.env.example` (update)
- `apps/store-a/src/lib/env.ts` (update - env validation)

**Dependencies**: P2-016

---

### Ticket P2-019: Configure Store A Domain

**Labels**: `phase-2.1`, `priority-high`, `infrastructure`

**Estimated Hours**: 3 hours

**Description**:
Set up domain configuration for Store A including DNS and SSL.

**Tasks**:

- Purchase or configure domain name
- Set up DNS records (A, CNAME for Vercel)
- Configure domain in Vercel project
- Set up SSL certificate (automatic via Vercel)
- Configure www redirect (if needed)
- Set up email forwarding (if needed)
- Update brand config with production URLs
- Test domain resolution
- Document DNS configuration

**Acceptance Criteria**:

- [ ] Domain purchased/configured
- [ ] DNS records set up correctly
- [ ] SSL certificate active
- [ ] Domain resolves to Vercel deployment
- [ ] www redirect works (if configured)
- [ ] Production URLs work correctly
- [ ] DNS configuration documented

**Deliverables**:

- DNS configuration document

**Dependencies**: P2-001

---

### Ticket P2-020: Full Integration Testing - Store A

**Labels**: `phase-2.1`, `priority-critical`, `testing`

**Estimated Hours**: 12 hours

**Description**:
Comprehensive testing of all Store A functionality before production deployment.

**Tasks**:

- Test all frame designer configurations
- Test all enabled specialty designers
- Test image upload and processing
- Test pricing calculations match expected values
- Test cart operations (add, update, remove)
- Test checkout flow end-to-end
- Test order appears correctly in Shopify
- Test all page routes work correctly
- Test redirects work correctly
- Test responsive design on mobile devices
- Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Test accessibility (keyboard navigation, screen readers)
- Test dark mode (if enabled)
- Test SEO metadata on all pages
- Document all test results
- Create bug reports for any issues found

**Acceptance Criteria**:

- [ ] All frame configurations work correctly
- [ ] Specialty designers work correctly
- [ ] Image upload works
- [ ] Pricing is accurate
- [ ] Cart operations work
- [ ] Checkout completes successfully
- [ ] Orders appear in Shopify correctly
- [ ] All pages accessible and functional
- [ ] Redirects work correctly
- [ ] Mobile experience is good
- [ ] Cross-browser compatible
- [ ] Accessibility meets WCAG 2.1 AA
- [ ] SEO metadata correct on all pages
- [ ] All bugs documented and triaged

**Deliverables**:

- Test results document
- Bug report list

**Dependencies**: P2-001 through P2-019

---

### Ticket P2-021: Deploy Store A to Vercel Production

**Labels**: `phase-2.1`, `priority-critical`, `infrastructure`

**Estimated Hours**: 4 hours

**Description**:
Deploy Store A to Vercel production environment and verify everything works.

**Tasks**:

- Create Vercel project for Store A
- Connect to Git repository
- Configure production environment variables
- Configure build settings
- Configure domain in Vercel
- Deploy to production
- Verify deployment health
- Test all functionality in production
- Set up Vercel Analytics (optional)
- Configure preview deployments for PRs
- Document deployment process

**Acceptance Criteria**:

- [ ] Vercel project created and configured
- [ ] Production environment variables set
- [ ] Production deployment successful
- [ ] Domain resolves to production
- [ ] All functionality works in production
- [ ] Analytics configured (if desired)
- [ ] Preview deployments work
- [ ] Deployment process documented

**Files to Create/Modify**:

- `apps/store-a/vercel.json` (new - if custom config needed)
- `docs/deployment/store-a.md` (new)

**Dependencies**: P2-019, P2-020

---

### Ticket P2-022: Post-Launch Monitoring Setup - Store A

**Labels**: `phase-2.1`, `priority-high`, `infrastructure`

**Estimated Hours**: 3 hours

**Description**:
Set up monitoring and alerting for Store A production deployment.

**Tasks**:

- Verify Sentry error tracking is working
- Set up Sentry alerts for critical errors
- Configure Vercel Analytics (if not done)
- Set up uptime monitoring (UptimeRobot, Vercel Checks, etc.)
- Create monitoring dashboard
- Set up alert notifications (Slack, email)
- Document monitoring setup
- Create incident response procedure

**Acceptance Criteria**:

- [ ] Sentry captures errors correctly
- [ ] Alerts configured for critical errors
- [ ] Analytics tracking page views and events
- [ ] Uptime monitoring active
- [ ] Alerts notify team via preferred channel
- [ ] Monitoring documented
- [ ] Incident response procedure documented

**Deliverables**:

- Monitoring configuration document
- Incident response procedure

**Dependencies**: P2-021

---

## Section 2.2: Second Store Setup (Store B - Architecture Validation)

**Goal**: Launch a second store with different branding to validate the multi-store architecture is flexible and reusable.

### Ticket P2-023: Create Store B Application (Clone from Store A)

**Labels**: `phase-2.2`, `priority-high`, `frontend`

**Estimated Hours**: 4 hours

**Description**:
Create Store B by cloning Store A structure and updating configuration.

**Tasks**:

- Copy `apps/store-a/` to `apps/store-b/`
- Update package.json name to `@framecraft/store-b`
- Update all store-specific references
- Clear store-specific content
- Reset environment variables
- Test Store B runs independently
- Document Store B creation process

**Acceptance Criteria**:

- [ ] `apps/store-b/` exists as independent store
- [ ] Package name is `@framecraft/store-b`
- [ ] Store B runs independently: `npm run dev --filter=@framecraft/store-b`
- [ ] No references to Store A remain
- [ ] Creation process documented

**Files to Create/Modify**:

- `apps/store-b/` (new - copy of store-a)
- `apps/store-b/package.json` (update)

**Dependencies**: P2-021 (Store A complete)

---

### Ticket P2-024: Configure Store B Brand Identity (Different Focus)

**Labels**: `phase-2.2`, `priority-high`, `frontend`

**Estimated Hours**: 4 hours

**Description**:
Create a distinctly different brand configuration for Store B to test architecture flexibility.

**Tasks**:

- Define different brand focus (e.g., sports memorabilia vs fine art)
- Create brand identity with different color scheme
- Choose different typography
- Configure different navigation structure
- Enable/disable different feature flags
- Set up different SEO defaults
- Document branding decisions
- Compare with Store A to ensure differentiation

**Acceptance Criteria**:

- [ ] Store B has visually distinct branding
- [ ] Different color scheme applied correctly
- [ ] Different feature flags configured
- [ ] Navigation reflects different focus
- [ ] Store B looks and feels different from Store A
- [ ] Both stores work independently

**Files to Create/Modify**:

- `apps/store-b/src/brand.config.ts` (update)

**Dependencies**: P2-023

---

### Ticket P2-025: Create Shopify Store for Store B

**Labels**: `phase-2.2`, `priority-high`, `shopify`, `infrastructure`

**Estimated Hours**: 4 hours

**Description**:
Set up a separate Shopify store for Store B (can reuse process from Store A).

**Tasks**:

- Create Shopify store account for Store B
- Configure store settings
- Set up payment and shipping
- Create API tokens
- Create custom frame product
- Document configuration

**Acceptance Criteria**:

- [ ] Store B Shopify store created
- [ ] API tokens generated and working
- [ ] Custom frame product created
- [ ] Configuration documented

**Dependencies**: P2-023

---

### Ticket P2-026: Configure Store B Environment and Deploy

**Labels**: `phase-2.2`, `priority-high`, `infrastructure`

**Estimated Hours**: 3 hours

**Description**:
Configure environment variables and deploy Store B to Vercel.

**Tasks**:

- Configure Store B environment variables
- Set up SITE_ID for Store B
- Create Vercel project for Store B
- Configure domain for Store B
- Deploy to production
- Verify all functionality works

**Acceptance Criteria**:

- [ ] Environment variables configured
- [ ] Vercel project created
- [ ] Domain configured
- [ ] Production deployment successful
- [ ] All functionality works

**Dependencies**: P2-024, P2-025

---

### Ticket P2-027: Validate Shared Code Reusability

**Labels**: `phase-2.2`, `priority-high`, `testing`

**Estimated Hours**: 4 hours

**Description**:
Verify that shared packages work correctly across both stores.

**Tasks**:

- Test FrameDesigner works identically in both stores
- Test pricing calculations are consistent
- Test cart operations work correctly
- Test shared components render correctly with different themes
- Verify changes to shared packages affect both stores
- Document any store-specific edge cases
- Create guidelines for future stores

**Acceptance Criteria**:

- [ ] FrameDesigner functions identically
- [ ] Pricing calculations are consistent
- [ ] Cart operations work in both stores
- [ ] Theme customization applies correctly
- [ ] Shared package changes propagate correctly
- [ ] Edge cases documented
- [ ] Guidelines created

**Deliverables**:

- Shared code reusability report
- Future store guidelines

**Dependencies**: P2-026

---

### Ticket P2-028: Verify Data Isolation Between Stores

**Labels**: `phase-2.2`, `priority-critical`, `testing`, `backend`

**Estimated Hours**: 3 hours

**Description**:
Verify that database data is properly isolated between stores via siteId.

**Tasks**:

- Create test data in Store A database
- Create test data in Store B database
- Verify Store A cannot see Store B data
- Verify Store B cannot see Store A data
- Test order files are isolated
- Test uploaded images are isolated
- Document data isolation verification

**Acceptance Criteria**:

- [ ] Store A data invisible to Store B
- [ ] Store B data invisible to Store A
- [ ] All tables properly filter by siteId
- [ ] No data leakage between stores
- [ ] Verification documented

**Dependencies**: P2-026

---

## Section 2.3: Pricing Integration Refinement

**Goal**: Ensure pricing calculations are accurate and consistent across all stores.

### Ticket P2-029: Validate Pricing Calculations

**Labels**: `phase-2.3`, `priority-high`, `testing`

**Estimated Hours**: 6 hours

**Description**:
Comprehensive testing of pricing calculations for all frame configurations.

**Tasks**:

- Create pricing test case spreadsheet
- Test standard frame pricing (all sizes)
- Test per-linear-inch calculations
- Test oversize fees
- Test mat pricing (single, double, bottom-weighted)
- Test glass upgrade pricing
- Test specialty frame pricing (shadowbox, jersey, etc.)
- Compare calculated prices with expected values
- Document any discrepancies
- Fix any pricing bugs found

**Acceptance Criteria**:

- [ ] All standard frame prices accurate
- [ ] Per-linear-inch calculations correct
- [ ] Oversize fees apply correctly
- [ ] Mat pricing correct
- [ ] Glass pricing correct
- [ ] Specialty pricing correct
- [ ] All discrepancies resolved
- [ ] Test results documented

**Deliverables**:

- Pricing test case spreadsheet
- Pricing verification report

**Dependencies**: P2-021

---

### Ticket P2-030: Implement Store-Specific Pricing Overrides

**Labels**: `phase-2.3`, `priority-medium`, `frontend`, `backend`

**Estimated Hours**: 5 hours

**Description**:
Create system for per-store pricing adjustments (markup, discounts).

**Tasks**:

- Design pricing override configuration structure
- Add pricing overrides to BrandConfig interface
- Implement markup percentage configuration
- Implement minimum price floor
- Create pricing rule validation
- Test pricing overrides in Store A
- Test pricing overrides in Store B
- Document pricing override patterns

**Acceptance Criteria**:

- [ ] Pricing override structure defined
- [ ] Markup configuration works
- [ ] Minimum price floor works
- [ ] Overrides apply correctly per store
- [ ] Pricing remains accurate with overrides
- [ ] Documentation complete

**Files to Create/Modify**:

- `packages/config/src/types/pricing-overrides.ts` (new)
- `packages/core/src/services/pricing.ts` (update)
- Brand config files (update)

**Dependencies**: P2-029

---

### Ticket P2-031: Integrate Pricing with Shopify Checkout

**Labels**: `phase-2.3`, `priority-high`, `shopify`

**Estimated Hours**: 4 hours

**Description**:
Verify calculated prices match Shopify checkout and handle dynamic pricing.

**Tasks**:

- Verify cart prices match Shopify checkout
- Test discount code application
- Verify tax calculations
- Verify shipping calculations
- Create pricing reconciliation checks
- Handle price discrepancy errors
- Document pricing integration

**Acceptance Criteria**:

- [ ] Cart prices match Shopify checkout
- [ ] Discount codes apply correctly
- [ ] Taxes calculate correctly
- [ ] Shipping calculates correctly
- [ ] Price discrepancies handled gracefully
- [ ] Integration documented

**Dependencies**: P2-029

---

## Section 2.4: Performance Optimization

**Goal**: Ensure the system performs well under load and provides excellent user experience.

### Ticket P2-032: Implement Product Catalog Caching

**Labels**: `phase-2.4`, `priority-high`, `backend`

**Estimated Hours**: 5 hours

**Description**:
Add caching layer for product catalog data to reduce Shopify API calls.

**Tasks**:

- Research caching options (Redis, Vercel KV, memory cache)
- Implement caching for frame styles data
- Implement caching for mat data
- Implement caching for glass data
- Add cache invalidation strategy
- Set appropriate TTL values
- Monitor cache hit rates
- Document caching architecture

**Acceptance Criteria**:

- [ ] Caching implemented for catalog data
- [ ] Cache invalidation works
- [ ] API response times improved
- [ ] Cache hit rate > 90%
- [ ] Architecture documented

**Files to Create/Modify**:

- `packages/core/src/services/cache.ts` (new)
- `packages/core/src/services/products.ts` (update)

**Dependencies**: P2-021

---

### Ticket P2-033: Implement Shopify API Response Caching

**Labels**: `phase-2.4`, `priority-high`, `backend`

**Estimated Hours**: 4 hours

**Description**:
Cache Shopify Storefront API responses to reduce latency and API calls.

**Tasks**:

- Add caching to StorefrontClient
- Cache product queries (short TTL)
- Cache collection queries
- Implement cache-then-network strategy for cart
- Handle cache versioning
- Monitor API rate limit usage
- Document caching behavior

**Acceptance Criteria**:

- [ ] Storefront API responses cached
- [ ] Cache reduces API calls significantly
- [ ] Rate limit usage reduced
- [ ] Cache invalidation works correctly
- [ ] User experience improved

**Dependencies**: P2-032

---

### Ticket P2-034: Optimize Bundle Sizes

**Labels**: `phase-2.4`, `priority-high`, `frontend`

**Estimated Hours**: 6 hours

**Description**:
Analyze and optimize JavaScript bundle sizes for better load times.

**Tasks**:

- Analyze bundle sizes with `@next/bundle-analyzer`
- Identify large dependencies
- Implement code splitting for specialty designers
- Lazy load non-critical components
- Remove unused dependencies
- Optimize image imports
- Verify tree shaking is working
- Document optimization results

**Acceptance Criteria**:

- [ ] Bundle analysis complete
- [ ] Main bundle < 200KB
- [ ] Specialty designers lazy loaded
- [ ] LCP improved
- [ ] FCP improved
- [ ] Optimization documented

**Deliverables**:

- Bundle analysis report
- Optimization results

**Dependencies**: P2-021

---

### Ticket P2-035: Implement Image Optimization

**Labels**: `phase-2.4`, `priority-medium`, `frontend`

**Estimated Hours**: 4 hours

**Description**:
Optimize image loading for faster page loads.

**Tasks**:

- Configure Next.js Image component properly
- Set up image optimization for user uploads
- Implement WebP format for supported browsers
- Add blur placeholders for images
- Configure proper image sizes and srcset
- Lazy load below-fold images
- Test image loading performance

**Acceptance Criteria**:

- [ ] Images use Next.js Image component
- [ ] WebP served where supported
- [ ] Blur placeholders show while loading
- [ ] Correct image sizes served
- [ ] Below-fold images lazy loaded
- [ ] LCP improved

**Dependencies**: P2-034

---

### Ticket P2-036: Implement Performance Monitoring

**Labels**: `phase-2.4`, `priority-high`, `infrastructure`

**Estimated Hours**: 4 hours

**Description**:
Set up comprehensive performance monitoring and alerting.

**Tasks**:

- Configure Vercel Analytics (or alternative)
- Set up Web Vitals tracking
- Monitor API response times
- Track Shopify API latency
- Set up performance alerts
- Create performance dashboard
- Establish performance baselines
- Document monitoring setup

**Acceptance Criteria**:

- [ ] Web Vitals tracked (LCP, FID, CLS)
- [ ] API response times monitored
- [ ] Performance alerts configured
- [ ] Dashboard created
- [ ] Baselines established
- [ ] Monitoring documented

**Dependencies**: P2-021

---

### Ticket P2-037: Conduct Load Testing

**Labels**: `phase-2.4`, `priority-medium`, `testing`

**Estimated Hours**: 6 hours

**Description**:
Test system performance under load to identify bottlenecks.

**Tasks**:

- Choose load testing tool (k6, Artillery, etc.)
- Create load testing scenarios
- Test concurrent user scenarios (10, 50, 100 users)
- Test cart creation under load
- Test checkout flow under load
- Identify bottlenecks
- Implement improvements
- Document load testing results

**Acceptance Criteria**:

- [ ] Load testing scenarios created
- [ ] System handles 50 concurrent users
- [ ] Cart operations stable under load
- [ ] Checkout flow stable under load
- [ ] Bottlenecks identified and documented
- [ ] Results documented

**Deliverables**:

- Load testing report
- Performance improvement recommendations

**Dependencies**: P2-021

---

## Section 2.5: SEO Migration Planning (custompictureframes.com)

**Goal**: Prepare for SEO-safe migration of the existing site to the new platform.

### Ticket P2-038: Pre-Migration SEO Audit

**Labels**: `phase-2.5`, `priority-high`, `seo`

**Estimated Hours**: 6 hours

**Description**:
Conduct comprehensive SEO audit of the existing site before migration.

**Tasks**:

- Export current URL structure (all pages)
- Extract data from Google Search Console
- Identify all indexed pages
- Analyze current traffic patterns
- Identify high-value pages (by traffic)
- Identify high-converting pages
- Audit current meta tags
- Audit structured data schemas
- Document current backlink profile
- Create baseline metrics for comparison

**Acceptance Criteria**:

- [ ] All URLs exported and documented
- [ ] Search Console data extracted
- [ ] Traffic patterns analyzed
- [ ] High-value pages identified
- [ ] Meta tags audited
- [ ] Structured data audited
- [ ] Baseline metrics documented

**Deliverables**:

- SEO audit report
- URL inventory spreadsheet
- Baseline metrics document

**Dependencies**: None

---

### Ticket P2-039: Create URL Mapping Strategy

**Labels**: `phase-2.5`, `priority-critical`, `seo`

**Estimated Hours**: 4 hours

**Description**:
Map all old URLs to new URL structure and create redirect plan.

**Tasks**:

- Design new URL structure
- Map old URLs to new URLs
- Identify URL pattern changes
- Prioritize redirects by traffic volume
- Create redirect map (JSON or spreadsheet)
- Plan canonical URL strategy
- Handle query parameters
- Document URL mapping decisions

**Acceptance Criteria**:

- [ ] New URL structure defined
- [ ] All old URLs mapped to new
- [ ] Redirect priorities set
- [ ] Redirect map created
- [ ] Canonical strategy defined
- [ ] Decisions documented

**Deliverables**:

- URL mapping spreadsheet
- Redirect map JSON file

**Dependencies**: P2-038

---

### Ticket P2-040: Implement Redirect Infrastructure

**Labels**: `phase-2.5`, `priority-critical`, `seo`, `infrastructure`

**Estimated Hours**: 6 hours

**Description**:
Implement 301 redirects in Next.js/Vercel configuration.

**Tasks**:

- Design redirect handling system
- Implement redirects in next.config.js
- Create edge-based redirects for performance
- Implement wildcard redirect patterns
- Handle legacy query parameters
- Create redirect testing utilities
- Test redirects locally
- Document redirect implementation

**Acceptance Criteria**:

- [ ] Redirects implemented in Next.js
- [ ] Edge redirects configured for performance
- [ ] Wildcard patterns work
- [ ] Query parameters handled
- [ ] All redirects tested
- [ ] Implementation documented

**Files to Create/Modify**:

- `apps/store-a/next.config.js` (update)
- `apps/store-a/middleware.ts` (new - if complex redirects)
- `apps/store-a/lib/redirects.ts` (update)

**Dependencies**: P2-039

---

### Ticket P2-041: Prepare Content Migration

**Labels**: `phase-2.5`, `priority-high`, `seo`

**Estimated Hours**: 5 hours

**Description**:
Prepare content pages for migration to the new platform.

**Tasks**:

- Audit existing content pages
- Map content to new CMS/markdown system
- Preserve meta titles and descriptions
- Migrate structured data schemas
- Update internal linking structure
- Prepare image assets for migration
- Create content migration checklist
- Document content migration process

**Acceptance Criteria**:

- [ ] Content audit complete
- [ ] Content mapping ready
- [ ] Meta data preserved
- [ ] Structured data migrated
- [ ] Internal links updated
- [ ] Images prepared
- [ ] Process documented

**Deliverables**:

- Content migration checklist
- Content mapping document

**Dependencies**: P2-038

---

### Ticket P2-042: Configure SEO Monitoring for Migration

**Labels**: `phase-2.5`, `priority-high`, `seo`, `infrastructure`

**Estimated Hours**: 3 hours

**Description**:
Set up monitoring to track SEO impact during and after migration.

**Tasks**:

- Configure Google Search Console for new domain
- Set up 404 monitoring and alerts
- Create traffic comparison dashboards
- Set up ranking position tracking
- Configure crawl error alerts
- Create post-migration checklist
- Document monitoring procedures

**Acceptance Criteria**:

- [ ] Search Console configured
- [ ] 404 monitoring active
- [ ] Traffic dashboards created
- [ ] Ranking tracking set up
- [ ] Alerts configured
- [ ] Checklist created
- [ ] Procedures documented

**Deliverables**:

- SEO monitoring dashboard
- Post-migration checklist

**Dependencies**: P2-038

---

## Section 2.6: Additional Store Rollouts

**Goal**: Streamline the process for launching additional stores.

### Ticket P2-043: Create Store Scaffolding Script

**Labels**: `phase-2.6`, `priority-medium`, `infrastructure`

**Estimated Hours**: 5 hours

**Description**:
Create a script/CLI tool to scaffold new stores quickly.

**Tasks**:

- Design store scaffolding workflow
- Create script to copy store template
- Automate package.json updates
- Automate brand.config.ts creation
- Generate placeholder environment file
- Update workspace references
- Create interactive prompts for configuration
- Document scaffolding process

**Acceptance Criteria**:

- [ ] Script creates new store from template
- [ ] Package names updated automatically
- [ ] Brand config templated correctly
- [ ] Environment files created
- [ ] Workspace updated correctly
- [ ] Interactive prompts work
- [ ] Process documented

**Files to Create/Modify**:

- `scripts/scaffold-store.ts` (new)
- `scripts/templates/store-template/` (new)
- `package.json` (update - add script)

**Dependencies**: P2-027

---

### Ticket P2-044: Create Store Launch Checklist

**Labels**: `phase-2.6`, `priority-medium`, `documentation`

**Estimated Hours**: 3 hours

**Description**:
Document the complete store launch process as a repeatable checklist.

**Tasks**:

- Document all setup steps
- Create Shopify configuration checklist
- Create Vercel deployment checklist
- Create testing checklist
- Create monitoring setup checklist
- Create DNS configuration checklist
- Include common troubleshooting tips
- Create launch day runbook

**Acceptance Criteria**:

- [ ] Complete setup steps documented
- [ ] Checklists for each phase
- [ ] Troubleshooting tips included
- [ ] Runbook created
- [ ] Tested by following checklist

**Deliverables**:

- Store launch checklist document
- Launch day runbook

**Dependencies**: P2-022, P2-026

---

### Ticket P2-045: Create Store C Application

**Labels**: `phase-2.6`, `priority-low`, `frontend`

**Estimated Hours**: 4 hours

**Description**:
Launch Store C using the streamlined process.

**Tasks**:

- Use scaffolding script to create Store C
- Configure brand identity
- Set up Shopify store
- Configure environment variables
- Deploy to Vercel
- Test functionality
- Document any new challenges

**Acceptance Criteria**:

- [ ] Store C created using script
- [ ] Brand identity configured
- [ ] Shopify store set up
- [ ] Deployed and functional
- [ ] Challenges documented

**Dependencies**: P2-043, P2-044

---

### Ticket P2-046: Create Store D Application

**Labels**: `phase-2.6`, `priority-low`, `frontend`

**Estimated Hours**: 4 hours

**Description**:
Launch Store D using the streamlined process.

**Tasks**:

- Use scaffolding script to create Store D
- Configure different brand identity from C
- Set up Shopify store
- Configure environment variables
- Deploy to Vercel
- Test functionality
- Validate architecture with 4 stores

**Acceptance Criteria**:

- [ ] Store D created and deployed
- [ ] 4 stores running successfully
- [ ] Architecture validated at scale
- [ ] No performance degradation

**Dependencies**: P2-045

---

### Ticket P2-047: Implement Cross-Store Analytics Dashboard

**Labels**: `phase-2.6`, `priority-low`, `infrastructure`

**Estimated Hours**: 6 hours

**Description**:
Create a dashboard to monitor all stores from a single interface.

**Tasks**:

- Design dashboard requirements
- Set up data aggregation from all stores
- Create health status overview
- Create traffic comparison charts
- Create order volume tracking
- Create error rate monitoring
- Implement alerting for anomalies
- Document dashboard usage

**Acceptance Criteria**:

- [ ] Dashboard shows all stores
- [ ] Health status visible
- [ ] Traffic comparisons work
- [ ] Error rates tracked
- [ ] Alerts configured
- [ ] Documentation complete

**Dependencies**: P2-046

---

## Phase 2 Summary

**Total Tickets**: 47 tickets  
**Estimated Total Hours**: 240-280 hours  
**Estimated Duration**: 10-12 weeks (assuming 25-30 hours/week on Phase 2)

### Tickets by Section

- **Section 2.1** (Store A Complete Migration): 22 tickets (~140 hours)
- **Section 2.2** (Store B Setup): 6 tickets (~22 hours)
- **Section 2.3** (Pricing Integration): 3 tickets (~15 hours)
- **Section 2.4** (Performance Optimization): 6 tickets (~29 hours)
- **Section 2.5** (SEO Migration): 5 tickets (~24 hours)
- **Section 2.6** (Additional Rollouts): 5 tickets (~22 hours)

### Priority Distribution

- **Critical Priority**: 18 tickets (must complete, blocks production)
- **High Priority**: 20 tickets (important for launch)
- **Medium Priority**: 7 tickets (important but can defer)
- **Low Priority**: 2 tickets (nice to have)

### Key Changes from Original Phase 2

1. **Added Complete Page Migration** - All pages from original must be migrated
2. **Homepage is Comprehensive** - Full homepage with all sections, not just basic scaffold
3. **Gateway Pages Included** - SEO-optimized gateway pages for frames by style/color/size
4. **Individual Frame Pages** - All 50+ individual frame style pages migrated
5. **Content Pages** - All content pages (About, Contact, Blog, Resources) migrated
6. **Redirects** - Explicit ticket for legacy URL redirects
7. **More Realistic Estimates** - Increased hours to account for full migration

### Suggested Sprint Plan (Updated with Hybrid Approach)

**Week 1: Foundation + Early Setup**

- P2-001 through P2-003 (Already complete ✅)
- **P2-016 Phase 1: Basic Shopify Setup** (4 hours) - Do this early!
- **P2-017 Phase 1: Basic Product** (2 hours) - Do this early!
- **Backend API Structure** (4 hours) - Deploy apps/api with mock endpoints
- **Database Setup** (Optional, 4 hours)

**Sprint 1 (Weeks 2-3)**: Store A UI Development

- P2-004 through P2-006 (Layout, Homepage, Designer)
- P2-007 through P2-009 (Specialty designers, Gateway pages)
- Use mock mode for Shopify (already built-in)

**Sprint 2 (Weeks 4-5)**: Store A Pages & Integration

- P2-010 through P2-012 (Content pages, Resources, Gallery)
- P2-013 through P2-014 (Cart, Checkout - with mock mode)
- **P2-016 Phase 2: Full Shopify Configuration** (when ready)
- **P2-017 Phase 2: Enhanced Product** (when ready)
- Connect real Shopify integration

**Sprint 3 (Weeks 6-7)**: Store A Testing & Launch

- P2-015: Redirects
- P2-018 through P2-022 (Environment, Domain, Testing, Deployment, Monitoring)

**Sprint 4 (Weeks 7-8)**: Store B + Pricing

- P2-023 through P2-031 (Store B complete, Pricing validation)

**Sprint 5 (Weeks 9-10)**: Performance + SEO

- P2-032 through P2-042 (Performance optimization, SEO migration prep)

**Sprint 6 (Weeks 11-12)**: Additional Stores + Polish

- P2-043 through P2-047 (Store rollout automation, Additional stores)

---

## Phase 2 Completion Criteria

**The phase is complete when**:

- [ ] All pages from original CustomFrameSizes-CODE migrated to Store A
- [ ] Two production stores (A and B) live and accepting orders
- [ ] Shared configurator working identically across stores
- [ ] Data isolation verified between stores
- [ ] Performance metrics meet targets:
  - Page load < 2 seconds (P75)
  - LCP < 2.5 seconds
  - FID < 100ms
  - CLS < 0.1
- [ ] Pricing calculations verified and accurate
- [ ] SEO migration plan ready and tested
- [ ] Store deployment process documented and repeatable
- [ ] Monitoring and alerting in place
- [ ] All documentation updated

---

## Phase 2 Success Metrics

| Metric                | Target     | How to Measure             |
| --------------------- | ---------- | -------------------------- |
| Pages Migrated        | 100%       | Count of migrated pages    |
| Stores Live           | 2+         | Count of production stores |
| Uptime                | 99.9%      | Uptime monitoring          |
| Page Load Time        | < 2s (P75) | Vercel Analytics           |
| Checkout Success Rate | 99%+       | Order completion tracking  |
| Data Isolation        | 100%       | Security testing           |
| Store Setup Time      | < 1 day    | Time to deploy new store   |
| Zero Critical Bugs    | 0          | Sentry tracking            |

---

**End of Phase 2 Tickets (Updated)**

**Next Phase**: Phase 3 - Ongoing Support & System Ownership
