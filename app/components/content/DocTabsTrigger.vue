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
          rounded-none border-0 border-b-2 border-transparent px-1 text-xs text-muted-foreground hover:text-primary data-[state=active]:border-primary
          data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-primary
          dark:data-[state=active]:bg-transparent
        `,
        props.class,
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>
