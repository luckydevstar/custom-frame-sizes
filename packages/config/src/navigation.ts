/**
 * Navigation Configuration
 *
 * Site navigation structure and menu items configuration.
 * This configuration is used by the Navigation component and other navigation-related components.
 *
 * @packageDocumentation
 */

/**
 * Navigation item with optional nested children
 */
export interface NavItem {
  /**
   * Display label for the navigation item
   */
  label: string;

  /**
   * URL path for the navigation link
   */
  href: string;

  /**
   * Optional icon identifier (string name of icon from icon library)
   * Note: Icon component resolution is handled by the consuming application
   */
  icon?: string;

  /**
   * Optional test ID for testing purposes
   */
  testId?: string;

  /**
   * Optional badge text to display on the navigation item
   */
  badge?: string;

  /**
   * Optional nested navigation items (for dropdowns/mega menus)
   */
  children?: NavItem[];
}

/**
 * Navigation section containing a group of related navigation items
 */
export interface NavSection {
  /**
   * Unique identifier for the section
   */
  id: string;

  /**
   * Display label for the section
   */
  label: string;

  /**
   * Icon identifier for the section
   */
  icon: string;

  /**
   * Navigation items in this section
   */
  items: NavItem[];
}

/**
 * Navigation configuration structure
 * Organized by main navigation categories
 */
export interface NavigationConfig {
  /**
   * Products section - main product categories
   */
  products: NavSection;

  /**
   * Design Tools section - interactive frame designers
   */
  designTools: NavSection;

  /**
   * Resources section - guides, help, policies
   */
  resources: NavSection;

  /**
   * Company section - about, reviews, business info
   */
  company: NavSection;
}

/**
 * Default navigation configuration
 * This is the base configuration that can be overridden per store
 */
export const defaultNavigationConfig: NavigationConfig = {
  products: {
    id: "products",
    label: "Products",
    icon: "Frame",
    items: [
      {
        label: "Picture Frames",
        href: "/picture-frames",
        icon: "Frame",
        testId: "link-mobile-picture-frames",
        children: [
          {
            label: "Shop by Color",
            href: "/frames/colors",
            icon: "Palette",
            testId: "link-mobile-frames-by-color",
          },
          {
            label: "Shop by Size",
            href: "/frames/sizes",
            icon: "Ruler",
            testId: "link-mobile-frames-by-size",
          },
        ],
      },
      {
        label: "Shadowboxes",
        href: "/shadowbox-frames",
        icon: "Box",
        testId: "link-mobile-shadowboxes",
        children: [
          {
            label: "Browse by Color",
            href: "/shadowbox-frames/colors",
            icon: "Palette",
            testId: "link-mobile-shadowboxes-by-color",
          },
          {
            label: "Currency Frames",
            href: "/currency-frames",
            icon: "Banknote",
            testId: "link-mobile-currency-frames",
          },
          {
            label: "Hockey Puck Frames",
            href: "/hockey-puck-frame-designer",
            icon: "Circle",
            testId: "link-mobile-hockey-puck-frames",
          },
          {
            label: "Jersey Frames",
            href: "/jersey-frames",
            icon: "Shirt",
            testId: "link-mobile-jersey-frames",
          },
          {
            label: "Military Frames",
            href: "/military-frames",
            icon: "Award",
            testId: "link-mobile-military-frames",
          },
          {
            label: "Wedding Bouquet Frames",
            href: "/bouquet-frames",
            icon: "Flower2",
            testId: "link-mobile-bouquet-frames",
          },
          {
            label: "Stamp Frames",
            href: "/stamp-frames",
            icon: "PostageStamp",
            testId: "link-mobile-stamp-frames",
          },
        ],
      },
      {
        label: "Canvas Float Frames",
        href: "/canvas-frames",
        icon: "Image",
        testId: "link-mobile-canvas-frames",
      },
      {
        label: "Framing Components",
        href: "/components",
        icon: "Package",
        testId: "link-mobile-components",
      },
    ],
  },
  designTools: {
    id: "designTools",
    label: "Design Tools",
    icon: "Paintbrush",
    items: [
      {
        label: "Picture Frame Designer",
        href: "/picture-frames",
        icon: "Frame",
        testId: "link-mobile-tool-picture-frames",
      },
      {
        label: "Shadowbox Designer",
        href: "/shadowbox",
        icon: "Box",
        testId: "link-mobile-tool-shadowbox",
      },
      {
        label: "Canvas Frame Designer",
        href: "/canvas-frames",
        icon: "Image",
        testId: "link-mobile-tool-canvas",
      },
    ],
  },
  resources: {
    id: "resources",
    label: "Resources",
    icon: "BookOpen",
    items: [
      {
        label: "How to Measure",
        href: "/how-to-measure",
        testId: "link-mobile-how-to-measure",
      },
      {
        label: "Mat Board Guide",
        href: "/mat-board-guide",
        testId: "link-mobile-mat-board-guide",
      },
      {
        label: "Glazing Guide",
        href: "/glazing-guide",
        testId: "link-mobile-glazing-guide",
      },
      {
        label: "FAQ",
        href: "/faq",
        icon: "HelpCircle",
        testId: "link-mobile-faq",
      },
      {
        label: "Contact Us",
        href: "/contact",
        testId: "link-mobile-contact",
      },
      {
        label: "Shipping Policy",
        href: "/shipping-policy",
        testId: "link-mobile-shipping",
      },
      {
        label: "Returns & Exchanges",
        href: "/returns-exchanges",
        testId: "link-mobile-returns",
      },
    ],
  },
  company: {
    id: "company",
    label: "Company",
    icon: "Building2",
    items: [
      {
        label: "About Us",
        href: "/about",
        testId: "link-mobile-about",
      },
      {
        label: "Reviews",
        href: "/reviews",
        testId: "link-mobile-reviews",
      },
      {
        label: "Business Services",
        href: "/business",
        testId: "link-mobile-business",
      },
    ],
  },
};

/**
 * Showcase frames navigation items
 * Special featured frame types displayed in navigation
 */
export const showcaseFrames: NavItem[] = [
  {
    label: "Preserved Bouquet Frames",
    href: "/bouquet-frames",
    icon: "Flower2",
    testId: "link-mobile-showcase-bouquet-frames",
  },
  {
    label: "Record Album Frames",
    href: "/record-album-frames",
    icon: "Disc3",
    testId: "link-mobile-showcase-record-albums",
  },
  {
    label: "Jersey Display Frames",
    href: "/jersey-frames",
    icon: "Shirt",
    testId: "link-mobile-showcase-jersey-frames",
  },
  {
    label: "Military Shadow Boxes",
    href: "/military-frames",
    icon: "Award",
    testId: "link-mobile-showcase-military-frames",
  },
  {
    label: "Diploma & Certificate Frames",
    href: "/diploma-certificate-frames",
    icon: "GraduationCap",
    testId: "link-mobile-showcase-diploma-frames",
  },
  {
    label: "Certificate Frames",
    href: "/certificate-frames",
    icon: "Award",
    testId: "link-mobile-showcase-certificate-frames",
  },
  {
    label: "Newspaper Frames",
    href: "/newspaper-frames",
    icon: "Newspaper",
    testId: "link-mobile-showcase-newspaper-frames",
  },
  {
    label: "Playbill Frames",
    href: "/playbill-frames",
    icon: "Theater",
    testId: "link-mobile-showcase-playbill-frames",
  },
  {
    label: "Puzzle Frames",
    href: "/puzzle-frames",
    icon: "Puzzle",
    testId: "link-mobile-showcase-puzzle-frames",
  },
  {
    label: "Photo Collage Frames",
    href: "/collage-frames",
    icon: "LayoutGrid",
    testId: "link-mobile-showcase-collage-frames",
  },
  {
    label: "Needlework Frames",
    href: "/specialty/needlework",
    icon: "Scissors",
    testId: "link-mobile-showcase-needlework-frames",
  },
  {
    label: "Stamp Frames",
    href: "/stamp-frames",
    icon: "PostageStamp",
    testId: "link-mobile-showcase-stamp-frames",
  },
];

/**
 * Get navigation section by ID
 */
export function getNavigationSection(
  config: NavigationConfig,
  sectionId: keyof NavigationConfig
): NavSection | undefined {
  return config[sectionId];
}

/**
 * Get all navigation items from a section
 */
export function getNavigationItems(section: NavSection): NavItem[] {
  return section.items;
}

/**
 * Find navigation item by href
 */
export function findNavigationItemByHref(
  config: NavigationConfig,
  href: string
): NavItem | undefined {
  for (const section of Object.values(config)) {
    const findInItems = (items: NavItem[]): NavItem | undefined => {
      for (const item of items) {
        if (item.href === href) {
          return item;
        }
        if (item.children) {
          const found = findInItems(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const found = findInItems(section.items);
    if (found) return found;
  }
  return undefined;
}
