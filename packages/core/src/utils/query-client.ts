/**
 * TanStack Query client setup
 * Provides API request utilities and QueryClient configuration
 */

import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { logApiError } from "../services/logging";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    const error = new Error(`${res.status}: ${text}`);

    // Log API errors with request context
    logApiError(error, {
      url: res.url,
      method: "GET",
      status: res.status,
    });

    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // Log API request failures
    if (error instanceof Error) {
      logApiError(error, {
        url,
        method,
        status: undefined,
      });
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export function getQueryFn<T>(options: { on401: UnauthorizedBehavior }): QueryFunction<T | null> {
  const { on401: unauthorizedBehavior } = options;
  return async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
