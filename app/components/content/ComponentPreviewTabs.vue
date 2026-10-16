<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue";
import { cn } from "cn";

const props = withDefaults(
  defineProps<{
    component: string | Component;
    class?: HTMLAttributes["class"];
    hideCode?: boolean;
    chromeLessOnMobile?: boolean;
    align?: "center" | "start" | "end";
  }>(),
  {
    align: "center",
  },
);
// const tab = ref<"preview" | "code">("preview");
</script>

<template>
  <div :class="cn('group relative mt-4 mb-12 flex flex-col gap-2 rounded-lg border', props.class)">
    <div data-slot="preview">
      <!-- preview -->
      <div
        :data-align="align"
        :class="
          cn(
            'flex w-full justify-center',
            props.align === 'end' ? 'items-end' : props.align === 'start' ? 'items-start' : 'items-center',
            chromeLessOnMobile ? 'sm:p-10' : 'h-112.5 p-10',
          )
        "
      >
        <component :is="component" />
      </div>
      <div
        v-if="!hideCode"
        data-slot="code"
        class="overflow-hidden **:data-docs-code:m-0! **:data-docs-code:rounded-t-none **:data-docs-code:border-t"
      >
        <slot />
        <!-- {{source}} -->
      </div>
    </div>
  </div>
</template>
