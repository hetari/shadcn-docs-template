<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { TabsTrigger } from "@/components/ui/tabs";
import { cn } from "~/lib/utils";

const props = defineProps<{
  value: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <TabsTrigger
    :value="props.value"
    :class="
      cn(
        `
          rounded-none border-0 border-b-2 border-transparent px-1 text-xs text-muted-foreground hover:text-primary data-[state=active]:bg-transparent
          data-[state=active]:shadow-none
        `,
        props.class,
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>

<style scoped>
:deep([data-slot="tabs-trigger"][data-state="active"]),
[data-slot="tabs-trigger"][data-state="active"] {
  border-bottom-color: var(--primary);
  color: var(--foreground);
}
</style>
