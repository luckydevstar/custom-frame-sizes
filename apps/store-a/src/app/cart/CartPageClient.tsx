"use client";

import { CartClient } from "@framecraft/ui";
import { env } from "../../lib/env";
import { useCartStore } from "@framecraft/core/stores";

export function CartPageClient() {
  const setLoading = useCartStore((state) => state._setLoading);
  const setError = useCartStore((state) => state._setError);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.length > 0
          ? process.env.NEXT_PUBLIC_API_URL
          : env.apiUrl;

      const res = await fetch(`${apiBase}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      const data = (await res.json()) as {
        success?: boolean;
        checkoutUrl?: string;
        error?: { code?: string; message?: string };
      };

      if (!res.ok || !data.checkoutUrl) {
        const message =
          data.error?.message ||
          (data.success === false && data.error?.code) ||
          "Failed to create checkout";
        throw new Error(message);
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <CartClient continueShoppingHref="/designer" onCheckout={handleCheckout} />
    </div>
  );
}
