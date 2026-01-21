/**
 * Print Compositor Service
 *
 * Generates print-ready composite files for the Print & Frame feature.
 * Uses client-side canvas compositing to avoid npm dependency conflicts.
 *
 * Print File Specifications:
 * - Paper size = Frame interior size (rabbet to rabbet)
 * - Image sizing: Photo prints 1/2" larger than mat opening on all sides (bleed for mat overlap)
 * - Resolution: 300 DPI
 * - Output: Single high-quality JPEG blob
 */

const TARGET_DPI = 300;
const MAT_BLEED_INCHES = 0.5; // 1/2" bleed over mat opening on all sides

/**
 * Embed DPI metadata into a JPEG blob
 *
 * Canvas.toBlob() generates JPEGs at 72 DPI by default.
 * This function modifies the JFIF APP0 segment to set 300 DPI.
 *
 * JFIF structure (bytes):
 * - 0-1: SOI marker (FFD8)
 * - 2-3: APP0 marker (FFE0)
 * - 4-5: Segment length
 * - 6-10: "JFIF\0" identifier
 * - 11-12: JFIF version
 * - 13: Density units (01 = DPI)
 * - 14-15: X density (big-endian uint16)
 * - 16-17: Y density (big-endian uint16)
 */
async function embedJpegDpi(blob: Blob, dpi: number): Promise<Blob> {
  const buffer = await blob.arrayBuffer();
  const data = new Uint8Array(buffer);

  // Verify JPEG SOI marker (FFD8)
  if (data[0] !== 0xff || data[1] !== 0xd8) {
    console.warn("[DPI] Not a valid JPEG, skipping DPI modification");
    return blob;
  }

  // Find APP0 JFIF segment
  let offset = 2;
  while (offset < data.length - 4) {
    // Check for segment marker (FF xx)
    if (data[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = data[offset + 1];

    // APP0 marker (E0)
    if (marker === 0xe0) {
      // Verify JFIF identifier
      const jfifId = String.fromCharCode(
        data[offset + 4] ?? 0,
        data[offset + 5] ?? 0,
        data[offset + 6] ?? 0,
        data[offset + 7] ?? 0
      );
      if (jfifId === "JFIF") {
        // Found JFIF segment - modify DPI values
        // Byte 13 (offset + 11): density units - set to 01 (DPI)
        data[offset + 11] = 0x01;

        // Bytes 14-15 (offset + 12-13): X density (300 in big-endian)
        data[offset + 12] = (dpi >> 8) & 0xff;
        data[offset + 13] = dpi & 0xff;

        // Bytes 16-17 (offset + 14-15): Y density (300 in big-endian)
        data[offset + 14] = (dpi >> 8) & 0xff;
        data[offset + 15] = dpi & 0xff;

        return new Blob([data], { type: "image/jpeg" });
      }
    }

    // Skip to next segment
    const segmentLength = ((data[offset + 2] ?? 0) << 8) | (data[offset + 3] ?? 0);
    offset += 2 + segmentLength;
  }

  console.warn("[DPI] No JFIF segment found, skipping DPI modification");
  return blob;
}

export interface PrintDimensions {
  paperWidth: number; // inches (frame interior width)
  paperHeight: number; // inches (frame interior height)
  matOpeningWidth: number; // inches (visible artwork area)
  matOpeningHeight: number; // inches (visible artwork area)
  matBorderTop: number; // inches
  matBorderBottom: number; // inches
  matBorderLeft: number; // inches
  matBorderRight: number; // inches
}

export interface PrintFileResult {
  blob: Blob;
  filename: string;
  paperWidthInches: number;
  paperHeightInches: number;
  widthPixels: number;
  heightPixels: number;
  imagePrintWidthInches: number;
  imagePrintHeightInches: number;
}

/**
 * Calculate frame interior dimensions (rabbet to rabbet)
 * This is the paper size for printing
 *
 * @param artworkWidth - Visible artwork width in inches
 * @param artworkHeight - Visible artwork height in inches
 * @param matBorderSides - Left/right/top mat border in inches
 * @param matBorderBottom - Bottom mat border in inches (may differ for bottom-weighted or nameplate)
 * @param matType - Type of mat ('none', 'single', 'double')
 */
export function calculateInteriorSize(
  artworkWidth: number,
  artworkHeight: number,
  matBorderSides: number,
  matBorderBottom: number,
  matType: "none" | "single" | "double"
): { width: number; height: number } {
  if (matType === "none") {
    // No mat - paper size equals artwork size
    return { width: artworkWidth, height: artworkHeight };
  }

  // With mat - paper size = artwork + mat borders on all sides
  const width = artworkWidth + matBorderSides * 2;
  const height = artworkHeight + matBorderSides + matBorderBottom;

  return { width, height };
}

/**
 * Calculate print dimensions for the compositor
 *
 * @param artworkWidth - Visible artwork width in inches
 * @param artworkHeight - Visible artwork height in inches
 * @param matBorderSides - Left/right/top mat border in inches
 * @param matBorderBottom - Bottom mat border in inches (includes bottom-weighting and nameplate adjustments)
 * @param matType - Type of mat ('none', 'single', 'double')
 */
export function calculatePrintDimensions(
  artworkWidth: number,
  artworkHeight: number,
  matBorderSides: number,
  matBorderBottom: number,
  matType: "none" | "single" | "double"
): PrintDimensions {
  const interior = calculateInteriorSize(
    artworkWidth,
    artworkHeight,
    matBorderSides,
    matBorderBottom,
    matType
  );

  return {
    paperWidth: interior.width,
    paperHeight: interior.height,
    matOpeningWidth: artworkWidth,
    matOpeningHeight: artworkHeight,
    matBorderTop: matType === "none" ? 0 : matBorderSides,
    matBorderBottom: matType === "none" ? 0 : matBorderBottom,
    matBorderLeft: matType === "none" ? 0 : matBorderSides,
    matBorderRight: matType === "none" ? 0 : matBorderSides,
  };
}

/**
 * Load an image from URL and return as HTMLImageElement
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Calculate how to fit and center an image within a target area while maintaining aspect ratio
 */
function calculateImageFit(
  imgWidth: number,
  imgHeight: number,
  targetWidth: number,
  targetHeight: number
): { width: number; height: number; x: number; y: number } {
  const imgAspect = imgWidth / imgHeight;
  const targetAspect = targetWidth / targetHeight;

  let width: number, height: number;

  // Cover mode - image fills entire target area (may crop edges)
  if (imgAspect > targetAspect) {
    // Image is wider - fit height, crop width
    height = targetHeight;
    width = height * imgAspect;
  } else {
    // Image is taller - fit width, crop height
    width = targetWidth;
    height = width / imgAspect;
  }

  // Center the image
  const x = (targetWidth - width) / 2;
  const y = (targetHeight - height) / 2;

  return { width, height, x, y };
}

/**
 * Generate a print-ready composite file
 *
 * Paper size = frame interior (rabbet to rabbet)
 * With mat: Image is centered within the mat opening area with 1/2" bleed on all sides
 * Without mat: Image fills the entire paper (no bleed needed)
 */
export async function generatePrintFile(
  imageUrl: string,
  dimensions: PrintDimensions
): Promise<PrintFileResult> {
  const {
    paperWidth,
    paperHeight,
    matOpeningWidth,
    matOpeningHeight,
    matBorderLeft,
    matBorderTop,
  } = dimensions;

  // Check if we have a mat (borders > 0)
  const hasMat = matBorderLeft > 0 || matBorderTop > 0;

  // Convert to pixels at 300 DPI
  const paperWidthPx = Math.round(paperWidth * TARGET_DPI);
  const paperHeightPx = Math.round(paperHeight * TARGET_DPI);

  // Image print area: with mat = opening + bleed, without mat = full paper
  const bleed = hasMat ? MAT_BLEED_INCHES : 0;
  const imagePrintWidth = hasMat ? matOpeningWidth + bleed * 2 : paperWidth;
  const imagePrintHeight = hasMat ? matOpeningHeight + bleed * 2 : paperHeight;
  const imagePrintWidthPx = Math.round(imagePrintWidth * TARGET_DPI);
  const imagePrintHeightPx = Math.round(imagePrintHeight * TARGET_DPI);

  // Position of image on paper: with mat = mat border minus bleed, without mat = 0
  const imageX = hasMat ? Math.round((matBorderLeft - bleed) * TARGET_DPI) : 0;
  const imageY = hasMat ? Math.round((matBorderTop - bleed) * TARGET_DPI) : 0;

  // Create canvas at print resolution
  const canvas = document.createElement("canvas");
  canvas.width = paperWidthPx;
  canvas.height = paperHeightPx;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to create canvas context");
  }

  // Fill background with white (paper color)
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, paperWidthPx, paperHeightPx);

  // Load the user's image
  const img = await loadImage(imageUrl);

  // Calculate how to fit image in print area (cover mode, centered)
  const fit = calculateImageFit(img.width, img.height, imagePrintWidthPx, imagePrintHeightPx);

  // Draw image centered in the print area
  ctx.drawImage(img, imageX + fit.x, imageY + fit.y, fit.width, fit.height);

  // Convert to JPEG blob
  let blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to create blob"));
      },
      "image/jpeg",
      0.95 // High quality
    );
  });

  // Embed 300 DPI metadata into JPEG
  blob = await embedJpegDpi(blob, TARGET_DPI);

  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `print-file-${paperWidth}x${paperHeight}-${timestamp}.jpg`;

  return {
    blob,
    filename,
    paperWidthInches: paperWidth,
    paperHeightInches: paperHeight,
    widthPixels: paperWidthPx,
    heightPixels: paperHeightPx,
    imagePrintWidthInches: imagePrintWidth,
    imagePrintHeightInches: imagePrintHeight,
  };
}

/**
 * Download a print file
 */
export function downloadPrintFile(result: PrintFileResult): void {
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = result.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Estimate print file size in MB
 */
export function estimatePrintFileSize(dimensions: PrintDimensions): number {
  const widthPx = dimensions.paperWidth * TARGET_DPI;
  const heightPx = dimensions.paperHeight * TARGET_DPI;
  // JPEG at 95% quality is roughly 0.5-1 bytes per pixel
  const estimatedBytes = widthPx * heightPx * 0.75;
  return estimatedBytes / (1024 * 1024);
}

/**
 * Calculate print dimensions for Signature Frame Designer
 *
 * Signature Frame spec differs from main designer:
 * - Paper size = mat opening + 2" (not interior frame size)
 * - Image bleeds 1/2" over mat opening on all sides
 *
 * @param openingWidth - Mat opening width in inches (typically 5 or 8)
 * @param openingHeight - Mat opening height in inches (typically 5 or 8)
 */
export function calculateSignatureFramePrintDimensions(
  openingWidth: number,
  openingHeight: number
): PrintDimensions {
  // Paper size = mat opening + 2" (1" on each side)
  const SIGNATURE_PAPER_PADDING = 2;
  const paperWidth = openingWidth + SIGNATURE_PAPER_PADDING;
  const paperHeight = openingHeight + SIGNATURE_PAPER_PADDING;

  return {
    paperWidth,
    paperHeight,
    matOpeningWidth: openingWidth,
    matOpeningHeight: openingHeight,
    matBorderTop: 1, // 1" top padding for signature frames
    matBorderBottom: 1, // 1" bottom padding
    matBorderLeft: 1, // 1" left padding
    matBorderRight: 1, // 1" right padding
  };
}

/**
 * Canvas Print Dimensions Interface
 *
 * Canvas prints have a unique structure:
 * - Core image: User-defined size shown on the front
 * - Stretcher wrap: 3/8" extension past visible area for wrapping around stretcher bar
 * - Mirrored border: 2" mirrored edge on each side for gallery wrap effect
 * - Paper/grip area: 6" total extension (3" each side) beyond user image for production grip
 */
export interface CanvasPrintDimensions {
  paperWidth: number; // inches (user image + 6")
  paperHeight: number; // inches (user image + 6")
  userImageWidth: number; // inches (visible front area)
  userImageHeight: number; // inches (visible front area)
  printedImageWidth: number; // inches (user image + 0.75" for stretcher wrap)
  printedImageHeight: number; // inches (user image + 0.75" for stretcher wrap)
  mirroredBorderWidth: number; // inches (2" on each side)
  gripMargin: number; // inches (0.625" on each side - unprinted area)
  stretcher_wrap: number; // inches (0.375" on each side)
}

/**
 * Calculate print dimensions for Canvas Prints
 *
 * Canvas Print specifications:
 * - Printed image = user size + 3/8" per edge (0.75" total) for stretcher bar wrap
 * - 2" mirrored border on each side for gallery wrap effect
 * - Paper extends 6" beyond user image (3" each side) for production grip
 *
 * Breakdown per side: 0.375" stretcher wrap + 2" mirror + 0.625" grip = 3"
 *
 * @param imageWidth - User-defined visible image width in inches
 * @param imageHeight - User-defined visible image height in inches
 */
export function calculateCanvasPrintDimensions(
  imageWidth: number,
  imageHeight: number
): CanvasPrintDimensions {
  const STRETCHER_WRAP = 0.375; // 3/8" per edge for wrapping around stretcher bar
  const MIRRORED_BORDER = 2; // 2" per edge for gallery wrap effect
  const PAPER_EXTENSION_PER_SIDE = 3; // 3" per edge (6" total extension)
  const GRIP_MARGIN = 0.625; // Remaining grip area per edge

  // Paper size = user image + 6" (3" each side)
  const paperWidth = imageWidth + PAPER_EXTENSION_PER_SIDE * 2;
  const paperHeight = imageHeight + PAPER_EXTENSION_PER_SIDE * 2;

  // Printed image size = user image + 0.75" (0.375" each side for stretcher wrap)
  const printedImageWidth = imageWidth + STRETCHER_WRAP * 2;
  const printedImageHeight = imageHeight + STRETCHER_WRAP * 2;

  return {
    paperWidth,
    paperHeight,
    userImageWidth: imageWidth,
    userImageHeight: imageHeight,
    printedImageWidth,
    printedImageHeight,
    mirroredBorderWidth: MIRRORED_BORDER,
    gripMargin: GRIP_MARGIN,
    stretcher_wrap: STRETCHER_WRAP,
  };
}

/**
 * Generate a canvas print file with mirrored edges for gallery wrap effect
 *
 * Structure from center outward:
 * 1. Core image (user size + 0.375" per edge for stretcher wrap)
 * 2. Mirrored borders (2" per edge) - edges of image reflected/mirrored
 * 3. Grip margins (0.625" per edge) - unprinted for production handling
 */
export async function generateCanvasPrintFile(
  imageUrl: string,
  dimensions: CanvasPrintDimensions
): Promise<PrintFileResult> {
  const {
    paperWidth,
    paperHeight,
    printedImageWidth,
    printedImageHeight,
    mirroredBorderWidth,
    gripMargin,
  } = dimensions;

  // Convert to pixels at 300 DPI
  const paperWidthPx = Math.round(paperWidth * TARGET_DPI);
  const paperHeightPx = Math.round(paperHeight * TARGET_DPI);
  const printedImageWidthPx = Math.round(printedImageWidth * TARGET_DPI);
  const printedImageHeightPx = Math.round(printedImageHeight * TARGET_DPI);
  const mirrorPx = Math.round(mirroredBorderWidth * TARGET_DPI);
  const gripPx = Math.round(gripMargin * TARGET_DPI);

  // Position of printed area on paper (centered, with grip margins)
  const printedAreaX = gripPx;
  const printedAreaY = gripPx;

  // Position of core image within printed area
  const coreImageX = printedAreaX + mirrorPx;
  const coreImageY = printedAreaY + mirrorPx;

  // Create canvas at print resolution
  const canvas = document.createElement("canvas");
  canvas.width = paperWidthPx;
  canvas.height = paperHeightPx;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to create canvas context");
  }

  // Fill background with white (paper color for grip areas)
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, paperWidthPx, paperHeightPx);

  // Load the user's image
  const img = await loadImage(imageUrl);

  // Calculate how to fit image in core print area (cover mode, centered)
  const fit = calculateImageFit(img.width, img.height, printedImageWidthPx, printedImageHeightPx);

  // Create a temporary canvas for the core image to enable mirroring
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = printedImageWidthPx;
  tempCanvas.height = printedImageHeightPx;
  const tempCtx = tempCanvas.getContext("2d");

  if (!tempCtx) {
    throw new Error("Failed to create temp canvas context");
  }

  // Draw core image on temp canvas (cover mode, centered)
  tempCtx.drawImage(img, fit.x, fit.y, fit.width, fit.height);

  // Draw the core image at center
  ctx.drawImage(tempCanvas, coreImageX, coreImageY);

  // Create mirrored borders using edge pixels from the core image
  // LEFT MIRROR - horizontal flip of left edge
  ctx.save();
  ctx.translate(printedAreaX + mirrorPx, coreImageY);
  ctx.scale(-1, 1);
  ctx.drawImage(
    tempCanvas,
    0,
    0,
    mirrorPx,
    printedImageHeightPx, // Source: left edge of image
    0,
    0,
    mirrorPx,
    printedImageHeightPx // Destination
  );
  ctx.restore();

  // RIGHT MIRROR - horizontal flip of right edge
  ctx.save();
  ctx.translate(coreImageX + printedImageWidthPx + mirrorPx, coreImageY);
  ctx.scale(-1, 1);
  ctx.drawImage(
    tempCanvas,
    printedImageWidthPx - mirrorPx,
    0,
    mirrorPx,
    printedImageHeightPx, // Source: right edge
    0,
    0,
    mirrorPx,
    printedImageHeightPx
  );
  ctx.restore();

  // TOP MIRROR - vertical flip of top edge
  ctx.save();
  ctx.translate(coreImageX, printedAreaY + mirrorPx);
  ctx.scale(1, -1);
  ctx.drawImage(
    tempCanvas,
    0,
    0,
    printedImageWidthPx,
    mirrorPx, // Source: top edge
    0,
    0,
    printedImageWidthPx,
    mirrorPx
  );
  ctx.restore();

  // BOTTOM MIRROR - vertical flip of bottom edge
  ctx.save();
  ctx.translate(coreImageX, coreImageY + printedImageHeightPx + mirrorPx);
  ctx.scale(1, -1);
  ctx.drawImage(
    tempCanvas,
    0,
    printedImageHeightPx - mirrorPx,
    printedImageWidthPx,
    mirrorPx, // Source: bottom edge
    0,
    0,
    printedImageWidthPx,
    mirrorPx
  );
  ctx.restore();

  // CORNER MIRRORS - diagonal flip for corners
  // Top-left corner
  ctx.save();
  ctx.translate(printedAreaX + mirrorPx, printedAreaY + mirrorPx);
  ctx.scale(-1, -1);
  ctx.drawImage(tempCanvas, 0, 0, mirrorPx, mirrorPx, 0, 0, mirrorPx, mirrorPx);
  ctx.restore();

  // Top-right corner
  ctx.save();
  ctx.translate(coreImageX + printedImageWidthPx + mirrorPx, printedAreaY + mirrorPx);
  ctx.scale(-1, -1);
  ctx.drawImage(
    tempCanvas,
    printedImageWidthPx - mirrorPx,
    0,
    mirrorPx,
    mirrorPx,
    0,
    0,
    mirrorPx,
    mirrorPx
  );
  ctx.restore();

  // Bottom-left corner
  ctx.save();
  ctx.translate(printedAreaX + mirrorPx, coreImageY + printedImageHeightPx + mirrorPx);
  ctx.scale(-1, -1);
  ctx.drawImage(
    tempCanvas,
    0,
    printedImageHeightPx - mirrorPx,
    mirrorPx,
    mirrorPx,
    0,
    0,
    mirrorPx,
    mirrorPx
  );
  ctx.restore();

  // Bottom-right corner
  ctx.save();
  ctx.translate(
    coreImageX + printedImageWidthPx + mirrorPx,
    coreImageY + printedImageHeightPx + mirrorPx
  );
  ctx.scale(-1, -1);
  ctx.drawImage(
    tempCanvas,
    printedImageWidthPx - mirrorPx,
    printedImageHeightPx - mirrorPx,
    mirrorPx,
    mirrorPx,
    0,
    0,
    mirrorPx,
    mirrorPx
  );
  ctx.restore();

  // Convert to JPEG blob
  let blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to create blob"));
      },
      "image/jpeg",
      0.95 // High quality
    );
  });

  // Embed 300 DPI metadata into JPEG
  blob = await embedJpegDpi(blob, TARGET_DPI);

  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `canvas-print-${paperWidth}x${paperHeight}-${timestamp}.jpg`;

  return {
    blob,
    filename,
    paperWidthInches: paperWidth,
    paperHeightInches: paperHeight,
    widthPixels: paperWidthPx,
    heightPixels: paperHeightPx,
    imagePrintWidthInches: printedImageWidth,
    imagePrintHeightInches: printedImageHeight,
  };
}

/**
 * Check if image resolution is sufficient for 300 DPI printing
 */
export function checkImageResolution(
  imageWidth: number,
  imageHeight: number,
  targetWidthInches: number,
  targetHeightInches: number
): {
  sufficient: boolean;
  currentDpiW: number;
  currentDpiH: number;
  recommendedUpscale: 1 | 2 | 4 | 8 | 16;
} {
  const requiredWidthPx = targetWidthInches * TARGET_DPI;
  const requiredHeightPx = targetHeightInches * TARGET_DPI;

  const currentDpiW = imageWidth / targetWidthInches;
  const currentDpiH = imageHeight / targetHeightInches;

  const scaleW = requiredWidthPx / imageWidth;
  const scaleH = requiredHeightPx / imageHeight;
  const maxScale = Math.max(scaleW, scaleH);

  let recommendedUpscale: 1 | 2 | 4 | 8 | 16;
  if (maxScale <= 1) recommendedUpscale = 1;
  else if (maxScale <= 2) recommendedUpscale = 2;
  else if (maxScale <= 4) recommendedUpscale = 4;
  else if (maxScale <= 8) recommendedUpscale = 8;
  else recommendedUpscale = 16;

  return {
    sufficient: maxScale <= 1.5, // Allow slight upscaling without AI
    currentDpiW: Math.round(currentDpiW),
    currentDpiH: Math.round(currentDpiH),
    recommendedUpscale,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLLAGE PRINT FILE GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Collage opening definition (matches CollageOpening from collageLayouts.ts)
 */
export interface CollagePrintOpening {
  x: number; // Position from frame interior top-left (inches)
  y: number; // Position from frame interior top-left (inches)
  width: number; // Opening width (inches)
  height: number; // Opening height (inches)
}

/**
 * Configuration for collage print file generation
 */
export interface CollagePrintConfig {
  frameWidth: number; // Outer frame width in inches
  frameHeight: number; // Outer frame height in inches
  frameMoldingWidth: number; // Frame molding width (typically 1")
  openings: CollagePrintOpening[];
  userPhotos: Record<number, string>; // Index -> data URL
  openingSources: Record<number, "upload" | "byo">; // Index -> source type
}

/**
 * Result from collage print file generation
 */
export interface CollagePrintResult {
  blob: Blob;
  filename: string;
  interiorWidthInches: number;
  interiorHeightInches: number;
  widthPixels: number;
  heightPixels: number;
  printCount: number; // Number of photos printed (not BYO)
  byoCount: number; // Number of BYO placeholders
}

/**
 * Generate a composite print file for collage frames
 *
 * Creates a single print at frame interior size with:
 * - Uploaded photos positioned at mat openings with 1/2" bleed
 * - BYO spaces showing dashed placeholder boxes with "Mount your photo here" text
 *
 * Production workflow: Print comes off printer, trim to size, place on backing board,
 * lay mat on top (aligns with printed photos), add acrylic, insert in frame.
 *
 * @param config - Collage print configuration
 * @returns Promise resolving to print file result
 */
export async function generateCollagePrintFile(
  config: CollagePrintConfig
): Promise<CollagePrintResult> {
  const { frameWidth, frameHeight, frameMoldingWidth, openings, userPhotos, openingSources } =
    config;

  // Calculate frame interior dimensions (rabbet to rabbet)
  const interiorWidth = frameWidth - frameMoldingWidth * 2;
  const interiorHeight = frameHeight - frameMoldingWidth * 2;

  // Convert to pixels at 300 DPI
  const paperWidthPx = Math.round(interiorWidth * TARGET_DPI);
  const paperHeightPx = Math.round(interiorHeight * TARGET_DPI);

  // Create canvas at print resolution
  const canvas = document.createElement("canvas");
  canvas.width = paperWidthPx;
  canvas.height = paperHeightPx;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to create canvas context");
  }

  // Fill background with white (paper color)
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, paperWidthPx, paperHeightPx);

  let printCount = 0;
  let byoCount = 0;

  // Process each opening
  for (let i = 0; i < openings.length; i++) {
    const opening = openings[i];
    if (!opening) continue;

    const source = openingSources[i] || "upload";
    const photoUrl = userPhotos[i];

    // Calculate print area for this opening (opening + 1/2" bleed on all sides)
    const printWidth = opening.width + MAT_BLEED_INCHES * 2;
    const printHeight = opening.height + MAT_BLEED_INCHES * 2;

    // Position on paper (opening position minus bleed)
    const printX = opening.x - MAT_BLEED_INCHES;
    const printY = opening.y - MAT_BLEED_INCHES;

    // Convert to pixels
    const printXPx = Math.round(printX * TARGET_DPI);
    const printYPx = Math.round(printY * TARGET_DPI);
    const printWidthPx = Math.round(printWidth * TARGET_DPI);
    const printHeightPx = Math.round(printHeight * TARGET_DPI);

    if (source === "byo" || !photoUrl) {
      // Draw BYO placeholder: dashed box with "Mount your photo here" text
      drawByoPlaceholder(
        ctx,
        printXPx,
        printYPx,
        printWidthPx,
        printHeightPx,
        opening.width,
        opening.height
      );
      byoCount++;
    } else {
      // Draw uploaded photo
      try {
        const img = await loadImage(photoUrl);

        // Calculate how to fit image in print area (cover mode, centered)
        const fit = calculateImageFit(img.width, img.height, printWidthPx, printHeightPx);

        // Draw image
        ctx.drawImage(img, printXPx + fit.x, printYPx + fit.y, fit.width, fit.height);
        printCount++;
      } catch (error) {
        console.error(`Failed to load image for opening ${i}:`, error);
        // Draw error placeholder
        drawByoPlaceholder(
          ctx,
          printXPx,
          printYPx,
          printWidthPx,
          printHeightPx,
          opening.width,
          opening.height,
          true
        );
      }
    }
  }

  // Convert to JPEG blob
  let blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to create blob"));
      },
      "image/jpeg",
      0.95 // High quality
    );
  });

  // Embed 300 DPI metadata into JPEG
  blob = await embedJpegDpi(blob, TARGET_DPI);

  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `collage-print-${interiorWidth.toFixed(1)}x${interiorHeight.toFixed(1)}-${timestamp}.jpg`;

  return {
    blob,
    filename,
    interiorWidthInches: interiorWidth,
    interiorHeightInches: interiorHeight,
    widthPixels: paperWidthPx,
    heightPixels: paperHeightPx,
    printCount,
    byoCount,
  };
}

/**
 * Draw a BYO (Bring Your Own) placeholder box
 * Shows dashed rectangle with "Mount your photo here" text centered
 */
function drawByoPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  openingWidthInches: number,
  openingHeightInches: number,
  isError = false
): void {
  // Light gray background
  ctx.fillStyle = isError ? "#FFF5F5" : "#F8F8F8";
  ctx.fillRect(x, y, width, height);

  // Dashed border (inset by bleed amount to show actual opening size)
  const bleedPx = MAT_BLEED_INCHES * TARGET_DPI;
  const openingX = x + bleedPx;
  const openingY = y + bleedPx;
  const openingWidth = width - bleedPx * 2;
  const openingHeight = height - bleedPx * 2;

  ctx.strokeStyle = isError ? "#DC2626" : "#9CA3AF";
  ctx.lineWidth = 3;
  ctx.setLineDash([15, 10]);
  ctx.strokeRect(openingX, openingY, openingWidth, openingHeight);
  ctx.setLineDash([]); // Reset dash

  // Text styling
  const fontSize = Math.max(24, Math.min(openingWidth / 12, 72));
  ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = isError ? "#DC2626" : "#6B7280";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Main text
  const centerX = openingX + openingWidth / 2;
  const centerY = openingY + openingHeight / 2;

  const mainText = isError ? "Image failed to load" : "Mount your photo here";
  ctx.fillText(mainText, centerX, centerY - fontSize * 0.6);

  // Size text (smaller)
  const sizeText = `${openingWidthInches}" × ${openingHeightInches}"`;
  ctx.font = `${fontSize * 0.7}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = "#9CA3AF";
  ctx.fillText(sizeText, centerX, centerY + fontSize * 0.6);
}

/**
 * Check resolution requirements for all collage photos
 * Returns info about which photos need upscaling
 */
export function checkCollageResolutions(config: CollagePrintConfig): {
  openingIndex: number;
  openingSize: { width: number; height: number };
  printSize: { width: number; height: number };
  imageSize: { width: number; height: number } | null;
  needsUpscaling: boolean;
  recommendedScale: 1 | 2 | 4 | 8 | 16;
}[] {
  const results: {
    openingIndex: number;
    openingSize: { width: number; height: number };
    printSize: { width: number; height: number };
    imageSize: { width: number; height: number } | null;
    needsUpscaling: boolean;
    recommendedScale: 1 | 2 | 4 | 8 | 16;
  }[] = [];

  config.openings.forEach((opening, index) => {
    const source = config.openingSources[index];
    const photoUrl = config.userPhotos[index];

    // Print size includes bleed
    const printWidth = opening.width + MAT_BLEED_INCHES * 2;
    const printHeight = opening.height + MAT_BLEED_INCHES * 2;

    if (source === "byo" || !photoUrl) {
      results.push({
        openingIndex: index,
        openingSize: { width: opening.width, height: opening.height },
        printSize: { width: printWidth, height: printHeight },
        imageSize: null,
        needsUpscaling: false,
        recommendedScale: 1,
      });
    } else {
      // For now, we can't get image dimensions from data URL synchronously
      // This will be resolved when images are loaded during generation
      results.push({
        openingIndex: index,
        openingSize: { width: opening.width, height: opening.height },
        printSize: { width: printWidth, height: printHeight },
        imageSize: null, // Will be determined during generation
        needsUpscaling: false, // Will be determined during generation
        recommendedScale: 1,
      });
    }
  });

  return results;
}

/**
 * Estimate collage print file size in MB
 */
export function estimateCollagePrintFileSize(
  frameWidth: number,
  frameHeight: number,
  frameMoldingWidth: number
): number {
  const interiorWidth = frameWidth - frameMoldingWidth * 2;
  const interiorHeight = frameHeight - frameMoldingWidth * 2;
  const widthPx = interiorWidth * TARGET_DPI;
  const heightPx = interiorHeight * TARGET_DPI;
  // JPEG at 95% quality is roughly 0.5-1 bytes per pixel
  const estimatedBytes = widthPx * heightPx * 0.75;
  return estimatedBytes / (1024 * 1024);
}

/**
 * Upload a collage print file to object storage
 *
 * @param blob - The print file blob
 * @param filename - The filename to save as
 * @returns Promise resolving to the uploaded file URL, or null if upload fails
 */
export async function uploadCollagePrintFile(
  blob: Blob,
  _filename: string
): Promise<string | null> {
  try {
    // Step 1: Get upload URL from server
    const uploadResponse = await fetch("/api/objects/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!uploadResponse.ok) {
      console.error("[Print Upload] Failed to get upload URL:", uploadResponse.status);
      return null;
    }

    const { uploadURL } = await uploadResponse.json();

    if (!uploadURL) {
      console.error("[Print Upload] No upload URL returned");
      return null;
    }

    // Step 2: Upload the blob directly to object storage
    const putResponse = await fetch(uploadURL, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": "image/jpeg",
      },
    });

    if (!putResponse.ok) {
      console.error("[Print Upload] Failed to upload file:", putResponse.status);
      return null;
    }

    // Step 3: Normalize the path via the frame-images endpoint
    const trackResponse = await fetch("/api/frame-images", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageURL: uploadURL,
        // Don't include dimensions - we don't need upscaling for the composite
      }),
    });

    if (!trackResponse.ok) {
      console.error("[Print Upload] Failed to track upload:", trackResponse.status);
      // Return the upload URL anyway since the file was uploaded
      return uploadURL;
    }

    const { objectPath } = await trackResponse.json();

    return objectPath;
  } catch (error) {
    console.error("[Print Upload] Error uploading collage print file:", error);
    return null;
  }
}
