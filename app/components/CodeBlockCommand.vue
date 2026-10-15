<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { TerminalIcon } from "@lucide/vue";
import { cn } from "cn";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockToken,
  useHighlightedCode,
} from "@/components/ui/code-block";

const props = defineProps<{
  code: string;
  class?: HTMLAttributes["class"];
}>();

const tabs = computed(() => {
  const data = { pnpm: "", npm: "", yarn: "", bun: "" };

  if (props.code.includes("npm install")) {
    data.npm = props.code;
    data.yarn = props.code.replaceAll("npm install", "yarn add");
    data.pnpm = props.code.replaceAll("npm install", "pnpm add");
    data.bun = props.code.replaceAll("npm install", "bun add");
  }
  else if (props.code.includes("npx create-")) {
    data.npm = props.code;
    data.yarn = props.code.replaceAll("npx create-", "yarn create");
    data.pnpm = props.code.replaceAll("npx create-", "pnpm create");
    data.bun = props.code.replaceAll("npx", "bunx --bun");
  }
  else if (props.code.includes("npm create")) {
    data.npm = props.code;
    data.yarn = props.code.replaceAll("npm create", "yarn create");
    data.pnpm = props.code.replaceAll("npm create", "pnpm create");
    data.bun = props.code.replaceAll("npm create", "bun create");
  }
  else if (props.code.includes("npx")) {
    data.npm = props.code;
    data.yarn = props.code.replaceAll("npx", "yarn dlx");
    data.pnpm = props.code.replaceAll("npx", "pnpm dlx");
    data.bun = props.code.replaceAll("npx", "bunx --bun");
  }
  else if (props.code.includes("npm run")) {
    data.npm = props.code;
    data.yarn = props.code.replaceAll("npm run", "yarn");
    data.pnpm = props.code.replaceAll("npm run", "pnpm");
    data.bun = props.code.replaceAll("npm run", "bun");
  }

  return data;
});

const { config } = useConfig();

const activeCommand = computed(
  () => tabs.value[config.value.packageManager as keyof typeof tabs.value] ?? props.code,
);

const lines = useHighlightedCode(() => activeCommand.value, "bash");
</script>

<template>
  <CodeBlock
    data-docs-code :class="cn(
      'not-prose -mx-1 my-6 md:-mx-1', props.class)"
  >
    <CodeBlockHeader class="gap-0 border-b border-border/50 px-0 pt-0">
      <div class="flex min-w-0 flex-1 items-center gap-2 px-3 py-1">
        <div class="flex size-4 shrink-0 items-center justify-center rounded-[1px] bg-foreground opacity-70">
          <TerminalIcon class="size-3 text-background" />
        </div>
        <Tabs v-model="config.packageManager" class="min-w-0 flex-1 gap-0">
          <TabsList class="h-auto rounded-none bg-transparent p-0">
            <TabsTrigger
              v-for="key in Object.keys(tabs)"
              :key="key"
              :value="key"
              class="h-7 pt-1.5 data-[state=active]:border-input data-[state=active]:bg-accent data-[state=active]:shadow-none"
            >
              {{ key }}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <CodeBlockActions class="static! me-2 opacity-100!">
        <CodeBlockCopyButton :value="activeCommand" />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent class="mt-0">
      <CodeBlockLine v-for="(line, index) in lines" :key="index">
        <CodeBlockToken v-for="(token, i) in line" :key="i" :token="token" />
      </CodeBlockLine>
    </CodeBlockContent>
  </CodeBlock>
</template>
