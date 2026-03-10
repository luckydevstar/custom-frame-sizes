/**
 * Input Sanitization Utilities
 *
 * Sanitizes user input to prevent XSS, SQL injection, and other security issues.
 */

/**
 * Remove HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}

/**
 * Remove SQL injection patterns
 * Note: This is a basic check. Parameterized queries should always be used.
 */
export function sanitizeSqlInput(input: string): string {
  // Remove common SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
    // eslint-disable-next-line no-useless-escape
    /('|(\\')|(;)|(--)|(\/\*)|(\*\/)|(\+)|(%27)|(%22))/gi,
  ];

  let sanitized = input;
  for (const pattern of sqlPatterns) {
    sanitized = sanitized.replace(pattern, "");
  }

  return sanitized.trim();
}

/**
 * Sanitize string input (general purpose)
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  // Trim whitespace
  let sanitized = input.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, "");

  // Remove control characters (except newlines and tabs)
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");

  return sanitized;
}

/**
 * Sanitize attribute key
 */
export function sanitizeAttributeKey(key: string): string {
  // Remove HTML, SQL patterns, and control chars
  let sanitized = stripHtml(key);
  sanitized = sanitizeSqlInput(sanitized);
  sanitized = sanitizeString(sanitized, 100);

  // Only allow alphanumeric, hyphens, underscores, and spaces
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s_-]/g, "");

  return sanitized.trim();
}

/**
 * Sanitize attribute value
 */
export function sanitizeAttributeValue(value: string): string {
  // Remove HTML tags but keep text content
  let sanitized = stripHtml(value);
  sanitized = sanitizeString(sanitized, 1000);

  // Escape HTML to prevent XSS
  sanitized = escapeHtml(sanitized);

  return sanitized;
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  // Basic email sanitization (validation should be done separately)
  return email
    .trim()
    .toLowerCase()
    .replace(/[^\w@.-]/g, "");
}

/**
 * Sanitize store ID
 */
export function sanitizeStoreId(storeId: string): string {
  // Only allow alphanumeric, hyphens, underscores
  return storeId.replace(/[^a-zA-Z0-9_-]/g, "").substring(0, 50);
}

/**
 * Sanitize variant ID (Shopify GID)
 */
export function sanitizeVariantId(variantId: string): string {
  // GID format: gid://shopify/ProductVariant/ID
  // Only allow valid GID characters
  // eslint-disable-next-line no-useless-escape
  return variantId.replace(/[^gid:\/\/shopify\/ProductVariant\/0-9]/g, "");
}

/**
 * Sanitize cart line attributes
 */
export function sanitizeAttributes(
  attributes: Array<{ key: string; value: string }>
): Array<{ key: string; value: string }> {
  return attributes.map((attr) => ({
    key: sanitizeAttributeKey(attr.key),
    value: sanitizeAttributeValue(attr.value),
  }));
}

/**
 * Sanitize object recursively (for nested objects)
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T, maxDepth: number = 5): T {
  if (maxDepth <= 0) {
    return obj;
  }

  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value) as T[Extract<keyof T, string>];
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string"
          ? sanitizeString(item)
          : typeof item === "object" && item !== null
            ? sanitizeObject(item as Record<string, unknown>, maxDepth - 1)
            : item
      ) as T[Extract<keyof T, string>];
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>, maxDepth - 1) as T[Extract<
        keyof T,
        string
      >];
    }
  }

  return sanitized;
}
