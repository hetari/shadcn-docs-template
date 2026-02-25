<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { fixImport } from "~/lib/fix-import";
import { cn } from "~/lib/utils";

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
    = rawDemos[`../demo/${props.name}.${props.language}`]
      || rawUi[`../ui/${nameL}/${props.name}.${props.language}`]
      || rawUi[`../ui/${props.name}.${props.language}`];

  if (loader) {
    const rawCode = await loader();
    return fixImport(rawCode as string);
  }
  return "";
}

const code = await getCode();
</script>

<template>
  <div v-if="!collapsible" :class="cn('relative', props.class)">
    <ProsePre :code :language meta="'showLineNumbers'" :title />
  </div>
  <CodeCollapsibleWrapper v-else :class="props.class">
    <figure data-pretty-code-figure="" class="[&>pre]:max-h-96">
      <figcaption
        v-if="title"
        data-pretty-code-title=""
        class="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
        :data-language="language"
      >
        <!-- <component :is="getIconForLanguageExtension(language)" /> -->
        <!-- {{ title }} -->
      </figcaption>
      <CopyButton :value="code" />
      <div>
        <ProsePre unwrap :code :language meta="'showLineNumbers'" :title />
      </div>
    </figure>
  </CodeCollapsibleWrapper>
</template>
