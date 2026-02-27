"use server";

/**
 * POST /api/proxy-image
 *
 * Proxy endpoint to convert external images to data URLs (bypasses CORS for exports).
 * Mirrors the original Express implementation from CustomFrameSizes-CODE.
 */

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json().catch(() => ({}))) as { url?: string };
    const url = body.url;

    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required and must be a string" }, { status: 400 });
    }

    // Validate URL format
    try {
      // eslint-disable-next-line no-new
      new URL(url);
    } catch {
      return Response.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Fetch the image server-side (bypasses browser CORS)
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch image from ${url}: ${response.status} ${response.statusText}`);
      return Response.json(
        {
          error: "Failed to fetch image",
          details: `${response.status} ${response.statusText}`,
        },
        { status: 404 }
      );
    }

    // Get the image as a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get content type from response headers
    const contentType = response.headers.get("content-type") || "image/png";

    // Convert to base64 data URL
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${contentType};base64,${base64}`;

    return Response.json({ dataUrl }, { status: 200 });
  } catch (error) {
    console.error("Error proxying image:", error);
    return Response.json(
      {
        error: "Failed to proxy image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
