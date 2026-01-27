/**
 * Sentry Error Monitoring Configuration
 *
 * Provides Sentry initialization for both client-side and server-side.
 * Includes full Sentry SDK integration for production error tracking.
 *
 * @packageDocumentation
 */

import * as SentryReact from "@sentry/react";
// Dynamic import for server-side Sentry to avoid bundling in client
let SentryNode: typeof import("@sentry/node") | null = null;
if (typeof window === "undefined") {
  // Only import on server-side
  try {
    SentryNode = require("@sentry/node");
  } catch {
    // @sentry/node not available (e.g., in client bundle)
    SentryNode = null;
  }
}

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

  /** Whether Sentry is enabled (default: true in production) */
  enabled?: boolean;
}

/** Track if Sentry is initialized */
let sentryInitialized = false;

/** Track if we're in browser or Node environment */
const isBrowser = typeof window !== "undefined";

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
  // Skip if already initialized or if DSN is not provided
  if (sentryInitialized || !config.dsn) {
    if (!config.dsn) {
      console.warn("[Sentry] DSN not provided, skipping initialization");
    }
    return;
  }

  // Check if enabled (default to true for production)
  const isEnabled = config.enabled ?? config.environment === "production";
  if (!isEnabled) {
    console.log("[Sentry] Disabled for environment:", config.environment);
    return;
  }

  try {
    SentryReact.init({
      dsn: config.dsn,
      environment: config.environment,
      tracesSampleRate: config.tracesSampleRate ?? 1.0,
      replaysSessionSampleRate: config.enableReplay ? 0.1 : 0,
      replaysOnErrorSampleRate: config.enableReplay ? 1.0 : 0,
      integrations: config.enableReplay
        ? [
            SentryReact.replayIntegration({
              maskAllText: true,
              blockAllMedia: true,
            }),
          ]
        : [],
      release: config.release,
      // Don't send events in development by default
      beforeSend: (event) => {
        if (config.environment === "development") {
          console.log("[Sentry] Would send event:", event);
          return null; // Don't actually send in development
        }
        return event;
      },
    });

    // Set additional tags if provided
    if (config.tags) {
      Object.entries(config.tags).forEach(([key, value]) => {
        SentryReact.setTag(key, value);
      });
    }

    sentryInitialized = true;
    console.log("[Sentry] Client-side Sentry initialized", {
      environment: config.environment,
      dsn: "configured",
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
  // Skip if already initialized or if DSN is not provided
  if (sentryInitialized || !config.dsn) {
    if (!config.dsn) {
      console.warn("[Sentry] DSN not provided, skipping initialization");
    }
    return;
  }

  // Check if enabled (default to true for production)
  const isEnabled = config.enabled ?? config.environment === "production";
  if (!isEnabled) {
    console.log("[Sentry] Disabled for environment:", config.environment);
    return;
  }

  if (!SentryNode) {
    console.warn("[Sentry] @sentry/node not available (client-side or not installed)");
    return;
  }

  try {
    SentryNode.init({
      dsn: config.dsn,
      environment: config.environment,
      tracesSampleRate: config.tracesSampleRate ?? 0.1,
      release: config.release,
      // Don't send events in development by default
      beforeSend: (event) => {
        if (config.environment === "development") {
          console.log("[Sentry] Would send event:", event);
          return null; // Don't actually send in development
        }
        return event;
      },
    });

    // Set additional tags if provided
    if (config.tags) {
      Object.entries(config.tags).forEach(([key, value]) => {
        SentryNode!.setTag(key, value);
      });
    }

    sentryInitialized = true;
    console.log("[Sentry] Server-side Sentry initialized", {
      environment: config.environment,
      dsn: "configured",
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
  context?: Record<string, unknown>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (sentryInitialized) {
        if (isBrowser) {
          SentryReact.captureException(error, { extra: context });
        } else if (SentryNode) {
          SentryNode.captureException(error, { extra: context });
        }
      }
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
  if (sentryInitialized) {
    if (isBrowser) {
      SentryReact.captureException(error, { extra: context });
    } else if (SentryNode) {
      SentryNode.captureException(error, { extra: context });
    }
  } else {
    // Fallback to console logging if Sentry is not initialized
    console.error(
      "[Sentry] Exception captured (not sent - Sentry not initialized):",
      error,
      context
    );
  }
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
  if (sentryInitialized) {
    if (isBrowser) {
      SentryReact.captureMessage(message, {
        level,
        extra: context,
      });
    } else if (SentryNode) {
      SentryNode.captureMessage(message, {
        level,
        extra: context,
      });
    }
  } else {
    // Fallback to console logging if Sentry is not initialized
    if (context) {
      console.log(`[Sentry] ${level.toUpperCase()} (not sent):`, message, context);
    } else {
      console.log(`[Sentry] ${level.toUpperCase()} (not sent):`, message);
    }
  }
}

/**
 * Set user information for Sentry
 *
 * @param user - User information
 *
 * @example
 * ```typescript
 * import { setUser } from '@framecraft/core/monitoring';
 *
 * setUser({ id: '123', email: 'user@example.com' });
 * ```
 */
export function setUser(user: { id?: string; email?: string; username?: string } | null): void {
  if (sentryInitialized) {
    if (isBrowser) {
      SentryReact.setUser(user);
    } else if (SentryNode) {
      SentryNode.setUser(user);
    }
  }
}

/**
 * Set a tag for all subsequent events
 *
 * @param key - Tag key
 * @param value - Tag value
 */
export function setTag(key: string, value: string): void {
  if (sentryInitialized) {
    if (isBrowser) {
      SentryReact.setTag(key, value);
    } else if (SentryNode) {
      SentryNode.setTag(key, value);
    }
  }
}

/**
 * Add breadcrumb for debugging
 *
 * @param breadcrumb - Breadcrumb data
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: "debug" | "info" | "warning" | "error";
  data?: Record<string, unknown>;
}): void {
  if (sentryInitialized) {
    if (isBrowser) {
      SentryReact.addBreadcrumb(breadcrumb);
    } else if (SentryNode) {
      SentryNode.addBreadcrumb(breadcrumb);
    }
  }
}

/**
 * Check if Sentry is initialized
 */
export function isSentryInitialized(): boolean {
  return sentryInitialized;
}

/**
 * Get React error boundary component (client-side only)
 * Returns null on server-side
 */
export function getSentryErrorBoundary(): typeof SentryReact.ErrorBoundary | null {
  if (isBrowser && sentryInitialized) {
    return SentryReact.ErrorBoundary;
  }
  return null;
}
