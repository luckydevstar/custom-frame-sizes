# Branch Strategy, Vercel, and Cloudflare Setup

This guide covers: **branch strategy** (master = prod, dev = testing, feature branches), **Vercel** deployment, and **Cloudflare** DNS for `xx.com` (prod) and `dev.xx.com` (dev).

---

## 1. Will This Work?

**Yes.** This setup is standard:

- **`master`** → production, deploys to **xx.com**
- **`dev`** → staging/testing, deploys to **dev.xx.com**
- **Feature branches** → create from `dev`, merge back to `dev`; when ready, merge `dev` → `master` for production

Vercel supports **branch-based deployments** and **custom domains per branch**, so one Vercel project can serve both prod and dev domains. Alternatively you can use two Vercel projects (one for prod, one for dev).

---

## 2. Branch Strategy (From Current `main`)

You currently have only `main`. To get `master` (prod) and `dev` (testing):

### Option A: Use `master` as production (rename `main` → `master`)

1. **Rename `main` to `master`** (so production is `master`):
   ```bash
   git branch -m main master
   git push -u origin master
   ```
2. **On GitHub/GitLab**: In **Settings → Repository → Default branch**, set the default branch to **`master`** (so new clones and PRs default to it).
3. **Create `dev`** from `master` and push:
   ```bash
   git checkout master
   git pull origin master
   git checkout -b dev
   git push -u origin dev
   ```
4. **Optional**: Delete the old `main` branch on the remote if it still exists:
   ```bash
   git push origin --delete main
   ```

### Option B: Keep `main` as production (no rename)

If you prefer to keep **`main`** as production (many teams do):

1. **Production branch**: `main` → deploys to **xx.com**
2. **Create `dev`** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b dev
   git push -u origin dev
   ```
3. Use **`main`** instead of `master` everywhere below. No rename needed.

**Recommendation:** Use **Option B** (keep `main` as prod) unless you have a strong reason to use `master`. Then:

- **Production:** `main` → xx.com
- **Staging:** `dev` → dev.xx.com
- **Feature branches:** branch from `dev`, merge into `dev`; when ready, merge `dev` → `main` for release.

---

## 3. Feature Branch Workflow

- Create feature branches **from `dev`**:
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b feature/shopify-cart-api
  ```
- Work and push:
  ```bash
  git add .
  git commit -m "feat: add BFF cart API"
  git push -u origin feature/shopify-cart-api
  ```
- Open a **Pull Request** into **`dev`** (not into `main`). After review, merge into `dev`.
- When `dev` is stable and ready for production, open a **PR from `dev` into `main`** and merge. That will deploy to xx.com.

---

## 4. Vercel Setup (One Project, Two Environments)

Use **one Vercel project** for the monorepo and assign different domains to Production vs Preview.

### 4.1 Connect the repo

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import your Git repository (GitHub/GitLab/Bitbucket).
3. **Root Directory:** leave as repo root (or set to repo root if you use a monorepo).
4. **Framework Preset:** Next.js.
5. **Build and Output (monorepo):**
   - **Root Directory:** leave as **repo root** (so Turbo and workspaces work).
   - **Build Command:** `npx turbo run build --filter=@framecraft/store-a`
   - **Output Directory:** `apps/store-a/.next`
   - **Install Command:** `npm install` (default; runs from repo root).
6. If you add the optional `vercel.json` in `apps/store-a` (see section 6), you can set **Root Directory** to `apps/store-a` and use the build/install commands from that file instead.
7. Deploy. Vercel will create a `*.vercel.app` URL.

### 4.2 Assign production branch and domain (xx.com)

1. **Project → Settings → Git**
   - Set **Production Branch** to `master` (or `main` if you kept it).
2. **Project → Settings → Domains**
   - Add **xx.com** (your real prod domain).
   - Add **www.xx.com** if you use www; Vercel will suggest redirects.
3. Vercel will show the required DNS records (CNAME or A). You’ll add these in Cloudflare in the next section.

### 4.3 Assign dev branch to dev.xx.com

1. **Project → Settings → Domains**
   - Add **dev.xx.com**.
2. In the domain list, click **dev.xx.com** and set **Git Branch** to **`dev`**.
   - So: commits to `dev` deploy to dev.xx.com; commits to `master`/`main` deploy to xx.com.
3. Save. Vercel will show the DNS target for dev.xx.com (usually the same as the main Vercel hostname, e.g. `cname.vercel-dns.com` or your project’s `*.vercel.app`).

### 4.4 Environment variables per environment

1. **Project → Settings → Environment Variables**
2. Add variables and choose:
   - **Production** only → for xx.com (e.g. prod Shopify keys, prod API URLs).
   - **Preview** only → for dev.xx.com and all preview deployments (e.g. dev Shopify store, dev API).
3. You can also use **Preview** = “all branches except Production” so that `dev` and every feature branch get Preview vars; then override only Production for xx.com.

Result:

- **xx.com** = Production = `master` (or `main`) + Production env vars.
- **dev.xx.com** = Preview tied to branch `dev` + Preview env vars.

---

## 5. Cloudflare DNS (xx.com and dev.xx.com)

Your domains are on Cloudflare. Point them to Vercel.

### 5.1 Get the target from Vercel

- In Vercel: **Project → Settings → Domains**.
- For **xx.com** and **dev.xx.com**, Vercel shows the record type (CNAME or A) and the target (e.g. `cname.vercel-dns.com` or a specific hostname).

### 5.2 In Cloudflare (DNS tab for xx.com)

1. **Apex domain xx.com**
   - Type: **CNAME** (or **A** if Vercel gives an A record).
   - Name: `@` (or `xx.com`).
   - Target: value Vercel shows (e.g. `cname.vercel-dns.com`).
   - Proxy status: **DNS only** (grey cloud) initially; you can enable **Proxied** (orange) later if you want Cloudflare in front (see note below).
2. **www.xx.com** (if you use www)
   - Type: **CNAME**
   - Name: `www`
   - Target: `cname.vercel-dns.com` (or what Vercel shows).
3. **Dev subdomain dev.xx.com**
   - Type: **CNAME**
   - Name: `dev`
   - Target: same as above (e.g. `cname.vercel-dns.com`).

Vercel will route traffic by hostname: requests to `dev.xx.com` go to the deployment linked to the `dev` branch; requests to `xx.com` go to the production deployment.

### 5.3 Cloudflare proxy (optional)

- **DNS only (grey cloud):** DNS resolves to Vercel; SSL and traffic go directly to Vercel. Easiest and recommended to start.
- **Proxied (orange cloud):** Traffic goes Cloudflare → Vercel. Use if you want Cloudflare WAF, rate limiting, or caching. Ensure SSL mode in Cloudflare is “Full” or “Full (strict)” and that your Vercel project has a valid cert (it does by default).

---

## 6. Optional: `vercel.json` in the app (monorepo)

If you set **Root Directory** in Vercel to **`apps/store-a`**, add **`vercel.json`** in **`apps/store-a`** so the build runs from the monorepo root (Turbo needs the full workspace):

```json
{
  "buildCommand": "cd ../.. && npm install && npx turbo run build --filter=@framecraft/store-a",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "cd ../.. && npm install"
}
```

Alternatively, leave **Root Directory** empty (repo root) and in the Vercel UI set:

- **Build Command:** `npx turbo run build --filter=@framecraft/store-a`
- **Output Directory:** `apps/store-a/.next`
- **Install Command:** `npm install`

Then you don’t need a `vercel.json` in `apps/store-a`.

---

## 7. Checklist Summary

- [ ] Decide: production branch = `main` or `master`; create `dev` from it.
- [ ] Push `dev` and set default branch in Git host to your production branch.
- [ ] Create Vercel project; set **Root** (or build context) so it builds `apps/store-a`.
- [ ] Set **Production Branch** to `master` (or `main`).
- [ ] Add domain **xx.com** (and www if needed); add **dev.xx.com** and assign branch **`dev`**.
- [ ] In Cloudflare: CNAME `@` and `www` and `dev` to Vercel’s target.
- [ ] Set **Production** and **Preview** environment variables in Vercel.
- [ ] Deploy: push to `dev` → dev.xx.com; push to `master`/`main` → xx.com.

After this, you can start Shopify integration on `dev` (and optional feature branches), test on dev.xx.com, then merge to `main`/`master` when ready for production.
