import { refDebounced, useMemoize } from "@vueuse/core";

export type SearchResult = {
  title: string;
  description?: string;
  path: string;
  body?: string;
  excerpt?: string;
};

export function useSearch() {
  const searchQuery = ref("");
  const debouncedQuery = refDebounced(searchQuery, 300);
  const isSearching = ref(false);
  const searchResults = ref<SearchResult[]>([]);

  // Memoized search request
  const memoizedSearch = useMemoize(
    async (query: string): Promise<SearchResult[]> => {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const results = await $fetch<SearchResult[]>("/api/search", {
        query: { q: query },
      });

      return results || [];
    },
  );

  async function performSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      isSearching.value = true;
      // This will use cache for the same query string
      const results = await memoizedSearch(query);
      return results;
    }
    catch (error) {
      console.error("Search error:", error);
      return [];
    }
    finally {
      isSearching.value = false;
    }
  }

  // Watch debounced query and perform search
  watch(debouncedQuery, async (newQuery) => {
    if (newQuery && newQuery.trim().length >= 2) {
      searchResults.value = await performSearch(newQuery);
    }
    else {
      searchResults.value = [];
    }
  });

  return {
    searchQuery,
    debouncedQuery,
    isSearching,
    searchResults,
    performSearch,
    // expose cache controls if you want them:
    reloadSearch: memoizedSearch.load,
    deleteSearchCache: memoizedSearch.delete,
    clearSearchCache: memoizedSearch.clear,
  };
}
