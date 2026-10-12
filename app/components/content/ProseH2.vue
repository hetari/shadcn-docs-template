<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

// The classes below add spacing between elements when they are used together. For example, when a
// ProseH2 is followed by a ProseP, the ProseP gets mt-4. When followed by ProseSteps, it gets mt-0.
</script>

<template>
  <h2
    :class="
      cn(
        'scroll-m-28 font-heading text-xl font-medium tracking-tight lg:mt-16',
        props.class,
      )
    "
  >
    <slot />
  </h2>
</template>

<style scoped>
h2 {
  margin-top: 2.5rem;
}
h2:first-child {
  margin-top: 0;
}
:deep(+ .steps) {
  margin-top: 0 !important;
}
:deep(+ .steps > h3) {
  margin-top: 1rem !important;
}
:deep(+ h3) {
  margin-top: 1.5rem !important;
}
:deep(+ p) {
  margin-top: 1rem !important;
}
</style>
