/**
 * Data Access Layer Examples
 *
 * Example patterns for querying data with siteId filtering.
 * These patterns should be used in the actual data access layer.
 */

import type { Database } from "../connection";
import { matDesigns, uploadedImages, orderFiles } from "../schema";
import { eq, and, desc } from "drizzle-orm";
import type { SiteId } from "../helpers";

/**
 * Example: Get mat designs for a site
 */
export async function getMatDesignsForSite(db: Database, siteId: SiteId) {
  return db
    .select()
    .from(matDesigns)
    .where(eq(matDesigns.siteId, siteId))
    .orderBy(desc(matDesigns.createdAt));
}

/**
 * Example: Get uploaded images for a site
 */
export async function getUploadedImagesForSite(db: Database, siteId: SiteId) {
  return db
    .select()
    .from(uploadedImages)
    .where(eq(uploadedImages.siteId, siteId))
    .orderBy(desc(uploadedImages.uploadedAt));
}

/**
 * Example: Get order files for a site and order
 */
export async function getOrderFilesForSiteAndOrder(
  db: Database,
  siteId: SiteId,
  shopifyOrderId: string
) {
  return db
    .select()
    .from(orderFiles)
    .where(and(eq(orderFiles.siteId, siteId), eq(orderFiles.shopifyOrderId, shopifyOrderId)));
}

/**
 * Example: Insert mat design with siteId
 */
export async function insertMatDesign(
  db: Database,
  siteId: SiteId,
  configJson: string,
  svgContent?: string
) {
  return db.insert(matDesigns).values({
    siteId,
    configJson,
    svgContent,
  });
}

/**
 * Example: Insert uploaded image with siteId
 */
export async function insertUploadedImage(
  db: Database,
  siteId: SiteId,
  originalUrl: string,
  width: string,
  height: string
) {
  return db.insert(uploadedImages).values({
    siteId,
    originalUrl,
    width,
    height,
    upscaleStatus: "pending",
  });
}

/**
 * Example: Update uploaded image (with siteId filter)
 */
export async function updateUploadedImage(
  db: Database,
  siteId: SiteId,
  imageId: string,
  updates: { upscaledUrl?: string; upscaleStatus?: string }
) {
  return db
    .update(uploadedImages)
    .set(updates)
    .where(and(eq(uploadedImages.id, imageId), eq(uploadedImages.siteId, siteId)));
}

/**
 * Example: Delete mat design (with siteId filter)
 */
export async function deleteMatDesign(db: Database, siteId: SiteId, designId: string) {
  return db
    .delete(matDesigns)
    .where(and(eq(matDesigns.id, designId), eq(matDesigns.siteId, siteId)));
}
