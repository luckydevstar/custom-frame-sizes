/**
 * Shopify Storefront API GraphQL Fragments
 *
 * Reusable GraphQL fragments for consistent data structure across all queries.
 * These fragments ensure we always request the same fields, making the codebase
 * more maintainable and reducing errors from inconsistent field selection.
 *
 * @packageDocumentation
 */

/**
 * ProductFields Fragment
 *
 * Core product data fields used across all product queries.
 * Includes essential product information, pricing, images, and variant connection.
 *
 * Usage:
 * ```graphql
 * query GetProduct($handle: String!) {
 *   product(handle: $handle) {
 *     ...ProductFields
 *   }
 * }
 * ${ProductFields}
 * ```
 */
export const ProductFields = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    createdAt
    updatedAt
    publishedAt
    onlineStoreUrl
    totalInventory
    tracksInventory
    
    # Price range (min/max across all variants)
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    
    # Product images
    images(first: 10) {
      edges {
        node {
          id
          url(transform: { maxWidth: 1024, maxHeight: 1024 })
          altText
          width
          height
        }
      }
    }
    
    # Featured image (first image)
    featuredImage {
      id
      url(transform: { maxWidth: 1024, maxHeight: 1024 })
      altText
      width
      height
    }
    
    # Variants connection (will use VariantFields fragment)
    variants(first: 100) {
      edges {
        node {
          ...VariantFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    
    # Product options (for variant selection)
    options {
      id
      name
      values
    }
    
    # SEO fields
    seo {
      title
      description
    }
    
    # Metafields (for custom frame data)
    metafields(first: 10) {
      edges {
        node {
          id
          namespace
          key
          value
          type
        }
      }
    }
  }
`;

/**
 * VariantFields Fragment
 *
 * Product variant data fields. Includes pricing, availability, SKU, and options.
 * This fragment is used within ProductFields and CartFields.
 *
 * Usage:
 * ```graphql
 * query GetVariant($id: ID!) {
 *   node(id: $id) {
 *     ... on ProductVariant {
 *       ...VariantFields
 *     }
 *   }
 * }
 * ${VariantFields}
 * ```
 */
export const VariantFields = `
  fragment VariantFields on ProductVariant {
    id
    title
    sku
    barcode
    availableForSale
    currentlyNotInStock
    quantityAvailable
    requiresShipping
    weight
    weightUnit
    
    # Pricing
    price {
      amount
      currencyCode
    }
    
    # Compare at price (for showing discounts)
    compareAtPrice {
      amount
      currencyCode
    }
    
    # Variant image
    image {
      id
      url(transform: { maxWidth: 1024, maxHeight: 1024 })
      altText
      width
      height
    }
    
    # Selected options (size, color, etc.)
    selectedOptions {
      name
      value
    }
    
    # Product reference (for accessing product data from variant)
    product {
      id
      handle
      title
    }
    
    # Metafields (for custom variant data)
    metafields(first: 5) {
      edges {
        node {
          id
          namespace
          key
          value
          type
        }
      }
    }
  }
`;

/**
 * CartFields Fragment
 *
 * Complete cart data including line items, pricing, and checkout information.
 * Composes ProductFields and VariantFields for line item merchandise.
 *
 * Usage:
 * ```graphql
 * query GetCart($id: ID!) {
 *   cart(id: $id) {
 *     ...CartFields
 *   }
 * }
 * ${CartFields}
 * ${ProductFields}
 * ${VariantFields}
 * ```
 */
export const CartFields = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    createdAt
    updatedAt
    totalQuantity
    
    # Cost breakdown
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
    
    # Cart lines (items in cart)
    lines(first: 250) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
          }
          
          # Merchandise (product variant)
          merchandise {
            ... on ProductVariant {
              ...VariantFields
              product {
                ...ProductFields
              }
            }
          }
          
          # Custom attributes (for frame configuration)
          attributes {
            key
            value
          }
          
          # Discount allocations
          discountAllocations {
            allocatedAmount {
              amount
              currencyCode
            }
            discountApplication {
              ... on DiscountCodeApplication {
                code
                applicable
              }
              ... on ScriptDiscountApplication {
                title
                description
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    
    # Discount codes
    discountCodes {
      code
      applicable
    }
    
    # Buyer identity
    buyerIdentity {
      email
      phone
      customer {
        id
      }
      countryCode
    }
    
    # Cart attributes (custom metadata)
    attributes {
      key
      value
    }
    
    # Note (customer message)
    note
  }
`;

/**
 * CollectionFields Fragment
 *
 * Collection data with product connection. Used for browsing products by category.
 *
 * Usage:
 * ```graphql
 * query GetCollection($handle: String!, $first: Int!, $after: String) {
 *   collection(handle: $handle) {
 *     ...CollectionFields
 *   }
 * }
 * ${CollectionFields}
 * ${ProductFields}
 * ${VariantFields}
 * ```
 */
export const CollectionFields = `
  fragment CollectionFields on Collection {
    id
    title
    handle
    description
    descriptionHtml
    
    # Collection image
    image {
      id
      url(transform: { maxWidth: 1024, maxHeight: 1024 })
      altText
      width
      height
    }
    
    # Products in collection
    products(first: 250, after: $after) {
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
    
    # SEO fields
    seo {
      title
      description
    }
    
    # Metafields
    metafields(first: 10) {
      edges {
        node {
          id
          namespace
          key
          value
          type
        }
      }
    }
  }
`;

/**
 * CheckoutFields Fragment
 *
 * Checkout data (used for checkout creation and retrieval).
 * Similar to CartFields but for checkout objects.
 *
 * Note: Shopify's Storefront API uses Cart, not Checkout in newer versions.
 * This fragment is included for compatibility with older API versions or
 * if using checkout-specific queries.
 *
 * Usage:
 * ```graphql
 * query GetCheckout($id: ID!) {
 *   node(id: $id) {
 *     ... on Checkout {
 *       ...CheckoutFields
 *     }
 *   }
 * }
 * ${CheckoutFields}
 * ${ProductFields}
 * ${VariantFields}
 * ```
 */
export const CheckoutFields = `
  fragment CheckoutFields on Checkout {
    id
    webUrl
    email
    phone
    ready
    requiresShipping
    shippingLine {
      title
      price {
        amount
        currencyCode
      }
    }
    shippingAddress {
      address1
      address2
      city
      province
      country
      zip
      firstName
      lastName
      phone
    }
    lineItems(first: 250) {
      edges {
        node {
          id
          title
          quantity
          variant {
            ...VariantFields
            product {
              ...ProductFields
            }
          }
          customAttributes {
            key
            value
          }
        }
      }
    }
    totalPrice {
      amount
      currencyCode
    }
    subtotalPrice {
      amount
      currencyCode
    }
    totalTax {
      amount
      currencyCode
    }
    currencyCode
    order {
      id
      name
      orderNumber
    }
  }
`;

/**
 * PageInfoFields Fragment
 *
 * Reusable pagination information for connection types.
 * Used in products, variants, collections, and cart lines.
 *
 * Usage:
 * ```graphql
 * query GetProducts($first: Int!, $after: String) {
 *   products(first: $first, after: $after) {
 *     pageInfo {
 *       ...PageInfoFields
 *     }
 *   }
 * }
 * ${PageInfoFields}
 * ```
 */
export const PageInfoFields = `
  fragment PageInfoFields on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

/**
 * MoneyFields Fragment
 *
 * Reusable money/price fields for consistent currency formatting.
 * Used in price ranges, variant prices, and cart costs.
 *
 * Usage:
 * ```graphql
 * query GetPrice {
 *   product(handle: "example") {
 *     priceRange {
 *       minVariantPrice {
 *         ...MoneyFields
 *       }
 *     }
 *   }
 * }
 * ${MoneyFields}
 * ```
 */
export const MoneyFields = `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

/**
 * ImageFields Fragment
 *
 * Reusable image fields for consistent image handling.
 * Used in products, variants, collections, and cart items.
 *
 * Usage:
 * ```graphql
 * query GetImage {
 *   product(handle: "example") {
 *     featuredImage {
 *       ...ImageFields
 *     }
 *   }
 * }
 * ${ImageFields}
 * ```
 */
export const ImageFields = `
  fragment ImageFields on Image {
    id
    url(transform: { maxWidth: 1024, maxHeight: 1024 })
    altText
    width
    height
  }
`;

/**
 * All fragments combined
 *
 * Use this when you need all fragments in a single query.
 * This ensures all fragment dependencies are included.
 */
export const AllFragments = `
  ${ProductFields}
  ${VariantFields}
  ${CartFields}
  ${CollectionFields}
  ${CheckoutFields}
  ${PageInfoFields}
  ${MoneyFields}
  ${ImageFields}
`;

/**
 * Helper function to combine fragments
 *
 * Use this when you need specific fragments for a query.
 * This ensures proper fragment composition.
 *
 * @param fragments - Array of fragment strings to combine
 * @returns Combined fragment string
 */
export function combineFragments(...fragments: string[]): string {
  return fragments.join("\n");
}

/**
 * Fragment composition helper
 *
 * Automatically includes required fragments based on what you're using.
 * For example, if you use CartFields, it automatically includes ProductFields and VariantFields.
 *
 * @param fragment - Main fragment to use
 * @returns Combined fragments with dependencies
 */
export function getFragmentWithDependencies(fragment: string): string {
  const fragmentMap: Record<string, string[]> = {
    ProductFields: [ProductFields],
    VariantFields: [VariantFields],
    CartFields: [CartFields, ProductFields, VariantFields],
    CollectionFields: [CollectionFields, ProductFields, VariantFields],
    CheckoutFields: [CheckoutFields, ProductFields, VariantFields],
  };

  // Extract fragment name from fragment string
  const fragmentName = fragment.match(/fragment\s+(\w+)/)?.[1];
  if (!fragmentName || !fragmentMap[fragmentName]) {
    return fragment;
  }

  return combineFragments(...fragmentMap[fragmentName]);
}
