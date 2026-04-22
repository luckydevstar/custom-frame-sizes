"use client";

import { Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { useToast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { FrameSpinner } from "../ui/frame-spinner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

import { ImageEditor } from "./ImageEditor";

import type { UploadResult } from "@uppy/core";

const MAX_FILE_BYTES = 104857600; // 100MB (match previous Uppy limit)

interface PhotoUploadOptionsProps {
  open: boolean;
  onClose: () => void;
  /**
   * Same-origin upload endpoint (multipart). Default works for Next.js store-a `/api/objects/upload`.
   * Browser never calls R2 directly, so R2 bucket CORS is not required for this path.
   */
  sameOriginUploadUrl?: string;
  onComplete?: (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => void;
  onUrlSubmit?: (url: string) => void;
  onImageUpdate?: (url: string) => void; // Callback to update preview URL immediately after editing
}

export function PhotoUploadOptions({
  open,
  onClose,
  sameOriginUploadUrl = "/api/objects/upload",
  onComplete,
  onUrlSubmit,
  onImageUpdate,
}: PhotoUploadOptionsProps) {
  const { toast } = useToast();
  const [urlInput, setUrlInput] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const handleDeviceUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    if (file.size > MAX_FILE_BYTES) {
      toast({
        title: "File too large",
        description: "Photo is too large. Maximum size: 100 MB",
        variant: "destructive",
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setFilePreviewUrl(previewUrl);
    setShowEditor(true);
  };

  const handleEditorComplete = async (editedBlob: Blob) => {
    if (!selectedFile) return;

    const editedFile = new File([editedBlob], selectedFile.name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    if (editedFile.size > MAX_FILE_BYTES) {
      toast({
        title: "File too large",
        description: "Photo is too large. Maximum size: 100 MB",
        variant: "destructive",
      });
      return;
    }

    const newPreviewUrl = URL.createObjectURL(editedBlob);

    if (onImageUpdate) {
      onImageUpdate(newPreviewUrl);
    }

    // Show upload overlay first, then close editor — avoids main "Upload Your Photo" dialog flashing open
    // while `open` is still true (that dialog uses `open && !showEditor && !isUploading`).
    setIsUploading(true);
    setShowEditor(false);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setFilePreviewUrl(null);
    setSelectedFile(null);

    try {
      const formData = new FormData();
      formData.append("file", editedFile);

      const res = await fetch(sameOriginUploadUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = (await res.json().catch(() => ({}))) as { objectPath?: string; error?: string };
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : `Upload failed (${res.status})`,
        );
      }

      const uploadURL = data.objectPath;
      if (!uploadURL) {
        throw new Error("Server did not return objectPath.");
      }
      const resultPayload = {
        successful: [
          {
            id: "r2-direct-upload",
            name: editedFile.name,
            meta: { uploadURL },
          },
        ],
        failed: [],
      };
      onComplete?.(
        resultPayload as unknown as UploadResult<Record<string, unknown>, Record<string, unknown>>,
      );

      onClose();
    } catch (error) {
      console.error("[PhotoUploadOptions] R2 upload failed:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
    } catch {
      setIsLoadingUrl(false);
      toast({
        title: "Error",
        description: "Failed to load image from URL.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!open && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setShowEditor(false);
      setIsUploading(false);
    }
  }, [open]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    if (!open && !showEditor && !isUploading) {
      if (htmlEl.style.overflow === "hidden") {
        htmlEl.style.overflow = "";
      }
      if (bodyEl.style.overflow === "hidden") {
        bodyEl.style.overflow = "";
      }
    }
  }, [open, showEditor, isUploading]);

  return (
    <>
      <Dialog open={open && !showEditor && !isUploading} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-upload-options">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">Upload Your Photo</DialogTitle>
            <DialogDescription className="text-sm">
              Choose how you&apos;d like to upload your photo for framing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file-hidden"
              aria-label="Upload artwork image"
            />

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
                  aria-label="Submit image URL"
                  className="min-h-11 min-w-11 shrink-0 px-3"
                >
                  <LinkIcon className="h-4 w-4" aria-hidden />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Paste a direct link to an image file</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showEditor && filePreviewUrl && (
        <ImageEditor
          imageUrl={filePreviewUrl}
          onComplete={handleEditorComplete}
          onCancel={handleEditorCancel}
        />
      )}

      {isUploading && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80"
          data-testid="dialog-upload-loading"
        >
          <div className="sm:max-w-md flex items-center justify-center min-h-[200px] rounded-lg bg-background shadow-lg px-6 py-4">
            <FrameSpinner size="lg" text="Uploading your photo..." />
          </div>
        </div>
      )}
    </>
  );
}
