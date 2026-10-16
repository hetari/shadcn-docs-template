<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "cn";
import type { CodeBlockLineVariants, HighlightedToken } from "@/components/ui/code-block";
import { getIconForLanguageExtension } from "@/components/Icons";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
  CodeBlockToken,
  highlightCode,
  useHighlightedCode,
} from "@/components/ui/code-block";

const props = withDefaults(
  defineProps<{
    code: string;
    language: string;
    title?: string;
    highlights?: number[];
    lineNumbers?: boolean;
    class?: HTMLAttributes["class"];
    /** Inner content only (no border/header), for rare nested layouts. */
    contentOnly?: boolean;
    /** Flush layout under a component preview panel. */
    preview?: boolean;
  }>(),
  {
    lineNumbers: false,
    contentOnly: false,
    preview: false,
  },
);

const LANGUAGE_PREFIX_RE = /^language-/;

const lang = computed(() => props.language.replace(LANGUAGE_PREFIX_RE, ""));
const trimmedCode = computed(() => props.code.trimEnd());
const IconExtension = computed(() => getIconForLanguageExtension(lang.value));

const serverLines = await highlightCode(trimmedCode.value, lang.value);
const clientLines = useHighlightedCode(
  () => trimmedCode.value,
  () => lang.value,
);

function tokensAreHighlighted(line: HighlightedToken[]) {
  return line.some(token => token.htmlStyle);
}

const lines = computed(() => {
  const client = clientLines.value;
  if (client.some(tokensAreHighlighted))
    return client;
  if (serverLines)
    return serverLines;
  return client;
});

function lineVariant(index: number): CodeBlockLineVariants["variant"] {
  const lineNumber = index + 1;
  if (props.highlights?.includes(lineNumber))
    return "highlighted";
  return "default";
}

const contentClass = computed(() =>
  cn(
    props.preview && "max-h-100",
    props.contentOnly && "max-h-96 bg-transparent!",
    props.contentOnly && "[&]:border-0 [&]:bg-transparent [&]:shadow-none",
  ),
);

const rootClass = computed(() =>
  cn(
    "not-prose -mx-1 my-6 md:-mx-1",
    props.preview && "my-0 rounded-none rounded-b-lg border-x-0 border-t border-b-0",
    props.class,
  ),
);
</script>

<template>
  <template v-if="contentOnly">
    <CodeBlockContent :line-numbers="lineNumbers" :class="cn(contentClass, props.class)">
      <CodeBlockLine
        v-for="(line, index) in lines"
        :key="index"
        :variant="lineVariant(index)"
      >
        <CodeBlockToken v-for="(token, i) in line" :key="i" :token="token" />
      </CodeBlockLine>
    </CodeBlockContent>
  </template>

  <CodeBlock v-else data-docs-code :class="rootClass">
    <CodeBlockHeader v-if="title">
      <CodeBlockTitle class="flex items-center gap-2 font-mono font-normal">
        <component :is="IconExtension" v-if="IconExtension" class="size-4 opacity-70" />
        {{ title }}
      </CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton :value="trimmedCode" />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockActions v-else>
      <CodeBlockCopyButton :value="trimmedCode" />
    </CodeBlockActions>
    <CodeBlockContent :line-numbers="lineNumbers" :class="contentClass">
      <CodeBlockLine
        v-for="(line, index) in lines"
        :key="index"
        :variant="lineVariant(index)"
      >
        <CodeBlockToken v-for="(token, i) in line" :key="i" :token="token" />
      </CodeBlockLine>
    </CodeBlockContent>
  </CodeBlock>
</template>
