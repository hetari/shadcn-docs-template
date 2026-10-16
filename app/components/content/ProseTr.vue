<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <tr :class="cn('m-0', props.class)">
    <slot />
  </tr>
</template>

<style scoped>
tr {
  border-bottom-width: 1px;
}
tr:last-child {
  border-bottom-width: 0;
}
</style>
