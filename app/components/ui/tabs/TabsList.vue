<script setup lang="ts">
import type { TabsListProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { cn } from "cn";
import { TabsList } from "reka-ui";

const props = defineProps<TabsListProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    v-bind="delegatedProps"
    :class="cn(
      'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-0.75 text-muted-foreground',
      props.class,
    )"
  >
    <slot />
  </TabsList>
</template>
