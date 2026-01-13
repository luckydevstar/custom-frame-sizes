/**
 * Response Type Definitions
 */

/**
 * Cart response
 */
export interface CartResponse {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: {
            id: string;
            title: string;
          };
        };
      };
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

/**
 * Create cart response
 */
export interface CreateCartResponse {
  cartId: string;
  cart: CartResponse;
}

/**
 * Update cart lines response
 */
export interface UpdateCartLinesResponse {
  cart: CartResponse;
}
