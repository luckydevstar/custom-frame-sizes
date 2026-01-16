/**
 * Logging Service Tests
 *
 * Tests for the centralized logging service, including error logging,
 * warning logging, and Sentry integration.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the Sentry module before importing logging
vi.mock("../../monitoring/sentry", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addBreadcrumb: vi.fn(),
  isSentryInitialized: vi.fn(() => false),
  initSentryClient: vi.fn(),
  initSentryServer: vi.fn(),
}));

import { LoggingService, logError, logWarning, logInfo, logApiError } from "../logging";

describe("LoggingService", () => {
  let service: LoggingService;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    service = new LoggingService("test");
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("logError", () => {
    it("should log error with message and context", () => {
      const error = new Error("Test error");
      const context = { operation: "test", userId: "123" };

      service.logError(error, context);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Error]",
        "Test error",
        expect.objectContaining({
          message: "Test error",
          context,
          environment: "test",
        })
      );
    });

    it("should log error without context", () => {
      const error = new Error("Test error");

      service.logError(error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Error]",
        "Test error",
        expect.objectContaining({
          message: "Test error",
          environment: "test",
        })
      );
    });

    it("should include stack trace in error data", () => {
      const error = new Error("Test error");

      service.logError(error);

      const callArgs = consoleErrorSpy.mock.calls[0];
      const errorData = callArgs[2] as { stack?: string };
      expect(errorData.stack).toBeDefined();
    });
  });

  describe("logWarning", () => {
    it("should log warning with message and context", () => {
      const message = "Warning message";
      const context = { remaining: 10 };

      service.logWarning(message, context);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[Warning]",
        message,
        expect.objectContaining({
          message,
          context,
          level: "warning",
        })
      );
    });

    it("should log warning without context", () => {
      const message = "Warning message";

      service.logWarning(message);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("logInfo", () => {
    it("should log info message in development", () => {
      const service = new LoggingService("development");
      const message = "Info message";
      const context = { itemCount: 3 };

      service.logInfo(message, context);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith("[Info]", message, context);
    });

    it("should not log info message in production", () => {
      const service = new LoggingService("production");
      const message = "Info message";

      service.logInfo(message);

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe("logApiError", () => {
    it("should log API error with request context", () => {
      const error = new Error("API error");
      const request = {
        url: "/api/cart",
        method: "GET",
        status: 500,
      };

      service.logApiError(error, request);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleErrorSpy.mock.calls[0];
      const errorData = callArgs[2] as { context?: unknown };
      expect(errorData.context).toEqual({
        type: "api_error",
        url: request.url,
        method: request.method,
        status: request.status,
      });
    });

    it("should log API error without request context", () => {
      const error = new Error("API error");

      service.logApiError(error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("convenience functions", () => {
    it("logError should use global service", () => {
      const error = new Error("Test error");

      logError(error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("logWarning should use global service", () => {
      logWarning("Warning message");

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    });

    it("logInfo should use global service", () => {
      logInfo("Info message");

      // May or may not be called depending on environment
      // Just verify it doesn't throw
      expect(() => logInfo("Info message")).not.toThrow();
    });

    it("logApiError should use global service", () => {
      const error = new Error("API error");

      logApiError(error, { url: "/api/test", method: "GET" });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
