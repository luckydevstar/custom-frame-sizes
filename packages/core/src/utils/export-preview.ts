/**
 * Export frame preview as high-resolution PNG
 * Replicates the exact DOM structure from FrameDesigner for pixel-perfect exports
 */

import { getMatTilingStyle, getMatBevelColor } from "./specialty/mat-tiling";

export interface ExportPreviewOptions {
  framePhotos?: {
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  };
  frameFacePx: number;
  outerWidth: number;
  outerHeight: number;
  matPx: number;
  openingWidth: number;
  openingHeight: number;
  matType: "none" | "single" | "double";
  matColor: string;
  matName: string;
  matInnerColor?: string | null;
  matInnerName?: string | null;
  matRevealWidth?: number;
  scale: number;
  artworkUrl: string;
}

/**
 * Convert any image URL to data URL for safe canvas drawing.
 *
 * Strategy (aligned with original repo, but hardened for Next.js):
 * - data: URLs → returned as-is
 * - blob: URLs → converted to data: URLs in the browser (via FileReader)
 * - http(s) / relative URLs → converted to absolute, then proxied through /api/proxy-image
 *   so that mat textures and frame rails from external origins don't taint the canvas
 */
export async function convertImageToDataURL(url: string): Promise<string> {
  // If already a data URL, return as-is
  if (url.startsWith("data:")) {
    return url;
  }

  // Handle blob: URLs (typically uploaded images in the browser)
  if (url.startsWith("blob:")) {
    const response = await fetch(url);
    const blob = await response.blob();

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          resolve(result);
        } else {
          reject(new Error("Failed to convert blob to data URL"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read blob"));
      reader.readAsDataURL(blob);
    });
  }

  // Convert relative URLs to absolute
  const absoluteUrl = url.startsWith("http") ? url : new URL(url, window.location.origin).href;

  // Use CORS proxy for external images (mat textures, frame rails, remote photos)
  const response = await fetch("/api/proxy-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: absoluteUrl }),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ error: "Proxy failed" }))) as {
      error?: string;
    };
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const data = (await response.json()) as { dataUrl?: string };
  if (!data.dataUrl) {
    throw new Error("No dataUrl in response");
  }
  return data.dataUrl;
}

/**
 * Load an image and return HTMLImageElement
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${url}`));
    img.src = url;
  });
}

/**
 * Create a tiling pattern from mat texture
 */
async function createMatPattern(
  ctx: CanvasRenderingContext2D,
  matName: string,
  scale: number,
  hexColor: string
): Promise<CanvasPattern | null> {
  const matStyle = getMatTilingStyle(matName, scale, hexColor);

  // If solid color (no texture)
  if (!matStyle.backgroundImage || matStyle.backgroundImage === "none") {
    return null;
  }

  // Extract texture URL from background-image
  const urlMatch = matStyle.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
  if (!urlMatch || !urlMatch[1]) return null;

  try {
    const textureUrl = urlMatch[1];
    const dataUrl = await convertImageToDataURL(textureUrl);
    const img = await loadImage(dataUrl);
    return ctx.createPattern(img, "repeat");
  } catch (error) {
    console.warn("Failed to load mat texture:", error);
    return null;
  }
}

/**
 * Draw a clipped frame piece with background image tiling
 */
async function drawFramePiece(
  ctx: CanvasRenderingContext2D,
  imageUrl: string,
  clipPolygon: [number, number][],
  x: number,
  y: number,
  width: number,
  height: number,
  repeatDirection: "x" | "y"
): Promise<void> {
  try {
    const dataUrl = await convertImageToDataURL(imageUrl);
    const img = await loadImage(dataUrl);

    ctx.save();

    // Apply clip path
    ctx.beginPath();
    const firstPoint = clipPolygon[0];
    if (!firstPoint) return;
    ctx.moveTo(firstPoint[0], firstPoint[1]);
    for (let i = 1; i < clipPolygon.length; i++) {
      const point = clipPolygon[i];
      if (!point) continue;
      ctx.lineTo(point[0], point[1]);
    }
    ctx.closePath();
    ctx.clip();

    // Draw tiled image
    if (repeatDirection === "x") {
      // Horizontal tiling (top/bottom pieces)
      const drawHeight = height;
      const drawWidth = (img.width / img.height) * drawHeight;
      for (let drawX = x; drawX < x + width; drawX += drawWidth) {
        ctx.drawImage(img, drawX, y, drawWidth, drawHeight);
      }
    } else {
      // Vertical tiling (left/right pieces)
      const drawWidth = width;
      const drawHeight = (img.height / img.width) * drawWidth;
      for (let drawY = y; drawY < y + height; drawY += drawHeight) {
        ctx.drawImage(img, x, drawY, drawWidth, drawHeight);
      }
    }

    ctx.restore();
  } catch (error) {
    console.warn("Failed to draw frame piece:", error);
  }
}

/**
 * Draw inset box-shadow (mat bevel)
 */
function drawBevel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  bevelWidth: number,
  bevelColor: string
): void {
  ctx.save();
  ctx.strokeStyle = bevelColor;
  ctx.lineWidth = bevelWidth;
  ctx.strokeRect(x + bevelWidth / 2, y + bevelWidth / 2, width - bevelWidth, height - bevelWidth);
  ctx.restore();
}

/**
 * Export frame preview as high-resolution PNG
 * Matches the exact DOM structure from FrameDesigner
 */
export async function exportFramePreview(
  options: ExportPreviewOptions,
  targetSize: number = 2000
): Promise<string> {
  const {
    framePhotos,
    frameFacePx,
    outerWidth,
    outerHeight,
    matPx,
    openingWidth,
    openingHeight,
    matType,
    matColor,
    matName,
    matInnerColor,
    matInnerName,
    matRevealWidth = 0.25,
    scale,
    artworkUrl,
  } = options;

  // Calculate export scale
  const aspectRatio = outerWidth / outerHeight;
  let frameWidth: number;
  let frameHeight: number;

  if (outerWidth > outerHeight) {
    frameWidth = Math.max(targetSize, outerWidth);
    frameHeight = frameWidth / aspectRatio;
  } else {
    frameHeight = Math.max(targetSize, outerHeight);
    frameWidth = frameHeight * aspectRatio;
  }

  const exportScale = frameWidth / outerWidth;

  // Add padding around the frame (12px for professional presentation)
  const padding = Math.round(12 * exportScale);
  const exportWidth = frameWidth + padding * 2;
  const exportHeight = frameHeight + padding * 2;

  // Create canvas with padding
  const canvas = document.createElement("canvas");
  canvas.width = exportWidth;
  canvas.height = exportHeight;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Failed to get canvas context");

  // Fill background with white
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, exportWidth, exportHeight);

  // Draw subtle drop shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
  ctx.shadowBlur = Math.round(8 * exportScale);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.round(4 * exportScale);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(padding, padding, frameWidth, frameHeight);
  ctx.restore();

  // Scale all dimensions
  const scaledFrameFace = frameFacePx * exportScale;
  const scaledMatPx = matPx * exportScale;
  const scaledOpeningW = openingWidth * exportScale;
  const scaledOpeningH = openingHeight * exportScale;
  const scaledReveal = matRevealWidth * scale * exportScale;
  const bevelWidth = Math.max(1.5, scale * 0.0625) * exportScale;

  // Calculate positions (offset by padding)
  const matX = padding + scaledFrameFace;
  const matY = padding + scaledFrameFace;
  const matW = frameWidth - 2 * scaledFrameFace;
  const matH = frameHeight - 2 * scaledFrameFace;

  // Step 1: Draw outer mat background
  const outerMatPattern = await createMatPattern(ctx, matName, scale * exportScale, matColor);
  if (outerMatPattern) {
    ctx.fillStyle = outerMatPattern;
  } else {
    ctx.fillStyle = matColor;
  }
  ctx.fillRect(matX, matY, matW, matH);

  // Step 2: Draw mat structure based on type
  if (matType === "double" && matInnerColor && matInnerName) {
    // Outer mat inset shadow
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 20 * exportScale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillRect(matX, matY, matW, matH);
    ctx.restore();

    // Inner mat position (centered in outer mat)
    const innerMatX = matX + scaledMatPx;
    const innerMatY = matY + scaledMatPx;
    const innerMatW = scaledOpeningW;
    const innerMatH = scaledOpeningH;

    // Draw inner mat background
    const innerMatPattern = await createMatPattern(
      ctx,
      matInnerName || "White",
      scale * exportScale,
      matInnerColor || "#FFFFFF"
    );
    if (innerMatPattern) {
      ctx.fillStyle = innerMatPattern;
    } else {
      ctx.fillStyle = matInnerColor || "#FFFFFF";
    }
    ctx.fillRect(innerMatX, innerMatY, innerMatW, innerMatH);

    // Draw separator border between mats (off-white)
    ctx.strokeStyle = "#F5F5F0";
    ctx.lineWidth = Math.max(1.5, scale * 0.06) * exportScale;
    ctx.strokeRect(innerMatX, innerMatY, innerMatW, innerMatH);

    // Draw inner mat shadow
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.06)";
    ctx.shadowBlur = 2 * exportScale;
    ctx.shadowOffsetY = 1 * exportScale;
    ctx.fillRect(innerMatX, innerMatY, innerMatW, innerMatH);
    ctx.restore();

    // Artwork opening (inset from inner mat by reveal)
    const artX = innerMatX + scaledReveal;
    const artY = innerMatY + scaledReveal;
    const artW = innerMatW - 2 * scaledReveal;
    const artH = innerMatH - 2 * scaledReveal;

    // White opening background
    ctx.fillStyle = "white";
    ctx.fillRect(artX, artY, artW, artH);

    // Draw inner mat bevel
    const innerBevelColor = getMatBevelColor(matInnerName || "White");
    drawBevel(ctx, artX, artY, artW, artH, bevelWidth, innerBevelColor);

    // Draw artwork
    try {
      const artDataUrl = await convertImageToDataURL(artworkUrl);
      const artImg = await loadImage(artDataUrl);

      // Account for bevel inset
      const artDrawX = artX + bevelWidth;
      const artDrawY = artY + bevelWidth;
      const artDrawW = artW - 2 * bevelWidth;
      const artDrawH = artH - 2 * bevelWidth;

      ctx.drawImage(artImg, artDrawX, artDrawY, artDrawW, artDrawH);
    } catch (error) {
      console.warn("Failed to load artwork:", error);
    }
  } else if (matType === "single") {
    // Mat inset shadow
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 20 * exportScale;
    ctx.fillRect(matX, matY, matW, matH);
    ctx.restore();

    // Artwork opening (centered in mat)
    const artX = matX + scaledMatPx;
    const artY = matY + scaledMatPx;
    const artW = scaledOpeningW;
    const artH = scaledOpeningH;

    // White opening background
    ctx.fillStyle = "white";
    ctx.fillRect(artX, artY, artW, artH);

    // Draw mat bevel
    const bevelColor = getMatBevelColor(matName);
    drawBevel(ctx, artX, artY, artW, artH, bevelWidth, bevelColor);

    // Draw artwork
    try {
      const artDataUrl = await convertImageToDataURL(artworkUrl);
      const artImg = await loadImage(artDataUrl);

      // Account for bevel inset
      const artDrawX = artX + bevelWidth;
      const artDrawY = artY + bevelWidth;
      const artDrawW = artW - 2 * bevelWidth;
      const artDrawH = artH - 2 * bevelWidth;

      ctx.drawImage(artImg, artDrawX, artDrawY, artDrawW, artDrawH);
    } catch (error) {
      console.warn("Failed to load artwork:", error);
    }
  } else {
    // No mat - just artwork
    try {
      const artDataUrl = await convertImageToDataURL(artworkUrl);
      const artImg = await loadImage(artDataUrl);
      ctx.drawImage(artImg, matX, matY, matW, matH);
    } catch (error) {
      console.warn("Failed to load artwork:", error);
    }
  }

  // Step 3: Draw frame pieces ON TOP (if available)
  if (
    framePhotos?.topUrl &&
    framePhotos?.bottomUrl &&
    framePhotos?.leftUrl &&
    framePhotos?.rightUrl
  ) {
    // Top frame piece
    await drawFramePiece(
      ctx,
      framePhotos.topUrl,
      [
        [padding, padding],
        [padding + frameWidth, padding],
        [padding + frameWidth - scaledFrameFace, padding + scaledFrameFace],
        [padding + scaledFrameFace, padding + scaledFrameFace],
      ],
      padding,
      padding,
      frameWidth,
      scaledFrameFace,
      "x"
    );

    // Bottom frame piece
    await drawFramePiece(
      ctx,
      framePhotos.bottomUrl,
      [
        [padding + scaledFrameFace, padding + frameHeight - scaledFrameFace],
        [padding + frameWidth - scaledFrameFace, padding + frameHeight - scaledFrameFace],
        [padding + frameWidth, padding + frameHeight],
        [padding, padding + frameHeight],
      ],
      padding,
      padding + frameHeight - scaledFrameFace,
      frameWidth,
      scaledFrameFace,
      "x"
    );

    // Left frame piece
    await drawFramePiece(
      ctx,
      framePhotos.leftUrl,
      [
        [padding, padding],
        [padding + scaledFrameFace, padding + scaledFrameFace],
        [padding + scaledFrameFace, padding + frameHeight - scaledFrameFace],
        [padding, padding + frameHeight],
      ],
      padding,
      padding,
      scaledFrameFace,
      frameHeight,
      "y"
    );

    // Right frame piece
    await drawFramePiece(
      ctx,
      framePhotos.rightUrl,
      [
        [padding + frameWidth - scaledFrameFace, padding + scaledFrameFace],
        [padding + frameWidth, padding],
        [padding + frameWidth, padding + frameHeight],
        [padding + frameWidth - scaledFrameFace, padding + frameHeight - scaledFrameFace],
      ],
      padding + frameWidth - scaledFrameFace,
      padding,
      scaledFrameFace,
      frameHeight,
      "y"
    );
  }

  return canvas.toDataURL("image/png");
}

/**
 * Download helper - opens image in new tab (mobile) or triggers download (desktop)
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    // Mobile: Open in new tab where user can long-press to save
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${dataUrl}" style="width:100%;height:auto;" />`);
    }
  } else {
    // Desktop: Trigger download
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }
}
