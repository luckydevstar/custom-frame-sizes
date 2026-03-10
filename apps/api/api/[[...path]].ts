/**
 * Single Express entry for FrameCraft API (Vercel serverless).
 * All /api/* routes are handled here so shared/lib is bundled in one function.
 */

import express from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess, ApiError } from "../shared/lib/route-handler";
import { validationError, notFoundError, shopifyApiError } from "../shared/lib/errors";
import { getCookie, setCookie, CART_ID_COOKIE } from "../shared/lib/cookies";
import { CreateCartRequestSchema, UpdateCartLinesRequestSchema } from "../shared/types/requests";
import { CreateOrderFileRequestSchema } from "../shared/types/order-files";
import {
  createCartWithStorefront,
  addLinesToCart,
  updateLinesInCart,
  removeLinesFromCart,
} from "../shared/lib/cart-utils";
import { createCheckoutUrl } from "../shared/lib/checkout-utils";
import {
  createOrderFile,
  getOrderFiles,
  getOrderFileById,
  isValidShopifyOrderId,
} from "../shared/lib/order-file-utils";
import { CheckoutRequestSchema } from "../shared/lib/validation";
import { ensureStoreConfig } from "../shared/lib/store-config";
import { applyRateLimit } from "../shared/lib/rate-limit-middleware";
import { sanitizeStoreId, sanitizeAttributes, sanitizeEmail } from "../shared/lib/sanitization";
import { validateStoreIdOrThrow } from "../shared/lib/validation";

const app = express();
app.use(express.json());

// Cast Express req/res to Vercel shape for shared handlers (compatible interface)
const asVercel = (req: express.Request, res: express.Response): [VercelRequest, VercelResponse] => [
  req as unknown as VercelRequest,
  res as unknown as VercelResponse,
];

// Run async handler and catch any rejection (safety)
const run =
  (handler: (req: express.Request, res: express.Response) => Promise<void>) =>
  (req: express.Request, res: express.Response) => {
    void handler(req, res).catch((err) => {
      if (res.headersSent) return;
      console.error(err);
      res
        .status(500)
        .json({
          success: false,
          error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred" },
        });
    });
  };

// --- Health ---
app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

// --- Cart ---
const cartHandler = applyRateLimit(
  "cart",
  withRouteHandler({
    POST: async (req: VercelRequest, res: VercelResponse) => {
      const validationResult = CreateCartRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw validationError("Invalid request", {
          field: validationResult.error.errors[0]?.path?.join(".") ?? "unknown",
          reason: validationResult.error.errors[0]?.message ?? "Validation failed",
        });
      }
      let { storeId, lines } = validationResult.data;
      storeId = sanitizeStoreId(storeId);
      validateStoreIdOrThrow(storeId);
      ensureStoreConfig(storeId);
      if (lines) {
        lines = lines.map(
          (line: {
            merchandiseId: string;
            quantity: number;
            attributes?: Array<{ key: string; value: string }>;
          }) => ({
            ...line,
            attributes: line.attributes ? sanitizeAttributes(line.attributes) : undefined,
          })
        );
      }
      let cart;
      try {
        cart = await createCartWithStorefront(storeId, lines);
      } catch (error) {
        if (error instanceof Error)
          throw shopifyApiError(`Failed to create cart: ${error.message}`, 502);
        throw shopifyApiError("Failed to create cart", 502);
      }
      setCookie(res, CART_ID_COOKIE, cart.id, { maxAge: 30 * 24 * 60 * 60 });
      sendSuccess(res, { cartId: cart.id, cart }, 201);
    },
  })
);
app.all(
  "/api/cart",
  run((req, res) => cartHandler(...asVercel(req, res)))
);

// --- Cart lines ---
const cartLinesHandler = applyRateLimit(
  "cart-lines",
  withRouteHandler({
    PATCH: async (req: VercelRequest, res: VercelResponse) => {
      const cartId = getCookie(req, CART_ID_COOKIE);
      if (!cartId) throw notFoundError("Cart", "Cart ID not found in cookie");
      const validationResult = UpdateCartLinesRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw validationError("Invalid request", {
          field: validationResult.error.errors[0]?.path?.join(".") ?? "unknown",
          reason: validationResult.error.errors[0]?.message ?? "Validation failed",
        });
      }
      const { operation, lines } = validationResult.data;
      let storeId = req.body?.storeId ?? req.headers["x-store-id"];
      if (!storeId || typeof storeId !== "string") {
        throw validationError("Store ID is required", {
          field: "storeId",
          reason: "Store ID must be provided in request body or X-Store-ID header",
        });
      }
      storeId = sanitizeStoreId(storeId);
      validateStoreIdOrThrow(storeId);
      ensureStoreConfig(storeId);
      let cart;
      try {
        switch (operation) {
          case "add": {
            if (!Array.isArray(lines) || lines.length === 0)
              throw validationError("Lines array is required for add operation");
            const addLines = lines as Array<{
              merchandiseId: string;
              quantity: number;
              attributes?: Array<{ key: string; value: string }>;
            }>;
            const sanitizedLines = addLines.map((line) => ({
              ...line,
              attributes: line.attributes ? sanitizeAttributes(line.attributes) : undefined,
            }));
            cart = await addLinesToCart(storeId, cartId, sanitizedLines);
            break;
          }
          case "update": {
            if (!Array.isArray(lines) || lines.length === 0)
              throw validationError("Lines array is required for update operation");
            const updateLines = lines as Array<{
              id: string;
              quantity: number;
              attributes?: Array<{ key: string; value: string }>;
            }>;
            const sanitizedLines = updateLines.map((line) => ({
              ...line,
              attributes: line.attributes ? sanitizeAttributes(line.attributes) : undefined,
            }));
            cart = await updateLinesInCart(storeId, cartId, sanitizedLines);
            break;
          }
          case "remove": {
            if (!Array.isArray(lines) || lines.length === 0)
              throw validationError("Line IDs array is required for remove operation");
            cart = await removeLinesFromCart(storeId, cartId, lines as string[]);
            break;
          }
          default:
            throw validationError(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        if (error instanceof Error)
          throw new ApiError(
            "SHOPIFY_API_ERROR",
            `Failed to ${operation} cart lines: ${error.message}`,
            502
          );
        throw new ApiError("SHOPIFY_API_ERROR", `Failed to ${operation} cart lines`, 502);
      }
      sendSuccess(res, { cart });
    },
  })
);
app.all(
  "/api/cart/lines",
  run((req, res) => cartLinesHandler(...asVercel(req, res)))
);

// --- Checkout ---
const checkoutHandler = applyRateLimit(
  "checkout",
  withRouteHandler({
    POST: async (req: VercelRequest, res: VercelResponse) => {
      const cartId = getCookie(req, CART_ID_COOKIE);
      if (!cartId) throw notFoundError("Cart", "Cart ID not found in cookie");
      const validationResult = CheckoutRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw validationError("Invalid request", {
          field: validationResult.error.errors[0]?.path?.join(".") ?? "unknown",
          reason: validationResult.error.errors[0]?.message ?? "Validation failed",
        });
      }
      let { storeId, discountCode, customerEmail } = validationResult.data;
      storeId = sanitizeStoreId(storeId);
      validateStoreIdOrThrow(storeId);
      ensureStoreConfig(storeId);
      if (discountCode) discountCode = discountCode.trim().toUpperCase().substring(0, 50);
      if (customerEmail) customerEmail = sanitizeEmail(customerEmail);
      let checkoutData;
      try {
        checkoutData = await createCheckoutUrl(storeId, cartId, discountCode);
      } catch (error) {
        if (error instanceof Error) throw new Error(`Failed to create checkout: ${error.message}`);
        throw new Error("Failed to create checkout");
      }
      sendSuccess(res, {
        checkoutUrl: checkoutData.checkoutUrl,
        checkoutId: checkoutData.checkoutId,
        customerEmail: customerEmail || undefined,
      });
    },
  })
);
app.all(
  "/api/checkout",
  run((req, res) => checkoutHandler(...asVercel(req, res)))
);

// --- Orders files (list + create) ---
const ordersFilesHandler = applyRateLimit(
  "orders-files",
  withRouteHandler({
    POST: async (req: VercelRequest, res: VercelResponse) => {
      const validationResult = CreateOrderFileRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw validationError("Invalid request", {
          field: validationResult.error.errors[0]?.path?.join(".") ?? "unknown",
          reason: validationResult.error.errors[0]?.message ?? "Validation failed",
        });
      }
      const data = validationResult.data;
      if (!isValidShopifyOrderId(data.orderId)) {
        throw validationError("Invalid order ID format", {
          field: "orderId",
          reason: "Order ID must be numeric or Shopify GID format",
        });
      }
      const siteId = sanitizeStoreId(data.siteId);
      const file = await createOrderFile({ ...data, siteId });
      sendSuccess(res, { file }, 201);
    },
    GET: async (req: VercelRequest, res: VercelResponse) => {
      const orderId = req.query.orderId as string;
      const siteId = req.query.siteId as string;
      if (!orderId)
        throw validationError("Order ID is required", {
          field: "orderId",
          reason: "orderId query parameter is required",
        });
      if (!siteId)
        throw validationError("Site ID is required", {
          field: "siteId",
          reason: "siteId query parameter is required",
        });
      if (!isValidShopifyOrderId(orderId)) {
        throw validationError("Invalid order ID format", {
          field: "orderId",
          reason: "Order ID must be numeric or Shopify GID format",
        });
      }
      const sanitizedSiteId = sanitizeStoreId(siteId);
      const files = await getOrderFiles(orderId, sanitizedSiteId);
      sendSuccess(res, { files, count: files.length });
    },
  })
);
app.all(
  "/api/orders/files",
  run((req, res) => ordersFilesHandler(...asVercel(req, res)))
);

// --- Order file by ID ---
const orderFileByIdHandler = applyRateLimit(
  "orders-files",
  withRouteHandler({
    GET: async (req: VercelRequest, res: VercelResponse) => {
      const fileId = (req as express.Request).params?.id ?? (req.query.id as string);
      const siteId = req.query.siteId as string;
      if (!fileId)
        throw validationError("File ID is required", {
          field: "id",
          reason: "File ID parameter is required",
        });
      if (!siteId)
        throw validationError("Site ID is required", {
          field: "siteId",
          reason: "siteId query parameter is required",
        });
      const sanitizedSiteId = sanitizeStoreId(siteId);
      const file = await getOrderFileById(fileId, sanitizedSiteId);
      if (!file) throw notFoundError("Order file", fileId);
      sendSuccess(res, { file });
    },
  })
);
app.all(
  "/api/orders/files/:id",
  run((req, res) => {
    const vercelReq = req as unknown as VercelRequest;
    vercelReq.query = { ...req.query, id: req.params.id ?? "" };
    return orderFileByIdHandler(vercelReq, res as unknown as VercelResponse);
  })
);

// 404 for unknown paths
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Not found" } });
});

export default (req: VercelRequest, res: VercelResponse) =>
  app(req as unknown as express.Request, res as unknown as express.Response);
