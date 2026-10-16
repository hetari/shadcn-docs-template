<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";
import { TabsContent } from "@/components/ui/tabs";

const props = defineProps<{
  value: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <TabsContent
    :value="props.value"
    :class="
      cn(
        'relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-medium',
        props.class,
      )
    "
  >
    <slot />
  </TabsContent>
</template>

<style scoped>
:deep(> figure:first-child) {
  margin-top: 0;
}
:deep(> .steps) {
  margin-top: 1.5rem;
}
</style>
