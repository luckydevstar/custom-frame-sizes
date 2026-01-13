/**
 * Database Migrations
 *
 * Migration utilities and scripts for database schema changes.
 */

/**
 * Migration metadata
 */
export interface Migration {
  /**
   * Migration name/identifier
   */
  name: string;

  /**
   * Migration description
   */
  description: string;

  /**
   * SQL statements to execute
   */
  up: string[];

  /**
   * SQL statements to rollback
   */
  down: string[];
}

/**
 * Add siteId columns migration
 * Adds siteId to mat_designs and uploaded_images tables
 */
export const addSiteIdColumns: Migration = {
  name: "add_siteid_columns",
  description: "Add siteId columns to mat_designs and uploaded_images tables",
  up: [
    // Add siteId to mat_designs (nullable initially)
    `ALTER TABLE mat_designs ADD COLUMN site_id VARCHAR(50);`,
    // Add siteId to uploaded_images (nullable initially)
    `ALTER TABLE uploaded_images ADD COLUMN site_id VARCHAR(50);`,
  ],
  down: [
    `ALTER TABLE mat_designs DROP COLUMN site_id;`,
    `ALTER TABLE uploaded_images DROP COLUMN site_id;`,
  ],
};

/**
 * Backfill siteId migration
 * Backfills siteId with default value for existing data
 */
export const backfillSiteId: Migration = {
  name: "backfill_siteid",
  description: "Backfill siteId columns with default value",
  up: [
    // Backfill mat_designs with default siteId
    `UPDATE mat_designs SET site_id = COALESCE(site_id, 'cfs') WHERE site_id IS NULL;`,
    // Backfill uploaded_images with default siteId
    `UPDATE uploaded_images SET site_id = COALESCE(site_id, 'cfs') WHERE site_id IS NULL;`,
  ],
  down: [
    // Rollback: set siteId to NULL (cannot fully rollback data changes)
    `UPDATE mat_designs SET site_id = NULL WHERE site_id = 'cfs';`,
    `UPDATE uploaded_images SET site_id = NULL WHERE site_id = 'cfs';`,
  ],
};

/**
 * Add NOT NULL constraints migration
 * Makes siteId required after backfill
 */
export const addSiteIdNotNull: Migration = {
  name: "add_siteid_not_null",
  description: "Add NOT NULL constraints to siteId columns",
  up: [
    `ALTER TABLE mat_designs ALTER COLUMN site_id SET NOT NULL;`,
    `ALTER TABLE uploaded_images ALTER COLUMN site_id SET NOT NULL;`,
  ],
  down: [
    `ALTER TABLE mat_designs ALTER COLUMN site_id DROP NOT NULL;`,
    `ALTER TABLE uploaded_images ALTER COLUMN site_id DROP NOT NULL;`,
  ],
};

/**
 * Add indexes migration
 * Creates indexes on siteId columns for performance
 */
export const addSiteIdIndexes: Migration = {
  name: "add_siteid_indexes",
  description: "Add indexes on siteId columns",
  up: [
    // Indexes for mat_designs
    `CREATE INDEX idx_mat_designs_site_id_created_at ON mat_designs(site_id, created_at);`,
    // Indexes for uploaded_images
    `CREATE INDEX idx_uploaded_images_site_id_uploaded_at ON uploaded_images(site_id, uploaded_at);`,
    `CREATE INDEX idx_uploaded_images_site_id_status ON uploaded_images(site_id, upscale_status);`,
    // Indexes for order_files (if not already exists)
    `CREATE INDEX IF NOT EXISTS idx_order_files_site_id ON order_files(site_id);`,
    `CREATE INDEX IF NOT EXISTS idx_order_files_site_id_order_id ON order_files(site_id, shopify_order_id);`,
  ],
  down: [
    `DROP INDEX IF EXISTS idx_mat_designs_site_id_created_at;`,
    `DROP INDEX IF EXISTS idx_uploaded_images_site_id_uploaded_at;`,
    `DROP INDEX IF EXISTS idx_uploaded_images_site_id_status;`,
    `DROP INDEX IF EXISTS idx_order_files_site_id;`,
    `DROP INDEX IF EXISTS idx_order_files_site_id_order_id;`,
  ],
};

/**
 * Remove default from order_files.siteId
 * Makes siteId explicit (no default value)
 */
export const removeOrderFilesSiteIdDefault: Migration = {
  name: "remove_order_files_siteid_default",
  description: "Remove default value from order_files.siteId",
  up: [`ALTER TABLE order_files ALTER COLUMN site_id DROP DEFAULT;`],
  down: [`ALTER TABLE order_files ALTER COLUMN site_id SET DEFAULT 'cfs';`],
};

/**
 * All migrations in order
 */
export const migrations: Migration[] = [
  addSiteIdColumns,
  backfillSiteId,
  addSiteIdNotNull,
  addSiteIdIndexes,
  removeOrderFilesSiteIdDefault,
];
