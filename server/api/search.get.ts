import type { SearchResult } from "~~/shared/types/search";
import { queryCollection } from "@nuxt/content/server";
import { rankSearchResult } from "~~/shared/utils/search-rank";
import { defineEventHandler, getQuery } from "nuxt/server";

export default defineEventHandler(async (event) => {
  // Set cache headers directly in the handler (CDN/Browser)
  event.res.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");

  const query = (getQuery(event).q as string) || "";

  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    // Search through all markdown files in the content collection
    const results = await queryCollection(event as any, "content")
      .select("title", "description", "path", "rawbody")
      .where("path", "LIKE", "/docs/%")
      .all();

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
            const end = Math.min(item.rawbody.length, index + query.length + 50);
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

    // Rank with the same scorer the command palette uses for its other groups
    matched.sort((a, b) => rankSearchResult(b, query) - rankSearchResult(a, query));

    return matched.slice(0, 20); // Limit to 20 results
  }
  catch {
    return [];
  }
});
