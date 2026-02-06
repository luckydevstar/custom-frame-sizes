# Asset Structure Analysis: `assets/public` & `assets/attached_assets`

**Purpose:** Compare current layout with the Image Assets Guide and Anthony’s frame-class / designer-based structure.  
**Scope:** Path and folder structure only (no file contents).  
**Reference:** Frame Class xlsx (Picture / Shadowbox Full / Shadowbox Subset / Canvas), designer→frame-class mapping, and Anthony’s note on top,bottom,left,right + corner/profile A,B,C.

---

## 1. Current structure summary

### 1.1 `assets/public/`

| Path                                   | Purpose                                       | Notes                                                                                                                                                                                                     |
| -------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **frames/**                            | Frame product images by SKU (~60 SKU folders) | top, left, right, bottom, corner*a/b/c, profile_a/b/c, edge*_, lifestyle\__, dimensions. **Naming inconsistent** (e.g. 8744: `corner.jpg` + `corner-b`; 8693: `corner_a.jpg`).                            |
| **assets/**                            | Brand, canvas, marketing                      | brand/, canvas/ (SKU images), hero/, home/, glazing/, frames/ (marketing), stock/ticket-inserts/. Canvas lives with generic “assets” rather than under a designer or frame-class tree.                    |
| **lifestyle/**                         | Lifestyle by designer                         | canvas/, collage/, graded-card/, magazine/, newspaper/, playbill/. **Good** designer-based subfolders.                                                                                                    |
| **images/**                            | Mixed inserts + lifestyle                     | card-inserts/, collage-inserts/, newspaper-inserts/, needlework/, record-album-lifestyle/, signature-frame-lifestyle/, blog/. **Not** under designer names; “inserts” vs “lifestyle” mixed in one bucket. |
| **comic/**                             | Comic designer                                | inserts/ (modern/, slabbed/), lifestyle/. **Good** [designer]/inserts + lifestyle.                                                                                                                        |
| **magazine/**                          | Magazine designer                             | inserts/ only; lifestyle is in **lifestyle/magazine/**. Split across two roots.                                                                                                                           |
| **diploma/**                           | Diploma/certificate                           | Inserts + lifestyle under one designer folder. **Good**.                                                                                                                                                  |
| **cd/**                                | CD designer                                   | Single folder; no explicit insert vs lifestyle subfolders.                                                                                                                                                |
| **playbill/**                          | Playbill designer                             | Flat files; lifestyle in **lifestyle/playbill/**. Split.                                                                                                                                                  |
| **collage/**                           | Collage designer                              | School-days style inserts; collage-inserts + lifestyle/collage live under **images/** and **lifestyle/**. Split.                                                                                          |
| **military/**                          | Military designer                             | Own folder + military/lifestyle implied or under military/.                                                                                                                                               |
| **puzzle-frames/**                     | Puzzle designer                               | Own folder; bulk inserts in **attached_assets/stock_images/puzzle_inserts/**. Split.                                                                                                                      |
| **sonogram/**                          | Sonogram designer                             | lifestyle/ only; inserts in **attached_assets/stock_images/sonogram_inserts/**. Split.                                                                                                                    |
| **mats/**                              | Mat textures                                  | Numbered textures + swatches/. Fine.                                                                                                                                                                      |
| **backup-card-inserts-other-grading/** | Backup                                        | Suggests unused/legacy at public root.                                                                                                                                                                    |
| **components/**                        | 8 JPGs                                        | Unclear; candidate to relocate or document.                                                                                                                                                               |

**Issues:**

- **Frame images:** All under `frames/{SKU}/` by SKU, not by Frame Class (Picture / Shadowbox Full / Subset / Canvas). Anthony: “frame designer images (top, bottom, left, right) are shared among designers and classified into four Frame Classes.” So structure could reflect frame-class grouping for those shared assets.
- **Corner/profile A,B,C:** Present in many SKU folders (e.g. corner_a/b/c, profile_a/b/c) but naming is inconsistent (e.g. `corner` vs `corner_a`, `corner-b` vs `corner_b`). Standardizing would help site A/B/C switching.
- **Designer-based “insert + lifestyle”:** Only some designers have a single root (e.g. comic, diploma). Others are split: magazine (public/magazine/inserts vs public/lifestyle/magazine), playbill, collage, puzzle, sonogram, and several “inserts” or “lifestyle” live under generic **images/**.

### 1.2 `assets/attached_assets/`

| Path              | Purpose                            | Notes                                                                                                                                                                                                                                                     |
| ----------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Root**          | **~4,800+ files in one flat list** | Mix of: (1) Canvas SKU assets (e.g. 10104*a*, 10117-pro-a*, 10426-pro-b*), (2) Shadowbox-style (e.g. 10474*corner_a*, 10474*left*, 10474*bottom*), (3) UUID-style names. **Major clarity/maintainability issue**; no grouping by frame class or designer. |
| **stock_images/** | Standard + seasonal inserts        | photo*inserts/, puzzle_inserts/, canvas_paintings/, sonogram_inserts/, seasonal/ (autumn, christmas, easter, etc.). Structure is clear. Some loose files (e.g. sunset*_, vintage*baseball*_, wildlife\_\*) that could be moved into a category.           |
| **specialty/**    | Ticket + invitation lifestyle      | ticket_frame_lifestyle/, invitation_frame_lifestyle/. **Good** designer-based grouping.                                                                                                                                                                   |

**Issues:**

- **Flat root:** Frame product assets (canvas + shadowbox) and possibly other one-off uploads live in one huge flat folder. This does not match:
  - Anthony’s four Frame Classes (Picture, Shadowbox Full, Shadowbox Subset, Canvas), or
  - Your desired pattern: `[frame-designer-name]/frame-images|insert-images|lifestyle`.
- **Canvas vs Shadowbox:** Canvas Frame Class SKUs (e.g. 10104, 10117, 10426) and Shadowbox SKUs (e.g. 10474) are mixed at the same level; no separation by frame class or by “frame-images” vs “insert” vs “lifestyle.”
- **Corner/profile A,B,C:** Present in filenames (e.g. 10474*corner_a*) but buried in flat list; hard to reason about “site A/B/C” sets without a folder or naming convention that groups them.

---

## 2. Gaps vs. your plan and Anthony’s feedback

- **Your proposed pattern:** `[frame-designer-name]/frame-images/`, `insert-images/`, `lifestyle/`, plus materials/others/blog as needed.  
  **Gap:** Only partially present. “Frame images” are mostly in `public/frames/{SKU}` (by SKU, not designer) and in `attached_assets` root (flat). Insert/lifestyle are sometimes under a designer (comic, diploma) but often under generic `public/images/` or `public/lifestyle/` or in `attached_assets` without a designer parent.

- **Anthony’s frame classes:** Frame designer images (top, bottom, left, right) shared by Frame Class (Picture, Shadowbox Full, Shadowbox Subset, Canvas).  
  **Gap:** No folder structure that reflects these four classes. SKUs are grouped only by numeric ID, not by class. Canvas has a separate area under `public/assets/canvas/` but not under a clear “Canvas Frame Class” concept.

- **Corner and profile A/B/C:** Three versions per site; first site uses A, next B, then C.  
  **Gap:** Files exist (e.g. corner_a/b/c, profile_a/b/c) but naming is inconsistent and, in `attached_assets`, they sit in a flat sea of files. No dedicated “corner-profile” or “by-site-variant” layout that makes A/B/C selection obvious.

- **Insert + lifestyle shared across stores:** Anthony agreed inserts and lifestyle can be shared with alt-text changes.  
  **Gap:** No structural change needed for that; the main issue is organizing by designer/type so it’s clear what is “insert” vs “lifestyle” and what is designer-specific vs shared.

---

## 3. Recommended direction (structure only)

### 3.1 Frame product images (top, bottom, left, right + corner, profile)

- **Option A – By Frame Class (align with Anthony’s xlsx)**
  - `frame-classes/picture/`
  - `frame-classes/shadowbox-full/`
  - `frame-classes/shadowbox-subset/`
  - `frame-classes/canvas/`
  - Under each: either by SKU (e.g. `8693/`, `10474/`) or by shared “template” if multiple SKUs share the same top/bottom/left/right.
  - Corner/profile: e.g. `{SKU}/corner_a.jpg`, `corner_b.jpg`, `corner_c.jpg`, `profile_a.jpg`, …

- **Option B – Keep SKU-based, add clarity**
  - Keep `frames/{SKU}/` but:
    - Standardize names: e.g. `corner_a.jpg`, `corner_b.jpg`, `corner_c.jpg`, `profile_a/b/c`, `top.jpg`, `left.jpg`, `right.jpg`, `bottom.jpg`.
    - Add a small manifest or README per frame class listing which SKUs belong to it (from the xlsx), so code/config can “know” frame class without moving files yet.

- **Recommendation:** Option B is less disruptive short-term; Option A is better long-term if you want URLs and paths to reflect “frame class” and make shared vs per-SKU assets obvious. Either way, **move everything out of `attached_assets` root** into either `public/frames/{SKU}/` (with consistent naming) or into a new `frame-classes/` tree.

### 3.2 Designer-based folders (inserts + lifestyle)

- **Target pattern per designer:**  
  `[designer-name]/`
  - `insert-images/` (or `inserts/`)
  - `lifestyle/`
  - Optional: `frame-images/` only if that designer has class-specific overrides; otherwise frame images come from frame-class/SKU.

- **Concrete moves:**
  - **public:**
    - Keep or introduce `magazine/inserts/` and `magazine/lifestyle/` (e.g. move `lifestyle/magazine/` → `magazine/lifestyle/`).
    - Same idea for playbill, collage, newspaper, etc.: single designer root with `inserts/` and `lifestyle/` inside.
  - **images/:**
    - Redistribute into designer roots: e.g. `card-frames/insert-images/`, `card-frames/lifestyle/` (if any), `newspaper/insert-images/`, `collage/insert-images/`, `needlework/`, `signature-frames/lifestyle/`, `record-album/lifestyle/`.
  - **attached_assets/specialty:**
    - Already designer-based (ticket, invitation); keep. Optionally align names, e.g. `ticket-frames/lifestyle/`, `invitation-frames/lifestyle/`.

- **Shared / generic:**
  - Standard photo inserts and seasonal stay under something like `stock_images/photo_inserts/` and `stock_images/seasonal/` (used by the main picture-frame designer).
  - Blog, marketing, “materials,” etc. can stay under a single `materials/` or `marketing/` or `blog/` tree so they’re clearly non-designer-specific.

### 3.3 Naming and hygiene

- **Corner/profile:** Use one convention everywhere, e.g. `corner_a.jpg`, `corner_b.jpg`, `corner_c.jpg`, `profile_a.jpg`, `profile_b.jpg`, `profile_c.jpg`.
- **Edge/top, bottom, left, right:** Prefer consistent names: e.g. `top.jpg`, `bottom.jpg`, `left.jpg`, `right.jpg` (or `edge_top.jpg` if you need to distinguish).
- **Lifestyle:** Prefer `lifestyle_01.jpg` or `lifestyle_1.jpg` (pick one) and avoid spaces and special characters in filenames.
- **Cleanup:** Move or remove `backup-card-inserts-other-grading/`, document or relocate `components/`, and either categorize or archive loose files in `stock_images/` (e.g. sunset, vintage_baseball, wildlife).

---

## 4. Quick reference: current vs desired

| Concept                                       | Current                                                                                  | Desired (aligned with you + Anthony)                                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Frame designer images (top/left/right/bottom) | `public/frames/{SKU}/` + many in `attached_assets` root                                  | By frame class (or keep by SKU with consistent names); corner/profile A,B,C explicit.                                       |
| Corner/profile A,B,C                          | Present but naming mixed; in flat `attached_assets` root                                 | Single convention; under frame-class or SKU folder, not flat.                                                               |
| Designer “insert + lifestyle”                 | Split: comic/diploma good; magazine, playbill, collage, etc. under images/ or lifestyle/ | One folder per designer with `insert-images/` and `lifestyle/` (and optional `frame-images/`).                              |
| Canvas                                        | `public/assets/canvas/` + many in `attached_assets` root                                 | Either under `frame-classes/canvas/{SKU}/` or keep `assets/canvas/` but move all canvas assets out of attached_assets root. |
| Stock/seasonal inserts                        | `attached_assets/stock_images/`                                                          | Keep; optional subfolders for loose files.                                                                                  |
| Specialty (ticket, invitation)                | `attached_assets/specialty/`                                                             | Keep; optional rename to designer-style (e.g. ticket-frames/, invitation-frames/).                                          |

---

## 5. Suggested next steps (order you can do in 2–3 days)

1. **Standardize frame image names** in `public/frames/{SKU}/`: corner_a/b/c, profile_a/b/c, top, bottom, left, right; fix any SKU that uses `corner.jpg` or `corner-b` style.
2. **Decide** short-term: keep frame assets by SKU under `public/frames/` and add a frame-class→SKU map (from xlsx), or introduce `frame-classes/` and migrate.
3. **Create designer roots** where missing (e.g. magazine, playbill, newspaper, collage) with `inserts/` and `lifestyle/` subfolders; move current scattered insert/lifestyle assets into them.
4. **Empty `attached_assets` root:** Move canvas and shadowbox frame assets into either `public/frames/{SKU}/` (with standard names) or into the new frame-class structure; leave only true “stock” and “specialty” under `stock_images/` and `specialty/`.
5. **Document** which path is used by which designer and which frame class (from the xlsx) so the app and any CDN/config stay in sync after you tidy and upload to Cloudflare.

If you tell me whether you prefer “keep by SKU under public/frames” vs “introduce frame-classes/” and which designers to prioritize first, I can turn this into a step-by-step migration checklist (with exact folder names and move commands) for the 2–3 day window.
