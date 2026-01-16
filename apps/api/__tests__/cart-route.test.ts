/**
 * Cart Route Integration Tests
 *
 * Tests for the /api/cart endpoint.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Mock the rate limit middleware
vi.mock("../src/lib/rate-limit-middleware", () => ({
  applyRateLimit: vi.fn(
    (_type: string, handler: (req: unknown, res: unknown) => Promise<void>) => handler
  ),
}));

// Mock the cart-utils
vi.mock("../src/lib/cart-utils", () => ({
  createCartWithStorefront: vi.fn(),
}));

// Mock cookies
vi.mock("../src/lib/cookies", () => ({
  setCookie: vi.fn(),
  getCookie: vi.fn(),
  CART_ID_COOKIE: "framecraft_cart_id",
}));

// Create mock request and response
function createMockRequest(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: "POST",
    url: "/api/cart",
    headers: {
      "content-type": "application/json",
      "user-agent": "test-agent",
    },
    body: {},
    query: {},
    cookies: {},
    ...overrides,
  } as VercelRequest;
}

function createMockResponse(): VercelResponse & {
  statusCode: number;
  jsonData: unknown;
} {
  const res: Partial<VercelResponse> & { statusCode: number; jsonData: unknown } = {
    statusCode: 200,
    jsonData: null,
    status: vi.fn((code: number) => {
      res.statusCode = code;
      return res as VercelResponse;
    }),
    json: vi.fn((data: unknown) => {
      res.jsonData = data;
      return res as VercelResponse;
    }),
    setHeader: vi.fn().mockReturnThis(),
    getHeader: vi.fn(),
    removeHeader: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
  };
  return res as VercelResponse & { statusCode: number; jsonData: unknown };
}

describe("/api/cart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("POST /api/cart", () => {
    it("should return 400 for invalid request body", async () => {
      // Import fresh module after mocks
      const { default: handler } = await import("../src/routes/cart/route");
      const { createCartWithStorefront } = await import("../src/lib/cart-utils");

      const req = createMockRequest({
        method: "POST",
        body: {
          // Missing required storeId
          lines: [],
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: expect.any(String),
          }),
        })
      );
      expect(createCartWithStorefront).not.toHaveBeenCalled();
    });

    it("should create cart and return success", async () => {
      const { default: handler } = await import("../src/routes/cart/route");
      const { createCartWithStorefront } = await import("../src/lib/cart-utils");
      const { setCookie, CART_ID_COOKIE } = await import("../src/lib/cookies");

      // Mock successful cart creation
      const mockCart = {
        id: "gid://shopify/Cart/abc123",
        checkoutUrl: "https://checkout.shopify.com/abc123",
        lines: { edges: [] },
        cost: {
          totalAmount: { amount: "0.00", currencyCode: "USD" },
          subtotalAmount: { amount: "0.00", currencyCode: "USD" },
        },
      };

      vi.mocked(createCartWithStorefront).mockResolvedValueOnce(mockCart);

      const req = createMockRequest({
        method: "POST",
        body: {
          storeId: "test-store",
          lines: [
            {
              merchandiseId: "gid://shopify/ProductVariant/123",
              quantity: 1,
            },
          ],
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(createCartWithStorefront).toHaveBeenCalledWith("test-store", expect.any(Array));
      expect(setCookie).toHaveBeenCalledWith(res, CART_ID_COOKIE, mockCart.id, expect.any(Object));
      expect(res.statusCode).toBe(201);
      expect(res.jsonData).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            cartId: mockCart.id,
            cart: mockCart,
          }),
        })
      );
    });

    it("should return 502 when Shopify API fails", async () => {
      const { default: handler } = await import("../src/routes/cart/route");
      const { createCartWithStorefront } = await import("../src/lib/cart-utils");

      vi.mocked(createCartWithStorefront).mockRejectedValueOnce(new Error("Shopify API error"));

      const req = createMockRequest({
        method: "POST",
        body: {
          storeId: "test-store",
          lines: [
            {
              merchandiseId: "gid://shopify/ProductVariant/123",
              quantity: 1,
            },
          ],
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(502);
      expect(res.jsonData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining("Failed to create cart"),
          }),
        })
      );
    });

    it("should validate store ID format", async () => {
      const { default: handler } = await import("../src/routes/cart/route");
      const { createCartWithStorefront } = await import("../src/lib/cart-utils");

      const req = createMockRequest({
        method: "POST",
        body: {
          storeId: "invalid store id with spaces!@#$",
          lines: [
            {
              merchandiseId: "gid://shopify/ProductVariant/123",
              quantity: 1,
            },
          ],
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(createCartWithStorefront).not.toHaveBeenCalled();
    });

    it("should sanitize attributes", async () => {
      const { default: handler } = await import("../src/routes/cart/route");
      const { createCartWithStorefront } = await import("../src/lib/cart-utils");

      const mockCart = {
        id: "gid://shopify/Cart/abc123",
        checkoutUrl: "https://checkout.shopify.com/abc123",
        lines: { edges: [] },
        cost: {
          totalAmount: { amount: "29.99", currencyCode: "USD" },
          subtotalAmount: { amount: "29.99", currencyCode: "USD" },
        },
      };

      vi.mocked(createCartWithStorefront).mockResolvedValueOnce(mockCart);

      const req = createMockRequest({
        method: "POST",
        body: {
          storeId: "test-store",
          lines: [
            {
              merchandiseId: "gid://shopify/ProductVariant/123",
              quantity: 1,
              attributes: [
                { key: "Frame Style", value: "black-classic" },
                { key: "Artwork Width", value: '12.5"' },
              ],
            },
          ],
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(201);
      expect(createCartWithStorefront).toHaveBeenCalled();
    });
  });

  describe("Method not allowed", () => {
    it("should return 405 for GET request", async () => {
      const { default: handler } = await import("../src/routes/cart/route");

      const req = createMockRequest({
        method: "GET",
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(405);
      expect(res.jsonData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: "METHOD_NOT_ALLOWED",
          }),
        })
      );
    });
  });
});
