/**
 * Route Handler Wrapper
 *
 * Provides consistent error handling, logging, and response formatting
 * for all API route handlers.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

export interface RouteHandlers {
  GET?: (req: VercelRequest, res: VercelResponse) => Promise<void> | void;
  POST?: (req: VercelRequest, res: VercelResponse) => Promise<void> | void;
  PATCH?: (req: VercelRequest, res: VercelResponse) => Promise<void> | void;
  PUT?: (req: VercelRequest, res: VercelResponse) => Promise<void> | void;
  DELETE?: (req: VercelRequest, res: VercelResponse) => Promise<void> | void;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Wraps route handlers with consistent error handling and logging
 */
export function withRouteHandler(handlers: RouteHandlers) {
  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    const method = req.method as keyof RouteHandlers;
    const handler = handlers[method];

    if (!handler) {
      res.status(405).json({
        success: false,
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: `Method ${method} not allowed`,
        },
      } satisfies ApiResponse);
      return;
    }

    try {
      // Log request
      console.log(`[${method}] ${req.url}`, {
        headers: {
          "user-agent": req.headers["user-agent"],
          "content-type": req.headers["content-type"],
        },
      });

      // Execute handler
      await handler(req, res);
    } catch (error) {
      // Log error
      console.error(`[${method}] ${req.url} - Error:`, error);

      // Send error response
      const statusCode = error instanceof ApiError ? error.statusCode : 500;
      const errorResponse: ApiResponse = {
        success: false,
        error: {
          code: error instanceof ApiError ? error.code : "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "An unexpected error occurred",
          details:
            process.env.NODE_ENV === "development" && error instanceof Error
              ? { stack: error.stack }
              : undefined,
        },
      };

      res.status(statusCode).json(errorResponse);
    }
  };
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Helper to send success response
 */
export function sendSuccess<T>(res: VercelResponse, data: T, statusCode: number = 200): void {
  res.status(statusCode).json({
    success: true,
    data,
  } satisfies ApiResponse<T>);
}

/**
 * Helper to send error response
 */
export function sendError(
  res: VercelResponse,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: unknown
): void {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
  } satisfies ApiResponse);
}
