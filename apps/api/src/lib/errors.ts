/**
 * API Error Codes and Utilities
 */

import { ApiError } from "./route-handler";

/**
 * Standard API error codes
 */
export const ErrorCodes = {
  // Validation errors (400)
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_REQUEST: "INVALID_REQUEST",
  MISSING_FIELD: "MISSING_FIELD",

  // Authentication errors (401)
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_SESSION: "INVALID_SESSION",

  // Not found errors (404)
  CART_NOT_FOUND: "CART_NOT_FOUND",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",

  // Business logic errors (400)
  INVALID_VARIANT_ID: "INVALID_VARIANT_ID",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  INVALID_QUANTITY: "INVALID_QUANTITY",

  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

  // Shopify API errors (502/503)
  SHOPIFY_API_ERROR: "SHOPIFY_API_ERROR",
  SHOPIFY_RATE_LIMIT: "SHOPIFY_RATE_LIMIT",
  SHOPIFY_UNAVAILABLE: "SHOPIFY_UNAVAILABLE",

  // Server errors (500)
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Create validation error
 */
export function validationError(
  message: string,
  details?: { field?: string; reason?: string }
): ApiError {
  return new ApiError(ErrorCodes.VALIDATION_ERROR, message, 400, details);
}

/**
 * Create not found error
 */
export function notFoundError(resource: string, id?: string): ApiError {
  return new ApiError(
    ErrorCodes.RESOURCE_NOT_FOUND,
    `${resource} not found${id ? `: ${id}` : ""}`,
    404
  );
}

/**
 * Create unauthorized error
 */
export function unauthorizedError(message: string = "Unauthorized"): ApiError {
  return new ApiError(ErrorCodes.UNAUTHORIZED, message, 401);
}

/**
 * Create Shopify API error
 */
export function shopifyApiError(message: string, statusCode: number = 502): ApiError {
  return new ApiError(ErrorCodes.SHOPIFY_API_ERROR, message, statusCode);
}
