<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <th
    :class="
      cn(
        'px-4 py-2 font-bold',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>

<style scoped>
th {
  text-align: left;
}
th[align="center"] {
  text-align: center;
}
th[align="right"] {
  text-align: right;
}
</style>
