/**
 * Header Component
 *
 * Layout component for site header with navigation, search, cart, and theme toggle.
 * Updated for Next.js App Router and store-config awareness (P2-004).
 *
 * @packageDocumentation
 */

"use client";

import { useStoreConfig } from "@framecraft/core";
import { useCartStore, cartSelectors } from "@framecraft/core/stores";
import { ShoppingCart, Phone, Mail, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement, isValidElement, useState, type ReactNode } from "react";

import { Logo } from "../brand/Logo";
import { ComponentsMegaMenu } from "../navigation/ComponentsMegaMenu";
import { MegaMenu } from "../navigation/MegaMenu";
import { MobileNavigation } from "../navigation/MobileNavigation";
import { PictureFramesMegaMenu } from "../navigation/PictureFramesMegaMenu";
import { SearchBar } from "../navigation/SearchBar";
import { ShadowboxMegaMenu } from "../navigation/ShadowboxMegaMenu";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

import { ThemeToggle } from "./ThemeToggle";

export interface HeaderProps {
  /**
   * Logo component to display
   * If not provided, will use store config logo or default
   */
  logo?: ReactNode;

  /**
   * Theme toggle component
   * If not provided, will not show theme toggle
   */
  themeToggle?: ReactNode;

  /**
   * Desktop navigation content
   * If not provided, will show minimal navigation
   */
  desktopNavigation?: ReactNode;

  /**
   * Search bar component
   * If not provided, will not show search
   */
  searchBar?: ReactNode;

  /**
   * Mobile navigation content
   * If not provided, will not show mobile menu
   */
  mobileNavigation?: ReactNode;

  /**
   * Callback when cart button is clicked
   * If not provided, will navigate to /cart
   */
  onCartClick?: () => void;

  /**
   * Override show utility bar (defaults to true)
   */
  showUtilityBar?: boolean;
}

export function Header({
  logo,
  themeToggle,
  desktopNavigation,
  searchBar,
  mobileNavigation,
  onCartClick,
  showUtilityBar = true,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const storeConfig = useStoreConfig();

  // Get cart count from cart store
  const cartCount = useCartStore(cartSelectors.totalQuantity);

  // Get contact info from store config metadata
  const phone = (storeConfig.metadata?.contactPhone as string) || undefined;
  const email = (storeConfig.metadata?.contactEmail as string) || undefined;

  // Helper to check if a nav link is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Default logo if not provided - use Logo component with theme awareness
  const displayLogo = logo || (
    <Logo
      className="!h-12 w-auto"
      alt={storeConfig.theme?.logo?.alt || storeConfig.name}
      logoSrcLight={storeConfig.theme?.logo?.srcLight || storeConfig.theme?.logo?.src}
      logoSrcDark={storeConfig.theme?.logo?.srcDark}
    />
  );

  // Default theme toggle
  const displayThemeToggle = themeToggle !== undefined ? themeToggle : <ThemeToggle />;

  // Default desktop navigation
  const displayDesktopNavigation =
    desktopNavigation !== undefined ? (
      desktopNavigation
    ) : (
      <>
        <MegaMenu
          label="Picture Frames"
          isActive={
            isActive("/picture-frames") ||
            isActive("/frames/") ||
            isActive("/diploma-certificate-frames") ||
            isActive("/puzzle-frames") ||
            pathname.includes("/specialty/record")
          }
        >
          <PictureFramesMegaMenu />
        </MegaMenu>

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
          <ShadowboxMegaMenu />
        </MegaMenu>

        <Button
          variant={isActive("/canvas-frames") ? "secondary" : "ghost"}
          asChild
          className="min-h-11"
          data-testid="link-nav-canvas-frames"
        >
          <Link href="/canvas-frames">Canvas Frames</Link>
        </Button>

        <MegaMenu
          label="Components"
          isActive={isActive("/components") || isActive("/mat-board-guide")}
        >
          <ComponentsMegaMenu />
        </MegaMenu>

        <Button
          variant={isActive("/learn") ? "secondary" : "ghost"}
          asChild
          className="min-h-11"
          data-testid="link-nav-learn"
        >
          <Link href="/learn">Learn</Link>
        </Button>

        <Button
          variant={isActive("/contact") ? "secondary" : "ghost"}
          asChild
          className="min-h-11"
          data-testid="link-nav-contact"
        >
          <Link href="/contact">Contact</Link>
        </Button>
      </>
    );

  // Default search bar
  const displaySearchBar = searchBar !== undefined ? searchBar : <SearchBar />;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Default mobile navigation; inject onNavigate so custom menus close the sheet (e.g. store-b)
  const displayMobileNavigation =
    mobileNavigation !== undefined ? (
      isValidElement<{ onNavigate?: () => void }>(mobileNavigation) ? (
        cloneElement(mobileNavigation, {
          onNavigate: () => {
            const props = mobileNavigation.props as { onNavigate?: () => void };
            props.onNavigate?.();
            closeMobileMenu();
          },
        })
      ) : (
        mobileNavigation
      )
    ) : (
      <MobileNavigation onNavigate={closeMobileMenu} />
    );

  // Default cart click handler: use callback if provided, else navigate to cart page
  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    }
    // If no callback, the cart button is wrapped in Link below so navigation is handled by Next.js
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background" role="banner">
      {showUtilityBar && (phone || email) && (
        <div className="border-b bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex items-center justify-end gap-4 text-sm">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-utility-phone"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">{phone}</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-utility-email"
                >
                  <Mail className="h-4 w-4" />
                  <span>{email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            className="hover-elevate active-elevate-2 px-3 py-1 -ml-3 rounded-md flex-shrink-0"
            data-testid="link-home"
            aria-label={`${storeConfig.name} home`}
          >
            {displayLogo}
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1 flex-shrink-0"
            aria-label="Main navigation"
          >
            {displayDesktopNavigation}
          </nav>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md">{displaySearchBar}</div>

          <div className="flex items-center gap-2" role="toolbar" aria-label="User actions">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  data-testid="button-mobile-menu"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[340px] sm:w-[380px] overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                {displayMobileNavigation}
              </SheetContent>
            </Sheet>

            {onCartClick ? (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-11 w-11 lg:h-10 lg:w-10"
                data-testid="button-cart"
                aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} items` : ""}`}
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                {cartCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-cart-count"
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            ) : (
              <Link
                href="/cart"
                className="relative inline-flex h-11 w-11 lg:h-10 lg:w-10 items-center justify-center rounded-md border border-transparent hover-elevate active-elevate-2"
                data-testid="button-cart"
                aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} items` : ""}`}
              >
                <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                {cartCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-cart-count"
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>
            )}

            {displayThemeToggle}
          </div>
        </div>
      </div>
    </header>
  );
}
