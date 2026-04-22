# Storefront R2 Configuration - Orders Images Bucket

## Overview

The storefront now needs environment variables to reference the new **Cloudflare R2 orders images bucket** where custom user-uploaded images are stored during frame design.

## Environment Variables

### In `framecraft-frontends/apps/store-a/.env`:

```env
# Cloudflare R2 – orders/custom images bucket
# Used for storing user-uploaded custom images during frame design
# These images are referenced in Shopify order metadata
NEXT_PUBLIC_R2_ORDERS_BUCKET_URL=https://orders.customframesizes.com
```

### In `framecraft-frontends/apps/store-a/.env.local.example`:

Documented the same variable for reference.

## What This Variable Does

**`NEXT_PUBLIC_R2_ORDERS_BUCKET_URL`**
- Base URL to the new R2 bucket for order images (`custom-frame-orders`)
- Used when constructing image URLs during upload
- Passed to `framecraft-api` BFF which generates presigned upload URLs
- Becomes part of `FrameConfiguration.imageUrl` during frame design
- Eventually stored in Shopify order line properties as "Custom Image URL"

## Architecture Flow

```
User uploads image in frame designer
  ↓
Frontend calls framecraft-api: POST /api/objects/upload
  ↓
framecraft-api uses R2 credentials (backend .env) to generate presigned URL
  ↓
framecraft-api returns presigned URL pointing to NEXT_PUBLIC_R2_ORDERS_BUCKET_URL
  ↓
Frontend uploads directly to R2 using presigned URL
  ↓
Image URL stored in FrameConfiguration.imageUrl
  ↓
Checkout passes imageUrl to line attributes
  ↓
Shopify stores in order line properties
  ↓
Fulfillment app retrieves from Shopify order
```

## Actual Values

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_R2_ORDERS_BUCKET_URL` | `https://orders.customframesizes.com` | Public R2 bucket URL for order images |

## Backend Configuration (framecraft-api)

**Note**: The `framecraft-api` BFF needs server-side R2 credentials to generate presigned URLs. These should be set in the backend `.env`:

```env
# In framecraft-api backend .env (NOT public)
R2_ORDERS_BUCKET_NAME=custom-frame-orders
R2_ORDERS_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_ORDERS_ACCESS_KEY_ID=xxx
R2_ORDERS_SECRET_ACCESS_KEY=xxx
```

The BFF uses these to:
1. Generate presigned upload URLs
2. Return the upload endpoint to the frontend
3. The frontend then uploads directly to R2 without server involvement

## Implementation Status

✅ **Storefront Environment Variables**: Added
✅ **Documentation**: Complete
⏳ **framecraft-api Backend**: Needs to implement `/api/objects/upload` for orders bucket

## Next Steps

1. **In `framecraft-frontends`**:
   - Ensure `.env` has the new variable
   - Verify `/api/objects/upload` respects bucket routing

2. **In `framecraft-api` (external BFF)**:
   - Add server-side R2 credentials for orders bucket
   - Modify `/api/objects/upload` endpoint to:
     - Detect which bucket to use (shared, store-a, or orders)
     - Generate presigned URL for the appropriate bucket
     - Return the correct upload URL

3. **Testing**:
   - Upload an image in frame designer
   - Verify it goes to `custom-frame-orders` bucket
   - Verify URL is stored in `FrameConfiguration.imageUrl`
   - Proceed to checkout
   - Verify image URL appears in Shopify order line properties

## Notes

- `NEXT_PUBLIC_` prefix means this is sent to the browser (public info)
- The actual bucket URL visible to users is derived from this value
- R2 presigned URLs are generated server-side for security
- The image URL becomes part of order metadata for fulfillment app to retrieve
