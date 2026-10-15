<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  code: string;
  language: string;
  filename?: string;
  highlights?: number[];
  meta?: string;
  class?: HTMLAttributes["class"];
  unwrap?: boolean;
}>();

const TITLE_REGEX = /title="([^"]+)"/;

const npmBlock = ["npm install", "npm create", "npm run", "npx"];
const isNpmCommand = computed(() => npmBlock.some(s => props.code.startsWith(s)));
const isShowingLineNumber = computed(() => props.meta?.includes("showLineNumbers"));

const title = computed(() => props.filename || props.meta?.match(TITLE_REGEX)?.[1]);
</script>

<template>
  <CodeBlockCommand
    v-if="isNpmCommand"
    :code="code"
    :class="props.class"
  />
  <DocsCodeBlock
    v-else
    :code="code"
    :language="language"
    :title="title"
    :highlights="highlights"
    :line-numbers="isShowingLineNumber"
    :content-only="unwrap"
    :class="props.class"
  />
</template>
