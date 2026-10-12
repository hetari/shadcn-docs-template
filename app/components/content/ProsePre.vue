<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { getIconForLanguageExtension } from "@/components/Icons";
import { cn } from "~/lib/utils";

const props = defineProps<{
  code: string;
  language: string;
  filename?: string;
  highlights?: number[];
  meta?: string;
  class?: HTMLAttributes["class"];
  unwrap?: boolean;
}>();

// Move regex to module scope to avoid re-compilation on every call
const TITLE_REGEX = /title="([^"]+)"/;

const npmBlock = ["npm install", "npm create", "npm run", "npx"];
const isNpmCommand = computed(() => npmBlock.some(s => props.code.startsWith(s)));
const isShowingLineNumber = computed(() => props.meta?.includes("showLineNumbers"));

const title = computed(() => props.filename || props.meta?.match(TITLE_REGEX)?.[1]);

const lang = computed(() => props.language.replace("language-", ""));
const IconExtension = computed(() => {
  return getIconForLanguageExtension(lang.value);
});

const highlighter = await getShikiHighlighter();
const highlighted = highlighter.highlight(props.code.trimEnd(), {
  lang: lang.value,
  transformers: [
    {
      name: "stripe-wrapper",
      root(node) {
        const pre = node.children.find(child => child.type === "element" && child.tagName === "pre");
        if (pre?.type === "element") {
          const code = pre.children.find(
            child => child.type === "element" && child.tagName === "code",
          );
          if (code?.type === "element") {
            node.children = code.children;
          }
        }
      },
    },
    {
      name: "modify-lines",
      line(node) {
        node.properties.class = undefined;
        node.properties["data-line"] = "";
      },
    },
    {
      name: "highlight-line-inline",
      line(node, line, ..._a) {
        if (props.highlights?.includes(line))
          node.properties["data-highlighted-line"] = "";
      },
      // TODO: implement `data-highlighted-chars`
      tokens(_tokens) {},
    },
  ],
});

const codeAttributes = computed(() =>
  isShowingLineNumber.value
    ? {
        "data-line-numbers": "",
        "data-line-numbers-max-digits": 2,
      }
    : undefined,
);
</script>

<template>
  <pre
    v-if="unwrap"
    :class="
      cn(
        `no-scrollbar min-w-0 overflow-x-auto bg-transparent! py-3.5 outline-none`,
        props.class,
      )
    "
    :data-language="lang"
  ><code v-bind="codeAttributes" v-html="highlighted" /></pre>
  <figure v-else data-pretty-code-figure>
    <pre
      v-if="isNpmCommand"
      :class="
        cn(
          `no-scrollbar min-w-0 overflow-x-auto py-3.5 outline-none`,
          props.class,
        )
      "
    ><CodeBlockCommand :code /></pre>

    <template v-else-if="title">
      <figcaption
        data-pretty-code-title
        :data-language="lang"
        class="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:opacity-70"
      >
        <component :is="IconExtension" v-if="IconExtension" />
        {{ title }}
      </figcaption>
      <pre
        :data-language="lang"
        :class="
          cn(
            `no-scrollbar min-w-0 overflow-x-auto py-3.5 outline-none`,
            props.class,
          )
        "
      ><CopyButton :value="code" /><code v-bind="codeAttributes" v-html="highlighted" /></pre>
    </template>

    <pre
      v-else
      :data-language="lang"
      :class="
        cn(
          `no-scrollbar min-w-0 overflow-x-auto py-3.5 outline-none`,
          props.class,
        )
      "
    ><CopyButton :value="code" /><code v-bind="codeAttributes" v-html="highlighted" /></pre>
  </figure>
</template>

<style scoped>
pre {
  padding-left: 1rem;
  padding-right: 1rem;
}
pre:has([data-highlighted-line]),
pre:has([data-line-numbers]) {
  padding-left: 0;
  padding-right: 0;
}
pre:has([data-slot="tabs"]) {
  padding: 0;
}
</style>
