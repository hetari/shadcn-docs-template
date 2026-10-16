// Current version of Nuxt Content has limitation to render grouped content, thus required manual mapping
// https://github.com/nuxt/content/issues/3119
import type { ContentNavigationItem } from "@nuxt/content";
import type { NavigationItem } from "~/lib/navigation";

// const EXCLUDED_PARENT_TITLE = ["Components", "Registry", "Forms", "MCP Server"];

// TODO: Find a better heuristic to determine item type
function navigationItemType(
  item: ContentNavigationItem,
  parent: ContentNavigationItem | null,
): "component" | "block" | "group" | "page" {
  if (parent) {
    if (parent.title === "Components") {
      return "component";
    }
    if (parent.title === "Blocks") {
      return "block";
    }
  }
  if (item.children && item.children.length > 0) {
    return "group";
  }
  return "page";
}

function mapWithType(
  item: ContentNavigationItem,
  parent: ContentNavigationItem | null,
): NavigationItem {
  const isLeaf = !item.children || item.children.length === 0;
  const customTitle = (item.navigation as { title?: string } | undefined)?.title;
  return {
    ...item,
    title: isLeaf && customTitle ? customTitle : item.title,
    type: navigationItemType(item, parent),
    children: item.children?.map(child => mapWithType(child, item)),
  };
}

export async function useNavigation() {
  const { data } = useAsyncData(
    "navigation",
    () => {
      return queryCollectionNavigation("content", [
        "navigation",
        "new",
        "soon",
        "hide",
        "beta",
      ]);
    },
    {
      default: () => [],
      transform: (data2) => {
        const doc = data2.find(i => i.stem === "docs");
        if (!doc)
          return [];

        const allDocs = doc.children?.map(i => mapWithType(i, doc)) ?? [];

        return [
          {
            ...doc,
            children: allDocs,
          },
        ];
      },
    },
  );

  return {
    data,
  };
}
