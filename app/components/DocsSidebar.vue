<script setup lang="ts">
import type { NavigationItem } from "~/lib/navigation";
import { SIDEBAR_EXCLUDED_PAGES } from "~/lib/navigation";

const props = defineProps<{
  tree: NavigationItem;
}>();

const { path } = toRefs(useRoute());

const { rootPages, folderGroups } = useSidebarSections(() => props.tree);
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

      <!-- Sections (Root Pages natively ordered by Nuxt Content) -->
      <SidebarGroup v-if="rootPages.length > 0">
        <SidebarGroupLabel class="font-medium text-muted-foreground">
          Sections
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in rootPages" :key="item.path">
              <SidebarMenuButton
                as-child
                :is-active="item.path === path"
                class="
                  relative h-7.5 w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0
                  after:rounded-md data-[active=true]:bg-accent 3xl:fixed:w-full 3xl:fixed:max-w-48
                "
              >
                <NuxtLink :to="item.path" prefetch-on="interaction">
                  <span class="absolute inset-0 flex w-(--sidebar-width) bg-transparent" />
                  <LucideIcon
                    v-if="item.navigation?.icon"
                    :name="item.navigation.icon"
                    class="mr-2 size-4 shrink-0"
                  />
                  {{ item.title }}
                  <span
                    v-if="item.new"
                    class="size-2 items-center gap-1 rounded-md border-0 bg-green-500"
                  />
                  <span
                    v-else-if="item.beta"
                    class="size-2 items-center gap-1 rounded-md border-0 bg-orange-500"
                  />
                  <Badge
                    v-if="item.soon"
                    variant="secondary"
                    class="ms-auto h-4 px-1.5 text-[0.65rem] leading-none"
                  >
                    Soon
                  </Badge>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Folder Groups -->
      <SidebarGroup v-for="group in folderGroups" :key="group.title">
        <SidebarGroupLabel class="flex items-center gap-2 font-medium text-muted-foreground">
          {{ group.title }}
          <Badge
            v-if="group.soon"
            variant="secondary"
            class="h-4 px-1.5 text-[0.65rem] leading-none"
          >
            Soon
          </Badge>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="gap-0.5">
            <template
              v-for="childItem in (group.children || []).filter(
                (child: NavigationItem) =>
                  !child.hide && !SIDEBAR_EXCLUDED_PAGES.includes(child.path),
              )"
              :key="childItem.path"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  as-child
                  :is-active="childItem?.path === path"
                  class="
                    relative h-7.5 w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0
                    after:rounded-md data-[active=true]:bg-accent 3xl:fixed:w-full 3xl:fixed:max-w-48
                  "
                >
                  <NuxtLink :to="childItem?.path" prefetch-on="interaction">
                    <span class="absolute inset-0 flex w-(--sidebar-width) bg-transparent" />
                    <LucideIcon
                      v-if="childItem.navigation?.icon"
                      :name="childItem.navigation.icon"
                      class="mr-2 size-4 shrink-0"
                    />
                    {{ childItem.title }}
                    <span
                      v-if="childItem.new"
                      class="size-2 items-center gap-1 rounded-md border-0 bg-green-500"
                    />
                    <span
                      v-else-if="childItem.beta"
                      class="size-2 items-center gap-1 rounded-md border-0 bg-orange-500"
                    />
                    <Badge
                      v-if="childItem.soon"
                      variant="secondary"
                      class="ms-auto h-4 px-1.5 text-[0.65rem] leading-none"
                    >
                      Soon
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

<style scoped>
:deep([data-sidebar="menu-button"][data-active="true"]),
[data-sidebar="menu-button"][data-active="true"] {
  border-color: var(--accent);
}
</style>
