<script setup lang="ts">
import { showMcpDocs } from "~/lib/flag";
import {
  NAV_SECTIONS,
  SIDEBAR_EXCLUDED_PAGES,
  SIDEBAR_EXCLUDED_SECTIONS,
} from "~/lib/navigation";

type SidebarNavigationItem = {
  title: string;
  path: string;
  stem?: string;
  children?: SidebarNavigationItem[];
  new?: boolean;
  navigation?: {
    icon?: string;
  };
};

defineProps<{
  tree: SidebarNavigationItem;
}>();

const { path } = toRefs(useRoute());

const filteredSections = computed(() =>
  NAV_SECTIONS.filter(
    section => showMcpDocs || !section.href.includes("/mcp"),
  ),
);

function isActive(href: string) {
  return href === "/docs" ? path.value === href : path.value.startsWith(href);
}
</script>

<template>
  <Sidebar
    class="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)-4rem)] bg-transparent lg:flex"
    collapsible="none"
  >
    <SidebarContent class="no-scrollbar overflow-x-hidden px-2">
      <div
        class="sticky -top-1 z-10 h-8 shrink-0 bg-linear-to-b from-background via-background/80 to-background/50 blur-xs"
      />
      <SidebarGroup>
        <SidebarGroupLabel class="font-medium text-muted-foreground">
          Sections
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="{ name, href } in filteredSections"
              :key="name"
            >
              <SidebarMenuButton
                as-child
                :is-active="isActive(href)"
                class="
                  relative h-7.5 w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0
                  after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent 3xl:fixed:w-full 3xl:fixed:max-w-48
                "
              >
                <NuxtLink :to="href" prefetch-on="interaction">
                  <span
                    class="absolute inset-0 flex w-(--sidebar-width) bg-transparent"
                  />
                  {{ name }}
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup
        v-for="item in (tree.children || []).filter(
          (section) =>
            !SIDEBAR_EXCLUDED_SECTIONS.includes(
              section.title.toLocaleLowerCase(),
            ),
        )"
        :key="item.title"
      >
        <SidebarGroupLabel class="font-medium text-muted-foreground">
          {{ item.title }}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="gap-0.5">
            <template
              v-for="childItem in (item?.children || []).filter(
                (child) => !SIDEBAR_EXCLUDED_PAGES.includes(child.path),
              )"
              :key="childItem.path"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  as-child
                  :is-active="childItem?.path === path"
                  class="
                    relative h-7.5 w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0
                    after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent 3xl:fixed:w-full 3xl:fixed:max-w-48
                  "
                >
                  <NuxtLink :to="childItem?.path" prefetch-on="interaction">
                    <span
                      class="absolute inset-0 flex w-(--sidebar-width) bg-transparent"
                    />
                    <LucideIcon
                      v-if="childItem.navigation?.icon"
                      :name="childItem.navigation.icon"
                      class="mr-2 size-4 shrink-0"
                    />
                    {{ childItem.title }}
                    <Badge
                      v-if="childItem.new"
                      variant="secondary"
                      class="inline-flex h-5 items-center gap-1 rounded-md border-0 bg-green-500/10 px-2 text-[0.65rem] font-semibold tracking-wide text-green-600 uppercase"
                    >
                      <span class="size-1.5 rounded-full bg-green-500" />
                      New
                    </Badge>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <div
        class="sticky -bottom-1 z-10 h-16 shrink-0 bg-linear-to-t from-background via-background/80 to-background/50 blur-xs"
      />
    </SidebarContent>
  </Sidebar>
</template>
