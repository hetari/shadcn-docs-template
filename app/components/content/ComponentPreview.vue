<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  name: string;
  align?: "center" | "start" | "end";
  description?: string;
  hideCode?: boolean;
  class?: HTMLAttributes["class"];
}>();

// Map all demo and ui components
const demos = import.meta.glob("../demo/**/*.vue");
const ui = import.meta.glob("../ui/**/*.vue");

function getLoader() {
  const nameL = props.name.toLowerCase();
  return (
    demos[`../demo/${props.name}.vue`]
    || demos[`../demo/${props.name}/index.vue`]
    || ui[`../ui/${nameL}/${props.name}.vue`]
    || ui[`../ui/${props.name}.vue`]
  );
}

const loader = getLoader();
const Component = loader ? defineAsyncComponent(loader as any) : null;
</script>

<template>
  <p
    v-if="!Component"
    class="rounded-md border p-4 text-sm text-muted-foreground"
  >
    Component
    <code
      class="relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
    >
      {{ name }}
    </code>
    not found in <code class="font-mono text-xs">components/demo</code> or
    <code class="font-mono text-xs">components/ui</code>.
  </p>

  <ComponentPreviewTabs
    v-else
    :class="props.class"
    :align
    :hide-code
    :component="Component"
  >
    <ComponentSource v-if="!hideCode" :name :collapsible="false" />
  </ComponentPreviewTabs>
</template>
