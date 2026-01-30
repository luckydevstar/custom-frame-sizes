"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { Wand2, Crop as CropIcon, RotateCw, Check, X } from "lucide-react";
import { useIsMobile } from "@framecraft/core";

interface ImageEditorProps {
  imageUrl: string;
  onComplete: (editedBlob: Blob) => void;
  onCancel: () => void;
}

export function ImageEditor({ imageUrl, onComplete, onCancel }: ImageEditorProps) {
  const isMobile = useIsMobile();
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [appliedCrop, setAppliedCrop] = useState<PixelCrop>(); // Track the applied (committed) crop
  const [preCropImageUrl, setPreCropImageUrl] = useState<string>(""); // Store image before crop for undo
  const [rotation, setRotation] = useState(0);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [activeTab, setActiveTab] = useState("enhance");
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl); // Track the current rotated/enhanced image

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Load original image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      originalImageRef.current = img;
    };
  }, [imageUrl]);

  // Apply enhance filter (simple, natural enhancement)
  const handleEnhance = () => {
    if (!imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple, natural enhancement focusing on brightness, contrast, and saturation
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i] ?? 0;
      let g = data[i + 1] ?? 0;
      let b = data[i + 2] ?? 0;

      // Brightness boost (+8%)
      r *= 1.08;
      g *= 1.08;
      b *= 1.08;

      // Contrast boost (+10%)
      const contrastFactor = 1.1;
      r = (r - 128) * contrastFactor + 128;
      g = (g - 128) * contrastFactor + 128;
      b = (b - 128) * contrastFactor + 128;

      // Saturation boost (+15%)
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const saturationFactor = 1.15;
      r = gray + (r - gray) * saturationFactor;
      g = gray + (g - gray) * saturationFactor;
      b = gray + (b - gray) * saturationFactor;

      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    // Apply subtle sharpness
    const sharpenedData = applySharpen(imageData, 0.08);
    ctx.putImageData(sharpenedData, 0, 0);

    // Update the displayed image
    const enhancedDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCurrentImageUrl(enhancedDataUrl);

    setIsEnhanced(true);
  };

  // Reset enhancement to original
  const handleResetEnhance = () => {
    setCurrentImageUrl(imageUrl);
    setIsEnhanced(false);
  };

  // Apply crop - commit the crop and update the current image
  const handleApplyCrop = () => {
    if (!imgRef.current || !canvasRef.current || !completedCrop) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;

    // Save the current image URL before cropping (for undo)
    setPreCropImageUrl(currentImageUrl);

    // Calculate scale factor between displayed and natural image size
    // ReactCrop gives us coordinates in displayed pixels, we need natural pixels
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    // Scale crop coordinates to natural image size
    const naturalCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
    };

    // Draw the full current image first
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    // Create cropped version using natural coordinates
    const cropCanvas = document.createElement("canvas");
    const cropCtx = cropCanvas.getContext("2d");
    if (!cropCtx) return;

    cropCanvas.width = naturalCrop.width;
    cropCanvas.height = naturalCrop.height;

    cropCtx.drawImage(
      canvas,
      naturalCrop.x,
      naturalCrop.y,
      naturalCrop.width,
      naturalCrop.height,
      0,
      0,
      naturalCrop.width,
      naturalCrop.height
    );

    // Update the displayed image with cropped version
    const croppedDataUrl = cropCanvas.toDataURL("image/jpeg", 0.95);
    setCurrentImageUrl(croppedDataUrl);

    // Store that we've applied this crop (store the original for reference)
    setAppliedCrop(completedCrop);

    // Clear crop selection
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  // Reset applied crop - restore to pre-crop state
  const handleResetAppliedCrop = () => {
    if (!preCropImageUrl) return;

    // Restore the pre-crop image
    setCurrentImageUrl(preCropImageUrl);

    // Clear crop states
    setAppliedCrop(undefined);
    setPreCropImageUrl("");
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  // Rotate image by 90 degrees - apply to actual bitmap
  const handleRotate = () => {
    if (!imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    const newRotation = (rotation + 90) % 360;

    // Swap dimensions for 90/270 degree rotations
    if (newRotation === 90 || newRotation === 270) {
      canvas.width = img.naturalHeight;
      canvas.height = img.naturalWidth;
    } else {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    // Apply rotation to the bitmap
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((newRotation * Math.PI) / 180);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();

    // Update the displayed image with rotated version
    const rotatedDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCurrentImageUrl(rotatedDataUrl);
    setRotation(newRotation);

    // Reset crop when rotating
    setCrop(undefined);
    setCompletedCrop(undefined);
    setAppliedCrop(undefined);
    setPreCropImageUrl("");
  };

  // Complete editing and return the final image
  const handleComplete = async () => {
    // If there's an unapplied crop, apply it first
    if (completedCrop && completedCrop.width && completedCrop.height) {
      handleApplyCrop();
      // Wait a tick for the crop to be applied
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // Create a new image from the current data URL to ensure it's fully loaded
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw the current image (already has all edits applied)
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Convert to blob, preserving quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onComplete(blob);
          }
        },
        "image/jpeg",
        0.95
      );
    };

    // Load the current image URL
    img.src = currentImageUrl;
  };

  return (
    <div
      className="fixed inset-0 bg-background z-[99999] flex flex-col"
      style={{ isolation: "isolate" }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Edit Photo</h2>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="enhance" data-testid="tab-enhance">
              <Wand2 className="w-4 h-4 mr-2" />
              Enhance
            </TabsTrigger>
            <TabsTrigger value="crop" data-testid="tab-crop">
              <CropIcon className="w-4 h-4 mr-2" />
              Crop
            </TabsTrigger>
            <TabsTrigger value="rotate" data-testid="tab-rotate">
              <RotateCw className="w-4 h-4 mr-2" />
              Rotate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enhance" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                {/* Mobile: Cancel/Done at top */}
                {isMobile && (
                  <div className="flex justify-end gap-2 pb-4 border-b">
                    <Button variant="outline" onClick={onCancel} data-testid="button-cancel-edit">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleComplete} data-testid="button-complete-edit">
                      <Check className="w-4 h-4 mr-2" />
                      Done
                    </Button>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-2">Vivid Enhancement</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Automatically enhance your photo with professional-quality adjustments for
                      brilliance, contrast, and color vibrancy.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleEnhance}
                        disabled={isEnhanced}
                        data-testid="button-enhance"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {isEnhanced ? "Enhanced ✓" : "Apply Enhancement"}
                      </Button>
                      {isEnhanced && (
                        <Button
                          variant="outline"
                          onClick={handleResetEnhance}
                          data-testid="button-reset-enhance"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center bg-muted rounded-lg p-4">
                  <img
                    ref={imgRef}
                    src={currentImageUrl}
                    alt="Preview"
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                </div>
                {/* Desktop: Cancel/Done at bottom */}
                {!isMobile && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={onCancel} data-testid="button-cancel-edit">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleComplete} data-testid="button-complete-edit">
                      <Check className="w-4 h-4 mr-2" />
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="crop" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                {/* Mobile: Cancel/Done at top */}
                {isMobile && (
                  <div className="flex justify-end gap-2 pb-4 border-b">
                    <Button variant="outline" onClick={onCancel} data-testid="button-cancel-edit">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleComplete} data-testid="button-complete-edit">
                      <Check className="w-4 h-4 mr-2" />
                      Done
                    </Button>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-2">Crop Image</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select the area you want to keep. Drag the corners to adjust, then click
                      &quot;Apply Crop&quot; to commit.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {completedCrop && (
                      <Button onClick={handleApplyCrop} size="sm" data-testid="button-apply-crop">
                        <Check className="w-4 h-4 mr-2" />
                        Apply Crop
                      </Button>
                    )}
                    {(completedCrop || appliedCrop) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (appliedCrop) {
                            handleResetAppliedCrop();
                          } else {
                            setCrop(undefined);
                            setCompletedCrop(undefined);
                          }
                        }}
                        data-testid="button-reset-crop"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex justify-center bg-muted rounded-lg p-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                  >
                    <img
                      ref={imgRef}
                      src={currentImageUrl}
                      alt="Crop preview"
                      className="max-w-full max-h-[60vh]"
                    />
                  </ReactCrop>
                </div>
                {appliedCrop && !completedCrop && (
                  <p className="text-sm text-success text-center">✓ Crop applied successfully</p>
                )}
                {/* Desktop: Cancel/Done at bottom */}
                {!isMobile && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={onCancel} data-testid="button-cancel-edit">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleComplete} data-testid="button-complete-edit">
                      <Check className="w-4 h-4 mr-2" />
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rotate" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                {/* Mobile: Cancel/Done at top */}
                {isMobile && (
                  <div className="flex justify-end gap-2 pb-4 border-b">
                    <Button variant="outline" onClick={onCancel} data-testid="button-cancel-edit">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleComplete} data-testid="button-complete-edit">
                      <Check className="w-4 h-4 mr-2" />
                      Done
                    </Button>
                  </div>
                )}
                <div>
                  <h3 className="font-medium mb-2">Rotate Image</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rotate your image in 90-degree increments.
                  </p>
                  <Button onClick={handleRotate} data-testid="button-rotate">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Rotate 90°
                  </Button>
                  <span className="ml-4 text-sm text-muted-foreground">Current: {rotation}°</span>
                </div>
                <div className="flex justify-center bg-muted rounded-lg p-4">
                  <img
                    ref={imgRef}
                    src={currentImageUrl}
                    alt="Preview"
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                </div>
                {/* Desktop: Cancel/Done at bottom */}
                {!isMobile && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={onCancel} data-testid="button-cancel-edit">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleComplete} data-testid="button-complete-edit">
                      <Check className="w-4 h-4 mr-2" />
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// Apply sharpness using unsharp mask
function applySharpen(imageData: ImageData, amount: number): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  // Simple 3x3 sharpen kernel
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[(ky + 1) * 3 + (kx + 1)] ?? 0;

          r += (src[idx] ?? 0) * weight;
          g += (src[idx + 1] ?? 0) * weight;
          b += (src[idx + 2] ?? 0) * weight;
        }
      }

      const idx = (y * width + x) * 4;

      // Blend with original based on amount
      dst[idx] = (src[idx] ?? 0) * (1 - amount) + r * amount;
      dst[idx + 1] = (src[idx + 1] ?? 0) * (1 - amount) + g * amount;
      dst[idx + 2] = (src[idx + 2] ?? 0) * (1 - amount) + b * amount;
      dst[idx + 3] = src[idx + 3] ?? 255;
    }
  }

  return output;
}
