import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as CodeBlock } from "./CodeBlock.vue";
export { default as CodeBlockActions } from "./CodeBlockActions.vue";
export { default as CodeBlockContent } from "./CodeBlockContent.vue";
export { default as CodeBlockCopyButton } from "./CodeBlockCopyButton.vue";
export { default as CodeBlockFooter } from "./CodeBlockFooter.vue";
export { default as CodeBlockHeader } from "./CodeBlockHeader.vue";
export { default as CodeBlockLine } from "./CodeBlockLine.vue";
export { default as CodeBlockTitle } from "./CodeBlockTitle.vue";
export { default as CodeBlockToken } from "./CodeBlockToken.vue";
export { highlightCode, loadHighlighter } from "./highlighter";
export type { HighlightedToken } from "./highlighter";
export { useHighlightedCode } from "./useHighlightedCode";

export const codeBlockVariants = cva(
  `
    group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-lg text-sm has-[>[data-slot=code-block-content]:focus-visible]:ring-3
    has-[>[data-slot=code-block-content]:focus-visible]:ring-ring/50 data-[size=sm]:text-xs
  `,
  {
    variants: {
      variant: {
        default: "border border-input text-foreground has-[>[data-slot=code-block-content]:focus-visible]:border-ring dark:bg-input/30",
        destructive: "border border-destructive/30 text-destructive dark:border-destructive/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export type CodeBlockVariants = VariantProps<typeof codeBlockVariants>;

export const codeBlockLineVariants = cva(
  `
    relative -mx-3 block min-h-lh px-3 group-data-[size=sm]/code-block:-mx-2.5 group-data-[size=sm]/code-block:px-2.5 before:min-w-6 before:text-end before:text-muted-foreground
    after:absolute after:inset-s-1 after:top-0 after:text-muted-foreground after:select-none in-data-numbered:col-span-2 in-data-numbered:grid in-data-numbered:grid-cols-subgrid
    in-data-numbered:gap-x-3 in-data-numbered:[counter-increment:line] in-data-numbered:before:content-[counter(line)] in-data-numbered:before:select-none
    in-data-numbered:supports-[content:counter(line)/'']:before:content-[counter(line)/'']
  `,
  {
    variants: {
      variant: {
        default: "",
        added: "bg-muted after:content-['+']",
        removed: "bg-destructive/10 after:text-destructive after:content-['−']",
        highlighted: "bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export type CodeBlockLineVariants = VariantProps<typeof codeBlockLineVariants>;
