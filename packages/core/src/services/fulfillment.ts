/**
 * Order Fulfillment Service
 * Handles submission of orders with custom images to the fulfillment app
 */

interface FulfillmentOrderData {
  lineItems: Array<{
    id: string;
    title: string;
    quantity: number;
    price: string;
  }>;
  subtotal: string;
  total: string;
  currency: string;
}

interface SubmitOrderOptions {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderData: FulfillmentOrderData;
  customImageUrl?: string;
  customImageFileName?: string;
}

export async function submitOrderToFulfillment(options: SubmitOrderOptions): Promise<void> {
  const fulfillmentUrl = process.env.NEXT_PUBLIC_FULFILLMENT_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_FULFILLMENT_API_KEY;

  if (!fulfillmentUrl) {
    console.warn('NEXT_PUBLIC_FULFILLMENT_API_URL not configured. Skipping fulfillment submission.');
    return;
  }

  if (!apiKey) {
    console.warn('NEXT_PUBLIC_FULFILLMENT_API_KEY not configured. Skipping fulfillment submission.');
    return;
  }

  try {
    const response = await fetch(`${fulfillmentUrl}/api/orders/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shopifyOrderId: options.orderId,
        customerEmail: options.customerEmail,
        customerName: options.customerName,
        orderData: options.orderData,
        customImageUrl: options.customImageUrl || '',
        customImageOriginalName: options.customImageFileName || 'custom-frame-image.jpg',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to submit order to fulfillment:', errorData);
      // Don't throw - we don't want to block checkout for fulfillment issues
      return;
    }

    const data = await response.json();
    console.log('Order submitted to fulfillment:', data.data?.orderId);
  } catch (error) {
    // Log but don't throw - fulfillment is secondary to checkout
    console.error('Error submitting order to fulfillment:', error);
  }
}

/**
 * Extract line items from Shopify cart data
 */
export function extractLineItemsFromCart(
  lines: Array<{
    merchandiseId?: string;
    quantity?: number;
    priceCents?: number;
    configuration?: any;
  }>
): FulfillmentOrderData['lineItems'] {
  return lines.map((line, index) => ({
    id: `line-${index}`,
    title: line.configuration?.frameStyleId || 'Custom Frame',
    quantity: line.quantity || 1,
    price: line.priceCents ? (line.priceCents / 100).toFixed(2) : '0.00',
  }));
}
