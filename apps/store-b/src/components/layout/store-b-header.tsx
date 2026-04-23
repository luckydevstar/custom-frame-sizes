"use client";

import { Header } from "@framecraft/ui/components/layout";
import { MobileNavigation } from "@framecraft/ui/components/navigation";

import { StoreBDesktopNav } from "./store-b-desktop-nav";

const SHADOWBOX_HUB_HREF = "/shadowbox/designer";

/** Header with ShadowboxFrames.com nav (b-shadow-box-frames-original), not store-a defaults. */
export function StoreBHeader() {
  return (
    <Header
      desktopNavigation={<StoreBDesktopNav />}
      mobileNavigation={<MobileNavigation shadowboxHubHref={SHADOWBOX_HUB_HREF} />}
    />
  );
}
