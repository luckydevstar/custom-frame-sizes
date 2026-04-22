# Order Fulfillment Integration Guide

This document describes how to integrate the Order Fulfillment App with the framecraft-frontends storefronts.

## Overview

The Order Fulfillment Service automatically captures custom frame orders and user-uploaded images, storing them in Cloudflare D1 and R2 for later retrieval by admins.

## Setup

### 1. Configure Environment Variables

In `framecraft-frontends/apps/store-a/.env` (and other storefronts):

```env
# Order Fulfillment Service
NEXT_PUBLIC_FULFILLMENT_API_URL=https://fulfillment.customframesizes.com
NEXT_PUBLIC_FULFILLMENT_API_KEY=your_shared_api_key_here
```

### 2. Import the Fulfillment Service

In your checkout flow (e.g., after order is successfully placed):

```typescript
import { submitOrderToFulfillment, extractLineItemsFromCart } from '@framecraft/core/services/fulfillment';
```

### 3. Call submitOrderToFulfillment

After a successful checkout, capture the order data and any custom image URL:

```typescript
// After successful Shopify checkout
const order = {
  id: '#12345', // Shopify order ID
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  lineItems: [...],
  total: '109.99',
};

const customImageUrl = 'https://cdn.customframesizes.com/uploads/abc123.jpg';

await submitOrderToFulfillment({
  orderId: order.id,
  customerEmail: order.customerEmail,
  customerName: order.customerName,
  orderData: {
    lineItems: extractLineItemsFromCart(items),
    subtotal: order.subtotal,
    total: order.total,
    currency: 'USD',
  },
  customImageUrl: customImageUrl,
  customImageFileName: 'custom-frame.jpg',
});
```

## Data Capture Points

### Where to Capture Custom Image URL

Custom images are typically uploaded in the frame designer. Here are common places to capture the URL:

**In FrameDesigner component:**
```typescript
// When user uploads/selects image
const handleImageUpload = async (file: File) => {
  // Upload to CDN (existing flow)
  const uploadedUrl = await uploadToCDN(file);
  
  // Store for later fulfillment submission
  setCustomImageUrl(uploadedUrl);
  setCustomImageFileName(file.name);
};
```

**In cart/checkout:**
```typescript
// Before redirecting to Shopify checkout
const customImageUrl = cartStore.getCustomImageUrl();
const customImageFileName = cartStore.getCustomImageFileName();
```

### Where to Capture Order Data

Order data should be captured after successful checkout:

**In post-checkout webhook/callback:**
```typescript
// After Shopify checkout completes
const handleCheckoutSuccess = async (shopifyOrderId: string, checkoutData: any) => {
  await submitOrderToFulfillment({
    orderId: shopifyOrderId,
    customerEmail: checkoutData.customer.email,
    customerName: checkoutData.customer.firstName + ' ' + checkoutData.customer.lastName,
    orderData: {
      lineItems: checkoutData.lineItems.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.originalPrice,
      })),
      subtotal: checkoutData.subtotal,
      total: checkoutData.total,
      currency: checkoutData.currency,
    },
    customImageUrl: storedImageUrl,
    customImageFileName: storedImageFileName,
  });
};
```

## Error Handling

The `submitOrderToFulfillment` function handles errors gracefully and never blocks checkout:

```typescript
try {
  await submitOrderToFulfillment({...});
  console.log('Order submitted to fulfillment successfully');
} catch (error) {
  // Fulfillment submission failed, but don't block checkout
  console.error('Fulfillment submission error (non-blocking):', error);
}
```

## Implementation Checklist

- [ ] Add `NEXT_PUBLIC_FULFILLMENT_API_URL` and `NEXT_PUBLIC_FULFILLMENT_API_KEY` to `.env`
- [ ] Import `submitOrderToFulfillment` in checkout handler
- [ ] Identify where custom image URL is available in your flow
- [ ] Identify where order data is available (usually after Shopify checkout)
- [ ] Call `submitOrderToFulfillment` with all required data
- [ ] Test with fulfillment app in development
- [ ] Deploy fulfillment app to production
- [ ] Update production environment variables
- [ ] Test end-to-end with actual orders

## Testing

### Local Development

1. Start order-fulfillment-app:
```bash
cd order-fulfillment-app
npm run dev
# Runs on http://localhost:3000
```

2. Set env vars in framecraft-frontends:
```env
NEXT_PUBLIC_FULFILLMENT_API_URL=http://localhost:3000
NEXT_PUBLIC_FULFILLMENT_API_KEY=dev-api-key
```

3. Update order-fulfillment-app `.env.local`:
```env
API_KEY=dev-api-key
```

4. Test checkout flow and verify orders appear in fulfillment dashboard

### Production

1. Deploy order-fulfillment-app to production (Vercel, etc.)
2. Update `NEXT_PUBLIC_FULFILLMENT_API_URL` in all storefronts
3. Keep `NEXT_PUBLIC_FULFILLMENT_API_KEY` synchronized across apps
4. Test with real orders

## Monitoring

### Check Fulfillment Dashboard

Visit the fulfillment app dashboard to verify orders are being received:

1. Go to `https://fulfillment.customframesizes.com/login`
2. Enter your API key
3. Search for recent orders by order ID or customer email

### Check Image Status

In the order detail page, verify:
- Image upload status is "completed"
- Custom image preview is visible
- Download button works

## Troubleshooting

### Order Not Appearing in Dashboard

1. Verify `NEXT_PUBLIC_FULFILLMENT_API_URL` is correct
2. Verify `NEXT_PUBLIC_FULFILLMENT_API_KEY` matches the app's `API_KEY`
3. Check browser console for any fetch errors
4. Verify fulfillment app is running and accessible

### Image Upload Failed

1. Check image URL is publicly accessible
2. Verify R2 bucket is configured with correct credentials
3. Check browser console and fulfillment app logs for details

### API Key Invalid

1. Verify key in both apps matches exactly
2. Clear fulfillment app browser cache
3. Generate a new key and update both places

## API Reference

See [order-fulfillment-app/README.md](../../order-fulfillment-app/README.md#api-endpoints) for complete API documentation.

## Support

For issues or questions:
1. Check the fulfillment app logs
2. Verify environment variables
3. Review API responses in browser network tab
4. Contact development team
