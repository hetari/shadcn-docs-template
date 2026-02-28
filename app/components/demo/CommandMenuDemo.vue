<script setup lang="ts">
const tree = {
  children: [
    {
      title: "Getting Started",
      type: "group",
      children: [
        {
          title: "Introduction",
          path: "/docs/getting-started/introduction",
          type: "page",
        },
        {
          title: "Installation",
          path: "/docs/getting-started/installation",
          type: "page",
        },
      ],
    },
  ],
};

const navItems = [
  { href: "/docs", label: "Docs" },
];
</script>

<template>
  <div class="w-full max-w-md">
    <CommandMenu :tree="tree" :nav-items="navItems" />
  </div>
</template>
