<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Check, Copy } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { ButtonVariants } from "./ui/button";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const props = withDefaults(
  defineProps<{
    value?: string;
    class?: HTMLAttributes["class"];
    variant?: ButtonVariants["variant"];
    tooltip?: string;
  }>(),
  {
    value: "",
    variant: "ghost",
    tooltip: "Copy to Clipboard",
  },
);
const { value } = toRefs(props);

const { copy, copied } = useClipboard({ source: value });
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          data-slot="copy-button"
          size="icon"
          :variant="variant"
          :class="
            cn(
              'absolute top-3 right-2 z-10 size-7 bg-code hover:opacity-100 focus-visible:opacity-100',
              props.class,
            )
          "
          v-bind="$attrs"
          @click="copy()"
        >
          <span class="sr-only">Copy</span>
          <Check v-if="copied" /><Copy v-else />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {{ copied ? "Copied" : tooltip }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
