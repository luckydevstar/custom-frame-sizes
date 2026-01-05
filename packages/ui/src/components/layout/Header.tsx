/**
 * Header Component
 *
 * Layout component for site header with navigation, search, cart, and theme toggle.
 *
 * NOTE: This is a simplified version created for P1-012. The full Header component
 * has dependencies on navigation components, Logo, ThemeToggle, and config that will
 * be extracted in future tickets (P1-013, P1-024, etc.). This component will be
 * enhanced once those dependencies are available.
 *
 * For now, this component serves as a placeholder structure that can be extended
 * when navigation and config packages are extracted.
 */

import { Link } from "wouter";
import { ShoppingCart, Phone, Mail, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useState, type ReactNode } from "react";

export interface HeaderConfig {
  showUtilityBar?: boolean;
  phone?: string;
  email?: string;
}

export interface HeaderProps {
  /**
   * Configuration for header behavior and content
   */
  config?: HeaderConfig;

  /**
   * Cart item count (temporary - will be replaced with cart state)
   */
  cartCount?: number;

  /**
   * Logo component to display
   * TODO: Extract Logo component to UI package
   */
  logo?: ReactNode;

  /**
   * Theme toggle component
   * TODO: Extract ThemeToggle component to UI package
   */
  themeToggle?: ReactNode;

  /**
   * Desktop navigation content
   * TODO: Extract navigation components to UI package (P1-013)
   */
  desktopNavigation?: ReactNode;

  /**
   * Search bar component
   * TODO: Extract SearchBar component to UI package
   */
  searchBar?: ReactNode;

  /**
   * Mobile navigation content
   * TODO: Extract MobileNavigation component to UI package
   */
  mobileNavigation?: ReactNode;

  /**
   * Callback when cart button is clicked
   */
  onCartClick?: () => void;
}

const defaultConfig: HeaderConfig = {
  showUtilityBar: true,
  phone: "1 (888) 874-7156",
  email: "hello@CustomFrameSizes.com",
};

export function Header({
  config = defaultConfig,
  cartCount = 0,
  logo,
  themeToggle,
  desktopNavigation,
  searchBar,
  mobileNavigation,
  onCartClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headerConfig = { ...defaultConfig, ...config };

  return (
    <header className="sticky top-0 z-50 border-b bg-background" role="banner">
      {headerConfig.showUtilityBar && (
        <div className="border-b bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex items-center justify-end gap-4 text-sm">
              {headerConfig.phone && (
                <a
                  href={`tel:${headerConfig.phone}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-utility-phone"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">{headerConfig.phone}</span>
                </a>
              )}
              {headerConfig.email && (
                <a
                  href={`mailto:${headerConfig.email}`}
                  className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-utility-email"
                >
                  <Mail className="h-4 w-4" />
                  <span>{headerConfig.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {logo && (
            <Link
              href="/"
              className="hover-elevate active-elevate-2 px-3 py-1 -ml-3 rounded-md flex-shrink-0"
              data-testid="link-home"
              aria-label="Home"
            >
              {logo}
            </Link>
          )}

          {/* Desktop Navigation */}
          {desktopNavigation && (
            <nav
              className="hidden lg:flex items-center gap-1 flex-shrink-0"
              aria-label="Main navigation"
            >
              {desktopNavigation}
            </nav>
          )}

          {/* Desktop Search */}
          {searchBar && <div className="hidden lg:flex flex-1 max-w-md">{searchBar}</div>}

          <div className="flex items-center gap-2" role="toolbar" aria-label="User actions">
            {mobileNavigation && (
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
                  {mobileNavigation}
                </SheetContent>
              </Sheet>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative h-11 w-11 lg:h-10 lg:w-10"
              data-testid="button-cart"
              aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} items` : ""}`}
              onClick={onCartClick}
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

            {themeToggle}
          </div>
        </div>
      </div>
    </header>
  );
}
