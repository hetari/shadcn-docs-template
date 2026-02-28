<script lang="ts" setup>
import { cn } from "~/lib/utils";

const { level = 3 } = defineProps<{
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}>();

const levelClass = {
  1: "[&>h1]:step",
  2: "[&>h2]:step",
  3: "[&>h3]:step",
  4: "[&>h4]:step",
  5: "[&>h5]:step",
  6: "[&>h6]:step",
};
</script>

<template>
  <div
    :class="cn(
      // eslint-disable-next-line better-tailwindcss/no-unknown-classes
      'steps',
      levelClass[level],
    )"

    class="mb-12 ml-4 border-l pl-8 [counter-reset:step]"
  >
    <slot />
  </div>
</template>
