# Environment Variables Reference

## Cloudflare R2 CDN Configuration

### Required for CDN

Add these to your `.env.local` file (or Vercel environment variables):

```bash
# Option 1: Separate URLs for each bucket (Recommended)
NEXT_PUBLIC_CDN_SHARED_URL=https://cfs-shared-assets.yourdomain.com
NEXT_PUBLIC_CDN_STORE_A_URL=https://cfs-store-a-assets.yourdomain.com

# OR Option 2: Single base URL (Alternative)
# NEXT_PUBLIC_CDN_BASE_URL=https://cdn.yourdomain.com
```

### Getting Your CDN URLs

#### Method 1: Custom Domain (Recommended)

1. Go to Cloudflare Dashboard → R2 → Your Bucket
2. Click "Connect Domain" or "Settings" → "Custom Domain"
3. Add your custom domain:
   - For `cfs-shared-assets`: `cfs-shared-assets.yourdomain.com`
   - For `cfs-store-a-assets`: `cfs-store-a-assets.yourdomain.com`
4. Use those URLs as your environment variables

#### Method 2: R2 Public URL

1. Go to Cloudflare Dashboard → R2 → Your Bucket
2. Click "Settings" → "Public Access"
3. Enable public access
4. Copy the public URL (e.g., `https://pub-xxxxx.r2.dev`)
5. Use that URL as your environment variable

### Example Configuration

```bash
# For cfs-shared-assets bucket
NEXT_PUBLIC_CDN_SHARED_URL=https://pub-abc123.r2.dev
# OR
NEXT_PUBLIC_CDN_SHARED_URL=https://cfs-shared-assets.yourdomain.com

# For cfs-store-a-assets bucket
NEXT_PUBLIC_CDN_STORE_A_URL=https://pub-xyz789.r2.dev
# OR
NEXT_PUBLIC_CDN_STORE_A_URL=https://cfs-store-a-assets.yourdomain.com
```

### Optional Configuration

```bash
# Bucket names (defaults to cfs-shared-assets and cfs-store-a-assets)
NEXT_PUBLIC_CDN_SHARED_BUCKET=cfs-shared-assets
NEXT_PUBLIC_CDN_STORE_BUCKET=cfs-store-a-assets
```

## Complete Environment Variables List

### Shopify Configuration

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
SHOPIFY_ADMIN_TOKEN=your-admin-token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID=gid://shopify/ProductVariant/12345678
NEXT_PUBLIC_SHOPIFY_MAT_VARIANT_ID=gid://shopify/ProductVariant/87654321
```

### CDN Configuration

```bash
# Required for CDN
NEXT_PUBLIC_CDN_SHARED_URL=https://cfs-shared-assets.yourdomain.com
NEXT_PUBLIC_CDN_STORE_A_URL=https://cfs-store-a-assets.yourdomain.com

# Optional
NEXT_PUBLIC_CDN_BASE_URL=https://cdn.yourdomain.com  # Alternative to separate URLs
NEXT_PUBLIC_CDN_SHARED_BUCKET=cfs-shared-assets     # Default bucket name
NEXT_PUBLIC_CDN_STORE_BUCKET=cfs-store-a-assets     # Default bucket name
```

### Store Configuration

```bash
NEXT_PUBLIC_STORE_ID=store-a
```

### Error Monitoring (Sentry)

```bash
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxxxxxxxxxxxxxxxxx  # CI/CD only
SENTRY_ORG=your-org
SENTRY_PROJECT=framecraft
```

### Feature Flags

```bash
ENABLE_SHOPIFY_LOGGING=false
DISABLE_RATE_LIMITING=false
```

## Vercel Setup

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all `NEXT_PUBLIC_*` variables (these are exposed to the browser)
3. Add server-side variables (without `NEXT_PUBLIC_` prefix)
4. Set for appropriate environments (Production, Preview, Development)

## Testing CDN Configuration

After setting environment variables:

1. Restart your dev server
2. Check browser console for CDN URLs
3. Verify images load from CDN (check Network tab)
4. Test fallback behavior (remove env vars, should use local paths)

## Troubleshooting

### Images Not Loading from CDN

1. **Check CORS**: Ensure R2 buckets allow CORS from your domain
2. **Verify URLs**: Check environment variables are set correctly
3. **Check bucket permissions**: Ensure buckets are publicly accessible
4. **Verify file paths**: Ensure files exist in buckets with correct paths

### CORS Errors

Add CORS configuration to your R2 buckets in Cloudflare Dashboard:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com", "https://*.vercel.app", "http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```
