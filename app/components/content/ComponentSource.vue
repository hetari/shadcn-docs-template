<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";
import { fixImport } from "~/lib/fix-import";

const props = withDefaults(
  defineProps<{
    name?: string;
    title?: string;
    language?: string;
    collapsible?: boolean;
    class?: HTMLAttributes["class"];
    chromeLessOnMobile?: boolean;
  }>(),
  {
    language: "vue",
    collapsible: true,
  },
);

const rawDemos = import.meta.glob("../demo/**/*.{vue,ts}", {
  query: "?raw",
  import: "default",
});

const rawUi = import.meta.glob("../ui/**/*.{vue,ts}", {
  query: "?raw",
  import: "default",
});

async function getCode() {
  if (!props.name)
    return "";

  const nameL = props.name.toLowerCase();

  const loader
    = rawUi[`../ui/${props.name}.${props.language}`]
      || rawUi[`../ui/${nameL}/${props.name}.${props.language}`]
      || rawDemos[`../demo/${props.name}.${props.language}`]
      || rawDemos[`../demo/${props.name}Demo.${props.language}`];

  if (loader) {
    const rawCode = await loader();
    return fixImport(rawCode as string);
  }
  return "";
}

const code = await getCode();
</script>

<template>
  <DocsCodeBlock
    v-if="!collapsible"
    :class="cn('relative', props.class)"
    :code
    :language
    :title
    line-numbers
    preview
  />
  <CodeCollapsibleWrapper v-else :class="props.class">
    <DocsCodeBlock :code :language :title line-numbers preview />
  </CodeCollapsibleWrapper>
</template>
