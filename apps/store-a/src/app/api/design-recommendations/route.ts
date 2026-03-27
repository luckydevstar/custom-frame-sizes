"use server";

/**
 * POST /api/design-recommendations
 *
 * AI Designer's Recommendation endpoint (Next.js port of the original Express route).
 *
 * This implementation intentionally avoids external AI calls and instead returns
 * deterministic, "good enough" recommendations based on the uploaded image's
 * aspect ratio plus the production frame/mat catalog and pricing engine.
 *
 * CRITICAL: The response shape must exactly match DesignRecommendationResponse
 * from @framecraft/types so that the frontend UI (FrameDesigner + carousel)
 * behaves identically to the original app:
 * - Fully-populated frame/mat metadata (names, colors, SKU)
 * - Three SizeOption entries with label/width/height/price
 * - Non-empty analysis object
 */

import { ALL_MATS } from "@framecraft/config";
import { getFramesByCategory, getGlassTypes, calculatePricing } from "@framecraft/core";
import { NextRequest } from "next/server";

import type {
  DesignRecommendation,
  DesignRecommendationResponse,
  SizeOption,
  FrameConfiguration,
} from "@framecraft/types";

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
    const glassTypes = getGlassTypes();

    if (!frames.length || !mats.length || !glassTypes.length) {
      return Response.json(
        { error: "Frames, mats, or glass catalog not available" },
        { status: 500 }
      );
    }

    const aspectRatio = imageWidth / imageHeight;

    // Helper: pick a neutral + accent mat, similar to original server route
    const neutralMat = (mats.find((m) => /white|ivory|cream|snow|eggshell/i.test(m.name ?? "")) ??
      mats[0])!;
    const accentMat = (mats.find((m) =>
      /navy|blue|charcoal|graphite|forest|burgundy|wine/i.test(m.name ?? "")
    ) ?? mats[Math.min(1, mats.length - 1)])!;

    // Pick two distinct frames (simple heuristic: first two picture frames)
    const primaryFrame = frames[0]!;
    const secondaryFrame = frames.find((f) => f.id !== primaryFrame.id) ?? primaryFrame;

    const defaultGlass = glassTypes[0]!;

    // Compute three sensible frame sizes (small/standard/large) similar to original
    const buildSizeDims = (longest: number): { width: number; height: number } => {
      const width = aspectRatio >= 1 ? longest : Math.round(longest * aspectRatio * 10) / 10;
      const height = aspectRatio >= 1 ? Math.round((longest / aspectRatio) * 10) / 10 : longest;
      return { width, height };
    };

    const smallDims = buildSizeDims(11);
    const standardDims = buildSizeDims(24);
    const largeDims = buildSizeDims(36);

    // Helper: calculate a full SizeOption using the shared pricing engine
    const buildSizeOption = (
      label: string,
      dims: { width: number; height: number },
      frameId: string,
      topMatId: string,
      bottomMatId: string
    ): SizeOption => {
      const frameConfig: FrameConfiguration = {
        serviceType: "frame-only",
        artworkWidth: dims.width,
        artworkHeight: dims.height,
        frameStyleId: frameId,
        matType: "double",
        matBorderWidth: 2.5,
        matRevealWidth: 0.25,
        matColorId: topMatId,
        matInnerColorId: bottomMatId,
        glassTypeId: defaultGlass.id,
        imageUrl: undefined,
        copyrightAgreed: false,
        orderSource: "ai-recommendation",
        bottomWeighted: false,
      };

      let price = 0;
      try {
        const pricing = calculatePricing(frameConfig);
        price = Math.round(pricing.total);
      } catch (err) {
        console.error("Failed to calculate AI recommendation price:", err);
      }

      return {
        label,
        width: dims.width,
        height: dims.height,
        price,
      };
    };

    const buildSizesFor = (
      frameId: string,
      topMatId: string,
      bottomMatId: string
    ): SizeOption[] => [
      buildSizeOption("Small", smallDims, frameId, topMatId, bottomMatId),
      buildSizeOption("Standard", standardDims, frameId, topMatId, bottomMatId),
      buildSizeOption("Large", largeDims, frameId, topMatId, bottomMatId),
    ];

    const recommendations: DesignRecommendation[] = [
      {
        frameId: primaryFrame.id,
        frameName: primaryFrame.name,
        frameSku: primaryFrame.sku,
        frameColor: primaryFrame.color,
        topMatId: neutralMat.id,
        topMatName: neutralMat.name,
        topMatColor: neutralMat.hexColor ?? "#FFFFFF",
        bottomMatId: accentMat.id,
        bottomMatName: accentMat.name,
        bottomMatColor: accentMat.hexColor ?? "#000000",
        explanation:
          "Clean, gallery-style frame with a neutral top mat and a deeper accent mat that adds contrast without overpowering the artwork.",
        sizes: buildSizesFor(primaryFrame.id, neutralMat.id, accentMat.id),
      },
      {
        frameId: secondaryFrame.id,
        frameName: secondaryFrame.name,
        frameSku: secondaryFrame.sku,
        frameColor: secondaryFrame.color,
        topMatId: neutralMat.id,
        topMatName: neutralMat.name,
        topMatColor: neutralMat.hexColor ?? "#FFFFFF",
        bottomMatId: accentMat.id,
        bottomMatName: accentMat.name,
        bottomMatColor: accentMat.hexColor ?? "#000000",
        explanation:
          "A second frame option with a slightly different profile that pairs the same neutral + accent mat combo for a classic professional look.",
        sizes: buildSizesFor(secondaryFrame.id, neutralMat.id, accentMat.id),
      },
    ];

    const response: DesignRecommendationResponse = {
      analysis: {
        subject: "Uploaded artwork",
        style: "photograph or print",
        dominantColors: [],
        mood: "not analyzed (fallback recommender)",
      },
      recommendations,
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
