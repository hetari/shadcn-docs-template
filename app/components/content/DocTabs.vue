<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";
import { Tabs } from "@/components/ui/tabs";

const props = defineProps<{
  defaultValue?: string;
  modelValue?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <Tabs
    :default-value="defaultValue"
    :model-value="modelValue"
    :class="cn('relative mt-6 w-full', props.class)"
  >
    <slot />
  </Tabs>
</template>
