<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <h1
    :class="
      cn(
        'mt-8 scroll-m-28 font-heading text-3xl font-bold tracking-tight',
        props.class,
      )
    "
  >
    <slot />
  </h1>
</template>
