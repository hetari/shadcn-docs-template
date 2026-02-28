<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <h3
    :class="cn(
      'mt-8 scroll-m-32 font-heading text-xl font-medium tracking-tight', props.class,
    )"
  >
    <slot mdc-unwrap="p" />
  </h3>
</template>
