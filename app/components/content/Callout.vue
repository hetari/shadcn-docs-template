<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  BugIcon,
  CheckCircleIcon,
  InfoIcon,
  LightbulbIcon,
  NotebookPen,
} from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type CalloutType = keyof typeof typeMap;

const props = withDefaults(
  defineProps<{
    type?: CalloutType;
    title?: string;
    class?: HTMLAttributes["class"];
    icon?: boolean;
  }>(),
  {
    type: "default",
    icon: true,
  },
);

const typeMap = {
  default: {
    icon: InfoIcon,
    classes:
      "bg-slate-500/10 text-slate-900 dark:bg-slate-400/10 dark:text-slate-100 border border-slate-500/20 dark:border-slate-400/20",
    iconClass: "text-slate-600 dark:text-slate-400",
  },
  info: {
    icon: InfoIcon,
    classes:
      "bg-blue-500/10 text-blue-900 dark:bg-blue-400/10 dark:text-blue-100 border border-blue-500/20 dark:border-blue-400/20",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangleIcon,
    classes:
      "bg-amber-500/10 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100 border border-amber-500/20 dark:border-amber-400/20",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  error: {
    icon: AlertCircleIcon,
    classes:
      "bg-red-500/10 text-red-900 dark:bg-red-400/10 dark:text-red-100 border border-red-500/20 dark:border-red-400/20",
    iconClass: "text-red-600 dark:text-red-400",
  },
  success: {
    icon: CheckCircleIcon,
    classes:
      "bg-emerald-500/10 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100 border border-emerald-500/20 dark:border-emerald-400/20",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  note: {
    icon: NotebookPen,
    classes:
      "bg-purple-500/10 text-purple-900 dark:bg-purple-400/10 dark:text-purple-100 border border-purple-500/20 dark:border-purple-400/20",
    iconClass: "text-purple-600 dark:text-purple-400",
  },
  tip: {
    icon: LightbulbIcon,
    classes:
      "bg-emerald-500/10 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100 border border-emerald-500/20 dark:border-emerald-400/20",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  danger: {
    icon: BugIcon,
    classes:
      "bg-rose-500/10 text-rose-900 dark:bg-rose-400/10 dark:text-rose-100 border border-rose-500/20 dark:border-rose-400/20",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
} as const;

const selected = typeMap[props.type];
const IconComponent = selected.icon;
</script>

<template>
  <Alert
    :class="
      cn(
        'my-6 flex w-auto items-start gap-3 rounded-md p-4 transition-colors',
        selected.classes,
        props.class,
      )
    "
  >
    <component
      :is="IconComponent"
      v-if="props.icon && IconComponent"
      :class="cn('size-5 shrink-0 translate-y-0.5', selected.iconClass)"
    />
    <div class="flex-1">
      <AlertTitle
        v-if="props.title"
        class="mb-1 leading-tight font-semibold tracking-tight"
      >
        {{ props.title }}
      </AlertTitle>
      <AlertDescription class="text-sm/relaxed text-foreground/90 select-text">
        <slot />
      </AlertDescription>
    </div>
  </Alert>
</template>
