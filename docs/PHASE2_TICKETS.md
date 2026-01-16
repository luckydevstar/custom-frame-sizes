# Phase 2: Store Launches & Iteration - Kanban Board Tickets

**Created**: January 16, 2026  
**Phase**: Phase 2 - Store Launches & Iteration  
**Estimated Duration**: 8-10 weeks  
**Total Estimated Hours**: 320-400 hours

---

## Phase 2 Overview

Phase 2 focuses on launching production stores, validating the multi-store architecture built in Phase 1, optimizing performance, and preparing for SEO migration. This phase will prove the architecture works in production and establish patterns for future store rollouts.

### Prerequisites from Phase 1

All Phase 1 deliverables are complete:

- ✅ Monorepo infrastructure with Turborepo
- ✅ All shared packages (@framecraft/ui, @framecraft/core, @framecraft/config, @framecraft/types, @framecraft/data, @framecraft/db)
- ✅ Shopify Storefront API integration
- ✅ Shopify Admin API integration (apps/api)
- ✅ Multi-store configuration system
- ✅ Database multi-tenancy with siteId
- ✅ Cart state management with Zustand
- ✅ Configuration serialization for all frame types
- ✅ Sentry monitoring integration
- ✅ Comprehensive test coverage

---

## Kanban Board Column Structure

```
┌─────────────┬──────────────┬──────────────┬──────────────┬─────────────┐
│   Backlog   │    Ready     │  In Progress │   Review     │    Done     │
│             │              │              │              │             │
│  (Phase 2)  │  (Next Up)   │  (Active)    │  (Testing)   │ (Completed) │
└─────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
```

### Labels/Tags

- `phase-2.1` - First Store Setup (Store A)
- `phase-2.2` - Second Store Setup (Store B)
- `phase-2.3` - Pricing Integration
- `phase-2.4` - Performance Optimization
- `phase-2.5` - SEO Migration
- `phase-2.6` - Additional Store Rollouts
- `priority-critical` - Must be done first, blocks everything
- `priority-high` - Critical path items
- `priority-medium` - Important but not blocking
- `priority-low` - Can be deferred
- `blocked` - Waiting on dependency
- `infrastructure` - Infrastructure setup
- `frontend` - Frontend work
- `backend` - Backend/API work
- `shopify` - Shopify configuration
- `testing` - Testing/QA tasks
- `documentation` - Documentation tasks
- `seo` - SEO related

---

## Section 2.1: First Store Setup (Store A - Proof of Concept)

**Goal**: Launch the first production store to validate the entire architecture end-to-end.

### Ticket P2-001: Create Store A Application Scaffold

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Estimated Hours**: 6 hours

**Description**:
Set up the first production store application in the monorepo. This will be the flagship store that validates all Phase 1 work.

**Tasks**:

- Create `apps/store-a/` directory with Next.js 14+ App Router
- Initialize package.json with name `@framecraft/store-a`
- Install all @framecraft/\* package dependencies
- Configure TypeScript extending workspace base config
- Set up Next.js configuration (next.config.js)
- Configure Tailwind CSS with theme from @framecraft/config
- Create basic app directory structure (app/, components/, lib/)
- Set up environment variable loading
- Create initial layout.tsx with providers
- Test development server starts correctly

**Acceptance Criteria**:

- [ ] `apps/store-a/` exists with proper Next.js structure
- [ ] All @framecraft/\* packages installed and importable
- [ ] Development server runs: `npm run dev --filter=@framecraft/store-a`
- [ ] Basic page renders with store-specific styling
- [ ] Environment variables load correctly
- [ ] TypeScript compilation works without errors

**Files to Create/Modify**:

- `apps/store-a/package.json` (new)
- `apps/store-a/tsconfig.json` (new)
- `apps/store-a/next.config.js` (new)
- `apps/store-a/tailwind.config.js` (new)
- `apps/store-a/app/layout.tsx` (new)
- `apps/store-a/app/page.tsx` (new)
- `apps/store-a/.env.local.example` (new)

**Dependencies**: None (first ticket)

---

### Ticket P2-002: Configure Store A Brand Identity

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Estimated Hours**: 4 hours

**Description**:
Create the brand configuration file for Store A with all identity elements, theme overrides, and feature flags.

**Tasks**:

- Create `apps/store-a/src/brand.config.ts`
- Define brand identity (store name, legal name, URLs)
- Configure theme colors (primary, secondary, accent)
- Configure typography (heading font, body font)
- Set up navigation structure
- Configure feature flags based on store focus
- Set up SEO defaults (title, description, OG images)
- Add Shopify store credentials configuration
- Document all configuration choices

**Acceptance Criteria**:

- [ ] `brand.config.ts` follows BrandConfig interface from @framecraft/config
- [ ] Theme colors apply correctly to components
- [ ] Typography renders with specified fonts
- [ ] Feature flags control component visibility
- [ ] SEO defaults render in page metadata
- [ ] Configuration validated at build time

**Files to Create/Modify**:

- `apps/store-a/src/brand.config.ts` (new)
- `apps/store-a/src/lib/config.ts` (new - configuration loader)
- `apps/store-a/app/layout.tsx` (update - apply config)

**Dependencies**: P2-001

---

### Ticket P2-003: Set Up Store A Providers and Context

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Estimated Hours**: 4 hours

**Description**:
Configure all React providers (Store Context, Theme, Query Client, Cart) for Store A.

**Tasks**:

- Create providers wrapper component
- Set up StoreConfigProvider with brand config
- Configure ThemeProvider with merged theme
- Set up TanStack Query provider
- Initialize cart store with store-specific configuration
- Set up error boundary provider
- Configure Sentry provider for error tracking
- Test all providers work together

**Acceptance Criteria**:

- [ ] All providers wrap the application correctly
- [ ] Store context accessible throughout app
- [ ] Theme applies to all components
- [ ] TanStack Query works for data fetching
- [ ] Cart store initializes with correct storeId
- [ ] Error boundaries catch and report errors
- [ ] Sentry captures errors in production mode

**Files to Create/Modify**:

- `apps/store-a/src/providers/Providers.tsx` (new)
- `apps/store-a/app/layout.tsx` (update)

**Dependencies**: P2-002

---

### Ticket P2-004: Implement Store A Navigation and Layout

**Labels**: `phase-2.1`, `priority-high`, `frontend`

**Estimated Hours**: 6 hours

**Description**:
Build the navigation structure and layout for Store A using shared components from @framecraft/ui.

**Tasks**:

- Implement Header component with store branding
- Configure navigation items from brand config
- Implement Footer component with store info
- Create mobile navigation (hamburger menu)
- Add cart icon with item count
- Implement breadcrumb navigation
- Create loading states for navigation
- Test responsive behavior on all breakpoints

**Acceptance Criteria**:

- [ ] Header displays store logo and branding
- [ ] Navigation items match brand config
- [ ] Footer shows correct store information
- [ ] Mobile navigation works smoothly
- [ ] Cart icon shows correct item count
- [ ] All navigation is accessible (keyboard, screen readers)
- [ ] Responsive design works on mobile, tablet, desktop

**Files to Create/Modify**:

- `apps/store-a/src/components/layout/Header.tsx` (new)
- `apps/store-a/src/components/layout/Footer.tsx` (new)
- `apps/store-a/src/components/layout/Navigation.tsx` (new)
- `apps/store-a/src/components/layout/MobileNav.tsx` (new)
- `apps/store-a/app/layout.tsx` (update)

**Dependencies**: P2-003

---

### Ticket P2-005: Implement Store A Homepage

**Labels**: `phase-2.1`, `priority-high`, `frontend`

**Estimated Hours**: 8 hours

**Description**:
Create the homepage for Store A with hero section, featured products, and calls to action.

**Tasks**:

- Design homepage layout structure
- Implement hero section with primary CTA
- Create featured products section
- Implement specialty framing categories grid
- Add testimonials/reviews section (optional)
- Create "How it works" section
- Implement trust badges/guarantees section
- Add SEO metadata and structured data
- Optimize images and lazy loading
- Test page load performance

**Acceptance Criteria**:

- [ ] Homepage loads in < 2 seconds
- [ ] Hero section displays with store branding
- [ ] Featured products load from Shopify
- [ ] All CTAs link to correct pages
- [ ] SEO metadata renders correctly
- [ ] Structured data validates (Schema.org)
- [ ] Page is fully responsive
- [ ] Images are optimized and lazy loaded

**Files to Create/Modify**:

- `apps/store-a/app/page.tsx` (update)
- `apps/store-a/src/components/home/Hero.tsx` (new)
- `apps/store-a/src/components/home/FeaturedProducts.tsx` (new)
- `apps/store-a/src/components/home/Categories.tsx` (new)
- `apps/store-a/src/components/home/HowItWorks.tsx` (new)

**Dependencies**: P2-004

---

### Ticket P2-006: Integrate Frame Designer into Store A

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Estimated Hours**: 8 hours

**Description**:
Integrate the FrameDesigner component from @framecraft/ui into Store A with full functionality.

**Tasks**:

- Create frame designer page route
- Import and configure FrameDesigner component
- Connect to product data from @framecraft/data
- Integrate pricing engine from @framecraft/core
- Connect to cart store for add-to-cart
- Implement configuration serialization for cart
- Add loading states and error handling
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
- [ ] Add to cart creates correct line items
- [ ] Image upload works
- [ ] Configuration persists during session

**Files to Create/Modify**:

- `apps/store-a/app/designer/page.tsx` (new)
- `apps/store-a/app/designer/layout.tsx` (new)
- `apps/store-a/src/components/designer/DesignerContainer.tsx` (new)
- `apps/store-a/src/hooks/use-frame-designer.ts` (new)

**Dependencies**: P2-003

---

### Ticket P2-007: Integrate Specialty Designers (Based on Feature Flags)

**Labels**: `phase-2.1`, `priority-high`, `frontend`

**Estimated Hours**: 6 hours

**Description**:
Integrate specialty designers (Shadowbox, Jersey, etc.) based on Store A's feature flags.

**Tasks**:

- Check feature flags to determine enabled designers
- Create routes for enabled specialty designers
- Integrate ShadowboxDesigner if enabled
- Integrate JerseyDesigner if enabled
- Integrate CanvasFloatDesigner if enabled
- Integrate PuzzleDesigner if enabled
- Integrate ComicBookDesigner if enabled
- Integrate PlaybillDesigner if enabled
- Connect all designers to cart with proper serialization
- Add navigation items for enabled designers

**Acceptance Criteria**:

- [ ] Only enabled specialty designers are accessible
- [ ] Disabled designers return 404 or redirect
- [ ] Each enabled designer functions correctly
- [ ] Add to cart works for each designer type
- [ ] Configuration serialization is correct per type
- [ ] Navigation shows only enabled designers
- [ ] Feature flag changes reflect immediately

**Files to Create/Modify**:

- `apps/store-a/app/designer/[type]/page.tsx` (new - dynamic route)
- `apps/store-a/src/components/designer/SpecialtyDesignerRouter.tsx` (new)
- `apps/store-a/src/lib/feature-flags.ts` (new)

**Dependencies**: P2-006

---

### Ticket P2-008: Implement Cart Page

**Labels**: `phase-2.1`, `priority-critical`, `frontend`

**Estimated Hours**: 6 hours

**Description**:
Build the cart page with full cart management functionality.

**Tasks**:

- Create cart page route
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
- `apps/store-a/src/components/cart/CartItem.tsx` (new)
- `apps/store-a/src/components/cart/CartSummary.tsx` (new)
- `apps/store-a/src/components/cart/EmptyCart.tsx` (new)

**Dependencies**: P2-006

---

### Ticket P2-009: Implement Checkout Flow

**Labels**: `phase-2.1`, `priority-critical`, `frontend`, `backend`

**Estimated Hours**: 6 hours

**Description**:
Implement the checkout flow that redirects to Shopify checkout.

**Tasks**:

- Create checkout initiation page/component
- Implement checkout API call to /api/checkout
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

**Dependencies**: P2-008

---

### Ticket P2-010: Create Shopify Store for Store A

**Labels**: `phase-2.1`, `priority-critical`, `shopify`, `infrastructure`

**Estimated Hours**: 8 hours

**Description**:
Set up the Shopify store account and configure it for headless operation.

**Tasks**:

- Create Shopify store account (Development or Plus)
- Configure store settings (name, address, currency)
- Set up payment gateways (Stripe, PayPal, etc.)
- Configure shipping rates and zones
- Set up tax settings
- Create private app for API access
- Generate Storefront API access token
- Generate Admin API access token (if needed)
- Configure checkout customization
- Set up order notification emails
- Document all Shopify configuration

**Acceptance Criteria**:

- [ ] Shopify store created and accessible
- [ ] Payment gateways configured and tested
- [ ] Shipping rates configured
- [ ] Tax settings configured
- [ ] Storefront API token generated
- [ ] Admin API token generated
- [ ] API tokens tested and working
- [ ] Checkout customization applied
- [ ] All settings documented

**Deliverables**:

- Shopify store configuration document
- API credentials (stored securely)

**Dependencies**: None (can be done in parallel)

---

### Ticket P2-011: Create Custom Frame Product in Shopify

**Labels**: `phase-2.1`, `priority-critical`, `shopify`

**Estimated Hours**: 4 hours

**Description**:
Create the custom frame product(s) in Shopify that will be used for all frame orders.

**Tasks**:

- Create "Custom Frame" product
- Set up product variants for different base price tiers (if needed)
- Configure product to allow custom pricing via line item properties
- Add product images (placeholder)
- Write product description and SEO metadata
- Set up product collections (optional)
- Configure inventory settings (do not track)
- Test product appears in Storefront API
- Document product configuration

**Acceptance Criteria**:

- [ ] Custom frame product created in Shopify
- [ ] Product accessible via Storefront API
- [ ] Line item properties work correctly
- [ ] Product can be added to cart with custom price
- [ ] Product appears in checkout correctly
- [ ] Configuration documented

**Files to Create/Modify**:

- Documentation: `docs/shopify/store-a-products.md` (new)

**Dependencies**: P2-010

---

### Ticket P2-012: Configure Store A Environment Variables

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
- `apps/store-a/src/lib/env.ts` (new - env validation)

**Dependencies**: P2-010

---

### Ticket P2-013: Configure Store A Domain

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

### Ticket P2-014: Full Integration Testing - Store A

**Labels**: `phase-2.1`, `priority-critical`, `testing`

**Estimated Hours**: 8 hours

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
- Test responsive design on mobile devices
- Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Test accessibility (keyboard navigation, screen readers)
- Test dark mode (if enabled)
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
- [ ] Mobile experience is good
- [ ] Cross-browser compatible
- [ ] Accessibility meets WCAG 2.1 AA
- [ ] All bugs documented and triaged

**Deliverables**:

- Test results document
- Bug report list

**Dependencies**: P2-001 through P2-012

---

### Ticket P2-015: Deploy Store A to Vercel Production

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

**Dependencies**: P2-013, P2-014

---

### Ticket P2-016: Post-Launch Monitoring Setup - Store A

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

**Dependencies**: P2-015

---

## Section 2.2: Second Store Setup (Store B - Architecture Validation)

**Goal**: Launch a second store with different branding to validate the multi-store architecture is flexible and reusable.

### Ticket P2-017: Create Store B Application (Clone from Store A)

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

**Dependencies**: P2-015 (Store A complete)

---

### Ticket P2-018: Configure Store B Brand Identity (Different Focus)

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

**Dependencies**: P2-017

---

### Ticket P2-019: Create Shopify Store for Store B

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

**Dependencies**: P2-017

---

### Ticket P2-020: Configure Store B Environment and Deploy

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

**Dependencies**: P2-018, P2-019

---

### Ticket P2-021: Validate Shared Code Reusability

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

**Dependencies**: P2-020

---

### Ticket P2-022: Verify Data Isolation Between Stores

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

**Dependencies**: P2-020

---

## Section 2.3: Pricing Integration Refinement

**Goal**: Ensure pricing calculations are accurate and consistent across all stores.

### Ticket P2-023: Validate Pricing Calculations

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

**Dependencies**: P2-015

---

### Ticket P2-024: Implement Store-Specific Pricing Overrides

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

**Dependencies**: P2-023

---

### Ticket P2-025: Integrate Pricing with Shopify Checkout

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

**Dependencies**: P2-023

---

## Section 2.4: Performance Optimization

**Goal**: Ensure the system performs well under load and provides excellent user experience.

### Ticket P2-026: Implement Product Catalog Caching

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

**Dependencies**: P2-015

---

### Ticket P2-027: Implement Shopify API Response Caching

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

**Dependencies**: P2-026

---

### Ticket P2-028: Optimize Bundle Sizes

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

**Dependencies**: P2-015

---

### Ticket P2-029: Implement Image Optimization

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

**Dependencies**: P2-028

---

### Ticket P2-030: Implement Performance Monitoring

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

**Dependencies**: P2-015

---

### Ticket P2-031: Conduct Load Testing

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

**Dependencies**: P2-015

---

## Section 2.5: SEO Migration Planning (custompictureframes.com)

**Goal**: Prepare for SEO-safe migration of the existing site to the new platform.

### Ticket P2-032: Pre-Migration SEO Audit

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

### Ticket P2-033: Create URL Mapping Strategy

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

**Dependencies**: P2-032

---

### Ticket P2-034: Implement Redirect Infrastructure

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
- `apps/store-a/lib/redirects.ts` (new)

**Dependencies**: P2-033

---

### Ticket P2-035: Prepare Content Migration

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

**Dependencies**: P2-032

---

### Ticket P2-036: Configure SEO Monitoring for Migration

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

**Dependencies**: P2-032

---

## Section 2.6: Additional Store Rollouts

**Goal**: Streamline the process for launching additional stores.

### Ticket P2-037: Create Store Scaffolding Script

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

**Dependencies**: P2-021

---

### Ticket P2-038: Create Store Launch Checklist

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

**Dependencies**: P2-016, P2-020

---

### Ticket P2-039: Create Store C Application

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

**Dependencies**: P2-037, P2-038

---

### Ticket P2-040: Create Store D Application

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

**Dependencies**: P2-039

---

### Ticket P2-041: Implement Cross-Store Analytics Dashboard

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

**Dependencies**: P2-040

---

## Phase 2 Summary

**Total Tickets**: 41 tickets  
**Estimated Total Hours**: 194-220 hours  
**Estimated Duration**: 8-10 weeks (assuming 25-30 hours/week on Phase 2)

### Tickets by Section

- **Section 2.1** (Store A Setup): 16 tickets (~95 hours)
- **Section 2.2** (Store B Setup): 6 tickets (~22 hours)
- **Section 2.3** (Pricing Integration): 3 tickets (~15 hours)
- **Section 2.4** (Performance Optimization): 6 tickets (~29 hours)
- **Section 2.5** (SEO Migration): 5 tickets (~24 hours)
- **Section 2.6** (Additional Rollouts): 5 tickets (~22 hours)

### Priority Distribution

- **Critical Priority**: 15 tickets (must complete, blocks production)
- **High Priority**: 18 tickets (important for launch)
- **Medium Priority**: 6 tickets (important but can defer)
- **Low Priority**: 2 tickets (nice to have)

### Suggested Sprint Plan

**Sprint 1 (Weeks 1-2)**: Store A Setup - Core

- P2-001 through P2-009 (App scaffold through checkout)
- P2-010, P2-011 (Shopify setup)

**Sprint 2 (Weeks 3-4)**: Store A Launch

- P2-012 through P2-016 (Environment, domain, testing, deployment, monitoring)

**Sprint 3 (Weeks 5-6)**: Store B + Pricing

- P2-017 through P2-022 (Store B complete setup)
- P2-023 through P2-025 (Pricing validation)

**Sprint 4 (Weeks 7-8)**: Performance + SEO

- P2-026 through P2-031 (Performance optimization)
- P2-032 through P2-033 (SEO audit and mapping)

**Sprint 5 (Weeks 9-10)**: SEO Migration + Additional Stores

- P2-034 through P2-036 (SEO implementation)
- P2-037 through P2-041 (Store rollout automation)

---

## Phase 2 Completion Criteria

**The phase is complete when**:

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
| Stores Live           | 2+         | Count of production stores |
| Uptime                | 99.9%      | Uptime monitoring          |
| Page Load Time        | < 2s (P75) | Vercel Analytics           |
| Checkout Success Rate | 99%+       | Order completion tracking  |
| Data Isolation        | 100%       | Security testing           |
| Store Setup Time      | < 1 day    | Time to deploy new store   |
| Zero Critical Bugs    | 0          | Sentry tracking            |

---

**End of Phase 2 Tickets**

**Next Phase**: Phase 3 - Ongoing Support & System Ownership
