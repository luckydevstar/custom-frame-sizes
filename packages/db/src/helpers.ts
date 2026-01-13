/**
 * Database Helpers
 *
 * Utility functions for common database operations with siteId filtering.
 */

import { eq, and, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

/**
 * Site ID type
 */
export type SiteId = string;

/**
 * Add siteId filter to a query condition
 * Generic helper for adding siteId filter to any query
 *
 * @param siteIdColumn Site ID column from table schema
 * @param siteId Site ID value to filter by
 * @param existingCondition Existing WHERE condition (optional)
 * @returns Combined condition with siteId filter
 */
export function withSiteIdFilter<T extends SQL>(
  siteIdColumn: PgColumn,
  siteId: SiteId,
  existingCondition?: T
): SQL {
  const siteIdCondition = eq(siteIdColumn, siteId);
  if (existingCondition) {
    return and(siteIdCondition, existingCondition) as SQL;
  }
  return siteIdCondition as SQL;
}

/**
 * Validate siteId is provided
 *
 * @param siteId Site ID to validate
 * @throws Error if siteId is not provided
 */
export function validateSiteId(siteId: SiteId | undefined | null): asserts siteId is SiteId {
  if (!siteId) {
    throw new Error("siteId is required for multi-tenant operations");
  }
}

/**
 * Get siteId from environment or context
 *
 * @returns Site ID from environment variable
 * @throws Error if SITE_ID is not set
 */
export function getSiteIdFromEnv(): SiteId {
  const siteId = process.env.SITE_ID;
  if (!siteId) {
    throw new Error("SITE_ID environment variable is required");
  }
  return siteId;
}
