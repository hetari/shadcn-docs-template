<script lang="ts" setup>
import { siteConfig } from "~/lib/siteConfig";
import Skeleton from "./ui/skeleton/Skeleton.vue";

// Cross-reload cache to avoid GitHub unauthenticated rate limits (60 req/hr)
const CACHE_KEY = "github-stargazers-cache";
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

const cached = useLocalStorage<{ count: number; timestamp: number } | null>(
  CACHE_KEY,
  null,
);

const { data, error } = await useFetch<{
  stargazers_count: number;
}>(siteConfig.links.githubAPI, {
  key: "github-stargazers",
  lazy: true,
  getCachedData(key, nuxtApp) {
    const mem = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
    if (mem) {
      return mem;
    }
    if (
      import.meta.client
        && cached.value
        && Date.now() - cached.value.timestamp < CACHE_TTL_MS
    ) {
      return { stargazers_count: cached.value.count };
    }
  },
  onResponse({ response }) {
    if (response._data?.stargazers_count != null) {
      cached.value = {
        count: response._data.stargazers_count,
        timestamp: Date.now(),
      };
    }
  },
});

const starCount = computed<number | null>(() => {
  return data.value?.stargazers_count ?? cached.value?.count ?? null;
});

const stars = computed<string | null>(() => {
  const count = starCount.value;
  if (count !== 0 && !count) {
    return null;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toLocaleString();
});
</script>

<template>
  <Button as-child class="h-8 shadow-none" size="sm" variant="ghost">
    <NuxtLink
      :to="siteConfig.links.github"
      rel="noreferrer"
      target="_blank"
      prefetch-on="interaction"
    >
      <span class="sr-only">GitHub</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        color="currentColor"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M10 20.5675C6.57143 21.7248 3.71429 20.5675 2 17" />
        <path
          d="M10 22V18.7579C10 18.1596 10.1839 17.6396 10.4804 17.1699C10.6838 16.8476 10.5445 16.3904 10.1771 16.2894C7.13394 15.4528 5 14.1077 5 9.64606C5 8.48611 5.38005 7.39556 6.04811 6.4464C6.21437 6.21018 6.29749 6.09208 6.31748 5.9851C6.33746 5.87813 6.30272 5.73852 6.23322 5.45932C5.95038 4.32292 5.96871 3.11619 6.39322 2.02823C6.39322 2.02823 7.27042 1.74242 9.26698 2.98969C9.72282 3.27447 9.95075 3.41686 10.1515 3.44871C10.3522 3.48056 10.6206 3.41384 11.1573 3.28041C11.8913 3.09795 12.6476 3 13.5 3C14.3524 3 15.1087 3.09795 15.8427 3.28041C16.3794 3.41384 16.6478 3.48056 16.8485 3.44871C17.0493 3.41686 17.2772 3.27447 17.733 2.98969C19.7296 1.74242 20.6068 2.02823 20.6068 2.02823C21.0313 3.11619 21.0496 4.32292 20.7668 5.45932C20.6973 5.73852 20.6625 5.87813 20.6825 5.9851C20.7025 6.09207 20.7856 6.21019 20.9519 6.4464C21.6199 7.39556 22 8.48611 22 9.64606C22 14.1077 19.8661 15.4528 16.8229 16.2894C16.4555 16.3904 16.3162 16.8476 16.5196 17.1699C16.8161 17.6396 17 18.1596 17 18.7579V22"
        />
      </svg>
      <span
        v-if="stars"
        class="text-xs text-muted-foreground tabular-nums"
      >
        {{ stars }}
      </span>
      <span
        v-else-if="error"
        class="text-xs text-muted-foreground tabular-nums"
      >
        —
      </span>
      <Skeleton v-else class="h-4 w-8" />
    </NuxtLink>
  </Button>
</template>
