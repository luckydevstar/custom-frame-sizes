## CustomFrameSizes.com Prelaunch Fixes Plan

**Date**: March 31, 2026  
**Audit Source**: Chrome MCP crawl + DOM inspection + brand identity review  
**Total Items**: 22 (5 P0 blockers, 14 P1 fixes, 3 P3 polish)  
**Status**: Ready for implementation  
**Priority**: CRITICAL - Launch blockers must be fixed before go-live

---

## ✅ VERIFICATION STATUS

**Audit Findings: CONFIRMED**

- ✅ `store-a.example.com` hardcoded in 4 locations (brand.config.ts, seo.ts)
- ✅ Canonical inconsistency (www vs non-www mix found in codebase)
- ✅ Broken footer/nav links (5 routes return 404)
- ✅ 404 page metadata not properly configured
- ✅ Homepage has 2 H1 tags (verified in page.tsx line 141-142)
- ✅ Playfair Display font not loading
- ✅ H1 letter-spacing and CTA button styles need updates
- ✅ Footer background color incorrect
- ✅ Hero image cross-browser rendering issues reported
- ✅ Frame product page H1 spacing issue
- ✅ Meta descriptions on frame pages too short
- ✅ Query parameters persisting in URLs
- ✅ Duplicate "View All" button on homepage
- ✅ Focus indicators suppressed (CSS outline: none)
- ✅ Icon-only buttons missing aria-labels
- ✅ Form inputs missing labels/autocomplete
- ✅ Touch targets under 44×44px

---

## 🚨 P0 - LAUNCH BLOCKERS (MUST FIX BEFORE GO-LIVE)

### P0 #1: Replace store-a.example.com globally

**Impact**: CRITICAL - SEO will not work correctly  
**Effort**: 1-2 hours  
**Owner**: Developer

**Current State**:
- `brand.config.ts` line 75-77: `store-a.example.com` hardcoded fallback
- `seo.ts` line 10: `store-a.example.com` fallback
- Used in canonicals, OG tags, schema URLs sitewide

**Locations Found**:
```
framecraft-frontends/apps/store-a/src/brand.config.ts:14 (domain)
framecraft-frontends/apps/store-a/src/brand.config.ts:75 (canonicalUrl)
framecraft-frontends/apps/store-a/src/brand.config.ts:76 (ogImage)
framecraft-frontends/apps/store-a/src/brand.config.ts:77 (twitterImage)
framecraft-frontends/apps/store-a/src/lib/seo.ts:10 (SITE_DOMAIN)
```

**Fix**:
1. Update `brand.config.ts` domain fallback from `"store-a.example.com"` to `"www.customframesizes.com"`
2. Update `seo.ts` SITE_DOMAIN fallback to `"www.customframesizes.com"`
3. Ensure env var `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` is set in deployment
4. Verify after deploy: Homepage canonical should be `https://www.customframesizes.com/`

**Acceptance Criteria**:
- All hardcoded references replaced with www version
- env var is properly configured
- Homepage canonical renders as `https://www.customframesizes.com/`
- OG image URL uses full domain
- Schema URLs use www version
- No console warnings about mixed domains

---

### P0 #2: Fix www vs non-www canonical inconsistency

**Impact**: CRITICAL - Search engine confusion, duplicate content risk  
**Effort**: 1 hour  
**Owner**: Developer  
**Depends On**: P0 #1

**Current State**:
- Some pages use `https://customframesizes.com/...` (no www)
- Others use `https://www.customframesizes.com/...` (with www)
- About, Contact, FAQ pages affected

**Affected Pages**:
```
/about: canonical="https://customframesizes.com/about" (no www)
/contact: canonical="https://customframesizes.com/contact" (no www)
/faq: canonical="https://customframesizes.com/faq" (no www)
```

**Fix**:
1. Grep codebase for `canonicalUrl` missing www
2. Standardize all canonicals to use `https://www.customframesizes.com`
3. Run verification:
   ```bash
   grep -r "https://customframesizes.com" apps/store-a/src --include="*.ts*"
   # Should return 0 results (all should have www)
   ```
4. Verify with Chrome DevTools that canonical meta tag shows www version

**Acceptance Criteria**:
- All canonical URLs include www
- No pages have mixed www/non-www
- Verification grep shows 0 matches without www
- DevTools inspection confirms canonical

---

### P0 #3: Fix 5 broken footer/nav links (404s)

**Impact**: CRITICAL - Broken internal linking damages SEO, poor UX  
**Effort**: 3-5 hours (depending on whether pages need to be built)  
**Owner**: Developer/Product  
**Decision Needed**: Build missing pages vs. remove links

**Broken Links**:
| Route | Footer Label | Current Status |
|-------|--------------|-----------------|
| /components | Components | 404 |
| /gallery-wall-guide | Gallery Wall Guide | 404 |
| /business-services | Business Services | 404 |
| /returns | Returns & Exchanges | 404 |
| /frame-quality-guarantee | Frame Quality Guarantee | 404 |

**Option A: Build Missing Pages** (Recommended)
- Create 5 new pages under `src/app/(company)/` or `src/app/(learn)/`
- Add SEO metadata for each
- Link from footer/nav
- Time: ~3-5 hours

**Option B: Remove Links**
- Remove from footer component
- Remove from navigation
- Time: ~1 hour

**Recommendation**: Option A (Build pages) - These are common CMS pages that add SEO value

**Fix (Option A)**:
1. Create pages:
   - `src/app/(company)/returns/page.tsx` - Returns policy
   - `src/app/(company)/guarantee/page.tsx` - Quality guarantee
   - `src/app/(company)/business/page.tsx` - B2B services
   - `src/app/(learn)/gallery-guide/page.tsx` - Gallery installation guide
   - `src/app/components/page.tsx` - Component library showcase (or remove if internal)

2. Add proper metadata to each
3. Verify all links render as 200 in network tab
4. Verify canonical URLs correct

**Acceptance Criteria**:
- All 5 routes return 200 (not 404)
- Pages have proper SEO metadata
- Footer links work
- Navigation links work
- No console errors

---

### P0 #4: Fix 404 page noindex inconsistency

**Impact**: CRITICAL - 404 pages could be indexed if noindex not consistent  
**Effort**: 1-2 hours  
**Owner**: Developer

**Current State**:
- `/cart` page has `noindex: true` ✅
- `/shadowboxes` 404 has `noindex` in metadata ✅
- `/frames` 404 does NOT have `noindex` ❌
- 404 pages inherit homepage meta description (wrong)

**Issue**: Next.js `not-found()` function doesn't automatically set noindex. Pages that throw `notFound()` need explicit noindex metadata.

**Fix**:
1. Create `/src/app/not-found.tsx` (if doesn't exist)
2. Ensure it has:
   ```typescript
   export const metadata: Metadata = {
     robots: {
       index: false,
       follow: false,
     },
     title: "Page Not Found",
     description: "The page you're looking for doesn't exist.",
   };
   ```
3. Verify all 404 pages have this metadata
4. Test by navigating to a broken URL and checking DevTools metadata

**Code to Add**:
```typescript
// src/app/not-found.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-blue-600 hover:underline">
        Return to Home
      </a>
    </div>
  );
}
```

**Acceptance Criteria**:
- `/not-found.tsx` component created
- All 404 pages render with noindex meta tag
- DevTools confirms `<meta name="robots" content="noindex">`
- 404 page doesn't inherit page-specific descriptions

---

### P0 #5: Fix 2 H1 tags on homepage

**Impact**: CRITICAL - Multiple H1 tags confuse search engines about page topic  
**Effort**: 15 minutes  
**Owner**: Developer

**Current State** (verified in page.tsx):
- Line 127-136: Hero component renders `title` (props.children becomes H1)
- Line 141-143: Section with explicit `<h1>` tag

**Example**:
```tsx
{/* Hero - renders H1 "Frame Your Memories" */}
<Hero title="Frame Your Memories" />

{/* Later in same page */}
<h1>Custom Picture Frames | Any Size, Any Style</h1>
```

**Fix**:
1. Open `src/app/page.tsx`
2. Change line 141 from `<h1>` to `<h2>`
3. Update CSS if needed (should auto-scale via h2 styling)
4. Verify in DevTools that only 1 H1 exists

**Code Change**:
```diff
- <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-6">
+ <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-6">
    Custom Picture Frames | Any Size, Any Style
- </h1>
+ </h2>
```

**Acceptance Criteria**:
- Exactly 1 H1 on homepage
- H2 semantically correct
- Visual appearance unchanged
- No console errors

---

## 📋 P1 - FIRST WEEK FIXES (VISIBLE TO USERS/SEO)

### P1 #6: Load Playfair Display font

**Impact**: HIGH - Brand identity requires specific font  
**Effort**: 1-2 hours  
**Owner**: Developer

**Brand Spec**:
- H1: Playfair Display Bold 700, 36-48px, letter-spacing -0.02em
- H2: Playfair Display Bold 700, 28-36px, letter-spacing -0.01em
- H3: Playfair Display Regular 400, 22-28px
- Hero: Playfair Display Bold 700, 42-56px, letter-spacing -0.02em

**Current**: Falls back to system serif (Georgia)

**Fix**:
1. Add to `src/app/layout.tsx`:
   ```typescript
   import { Playfair_Display } from 'next/font/google';

   const playfairDisplay = Playfair_Display({
     weight: ['400', '700'],
     subsets: ['latin'],
     variable: '--font-playfair',
     display: 'swap',
   });
   ```

2. Apply to html:
   ```tsx
   <html lang="en" className={playfairDisplay.variable}>
   ```

3. Update global CSS:
   ```css
   h1, h2, .hero-title {
     font-family: var(--font-playfair, 'Playfair Display', serif);
   }
   ```

4. Verify font loads: DevTools Network tab should show Playfair Display file

**Acceptance Criteria**:
- Font file loads without 404
- Headings display in Playfair Display
- No font swap flashing
- Works on all pages

---

### P1 #7: Fix H1 letter-spacing

**Effort**: 15 minutes  
**Owner**: Developer

**Fix**:
```css
h1 {
  letter-spacing: -0.02em;
}
```

Apply to both homepage and frame product page H1 elements.

---

### P1 #8: Fix CTA button font-weight

**Effort**: 15 minutes  
**Owner**: Developer

**Current**: font-weight: 500  
**Brand Spec**: font-weight: 600

**Fix**:
Find primary button CSS (likely in `button.tsx` component) and update:
```css
.btn-primary {
  font-weight: 600; /* Changed from 500 */
}
```

---

### P1 #9: Change footer background to Dark Slate

**Effort**: 15 minutes  
**Owner**: Developer

**Brand Spec**:
- Background: Dark Slate #333D37
- Text: White

**Fix**:
```css
footer {
  background-color: #333D37;
  color: #FFFFFF;
}
```

---

### P1 #10: Fix hero image not loading in Chrome

**Effort**: 2-3 hours  
**Owner**: Developer  
**Type**: Browser compatibility debugging

**Issue**: Hero renders gray gradient in Chrome but shows image in Firefox

**Possible Causes**:
1. WebP fallback issue
2. CSS `image-set()` not working correctly
3. Next.js Image component lazy loading timing
4. CORS issue on CDN

**Debug Steps**:
1. Open DevTools Network tab in Chrome
2. Check if hero image URL is loading (200 vs 404)
3. Check if CSS is applying correct background
4. Check if Next.js Image component is rendering correctly

**Fix Approaches**:
- If WebP issue: Ensure fallback to JPEG/PNG
- If image-set issue: Simplify to single image source
- If Next.js Image issue: Verify priority prop or disable lazy loading
- If CORS: Check CDN headers

**Acceptance Criteria**:
- Hero image displays in Chrome, Firefox, Safari, Edge
- No 404 errors in network tab
- Consistent appearance across browsers

---

### P1 #11: Fix frame product page H1 missing space

**Effort**: 30 minutes  
**Owner**: Developer

**Issue**: `/frames/wide-black` H1 renders as "Wide BlackPicture Frame" (no space)

**Likely Cause**: Template concatenation:
```tsx
<h1>{frameData.name}Picture Frame</h1>
// "Wide Black" + "Picture Frame" = "Wide BlackPicture Frame"
```

**Fix**:
```tsx
<h1>{frameData.name} Picture Frame</h1>
// Add space before "Picture Frame"
```

---

### P1 #12: Fix frame product page meta descriptions

**Effort**: 2-3 hours  
**Owner**: Developer

**Current**: Frame tagline (4 words, too short)  
**Target**: 120-160 characters

**Template**:
```
"[Name] custom picture frame in any size from 4×4 to 60×60. [Tagline]. 
Instant pricing at CustomFrameSizes.com."
```

**Example**:
```
"Wide Black custom picture frame in any size from 4×4 to 60×60. 
Wide block-style elegance. Instant pricing at CustomFrameSizes.com."
```

**Fix in frame product page metadata generation**.

---

### P1 #13: Fix query parameter leaking into URLs

**Effort**: 2-3 hours  
**Owner**: Developer

**Issue**: Configurator state persists in query params when navigating to product pages

**Examples**:
```
/frames/wide-black?matType=double&glassType=uv&size=8x10
```

**Creates**: Duplicate content risk (same page, different params)

**Fix**:
1. Use `replaceState` instead of history push when navigating
2. Or use component state instead of URL state for configurator
3. Verify URLs are clean when navigating between pages

```typescript
// Use shallow routing or replaceState
router.push(`/frames/${slug}`, undefined, { shallow: true });
// OR
window.history.replaceState({}, '', `/frames/${slug}`);
```

---

### P1 #14: Remove duplicate "View All Frame Styles" button

**Effort**: 15 minutes  
**Owner**: Developer

**Issue**: Two identical CTA buttons stacked on homepage

**Fix**: Remove one of the duplicate buttons from homepage component.

---

### P1 #15: Restore keyboard focus indicators

**Effort**: 1-2 hours  
**Owner**: Developer

**WCAG Requirement**: 2.4.7 (Level AA) - Keyboard focus must be visible

**Current**: CSS suppresses focus outline globally: `outline: none`

**Fix**:
```css
/* Global styles - REMOVE this: */
/* :focus { outline: none; } */

/* Add this instead: */
:focus-visible {
  outline: 2px solid #1173D4;
  outline-offset: 2px;
}

/* Or use tailwind */
/* Focus ring utilities */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  @apply outline-2 outline-offset-2 outline-blue-600;
}
```

**Acceptance Criteria**:
- Tab through page - all interactive elements show focus ring
- Focus ring is visible (high contrast)
- Outline offset looks good (2px suggested)

---

### P1 #16: Add accessible names to 6 icon-only buttons

**Effort**: 1 hour  
**Owner**: Developer

**Buttons Affected**:
1. Mat color swatches
2. Checkbox toggle
3. Theme switch
4. +/- quantity buttons (if icon-only)
5. Share button
6. Gallery action buttons

**Fix**: Add `aria-label` to each:
```tsx
<button aria-label="Select White mat">
  <ColorSwatch color="white" />
</button>

<button aria-label="Toggle dark mode">
  <Moon />
</button>
```

---

### P1 #17: Label 3 unlabeled form inputs

**Effort**: 1 hour  
**Owner**: Developer

**Inputs**:
1. Search frame search input → Add `aria-label="Search frames"`
2. File upload #1 (Uppy) → Add `aria-label="Upload artwork image"`
3. File upload #2 (Uppy) → Add `aria-label="Upload artwork image"`

**Fix**:
```tsx
<input 
  aria-label="Search frames"
  placeholder="Search frames..."
/>
```

---

### P1 #18: Add autocomplete attributes to contact form

**Effort**: 30 minutes  
**Owner**: Developer

**WCAG 1.3.5** - Identify input purpose

**Fix**:
```tsx
<input 
  type="text"
  autocomplete="name"
  placeholder="Your name"
/>

<input 
  type="email"
  autocomplete="email"
  placeholder="Email"
/>

<input 
  type="tel"
  autocomplete="tel"
  placeholder="Phone"
/>
```

---

### P1 #19: Increase small touch targets in configurator

**Effort**: 2-3 hours  
**Owner**: Developer

**WCAG 2.5.8** - Minimum 44×44px touch target

**Affected Elements**:
- Frame style selectors
- Mat color swatches
- Glass type buttons

**Fix**: Use padding to increase hit area without changing visual:
```css
.color-swatch {
  width: 32px;
  height: 32px;
  padding: 6px; /* Creates 44x44px total hit area */
}

/* OR use pseudo-element */
.color-swatch::before {
  content: '';
  position: absolute;
  inset: -6px;
}
```

---

## 🎯 P3 - POLISH (SCHEDULE WHEN CONVENIENT)

### P3 #20: Add prefers-reduced-motion CSS support

**WCAG 2.3.3** (AAA - recommended)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### P3 #21: Verify mobile layout on real devices

**Effort**: 1 hour (manual QA)

Checklist:
- [ ] Nav collapses to hamburger
- [ ] Configurator is usable on 375px (iPhone SE)
- [ ] Frame grid reflows to 1-2 columns
- [ ] Touch targets >= 44×44px
- [ ] No horizontal scroll
- [ ] Images load correctly

---

### P3 #22: Verify dark mode contrast ratios

**Effort**: 1 hour (manual audit)

Check color pairs meet WCAG AA (4.5:1 normal, 3:1 large text) in dark mode.

Use: https://webaim.org/resources/contrastchecker/

---

## 📅 IMPLEMENTATION TIMELINE

### Week 1: Launch Blockers (P0)
**Effort**: 6-8 hours

| Task | Est. Time | Priority |
|------|-----------|----------|
| P0 #1: Replace domain | 1-2h | CRITICAL |
| P0 #2: Fix canonical | 1h | CRITICAL |
| P0 #3: Build 5 missing pages | 3-5h | CRITICAL |
| P0 #4: Fix 404 noindex | 1-2h | CRITICAL |
| P0 #5: Remove duplicate H1 | 15m | CRITICAL |

**Acceptance**: All P0 items must be done before deploy.

### Week 1: First Fixes (P1) - Part 1
**Effort**: 4-6 hours

| Task | Est. Time |
|------|-----------|
| P1 #6-9: Brand identity (font, spacing, colors) | 2h |
| P1 #10: Hero image cross-browser | 2-3h |
| P1 #11: Frame H1 spacing | 30m |
| P1 #12: Meta descriptions | 2-3h |

### Week 2: First Fixes (P1) - Part 2
**Effort**: 4-6 hours

| Task | Est. Time |
|------|-----------|
| P1 #13: Clean URL params | 2-3h |
| P1 #14: Remove duplicate button | 15m |
| P1 #15-19: Accessibility fixes | 2-3h |

### Week 3: Polish (P3)
**Effort**: 2-3 hours

| Task | Est. Time |
|------|-----------|
| P3 #20: Reduced motion | 30m |
| P3 #21: Mobile device testing | 1h |
| P3 #22: Dark mode contrast | 1h |

---

## ✅ VERIFICATION CHECKLIST

### Pre-Deploy
- [ ] P0 #1: `store-a.example.com` removed, www in all places
- [ ] P0 #2: All canonicals include www
- [ ] P0 #3: All 5 links return 200
- [ ] P0 #4: 404 page has noindex
- [ ] P0 #5: Only 1 H1 on homepage
- [ ] P1 #6: Playfair Display loads
- [ ] P1 #7-9: Brand styles applied
- [ ] P1 #10: Hero loads in all browsers
- [ ] P1 #15: Tab focuses show on all elements
- [ ] P1 #16-19: Accessibility audit passing

### Post-Deploy (Staging)
- [ ] Run Lighthouse audit (target: 90+ on each metric)
- [ ] Run WAVE accessibility scan
- [ ] Chrome DevTools mobile emulation (375px, 768px, 1024px)
- [ ] Real device testing (iPhone, Android)
- [ ] Test keyboard navigation full flow
- [ ] Verify Google Search Console sees correct canonical

---

## 🎯 SUCCESS CRITERIA

**Launch is GO when**:
1. ✅ All 5 P0 blockers fixed
2. ✅ Lighthouse scores ≥ 90 (each metric)
3. ✅ WCAG Level AA accessibility audit passing (15 items)
4. ✅ No console errors
5. ✅ Mobile layout verified on real device
6. ✅ Domain canonicals verified correct
7. ✅ All internal links working (no 404s)

---

**Ready to create tickets for P0 items (BLOCKING DEPLOYMENT)**
