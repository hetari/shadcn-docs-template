<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <Kbd :class="cn(props.class)">
    <slot />
  </Kbd>
</template>
