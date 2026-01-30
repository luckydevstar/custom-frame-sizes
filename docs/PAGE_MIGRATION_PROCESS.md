# Page Migration Process (React → Next.js)

This document defines the standard process for migrating pages from the original React app (`CustomFrameSizes-CODE`) to the Next.js monorepo (`custom-frame-sizes`). Use it for **all** specialty and content page migrations (e.g. Certificate Frames, Diploma Frames, Shadowbox, etc.).

---

## Migration Steps

### 1. Scan original page’s structure

Before writing any new code:

- **Sections:** List every section on the original page (hero, benefit bar, designer embed, “What we frame”, FAQ, CTA, etc.) with their headings and content.
- **Functionality:** List all behavior that must be preserved:
  - Designer: state (frame, mat, glass, sizes, bottom-weighted, nameplate, etc.), URL sync, pricing, preview, add-to-cart, modals, AR, etc.
  - Page-level: scroll-to-designer, structured data (breadcrumb, product, FAQ, service), meta (title, description, OG, Twitter, canonical).
- **Dependencies:** Note which components, hooks, services, and types the page and its designer use (from `@/components`, `@/services`, `@/lib`, etc.).

**Output:** A short checklist of sections + features to migrate (and any quirks, e.g. “bottom-weighted only when mat is enabled”).

---

### 2. Migrate to new version

- **App route:** Add or update the page under `apps/store-a/src/app/<route>/page.tsx` (or the appropriate app).
- **Next.js patterns:**
  - Use `export const metadata` for title, description, keywords, `openGraph`, `twitter`, `alternates.canonical`, and `images` where applicable.
  - Use **dynamic import** with `ssr: false` for heavy client-only designers:  
    `dynamic(() => import("@framecraft/ui").then(mod => ({ default: mod.<DesignerName> })), { ssr: false, loading: ... })`
  - Keep **structured data** (JSON-LD) in the page; inject via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />` or equivalent.
- **Client interactivity:** Any component that uses `useState`, `useEffect`, browser APIs, or third-party client libs (e.g. wouter, react-day-picker) must be a Client Component: add **`"use client";`** at the top of the file. Prefer putting `"use client"` on the leaf component that needs it (e.g. designer, scroll button) rather than the whole page when possible.
- **Packages:** Use monorepo packages (`@framecraft/ui`, `@framecraft/core`, `@framecraft/config`, `@framecraft/types`) and correct imports; replace `@/` paths with package names where the code lives in a package.
- **Scroll / CTA:** If the original page has a “Design your frame” (or similar) button that scrolls to the designer, implement it as a small client component (e.g. `ScrollToDesignerButton`) that calls `document.getElementById('design-tool')?.scrollIntoView({ behavior: 'smooth' })`, and use that in the server-rendered page.

---

### 3. Re-check the migrated page

After migration, verify:

- **Sections:** Every section from step 1 is present with the same order, headings, and content (copy, lists, links). Check for trivial differences (e.g. “Government & Military” vs “Government &amp; Military”).
- **SEO:** Title, description, canonical, Open Graph (title, description, url, type, images), Twitter card (card, title, description, images). FAQ and other JSON-LD use **full** answer text if the original had long paragraphs.
- **Designer:** All toggles and options (mat type, border, reveal, bottom-weighted, nameplate, hardware, etc.) exist and are wired. URL params read/write correctly. Preview and pricing update when options change. No “undefined” or missing data in console.
- **Styles:** Same layout and styling (grids, spacing, borders, muted backgrounds). No missing classes or broken responsive behavior.
- **Errors:** Run the project and the linter; fix TypeScript and ESLint errors. No unescaped entities (see below).

---

### 4. Manual review and fix

- Commit the migration and request (or perform) manual review.
- Address feedback: missing sections, wrong behavior, style tweaks, copy changes.
- Re-run step 3 after each fix round.

---

## Fixes to apply during migration

### 1. Next.js and Client Components

- **`"use client"`:** Add at the top of any file that uses:
  - `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`
  - Browser APIs (`window`, `document`, `location`)
  - Context consumers or libraries that use React context (e.g. theme, router, calendar)
- **Routing:** Next.js uses file-based routing; no `wouter`/`react-router` in the app. Use `<Link href="...">` from `next/link` and `useRouter` from `next/navigation` when needed.
- **Metadata:** Prefer static `export const metadata` in Server Components. For dynamic metadata (e.g. from CMS), use `generateMetadata` and keep the page a Server Component if possible.
- **Dynamic imports:** Use `next/dynamic` for heavy client-only designers to avoid pulling them into the server bundle and to show a loading state.

### 2. Common lint/code errors

- **Unescaped double quotes in JSX (`react/no-unescaped-entities`):**  
  Inch symbols (`"`) and other literal `"` inside JSX text must be escaped. Use **`&quot;`** (e.g. `10&quot; × 12&quot;`) or put the character in JS (e.g. `{'"'}`). Do not leave raw `"` in JSX text.
- **Apostrophes:** In JSX, prefer `&apos;` or `{'’'}` for apostrophes (e.g. “framer's” → “framer&apos;s”) to avoid lint/parsing issues.
- **HTML entities in copy:** Use `&amp;` for “&” in visible text (e.g. “Government &amp; Military”) where required by the linter or to avoid invalid HTML.

---

## Quick checklist (per page)

- [ ] Step 1: Scan original — sections and functionality listed
- [ ] Step 2: Page + designer migrated; `"use client"` where needed; Next-friendly code
- [ ] Step 3: Sections, SEO, designer behavior, styles, and lint verified
- [ ] Step 4: Manual review done; issues fixed
- [ ] No unescaped `"` or `'` in JSX; other common lint fixes applied

This process should be used **throughout** all subsequent page migrations.
