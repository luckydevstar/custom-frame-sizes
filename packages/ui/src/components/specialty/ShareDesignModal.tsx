"use client";

import { Mail, Copy, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useToast } from "../../hooks/use-toast";

interface ShareDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  designUrl: string;
  isMobile?: boolean;
  onEmailSend?: (data: EmailShareData) => Promise<void>;
}

export interface EmailShareData {
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  optInMarketing: boolean;
  note?: string;
}

export function ShareDesignModal({
  isOpen,
  onClose,
  designUrl,
  isMobile = false,
  onEmailSend,
}: ShareDesignModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"link" | "email">("link");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [optInMarketing, setOptInMarketing] = useState(false);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileView, setIsMobileView] = useState(isMobile);

  useEffect(() => {
    // Detect mobile on mount and resize
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(designUrl);
    toast({
      title: "Link copied!",
      description: "Your design link has been copied to clipboard",
    });
    // Keep modal open so user can still email if they want
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName.trim()) {
      toast({ title: "Please enter your name" });
      return;
    }
    if (!senderEmail.trim()) {
      toast({ title: "Please enter your email address" });
      return;
    }
    if (!recipientEmail.trim()) {
      toast({ title: "Please enter recipient's email address" });
      return;
    }

    setIsSubmitting(true);

    try {
      if (onEmailSend) {
        await onEmailSend({
          senderName,
          senderEmail,
          recipientEmail,
          optInMarketing,
          note,
        });
      } else {
        // Fallback: make API call
        const response = await fetch("/api/share-design", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderName,
            senderEmail,
            recipientEmail,
            optInMarketing,
            note,
            designUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send email");
        }
      }

      toast({
        title: "Design shared!",
        description: `Email sent to ${recipientEmail}`,
      });

      // Reset form
      setSenderName("");
      setSenderEmail("");
      setRecipientEmail("");
      setOptInMarketing(false);
      setNote("");
      setActiveTab("link");
      onClose();
    } catch (error) {
      toast({
        title: "Error sending email",
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contentComponent = (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("link")}
          className={`pb-2 px-2 text-sm font-medium transition-colors ${
            activeTab === "link"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Copy Link
        </button>
        <button
          onClick={() => setActiveTab("email")}
          className={`pb-2 px-2 text-sm font-medium transition-colors ${
            activeTab === "email"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Email
        </button>
      </div>

      {/* Link Tab */}
      {activeTab === "link" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="design-url" className="text-sm">
              Share this link
            </Label>
            <div className="flex gap-2">
              <Input
                id="design-url"
                value={designUrl}
                readOnly
                className="text-xs"
              />
              <Button
                onClick={handleCopyLink}
                size="sm"
                className="flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Anyone with this link can view your frame design and customize it
            further.
          </p>
        </div>
      )}

      {/* Email Tab */}
      {activeTab === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="sender-name" className="text-sm">
              Your Name
            </Label>
            <Input
              id="sender-name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="John Doe"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender-email" className="text-sm">
              Your Email
            </Label>
            <Input
              id="sender-email"
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-email" className="text-sm">
              Recipient Email
            </Label>
            <Input
              id="recipient-email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="friend@example.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm">
              Optional Message
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a personal note (optional)"
              disabled={isSubmitting}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex items-center space-x-2 py-1">
            <Checkbox
              id="opt-in-marketing"
              checked={optInMarketing}
              onCheckedChange={(checked) => setOptInMarketing(checked === true)}
              disabled={isSubmitting}
            />
            <Label
              htmlFor="opt-in-marketing"
              className="text-xs font-normal cursor-pointer"
            >
              I'd like to receive updates about custom framing from CustomFrameSizes
            </Label>
          </div>

          <p className="text-xs text-muted-foreground">
            The recipient will receive one email with your design and a link to
            view/customize it. We don't add them to our mailing list.
          </p>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Sending..." : "Send Design"}
          </Button>
        </form>
      )}
    </div>
  );

  if (isMobileView) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Share This Design</DrawerTitle>
            <DrawerDescription>
              Share your frame design with others
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {contentComponent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share This Design</DialogTitle>
          <DialogDescription>
            Share your frame design with others
          </DialogDescription>
        </DialogHeader>
        {contentComponent}
      </DialogContent>
    </Dialog>
  );
}
