---
"shadcn-docs-template": minor
---

### 🚀 Highlights

- **Nuxt Upgrade (`v4.6.1`)**: Upgraded Nuxt to `^4.6.1` and synchronized all project lockfile dependencies with the latest upstream fixes and improvements.
- **Typed `$fetch` Opt-In**: Enabled `experimental: { routeTypedFetch: true }` in `nuxt.config.ts` for automated end-to-end typed API routes.
- **Automated Nuxt Release Watcher**: Added scheduled workflow and script (`.github/workflows/check-nuxt-release.yml` and `.github/scripts/check-nuxt-release.sh`) to automatically monitor upstream Nuxt releases and open PRs.
- **Automated Release Pipeline**: Added direct GitHub Release workflow triggered on merge to `main` powered by Changesets.

### 🛠️ Refactoring & Improvements

- **Server Handlers Modernization**:
  - Migrated server API handlers (`server/api/search.get.ts`, `server/api/docs-version.get.ts`, `server/routes/raw/[...path].get.ts`) to use direct `nuxt/server` imports (`defineEventHandler`, `useRuntimeConfig`, `getQuery`, `getRouterParam`, `createError`) for forward-compatibility with Nuxt 4 & Nuxt 5.
  - Replaced Nitro-specific caching hooks with standard HTTP `Cache-Control` response headers directly on event handlers.
- **Tailwind CSS Polish**:
  - Replaced deprecated Tailwind CSS utility syntax (e.g. `border-border/40` and percentage opacity notations) across components, layouts, and pages.
- **OG Image Custom Template**:
  - Renamed template to `Custom.satori.vue` and updated `nuxt-og-image` dependency integration.
