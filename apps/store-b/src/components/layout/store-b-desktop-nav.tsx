"use client";

import {
  ComponentsMegaMenu,
  MegaMenu,
  PictureFramesMegaMenu,
  ShadowboxMegaMenu,
} from "@framecraft/ui/components/navigation";

const SHADOWBOX_HUB_HREF = "/shadowbox/designer";
import { Button } from "@framecraft/ui/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Desktop nav order matches b-shadow-box-frames-original Header.tsx
 * (Shadowboxes first, then Picture Frames — not store-a defaults).
 */
export function StoreBDesktopNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <MegaMenu
        label="Shadowboxes"
        isActive={
          isActive("/shadowbox") ||
          isActive("/jersey-frames") ||
          isActive("/military-frames") ||
          isActive("/newspaper-frames") ||
          isActive("/playbill-frames")
        }
      >
        <ShadowboxMegaMenu viewAllHref={SHADOWBOX_HUB_HREF} />
      </MegaMenu>

      <MegaMenu
        label="Picture Frames"
        isActive={
          isActive("/picture-frames") ||
          isActive("/frames/") ||
          isActive("/diploma-certificate-frames") ||
          isActive("/puzzle-frames") ||
          isActive("/challenge-coin-frames") ||
          pathname.includes("/specialty/record")
        }
      >
        <PictureFramesMegaMenu />
      </MegaMenu>

      <Button variant={isActive("/canvas-frames") ? "secondary" : "ghost"} asChild className="min-h-11" data-testid="link-nav-canvas-frames">
        <Link href="/canvas-frames">Canvas Frames</Link>
      </Button>

      <MegaMenu label="Components" isActive={isActive("/components") || isActive("/mat-board-guide")}>
        <ComponentsMegaMenu />
      </MegaMenu>

      <Button variant={isActive("/learn") ? "secondary" : "ghost"} asChild className="min-h-11" data-testid="link-nav-learn">
        <Link href="/learn">Learn</Link>
      </Button>

      <Button variant={isActive("/contact") ? "secondary" : "ghost"} asChild className="min-h-11" data-testid="link-nav-contact">
        <Link href="/contact">Contact</Link>
      </Button>

      <Button variant={isActive("/business") ? "secondary" : "ghost"} asChild className="min-h-11" data-testid="link-nav-b2b">
        <Link href="/business">B2B</Link>
      </Button>
    </>
  );
}
