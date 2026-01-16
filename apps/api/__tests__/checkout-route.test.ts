/**
 * Checkout Route Integration Tests
 *
 * Tests for the /api/checkout endpoint.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Mock the rate limit middleware
vi.mock("../src/lib/rate-limit-middleware", () => ({
  applyRateLimit: vi.fn(
    (_type: string, handler: (req: unknown, res: unknown) => Promise<void>) => handler
  ),
}));

// Mock the checkout-utils
vi.mock("../src/lib/checkout-utils", () => ({
  createCheckoutUrl: vi.fn(),
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
    url: "/api/checkout",
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

describe("/api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("POST /api/checkout", () => {
    it("should return 404 when cart ID cookie is missing", async () => {
      const { default: handler } = await import("../src/routes/checkout/route");
      const { getCookie } = await import("../src/lib/cookies");

      vi.mocked(getCookie).mockReturnValueOnce(undefined);

      const req = createMockRequest({
        method: "POST",
        body: {
          storeId: "test-store",
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.jsonData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: "NOT_FOUND",
          }),
        })
      );
    });

    it("should create checkout and return URL", async () => {
      const { default: handler } = await import("../src/routes/checkout/route");
      const { getCookie } = await import("../src/lib/cookies");
      const { createCheckoutUrl } = await import("../src/lib/checkout-utils");

      const cartId = "gid://shopify/Cart/abc123";
      vi.mocked(getCookie).mockReturnValueOnce(cartId);

      const mockCheckout = {
        checkoutUrl: "https://checkout.shopify.com/checkout/abc123",
        checkoutId: "gid://shopify/Checkout/xyz789",
      };
      vi.mocked(createCheckoutUrl).mockResolvedValueOnce(mockCheckout);

      const req = createMockRequest({
        method: "POST",
        body: {
          storeId: "test-store",
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(getCookie).toHaveBeenCalled();
      expect(createCheckoutUrl).toHaveBeenCalledWith("test-store", cartId, undefined);
      expect(res.statusCode).toBe(200);
      expect(res.jsonData).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            checkoutUrl: mockCheckout.checkoutUrl,
            checkoutId: mockCheckout.checkoutId,
          }),
        })
      );
    });

    it("should pass discount code to checkout", async () => {
      const { default: handler } = await import("../src/routes/checkout/route");
      const { getCookie } = await import("../src/lib/cookies");
      const { createCheckoutUrl } = await import("../src/lib/checkout-utils");

      vi.mocked(getCookie).mockReturnValueOnce("gid://shopify/Cart/abc123");
      vi.mocked(createCheckoutUrl).mockResolvedValueOnce({
        checkoutUrl: "https://checkout.shopify.com/checkout/abc123",
        checkoutId: "gid://shopify/Checkout/xyz789",
      });

      const req = createMockRequest({
        method: "POST",
        body: {
          storeId: "test-store",
          discountCode: "SAVE10",
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(createCheckoutUrl).toHaveBeenCalledWith(
        "test-store",
        "gid://shopify/Cart/abc123",
        "SAVE10"
      );
    });

    it("should return 400 for invalid request body", async () => {
      const { default: handler } = await import("../src/routes/checkout/route");
      const { getCookie } = await import("../src/lib/cookies");

      vi.mocked(getCookie).mockReturnValueOnce("gid://shopify/Cart/abc123");

      const req = createMockRequest({
        method: "POST",
        body: {
          // Missing required storeId
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
    });

    it("should validate email format", async () => {
      const { default: handler } = await import("../src/routes/checkout/route");
      const { getCookie } = await import("../src/lib/cookies");
      const { createCheckoutUrl } = await import("../src/lib/checkout-utils");

      vi.mocked(getCookie).mockReturnValueOnce("gid://shopify/Cart/abc123");
      vi.mocked(createCheckoutUrl).mockResolvedValueOnce({
        checkoutUrl: "https://checkout.shopify.com/checkout/abc123",
        checkoutId: "gid://shopify/Checkout/xyz789",
      });

      const req = createMockRequest({
        method: "POST",
        body: {
          storeId: "test-store",
          customerEmail: "invalid-email",
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      // Should fail validation
      expect(res.statusCode).toBe(400);
    });

    it("should handle checkout creation failure", async () => {
      const { default: handler } = await import("../src/routes/checkout/route");
      const { getCookie } = await import("../src/lib/cookies");
      const { createCheckoutUrl } = await import("../src/lib/checkout-utils");

      vi.mocked(getCookie).mockReturnValueOnce("gid://shopify/Cart/abc123");
      vi.mocked(createCheckoutUrl).mockRejectedValueOnce(new Error("Checkout creation failed"));

      const req = createMockRequest({
        method: "POST",
        body: {
          storeId: "test-store",
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.jsonData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining("Failed to create checkout"),
          }),
        })
      );
    });
  });

  describe("Method not allowed", () => {
    it("should return 405 for GET request", async () => {
      const { default: handler } = await import("../src/routes/checkout/route");

      const req = createMockRequest({
        method: "GET",
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(405);
    });
  });
});
