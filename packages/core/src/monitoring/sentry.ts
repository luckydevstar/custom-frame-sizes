/**
 * Sentry Error Monitoring Configuration
 *
 * Provides Sentry initialization for both client-side and server-side.
 * This module is a placeholder structure - actual Sentry SDK should be
 * installed and configured in production.
 *
 * @packageDocumentation
 */

/**
 * Sentry configuration options
 */
export interface SentryConfig {
  /** Sentry DSN (Data Source Name) */
  dsn: string;

  /** Environment (development, staging, production) */
  environment: string;

  /** Sample rate for traces (0.0 to 1.0) */
  tracesSampleRate?: number;

  /** Enable session replay (client-side only) */
  enableReplay?: boolean;

  /** Additional tags */
  tags?: Record<string, string>;

  /** Release version */
  release?: string;
}

/**
 * Initialize Sentry for client-side (React)
 *
 * @param config - Sentry configuration
 *
 * @example
 * ```typescript
 * import { initSentryClient } from '@framecraft/core/monitoring';
 *
 * if (import.meta.env.PROD) {
 *   initSentryClient({
 *     dsn: import.meta.env.VITE_SENTRY_DSN,
 *     environment: import.meta.env.MODE,
 *     tracesSampleRate: 1.0,
 *   });
 * }
 * ```
 */
export function initSentryClient(config: SentryConfig): void {
  try {
    // TODO: Install @sentry/react and uncomment
    // import * as Sentry from '@sentry/react';
    //
    // Sentry.init({
    //   dsn: config.dsn,
    //   environment: config.environment,
    //   tracesSampleRate: config.tracesSampleRate ?? 1.0,
    //   replaysSessionSampleRate: config.enableReplay ? 0.1 : 0,
    //   replaysOnErrorSampleRate: config.enableReplay ? 1.0 : 0,
    //   integrations: [
    //     Sentry.replayIntegration({
    //       maskAllText: true,
    //       blockAllMedia: true,
    //     }),
    //   ],
    //   tags: config.tags,
    //   release: config.release,
    // });

    console.log("[Sentry] Client-side Sentry initialized", {
      environment: config.environment,
      dsn: config.dsn ? "configured" : "missing",
    });
  } catch (error) {
    console.error("[Sentry] Failed to initialize client-side Sentry", error);
  }
}

/**
 * Initialize Sentry for server-side (Node.js/API)
 *
 * @param config - Sentry configuration
 *
 * @example
 * ```typescript
 * import { initSentryServer } from '@framecraft/core/monitoring';
 *
 * if (process.env.NODE_ENV === 'production') {
 *   initSentryServer({
 *     dsn: process.env.SENTRY_DSN,
 *     environment: process.env.NODE_ENV,
 *     tracesSampleRate: 0.1,
 *   });
 * }
 * ```
 */
export function initSentryServer(config: SentryConfig): void {
  try {
    // TODO: Install @sentry/node and uncomment
    // import * as Sentry from '@sentry/node';
    //
    // Sentry.init({
    //   dsn: config.dsn,
    //   environment: config.environment,
    //   tracesSampleRate: config.tracesSampleRate ?? 0.1,
    //   tags: config.tags,
    //   release: config.release,
    // });

    console.log("[Sentry] Server-side Sentry initialized", {
      environment: config.environment,
      dsn: config.dsn ? "configured" : "missing",
    });
  } catch (error) {
    console.error("[Sentry] Failed to initialize server-side Sentry", error);
  }
}

/**
 * Wrap an async function with Sentry error tracking
 *
 * @param fn - Function to wrap
 * @param context - Additional context for errors
 * @returns Wrapped function
 *
 * @example
 * ```typescript
 * import { withSentry } from '@framecraft/core/monitoring';
 *
 * const fetchData = withSentry(async (id: string) => {
 *   // Some async operation
 * }, { operation: 'fetchData' });
 * ```
 */
export function withSentry<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  _context?: Record<string, unknown> // Used in Sentry.captureException when Sentry is installed
): T {
  return (async (...args: Parameters<T>) => {
    // eslint-disable-next-line no-useless-catch
    try {
      return await fn(...args);
    } catch (error) {
      // TODO: When Sentry is installed, uncomment and remove throw:
      // import * as Sentry from '@sentry/node'; // or '@sentry/react'
      // Sentry.captureException(error, { extra: _context });
      // The catch block is needed for future Sentry integration
      throw error;
    }
  }) as T;
}

/**
 * Capture an exception manually
 *
 * @param error - Error to capture
 * @param context - Additional context
 *
 * @example
 * ```typescript
 * import { captureException } from '@framecraft/core/monitoring';
 *
 * try {
 *   await someOperation();
 * } catch (error) {
 *   captureException(error, { operation: 'checkout', userId: '123' });
 * }
 * ```
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  // TODO: When Sentry is installed, uncomment:
  // import * as Sentry from '@sentry/node'; // or '@sentry/react'
  // Sentry.captureException(error, { extra: context });
  console.error("[Sentry] Exception captured:", error, context);
}

/**
 * Capture a message manually
 *
 * @param message - Message to capture
 * @param level - Severity level
 * @param context - Additional context
 *
 * @example
 * ```typescript
 * import { captureMessage } from '@framecraft/core/monitoring';
 *
 * captureMessage('Rate limit exceeded', 'warning', { remaining: 0 });
 * ```
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: Record<string, unknown>
): void {
  // TODO: When Sentry is installed, uncomment:
  // import * as Sentry from '@sentry/node'; // or '@sentry/react'
  // Sentry.captureMessage(message, level, { extra: context });
  if (context) {
    console.log(`[Sentry] ${level.toUpperCase()}:`, message, context);
  } else {
    console.log(`[Sentry] ${level.toUpperCase()}:`, message);
  }
}
