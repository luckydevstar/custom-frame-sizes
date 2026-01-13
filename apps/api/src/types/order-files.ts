/**
 * Order File Type Definitions
 */

import { z } from "zod";

/**
 * Order file metadata schema
 */
export const OrderFileMetadataSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  fileUrl: z.string().url("Invalid file URL"),
  fileName: z.string().min(1, "File name is required").max(255),
  fileType: z.string().max(50).optional(),
  fileSize: z.number().int().min(0).optional(),
  metadata: z.record(z.string()).optional(),
});

export type OrderFileMetadata = z.infer<typeof OrderFileMetadataSchema>;

/**
 * Create order file request schema
 */
export const CreateOrderFileRequestSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  fileUrl: z.string().url("Invalid file URL"),
  fileName: z.string().min(1, "File name is required").max(255),
  fileType: z.string().max(50).optional(),
  fileSize: z.number().int().min(0).optional(),
  metadata: z.record(z.string()).optional(),
  siteId: z.string().min(1, "Site ID is required"),
});

export type CreateOrderFileRequest = z.infer<typeof CreateOrderFileRequestSchema>;

/**
 * Order file response
 */
export interface OrderFileResponse {
  id: string;
  orderId: string;
  fileUrl: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
