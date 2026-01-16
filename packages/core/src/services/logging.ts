/**
 * Centralized Logging Service
 *
 * Unified interface for logging errors, warnings, and info messages.
 * Supports Sentry integration for production error tracking.
 *
 * @packageDocumentation
 */

/**
 * Log context with additional metadata
 */
export interface LogContext {
  [key: string]: unknown;
}

/**
 * Sentry configuration (internal use)
 * Public SentryConfig is exported from @framecraft/core/monitoring
 */
interface SentryConfig {
  dsn?: string;
  environment?: string;
  enabled?: boolean;
}

/**
 * Error data structure
 */
export interface ErrorData {
  message: string;
  stack?: string;
  context?: LogContext;
  timestamp: string;
  environment: string;
}

/**
 * Logging service for error tracking and monitoring
 *
 * Provides:
 * - Console logging (always enabled)
 * - Sentry integration (optional, production)
 * - Local storage for debugging (development only)
 *
 * @example
 * ```typescript
 * import { logError, logWarning, logInfo } from '@framecraft/core/services';
 *
 * try {
 *   // Some operation
 * } catch (error) {
 *   logError(error as Error, { operation: 'checkout' });
 * }
 * ```
 */
export class LoggingService {
  private sentryEnabled: boolean = false;
  private environment: string;

  constructor(environment: string = "development") {
    this.environment = environment;
  }

  /**
   * Initialize Sentry error tracking
   * Stub implementation - add actual Sentry SDK in production
   *
   * @param config - Sentry configuration
   */
  initSentry(config: SentryConfig): void {
    try {
      // TODO: Install @sentry/react or @sentry/node package and initialize
      // For client-side:
      // import * as Sentry from '@sentry/react';
      // Sentry.init({
      //   dsn: config.dsn,
      //   environment: config.environment,
      //   tracesSampleRate: 1.0,
      // });
      //
      // For server-side:
      // import * as Sentry from '@sentry/node';
      // Sentry.init({
      //   dsn: config.dsn,
      //   environment: config.environment,
      //   tracesSampleRate: 1.0,
      // });

      this.sentryEnabled = true;
      console.log("[Logging] Sentry initialized", { environment: config.environment });
    } catch (error) {
      console.error("[Logging] Failed to initialize Sentry", error);
      this.sentryEnabled = false;
    }
  }

  /**
   * Log an error with context
   *
   * @param error - Error object
   * @param context - Additional context data
   */
  logError(error: Error, context?: LogContext): void {
    const errorData: ErrorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      environment: this.environment,
    };

    // Console logging (always enabled)
    console.error("[Error]", error.message, errorData);

    // Send to Sentry in production
    if (this.sentryEnabled) {
      // TODO: Sentry.captureException(error, { extra: context });
      // Note: Uncomment when Sentry SDK is installed
    }

    // Store in local storage for debugging (development only, browser only)
    if (this.environment === "development" && typeof window !== "undefined") {
      this.storeLocalError(errorData);
    }
  }

  /**
   * Log a warning message
   *
   * @param message - Warning message
   * @param context - Additional context data
   */
  logWarning(message: string, context?: LogContext): void {
    const warningData = {
      message,
      context,
      timestamp: new Date().toISOString(),
      level: "warning" as const,
    };

    console.warn("[Warning]", message, warningData);

    if (this.sentryEnabled) {
      // TODO: Sentry.captureMessage(message, 'warning');
      // Note: Uncomment when Sentry SDK is installed
    }
  }

  /**
   * Log informational message
   *
   * @param message - Info message
   * @param context - Additional context data
   */
  logInfo(message: string, context?: LogContext): void {
    // Info logging only in development
    if (this.environment === "development") {
      console.log("[Info]", message, context);
    }

    // Stub for Sentry breadcrumbs
    if (this.sentryEnabled) {
      // TODO: Sentry.addBreadcrumb({ message, data: context, level: 'info' });
      // Note: Uncomment when Sentry SDK is installed
    }
  }

  /**
   * Log API/fetch errors with request context
   *
   * @param error - Error object
   * @param request - Request details (url, method, status)
   */
  logApiError(error: Error, request?: { url: string; method: string; status?: number }): void {
    this.logError(error, {
      type: "api_error",
      url: request?.url,
      method: request?.method,
      status: request?.status,
    });
  }

  /**
   * Store error in localStorage for debugging (browser only)
   *
   * @param errorData - Error data to store
   */
  private storeLocalError(errorData: ErrorData): void {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    try {
      const errors = JSON.parse(localStorage.getItem("app_errors") || "[]");
      errors.push(errorData);

      // Keep only last 10 errors
      const recentErrors = errors.slice(-10);
      localStorage.setItem("app_errors", JSON.stringify(recentErrors));
    } catch (e) {
      // Ignore storage errors
      console.warn("[Logging] Failed to store error locally", e);
    }
  }

  /**
   * Get stored errors (development only, browser only)
   *
   * @returns Array of stored error data
   */
  getStoredErrors(): ErrorData[] {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }

    try {
      return JSON.parse(localStorage.getItem("app_errors") || "[]");
    } catch {
      return [];
    }
  }

  /**
   * Clear stored errors (development only, browser only)
   */
  clearStoredErrors(): void {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    localStorage.removeItem("app_errors");
  }
}

/**
 * Global logging service instance
 * Environment is determined at runtime
 */
function createLoggingService(): LoggingService {
  // Determine environment
  let environment = "development";

  // Try to detect environment from various sources
  if (typeof process !== "undefined" && process.env.NODE_ENV) {
    environment = process.env.NODE_ENV;
  } else if (
    typeof window !== "undefined" &&
    (window as unknown as { __ENV__?: { NODE_ENV?: string } }).__ENV__
  ) {
    environment =
      (window as unknown as { __ENV__: { NODE_ENV: string } }).__ENV__.NODE_ENV || "development";
  }

  const service = new LoggingService(environment);

  // Initialize Sentry if configured
  if (typeof process !== "undefined") {
    // Server-side
    const sentryDsn = process.env.SENTRY_DSN;
    if (sentryDsn && environment === "production") {
      service.initSentry({ dsn: sentryDsn, environment });
    }
  } else if (typeof window !== "undefined") {
    // Client-side
    const sentryDsn = (window as unknown as { __ENV__?: { SENTRY_DSN?: string } }).__ENV__
      ?.SENTRY_DSN;
    if (sentryDsn && environment === "production") {
      service.initSentry({ dsn: sentryDsn, environment });
    }
  }

  return service;
}

/**
 * Global logging service instance
 */
export const loggingService = createLoggingService();

/**
 * Log an error with context
 * Convenience function that uses the global logging service
 *
 * @param error - Error object
 * @param context - Additional context data
 *
 * @example
 * ```typescript
 * import { logError } from '@framecraft/core/services';
 *
 * try {
 *   await someOperation();
 * } catch (error) {
 *   logError(error as Error, { operation: 'checkout', userId: '123' });
 * }
 * ```
 */
export function logError(error: Error, context?: LogContext): void {
  loggingService.logError(error, context);
}

/**
 * Log a warning message
 * Convenience function that uses the global logging service
 *
 * @param message - Warning message
 * @param context - Additional context data
 *
 * @example
 * ```typescript
 * import { logWarning } from '@framecraft/core/services';
 *
 * logWarning('Rate limit approaching', { remaining: 10 });
 * ```
 */
export function logWarning(message: string, context?: LogContext): void {
  loggingService.logWarning(message, context);
}

/**
 * Log informational message
 * Convenience function that uses the global logging service
 *
 * @param message - Info message
 * @param context - Additional context data
 *
 * @example
 * ```typescript
 * import { logInfo } from '@framecraft/core/services';
 *
 * logInfo('Cart updated', { itemCount: 3 });
 * ```
 */
export function logInfo(message: string, context?: LogContext): void {
  loggingService.logInfo(message, context);
}

/**
 * Log API/fetch errors with request context
 * Convenience function that uses the global logging service
 *
 * @param error - Error object
 * @param request - Request details (url, method, status)
 *
 * @example
 * ```typescript
 * import { logApiError } from '@framecraft/core/services';
 *
 * try {
 *   const response = await fetch('/api/cart');
 *   if (!response.ok) throw new Error('Request failed');
 * } catch (error) {
 *   logApiError(error as Error, { url: '/api/cart', method: 'GET', status: 500 });
 * }
 * ```
 */
export function logApiError(
  error: Error,
  request?: { url: string; method: string; status?: number }
): void {
  loggingService.logApiError(error, request);
}
