# Shopify Setup Guide for Store A

This guide walks you through setting up Shopify integration for Store A.

## Overview

The Shopify integration supports **mock mode** when credentials are not configured. This allows you to:

- Build and test the UI without Shopify credentials
- Develop locally without external dependencies
- Switch to real Shopify when ready

## Setup Steps

### Step 1: Create Shopify Store (If You Don't Have One)

1. Go to [shopify.com](https://www.shopify.com)
2. Sign up for a Shopify account (Development store is free for testing)
3. Complete the store setup wizard

### Step 2: Create Storefront API Access Token

1. Log into your Shopify admin
2. Go to **Settings** → **Apps and sales channels**
3. Click **Develop apps** (or **Manage private apps** in older versions)
4. Click **Create an app**
5. Name it "Headless Storefront" (or any name)
6. Click **Create app**
7. Click **Configure Admin API scopes** (we'll use this later)
8. Click **Configure Storefront API scopes**
9. Enable the following scopes:
   - `unauthenticated_read_product_listings` (for products)
   - `unauthenticated_read_checkouts` (for cart/checkout)
   - `unauthenticated_write_checkouts` (for creating carts)
10. Click **Save**
11. Click **Install app**
12. Go to **API credentials** tab
13. Under **Storefront API access token**, click **Reveal token once**
14. **Copy the token** - you'll need this for `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

### Step 3: Create Custom Frame Product (Placeholder)

1. In Shopify admin, go to **Products**
2. Click **Add product**
3. Name: "Custom Picture Frame"
4. Description: "Custom picture frame with personalized configuration"
5. Price: $0.00 (pricing is dynamic via line item properties)
6. Inventory: **Don't track inventory** (uncheck "Track quantity")
7. Click **Save**
8. Note the **Variant ID** (you'll see it in the URL or product details)
   - Format: `gid://shopify/ProductVariant/123456789`
   - You'll need this for `NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID`

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Shopify credentials:

   ```env
   # Your Shopify store domain
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

   # Storefront API access token (from Step 2)
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx

   # API version (default: 2024-01)
   NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01

   # Frame variant ID (from Step 3)
   NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID=gid://shopify/ProductVariant/123456789
   ```

3. **Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

### Step 5: Verify Setup

1. Restart your development server:

   ```bash
   npm run dev --filter=@framecraft/store-a
   ```

2. Check the browser console - you should see:
   - If configured: No warnings about Shopify
   - If not configured: "Shopify not configured. Using mock data." (this is OK for now)

3. Test the Shopify service:
   - The app will automatically use real Shopify if credentials are set
   - It will fall back to mock mode if credentials are missing

## Configuration Methods

The Shopify service supports **three ways** to configure credentials:

### Method 1: Environment Variables (Recommended for Development)

Set in `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx
```

### Method 2: Store Brand Config (Recommended for Production)

Set in `apps/store-a/src/brand.config.ts`:

```typescript
shopify: {
  domain: "your-store.myshopify.com",
  storefrontAccessToken: "shpat_xxxxx",
  apiVersion: "2024-01",
}
```

**Note**: For production, you should still use environment variables and reference them:

```typescript
import { env } from "./lib/env";

shopify: {
  domain: env.shopify.storeDomain || "your-store.myshopify.com",
  storefrontAccessToken: env.shopify.storefrontAccessToken || "",
  apiVersion: env.shopify.apiVersion || "2024-01",
}
```

### Method 3: Mock Mode (No Configuration)

If no credentials are provided, the service automatically uses mock mode:

- Returns mock product data
- Returns mock checkout URLs
- All functions work, but don't interact with real Shopify

## Testing

### Test with Mock Mode

1. Don't set any Shopify environment variables
2. Run the app - it should work with mock data
3. Check console for "Shopify not configured. Using mock data."

### Test with Real Shopify

1. Set environment variables as described above
2. Restart the dev server
3. The app should connect to your Shopify store
4. Products should load from Shopify (if you have any)

## Troubleshooting

### "Shopify not configured" Warning

**This is normal** if you haven't set up credentials yet. The app will work in mock mode.

### "Missing required environment variable" Error

This means `env.ts` is trying to require Shopify vars. Check that you updated `env.ts` to make them optional (should already be done).

### API Errors

If you get Shopify API errors:

1. Verify your store domain is correct (include `.myshopify.com`)
2. Verify your access token is correct (starts with `shpat_`)
3. Check that the token has the correct scopes
4. Verify your API version is supported by your Shopify plan

### CORS Errors

If you see CORS errors:

- This shouldn't happen with Storefront API (it's designed for headless)
- Make sure you're using the Storefront API token, not Admin API token

## Next Steps

Once Shopify is configured:

1. **Test Product Fetching**: The `fetchProducts()` function should return real products
2. **Test Cart Creation**: Create a cart and verify it appears in Shopify
3. **Test Checkout**: Complete a test checkout flow
4. **Set Up Admin API** (optional): For server-side cart management

## Security Notes

- **Never commit** `.env.local` to git
- Storefront API tokens are **public** (they're exposed to the browser)
- Admin API tokens are **secret** (server-side only)
- Use different tokens for development and production
- Rotate tokens regularly

## Production Deployment

For Vercel deployment:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add all `NEXT_PUBLIC_*` variables
4. Add server-side variables (without `NEXT_PUBLIC_` prefix)
5. Redeploy your application

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Check the server logs for API errors
3. Verify your Shopify credentials are correct
4. Test with mock mode first to isolate issues
