<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <ul :class="cn('my-6 ml-6 list-disc', props.class)">
    <slot />
  </ul>
</template>
