## CustomFrame Project - Detailed Execution Plan (Q1 2026)

**Last Updated**: March 13, 2026  
**Status**: Ready for Execution  
**Duration**: 10-12 weeks

---

## 👥 TEAM ROLES & RESPONSIBILITIES

### Senior Architect Role

The Senior Architect owns the technical direction, code quality standards, and architectural decisions. This role handles:

- All system-level decisions (Cart Transform, CMS architecture, multi-storefront strategy)
- Code review and quality gates on critical paths
- Setting and maintaining coding standards/linting rules
- Identifying architectural issues and refactoring strategies
- Performance and security oversight
- Mentorship on complex technical problems
- Shopify Plus integration and Cart Transform deployment
- Proof-of-concept validation for Store-B migration
- CMS evaluation and architecture design

**Estimated Time**: 15-25 hours/week

---

### Developer Role

The Developer executes tasks under architectural guidance. This role handles:

- Implementing features and fixes in sprints
- Store migration execution (once Store-B PoC is validated)
- SEO content and metadata implementation
- Component development and refactoring
- Testing and QA
- Documentation (deployment guides, runbooks)
- Coding tasks that follow established patterns
- WCAG compliance fixes
- Performance optimizations (under guidance)

**Estimated Time**: 30-40 hours/week

---

## 📊 EXECUTION PLAN - IN PRIORITY ORDER

### PHASE 1: SHOPIFY INTEGRATION COMPLETION (Weeks 1-2)

**Goal**: Full Cart Transform deployment and testing. Production-ready pricing system.

#### Epic 1: Cart Transform Implementation & Deployment

**E1.1 – Cart Transform Function Implementation**

**Task E1.1.1: Deploy Cart Transform to Shopify**

- **Effort**: 2-3 hours
- **Description**:
  - Create Shopify Functions Cart Transform app (reference: `CART_TRANSFORM_IMPLEMENTATION_GUIDE.md`)
  - Implement price override logic that reads `price_cents` from line attributes
  - Handle edge cases: missing attributes, invalid data, rounding
  - Deploy to Shopify Plus environment via CLI
  - Activate function in Shopify Admin → Settings → Cart Transform
- **Acceptance Criteria**:
  - Function deployed successfully
  - Visible and enabled in Shopify Admin
  - Can be disabled/rolled back without service interruption
  - Deployment process documented

**Task E1.1.2: Comprehensive Cart Transform Testing**

- **Effort**: 4-5 hours
- **Test Matrix**:
  - Single item: $129.95 frame → Checkout shows $129.95 ✅
  - Multiple items: 3 different frames → Total matches sum ✅
  - Quantity > 1: Configure frame, qty=3 → Shows unit price × 3 ✅
  - Edge case: Very large frame (40×60") → Price correct ✅
  - Edge case: Minimum frame (4×4") → Price correct ✅
  - Complex config: Double mat + museum glass + specialty → Price correct ✅
  - Cart persistence: Add → Close browser → Reopen → Item persists ✅
  - Price mismatch detection: Invalid attributes → Safe fallback ✅
- **Acceptance Criteria**:
  - All 8 test cases pass consistently
  - No console errors during checkout
  - Checkout URL functions correctly
  - Order confirmation visible in Shopify Admin with correct line items and attributes

**Task E1.1.3: Error Handling & Observability Setup**

- **Effort**: 2-3 hours
- **Description**:
  - Implement fallback logic: invalid/missing attributes → use base price (safe default)
  - Add logging to Cart Transform function for:
    - Attribute parsing events
    - Price mismatches (expected vs. actual)
    - Malformed configuration data
  - Create debugging playbook for troubleshooting price issues
  - Document logs location in Shopify Admin
- **Acceptance Criteria**:
  - Logs accessible in Shopify Function logs
  - Invalid data doesn't break checkout
  - Clear warning messages for debugging
  - Playbook document created and reviewed

**Task E1.1.4: Production Readiness Validation**

- **Effort**: 2 hours
- **Description**:
  - Verify Cart Transform handles all supported frame types:
    - Picture frames (standard)
    - Shadowbox frames (variable depth)
    - Diploma frames
    - Certificate frames
    - Jersey frames
  - Test with real Shopify checkout (not just dev)
  - Verify order attributes are readable in Shopify Admin
  - Performance test: Load Cart Transform with 100+ concurrent carts
- **Acceptance Criteria**:
  - All frame types work correctly
  - Response times acceptable (< 500ms)
  - Ready for customer-facing traffic

---

#### Epic 2: Backend API Verification & Enhancement

**Task E2.1: Verify Backend Cart API Endpoints**

- **Effort**: 1.5 hours
- **Description**:
  - Test all endpoints in production configuration:
    - `POST /api/cart` (create/fetch)
    - `POST /api/cart/lines` (add/update)
    - `POST /api/checkout` (get checkout URL)
  - Verify cookie management working correctly
  - Check CORS configuration for all production domains
  - Validate error responses and status codes
- **Acceptance Criteria**:
  - All endpoints return correct responses
  - CORS headers proper for production
  - Cookies set/read correctly
  - Error responses helpful for debugging

**Task E2.2: Add Monitoring & Alerting**

- **Effort**: 2-3 hours
- **Description**:
  - Set up error tracking (e.g., Sentry, LogRocket, or similar)
  - Configure alerts for:
    - Cart creation failures
    - Pricing calculation errors
    - Shopify API failures
    - Cart Transform function failures
  - Add structured logging for all critical operations
  - Create monitoring dashboard
- **Acceptance Criteria**:
  - All critical errors logged and traceable
  - Alerts configured and tested
  - Team notified of production issues

---

**PHASE 1 DELIVERABLE**: ✅ Cart Transform fully deployed, tested, monitored. Production ready for customer traffic.

---

### PHASE 2: SEO OPTIMIZATION (Weeks 3-4)

**Goal**: Establish SEO foundation for organic visibility. 10 storefronts optimized for search.

#### Epic 3: Technical SEO Foundation

**Task E3.1: Metadata System Implementation**

- **Effort**: 5-6 hours
- **Description**:
  - Audit all pages and add Next.js Metadata API entries:
    - `/` (homepage)
    - `/designer` (main tool)
    - `/shadowbox/designer`
    - `/diploma/designer`
    - `/certificate/designer`
    - `/frames/[slug]` (frame detail pages)
    - `/cart`
    - `/about`
    - `/contact`
    - `/faq`
  - Each page includes:
    - `title` (60 chars, keyword-focused)
    - `description` (155 chars, compelling)
    - `openGraph` (og:title, og:description, og:image, og:url)
    - `twitter` (twitter:card, twitter:title, twitter:description)
    - `robots` (index/follow flags)
    - `alternates.canonical` (absolute URL)
  - Use same structure across all storefronts (dynamic via `NEXT_PUBLIC_SITE_NAME`)
- **Example**:
  ```typescript
  export const metadata: Metadata = {
    title: "Custom Picture Frame Designer | CustomFrameSizes.com",
    description:
      "Design custom picture frames online. Any size from 4×4 to 60×60 inches. 100+ styles, instant pricing.",
    openGraph: {
      title: "Custom Picture Frame Designer",
      description: "Design and order custom frames online.",
      url: "https://customframesizes.com/designer",
      images: [{ url: "/og-designer.jpg", width: 1200, height: 630 }],
    },
    alternates: {
      canonical: "https://customframesizes.com/designer",
    },
  };
  ```
- **Acceptance Criteria**:
  - All pages have metadata
  - Canonical URLs correct per domain
  - OG images specified and accessible
  - No duplicate/conflicting meta tags

**Task E3.2: Image Optimization & Alt Text**

- **Effort**: 3-4 hours
- **Description**:
  - Audit all `<img>` and Next.js `<Image>` tags
  - Add descriptive alt text (not just "image" or "frame")
  - Examples:
    - ✅ "Black wood picture frame style 8446"
    - ✅ "Shadowbox frame with 3-inch depth for jersey display"
    - ❌ "image" or "frame"
  - Convert all images to Next.js `<Image>` for optimization
  - Enable lazy loading and placeholders
  - Compress images (target < 100KB per image)
- **Files Affected**: All components with images
- **Acceptance Criteria**:
  - All images have descriptive alt text
  - All images use Next.js Image component
  - Images compressed and optimized
  - Page load time improved

**Task E3.3: Structured Data Implementation**

- **Effort**: 4-5 hours
- **Description**:
  - Add JSON-LD schema markup for:
    - **Product**: On all designer pages
      - name, description, brand, offers (price range), availability, aggregateRating
    - **Organization**: Root layout (reused on all pages)
      - name, logo, contact info, social profiles
    - **BreadcrumbList**: On category/detail pages
      - Home → Category → Specific page
    - **FAQPage**: If FAQ page exists
      - Question/answer pairs
  - Validate each using Google Rich Results Test
  - No warnings or errors
- **Acceptance Criteria**:
  - All schemas validate in Rich Results Test
  - Product schema on designer pages
  - Organization schema centralized
  - Breadcrumb schema on hierarchical pages

**Task E3.4: Dynamic Sitemap & Robots Configuration**

- **Effort**: 2 hours
- **Description**:
  - Create `app/sitemap.ts` using Next.js App Router
  - Include:
    - Static pages: home, designers (5 types), about, contact
    - Dynamic pages: frame details, blog posts
    - Set `lastModified`, `changeFrequency`, `priority`
  - Create `app/robots.ts`
    - Allow: `/`
    - Disallow: `/api/`, `/admin/`, `/cart/*`
    - Reference sitemap.xml
  - Deploy sitemaps to each storefront domain
- **Acceptance Criteria**:
  - Sitemaps valid XML
  - All important pages listed
  - Robots.txt blocks appropriate routes
  - Indexed by Google Search Console

**Task E3.5: Core Web Vitals Optimization**

- **Effort**: 4-5 hours
- **Description**:
  - Run Lighthouse on main pages (target: ≥90 score)
  - Identify bottlenecks:
    - Largest Contentful Paint (LCP) < 2.5s
    - Cumulative Layout Shift (CLS) < 0.1
    - First Input Delay (FID) < 100ms
  - Optimizations:
    - Lazy load images below the fold
    - Use `next/font` for web fonts with `display: swap`
    - Code split heavy components with `dynamic()`
    - Remove unused CSS/JavaScript
    - Minify assets
  - Test on mobile (slower connection simulated)
- **Acceptance Criteria**:
  - Lighthouse score ≥90 on homepage, designer, category pages
  - LCP < 2.5s
  - CLS < 0.1
  - Tested on mobile 3G network

---

#### Epic 4: On-Page SEO & Content

**Task E4.1: Homepage Optimization**

- **Effort**: 2-3 hours
- **Description**:
  - Target keyword: "custom picture frames" (or variant per store)
  - Structure:
    - H1: "Custom Picture Frames | Any Size, Any Style"
    - Section 1: "Design Your Perfect Frame Online" (value prop + CTA)
    - Section 2: "Why Choose [Brand]?" (benefits, 3-4 points)
    - Section 3: "Popular Frame Sizes" (links to designer with presets)
    - Section 4: "Customer Testimonials" (social proof)
    - Section 5: "Featured Designs" (gallery of examples)
  - Internal links to: `/designer`, `/shadowbox/designer`, guides
  - Minimum 400 words of original content
- **Acceptance Criteria**:
  - Strong H1 with target keyword
  - 400+ words of original content
  - 5+ internal links to key pages
  - CTAs prominent and clear

**Task E4.2: Designer Page SEO Enhancement**

- **Effort**: 2 hours
- **Description**:
  - Designer page is interactive (React), needs SEO content around tool
  - Above tool:
    - H1: "Custom Picture Frame Designer"
    - Intro paragraph (3-4 sentences) with keywords
  - Below tool:
    - "How to Use the Designer" (5 steps)
    - "Available Frame Styles" (brief description)
    - "Customization Options" (list of variables)
  - Sidebar:
    - Related guides
    - FAQ snippets
    - Popular configurations (as examples)
  - Total content: 300+ words (separate from tool)
- **Acceptance Criteria**:
  - SEO content visible to search engines (not hidden)
  - H1 present with target keyword
  - Content depth > 300 words
  - No noindex tags (indexable)

**Task E4.3: Category Pages Creation**

- **Effort**: 3-4 hours
- **Description**:
  - Create dedicated category landing pages:
    - `/picture-frames` (main category page)
    - `/shadowbox-frames`
    - `/diploma-frames`
    - `/certificate-frames`
    - `/specialty-frames` (misc)
  - Each page structure:
    - H1 with category keyword
    - 200-300 word description (what is this frame type, use cases)
    - Benefits list (3-5 points)
    - Link to relevant designer
    - Link to 2-3 related guides
    - Gallery of example images (with alt text)
  - Unique content per category (not boilerplate)
- **Acceptance Criteria**:
  - All 5 category pages live
  - Unique content per page
  - Internal links working
  - Images optimized with alt text

**Task E4.4: Blog/Guide Content Creation**

- **Effort**: 10-12 hours
- **Description**:
  - Create 10 SEO-optimized guide articles
  - Target high-intent keywords:
    1. "How to Measure for a Picture Frame (2026 Guide)" - 1,200 words
    2. "What Size Mat Border Should I Use? (Complete Guide)" - 1,000 words
    3. "Museum Glass vs Regular Glass: Complete Comparison" - 1,100 words
    4. "How to Frame a Jersey (Step-by-Step)" - 1,300 words
    5. "Picture Frame vs Shadowbox: Which Do I Need?" - 1,000 words
    6. "Standard Picture Frame Sizes (Complete Chart)" - 900 words
    7. "How Much Does Custom Framing Cost?" - 1,100 words
    8. "Best Frame Styles for Different Room Designs" - 1,200 words
    9. "Custom Frames vs Ikea: What's the Difference?" - 1,000 words
    10. "Framing for Beginners: 10 Things You Should Know" - 1,100 words
  - Each article includes:
    - H1 with target keyword
    - H2/H3 hierarchy (logical structure)
    - 2-3 images with descriptive alt text
    - CTA to designer (natural, contextual)
    - Link to 1-2 related guides
    - Blog schema JSON-LD (BlogPosting)
    - Meta description (155 chars)
  - Storage: `public/guides/` directory (Markdown) or CMS integration (Phase 7)
  - Total words: 10,500+ across all guides
- **Acceptance Criteria**:
  - 10 guides published
  - 1,000+ words average per guide
  - All indexed by Google Search Console
  - Links to designer from each
  - Related articles linked together

---

**PHASE 2 DELIVERABLE**: ✅ Complete SEO foundation. All pages optimized. 10+ guides published. Sitemaps and structured data in place. Core Web Vitals ≥90.

---

### PHASE 3: WCAG 2.1 LEVEL AA COMPLIANCE (Weeks 4-5)

**Goal**: Address all ADA/WCAG violations. Zero accessibility issues. Reduce legal liability.

**Reference**: ADA Compliance Audit (March 12, 2026)

#### Epic 5: Critical Accessibility Fixes

**Task E5.1: Add aria-labels to Unnamed Buttons (16 elements)**

- **Effort**: 2-3 hours
- **Description**:
  - Audit all interactive buttons throughout designers
  - Add descriptive `aria-label` to each:
    - Service type options: "Frame only", "Print and frame"
    - Glass options: "Standard glass", "Non-glare glass"
    - Backing options: "Backing only", "None"
    - Hardware options: "Standard hardware", "Security hardware"
    - Preview controls: "View dimensional diagram", "Fullscreen view", "Download frame design"
    - Toggle/radio buttons: `aria-label="[Option Name]"`
  - Verify screen reader announces label correctly
  - Test with NVDA/JAWS on Windows, VoiceOver on Mac
- **Files Affected**:
  - `FrameDesigner.tsx`
  - `ShadowboxDesigner.tsx`
  - `DiplomaFrameDesigner.tsx`
  - `CertificateFrameDesigner.tsx`
  - All preview components
- **Acceptance Criteria**:
  - All 16 buttons have aria-label
  - Screen reader announces correct labels
  - aXe accessibility scanner shows 0 violations for unnamed buttons

**Task E5.2: Fix Color Contrast Issues (9 elements)**

- **Effort**: 1-2 hours
- **Description**:
  - Current issue: Muted text fails WCAG AA contrast (2.29:1, need 4.5:1)
  - Identify all affected elements:
    - Frame descriptions (muted text)
    - UI labels and helper text
    - Any text with opacity/gray colors
  - Solutions:
    - Increase opacity: `.text-muted-foreground/60` → `/80` or darker
    - Adjust Tailwind config to darker base color
    - Test with Chrome DevTools "Contrast" checker
  - Verify visual design still acceptable (no harsh appearance)
- **Acceptance Criteria**:
  - All text meets 4.5:1 contrast minimum (AA standard)
  - Visual design not compromised
  - aXe scan shows 0 contrast violations

**Task E5.3: Add aria-label to Mat Border Width Slider**

- **Effort**: 30 minutes
- **Description**:
  - Mat designer has slider with role="slider"
  - Missing accessible name for screen readers
  - Add:
    - `aria-label="Mat border width in inches"`
    - `aria-valuemin="0"` `aria-valuemax="4"`
    - `aria-valuenow={currentValue}`
    - `aria-valuetext="2 inches"` (current value in words)
  - Test with screen reader
- **Acceptance Criteria**:
  - Screen reader announces "Mat border width in inches: 2 inches"
  - Slider fully keyboard accessible

**Task E5.4: Add Skip-to-Content Navigation Link**

- **Effort**: 1 hour
- **Description**:
  - Keyboard-only users must tab through entire header/nav to reach main content
  - Add hidden "Skip to main content" link as first focusable element
  - Implementation:
    ```html
    <a href="#main-content" className="sr-only sr-only:focus"> Skip to main content </a>
    ```
  - CSS (if not already defined):
    ```css
    .sr-only {
      position: absolute;
      left: -9999px;
      visibility: hidden;
    }
    .sr-only:focus {
      position: static;
      visibility: visible;
    }
    ```
  - Link targets `<main id="main-content">`
  - Test: Tab at page load → link visible → click → focus jumps to main
- **Files Affected**:
  - Root layout component
  - All page layouts
- **Acceptance Criteria**:
  - Skip link visible on first tab
  - Click/enter jumps to main content
  - Link hidden when not focused

**Task E5.5: Fix Heading Hierarchy (No Level Skips)**

- **Effort**: 1 hour
- **Description**:
  - Audit all pages for heading hierarchy
  - Screen readers use headings for navigation
  - Invalid: H1 → H3 (skip H2)
  - Valid: H1 → H2 → H3 (no skips)
  - Pages to audit:
    - Designer page
    - Category pages
    - Blog/guide posts
    - About/contact pages
  - Fix any skips by changing heading level
- **Acceptance Criteria**:
  - No heading level skips
  - aXe scan shows 0 heading errors
  - Outline/table of contents still makes sense

---

#### Epic 6: Accessibility Testing & Validation

**Task E6.1: Automated Accessibility Scanning**

- **Effort**: 1.5 hours
- **Description**:
  - Set up automated aXe accessibility testing
  - Add to CI/CD pipeline (if not already present)
  - Run on every PR and pre-deploy
  - Configure aXe to check for:
    - WCAG 2.1 Level AA violations
    - Best practices (cat, best-practice)
    - Failure on critical issues
  - Create accessibility report for each build
- **Tool**: `@axe-core/react` or `eslint-plugin-jsx-a11y`
- **Acceptance Criteria**:
  - Automated scans run on every PR
  - Build fails if Level AA violations found
  - Report accessible to team

**Task E6.2: Manual Screen Reader Testing**

- **Effort**: 2 hours
- **Description**:
  - Test all critical flows with actual screen reader
  - Tools: NVDA (Windows, free), JAWS (Windows, paid), VoiceOver (Mac, free)
  - Test paths:
    - Designer flow: Start → Configure frame → Add to cart → Checkout
    - Cart page: View items → Modify qty → Proceed to checkout
    - Navigation: Header menu → Footer links
  - Document any issues found
  - Verify buttons, form labels, error messages announced correctly
- **Acceptance Criteria**:
  - All critical flows work with screen reader
  - Labels announced correctly
  - No stuck focus (tab trap)
  - Error messages clear

**Task E6.3: Keyboard Navigation Verification**

- **Effort**: 1.5 hours
- **Description**:
  - Test full application using only keyboard (no mouse)
  - All interactive elements reachable via Tab
  - Focus indicator visible
  - Logical tab order (top-to-bottom, left-to-right)
  - No keyboard traps (can always tab forward/backward out)
  - Form submission with Enter key
  - Buttons activated with Enter/Space
  - Dropdowns work with arrow keys
- **Acceptance Criteria**:
  - All interactive elements keyboard accessible
  - Focus order logical
  - No keyboard traps
  - Tested across all browsers

---

**PHASE 3 DELIVERABLE**: ✅ WCAG 2.1 Level AA compliant. All critical accessibility issues fixed. Automated testing in place. Legal liability reduced.

---

### PHASE 4: PERFORMANCE IMPROVEMENTS (Weeks 5-6)

**Goal**: Optimize load time, caching, CDN usage. Fast experience across all devices.

#### Epic 7: CDN & Caching Strategy

**Task E7.1: Evaluate Current CDN Setup**

- **Effort**: 2 hours
- **Description**:
  - Audit current CDN configuration (R2 mentioned in `.env`)
  - Identify:
    - What assets currently cached (images, fonts, CSS, JS)
    - Cache expiration times
    - Cache hit ratio
    - Bandwidth costs
    - Potential gaps (static assets not cached)
  - Document findings
- **Acceptance Criteria**:
  - Audit document created
  - Current CDN performance baseline established
  - Opportunities identified

**Task E7.2: Optimize Image CDN Caching**

- **Effort**: 2-3 hours
- **Description**:
  - All image assets should be cached on CDN (R2)
  - Implement:
    - Long cache headers for static images (1 year): `Cache-Control: public, max-age=31536000, immutable`
    - Frame images: `/frames/[id].jpg`
    - Mat images: `/mats/[id].jpg`
    - UI assets: `/ui/[name].svg|png`
  - Use image versioning (hash in URL) so old versions don't break
  - Configure CDN to:
    - Gzip text assets
    - Brotli compression where supported
    - Serve next-gen formats (WebP) to modern browsers
- **Acceptance Criteria**:
  - Images cached on CDN with long expiration
  - Cache hit ratio > 90%
  - Bandwidth usage optimized
  - No broken image references

**Task E7.3: Static Asset Caching**

- **Effort**: 1.5 hours
- **Description**:
  - CSS, JavaScript, fonts should be cached
  - Implement versioning (hash-based):
    - Next.js automatically handles this
    - Output files: `_next/static/[hash]/[name].js`
  - Set headers:
    - `Cache-Control: public, max-age=31536000, immutable` (static files)
    - `Cache-Control: public, max-age=3600` (HTML pages)
  - Verify in browser DevTools (expect "200 from cache" for repeat visits)
- **Acceptance Criteria**:
  - Static assets cached with long expiration
  - HTML pages cached for 1 hour (re-fetch new versions)
  - Verified in browser DevTools

**Task E7.4: API Response Caching**

- **Effort**: 2 hours
- **Description**:
  - Backend API responses should be cached where appropriate
  - Cache strategies:
    - Cart endpoints: No cache (always fresh)
    - Pricing endpoints: Cache for 5 minutes (rarely changes)
    - Frame/mat lists: Cache for 1 hour (reference data)
    - Blog posts: Cache for 24 hours
  - Use `Cache-Control` headers
  - Frontend: Implement React Query caching (if not already present)
  - Backend: Implement Redis or similar cache layer
- **Acceptance Criteria**:
  - API endpoints have appropriate cache headers
  - Frontend reduces redundant API calls
  - Performance improved on repeat visits

---

#### Epic 8: Frontend Performance

**Task E8.1: Bundle Size Analysis & Optimization**

- **Effort**: 2-3 hours
- **Description**:
  - Analyze JavaScript bundle size
  - Tools: `npm run build && npm run analyze` (if available)
  - Identify large dependencies:
    - Are they necessary?
    - Can they be tree-shaken?
    - Are there lighter alternatives?
  - Code splitting:
    - Split designers into separate bundles
    - Lazy load non-critical components
    - Use dynamic imports for heavy libraries
  - Target: Reduce JS by 20-30%
- **Acceptance Criteria**:
  - Bundle size analyzed and baseline established
  - Large dependencies evaluated
  - Code splitting implemented for heavy components
  - JS size reduced by at least 15%

**Task E8.2: Image Delivery Optimization**

- **Effort**: 2 hours
- **Description**:
  - Ensure all images using Next.js Image component (not `<img>`)
  - Configure image optimization:
    - Responsive sizes: `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1024px"`
    - Lazy loading: `loading="lazy"` (default)
    - Blur placeholders: `placeholder="blur"` for above-fold images
    - WebP format: Next.js automatic via `next/image`
  - Compress images:
    - JPEG: 80-85 quality
    - PNG: Optimize with pngquant
    - SVG: Minify with svgo
  - Test on slow networks (Chrome DevTools throttle to 3G)
- **Acceptance Criteria**:
  - All images use Next.js Image
  - Responsive sizes configured
  - Lazy loading enabled
  - Placeholder blur on above-fold images
  - Images compressed and optimized

**Task E8.3: Font Loading Optimization**

- **Effort**: 1 hour
- **Description**:
  - Use `next/font` for self-hosted fonts (faster than Google Fonts API calls)
  - Configure fonts with `display: swap` (show fallback immediately)
  - Limit font weights/variants (load only what's used)
  - Example:
    ```typescript
    const inter = Inter({
      subsets: ["latin"],
      weights: [400, 500, 700],
      display: "swap",
    });
    ```
  - Verify in Chrome DevTools: Font should load without layout shift
- **Acceptance Criteria**:
  - Fonts using `next/font`
  - `display: swap` configured
  - No font-loading layout shift
  - LCP not delayed by font loading

**Task E8.4: CSS-in-JS vs. Static CSS Review**

- **Effort**: 1.5 hours
- **Description**:
  - Current setup: Tailwind CSS (static classes)
  - Ensure all styling uses Tailwind (not inline styles or runtime CSS-in-JS)
  - Benefits:
    - Smaller CSS payload
    - Better caching (CSS rarely changes)
    - Faster rendering (no runtime JS for styles)
  - Audit for any runtime CSS generation
  - Convert to Tailwind utilities
- **Acceptance Criteria**:
  - No runtime CSS-in-JS in critical path
  - All styling via Tailwind
  - CSS payload optimized

---

#### Epic 9: Server-Side Optimization

**Task E9.1: API Route Optimization**

- **Effort**: 2 hours
- **Description**:
  - Review backend API performance:
    - Database queries (N+1 problems)
    - Unnecessary data retrieval
    - Missing indexes
  - Add query optimization:
    - Pagination for list endpoints
    - Select only needed fields
    - Add database indexes on common filters
  - Monitor API response times (target < 200ms)
  - Use monitoring tools (APM: New Relic, DataDog, or similar)
- **Acceptance Criteria**:
  - API endpoints respond < 200ms (p95)
  - Database optimized (queries fast)
  - Monitoring in place

**Task E9.2: Session/Cart Storage Optimization**

- **Effort**: 1.5 hours
- **Description**:
  - Current: Cart stored in Shopify (via API)
  - Optimize:
    - Store cart ID in Redis or similar (fast lookup)
    - Cache cart data briefly (reduce Shopify API calls)
    - Clean up expired carts (30 days old)
    - Monitor cart operation latency
- **Acceptance Criteria**:
  - Cart operations respond quickly
  - Unnecessary Shopify API calls reduced
  - Expired carts cleaned up regularly

---

**PHASE 4 DELIVERABLE**: ✅ Performance optimized. Core Web Vitals > 90. Load time < 2.5s LCP. CDN caching configured. Bundle size reduced. Ready for scale.

---

### PHASE 5: STORE-B MIGRATION (PROOF OF CONCEPT) (Weeks 6-7)

**Goal**: Validate multi-storefront architecture. Identify refactoring needs. Establish reusable process for Stores C-J.

#### Epic 10: Store-B Full Deployment

**Task E10.1: Clone and Configure Store-B Repository**

- **Effort**: 1 hour
- **Description**:
  - Copy `apps/store-a` → `apps/store-b`
  - Update configuration:
    - `package.json`: Change name to `@framecraft/store-b`
    - `.env.example`: Add Store-B specific vars
    - `config/brand.config.ts`: Create with Store-B branding
    - Environment variables:
      ```env
      NEXT_PUBLIC_SITE_ID=store-b
      NEXT_PUBLIC_SITE_NAME="Store B Name"
      NEXT_PUBLIC_API_URL=https://dev-api.customframesizes.com
      NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID=gid://...
      NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=...
      NEXT_PUBLIC_CDN_URL=https://r2.example.com
      ```
  - Verify local build and dev server run
- **Acceptance Criteria**:
  - Store-B builds without errors
  - Dev server runs on `localhost:3002` (or configured port)
  - No hardcoded Store-A values in Store-B

**Task E10.2: Brand Configuration & Theming**

- **Effort**: 1.5 hours
- **Description**:
  - Create `store-b/config/brand.config.ts` with:
    ```typescript
    export const brandConfig = {
      storeName: "Store B Official Name",
      supportEmail: "support@store-b.com",
      supportPhone: "+1-800-555-0001",
      primaryColor: "#1E40AF", // Store-B color
      accentColor: "#DC2626",
      logo: "/logo-store-b.svg",
      logoAlt: "Store B Logo",
      footer: {
        companyName: "Store B Inc.",
        address: "123 Store B Lane",
        socialLinks: [
          { platform: "instagram", url: "..." },
          { platform: "facebook", url: "..." },
        ],
      },
    };
    ```
  - Update layout files to use `brandConfig`
  - Update logo and favicons (`.png`, `.svg`)
  - Test theme applies correctly
- **Acceptance Criteria**:
  - Store-B branding distinct from Store-A
  - Theming system works per-store
  - Logo/colors/text unique

**Task E10.3: Shopify Market & API Configuration**

- **Effort**: 1.5 hours
- **Description**:
  - Shopify Admin → Settings → Markets
  - Create market for Store-B
  - Optional: Set regional pricing if needed
  - Create Storefront API token for Store-B:
    - Shopify Admin → Settings → Apps and integrations → Headless
    - Create new storefront
    - Copy API token
  - Store token in `.env`:
    ```env
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=...
    ```
  - Test cart API connection locally (Postman or curl)
- **Acceptance Criteria**:
  - Storefront created in Shopify
  - API token working
  - Backend can create carts for Store-B variant

**Task E10.4: Vercel Deployment for Store-B**

- **Effort**: 1.5 hours
- **Description**:
  - Create new Vercel project for Store-B
  - Connect to GitHub (main repo or separate)
  - Configure build settings:
    - Root directory: `framecraft-frontends/apps/store-b`
    - Build command: `npm run build` (or `pnpm run build`)
    - Output directory: `.next`
  - Add environment variables (from `.env` file)
  - Deploy to preview/staging
  - Configure custom domain (e.g., `store-b.customframesizes.com`)
- **Acceptance Criteria**:
  - Deployed URL accessible
  - All pages load correctly
  - Environment variables working
  - Custom domain mapped

**Task E10.5: End-to-End Testing for Store-B**

- **Effort**: 2-3 hours
- **Test Checklist**:
  - [ ] Homepage loads and displays Store-B branding
  - [ ] Designer tool loads and functions
  - [ ] Configure frame (size, style, mat, glass)
  - [ ] Add to cart (toast notification)
  - [ ] View cart page → Item visible with correct config
  - [ ] Modify quantity → Subtotal updates
  - [ ] Proceed to checkout → Redirects to Shopify
  - [ ] Shopify checkout shows correct price (Cart Transform working)
  - [ ] Complete test purchase
  - [ ] Verify order in Shopify Admin with correct attributes
  - [ ] Cookie persistence (close browser, reopen, item still there)
  - [ ] Mobile responsive (test on iPhone/iPad)
  - [ ] No console errors (Chrome DevTools)
  - [ ] Performance acceptable (Lighthouse ≥ 90)
- **Acceptance Criteria**:
  - All tests pass
  - No critical errors
  - Ready for limited customer traffic

---

#### Epic 11: Identify Refactoring Needs & Architectural Insights

**Task E11.1: Code Duplication Audit**

- **Effort**: 2 hours
- **Description**:
  - During Store-B migration, catalog all code duplicated from Store-A:
    - Component duplication
    - Logic duplication
    - Configuration duplication
    - CSS/styling duplication
  - Create spreadsheet:
    - File path
    - Type (component, logic, config)
    - Size/complexity (small, medium, large)
    - Refactoring priority (high, medium, low)
    - Reusability potential (yes/no)
- **Acceptance Criteria**:
  - Duplication audit completed
  - Spreadsheet created
  - Refactoring roadmap identified

**Task E11.2: Assets Structure Analysis**

- **Effort**: 2 hours
- **Description**:
  - Evaluate current assets structure:
    - Frame images location
    - Mat images location
    - UI icons/logos location
    - Static assets organization
  - Questions to answer:
    - Can images be shared across stores?
    - Should frame/mat images be versioned?
    - Is CDN structure optimal?
    - Any redundant assets?
  - Propose improvements:
    - Shared asset library
    - Store-specific overrides
    - CDN path structure
- **Deliverable**: Assets structure improvement proposal

**Task E11.3: Component Extraction Plan**

- **Effort**: 2-3 hours
- **Description**:
  - Based on duplication audit, plan component extraction to `@framecraft/ui`
  - Identify candidates:
    - Designer layouts (could be generic)
    - Preview components (shared logic)
    - Control panels (mat, frame, glass selector)
    - Form components (inputs, buttons)
    - Cart components
  - Plan for per-store customization:
    - Props for store-specific colors/text
    - Theme provider for styling
    - Content slots for store variations
  - Effort estimate per component
- **Deliverable**: Component extraction roadmap

**Task E11.4: Proof of Concept: Extract One Component**

- **Effort**: 3-4 hours
- **Description**:
  - Pick one small, duplicated component
  - Extract to `@framecraft/ui` package
  - Update both Store-A and Store-B to use shared version
  - Document process and lessons learned
  - Use as template for remaining extractions
  - Example: `FrameStyleSelector` component
- **Acceptance Criteria**:
  - Component works in both stores
  - Customization props work correctly
  - No regression in functionality
  - Process documented for team

---

**PHASE 5 DELIVERABLE**: ✅ Store-B fully deployed and tested. Proof of concept validated. Refactoring needs identified. Process documented for remaining stores.

---

### PHASE 6: CODE REFACTORING & CONVENTIONS (Weeks 7-9)

**Goal**: Improve code quality, maintainability, consistency. Establish patterns for all 10 stores.

#### Epic 12: Coding Standards & Tooling Setup

**Task E12.1: Establish Coding Conventions**

- **Effort**: 3 hours
- **Description**:
  - Create `CODING_STANDARDS.md` document covering:
    - **File organization**:
      - Components in `src/components/`
      - Utilities in `src/lib/`
      - Hooks in `src/hooks/`
      - Constants in `src/constants/`
      - Types in `src/types/`
    - **Naming conventions**:
      - Components: PascalCase (`FrameDesigner.tsx`)
      - Functions/hooks: camelCase (`calculatePrice`, `useCart`)
      - Constants: UPPER_CASE (`FRAME_STYLES`, `DEFAULT_MAT_SIZE`)
      - Files: match export name
    - **Component structure**:
      - Props interface defined
      - Default props listed
      - JSDoc comments on public functions
      - Forward refs if needed
    - **Styling**:
      - Tailwind utilities only (no inline styles)
      - No runtime CSS-in-JS
      - Use theme variables from design tokens
    - **TypeScript**:
      - Strict mode enabled
      - No `any` types
      - Explicit return types on functions
      - Branded types for IDs (e.g., `type FrameId = string & { readonly __brand: "FrameId" }`)
    - **Testing**:
      - Unit tests for utilities/hooks
      - Component tests for complex components
      - Snapshot tests avoided (brittle)
    - **Git**:
      - Small, focused commits
      - Branch naming: `feature/X`, `fix/Y`, `refactor/Z`
      - Commit messages: start with verb ("Add", "Fix", "Refactor")
  - Review with team, finalize
- **Acceptance Criteria**:
  - Conventions documented
  - Approved by team
  - Shared with all developers
  - Example code provided

**Task E12.2: ESLint & Prettier Configuration**

- **Effort**: 2-3 hours
- **Description**:
  - Audit current ESLint rules
  - Create comprehensive `.eslintrc.json`:
    - React best practices (rules from `eslint-plugin-react`)
    - TypeScript rules (rules from `@typescript-eslint/eslint-plugin`)
    - a11y rules (accessibility, from `eslint-plugin-jsx-a11y`)
    - Import ordering (from `eslint-plugin-import`)
    - Disable conflicting rules (like semicolon rules if Prettier handles)
  - Configure Prettier (`.prettierrc`):
    - Print width: 100 (matches convention)
    - Tab width: 2
    - Use tabs: false
    - Trailing commas: all
    - Arrow parens: always
  - Add husky + lint-staged for pre-commit checks:
    - Run linter on staged files before commit
    - Fail commit if linting errors
  - Example `.eslintrc.json`:
    ```json
    {
      "extends": [
        "next",
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript"
      ],
      "rules": {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "jsx-a11y/no-static-element-interactions": "warn",
        "import/order": [
          "error",
          {
            "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
            "alphabeticalOrder": true
          }
        ]
      }
    }
    ```
- **Acceptance Criteria**:
  - ESLint configured for all rules
  - Prettier configured and working
  - Pre-commit hooks enforcing rules
  - No high-priority violations in codebase

**Task E12.3: Run Initial Linting & Auto-Fix**

- **Effort**: 2-3 hours
- **Description**:
  - Run `eslint . --fix` across entire codebase
  - Manually fix any rules that can't auto-correct
  - Review and commit fixes
  - Ensure all stores pass linting
  - Document any exceptions (e.g., complex files with many violations)
- **Acceptance Criteria**:
  - All files pass linting
  - Linting configured in CI/CD
  - Build fails if linting fails

---

#### Epic 13: Component Extraction & Refactoring

**Task E13.1: Extract Shared UI Components**

- **Effort**: 4-5 hours
- **Description**:
  - Move duplicated components to `@framecraft/ui`:
    - Designer layouts (generic structure)
    - Control panels (frame selector, mat selector, glass selector)
    - Form inputs (custom inputs with consistent styling)
    - Buttons (primary, secondary, ghost variants)
    - Cards/sections
    - Modals/dialogs
  - Each component:
    - Exported from `@framecraft/ui/components/[name]`
    - Has TypeScript props interface
    - Has JSDoc comments
    - Has unit tests
    - Supports theming via design tokens
  - Update Store-A and Store-B to import from shared package
- **Acceptance Criteria**:
  - Duplicated components removed from individual stores
  - Shared components work in both stores
  - Component props allow customization
  - No regression in functionality

**Task E13.2: Extract Shared Business Logic**

- **Effort**: 3-4 hours
- **Description**:
  - Move duplicated logic to `@framecraft/core`:
    - `calculatePrice(config)` - Pricing engine
    - `serializeConfig(config)` - Serialize to Shopify attributes
    - `deserializeConfig(attributes)` - Parse from Shopify
    - `validateConfiguration(config)` - Input validation
    - Cart management hooks (`useCart`, `useCheckout`)
    - Designer state management
  - Document each function with JSDoc
  - Add unit tests
  - No UI dependencies (pure functions)
- **Acceptance Criteria**:
  - Logic extracted to core package
  - All functions unit tested
  - Used by both stores
  - Documentation complete

**Task E13.3: Extract Design Tokens & Theme**

- **Effort**: 2-3 hours
- **Description**:
  - Create `@framecraft/tokens` package (if not already done)
  - Define design tokens:
    - Colors (primary, secondary, accent, semantic: success, error, warning)
    - Typography (font sizes, weights, line heights)
    - Spacing (4px scale: 4, 8, 12, 16, 20, 24, 32...)
    - Border radius (sm, md, lg)
    - Shadows (sm, md, lg)
    - Z-index scale
  - Export as:
    - TypeScript constants
    - CSS variables
    - JSON for design systems
  - Use in Tailwind config (tailwind.config.ts):
    ```typescript
    import { colors, spacing } from "@framecraft/tokens";
    export default {
      theme: {
        colors,
        spacing,
      },
    };
    ```
  - Per-store customization via CSS variables override
- **Acceptance Criteria**:
  - Tokens defined centrally
  - Used across all components
  - Customizable per store
  - No hardcoded colors/spacing

**Task E13.4: Modularize Designer Components**

- **Effort**: 4-5 hours
- **Description**:
  - Current designers may be monolithic (one large file)
  - Break into smaller, testable components:
    - `<DesignerLayout>` - Main container
    - `<PreviewSection>` - Shows preview
    - `<ControlPanel>` - Configuration options
    - `<FrameSelector>` - Frame style selector
    - `<MatSelector>` - Mat options
    - `<GlassSelector>` - Glazing options
    - `<SizeInput>` - Artwork size input
  - Each component:
    - Single responsibility
    - Testable in isolation
    - Shared across different designer types
  - Compose designers from smaller pieces:
    ```typescript
    <DesignerLayout>
      <PreviewSection config={config} />
      <ControlPanel config={config} onChange={handleChange} />
    </DesignerLayout>
    ```
- **Acceptance Criteria**:
  - Designer components broken into smaller pieces
  - Components reusable across different designer types
  - No regression in functionality
  - Unit tests for each component

---

#### Epic 14: Type Safety & TypeScript Strictness

**Task E14.1: Enable TypeScript Strict Mode**

- **Effort**: 2-3 hours
- **Description**:
  - Update `tsconfig.json` in `@framecraft/core` and `@framecraft/ui`:
    ```json
    {
      "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true
      }
    }
    ```
  - Fix type errors in critical packages
  - Document exceptions (if any)
- **Acceptance Criteria**:
  - Strict mode enabled
  - No type errors on build
  - Type coverage > 95%

**Task E14.2: Use Branded Types for Critical IDs**

- **Effort**: 1.5 hours
- **Description**:
  - Prevent accidental ID swaps (e.g., frame ID as mat ID)
  - Create branded types:

    ```typescript
    // lib/types.ts
    export type FrameId = string & { readonly __brand: "FrameId" };
    export type MatId = string & { readonly __brand: "MatId" };
    export type GlassId = string & { readonly __brand: "GlassId" };

    // Helper functions
    export const asFrameId = (id: string): FrameId => id as FrameId;
    export const asMatId = (id: string): MatId => id as MatId;
    ```

  - Use in function signatures:
    ```typescript
    function getFrame(frameId: FrameId): Frame | null { ... }
    ```
  - This prevents passing wrong ID type to function
- **Acceptance Criteria**:
  - Branded types defined
  - Used in critical functions
  - Type system prevents common mistakes

**Task E14.3: Add JSDoc to Critical Functions**

- **Effort**: 2-3 hours
- **Description**:
  - Add JSDoc comments to:
    - Pricing functions
    - Configuration serialization/deserialization
    - API functions
    - Complex utilities
  - Example:
    ```typescript
    /**
     * Calculate the total price for a frame configuration.
     *
     * @param config - The frame configuration with all options selected
     * @returns The price in cents (multiply by 0.01 for dollars)
     *
     * @example
     * const price = calculatePrice({
     *   artworkWidth: 16,
     *   artworkHeight: 20,
     *   frameStyleId: "8446",
     *   matType: "double",
     * });
     * console.log(price); // 12995 cents = $129.95
     */
    export function calculatePrice(config: FrameConfiguration): number {
      // ...
    }
    ```
- **Acceptance Criteria**:
  - Critical functions have JSDoc
  - Examples included
  - Parameters documented
  - Return types clear

---

#### Epic 15: Testing Infrastructure

**Task E15.1: Unit Tests for Core Package**

- **Effort**: 5-6 hours
- **Description**:
  - Add Jest tests to `@framecraft/core`
  - Test coverage:
    - `calculatePrice()` - 10+ test cases
      - Basic frame
      - With mat
      - With museum glass
      - Complex config
      - Edge cases (very large, very small)
    - `serializeConfig()` / `deserializeConfig()` - 5+ cases
    - `validateConfiguration()` - 5+ cases
    - `useCart()` hook - 10+ cases
      - Add item
      - Remove item
      - Update quantity
      - Clear cart
      - Persist/restore
  - Mocking:
    - Mock Shopify API calls
    - Mock local storage
    - Mock fetch
  - Target: 80%+ code coverage on core package
- **Acceptance Criteria**:
  - Tests pass locally
  - Tests pass in CI/CD
  - Code coverage ≥ 80%

**Task E15.2: Component Tests**

- **Effort**: 3-4 hours
- **Description**:
  - Add tests for complex/shared components
  - Use React Testing Library
  - Test user interactions:
    - Input changes
    - Button clicks
    - Form submissions
  - Example:
    ```typescript
    describe("FrameSelector", () => {
      it("allows user to select frame style", () => {
        render(<FrameSelector onChange={onChange} />);
        const button = screen.getByRole("button", { name: /oak wood/i });
        fireEvent.click(button);
        expect(onChange).toHaveBeenCalledWith("8446");
      });
    });
    ```
  - Target: 70%+ coverage on UI components
- **Acceptance Criteria**:
  - Component tests pass
  - User interactions tested
  - Code coverage ≥ 70%

**Task E15.3: Add Tests to CI/CD Pipeline**

- **Effort**: 1.5 hours
- **Description**:
  - Update CI/CD (GitHub Actions or similar):
    - Run tests on every PR
    - Fail if tests don't pass
    - Fail if coverage drops below threshold
    - Report coverage in PR
  - Example GitHub Actions workflow:
    ```yaml
    - name: Run tests
      run: npm run test -- --coverage
    - name: Check coverage
      run: npm run coverage:check
    ```
- **Acceptance Criteria**:
  - Tests run in CI/CD
  - Build fails if tests fail
  - Coverage tracked over time

---

**PHASE 6 DELIVERABLE**: ✅ Code standards established. Linting configured. Shared components extracted. Type safety improved. Testing infrastructure in place. Codebase more maintainable.

---

### PHASE 7: CMS EXPLORATION & STRAPI SETUP (Weeks 9-10)

**Goal**: Evaluate CMS for content management. Proof of concept for Strapi. Plan for content migration.

#### Epic 16: CMS Architecture & Evaluation

**Task E16.1: Define Content Categories for CMS**

- **Effort**: 2 hours
- **Description**:
  - Identify content that should move to CMS (vs. stay in code):
    - ✅ **Suitable for CMS**:
      - Blog articles
      - Guides/tutorials
      - Testimonials
      - Hero images/text
      - FAQs
      - Static pages (about, contact)
      - Footer links
      - Global settings (site name, contact info)
    - ❌ **NOT suitable for CMS**:
      - Frame/mat catalog (stays in code + Shopify)
      - Frame images (stay in CDN)
      - Component code
      - Pricing logic
      - Cart configuration
  - Document rationale for each decision
  - Plan content model
- **Deliverable**: Content classification document

**Task E16.2: Evaluate CMS Options (Strapi vs. Alternatives)**

- **Effort**: 3-4 hours
- **Description**:
  - Evaluate Strapi as primary option
  - Criteria to assess:
    - **Development ease**: How hard to set up and customize?
    - **Performance**: Response times for content queries?
    - **Scalability**: Can it handle 10+ sites + future growth?
    - **Cost**: Self-hosted vs. cloud hosting?
    - **Learning curve**: Team familiarity with platform?
    - **Content model flexibility**: Can we define custom content types?
    - **API options**: Headless API (REST/GraphQL)?
    - **Permissions**: Can we restrict editors by site/content?
  - Alternatives to consider:
    - Strapi (open-source, self-hosted, flexible)
    - Sanity (cloud-based, good for content, pricey)
    - Contentful (enterprise-focused, expensive)
    - Directus (open-source, simpler than Strapi)
  - Create comparison matrix
  - **Recommendation**: Likely Strapi (open-source, flexible, good for this use case)
- **Deliverable**: CMS evaluation document with recommendation

**Task E16.3: Design Content Model for Strapi**

- **Effort**: 3 hours
- **Description**:
  - Define Strapi collections for content:
    - **BlogPost**:
      - title, slug, content (rich text), excerpt, featured image
      - author, publishedAt, updatedAt
      - tags, category
    - **Guide**:
      - title, slug, content (rich text), featured image
      - section (e.g., "How-to", "Tips", "Troubleshooting")
      - relatedGuides (array of Guide references)
    - **Testimonial**:
      - quote, author name, author role
      - image (optional)
      - rating (1-5 stars)
      - featured (boolean for homepage)
    - **Hero**:
      - title, subtitle, image
      - ctaText, ctaUrl
      - active (boolean to enable/disable)
      - appliesTo (which page/site)
    - **GlobalSettings**:
      - siteName, siteDescription
      - contactEmail, contactPhone, supportUrl
      - socialLinks (array of platform + URL)
      - companyAddress, companyName
  - Define permissions:
    - Admin: Full access
    - Editor: Can edit content per site
    - Viewer: Read-only access
  - Create ERD (Entity Relationship Diagram)
- **Deliverable**: Content model diagram + Strapi configuration

**Task E16.4: Set Up Strapi Proof of Concept**

- **Effort**: 4-5 hours
- **Description**:
  - Create Strapi instance (local dev first):
    ```bash
    npx create-strapi-app@latest my-project --quickstart
    ```
  - Configure content types:
    - Create BlogPost collection
    - Create Guide collection
    - Create Testimonial collection
    - Create Hero collection
    - Create GlobalSettings singleton
  - Add sample data:
    - 2-3 blog posts
    - 2-3 guides
    - 2-3 testimonials
  - Set up API access:
    - Public API token for frontend (read-only)
    - Admin token for content editors
  - Test API queries:
    - `GET /api/blog-posts` (list)
    - `GET /api/blog-posts/[id]` (detail)
    - `GET /api/guides?populate=relatedGuides` (with relations)
  - Document setup process
- **Acceptance Criteria**:
  - Strapi running locally
  - Content types created
  - API queries working
  - Sample data loaded
  - Setup documented

---

#### Epic 17: Frontend Integration (Proof of Concept)

**Task E17.1: Create CMS Data Fetching Layer**

- **Effort**: 2-3 hours
- **Description**:
  - Create utility to fetch from Strapi:

    ```typescript
    // lib/strapi.ts
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

    export async function fetchBlogPosts() {
      const res = await fetch(`${STRAPI_URL}/api/blog-posts?sort=publishedAt:desc`, {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      });
      return res.json();
    }

    export async function fetchBlogPost(slug: string) {
      const res = await fetch(
        `${STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`,
        { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
      );
      return res.json();
    }
    ```

  - Add caching (React Query or Next.js ISR)
  - Error handling
  - Type definitions for CMS content
- **Acceptance Criteria**:
  - Fetching layer works
  - Content cacheable
  - Type-safe responses

**Task E17.2: Migrate Blog Posts to CMS**

- **Effort**: 3-4 hours
- **Description**:
  - Move existing blog content to Strapi:
    - If blog currently in Markdown files: migrate to Strapi
    - If blog in code: migrate to CMS
    - Or create new blog post in CMS as test
  - Update frontend pages:
    - Instead of importing Markdown: fetch from Strapi
    - Update `/blog` list page: `getStaticProps` → fetch from Strapi
    - Update `/blog/[slug]` detail page: fetch by slug
  - Revalidate pages with ISR (Incremental Static Regeneration):
    ```typescript
    export async function getStaticProps({ params }) {
      const post = await fetchBlogPost(params.slug);
      return {
        props: { post },
        revalidate: 3600, // Revalidate every hour
      };
    }
    ```
  - Test:
    - Content displays correctly
    - Images render
    - Links work
    - Performance acceptable
- **Acceptance Criteria**:
  - Blog posts fetched from Strapi
  - Pages render correctly
  - Images load
  - Performance good (≥ Lighthouse 90)

**Task E17.3: Migrate Testimonials to CMS**

- **Effort**: 2 hours
- **Description**:
  - Similar to blog migration:
    - Move testimonial data to Strapi
    - Update homepage to fetch `featured=true` testimonials
    - Display dynamically instead of hardcoded
  - Test on homepage
- **Acceptance Criteria**:
  - Testimonials fetched from CMS
  - Homepage displays correctly
  - Can add/edit testimonials without code changes

**Task E17.4: Create CMS Admin Interface Documentation**

- **Effort**: 1.5 hours
- **Description**:
  - Document for content editors:
    - How to log in to Strapi
    - How to create/edit blog post
    - How to publish and unpublish
    - Required fields and formats
    - How to add images
    - Markdown syntax support
  - Create video tutorial (optional)
  - Include troubleshooting
- **Acceptance Criteria**:
  - Documentation clear for non-technical editors
  - Video tutorial (if created) helpful
  - Support contact listed

---

#### Epic 18: Deployment & Hosting Strategy

**Task E18.1: Choose Strapi Hosting Option**

- **Effort**: 2 hours
- **Description**:
  - Evaluate hosting options:
    - **Self-hosted on VPS** (e.g., Linode, DigitalOcean):
      - Pros: Full control, cheaper
      - Cons: Manage updates, security
    - **Strapi Cloud** (strapi.io):
      - Pros: Managed, simple
      - Cons: More expensive, less control
    - **Railway** (railway.app):
      - Pros: Simple, good for monoliths
      - Cons: Pricing model
  - **Recommendation**: Self-hosted VPS or Railway (cheaper, suitable for this scale)
  - Document choice and rationale
- **Deliverable**: Hosting decision document

**Task E18.2: Set Up Production Strapi Instance**

- **Effort**: 3-4 hours
- **Description**:
  - Deploy Strapi to chosen hosting:
    - Configure environment variables
    - Set up database (PostgreSQL recommended)
    - Configure CDN for media uploads
    - Set up backups
    - Configure SSL/TLS
  - Configure production settings:
    - Admin panel password
    - API tokens for frontend
    - Rate limiting
    - CORS for frontend origins
  - Set up monitoring/alerting
  - Document deployment process
- **Acceptance Criteria**:
  - Strapi running in production
  - Database configured
  - API accessible from frontend
  - Backups scheduled

**Task E18.3: Set Up Continuous Deployment for CMS**

- **Effort**: 2 hours
- **Description**:
  - If Strapi in Git repo: set up CI/CD to deploy on commit
  - Or use manual deployment process (documented)
  - Configure:
    - Database migrations on deploy
    - Plugin installation if needed
    - Environment variables per environment
  - Test deployment process
- **Acceptance Criteria**:
  - Deployment process clear
  - Zero-downtime updates possible
  - Rollback plan documented

---

**PHASE 7 DELIVERABLE**: ✅ CMS evaluated and chosen. Strapi PoC deployed. Content model designed. Blog/testimonials migrated to CMS. Hosting strategy decided. Editors trained.

---

### PHASE 8: REMAINING STORE MIGRATIONS (Weeks 10-12)

**Goal**: Migrate Stores C-J using validated process from Store-B. Parallel migrations possible.

#### Epic 19: Bulk Store Rollout

**Task E19.1: Store-C through Store-J Deployment**

- **Effort**: 1-1.5 hours each (10 stores × total 10-15 hours)
- **Process** (same as Store-B):
  1. Clone Store-A → Store-X
  2. Update configuration (`SITE_ID`, branding, API tokens)
  3. Create Shopify market
  4. Deploy to Vercel
  5. Run QA checklist
  6. Mark as production-ready
- **Parallelization**:
  - Architect: Focus on first 2-3 stores (C, D, E) for quality control
  - Developer: Handle remaining stores (F-J) once process validated
  - Both can work simultaneously on different stores
- **Acceptance Criteria**:
  - All 10 stores deployed
  - Each passes QA checklist
  - Branding unique per store
  - Cart Transform working on all

**Task E19.2: Bulk Configuration & Assets Management**

- **Effort**: 3-4 hours
- **Description**:
  - Create configuration management system:
    - Store metadata (name, domain, support email, etc.)
    - Centralized brand config values
    - Per-store overrides
  - Asset management:
    - Logo per store (SVG + PNG)
    - Favicon per store
    - OG images per store
    - Shared frame/mat images across stores
  - Automation:
    - Script to generate `.env` file per store
    - Script to deploy all stores at once
    - Script to verify all stores health
- **Acceptance Criteria**:
  - Configuration system works
  - Easy to add new store
  - Assets organized centrally

---

**PHASE 8 DELIVERABLE**: ✅ All 10 storefronts deployed. Parallel infrastructure validated. Multi-tenant system operating smoothly.

---

### PHASE 9: FINAL QA, DOCUMENTATION & HANDOFF (Weeks 10-12)

**Goal**: Comprehensive testing, documentation, knowledge transfer.

#### Epic 20: Cross-Store Testing & Validation

**Task E20.1: Comprehensive QA Test Matrix**

- **Effort**: 8-10 hours
- **Description**:
  - Test matrix covering:
    - All 10 stores
    - All designer types (picture frame, shadowbox, diploma, certificate)
    - All features (add to cart, checkout, cart persistence, etc.)
  - Spreadsheet with:
    - Store name
    - Test case
    - Expected result
    - Actual result
    - Pass/Fail
    - Notes/bugs
  - Bug tracking:
    - Create GitHub issues for any failures
    - Prioritize critical vs. minor
    - Fix critical bugs immediately
- **Acceptance Criteria**:
  - All stores tested
  - QA matrix complete
  - All critical bugs fixed
  - Minor bugs documented for future

**Task E20.2: Performance Validation Across All Stores**

- **Effort**: 3-4 hours
- **Description**:
  - Run Lighthouse on each store (homepage, designer, category)
  - Target: Score ≥ 90 on all
  - Monitor:
    - LCP < 2.5s
    - CLS < 0.1
    - FID < 100ms
  - Document results
  - Fix critical issues
- **Acceptance Criteria**:
  - All stores score ≥ 90 on Lighthouse
  - Performance consistent across stores

**Task E20.3: Security Audit**

- **Effort**: 3-4 hours
- **Description**:
  - Verify security across all stores:
    - HTTPS enforced
    - No API keys exposed in frontend code
    - CORS configured correctly
    - Cart IDs in HTTP-only cookies
    - Rate limiting on API
    - Pricing validation on backend
    - Input validation (no XSS)
  - Run security scanner if available
  - Document findings and fixes
- **Acceptance Criteria**:
  - No critical security issues
  - API keys properly protected
  - HTTPS enforced
  - CORS configured securely

---

#### Epic 21: Comprehensive Documentation

**Task E21.1: Architecture & Design Documentation**

- **Effort**: 4-5 hours
- **Description**:
  - Create/update key documents:
    - **ARCHITECTURE.md**: System overview, data flow, Cart Transform flow
    - **SHOPIFY_INTEGRATION.md**: How Shopify integration works, Cart Transform details
    - **SEO_IMPLEMENTATION.md**: SEO approach, metadata system, structured data
    - **CMS_INTEGRATION.md**: How CMS connects to frontend, content model
    - **DEPLOYMENT_GUIDE.md**: How to deploy new store, how to deploy code changes
    - **PERFORMANCE_OPTIMIZATION.md**: Caching strategy, CDN config, Core Web Vitals
  - Include:
    - Diagrams where helpful
    - Real code examples
    - Decision rationale (why we chose this approach)
- **Acceptance Criteria**:
  - Key documents complete
  - Updated with current implementation
  - Diagrams and examples included

**Task E21.2: API & Integration Documentation**

- **Effort**: 2-3 hours
- **Description**:
  - Document backend API:
    - Endpoints (method, path, auth)
    - Request/response examples
    - Error codes and meanings
    - Rate limits
    - Webhook structure
  - Document Shopify integration:
    - Cart Transform function code
    - Line attributes format
    - API tokens and access
    - Market configuration
  - Document CMS integration:
    - Strapi content types
    - API endpoints for frontend
    - Image upload process
    - Publishing workflow
- **Acceptance Criteria**:
  - API fully documented
  - Examples provided
  - Error handling explained

**Task E21.3: Operational Runbooks**

- **Effort**: 3-4 hours
- **Description**:
  - Create runbooks for common operations:
    - **Deploy new code**: Steps to deploy to Vercel
    - **Add new store**: Checklist to add 11th store
    - **Rollback deployment**: How to revert if needed
    - **Troubleshoot cart issues**: How to debug pricing, cart syncing
    - **Troubleshoot Cart Transform**: How to check Shopify logs
    - **Monitor performance**: How to check metrics, alerts
    - **Handle high traffic**: How to scale, manage rate limits
  - Each runbook includes:
    - Prerequisites
    - Step-by-step instructions
    - Expected outputs
    - Troubleshooting if something goes wrong
- **Acceptance Criteria**:
  - Runbooks cover critical operations
  - Clear and easy to follow
  - Tested by team (someone other than author runs it)

**Task E21.4: Knowledge Transfer & Training**

- **Effort**: 4-5 hours
- **Description**:
  - Prepare for handoff to operations team:
    - Overview presentation (30 mins)
      - Architecture
      - Key decisions
      - Important files/locations
    - Deep dive sessions (1-2 hours each):
      - Cart & checkout flow
      - Cart Transform function
      - SEO approach
      - CMS integration
      - Multi-store management
    - Q&A session (1 hour)
    - Pair programming on common tasks:
      - Deploy new store
      - Debug cart issue
      - Update CMS content
  - Record sessions for future reference
- **Acceptance Criteria**:
  - Team trained on key systems
  - Sessions recorded
  - Questions answered
  - Team confident in operations

**Task E21.5: Code Documentation & Comments**

- **Effort**: 2-3 hours
- **Description**:
  - Ensure critical code has comments:
    - Complex algorithms
    - Non-obvious logic
    - Important edge cases
    - Business logic that's not obvious from code
  - Add README files:
    - Root README: Overview of project
    - `packages/*/README.md`: Package-specific docs
    - `apps/store-a/README.md`: Store-specific docs
  - Example:
    ```typescript
    /**
     * Calculate price with mat border width premium.
     * Double mats cost 2x the base mat price.
     * This is a business rule defined by pricing team.
     */
    function calculateMatPrice(matType: MatType): number {
      // ...
    }
    ```
- **Acceptance Criteria**:
  - Critical functions have JSDoc
  - README files complete
  - Code is self-documenting

---

**PHASE 9 DELIVERABLE**: ✅ All systems tested and validated. Comprehensive documentation complete. Team trained. Project ready for long-term maintenance.

---

## 📅 WEEKLY TIMELINE & MILESTONES

| Week | Focus                          | Deliverables                                     |
| ---- | ------------------------------ | ------------------------------------------------ |
| 1    | Cart Transform + ADA fixes     | Cart Transform deployed, tested, 6/6 ADA fixes   |
| 2    | Theming + SEO foundation       | Theming complete, metadata on all pages          |
| 3    | SEO content + performance      | 10 guides, Core Web Vitals ≥ 90                  |
| 4    | WCAG compliance finish         | All accessibility tests passing                  |
| 5    | CDN + performance optimization | Images cached, bundle optimized                  |
| 6    | Store-B PoC                    | Store-B production-ready, refactoring identified |
| 7    | Code standards + refactoring   | Linting configured, components extracted         |
| 8    | CMS setup + testing            | Strapi deployed, blog/testimonials migrated      |
| 9    | Stores C-E migration           | 3 additional stores deployed                     |
| 10   | Stores F-J migration           | 5 additional stores deployed                     |
| 11   | Final QA + documentation       | All systems tested, runbooks created             |
| 12   | Handoff & training             | Team trained, documentation complete             |

---

## ✅ PHASE ACCEPTANCE CRITERIA SUMMARY

| Phase | Goals                           | Status                             |
| ----- | ------------------------------- | ---------------------------------- |
| 1     | Cart Transform deployed, tested | ✅ Production-ready                |
| 2     | SEO foundation complete         | ✅ Discoverable organically        |
| 3     | WCAG compliance                 | ✅ ADA Level AA                    |
| 4     | Performance optimized           | ✅ Core Web Vitals ≥ 90            |
| 5     | Store-B validated               | ✅ Multi-store architecture proven |
| 6     | Code quality improved           | ✅ Maintainable, consistent        |
| 7     | CMS integrated                  | ✅ Content management accessible   |
| 8     | All stores deployed             | ✅ 10-store multi-tenant system    |
| 9     | Documentation complete          | ✅ Team trained, operations ready  |

---

## 🎯 SUCCESS METRICS

| Metric                      | Target               | Timeline      |
| --------------------------- | -------------------- | ------------- |
| Cart Transform Success Rate | 99.9%                | Week 1 onward |
| Pricing Accuracy            | 100%                 | Week 1 onward |
| ADA/WCAG Compliance         | 100% (Level AA)      | Week 4        |
| Core Web Vitals (LCP)       | < 2.5s               | Week 5        |
| Organic Traffic             | +40%                 | Months 2-3    |
| Stores Deployed             | 10                   | Week 10       |
| Code Coverage               | ≥ 80%                | Week 9        |
| Documentation Completeness  | 100%                 | Week 12       |
| Team Readiness              | Ready for operations | Week 12       |

---

## 📞 COMMUNICATION STRATEGY

- **Daily**: Async Slack updates on blockers/progress
- **Weekly**: Friday sync (30 mins) - review week, plan next week
- **As needed**: Ad-hoc calls for critical decisions
- **Documentation**: All decisions logged (ADRs, design docs)
- **Status reports**: Weekly email to stakeholders

---

## 🚨 RISK MITIGATION

| Risk                    | Mitigation                                                          |
| ----------------------- | ------------------------------------------------------------------- |
| Cart Transform bugs     | Comprehensive testing (Phase 1), monitoring/alerts, rollback plan   |
| Performance degradation | Core Web Vitals monitoring, load testing before launch              |
| Compliance issues       | Automated testing, manual review, legal review before launch        |
| Refactoring regressions | Unit tests, component tests, QA matrix                              |
| Strapi complexity       | Proof of concept first, good documentation, training                |
| Multi-store complexity  | Automation scripts, configuration management, process documentation |

---

**Plan finalized and ready for execution.**  
**Execution begins: Week 1 (immediately)**  
**Expected completion: 12 weeks**
