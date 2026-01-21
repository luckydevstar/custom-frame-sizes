import { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useToast } from "../hooks/use-toast";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import "@uppy/core/css/style.css";
import "@uppy/dashboard/css/style.css";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { ImageEditor } from "./ImageEditor";
import { FrameSpinner } from "../ui/frame-spinner";

interface PhotoUploadOptionsProps {
  open: boolean;
  onClose: () => void;
  onGetUploadParameters: () => Promise<{ method: "PUT"; url: string }>;
  onComplete?: (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => void;
  onUrlSubmit?: (url: string) => void;
  onImageUpdate?: (url: string) => void; // Callback to update preview URL immediately after editing
}

export function PhotoUploadOptions({
  open,
  onClose,
  onGetUploadParameters,
  onComplete,
  onUrlSubmit,
  onImageUpdate,
}: PhotoUploadOptionsProps) {
  const { toast } = useToast();
  const [showUppy, setShowUppy] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image editor state
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  // Initialize Uppy instance
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize: 104857600, // 100MB
        allowedFileTypes: ["image/*"],
      },
      autoProceed: false,
      locale: {
        strings: {
          // Customize text for world-class UX
          dropHereOr: "Drop your photo here or %{browse}",
          browse: "browse",
          // Remove redundant file count mentions
          xFilesSelected: {
            0: "Ready to upload",
            1: "Ready to upload",
          },
          uploadXFiles: {
            0: "Continue",
            1: "Continue",
          },
          // Clear error messages
          exceedsSize: "Photo is too large. Maximum size: %{size}",
          youCanOnlyUploadFileTypes: "Please select an image file",
        },
        pluralize: (n: number) => (n === 1 ? 0 : 1),
      },
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: async (file) => {
          const params = await onGetUploadParameters();
          uppy.setFileMeta(file.id, { uploadURL: params.url });
          return params;
        },
      })
      .on("upload", () => {
        setIsUploading(true);
      })
      .on("complete", (result) => {
        setIsUploading(false);
        onComplete?.(result);
        setShowUppy(false);
        uppy.cancelAll();
        onClose();
      })
      .on("cancel-all", () => {
        setIsUploading(false);
      })
      .on("error", () => {
        setIsUploading(false);
      })
  );

  const handleDeviceUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear the input value immediately so the same file can be selected again
    event.target.value = "";

    // Create a preview URL for the editor
    const previewUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setFilePreviewUrl(previewUrl);
    setShowEditor(true);
  };

  const handleEditorComplete = async (editedBlob: Blob) => {
    if (!selectedFile) return;

    try {
      // Convert blob to file
      const editedFile = new File([editedBlob], selectedFile.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      // Create a new preview URL from the edited blob BEFORE revoking the old one
      const newPreviewUrl = URL.createObjectURL(editedBlob);

      // Update the parent component's image immediately so the preview doesn't break
      if (onImageUpdate) {
        onImageUpdate(newPreviewUrl);
      }

      // Add to Uppy
      uppy.addFile({
        name: editedFile.name,
        type: editedFile.type,
        data: editedFile,
      });

      // Clean up - now safe to revoke old URL since we have a new one
      setShowEditor(false);
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
      setFilePreviewUrl(null);
      setSelectedFile(null);

      // Show Uppy dashboard for upload
      setShowUppy(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process edited image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setFilePreviewUrl(null);
    setSelectedFile(null);
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingUrl(true);
    try {
      // Validate URL points to an image
      const img = new Image();
      img.onload = () => {
        onUrlSubmit?.(urlInput);
        setUrlInput("");
        setIsLoadingUrl(false);
        onClose();
      };
      img.onerror = () => {
        setIsLoadingUrl(false);
        toast({
          title: "Invalid Image URL",
          description: "The URL doesn't point to a valid image.",
          variant: "destructive",
        });
      };
      img.src = urlInput;
    } catch (error) {
      setIsLoadingUrl(false);
      toast({
        title: "Error",
        description: "Failed to load image from URL.",
        variant: "destructive",
      });
    }
  };

  // Clear file input when modal closes to allow re-selecting the same file
  useEffect(() => {
    if (!open && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [open]);

  // Cleanup Uppy on unmount
  useEffect(() => {
    return () => {
      uppy.destroy();
    };
  }, [uppy]);

  return (
    <>
      <Dialog open={open && !showUppy && !showEditor} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-upload-options">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">Upload Your Photo</DialogTitle>
            <DialogDescription className="text-sm">
              Choose how you&apos;d like to upload your photo for framing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {/* Hidden file input for native picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file-hidden"
            />

            {/* Primary: Device Photo Library */}
            <Button
              onClick={handleDeviceUpload}
              className="w-full h-auto py-4 text-base md:text-lg"
              size="lg"
              data-testid="button-device-upload"
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              Choose from Device
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* URL Input - Collapsed by default on mobile */}
            <div className="space-y-2">
              <Label htmlFor="url-input" className="text-sm">
                Or paste an image URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                  data-testid="input-url"
                />
                <Button
                  onClick={handleUrlSubmit}
                  disabled={isLoadingUrl || !urlInput.trim()}
                  data-testid="button-url-submit"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Paste a direct link to an image file</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Editor */}
      {showEditor && filePreviewUrl && (
        <ImageEditor
          imageUrl={filePreviewUrl}
          onComplete={handleEditorComplete}
          onCancel={handleEditorCancel}
        />
      )}

      {/* Uppy Dashboard Modal */}
      <DashboardModal
        uppy={uppy}
        open={showUppy}
        onRequestClose={() => setShowUppy(false)}
        proudlyDisplayPoweredByUppy={false}
      />

      {/* Upload Loading Overlay */}
      {isUploading && (
        <Dialog open={isUploading}>
          <DialogContent
            className="sm:max-w-md flex items-center justify-center min-h-[200px]"
            data-testid="dialog-upload-loading"
          >
            <FrameSpinner size="lg" text="Uploading your photo..." />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
