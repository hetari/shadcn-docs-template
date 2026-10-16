import type { NavigationItem } from "~/lib/navigation";
import { showMcpDocs } from "~/lib/flag";
import {
  NAV_SECTIONS,
  SIDEBAR_CONFIG,
  SIDEBAR_EXCLUDED_PAGES,
  SIDEBAR_EXCLUDED_SECTIONS,
  SIDEBAR_SECTIONS_LABEL,
} from "~/lib/navigation";

/**
 * Recursively searches a navigation tree to find an item by exact path.
 */
function findItemByPath(items: NavigationItem[], path: string): NavigationItem | undefined {
  for (const item of items) {
    if (item.path === path) {
      return item;
    }
    if (item.children?.length) {
      const found = findItemByPath(item.children, path);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * Shapes a content navigation root into the two groups every nav surface
 * renders: `rootPages` (the top-level section pills, in `NAV_SECTIONS`
 * order) and `folderGroups` (the content folders below them).
 *
 * `DocsSidebar.vue` (desktop) and `MobileNav.vue` (mobile) both call this
 * instead of each defining their own near-identical computeds, so the two
 * surfaces stay perfectly in sync.
 *
 * `root` takes a getter so each caller can normalize its own tree shape
 * (a single root node vs. an array whose first element is the root)
 * without duplicating that logic here.
 */
export function useSidebarSections(root: () => NavigationItem | undefined) {
  const sectionsLabel = computed(
    () => SIDEBAR_CONFIG.sectionsLabel ?? SIDEBAR_SECTIONS_LABEL ?? "Sections",
  );

  const filteredSections = computed(() =>
    (SIDEBAR_CONFIG.sections ?? NAV_SECTIONS).filter(
      section => showMcpDocs || !section.href.includes("/mcp"),
    ),
  );

  const rootPages = computed<NavigationItem[]>(() => {
    const rootItem = root();
    const children = rootItem?.children ?? [];

    return filteredSections.value.map((section) => {
      const matched = findItemByPath(children, section.href);
      return {
        ...matched,
        path: section.href,
        title: section.name || matched?.title || "",
        navigation: {
          ...matched?.navigation,
          ...(section.icon ? { icon: section.icon } : {}),
        },
        new: section.new ?? matched?.new,
        beta: section.beta ?? matched?.beta,
        soon: section.soon ?? matched?.soon,
      } as NavigationItem;
    });
  });

  const excludedPaths = computed(() => {
    const paths = new Set<string>(SIDEBAR_CONFIG.excludedPages ?? SIDEBAR_EXCLUDED_PAGES);
    if (SIDEBAR_CONFIG.autoExcludeSectionsFromGroups) {
      for (const section of rootPages.value) {
        paths.add(section.path);
      }
    }
    return paths;
  });

  const folderGroups = computed<NavigationItem[]>(() => {
    const rootItem = root();
    const children = rootItem?.children ?? [];
    const excludedSections = (
      SIDEBAR_CONFIG.excludedSections ?? SIDEBAR_EXCLUDED_SECTIONS
    ).map(s => s.toLowerCase());

    return children
      .filter(
        item =>
          (item.children?.length || item.soon)
          && !excludedSections.includes(item.title.toLocaleLowerCase()),
      )
      .map((group) => {
        if (!group.children?.length) {
          return group;
        }

        const visibleChildren = group.children.filter(
          child => !child.hide && !excludedPaths.value.has(child.path),
        );

        return {
          ...group,
          children: visibleChildren,
        };
      })
      .filter(group => (group.children && group.children.length > 0) || group.soon);
  });

  return {
    sectionsLabel,
    rootPages,
    folderGroups,
  };
}
