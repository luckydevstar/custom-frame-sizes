/**
 * Order File Utilities
 *
 * Helper functions for order file management.
 *
 * NOTE: This is a placeholder implementation. In production, this would
 * interact with a database to store and retrieve order file metadata.
 * For now, it uses an in-memory store for demonstration.
 */

import type { OrderFileResponse, CreateOrderFileRequest } from "@/types/order-files";

/**
 * In-memory store for order files
 * In production, replace with database operations
 */
const orderFileStore = new Map<string, OrderFileResponse>();

/**
 * Generate unique file ID
 */
function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create order file metadata
 */
export async function createOrderFile(request: CreateOrderFileRequest): Promise<OrderFileResponse> {
  const fileId = generateFileId();
  const now = new Date().toISOString();

  const file: OrderFileResponse = {
    id: fileId,
    orderId: request.orderId,
    fileUrl: request.fileUrl,
    fileName: request.fileName,
    fileType: request.fileType,
    fileSize: request.fileSize,
    metadata: request.metadata || {},
    createdAt: now,
    updatedAt: now,
  };

  // Store in memory (in production, save to database)
  orderFileStore.set(fileId, file);

  // Also index by orderId for quick lookup
  const orderKey = `${request.siteId}:${request.orderId}`;
  const existingFiles = (orderFileStore.get(orderKey) as unknown as OrderFileResponse[]) || [];
  existingFiles.push(file);
  orderFileStore.set(orderKey, existingFiles as unknown as OrderFileResponse);

  return file;
}

/**
 * Get order files by order ID and site ID
 */
export async function getOrderFiles(orderId: string, siteId: string): Promise<OrderFileResponse[]> {
  // In production, query database with siteId filter
  const orderKey = `${siteId}:${orderId}`;
  const files = orderFileStore.get(orderKey) as unknown as OrderFileResponse[];

  if (!files || !Array.isArray(files)) {
    return [];
  }

  // Filter by siteId for security (multi-tenant)
  // In production, this would be a database query with WHERE siteId = ?
  // Placeholder - all files in store are already filtered by key
  return files.filter(() => true);
}

/**
 * Get order file by ID
 */
export async function getOrderFileById(
  fileId: string,
  _siteId: string // Reserved for future multi-tenant security check
): Promise<OrderFileResponse | null> {
  const file = orderFileStore.get(fileId);

  if (!file) {
    return null;
  }

  // In production, verify siteId matches (security check)
  // For now, return the file
  return file;
}

/**
 * Validate Shopify order ID format
 */
export function isValidShopifyOrderId(orderId: string): boolean {
  // Shopify order IDs can be numeric or GID format
  // Numeric: 1234567890
  // GID: gid://shopify/Order/1234567890
  const numericPattern = /^\d+$/;
  const gidPattern = /^gid:\/\/shopify\/Order\/\d+$/;

  return numericPattern.test(orderId) || gidPattern.test(orderId);
}
