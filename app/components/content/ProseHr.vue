<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <hr :class="cn('my-4 md:my-8', props.class)">
</template>
