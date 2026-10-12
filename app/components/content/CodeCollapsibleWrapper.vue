<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const open = ref(false);
</script>

<template>
  <Collapsible v-model:open="open" :class="cn('group/collapsible relative md:-mx-1', props.class)">
    <CollapsibleTrigger as-child>
      <div class="absolute top-1.5 right-9 z-10 flex items-center">
        <Button variant="ghost" size="sm" class="h-7 rounded-md px-2 text-muted-foreground">
          {{ open ? 'Collapse' : 'Expand' }}
        </Button>
        <Separator orientation="vertical" class="mx-1.5 h-4!" />
      </div>
    </CollapsibleTrigger>

    <CollapsibleContent
      force-mount
      class="relative mt-6 overflow-hidden data-[state=closed]:max-h-64"
    >
      <slot />
    </CollapsibleContent>
    <CollapsibleTrigger
      v-show="!open"
      class="absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-linear-to-b from-code/70 to-code text-sm text-muted-foreground"
    >
      {{ open ? 'Collapse' : 'Expand' }}
    </CollapsibleTrigger>
  </Collapsible>
</template>

<style scoped>
:deep(> figure) {
  margin-top: 0;
}
@media (min-width: 768px) {
  :deep(> figure) {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
</style>
