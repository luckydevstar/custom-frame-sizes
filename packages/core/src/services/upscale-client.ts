/**
 * Client-side Replicate upscaling via POST /api/upscale (Real-ESRGAN).
 * Chains 2× and 4× passes to approximate 8× and 16× targets.
 */

export function getReplicateUpscalePasses(factor: 1 | 2 | 4 | 8 | 16): (2 | 4)[] {
  if (factor <= 1) return [];
  if (factor <= 2) return [2];
  if (factor <= 4) return [4];
  if (factor <= 8) return [2, 4];
  return [4, 4];
}

/** Replicate must fetch the image; relative URLs are resolved against the current origin. */
export function toAbsoluteImageUrlForUpscaling(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (typeof window === "undefined") return url;
  return new URL(url, window.location.origin).href;
}

export async function runReplicateUpscaleChain(
  imageUrl: string,
  factor: 1 | 2 | 4 | 8 | 16,
  options?: { path?: string }
): Promise<{ ok: true; outputUrl: string } | { ok: false; error: string; status?: number }> {
  const passes = getReplicateUpscalePasses(factor);
  if (passes.length === 0) return { ok: true, outputUrl: imageUrl };

  let url = imageUrl;
  const path = options?.path ?? "/api/upscale";

  for (const scale of passes) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ imageUrl: url, scale }),
    });

    let data: { outputUrl?: string; upscaledUrl?: string; error?: string };
    try {
      data = (await res.json()) as { outputUrl?: string; upscaledUrl?: string; error?: string };
    } catch {
      return { ok: false, error: "Invalid JSON from upscale", status: res.status };
    }

    if (!res.ok) {
      return { ok: false, error: data.error ?? res.statusText, status: res.status };
    }

    const next = data.outputUrl ?? data.upscaledUrl;
    if (!next) {
      return { ok: false, error: "No output URL from upscale" };
    }
    url = next;
  }

  return { ok: true, outputUrl: url };
}
