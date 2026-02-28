<script lang="ts" setup>
defineProps<{
  variant: string;
}>();
</script>

<template>
  <Tabs
    v-model="useConfig().config.value.installationType"
    class="relative mt-6 w-full"
  >
    <slot />
  </Tabs>
</template>
