<script setup lang="ts">
const { data } = await useNavigation();

const list = computed(() =>
  (data.value?.[0]?.children.find(item => item.title === "Components")?.children ?? [])
    .filter(item => item.path !== "/docs/components"),
);
</script>

<template>
  <div
    class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20"
  >
    <NuxtLink
      v-for="component in list"
      :key="component.title"
      :to="component.path"
      class="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"
    >
      {{ component.title }}

      <span v-if="component.new" class="flex size-2 rounded-full bg-green-500" title="New" />
      <span
        v-else-if="component.beta"
        class="flex size-2 rounded-full bg-orange-500"
        title="Beta"
      />
      <Badge
        v-else-if="component.soon"
        variant="secondary"
        class="flex h-4 items-center justify-center rounded-sm bg-secondary/50 px-1.5 text-[0.6rem] font-semibold tracking-wider uppercase"
      >
        Soon
      </Badge>
    </NuxtLink>
  </div>
</template>
