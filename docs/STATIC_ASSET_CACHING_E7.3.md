# Static Asset Caching Implementation (E7.3)

## Overview

This document describes the static asset caching strategy implemented for CustomFrameSizes storefronts to improve performance and reduce bandwidth usage.

## Cache Strategy

### 1. Long-Term Immutable Cache (1 Year)

**Applied to:**

- Next.js static assets: `/_next/static/**` (CSS, JS bundles)
- Next.js optimized images: `/_next/image`
- Font files: `*.woff2`, `*.woff`, `*.ttf`

**Cache Header:**

```
Cache-Control: public, max-age=31536000, immutable
```

**Rationale:**

- These assets are hash-versioned by Next.js
- Hash changes automatically when content changes
- `immutable` tells browsers never to revalidate

### 2. Short-Term Cache (1 Hour)

**Applied to:**

- HTML pages: `/`, `/designer`, etc.
- Dynamic routes without file extensions

**Cache Header:**

```
Cache-Control: public, max-age=3600, s-maxage=3600
```

**Rationale:**

- Allows content updates without waiting 1 year
- `s-maxage=3600` ensures CDN respects the 1-hour TTL
- Supports incremental updates

## Implementation Files

### 1. `vercel.json` (apps/store-a)

Vercel-specific configuration for production deployments. Defines:

- Build command: `next build`
- Output directory: `.next`
- Header rules for different asset types

### 2. `middleware.ts` (root)

Express/Next.js middleware that:

- Intercepts all requests
- Applies cache headers based on content type
- Handles static assets, fonts, HTML pages

## How It Works

### Next.js Static Asset Versioning

Next.js automatically includes a hash in static file paths:

```
❌ Old (without cache):
  /style.css
  /app.js

✅ New (with hash-based caching):
  /_next/static/chunks/app-abc123def456.js
  /_next/static/css/global-xyz789uvw.css
```

When you update code:

- Next.js generates new files with new hashes
- Browser requests new URLs (cache miss)
- Browser caches new files for 1 year
- Old files are never needed again

## Verification Steps

### 1. Build for Production

```bash
cd apps/store-a
npm run build
```

### 2. Start Production Server

```bash
npm start
```

### 3. Check Cache Headers in DevTools

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Load the page
4. Click on a JS/CSS file under `_next/static/`
5. Look at Response Headers:
   ```
   cache-control: public, max-age=31536000, immutable
   ```

### 4. Verify HTML Page Cache

1. Click on the HTML response (first request)
2. Look at Response Headers:
   ```
   cache-control: public, max-age=3600, s-maxage=3600
   ```

### 5. Test with Chrome DevTools

**Disable Cache Simulation:**

1. Open DevTools → Network tab
2. Uncheck "Disable cache" (usually checked during development)
3. Reload page
4. Second reload should show many "200 from cache" responses

**Expected Behavior:**

- First load: Actual network requests
- Second load (same session): Many "200 from cache" responses
- Files from `/_next/static/`: All cached from browser
- HTML document: Revalidated (304 Not Modified or fresh 200)

## Browser Testing

### Local Testing

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Test with curl
curl -i http://localhost:3000/_next/static/chunks/app.js | grep -i "cache-control"
```

Expected output should include cache headers.

### Lighthouse Audit

1. Open page in Chrome
2. DevTools → Lighthouse
3. Run audit for Desktop
4. Check "Opportunities" section:
   - Should see ✅ "Serve static assets with an efficient cache policy"

## Performance Impact

### Expected Improvements

| Metric                 | Before | After   | Improvement       |
| ---------------------- | ------ | ------- | ----------------- |
| Repeat Visit Load Time | ~3-4s  | ~0.5-1s | ~70% faster       |
| Bandwidth per Session  | 100%   | 10-15%  | ~85-90% reduction |
| Browser Cache Hit Rate | Low    | >90%    | Significant       |

### Why These Numbers?

- **First visit**: No change (must download all assets)
- **Repeat visits**: Browser serves cached assets instantly
- **Bandwidth saved**: Cached assets never re-download
- **Server load**: Dramatically reduced

## CDN Behavior

### Vercel CDN (Production)

When deployed to Vercel:

- `s-maxage` parameter applies to Vercel edge caches
- Static assets cached globally for 1 year
- HTML pages cached for 1 hour

### Cache Invalidation

To force cache invalidation without waiting:

1. **On next code deploy**: New file hashes = new URLs = cache miss for static
2. **For HTML pages**: Wait 1 hour, or manually purge via Vercel dashboard
3. **For critical updates**: Adjust `s-maxage` value lower

## Monitoring

### Check Cache Effectiveness

1. **Vercel Analytics** (in production):
   - Monitor cache hit rates
   - Track bandwidth savings
   - Look for "Static Files" section

2. **Browser DevTools**:
   - Network tab → Performance
   - Look for "from cache" responses
   - Measure page load times

3. **Lighthouse**:
   - Run periodic audits
   - Track Core Web Vitals
   - Monitor caching score

## Troubleshooting

### Issue: Assets always downloading (cache not working)

**Solution:**

1. Verify `vercel.json` is in `apps/store-a/`
2. Check that files are in `_next/static/` (hash-versioned)
3. Clear browser cache and test again
4. Check Response headers in DevTools

### Issue: Updates not showing (cached too long)

**Solution:**

1. For JS/CSS: This is normal - wait for next deploy (new hashes)
2. For HTML: Max 1 hour wait, or clear browser cache
3. For critical update: Deploy new version (triggers new asset hashes)

### Issue: Fonts not loading

**Solution:**

1. Verify font files use `next/font`
2. Check `Cache-Control` headers include font extensions
3. Ensure fonts are in `public/fonts/` or imported via `next/font`

## Next Steps

After E7.3 is complete:

- E7.4: API Response Caching
- E8.1: Bundle Size Analysis & Optimization
- E8.2: Image Delivery Optimization

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Cache-Control Header MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Vercel Caching Guide](https://vercel.com/docs/edge-network/caching)
- [Web.dev: Serve static assets with an efficient cache policy](https://web.dev/articles/uses-long-cache-ttl)
