/**
 * Database Connection
 *
 * Utilities for creating and managing database connections.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Database connection options
 */
export interface DatabaseConfig {
  /**
   * Database connection string
   */
  connectionString: string;

  /**
   * Maximum number of connections in pool
   */
  maxConnections?: number;

  /**
   * Connection timeout in milliseconds
   */
  connectionTimeout?: number;
}

/**
 * Create database connection
 *
 * @param config Database configuration
 * @returns Drizzle database instance
 */
export function createDatabase(config: DatabaseConfig) {
  const client = postgres(config.connectionString, {
    max: config.maxConnections ?? 10,
    idle_timeout: config.connectionTimeout ?? 20,
  });

  return drizzle(client, { schema });
}

/**
 * Get database connection from environment variables
 *
 * @returns Drizzle database instance
 * @throws Error if DATABASE_URL is not set
 */
export function getDatabaseFromEnv() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  return createDatabase({ connectionString });
}

/**
 * Type for database instance
 */
export type Database = ReturnType<typeof createDatabase>;
