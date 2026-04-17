"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@framecraft/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Image, Package, Search, Store } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const STAFF_TOKEN_KEY = "fulfillment_dashboard_secret";

interface OrderFile {
  id: string;
  shopifyOrderId: string;
  siteId: string;
  fileType: string;
  fileUrl: string;
  fileName: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

interface SearchOrder {
  legacyResourceId: string;
  name: string;
  createdAt: string;
  email: string | null;
  phone: string | null;
}

function getFulfillmentAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  try {
    const t = sessionStorage.getItem(STAFF_TOKEN_KEY);
    return t ? { Authorization: `Bearer ${t}` } : {};
  } catch {
    return {};
  }
}

function useStaffToken(): { saveToken: (value: string) => void } {
  const saveToken = useCallback((value: string) => {
    const v = value.trim();
    if (v) {
      sessionStorage.setItem(STAFF_TOKEN_KEY, v);
    } else {
      sessionStorage.removeItem(STAFF_TOKEN_KEY);
    }
  }, []);

  return { saveToken };
}

function getFileTypeIcon(fileType: string) {
  if (fileType.includes("pdf")) return FileText;
  if (fileType.includes("photo") || fileType.includes("image")) return Image;
  if (fileType.includes("svg")) return FileText;
  return Package;
}

function getFileTypeBadge(fileType: string): "default" | "secondary" | "outline" {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    gallery_wall_pdf: "default",
    mat_svg_top: "secondary",
    mat_svg_bottom: "secondary",
    mat_svg: "secondary",
    customer_photo: "outline",
    configuration_json: "secondary",
  };
  return variants[fileType] ?? "outline";
}

function getSiteName(siteId: string) {
  const siteNames: Record<string, string> = {
    cfs: "Custom Frame Sizes",
    customframesizes: "Custom Frame Sizes",
  };
  return siteNames[siteId] ?? siteId;
}

function matchesSiteFilter(file: OrderFile, siteFilter: string): boolean {
  if (siteFilter === "all") return true;
  if (siteFilter === "cfs") return file.siteId === "cfs" || file.siteId === "customframesizes";
  return file.siteId === siteFilter;
}

export function OrderFulfillmentClient() {
  const queryClient = useQueryClient();
  const { saveToken } = useStaffToken();
  const [staffInput, setStaffInput] = useState("");
  const [orderId, setOrderId] = useState("");
  const [searchedOrderId, setSearchedOrderId] = useState<string | null>(null);
  const [siteFilter, setSiteFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data, isLoading, error, isFetching } = useQuery<{
    success?: boolean;
    error?: string;
    orderFiles: OrderFile[];
  }>({
    queryKey: ["order-files", searchedOrderId, siteFilter],
    queryFn: async () => {
      const url = `/api/order-files/${encodeURIComponent(searchedOrderId!)}`;
      const response = await fetch(url, { headers: getFulfillmentAuthHeaders() });
      const json = (await response.json()) as {
        success?: boolean;
        error?: string;
        orderFiles: OrderFile[];
      };
      if (response.status === 401) {
        throw new Error("Unauthorized — enter staff access token above.");
      }
      if (!response.ok) {
        throw new Error(json.error ?? "Failed to fetch order files");
      }
      return json;
    },
    enabled: Boolean(searchedOrderId),
  });

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useQuery<{ success?: boolean; orders: SearchOrder[]; error?: string }>({
    queryKey: ["order-files-search", debouncedSearch],
    queryFn: async () => {
      const response = await fetch(
        `/api/order-files/search?q=${encodeURIComponent(debouncedSearch)}`,
        { headers: getFulfillmentAuthHeaders() }
      );
      const json = (await response.json()) as {
        success?: boolean;
        orders: SearchOrder[];
        error?: string;
      };
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      if (!response.ok) {
        throw new Error(json.error ?? "Search failed");
      }
      return json;
    },
    enabled: debouncedSearch.length >= 2,
  });

  const handleSearch = () => {
    if (orderId.trim()) {
      setSearchedOrderId(orderId.trim());
    }
  };

  const orderFiles = useMemo(() => {
    const raw = data?.orderFiles ?? [];
    const deduped = Array.from(new Map(raw.map((file) => [file.id, file])).values());
    return deduped.filter((f) => matchesSiteFilter(f, siteFilter));
  }, [data?.orderFiles, siteFilter]);

  const showStaffGate =
    error instanceof Error && error.message.includes("Unauthorized");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Order Fulfillment</h1>
          <p className="text-muted-foreground">
            Production files tied to Shopify orders (URLs and configuration JSON from line item properties).
          </p>
        </div>

        <Card className="mb-6 border-amber-200/80 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Staff access</CardTitle>
            <CardDescription>
              If FULFILLMENT_DASHBOARD_SECRET is set on the server, paste the same value here once per browser.
              Leave empty when the env is unset (local dev).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="fulfillment-staff-token" className="mb-1 block text-sm font-medium">
                Access token
              </label>
              <Input
                id="fulfillment-staff-token"
                type="password"
                autoComplete="off"
                placeholder="Bearer token (optional)"
                value={staffInput}
                onChange={(e) => setStaffInput(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                saveToken(staffInput);
                setStaffInput("");
                void queryClient.invalidateQueries({ queryKey: ["order-files"] });
                void queryClient.invalidateQueries({ queryKey: ["order-files-search"] });
              }}
            >
              Save
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search order files</CardTitle>
            <CardDescription>
              Enter a Shopify order id (numeric, #1001, or gid://shopify/Order/12345).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-3">
              <Input
                type="text"
                placeholder="Order id"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
                data-testid="input-order-id"
              />
              <Button
                onClick={handleSearch}
                disabled={!orderId.trim() || isLoading}
                data-testid="button-search-order"
              >
                Load files
              </Button>
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Site filter</span>
                <Select value={siteFilter} onValueChange={setSiteFilter}>
                  <SelectTrigger className="w-[220px]" data-testid="trigger-site-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="option-site-all">
                      All sites
                    </SelectItem>
                    <SelectItem value="cfs" data-testid="option-site-cfs">
                      Custom Frame Sizes
                    </SelectItem>
                    <SelectItem value="customframesizes" data-testid="option-site-customframesizes">
                      Legacy id (customframesizes)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="mb-2 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Find orders (email, phone, or order #)</span>
              </div>
              <Input
                type="search"
                placeholder="Type at least 2 characters…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              {searchLoading && debouncedSearch.length >= 2 && (
                <p className="mt-2 text-sm text-muted-foreground">Searching…</p>
              )}
              {searchError && (
                <p className="mt-2 text-sm text-destructive">
                  {searchError instanceof Error ? searchError.message : "Search error"}
                </p>
              )}
              {searchData?.orders && searchData.orders.length > 0 && (
                <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-md border p-2 text-sm">
                  {searchData.orders.map((o) => (
                    <li key={o.legacyResourceId}>
                      <button
                        type="button"
                        className="w-full rounded px-2 py-1.5 text-left hover:bg-muted"
                        onClick={() => {
                          setOrderId(o.legacyResourceId);
                          setSearchedOrderId(o.legacyResourceId);
                        }}
                      >
                        <span className="font-medium">{o.name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          · id {o.legacyResourceId}
                          {o.email ? ` · ${o.email}` : ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {searchedOrderId && (
          <Card>
            <CardHeader>
              <CardTitle>Order: {searchedOrderId}</CardTitle>
              <CardDescription>
                {isLoading || isFetching
                  ? "Loading files…"
                  : `${orderFiles.length} file(s) after site filter`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showStaffGate && (
                <div className="py-6 text-center text-destructive">
                  {error instanceof Error ? error.message : "Unauthorized"}
                </div>
              )}

              {(isLoading || isFetching) && !showStaffGate && (
                <div className="py-8 text-center text-muted-foreground">Loading production files…</div>
              )}

              {error && !showStaffGate && (
                <div className="py-8 text-center">
                  <p className="mb-2 text-destructive">Error loading files</p>
                  <p className="text-sm text-muted-foreground">
                    {error instanceof Error ? error.message : "Unknown error"}
                  </p>
                </div>
              )}

              {!isLoading && !isFetching && !error && data?.success === false && data?.error && (
                <div className="py-6 text-center text-muted-foreground">
                  <p>{data.error}</p>
                </div>
              )}

              {!isLoading && !isFetching && !error && orderFiles.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <Package className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p>No production files found for this order (after filter).</p>
                  <p className="mt-1 text-sm">
                    Files appear when line items include URLs or Configuration JSON in cart properties.
                  </p>
                </div>
              )}

              {!isLoading && !isFetching && !error && orderFiles.length > 0 && (
                <div className="space-y-3">
                  {orderFiles.map((file) => {
                    const Icon = getFileTypeIcon(file.fileType);
                    return (
                      <div
                        key={file.id}
                        className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{file.fileName}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <Badge variant={getFileTypeBadge(file.fileType)} className="text-xs">
                                {file.fileType.replace(/_/g, " ")}
                              </Badge>
                              <Badge variant="outline" className="text-xs" data-testid={`badge-site-${file.id}`}>
                                <Store className="mr-1 h-3 w-3" />
                                {getSiteName(file.siteId)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(file.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild data-testid={`button-download-${file.id}`}>
                          <a
                            href={file.fileUrl}
                            download={file.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Open / download
                          </a>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 rounded-md bg-muted/50 p-4">
          <h3 className="mb-2 text-sm font-semibold">For manufacturing</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Enter a Shopify order id or use search, then load files.</li>
            <li>• Files include gallery PDFs, mat SVGs, customer image URLs, and configuration JSON.</li>
            <li>
              • Server: SHOPIFY_STORE_DOMAIN plus SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET (auto token), or
              SHOPIFY_ADMIN_ACCESS_TOKEN (read_orders).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
