import { useState, useEffect, useRef } from "react";
import "@google/model-viewer";
import type { FrameConfiguration, FrameStyle, MatColor } from "@framecraft/types";
import { Button } from "../ui/button";
import { X, RotateCw, Info, Lock } from "lucide-react";
import { Card } from "../ui/card";
import { generateARModelBlob } from "@framecraft/core";
import { convertImageToDataURL } from "@framecraft/core";
import { useQuery } from "@tanstack/react-query";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

interface ARViewerProps {
  config: FrameConfiguration;
  onClose: () => void;
  onSizeUpdate?: (newWidth: number, newHeight: number) => void;
}

export function ARViewer({ config, onClose, onSizeUpdate }: ARViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isARSupported, setIsARSupported] = useState(false);
  const [currentScale, setCurrentScale] = useState(1.0);
  const [isInARMode, setIsInARMode] = useState(false);
  const modelViewerRef = useRef<any>(null);

  // Fetch frame style data
  const { data: frameStyles, isLoading: isLoadingFrameStyles } = useQuery<FrameStyle[]>({
    queryKey: ["/api/frames/styles"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
  });

  // Fetch mat catalog data (contains mat-1, mat-2, mat-3, etc.)
  const { data: matCatalog, isLoading: isLoadingMatColors } = useQuery<{ mats: MatColor[] }>({
    queryKey: ["/api/mats"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
  });

  const matColors = matCatalog?.mats;

  // Cleanup blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  useEffect(() => {
    // Check AR support
    if ("xr" in navigator) {
      (navigator as any).xr?.isSessionSupported("immersive-ar").then((supported: boolean) => {
        setIsARSupported(supported);
      });
    }
  }, []);

  // Listen for AR session start/end and scale changes
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleARStatus = (event: any) => {
      const isActive = event.detail.status === "session-started";
      setIsInARMode(isActive);
      if (!isActive) {
        // Reset scale when exiting AR
        setCurrentScale(1.0);
      }
    };

    const handleScaleChange = () => {
      if (viewer.scale) {
        // model-viewer stores scale as a string like "1.5 1.5 1.5"
        const scaleValue = parseFloat(viewer.scale.split(" ")[0]);
        if (!isNaN(scaleValue) && scaleValue !== currentScale) {
          setCurrentScale(scaleValue);
        }
      }
    };

    // Listen for AR session events
    viewer.addEventListener("ar-status", handleARStatus);

    // Listen for scale changes (when user pinches to resize)
    viewer.addEventListener("scale-change", handleScaleChange);

    // Poll for scale changes as backup (model-viewer doesn't always fire scale-change)
    const scaleInterval = setInterval(() => {
      if (isInARMode && viewer.scale) {
        handleScaleChange();
      }
    }, 500);

    return () => {
      viewer.removeEventListener("ar-status", handleARStatus);
      viewer.removeEventListener("scale-change", handleScaleChange);
      clearInterval(scaleInterval);
    };
  }, [isInARMode, currentScale]);

  // Generate AR model when data is loaded
  useEffect(() => {
    // Wait for required data to load
    const needsMat = config.matType !== "none";
    const dataReady = frameStyles && (!needsMat || matColors);

    if (dataReady && !isLoadingFrameStyles && !isLoadingMatColors) {
      generateModel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, frameStyles, matColors, isLoadingFrameStyles, isLoadingMatColors]);

  const generateModel = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get frame style
      if (!frameStyles) {
        throw new Error("Frame styles not loaded");
      }

      const frameStyle = frameStyles.find((s) => s.id === config.frameStyleId);
      if (!frameStyle) {
        throw new Error("Frame style not found");
      }

      // Get mat colors if applicable
      let matColor: MatColor | undefined;
      let matInnerColor: MatColor | undefined;

      if (config.matType !== "none" && matColors) {
        matColor = matColors.find((c) => c.id === config.matColorId);

        if (config.matType === "double") {
          matInnerColor = matColors.find((c) => c.id === config.matInnerColorId);
        }
      }

      // Convert image URL to data URL if needed
      let imageDataUrl: string | undefined;
      if (config.imageUrl) {
        try {
          // Convert image to data URL (handles CORS for stock images)
          imageDataUrl = await convertImageToDataURL(config.imageUrl);
        } catch (imageError) {
          console.error("[AR Viewer] Error loading image:", imageError);
          // Continue without image
        }
      }

      // Generate model client-side (avoids Node.js FileReader issues)
      const blobUrl = await generateARModelBlob({
        config,
        frameStyle,
        matColor,
        matInnerColor,
        imageDataUrl,
      });

      setModelUrl(blobUrl);
    } catch (err) {
      console.error("[AR Viewer] Error generating model:", err);
      setError(err instanceof Error ? err.message : "Failed to load AR model");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRotate = () => {
    if (modelViewerRef.current) {
      const currentRotation = modelViewerRef.current.getCameraOrbit();
      modelViewerRef.current.cameraOrbit = `${currentRotation.theta}deg ${currentRotation.phi}deg ${currentRotation.radius}m`;
    }
  };

  const handleLockSize = () => {
    if (!onSizeUpdate || currentScale === 1.0) return;

    // Calculate new dimensions based on scale
    const originalWidth = config.artworkWidth;
    const originalHeight = config.artworkHeight;

    const newWidth = Math.round(originalWidth * currentScale * 100) / 100; // Round to 2 decimals
    const newHeight = Math.round(originalHeight * currentScale * 100) / 100;

    // Call the callback with new dimensions
    onSizeUpdate(newWidth, newHeight);

    // Close AR viewer
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">AR View Error</h2>
            <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-ar">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onClose} className="w-full" data-testid="button-dismiss-error">
            Close
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur relative z-10">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">AR Preview</h2>
          {isLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          data-testid="button-close-ar-viewer"
          className="relative z-20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* AR Viewer */}
      <div className="flex-1 relative">
        {modelUrl && (
          <model-viewer
            ref={modelViewerRef}
            src={modelUrl}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            touch-action="pan-y"
            alt="Custom Frame AR Preview"
            style={{
              width: "100%",
              height: "100%",
            }}
            data-testid="model-viewer"
          >
            {/* AR Button - shown when AR is supported */}
            <button
              slot="ar-button"
              style={{ display: "none" }}
              data-testid="button-activate-ar-slot"
            >
              View on Your Wall
            </button>

            {/* Loading indicator */}
            {isLoading && (
              <div
                slot="poster"
                className="absolute inset-0 flex items-center justify-center bg-muted"
              >
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating 3D model...</p>
                </div>
              </div>
            )}
          </model-viewer>
        )}

        {/* AR Activation Button - Shows when not resized yet */}
        {!isLoading && modelUrl && currentScale === 1.0 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
            <Button
              size="lg"
              className="shadow-xl"
              onClick={() => {
                // Trigger AR mode if supported
                if (modelViewerRef.current) {
                  const canActivateAR = modelViewerRef.current.canActivateAR;
                  if (canActivateAR) {
                    modelViewerRef.current.activateAR();
                  } else {
                    alert(
                      "AR requires a mobile device with iOS 12+ (Safari) or Android 8+ (Chrome). On desktop, you can rotate and zoom the 3D model using your mouse."
                    );
                  }
                }
              }}
              data-testid="button-activate-ar"
            >
              View on Your Wall
            </Button>
          </div>
        )}

        {/* Instructions Card */}
        {!isLoading && modelUrl && !isInARMode && (
          <div className="absolute top-4 left-4 right-4 md:left-auto md:w-80">
            <Card className="p-4 bg-background/95 backdrop-blur">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm space-y-2">
                  <p className="font-medium">How to use AR:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Tap &quot;View on Your Wall&quot; below</li>
                    <li>Point your camera at a wall</li>
                    <li>Tap to place the frame and see how it looks</li>
                  </ol>
                  {!isARSupported && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                      AR mode works best on mobile devices with iOS 12+ (Safari) or Android 8+
                      (Chrome)
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* AR Resize Indicator - Shows current size when in AR mode */}
        {isInARMode && currentScale !== 1.0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <Card className="p-3 bg-background/95 backdrop-blur">
              <div className="text-center text-sm">
                <p className="font-medium">
                  New Size: {Math.round(config.artworkWidth * currentScale * 100) / 100}&quot; ×{" "}
                  {Math.round(config.artworkHeight * currentScale * 100) / 100}&quot;
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentScale > 1
                    ? `${Math.round((currentScale - 1) * 100)}% larger`
                    : `${Math.round((1 - currentScale) * 100)}% smaller`}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Lock Size Button - Shows when user has resized in AR */}
        {onSizeUpdate && currentScale !== 1.0 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
            <Button
              size="lg"
              className="shadow-xl"
              onClick={handleLockSize}
              data-testid="button-lock-size"
            >
              <Lock className="h-5 w-5 mr-2" />
              Lock Size & Update Cart
            </Button>
          </div>
        )}
      </div>

      {/* Controls Footer */}
      {!isLoading && modelUrl && (
        <div className="border-t bg-background/95 backdrop-blur p-4">
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="flex items-center gap-2"
              data-testid="button-rotate-model"
            >
              <RotateCw className="h-4 w-4" />
              Rotate
            </Button>
          </div>

          {/* Frame Details */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              {currentScale !== 1.0 && "Original: "}
              {config.artworkWidth}&quot; × {config.artworkHeight}&quot;
              {config.matType !== "none" && ` with ${config.matType} mat`}
            </p>
            {currentScale !== 1.0 && (
              <p className="mt-1 text-primary font-medium">
                Adjusted: {Math.round(config.artworkWidth * currentScale * 100) / 100}&quot; ×{" "}
                {Math.round(config.artworkHeight * currentScale * 100) / 100}&quot;
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
