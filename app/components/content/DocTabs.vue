<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "~/lib/utils";

const props = defineProps<{
  defaultValue?: string;
  modelValue?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <Tabs
    :default-value="defaultValue"
    :class="cn('relative mt-6 w-full', props.class)"
  >
    <slot />
  </Tabs>
</template>
