# Changelog

## 1.1.0

### Minor Changes

- 0077fc5: ### 🚀 Highlights
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

## 1.0.1

### Patch Changes

- update the template libs

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-03-04

### Added

- **Version-Based Search Caching**: Implemented a deterministic caching strategy for documentation search.
  - Server-side `docsVersion` hash derived from content.
  - Layered caching: 24-hour persistence with instant client-side invalidation upon content updates.
  - Short-lived server-side cache partitioned by version.
- **Enhanced Search API**:
  - Full-text retrieval including `rawbody` content.
  - Smart excerpt generation and debounced querying (300ms).
- **DocTabs Component**: A premium tabbed interface for documentation with support for deep MDC nesting (`::::` syntax).
- **Initial Template Release**:
  - Nuxt 4 & Tailwind CSS 4 foundation.
  - shadcn-vue component integration.
  - Fully responsive documentation layout with dark mode support.
  - Automatic navigation tree generation from content.

### Fixed

- **MDC Nesting**: Resolved layout and rendering issues when using nested MDC components by enforcing correct colon hierarchies.
- **Search Staleness**: Eliminated the risk of outdated search results by moving from fixed-time TTL to content-hash invalidation.
- **Component Injection**: Fixed `TabsRootContext` injection errors in custom content components.

### Performance

- Optimized search result filtering and excerpt extraction.
- Reduced server load through intelligent client-side result memoization.
