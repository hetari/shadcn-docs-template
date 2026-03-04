<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "~/lib/utils";

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
        'relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-medium *:[figure]:first:mt-0 [&>.steps]:mt-6',
        props.class,
      )
    "
  >
    <slot />
  </TabsContent>
</template>
