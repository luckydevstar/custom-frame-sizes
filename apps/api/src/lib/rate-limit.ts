/**
 * Rate Limiting Utilities
 *
 * In-memory rate limiting for API endpoints.
 * For production, consider using Vercel Edge Config or Redis.
 */

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number;

  /**
   * Time window in seconds
   */
  window: number;

  /**
   * Identifier for rate limiting (e.g., IP address, user ID)
   */
  identifier: string;
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;

  /**
   * Number of requests remaining in current window
   */
  remaining: number;

  /**
   * Total limit
   */
  limit: number;

  /**
   * Unix timestamp when the rate limit resets
   */
  reset: number;

  /**
   * Seconds until reset
   */
  retryAfter?: number;
}

/**
 * In-memory rate limit store
 * Key: identifier:endpoint
 * Value: { count: number, resetAt: number }
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Get client identifier from request
 */
export function getClientIdentifier(req: {
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
}): string {
  // Try to get IP from various headers (for proxies)
  const forwardedFor = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];
  const cfConnectingIp = req.headers["cf-connecting-ip"];

  let ip: string | undefined;

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    ip = forwardedFor.split(",")[0]?.trim();
  } else if (typeof realIp === "string" && realIp.length > 0) {
    ip = realIp;
  } else if (typeof cfConnectingIp === "string" && cfConnectingIp.length > 0) {
    ip = cfConnectingIp;
  } else if (req.ip) {
    ip = req.ip;
  }

  // Fallback to a default identifier if IP cannot be determined
  return ip || "unknown";
}

/**
 * Check rate limit for a request
 *
 * @param config - Rate limit configuration
 * @param endpoint - Endpoint identifier (e.g., "cart", "checkout")
 * @returns Rate limit result
 */
export function checkRateLimit(config: RateLimitConfig, endpoint: string): RateLimitResult {
  const key = `${config.identifier}:${endpoint}`;
  const now = Date.now();
  const windowMs = config.window * 1000;

  const entry = rateLimitStore.get(key);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.limit - 1,
      limit: config.limit,
      reset: Math.floor(resetAt / 1000),
    };
  }

  // Increment count
  entry.count += 1;

  // Check if limit exceeded
  if (entry.count > config.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      limit: config.limit,
      reset: Math.floor(entry.resetAt / 1000),
      retryAfter,
    };
  }

  return {
    allowed: true,
    remaining: config.limit - entry.count,
    limit: config.limit,
    reset: Math.floor(entry.resetAt / 1000),
  };
}

/**
 * Rate limit configuration per endpoint
 */
export const RATE_LIMIT_CONFIGS: Record<string, { limit: number; window: number }> = {
  cart: {
    limit: 10, // 10 requests
    window: 60, // per minute
  },
  "cart-lines": {
    limit: 30, // 30 requests
    window: 60, // per minute
  },
  checkout: {
    limit: 5, // 5 requests
    window: 60, // per minute
  },
  "orders-files": {
    limit: 20, // 20 requests
    window: 60, // per minute
  },
};

/**
 * Get rate limit config for endpoint
 */
export function getRateLimitConfig(endpoint: string): { limit: number; window: number } {
  return (
    RATE_LIMIT_CONFIGS[endpoint] || {
      limit: 10,
      window: 60,
    }
  );
}
