# Changelog

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
