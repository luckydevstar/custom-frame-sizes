/**
 * Shopify Admin API — fetch orders and map line item properties to fulfillment file rows.
 *
 * Configure with either:
 * - SHOPIFY_STORE_DOMAIN + SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET (OAuth client_credentials; auto-refresh in memory), or
 * - SHOPIFY_STORE_DOMAIN + SHOPIFY_ADMIN_ACCESS_TOKEN (static token).
 */

import { resolveShopifyAdminRequestConfig } from "./shopify-admin-token";

export interface OrderFileRow {
  id: string;
  shopifyOrderId: string;
  siteId: string;
  fileType: string;
  fileUrl: string;
  fileName: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface OrderSummary {
  legacyResourceId: string;
  name: string;
  createdAt: string;
  email: string | null;
  phone: string | null;
}

/** Accepts numeric id, #1001, or gid://shopify/Order/12345 */
export function parseShopifyOrderId(raw: string): string | null {
  const t = raw.trim();
  const gid = t.match(/Order\/(\d+)/i);
  if (gid?.[1]) return gid[1];
  const hash = t.match(/^#?(\d+)$/);
  if (hash?.[1]) return hash[1];
  if (/^\d+$/.test(t)) return t;
  return null;
}

function fileTypeFromPropertyName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("configuration") && n.includes("json")) return "configuration_json";
  if (n.includes("gallery") || n.includes("wall")) return "gallery_wall_pdf";
  if (n.includes("svg") || n.includes("mat")) return "mat_svg";
  if (n.includes("image") || n.includes("photo") || n.includes("customer")) return "customer_photo";
  return "line_item_property";
}

function safeFileName(s: string): string {
  return s.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120) || "file";
}

/** Map Shopify REST order payload to downloadable / viewable file rows */
export function mapOrderToOrderFiles(
  order: {
    id: number;
    name: string;
    created_at: string;
    line_items: Array<{
      id: number;
      title: string;
      sku: string | null;
      properties?: Array<{ name: string; value: string | null }>;
    }>;
  },
  siteId = "customframesizes"
): OrderFileRow[] {
  const shopifyOrderId = String(order.id);
  const createdAt = order.created_at;
  const files: OrderFileRow[] = [];

  for (const line of order.line_items) {
    const props = line.properties ?? [];
    for (const prop of props) {
      const val = prop.value?.trim();
      if (!val) continue;

      if (/^https?:\/\//i.test(val)) {
        const ext = val.split("?")[0]?.split(".").pop()?.toLowerCase();
        const base = safeFileName(`${prop.name}-${line.id}`);
        files.push({
          id: `${line.id}-${prop.name}-${files.length}`,
          shopifyOrderId,
          siteId,
          fileType: fileTypeFromPropertyName(prop.name),
          fileUrl: val,
          fileName: ext && ext.length <= 5 ? `${base}.${ext}` : `${base}.link`,
          metadata: {
            lineItemId: line.id,
            lineTitle: line.title,
            sku: line.sku,
            propertyName: prop.name,
          },
          createdAt,
        });
        continue;
      }

      if (prop.name === "Configuration JSON" || prop.name.includes("Configuration")) {
        try {
          JSON.parse(val);
        } catch {
          continue;
        }
        const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(val)}`;
        files.push({
          id: `${line.id}-config-json`,
          shopifyOrderId,
          siteId,
          fileType: "configuration_json",
          fileUrl: dataUrl,
          fileName: `line-${line.id}-configuration.json`,
          metadata: {
            lineItemId: line.id,
            lineTitle: line.title,
            sku: line.sku,
          },
          createdAt,
        });
      }
    }
  }

  return files;
}

export async function fetchShopifyOrderById(orderIdNumeric: string): Promise<{
  order: {
    id: number;
    name: string;
    created_at: string;
    line_items: Array<{
      id: number;
      title: string;
      sku: string | null;
      properties?: Array<{ name: string; value: string | null }>;
    }>;
  };
} | null> {
  const cfg = await resolveShopifyAdminRequestConfig();
  if (!cfg) return null;

  const url = `https://${cfg.shop}/admin/api/${cfg.version}/orders/${orderIdNumeric}.json`;
  const res = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": cfg.token,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify Admin orders/${orderIdNumeric}: ${res.status} ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    order: {
      id: number;
      name: string;
      created_at: string;
      line_items: Array<{
        id: number;
        title: string;
        sku: string | null;
        properties?: Array<{ name: string; value: string | null }>;
      }>;
    };
  };

  return data;
}

/** GraphQL Admin: search orders (email, phone, order name, etc.) */
export async function searchOrdersAdmin(query: string): Promise<OrderSummary[]> {
  const cfg = await resolveShopifyAdminRequestConfig();
  if (!cfg) return [];

  const gql = `#graphql
    query OrderSearch($q: String!) {
      orders(first: 15, query: $q, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            legacyResourceId
            name
            createdAt
            email
            phone
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${cfg.shop}/admin/api/${cfg.version}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": cfg.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: gql, variables: { q: query.trim() } }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify Admin GraphQL: ${res.status} ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    data?: {
      orders?: {
        edges?: Array<{
          node: {
            legacyResourceId: string;
            name: string;
            createdAt: string;
            email: string | null;
            phone: string | null;
          };
        }>;
      };
    };
    errors?: unknown;
  };

  if (json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  const edges = json.data?.orders?.edges ?? [];
  return edges.map((e) => ({
    legacyResourceId: String(e.node.legacyResourceId),
    name: e.node.name,
    createdAt: e.node.createdAt,
    email: e.node.email,
    phone: e.node.phone,
  }));
}
