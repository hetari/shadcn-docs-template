<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <h3
    :class="
      cn(
        'mt-12 scroll-m-28 font-heading text-lg font-medium tracking-tight',
        props.class,
      )
    "
  >
    <slot />
  </h3>
</template>

<style scoped>
:deep(+ p) {
  margin-top: 1rem !important;
}
:deep(code) {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
</style>
