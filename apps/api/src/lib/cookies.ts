/**
 * Cookie Utilities
 *
 * Helper functions for managing HTTP-only cookies for cart sessions.
 */

import type { VercelResponse } from "@vercel/node";
import { parse } from "cookie";

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  maxAge?: number;
  path?: string;
}

const DEFAULT_COOKIE_OPTIONS: Required<CookieOptions> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  path: "/",
};

/**
 * Set HTTP-only cookie
 */
export function setCookie(
  res: VercelResponse,
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  const opts = { ...DEFAULT_COOKIE_OPTIONS, ...options };

  const cookieParts: string[] = [`${name}=${value}`];

  if (opts.maxAge) {
    cookieParts.push(`Max-Age=${opts.maxAge}`);
  }

  if (opts.path) {
    cookieParts.push(`Path=${opts.path}`);
  }

  if (opts.httpOnly) {
    cookieParts.push("HttpOnly");
  }

  if (opts.secure) {
    cookieParts.push("Secure");
  }

  if (opts.sameSite) {
    cookieParts.push(`SameSite=${opts.sameSite}`);
  }

  res.setHeader("Set-Cookie", cookieParts.join("; "));
}

/**
 * Get cookie value from request
 */
export function getCookie(req: { headers: { cookie?: string } }, name: string): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = parse(cookieHeader);
  return cookies[name] || null;
}

/**
 * Delete cookie
 */
export function deleteCookie(res: VercelResponse, name: string, path: string = "/"): void {
  res.setHeader(
    "Set-Cookie",
    [`${name}=`, "Max-Age=0", `Path=${path}`, "HttpOnly", "Secure", "SameSite=Strict"].join("; ")
  );
}

/**
 * Cart ID cookie name
 */
export const CART_ID_COOKIE = "cart_id";
