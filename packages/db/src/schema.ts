/**
 * Database Schema
 *
 * Drizzle ORM schema definitions for FrameCraft database.
 * All tables include siteId for multi-tenant support where applicable.
 *
 * @packageDocumentation
 */

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Users Table
 * Global table - no siteId needed (users are global entities)
 */
export const users = pgTable("users", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

/**
 * Mat Designs Table
 * Multi-tenant: includes siteId for data isolation
 */
export const matDesigns = pgTable(
  "mat_designs",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    siteId: varchar("site_id", { length: 50 }).notNull(),
    configJson: text("config_json").notNull(),
    svgContent: text("svg_content"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    siteIdCreatedAtIdx: index("idx_mat_designs_site_id_created_at").on(
      table.siteId,
      table.createdAt
    ),
  })
);

export const insertMatDesignSchema = createInsertSchema(matDesigns).omit({
  id: true,
  createdAt: true,
});

export type InsertMatDesign = z.infer<typeof insertMatDesignSchema>;
export type MatDesign = typeof matDesigns.$inferSelect;

/**
 * Uploaded Images Table
 * Multi-tenant: includes siteId for data isolation
 */
export const uploadedImages = pgTable(
  "uploaded_images",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    siteId: varchar("site_id", { length: 50 }).notNull(),
    originalUrl: text("original_url").notNull(),
    upscaledUrl: text("upscaled_url"),
    width: varchar("width", { length: 20 }).notNull(), // Original dimensions
    height: varchar("height", { length: 20 }).notNull(),
    upscaledWidth: varchar("upscaled_width", { length: 20 }), // Upscaled dimensions
    upscaledHeight: varchar("upscaled_height", { length: 20 }),
    upscaleStatus: text("upscale_status").notNull().default("pending"), // 'pending' | 'processing' | 'completed' | 'not_needed' | 'failed'
    uploadedAt: text("uploaded_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    upscaledAt: text("upscaled_at"),
  },
  (table) => ({
    siteIdUploadedAtIdx: index("idx_uploaded_images_site_id_uploaded_at").on(
      table.siteId,
      table.uploadedAt
    ),
    siteIdStatusIdx: index("idx_uploaded_images_site_id_status").on(
      table.siteId,
      table.upscaleStatus
    ),
  })
);

export const insertUploadedImageSchema = createInsertSchema(uploadedImages).omit({
  id: true,
  uploadedAt: true,
});

export type InsertUploadedImage = z.infer<typeof insertUploadedImageSchema>;
export type UploadedImage = typeof uploadedImages.$inferSelect;

/**
 * Order Files Table
 * Multi-tenant: includes siteId for data isolation
 * Note: Already had siteId in original schema, now with proper index
 */
export const orderFiles = pgTable(
  "order_files",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    siteId: varchar("site_id", { length: 50 }).notNull(), // No default - must be explicit
    shopifyOrderId: text("shopify_order_id").notNull(), // Shopify order ID
    fileType: text("file_type").notNull(), // 'gallery_wall_pdf', 'mat_svg_top', 'mat_svg_bottom', 'customer_photo', etc.
    fileUrl: text("file_url").notNull(), // Object storage URL
    fileName: text("file_name").notNull(), // Original filename
    metadata: text("metadata"), // JSON string for additional context (config, layout info, etc.)
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    siteIdIdx: index("idx_order_files_site_id").on(table.siteId),
    siteIdOrderIdIdx: index("idx_order_files_site_id_order_id").on(
      table.siteId,
      table.shopifyOrderId
    ),
  })
);

export const insertOrderFileSchema = createInsertSchema(orderFiles).omit({
  id: true,
  createdAt: true,
});

export type InsertOrderFile = z.infer<typeof insertOrderFileSchema>;
export type OrderFile = typeof orderFiles.$inferSelect;

/**
 * Export all tables
 */
export const schema = {
  users,
  matDesigns,
  uploadedImages,
  orderFiles,
};

/**
 * Export all insert schemas
 */
export const insertSchemas = {
  users: insertUserSchema,
  matDesigns: insertMatDesignSchema,
  uploadedImages: insertUploadedImageSchema,
  orderFiles: insertOrderFileSchema,
};

// Types are already exported individually above
// No need to re-export them here to avoid conflicts
