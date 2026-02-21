<script lang="ts" setup></script>

<template>
  <div
    class="relative z-10 flex min-h-svh flex-col bg-background"
    data-slot="layout"
  >
    <SiteHeader />
    <main class="flex flex-1 flex-col">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
