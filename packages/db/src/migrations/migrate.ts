/**
 * Migration Runner
 *
 * Utility for running database migrations.
 */

import type { Database } from "../connection";
import { migrations } from "./index";

/**
 * Run a migration
 *
 * @param db Database instance
 * @param migrationName Migration name to run
 * @param direction 'up' or 'down'
 */
export async function runMigration(
  db: Database,
  migrationName: string,
  direction: "up" | "down" = "up"
): Promise<void> {
  const migration = migrations.find((m) => m.name === migrationName);
  if (!migration) {
    throw new Error(`Migration not found: ${migrationName}`);
  }

  const statements = direction === "up" ? migration.up : migration.down;

  for (const statement of statements) {
    await db.execute(statement);
  }
}

/**
 * Run all migrations in order
 *
 * @param db Database instance
 */
export async function runAllMigrations(db: Database): Promise<void> {
  for (const migration of migrations) {
    console.log(`Running migration: ${migration.name}`);
    await runMigration(db, migration.name, "up");
  }
}

/**
 * Rollback a migration
 *
 * @param db Database instance
 * @param migrationName Migration name to rollback
 */
export async function rollbackMigration(db: Database, migrationName: string): Promise<void> {
  await runMigration(db, migrationName, "down");
}
