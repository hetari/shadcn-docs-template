<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-slot="code-block-actions"
    :class="cn(
      `
        -my-1 ms-auto -me-1.5 flex shrink-0 items-center gap-1 [[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:inset-e-2 [[data-slot=code-block]>&]:top-2
        [[data-slot=code-block]>&]:z-10 [[data-slot=code-block]>&]:m-0 [[data-slot=code-block]>&]:opacity-0 [[data-slot=code-block]>&]:transition-opacity
        [[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 [[data-slot=code-block]>&]:group-hover/code-block:opacity-100
        group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:inset-e-1.5 group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:top-1.5
        [[data-slot=code-block]>&]:pointer-coarse:opacity-100 [[data-slot=code-block]>&]:*:[button]:bg-background [[data-slot=code-block]>&]:*:[button]:ring-1
        [[data-slot=code-block]>&]:*:[button]:ring-foreground/10
      `,
      props.class,
    )"
  >
    <slot />
  </div>
</template>
