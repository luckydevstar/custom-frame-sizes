/**
 * Shopify Product Query Functions
 *
 * Functions for querying products from Shopify Storefront API.
 * Uses GraphQL fragments for consistent data structure.
 *
 * @packageDocumentation
 */

import { createStorefrontClient } from "./storefront-client";
import { ProductFields, VariantFields, CollectionFields } from "./fragments";

/**
 * Shopify Product Image
 */
export interface ShopifyProductImage {
  id: string;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

/**
 * Shopify Money (price)
 */
export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

/**
 * Shopify Price Range
 */
export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
}

/**
 * Shopify Product Option
 */
export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

/**
 * Shopify Product Variant
 */
export interface ShopifyProductVariant {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  availableForSale: boolean;
  currentlyNotInStock: boolean;
  quantityAvailable: number | null;
  requiresShipping: boolean;
  weight: number | null;
  weightUnit: string;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  image: ShopifyProductImage | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  product: {
    id: string;
    handle: string;
    title: string;
  };
  metafields: Array<{
    id: string;
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>;
}

/**
 * Shopify SEO Fields
 */
export interface ShopifySEO {
  title: string | null;
  description: string | null;
}

/**
 * Shopify Metafield
 */
export interface ShopifyMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

/**
 * Shopify Product (from GraphQL response)
 */
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  onlineStoreUrl: string | null;
  totalInventory: number | null;
  tracksInventory: boolean;
  priceRange: ShopifyPriceRange;
  images: {
    edges: Array<{
      node: ShopifyProductImage;
    }>;
  };
  featuredImage: ShopifyProductImage | null;
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
  options: ShopifyProductOption[];
  seo: ShopifySEO;
  metafields: {
    edges: Array<{
      node: ShopifyMetafield;
    }>;
  };
}

/**
 * Transformed Product (simplified for internal use)
 */
export interface TransformedProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  images: ShopifyProductImage[];
  featuredImage: ShopifyProductImage | null;
  variants: ShopifyProductVariant[];
  options: ShopifyProductOption[];
  seo: ShopifySEO;
  metafields: ShopifyMetafield[];
  onlineStoreUrl: string | null;
  available: boolean;
}

/**
 * GraphQL query response for getProductByHandle
 */
interface GetProductByHandleResponse {
  product: ShopifyProduct | null;
}

/**
 * Get a single product by handle
 *
 * Fetches a product from Shopify using its handle (URL-friendly identifier).
 * Uses ProductFields and VariantFields fragments for consistent data structure.
 *
 * @param handle - Product handle (e.g., "custom-picture-frame")
 * @param storeId - Optional store identifier. If not provided, will be resolved automatically.
 * @returns Promise resolving to transformed product data, or null if product not found
 * @throws {ShopifyAPIError} If API returns an error
 * @throws {ShopifyNetworkError} If network request fails
 *
 * @example
 * ```typescript
 * import { getProductByHandle } from '@framecraft/core/shopify';
 *
 * // Get product by handle
 * const product = await getProductByHandle('custom-picture-frame', 'store-a');
 * if (product) {
 *   console.log(product.title);
 *   console.log(product.priceRange.min);
 * }
 * ```
 */
export async function getProductByHandle(
  handle: string,
  storeId?: string
): Promise<TransformedProduct | null> {
  if (!handle || typeof handle !== "string") {
    throw new Error("Product handle must be a non-empty string");
  }

  // Create client for the specified store
  const client = createStorefrontClient(storeId);

  // Build GraphQL query with fragments
  const query = `
    ${ProductFields}
    ${VariantFields}
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
  `;

  try {
    // Execute query
    const response = await client.query<GetProductByHandleResponse>(query, {
      handle,
    });

    // Handle null product (not found)
    if (!response.product) {
      return null;
    }

    // Transform Shopify product to internal format
    return transformProduct(response.product);
  } catch (error) {
    // Re-throw known errors
    if (
      error instanceof Error &&
      (error.name === "ShopifyAPIError" ||
        error.name === "ShopifyNetworkError" ||
        error.name === "ShopifyRateLimitError")
    ) {
      throw error;
    }

    // Wrap unknown errors
    throw new Error(
      `Failed to fetch product by handle "${handle}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Transform Shopify product to internal format
 *
 * Converts Shopify's GraphQL response structure to a simplified internal format.
 * Handles null/undefined values and normalizes data structures.
 *
 * @param shopifyProduct - Raw Shopify product from GraphQL
 * @returns Transformed product
 */
function transformProduct(shopifyProduct: ShopifyProduct): TransformedProduct {
  // Extract images from edges
  const images = shopifyProduct.images.edges.map((edge) => edge.node);

  // Extract variants from edges
  const variants = shopifyProduct.variants.edges.map((edge) => edge.node);

  // Extract metafields from edges
  const metafields = shopifyProduct.metafields.edges.map((edge) => edge.node);

  // Parse price range amounts to numbers
  const minPrice = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(shopifyProduct.priceRange.maxVariantPrice.amount);
  const currency = shopifyProduct.priceRange.minVariantPrice.currencyCode;

  // Determine if product is available (has at least one available variant)
  const available = variants.some((variant) => variant.availableForSale);

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description,
    descriptionHtml: shopifyProduct.descriptionHtml,
    vendor: shopifyProduct.vendor,
    productType: shopifyProduct.productType,
    tags: shopifyProduct.tags,
    priceRange: {
      min: minPrice,
      max: maxPrice,
      currency,
    },
    images,
    featuredImage: shopifyProduct.featuredImage,
    variants,
    options: shopifyProduct.options,
    seo: shopifyProduct.seo,
    metafields,
    onlineStoreUrl: shopifyProduct.onlineStoreUrl,
    available,
  };
}

/**
 * Get product by handle with raw Shopify format
 *
 * Returns the product in Shopify's native GraphQL format without transformation.
 * Useful when you need access to all Shopify fields.
 *
 * @param handle - Product handle
 * @param storeId - Optional store identifier
 * @returns Promise resolving to Shopify product or null
 * @throws {ShopifyAPIError} If API returns an error
 * @throws {ShopifyNetworkError} If network request fails
 *
 * @example
 * ```typescript
 * import { getProductByHandleRaw } from '@framecraft/core/shopify';
 *
 * const product = await getProductByHandleRaw('custom-picture-frame');
 * if (product) {
 *   // Access raw Shopify fields
 *   console.log(product.totalInventory);
 *   console.log(product.tracksInventory);
 * }
 * ```
 */
export async function getProductByHandleRaw(
  handle: string,
  storeId?: string
): Promise<ShopifyProduct | null> {
  if (!handle || typeof handle !== "string") {
    throw new Error("Product handle must be a non-empty string");
  }

  const client = createStorefrontClient(storeId);

  const query = `
    ${ProductFields}
    ${VariantFields}
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
  `;

  try {
    const response = await client.query<GetProductByHandleResponse>(query, {
      handle,
    });

    return response.product;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "ShopifyAPIError" ||
        error.name === "ShopifyNetworkError" ||
        error.name === "ShopifyRateLimitError")
    ) {
      throw error;
    }

    throw new Error(
      `Failed to fetch product by handle "${handle}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Shopify Collection Image
 */
export interface ShopifyCollectionImage {
  id: string;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

/**
 * Shopify Collection (from GraphQL response)
 */
export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  image: ShopifyCollectionImage | null;
  products: {
    edges: Array<{
      node: ShopifyProduct;
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
  };
  seo: ShopifySEO;
  metafields: {
    edges: Array<{
      node: ShopifyMetafield;
    }>;
  };
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /**
   * Number of items to fetch (default: 20, max: 250)
   */
  first?: number;
  /**
   * Cursor for pagination (from previous page's endCursor)
   */
  after?: string | null;
}

/**
 * Pagination metadata
 */
export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

/**
 * Transformed Collection with pagination
 */
export interface TransformedCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  image: ShopifyCollectionImage | null;
  products: TransformedProduct[];
  seo: ShopifySEO;
  metafields: ShopifyMetafield[];
  pagination: PaginationInfo;
}

/**
 * GraphQL query response for getCollection
 */
interface GetCollectionResponse {
  collection: ShopifyCollection | null;
}

/**
 * Get collection by handle with pagination support
 *
 * Fetches a collection from Shopify using its handle with support for pagination.
 * Uses CollectionFields, ProductFields, and VariantFields fragments for consistent data structure.
 *
 * @param handle - Collection handle (e.g., "picture-frames")
 * @param pagination - Pagination parameters (first, after)
 * @param storeId - Optional store identifier. If not provided, will be resolved automatically.
 * @returns Promise resolving to transformed collection data with pagination info, or null if collection not found
 * @throws {ShopifyAPIError} If API returns an error
 * @throws {ShopifyNetworkError} If network request fails
 *
 * @example
 * ```typescript
 * import { getCollection } from '@framecraft/core/shopify';
 *
 * // Get first page of collection
 * const collection = await getCollection('picture-frames', { first: 20 });
 * if (collection) {
 *   console.log(collection.title);
 *   console.log(collection.products.length);
 *   console.log(collection.pagination.hasNextPage);
 *
 *   // Get next page
 *   if (collection.pagination.hasNextPage) {
 *     const nextPage = await getCollection('picture-frames', {
 *       first: 20,
 *       after: collection.pagination.endCursor,
 *     });
 *   }
 * }
 * ```
 */
export async function getCollection(
  handle: string,
  pagination: PaginationParams = {},
  storeId?: string
): Promise<TransformedCollection | null> {
  if (!handle || typeof handle !== "string") {
    throw new Error("Collection handle must be a non-empty string");
  }

  // Validate and set default pagination
  const first = Math.min(pagination.first ?? 20, 250); // Max 250 per Shopify API
  const after = pagination.after ?? null;

  // Create client for the specified store
  const client = createStorefrontClient(storeId);

  // Build GraphQL query with fragments and pagination
  const query = `
    ${CollectionFields}
    ${ProductFields}
    ${VariantFields}
    query GetCollection($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        ...CollectionFields
      }
    }
  `;

  try {
    // Execute query
    const response = await client.query<GetCollectionResponse>(query, {
      handle,
      first,
      after,
    });

    // Handle null collection (not found)
    if (!response.collection) {
      return null;
    }

    // Transform Shopify collection to internal format
    return transformCollection(response.collection);
  } catch (error) {
    // Re-throw known errors
    if (
      error instanceof Error &&
      (error.name === "ShopifyAPIError" ||
        error.name === "ShopifyNetworkError" ||
        error.name === "ShopifyRateLimitError")
    ) {
      throw error;
    }

    // Wrap unknown errors
    throw new Error(
      `Failed to fetch collection by handle "${handle}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Transform Shopify collection to internal format
 *
 * Converts Shopify's GraphQL response structure to a simplified internal format.
 * Handles null/undefined values, normalizes data structures, and includes pagination info.
 *
 * @param shopifyCollection - Raw Shopify collection from GraphQL
 * @returns Transformed collection with pagination
 */
function transformCollection(shopifyCollection: ShopifyCollection): TransformedCollection {
  // Extract products from edges and transform each
  const products = shopifyCollection.products.edges.map((edge) => transformProduct(edge.node));

  // Extract metafields from edges
  const metafields = shopifyCollection.metafields.edges.map((edge) => edge.node);

  // Extract pagination info
  const pagination: PaginationInfo = {
    hasNextPage: shopifyCollection.products.pageInfo.hasNextPage,
    hasPreviousPage: shopifyCollection.products.pageInfo.hasPreviousPage,
    startCursor: shopifyCollection.products.pageInfo.startCursor,
    endCursor: shopifyCollection.products.pageInfo.endCursor,
  };

  return {
    id: shopifyCollection.id,
    title: shopifyCollection.title,
    handle: shopifyCollection.handle,
    description: shopifyCollection.description,
    descriptionHtml: shopifyCollection.descriptionHtml,
    image: shopifyCollection.image,
    products,
    seo: shopifyCollection.seo,
    metafields,
    pagination,
  };
}

/**
 * Get collection by handle with raw Shopify format
 *
 * Returns the collection in Shopify's native GraphQL format without transformation.
 * Useful when you need access to all Shopify fields.
 *
 * @param handle - Collection handle
 * @param pagination - Pagination parameters
 * @param storeId - Optional store identifier
 * @returns Promise resolving to Shopify collection or null
 * @throws {ShopifyAPIError} If API returns an error
 * @throws {ShopifyNetworkError} If network request fails
 *
 * @example
 * ```typescript
 * import { getCollectionRaw } from '@framecraft/core/shopify';
 *
 * const collection = await getCollectionRaw('picture-frames', { first: 20 });
 * if (collection) {
 *   // Access raw Shopify fields
 *   console.log(collection.products.edges.length);
 *   console.log(collection.products.pageInfo.hasNextPage);
 * }
 * ```
 */
export async function getCollectionRaw(
  handle: string,
  pagination: PaginationParams = {},
  storeId?: string
): Promise<ShopifyCollection | null> {
  if (!handle || typeof handle !== "string") {
    throw new Error("Collection handle must be a non-empty string");
  }

  const first = Math.min(pagination.first ?? 20, 250);
  const after = pagination.after ?? null;

  const client = createStorefrontClient(storeId);

  const query = `
    ${CollectionFields}
    ${ProductFields}
    ${VariantFields}
    query GetCollection($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        ...CollectionFields
      }
    }
  `;

  try {
    const response = await client.query<GetCollectionResponse>(query, {
      handle,
      first,
      after,
    });

    return response.collection;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "ShopifyAPIError" ||
        error.name === "ShopifyNetworkError" ||
        error.name === "ShopifyRateLimitError")
    ) {
      throw error;
    }

    throw new Error(
      `Failed to fetch collection by handle "${handle}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Search parameters for product search
 */
export interface SearchParams extends PaginationParams {
  /**
   * Search query string (searches in product title, description, tags, etc.)
   */
  query: string;
  /**
   * Sort key for results (default: "RELEVANCE")
   * Options: RELEVANCE, PRICE, CREATED_AT, UPDATED_AT, TITLE, VENDOR, ID
   */
  sortKey?: "RELEVANCE" | "PRICE" | "CREATED_AT" | "UPDATED_AT" | "TITLE" | "VENDOR" | "ID";
  /**
   * Reverse sort order (default: false)
   */
  reverse?: boolean;
  /**
   * Product type filter
   */
  productType?: string;
  /**
   * Vendor filter
   */
  vendor?: string;
  /**
   * Tag filter
   */
  tag?: string;
  /**
   * Price range filter (min price in cents)
   */
  minPrice?: number;
  /**
   * Price range filter (max price in cents)
   */
  maxPrice?: number;
  /**
   * Product availability filter
   */
  available?: boolean;
}

/**
 * Search results with pagination
 */
export interface SearchResults {
  products: TransformedProduct[];
  pagination: PaginationInfo;
  /**
   * Total number of results (if available from API)
   */
  totalCount?: number;
}

/**
 * GraphQL query response for searchProducts
 */
interface SearchProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
    // Note: totalCount may not be available in all Shopify plans
    totalCount?: number;
  };
}

/**
 * Search products using Shopify's search functionality
 *
 * Searches for products matching the query string and optional filters.
 * Uses ProductFields and VariantFields fragments for consistent data structure.
 *
 * @param searchParams - Search parameters including query, pagination, and filters
 * @param storeId - Optional store identifier. If not provided, will be resolved automatically.
 * @returns Promise resolving to search results with pagination info
 * @throws {ShopifyAPIError} If API returns an error
 * @throws {ShopifyNetworkError} If network request fails
 *
 * @example
 * ```typescript
 * import { searchProducts } from '@framecraft/core/shopify';
 *
 * // Basic search
 * const results = await searchProducts({ query: 'picture frame', first: 20 });
 * console.log(results.products.length);
 * console.log(results.pagination.hasNextPage);
 *
 * // Search with filters
 * const filteredResults = await searchProducts({
 *   query: 'frame',
 *   productType: 'Picture Frame',
 *   minPrice: 1000, // $10.00 in cents
 *   maxPrice: 50000, // $500.00 in cents
 *   available: true,
 *   first: 20,
 * });
 *
 * // Pagination
 * if (results.pagination.hasNextPage) {
 *   const nextPage = await searchProducts({
 *     query: 'picture frame',
 *     first: 20,
 *     after: results.pagination.endCursor,
 *   });
 * }
 * ```
 */
export async function searchProducts(
  searchParams: SearchParams,
  storeId?: string
): Promise<SearchResults> {
  if (!searchParams.query || typeof searchParams.query !== "string") {
    throw new Error("Search query must be a non-empty string");
  }

  // Validate and set default pagination
  const first = Math.min(searchParams.first ?? 20, 250); // Max 250 per Shopify API
  const after = searchParams.after ?? null;

  // Build filter string
  const filters: string[] = [];

  if (searchParams.productType) {
    filters.push(`product_type:${searchParams.productType}`);
  }

  if (searchParams.vendor) {
    filters.push(`vendor:${searchParams.vendor}`);
  }

  if (searchParams.tag) {
    filters.push(`tag:${searchParams.tag}`);
  }

  if (searchParams.minPrice !== undefined) {
    filters.push(`variants.price:>=${searchParams.minPrice / 100}`); // Convert cents to dollars
  }

  if (searchParams.maxPrice !== undefined) {
    filters.push(`variants.price:<=${searchParams.maxPrice / 100}`); // Convert cents to dollars
  }

  if (searchParams.available !== undefined) {
    filters.push(`variants.available:${searchParams.available}`);
  }

  const filterString = filters.length > 0 ? filters.join(" AND ") : undefined;

  // Create client for the specified store
  const client = createStorefrontClient(storeId);

  // Build GraphQL query with fragments
  // Note: Shopify Storefront API uses 'products' query with 'query' parameter for search
  const query = `
    ${ProductFields}
    ${VariantFields}
    query SearchProducts($query: String!, $first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(
        first: $first
        after: $after
        query: $query
        sortKey: $sortKey
        reverse: $reverse
      ) {
        edges {
          node {
            ...ProductFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

  // Prepare variables
  const variables: Record<string, unknown> = {
    query: filterString ? `${searchParams.query} ${filterString}` : searchParams.query,
    first,
    after,
  };

  // Add sort parameters if provided
  if (searchParams.sortKey) {
    variables.sortKey = searchParams.sortKey;
  }

  if (searchParams.reverse !== undefined) {
    variables.reverse = searchParams.reverse;
  }

  try {
    // Execute query
    const response = await client.query<SearchProductsResponse>(query, variables);

    // Transform products from edges
    const products = response.products.edges.map((edge) => transformProduct(edge.node));

    // Extract pagination info
    const pagination: PaginationInfo = {
      hasNextPage: response.products.pageInfo.hasNextPage,
      hasPreviousPage: response.products.pageInfo.hasPreviousPage,
      startCursor: response.products.pageInfo.startCursor,
      endCursor: response.products.pageInfo.endCursor,
    };

    return {
      products,
      pagination,
      totalCount: response.products.totalCount,
    };
  } catch (error) {
    // Re-throw known errors
    if (
      error instanceof Error &&
      (error.name === "ShopifyAPIError" ||
        error.name === "ShopifyNetworkError" ||
        error.name === "ShopifyRateLimitError")
    ) {
      throw error;
    }

    // Wrap unknown errors
    throw new Error(
      `Failed to search products: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
