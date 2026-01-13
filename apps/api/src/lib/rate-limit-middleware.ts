/**
 * Rate Limiting Middleware
 *
 * Middleware function to apply rate limiting to route handlers.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkRateLimit, getClientIdentifier, getRateLimitConfig } from "./rate-limit";
import { sendError } from "./route-handler";
import { ErrorCodes } from "./errors";

/**
 * Rate limit middleware
 *
 * @param endpoint - Endpoint identifier for rate limit config
 * @returns Middleware function
 */
export function withRateLimit(endpoint: string) {
  return (req: VercelRequest, res: VercelResponse, next: () => void): void => {
    const identifier = getClientIdentifier(req);
    const config = getRateLimitConfig(endpoint);

    const result = checkRateLimit(
      {
        limit: config.limit,
        window: config.window,
        identifier,
      },
      endpoint
    );

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", result.limit.toString());
    res.setHeader("X-RateLimit-Remaining", result.remaining.toString());
    res.setHeader("X-RateLimit-Reset", result.reset.toString());

    if (!result.allowed) {
      // Log rate limit violation
      console.warn(`[Rate Limit] Exceeded for ${identifier} on ${endpoint}`);

      // Send rate limit error
      sendError(
        res,
        ErrorCodes.RATE_LIMIT_EXCEEDED,
        "Too many requests. Please try again later.",
        429,
        {
          retryAfter: result.retryAfter,
        }
      );
      return;
    }

    // Continue to next handler
    next();
  };
}

/**
 * Apply rate limiting to route handler
 *
 * @param endpoint - Endpoint identifier
 * @param handler - Route handler function
 * @returns Wrapped handler with rate limiting
 */
export function applyRateLimit<
  T extends (req: VercelRequest, res: VercelResponse) => Promise<void> | void,
>(endpoint: string, handler: T): T {
  return ((req: VercelRequest, res: VercelResponse) => {
    const identifier = getClientIdentifier(req);
    const config = getRateLimitConfig(endpoint);

    const result = checkRateLimit(
      {
        limit: config.limit,
        window: config.window,
        identifier,
      },
      endpoint
    );

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", result.limit.toString());
    res.setHeader("X-RateLimit-Remaining", result.remaining.toString());
    res.setHeader("X-RateLimit-Reset", result.reset.toString());

    if (!result.allowed) {
      console.warn(`[Rate Limit] Exceeded for ${identifier} on ${endpoint}`);
      sendError(
        res,
        ErrorCodes.RATE_LIMIT_EXCEEDED,
        "Too many requests. Please try again later.",
        429,
        {
          retryAfter: result.retryAfter,
        }
      );
      return;
    }

    // Execute handler
    return handler(req, res);
  }) as T;
}
