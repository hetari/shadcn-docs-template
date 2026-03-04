import type { UseMemoizeCache } from "@vueuse/core";
import { refDebounced, useMemoize } from "@vueuse/core";

export type SearchResult = {
  title: string;
  description?: string;
  path: string;
  body?: string;
  excerpt?: string;
};

const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;
class TtlCache<Key, Value> implements UseMemoizeCache<Key, Value> {
  private cache = new Map<Key, { value: Value; timestamp: number }>();
  private ttl: number;

  constructor(ttl: number) {
    this.ttl = ttl;
  }

  get(key: Key): Value | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: Key, value: Value): void {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  has(key: Key): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: Key): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export function useSearch() {
  const searchQuery = ref("");
  const debouncedQuery = refDebounced(searchQuery, 300);
  const isSearching = ref(false);
  const searchResults = ref<SearchResult[]>([]);
  const currentDocsVersion = ref<string | null>(null);

  // Memoized search request with 24h TTL cache
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
    {
      cache: new TtlCache<string, Promise<SearchResult[]>>(TWENTY_FOUR_HOURS),
    },
  );

  async function performSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      isSearching.value = true;

      // Check for version update before searching
      try {
        const { version } = await $fetch<{ version: string }>(
          "/api/docs-version",
        );
        if (currentDocsVersion.value && currentDocsVersion.value !== version) {
          memoizedSearch.clear();
        }
        currentDocsVersion.value = version;
      }
      catch (e) {
        console.error("Failed to fetch docs version", e);
      }

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
