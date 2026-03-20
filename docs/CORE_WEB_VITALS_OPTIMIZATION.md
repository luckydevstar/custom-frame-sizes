# Core Web Vitals Optimization Guide

## Overview

Core Web Vitals are user-centered metrics that measure key aspects of web page quality. This guide documents optimization strategies for CustomFrameSizes to achieve a Lighthouse score ≥90.

## Key Metrics

### 1. Largest Contentful Paint (LCP) - Target: < 2.5s

Measures when the largest content element becomes visible.

**Optimizations Implemented:**

- ✅ Font optimization with `display: swap` to prevent FOIT
- ✅ Image optimization with Next.js Image component
  - Lazy loading for below-fold images
  - Responsive sizing with `sizes` prop
  - Blur placeholders for perceived performance
- ✅ Dynamic imports for heavy components (below fold)
- ✅ Priority prop for above-fold images

### 2. Cumulative Layout Shift (CLS) - Target: < 0.1

Measures visual stability during page load.

**Optimizations Implemented:**

- ✅ Explicit width/height on images to prevent reflow
- ✅ Reserved space for ads/dynamic content
- ✅ Font optimization prevents text reflow with `display: swap`
- ✅ CSS containment on high-impact elements

### 3. Interaction to Next Paint (INP) - Target: < 200ms

Measures responsiveness to user interactions.

**Optimizations Implemented:**

- ✅ Code splitting with dynamic imports
- ✅ Efficient event handling
- ✅ Minimized JavaScript parsing time

## Implementation Strategy

### Layout Optimization

- ✅ Font configuration: `display: swap` + preload
- ✅ Image sizing: Explicit dimensions prevent layout shift
- ✅ Container queries for responsive design

### Loading Strategy

```typescript
// Heavy components loaded below the fold
const ShadowboxShowcase = dynamic(() => import('@framecraft/ui').then(m => m.ShadowboxShowcase), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

### Image Optimization

```typescript
// All product images use Next.js Image
<Image
  src={url}
  alt={alt}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={svgPlaceholder}
/>
```

## Lighthouse Testing

### Test Pages

1. **Homepage** (/)
   - Hero section: LCP critical
   - Multiple showcase components: optimization needed
2. **Designer Pages** (/designer, /mat-designer, /shadowbox/designer)
   - Interactive tool: needs responsive interaction
   - Form elements: input debouncing
3. **Category Pages** (/frames, /shadowbox)
   - Product listings with multiple images
   - Lazy loading crucial

### Testing Setup

```bash
# Build for production
npm run build

# Start production server
npm start

# Run Lighthouse audit
# Using Chrome DevTools: Ctrl+Shift+I → Lighthouse
# Or using CLI:
npm install -g lighthouse
lighthouse https://localhost:3000/
```

### Target Metrics

| Page     | LCP    | CLS   | INP     | Score |
| -------- | ------ | ----- | ------- | ----- |
| Homepage | < 2.5s | < 0.1 | < 200ms | ≥ 90  |
| Designer | < 2.5s | < 0.1 | < 200ms | ≥ 90  |
| Category | < 2.5s | < 0.1 | < 200ms | ≥ 85  |

## Performance Checklist

### Critical Path Optimization

- ✅ Minimize critical CSS
- ✅ Defer non-critical JavaScript
- ✅ Preload critical resources
- ✅ Compress images aggressively

### Network & Caching

- ✅ Enable gzip compression (Vercel default)
- ✅ Use CDN for static assets (Vercel Edge Network)
- ✅ Set appropriate cache headers
- ✅ Minify CSS/JavaScript (Next.js build)

### Runtime Performance

- ✅ Lazy load below-fold content
- ✅ Dynamic imports for heavy components
- ✅ Image lazy loading
- ✅ Efficient React rendering (memo, useMemo)

## Mobile Testing

### Simulated Slow Network

1. Open DevTools (F12)
2. Network tab → Throttle: Slow 3G
3. Lighthouse tab → Generate report

### Expected Results on 3G

- LCP: < 4s (mobile target is more lenient)
- CLS: < 0.1 (same as desktop)
- INP: < 200ms (same as desktop)

## Ongoing Monitoring

### Search Console

- Monitor Core Web Vitals data
- Identify pages with poor metrics
- Track improvements over time

### Web Vitals Library

```typescript
// Add to app/layout.tsx for monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
}
```

## Future Optimizations

### Phase 2

- Image compression with modern formats (WebP, AVIF)
- Critical CSS extraction
- Service Worker for offline support

### Phase 3

- Progressive Web App (PWA) implementation
- Advanced caching strategies
- Performance budgets

## References

- [Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Next.js Performance](https://nextjs.org/learn/seo/web-performance)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
