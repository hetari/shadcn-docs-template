<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <TabsList :class="cn('justify-start gap-4 rounded-none bg-transparent px-0', props.class)">
    <slot />
  </TabsList>
</template>
