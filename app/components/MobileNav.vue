<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { NavigationItem } from "@/lib/navigation";
import { SIDEBAR_EXCLUDED_PAGES } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  tree: NavigationItem[]; // relaxed typing to avoid missing property errors in template
  items: { name: string; href: string }[];
}>();

const router = useRouter();
const open = ref(false);

const { rootPages, folderGroups } = useSidebarSections(() => props.tree?.[0]);

function handleNavigate(path: string) {
  router.push(path);
  open.value = false;
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        :class="
          cn(
            `extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 bg-transparent p-0! hover:bg-transparent focus-visible:ring-0`,
            props.class,
          )
        "
      >
        <div class="relative flex h-8 w-4 items-center justify-center">
          <div class="relative size-4">
            <span
              :class="
                cn(
                  'absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100',
                  open ? 'top-[0.4rem] -rotate-45' : 'top-1',
                )
              "
            />
            <span
              :class="
                cn(
                  'absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100',
                  open ? 'top-[0.4rem] rotate-45' : 'top-2.5',
                )
              "
            />
          </div>
          <span class="sr-only">Toggle Menu</span>
        </div>
        <span class="flex h-8 items-center text-lg leading-none font-medium"> Menu </span>
      </Button>
    </PopoverTrigger>

    <PopoverContent
      class="
        no-scrollbar h-(--reka-popper-available-height) w-(--reka-popper-available-width) overflow-y-auto rounded-none border-none bg-background/90 p-0 shadow-none backdrop-blur-sm
        duration-100
      "
      align="start"
      side="bottom"
      :align-offset="-16"
      :side-offset="14"
    >
      <div class="flex flex-col gap-12 overflow-auto p-6">
        <div class="flex flex-col gap-4">
          <div class="text-sm font-medium text-muted-foreground">
            Menu
          </div>
          <div class="flex flex-col gap-3">
            <NuxtLink
              prefetch-on="interaction"
              class="text-2xl font-medium"
              to="/"
              @click="handleNavigate('/')"
            >
              Home
            </NuxtLink>
            <NuxtLink
              v-for="(item, index) in items"
              :key="index"
              prefetch-on="interaction"
              class="text-2xl font-medium"
              :to="item.href"
              @click="handleNavigate(item.href)"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Sections (Root Pages) -->
        <div v-if="rootPages.length" class="flex flex-col gap-4">
          <div class="text-sm font-medium text-muted-foreground">
            Sections
          </div>
          <div class="flex flex-col gap-3">
            <NuxtLink
              v-for="item in rootPages"
              :key="item.path"
              prefetch-on="interaction"
              :to="item.path"
              class="flex items-center gap-2 text-2xl font-medium"
              @click="handleNavigate(item.path)"
            >
              <LucideIcon
                v-if="item.navigation?.icon"
                :name="item.navigation.icon"
                class="size-6 shrink-0"
              />
              {{ item.title }}
              <span
                v-if="item.new"
                class="size-2 rounded-full border-0 bg-green-500"
              />
              <span
                v-else-if="item.beta"
                class="size-2 rounded-full border-0 bg-orange-500"
              />
              <Badge
                v-if="item.soon"
                variant="secondary"
                class="
                  ms-auto flex h-5 items-center justify-center rounded-md border bg-secondary/50 px-2 text-[0.7rem] font-semibold tracking-widest text-muted-foreground uppercase
                "
              >
                Soon
              </Badge>
            </NuxtLink>
          </div>
        </div>

        <!-- Folder Groups -->
        <div class="flex flex-col gap-8">
          <template v-for="group in folderGroups" :key="group.title">
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {{ group.title }}
                <Badge
                  v-if="group.soon"
                  variant="secondary"
                  class="flex h-4 items-center justify-center rounded-sm bg-secondary/50 px-1.5 text-[0.6rem] font-semibold tracking-wider uppercase"
                >
                  Soon
                </Badge>
              </div>
              <div class="flex flex-col gap-3">
                <NuxtLink
                  v-for="item in (group.children || []).filter(
                    child => !child.hide && !SIDEBAR_EXCLUDED_PAGES.includes(child.path),
                  )"
                  :key="item.path"
                  prefetch-on="interaction"
                  class="flex items-center gap-2 text-2xl font-medium"
                  :to="item.path"
                  @click="handleNavigate(item.path)"
                >
                  <LucideIcon
                    v-if="item.navigation?.icon"
                    :name="item.navigation.icon"
                    class="size-6 shrink-0"
                  />
                  {{ item.title }}
                  <span
                    v-if="item.new"
                    class="size-2 rounded-full border-0 bg-green-500"
                  />
                  <span
                    v-else-if="item.beta"
                    class="size-2 rounded-full border-0 bg-orange-500"
                  />
                  <Badge
                    v-if="item.soon"
                    variant="secondary"
                    class="
                      ms-auto flex h-5 items-center justify-center rounded-md border bg-secondary/50 px-2 text-[0.7rem] font-semibold tracking-widest text-muted-foreground
                      uppercase
                    "
                  >
                    Soon
                  </Badge>
                </NuxtLink>
              </div>
            </div>
          </template>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
