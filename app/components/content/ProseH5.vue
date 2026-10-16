<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <h5
    :class="
      cn('mt-8 scroll-m-28 text-base font-medium tracking-tight', props.class)
    "
  >
    <slot />
  </h5>
</template>
