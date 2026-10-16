<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { CopyIcon } from "@lucide/vue";
import { cn } from "cn";
import type { ButtonVariants } from "./ui/button";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  class?: HTMLAttributes["class"];
  size?: ButtonVariants["size"];
}>();
</script>

<template>
  <Drawer>
    <DrawerTrigger as-child>
      <Button :class="cn('sm:hidden', props.class)" v-bind="$attrs">
        Copy Code
      </Button>
    </DrawerTrigger>
    <DrawerContent class="h-auto">
      <DrawerHeader>
        <DrawerTitle class="capitalize">
          Theme Code
        </DrawerTitle>
        <DrawerDescription>
          Copy and paste the following code into your CSS file.
        </DrawerDescription>
      </DrawerHeader>
      <slot>
        <p class="p-4 text-center text-sm text-muted-foreground">
          No code to display.
        </p>
      </slot>
    </DrawerContent>
  </Drawer>
  <Dialog>
    <DialogTrigger as-child>
      <Button
        :data-size="props.size"
        :class="cn('group/button hidden sm:flex', props.class)"
        :size="props.size"
        v-bind="$attrs"
      >
        <CopyIcon />
        <span class="group-data-[size=icon-sm]/button:sr-only">
          Copy Code
        </span>
      </Button>
    </DialogTrigger>
    <DialogContent
      class="rounded-xl border-none bg-clip-padding shadow-2xl ring-4 ring-border/80 outline-none md:max-w-2xl"
    >
      <DialogHeader>
        <DialogTitle class="capitalize">
          Theme Code
        </DialogTitle>
        <DialogDescription>
          Copy and paste the following code into your CSS file.
        </DialogDescription>
      </DialogHeader>
      <slot>
        <p class="p-4 text-center text-sm text-muted-foreground">
          No code to display.
        </p>
      </slot>
    </DialogContent>
  </Dialog>
</template>
