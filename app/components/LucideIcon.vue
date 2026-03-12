<script setup lang="ts">
import * as LucideIcons from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
  name: string;
  class?: string;
}>();

// Move regular expressions to module scope to avoid re-compilation on every render
const LUCIDE_PREFIX_RE = /^lucide:/;
const ICON_PREFIX_RE = /^icon-/;

const iconComponent = computed(() => {
  // Remove prefixes
  const cleanName = props.name.replace(LUCIDE_PREFIX_RE, "").replace(ICON_PREFIX_RE, "");

  // Convert kebab-case to PascalCase (e.g., 'house' -> 'House', 'arrow-left' -> 'ArrowLeft')
  const pascalName = cleanName
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  // Check for the icon in the LucideIcons object
  return (
    (LucideIcons as any)[pascalName]
    || (LucideIcons as any)[`${pascalName}Icon`]
    || null
  );
});
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" :class="props.class" />
</template>
