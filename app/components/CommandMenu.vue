<script lang="ts" setup>
import { useIsMac } from "~/composables/useIsMac";

const isMac = useIsMac();
onKeyStroke("k", (event) => {
  if (isMac.value ? event.metaKey : event.ctrlKey) {
    event.preventDefault();
    // Open command menu logic here
    // eslint-disable-next-line no-alert
    alert("todo: Command menu opened!");
  }
});
</script>

<template>
  <Button
    class="relative h-8 w-full justify-start bg-surface pl-3 font-medium text-foreground shadow-none sm:pr-12 md:w-48 lg:w-56 xl:w-64 dark:bg-card"
    variant="secondary"
  >
    <span class="hidden lg:inline-flex">Search documentation...</span>
    <span class="inline-flex lg:hidden">Search...</span>
    <div class="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
      <KbdGroup>
        <Kbd class="border">{{ isMac ? '⌘' : 'Ctrl' }}</Kbd>
        <Kbd class="border">K</Kbd>
      </KbdGroup>
    </div>
  </Button>
</template>
