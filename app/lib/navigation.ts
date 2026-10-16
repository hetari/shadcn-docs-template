export type NavigationItemType = "page" | "component" | "block" | "group";

/**
 * The one navigation item shape shared across the content tree, the
 * sidebar, the mobile nav, and the command palette. Previously split
 * between this file's `SidebarNavigationItem` and `useNavigation.ts`'s
 * `NavigationItem` — two names for the same near-identical structure.
 */
export type NavigationItem = {
  title: string;
  path: string;
  stem?: string;
  children?: NavigationItem[];
  page?: boolean;
  type?: NavigationItemType;
  new?: boolean;
  beta?: boolean;
  soon?: boolean;
  hide?: boolean;
  navigation?: {
    title?: string;
    icon?: string;
  };
  [key: string]: unknown;
};

export type NavItem = {
  name: string;
  href: string;
  icon?: string;
  new?: boolean;
  beta?: boolean;
  soon?: boolean;
  target?: string;
};

/**
 * Label displayed above the pinned section links in the sidebar and mobile menu.
 * Change this to "Quick Links", "Overview", "Featured", etc.
 * Default: "Sections"
 */
export const SIDEBAR_SECTIONS_LABEL = "Sections";

/**
 * Top-level section pills / quick links shown at the top of the sidebar and mobile menu.
 *
 * NOTE FOR TEMPLATE USERS:
 * By default, this is an empty array `[]` so your sidebar cleanly reflects your
 * `content/docs/` folder hierarchy without duplicating any links (e.g. Getting Started).
 *
 * If you want pinned quick links at the very top of your sidebar (e.g. "Interactive Demo",
 * "Quick Start", or external resources), add them here:
 *
 * @example
 * export const NAV_SECTIONS: NavItem[] = [
 *   { name: "Demo", href: "/docs/prose-demo", icon: "sparkles" },
 * ];
 */
export const NAV_SECTIONS: NavItem[] = [];

/**
 * Sidebar folder group titles (case-insensitive) that should never be rendered in the sidebar.
 * Use this to hide entire content folders from the sidebar navigation.
 *
 * @example
 * export const SIDEBAR_EXCLUDED_SECTIONS: string[] = ["archive", "drafts"];
 */
export const SIDEBAR_EXCLUDED_SECTIONS: string[] = [];

/**
 * Individual page paths that should be hidden from the sidebar tree.
 * Use this to hide specific pages without deleting their markdown files.
 * Alternatively, you can add `hide: true` in the page's YAML frontmatter.
 *
 * @example
 * export const SIDEBAR_EXCLUDED_PAGES: string[] = ["/docs/internal-page"];
 */
export const SIDEBAR_EXCLUDED_PAGES: string[] = [];

/**
 * Unified sidebar configuration.
 */
export const SIDEBAR_CONFIG = {
  /** Label shown above pinned quick links */
  sectionsLabel: SIDEBAR_SECTIONS_LABEL,
  /** Pinned quick links at top of sidebar */
  sections: NAV_SECTIONS,
  /** Folder groups to exclude from the sidebar (case-insensitive) */
  excludedSections: SIDEBAR_EXCLUDED_SECTIONS,
  /** Specific page paths to exclude from the sidebar */
  excludedPages: SIDEBAR_EXCLUDED_PAGES,
  /**
   * If true, pages specified in `sections` will automatically be excluded
   * from the folder groups below to avoid duplicate links.
   */
  autoExcludeSectionsFromGroups: true,
};

/**
 * Top-level/main site navigation items primarily used in the site header.
 * Each item follows the NavItem structure with a display name and href.
 */
export const MAIN_NAVIGATION: NavItem[] = [
  {
    href: "/docs/getting-started/introduction",
    name: "Docs",
  },
  {
    href: "/docs/components",
    name: "Components",
  },
];
