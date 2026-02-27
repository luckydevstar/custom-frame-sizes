"use server";

/**
 * POST /api/design-recommendations
 *
 * AI Designer's Recommendation endpoint (Next.js port of the original Express route).
 * IMPORTANT: This version assumes the OpenAI API key and frames/mats JSON data
 * are available in the shared core/config packages instead of reading local files.
 */

import { NextRequest } from "next/server";
import { getFramesByCategory } from "@framecraft/core";
import { ALL_MATS } from "@framecraft/config";

// We only need the shape of the response used by the UI
interface DesignRecommendation {
  frameId: string;
  topMatId: string;
  bottomMatId: string;
  explanation: string;
  sizes: { widthIn: number; heightIn: number }[];
}

interface DesignRecommendationResponse {
  analysis: {
    subject: string;
    style: string;
    dominantColors: string[];
    mood: string;
  };
  recommendations: DesignRecommendation[];
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { imageBase64, imageMimeType, imageWidth, imageHeight } = (await request.json()) as {
      imageBase64?: string;
      imageMimeType?: string;
      imageWidth?: number;
      imageHeight?: number;
    };

    // Basic validation (mirrors original)
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return Response.json(
        { error: "imageBase64 is required and must be a string" },
        { status: 400 }
      );
    }
    if (!imageMimeType || typeof imageMimeType !== "string") {
      return Response.json(
        { error: "imageMimeType is required and must be a string" },
        { status: 400 }
      );
    }
    if (
      !imageWidth ||
      !imageHeight ||
      typeof imageWidth !== "number" ||
      typeof imageHeight !== "number"
    ) {
      return Response.json(
        { error: "imageWidth and imageHeight are required and must be numbers" },
        { status: 400 }
      );
    }

    // For now, implement a deterministic, non-OpenAI fallback that chooses
    // reasonable frames/mats based on aspect ratio and a simple palette.
    // This keeps the feature working without requiring an API key.

    const frames = getFramesByCategory("picture");
    const mats = ALL_MATS;

    if (!frames.length || !mats.length) {
      return Response.json({ error: "Frames or mats catalog not available" }, { status: 500 });
    }

    const aspectRatio = imageWidth / imageHeight;

    // Helper to pick a neutral + accent mat
    // These non-null assertions are safe because we already validated mats.length > 0 above.
    const neutralMat = (mats.find((m) => /white|ivory|cream|snow|eggshell/i.test(m.name ?? "")) ??
      mats[0])!;
    const accentMat = (mats.find((m) =>
      /navy|blue|charcoal|graphite|forest|burgundy|wine/i.test(m.name ?? "")
    ) ?? mats[Math.min(1, mats.length - 1)])!;

    // Pick two distinct frames (simple heuristic: first two picture frames)
    // Non-null assertion is safe because we already validated frames.length > 0 above.
    const primaryFrame = frames[0]!;
    const secondaryFrame = frames.find((f) => f.id !== primaryFrame.id) ?? primaryFrame;

    // Compute three sensible frame sizes (small/standard/large) similar to original
    const buildSizes = (longest: number): { widthIn: number; heightIn: number } => {
      const widthIn = aspectRatio >= 1 ? longest : Math.round(longest * aspectRatio * 10) / 10;
      const heightIn = aspectRatio >= 1 ? Math.round((longest / aspectRatio) * 10) / 10 : longest;
      return { widthIn, heightIn };
    };

    const small = buildSizes(11);
    const standard = buildSizes(24);
    const large = buildSizes(36);

    const response: DesignRecommendationResponse = {
      analysis: {
        subject: "Uploaded artwork",
        style: "photograph or print",
        dominantColors: [],
        mood: "not analyzed (fallback recommender)",
      },
      recommendations: [
        {
          frameId: primaryFrame.id,
          topMatId: neutralMat.id,
          bottomMatId: accentMat.id,
          explanation:
            "Clean, gallery-style frame with a neutral top mat and a deeper accent mat that adds contrast without overpowering the artwork.",
          sizes: [small, standard, large],
        },
        {
          frameId: secondaryFrame.id,
          topMatId: neutralMat.id,
          bottomMatId: accentMat.id,
          explanation:
            "A second frame option with a slightly different profile that pairs the same neutral + accent mat combo for a classic professional look.",
          sizes: [small, standard, large],
        },
      ],
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("Error generating design recommendations:", error);
    return Response.json(
      {
        error: "Failed to generate recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
