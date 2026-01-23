# Shopify Setup Complete ✅

## What Was Done

### 1. ✅ Updated Shopify Service for Next.js

- Changed from Vite's `import.meta.env` to Next.js `process.env`
- Added support for both Next.js and Vite (backward compatible)
- Service now accepts optional `ShopifyConfig` parameter from store context
- All functions updated to support config parameter

### 2. ✅ Made Environment Variables Optional

- Updated `apps/store-a/src/lib/env.ts` to make Shopify vars optional
- App works in **mock mode** when credentials are not set
- No errors when Shopify is not configured

### 3. ✅ Created Environment Template

- Created `apps/store-a/env.example.txt` with all required variables
- Includes documentation for each variable
- Ready to copy to `.env.local`

### 4. ✅ Updated Brand Config

- `brand.config.ts` now handles missing Shopify credentials gracefully
- Falls back to defaults when env vars are not set

### 5. ✅ Created Setup Guide

- Complete guide in `docs/SHOPIFY_SETUP_GUIDE.md`
- Step-by-step instructions for:
  - Creating Shopify store
  - Generating API tokens
  - Creating products
  - Configuring environment variables

## Current Status

### ✅ Ready to Use

The Shopify integration is now set up and ready:

1. **Mock Mode (Default)**: Works without any configuration
   - All functions return mock data
   - Perfect for UI development
   - No external dependencies

2. **Real Shopify Mode**: Works when credentials are configured
   - Set environment variables in `.env.local`
   - Or configure in `brand.config.ts`
   - Automatically switches to real Shopify

## Next Steps

### To Use Mock Mode (Current - No Action Needed)

- ✅ Already working!
- App uses mock data automatically
- Continue building UI

### To Connect Real Shopify

1. **Create `.env.local` file**:

   ```bash
   cd apps/store-a
   cp env.example.txt .env.local
   ```

2. **Get Shopify credentials** (see `SHOPIFY_SETUP_GUIDE.md`):
   - Store domain: `your-store.myshopify.com`
   - Storefront API token: `shpat_xxxxx`
   - Frame variant ID: `gid://shopify/ProductVariant/123456789`

3. **Fill in `.env.local`**:

   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx
   NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID=gid://shopify/ProductVariant/123456789
   ```

4. **Restart dev server**:

   ```bash
   npm run dev --filter=@framecraft/store-a
   ```

5. **Verify**: Check console - should see no "mock mode" warnings

## Files Modified

- ✅ `packages/core/src/services/shopify.ts` - Updated for Next.js
- ✅ `apps/store-a/src/lib/env.ts` - Made Shopify vars optional
- ✅ `apps/store-a/src/brand.config.ts` - Handles missing credentials
- ✅ `apps/store-a/env.example.txt` - Environment template (new)
- ✅ `docs/SHOPIFY_SETUP_GUIDE.md` - Complete setup guide (new)

## Testing

### Test Mock Mode

```typescript
import { fetchProducts, isShopifyEnabled } from "@framecraft/core";

// Should return mock data
const products = await fetchProducts();
console.log(products); // { products: [], message: "Shopify not configured..." }

// Should return false
console.log(isShopifyEnabled()); // false
```

### Test Real Shopify (after configuration)

```typescript
import { fetchProducts, isShopifyEnabled } from "@framecraft/core";

// Should return real products from Shopify
const products = await fetchProducts();
console.log(products); // Real Shopify product data

// Should return true
console.log(isShopifyEnabled()); // true
```

## Architecture

The Shopify service now supports **three configuration methods** (in priority order):

1. **Store Config Parameter** (from `useStoreConfig()`)

   ```typescript
   const config = useStoreConfig();
   await fetchProducts(config.shopify);
   ```

2. **Environment Variables** (Next.js or Vite)

   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=...
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
   ```

3. **Mock Mode** (automatic fallback)
   - Works without any configuration
   - Returns mock data for all functions

## Notes

- ✅ All linter errors fixed (one warning about apiVersion is a false positive)
- ✅ Backward compatible with Vite projects
- ✅ Type-safe with TypeScript
- ✅ Works in both browser and server environments
- ✅ Supports multiple stores with different configs

## Ready for Next Step

You can now:

1. ✅ Continue building UI with mock mode
2. ✅ Set up real Shopify when ready
3. ✅ Move to P2-004 (Header & Footer migration)

The Shopify setup is complete and ready to use! 🎉
