import type { ContentCollectionItem } from "@nuxt/content";
import { queryCollection } from "@nuxt/content/server";

export type SearchResult = {
  title: string;
  description?: string;
  path: string;
  body?: string;
  excerpt?: string;
};

export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event).q as string;

    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      // Search through all markdown files in the content collection
      const results = (await queryCollection(event, "content")
        .where("path", "LIKE", "/docs/%")
        .all()) as ContentCollectionItem[];

      const queryLower = query.toLowerCase().trim();
      const matched: SearchResult[] = [];

      for (const item of results as any[]) {
        const title = item.title?.toLowerCase() || "";
        const description = item.description?.toLowerCase() || "";
        const bodyContent = item.rawbody?.toLowerCase() || "";
        const path = item.path?.toLowerCase() || "";

        // Check if query matches title, description, bodyContent, or path
        if (
          title.includes(queryLower)
          || description.includes(queryLower)
          || bodyContent.includes(queryLower)
          || path.includes(queryLower)
        ) {
          // Extract excerpt from rawbody if available
          let excerpt: string | undefined;
          if (item.rawbody) {
            const bodyLower = item.rawbody.toLowerCase();
            const index = bodyLower.indexOf(queryLower);
            if (index !== -1) {
              const start = Math.max(0, index - 50);
              const end = Math.min(
                item.rawbody.length,
                index + query.length + 50,
              );
              excerpt = item.rawbody.slice(start, end);
              if (start > 0) {
                excerpt = `...${excerpt}`;
              }
              if (end < item.rawbody.length) {
                excerpt = `${excerpt}...`;
              }
            }
          }

          matched.push({
            title: item.title || "",
            description: item.description,
            path: item.path || "",
            body: item.rawbody,
            excerpt,
          });
        }
      }

      // Sort by relevance (title matches first, then description, then body)
      matched.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(queryLower);
        const bTitleMatch = b.title.toLowerCase().includes(queryLower);
        if (aTitleMatch && !bTitleMatch) {
          return -1;
        }
        if (!aTitleMatch && bTitleMatch) {
          return 1;
        }

        const aDescMatch = a.description?.toLowerCase().includes(queryLower);
        const bDescMatch = b.description?.toLowerCase().includes(queryLower);
        if (aDescMatch && !bDescMatch) {
          return -1;
        }
        if (!aDescMatch && bDescMatch) {
          return 1;
        }

        return 0;
      });

      return matched.slice(0, 20); // Limit to 20 results
    }
    catch (error) {
      console.error("Search error:", error);
      return [];
    }
  },
  {
    maxAge: 60 * 60, // 1 hour
    name: "search",
    getKey: (event) => {
      const query = getQuery(event).q;
      return query ? `q:${query}` : "default";
    },
  },
);
