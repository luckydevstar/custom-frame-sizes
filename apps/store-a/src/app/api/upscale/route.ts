import { NextRequest } from "next/server";

/**
 * POST /api/upscale
 * Runs Real-ESRGAN on Replicate for print-ready resolution (server-side; token stays private).
 *
 * Body JSON: { imageUrl: string, scale?: 2 | 4 }
 * Returns: { outputUrl: string } or error.
 *
 * Requires REPLICATE_API_TOKEN in the server environment.
 */
const REAL_ESRGAN_VERSION =
  "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b";

async function waitForPrediction(
  predictionUrl: string,
  token: string,
  maxAttempts = 60
): Promise<{ output: unknown }> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(predictionUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Replicate status ${res.status}: ${text}`);
    }
    const data = (await res.json()) as {
      status: string;
      output?: unknown;
      error?: string;
    };
    if (data.status === "succeeded") {
      return { output: data.output };
    }
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(data.error ?? `Prediction ${data.status}`);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error("Replicate prediction timed out");
}

export async function POST(request: NextRequest): Promise<Response> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return Response.json(
      {
        error:
          "REPLICATE_API_TOKEN is not set. Add it to the server environment to enable AI upscaling.",
      },
      { status: 503 }
    );
  }

  let body: { imageUrl?: string; scale?: 2 | 4 };
  try {
    body = (await request.json()) as { imageUrl?: string; scale?: 2 | 4 };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return Response.json({ error: "imageUrl must be an http(s) URL" }, { status: 400 });
  }

  const scale = body.scale === 4 ? 4 : 2;

  const createRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: REAL_ESRGAN_VERSION,
      input: {
        image: imageUrl,
        scale,
        face_enhance: false,
      },
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    return Response.json({ error: `Replicate create failed: ${text}` }, { status: 502 });
  }

  const created = (await createRes.json()) as { urls?: { get?: string }; error?: string };
  const predictionUrl = created.urls?.get;
  if (!predictionUrl) {
    return Response.json(
      { error: created.error ?? "No prediction URL from Replicate" },
      { status: 502 }
    );
  }

  try {
    const { output } = await waitForPrediction(predictionUrl, token);
    const url =
      typeof output === "string"
        ? output
        : Array.isArray(output) && typeof output[0] === "string"
          ? output[0]
          : null;
    if (!url) {
      return Response.json({ error: "Unexpected Replicate output shape", output }, { status: 502 });
    }
    return Response.json({ outputUrl: url, upscaledUrl: url, scale });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upscaling failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
